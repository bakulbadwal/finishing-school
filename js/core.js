/* Finishing School — the math.
   Pure functions only; every number on the page comes from here, and the
   acceptance tests (ACCEPTANCE.md) call these directly through window.FS.
   Units: GB = 1e9 bytes. Logs are natural logs. */
(function () {
  "use strict";

  var GB = 1e9;

  /* ---------- Models: shapes copied from each model's Hub config.json (read 2026-09-25) ----------
     All three tie input and output embeddings (tie_word_embeddings: true), so the
     embedding matrix is counted once. */
  var MODELS = [
    { id: "smollm2-135m", name: "SmolLM2-135M", hub: "HuggingFaceTB/SmolLM2-135M-Instruct",
      hidden: 576, inter: 1536, layers: 30, heads: 9, kvHeads: 3, headDim: 64, vocab: 49152, qkNorm: false },
    { id: "qwen3-1.7b", name: "Qwen3-1.7B", hub: "Qwen/Qwen3-1.7B",
      hidden: 2048, inter: 6144, layers: 28, heads: 16, kvHeads: 8, headDim: 128, vocab: 151936, qkNorm: true },
    { id: "smollm3-3b", name: "SmolLM3-3B", hub: "HuggingFaceTB/SmolLM3-3B",
      hidden: 2048, inter: 11008, layers: 36, heads: 16, kvHeads: 4, headDim: 128, vocab: 128256, qkNorm: false }
  ];
  function model(id) { return MODELS.filter(function (m) { return m.id === id; })[0]; }

  /* The seven linear projections in each transformer block, as [in, out]. */
  function projections(m) {
    var q = m.heads * m.headDim, kv = m.kvHeads * m.headDim, h = m.hidden, I = m.inter;
    return {
      q: [h, q], k: [h, kv], v: [h, kv], o: [q, h],
      gate: [h, I], up: [h, I], down: [I, h]
    };
  }
  var ALL_MODULES = ["q", "k", "v", "o", "gate", "up", "down"];

  /* Total parameters: 7 projections + 2 RMSNorms per block (+ q/k norms on Qwen3),
     the embedding once (tied), and the final norm. */
  function paramCount(m) {
    var p = projections(m), perLayer = 0;
    ALL_MODULES.forEach(function (k) { perLayer += p[k][0] * p[k][1]; });
    perLayer += 2 * m.hidden + (m.qkNorm ? 2 * m.headDim : 0);
    return perLayer * m.layers + m.vocab * m.hidden + m.hidden;
  }

  /* ---------- 1. Chat templates (token-level teaching render) ----------
     Two dialects, simplified to their skeleton. The SmolLM3 rule that matters:
     a /think or /no_think flag in the system prompt overrides enable_thinking. */
  function thinkingMode(opts) {
    var sys = opts.system || "";
    if (/\/no_think\b/.test(sys)) return { on: false, why: "system flag /no_think (flags beat the keyword)" };
    if (/\/think\b/.test(sys)) return { on: true, why: "system flag /think (flags beat the keyword)" };
    if (opts.enableThinking === false) return { on: false, why: "enable_thinking=False keyword" };
    return { on: true, why: "default: SmolLM3 thinks unless told not to" };
  }

  /* ---------- 2. SFT loss: next-token cross-entropy over the tokens that count ----------
     tokens: [{p: prob the model gave the correct next token, role: "prompt"|"answer"}]
     completionOnly: true masks prompt tokens out of the loss (label -100). */
  function sftLoss(tokens, completionOnly) {
    var sum = 0, n = 0;
    tokens.forEach(function (t) {
      if (completionOnly && t.role !== "answer") return;
      sum += -Math.log(t.p); n++;
    });
    return { loss: n ? sum / n : 0, counted: n, total: tokens.length };
  }

  /* ---------- 3. LoRA: trainable parameters and training memory ---------- */
  function loraParams(m, r, modules) {
    var p = projections(m), perLayer = 0;
    (modules || ALL_MODULES).forEach(function (k) { perLayer += r * (p[k][0] + p[k][1]); });
    return perLayer * m.layers;
  }

  /* Bytes per parameter, mixed-precision AdamW (the standard accounting):
     bf16 weights 2 + bf16 grads 2 + fp32 master copy 4 + Adam m and v in fp32 8 = 16. */
  var BYTES = { weightBf16: 2, trainable: 16 };

  /* Activation memory is a TEACHING MODEL (labelled on the page), not a measurement:
     per token per layer ≈ hidden × 2 bytes × 16 without gradient checkpointing, × 2 with it;
     plus fp32 logits for the whole sequence (seq × vocab × 4 bytes), which is real and large. */
  function activationGB(m, seq, batch, ckpt) {
    var perTok = m.hidden * 2 * (ckpt ? 2 : 16) * m.layers;
    return (seq * batch * perTok + seq * batch * m.vocab * 4) / GB;
  }

  function trainMemory(m, opts) {
    var total = paramCount(m), trainable, weightsGB, stateGB;
    if (opts.mode === "full") {
      trainable = total;
      weightsGB = 0;
      stateGB = total * BYTES.trainable / GB;
    } else {
      trainable = loraParams(m, opts.r, opts.modules);
      weightsGB = total * BYTES.weightBf16 / GB;       // frozen base, bf16
      stateGB = trainable * BYTES.trainable / GB;      // adapter weights + grads + optimizer
    }
    var actGB = activationGB(m, opts.seq || 1024, opts.batch || 1, opts.ckpt !== false);
    return { totalParams: total, trainable: trainable, pct: 100 * trainable / total,
             weightsGB: weightsGB, stateGB: stateGB, actGB: actGB,
             totalGB: weightsGB + stateGB + actGB };
  }

  /* Where it could run. "usable" leaves headroom for the framework/CUDA context;
     the Mac figure reflects macOS's default GPU wired-memory cap: ~75% of 36 GiB ≈ 29 GB (10⁹ bytes). */
  var MACHINES = [
    { id: "mac", name: "Mac laptop (M3 Pro, 36 GB)", gb: 36, usable: 29, note: "MPS; no bf16 issue, no bitsandbytes" },
    { id: "t4", name: "Free Colab T4 (16 GB)", gb: 16, usable: 15, note: "no bf16: use fp16" },
    { id: "3060", name: "RTX 3060 (12 GB)", gb: 12, usable: 11.2, note: "bf16 works" },
    { id: "a10g", name: "A10G (HF Jobs)", gb: 24, usable: 22.5, note: "paid" },
    { id: "a100", name: "A100 40 GB (HF Jobs)", gb: 40, usable: 38, note: "paid" }
  ];
  function fits(totalGB) {
    return MACHINES.map(function (x) { return { id: x.id, name: x.name, ok: totalGB <= x.usable, note: x.note }; });
  }

  /* ---------- 4. DPO: the implicit reward (Rafailov et al. 2023) ----------
     Inputs are sequence log-probs (sum over the answer's tokens) under the policy
     being trained and the frozen reference. */
  function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }
  function dpo(pc, rc, pr, rr, beta) {
    var rwC = beta * (pc - rc), rwR = beta * (pr - rr), margin = rwC - rwR;
    return {
      rewardChosen: rwC, rewardRejected: rwR, margin: margin,
      prob: sigmoid(margin),                         // model's implied P(chosen beats rejected)
      loss: Math.log1p(Math.exp(-margin)),           // −log σ(margin), stable form
      gradWeight: sigmoid(-margin)                   // how hard this pair still pushes (→0 once learned)
    };
  }
  function dpoBatch(pairs, beta) {
    var acc = 0, mSum = 0, lSum = 0;
    pairs.forEach(function (p) {
      var d = dpo(p.pc, p.rc, p.pr, p.rr, beta);
      if (d.margin > 0) acc++;
      mSum += d.margin; lSum += d.loss;
    });
    var n = pairs.length || 1;
    return { rewardAccuracy: acc / n, meanMargin: mSum / n, meanLoss: lSum / n };
  }

  /* ---------- 5. What each method costs per training example ----------
     F = forward pass, B = backward pass. Counted from the losses themselves: DPO scores two answers, each under the policy
     (with gradients) and under the frozen reference (without). */
  function passes(method, o) {
    o = o || {};
    if (method === "sft") return { F: 1, B: 1, refF: 0, gen: 0, copies: 1 };
    if (method === "dpo") return {
      F: 2, B: 2, refF: o.precompute ? 0 : 2, gen: 0,
      copies: (o.precompute || o.lora) ? 1 : 2      // LoRA: reference = same weights, adapter off
    };
    if (method === "grpo") {
      var G = o.G || 8, useRef = (o.beta || 0) > 0;
      return { F: G, B: G, refF: useRef ? G : 0, gen: G,
               copies: useRef && !o.lora ? 2 : 1 };
    }
    return null;
  }

  /* ---------- 6. GRPO: the group is the critic (Shao et al. 2024) ----------
     Advantage = (r − mean) / (std + eps), std = SAMPLE std (n−1), as TRL computes it
     with torch .std(); eps = 1e-4 as in TRL's GRPOTrainer. */
  /* scale: "group" (default; GRPO as published and TRL's scale_rewards="group") divides by the
     group's std. "none" skips that division, as Dr. GRPO (Liu et al. 2025) argues, because
     dividing by std over-weights prompts whose samples happen to agree (a difficulty bias). */
  function grpoAdvantages(rewards, eps, scale) {
    eps = eps == null ? 1e-4 : eps;
    var n = rewards.length, mean = 0;
    rewards.forEach(function (r) { mean += r; });
    mean /= n;
    var ss = 0;
    rewards.forEach(function (r) { ss += (r - mean) * (r - mean); });
    var std = n > 1 ? Math.sqrt(ss / (n - 1)) : 0;
    var noScale = scale === "none";
    return { mean: mean, std: std, scale: noScale ? "none" : "group",
             adv: rewards.map(function (r) { return noScale ? r - mean : (r - mean) / (std + eps); }) };
  }
  function clip(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }
  /* One sample's clipped surrogate term: min(ρA, clip(ρ, 1−ε, 1+ε)A). */
  function grpoTerm(pOld, pNew, A, epsilon) {
    var rho = pNew / pOld, rc = clip(rho, 1 - epsilon, 1 + epsilon);
    var raw = rho * A, clipped = rc * A, term = Math.min(raw, clipped);
    return { ratio: rho, clippedRatio: rc, raw: raw, clipped: clipped, term: term,
             bit: term !== raw };                   // true when the clip changed the term
  }

  /* ---------- Capstone: score a plan against a brief ---------- */
  function scorePlan(brief, plan) {
    var fails = [];
    var sig = { demos: "sft", pairs: "dpo", verifier: "grpo" };
    var right = sig[brief.signal];
    if (plan.method !== right) {
      var why = {
        sft: { dpo: "DPO needs preference pairs, and this client has demonstrations. Fine-tune on them (SFT).",
               grpo: "GRPO here would need a reward for tone. No code can check tone, and training a reward model for it is a bigger project than fine-tuning on the 3,000 approved replies. Use SFT." },
        dpo: { sft: "SFT would copy the chosen answers but throw away what the editors rejected. The comparison is the signal: use DPO.",
               grpo: "Editor taste can't be checked by code, so GRPO would first need a reward model trained on these pairs. You already have the pairs: use DPO directly." },
        grpo: { sft: "There are no gold queries to copy, only a database that can check an answer. Let the checker grade the model's own tries: GRPO.",
                dpo: "You have a thermometer but you're paying tasters. A checker gives an exact 0/1 reward: use GRPO." }
      };
      fails.push(why[right][plan.method]);
    }
    if (plan.method === "dpo" && brief.dataCount < 1000) fails.push("Under ~1,000 preference pairs is below the course's floor for DPO.");
    if (plan.method === "dpo" && plan.beta != null && plan.beta < 0.01) fails.push("β = " + plan.beta + " is almost no leash: the policy can walk far from the reference.");
    if (plan.method === "grpo" && plan.G != null && plan.G < 2) fails.push("A group of one has no baseline: every advantage is zero.");
    var m = model(plan.model);
    var mem = trainMemory(m, { mode: plan.lora ? "lora" : "full", r: 16, modules: ALL_MODULES, seq: 1024, batch: 1, ckpt: true });
    /* DPO without LoRA keeps a second, frozen bf16 copy as the reference (step 5). */
    if (plan.method === "dpo" && !plan.lora) mem.totalGB += paramCount(m) * BYTES.weightBf16 / GB;
    /* GRPO only learns from groups with mixed scores; a model that never solves the task yields all-zero groups. */
    if (plan.method === "grpo" && paramCount(m) < 1e9) fails.push("Too small for this task: a 135M model will almost never write a correct SQL answer, so every group scores 0 and every advantage is 0. Start from a model that sometimes gets it right.");
    var machine = MACHINES.filter(function (x) { return x.id === plan.machine; })[0];
    if (mem.totalGB > machine.usable) fails.push("Doesn't fit: needs about " + mem.totalGB.toFixed(1) + " GB, and the " + machine.name + " has about " + machine.usable + " GB usable.");
    if (brief.budget === 0 && (plan.machine === "a10g" || plan.machine === "a100")) fails.push("The client's budget is zero, and HF Jobs is paid.");
    return { pass: fails.length === 0, fails: fails, memGB: mem.totalGB };
  }

  window.FS = {
    MODELS: MODELS, MACHINES: MACHINES, ALL_MODULES: ALL_MODULES, BYTES: BYTES,
    model: model, projections: projections, paramCount: paramCount,
    thinkingMode: thinkingMode, sftLoss: sftLoss,
    loraParams: loraParams, activationGB: activationGB, trainMemory: trainMemory, fits: fits,
    sigmoid: sigmoid, dpo: dpo, dpoBatch: dpoBatch, passes: passes,
    grpoAdvantages: grpoAdvantages, grpoTerm: grpoTerm, scorePlan: scorePlan
  };
})();
