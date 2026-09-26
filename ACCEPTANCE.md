# Finishing School: acceptance criteria

Written before the build (2026-09-25). Numeric checks are asserted against `window.FS` (the pure math module, `js/core.js`) in the browser console. Model shapes come from each model's Hugging Face `config.json`, read 2026-09-25. **GB = 10⁹ bytes.** Logs are natural logs.

## A. The math is right

| # | Check | Expected |
|---|---|---|
| A0 | Parameter counts from config (tied embeddings) | SmolLM2-135M 134,515,008 · Qwen3-1.7B 1,720,574,976 · SmolLM3-3B 3,075,098,624 (match the model cards: 135M / 1.7B / 3B) |
| A1 | LoRA, Qwen3-1.7B, r = 16, all 7 projections | **17,432,576** trainable (1.01%), from r·(d_in + d_out) per adapted matrix (Hu et al. 2021) |
| A2 | Same, r = 8, q and v only | **1,605,632** |
| A3 | SFT loss, answer tokens p = 0.5, 0.25, 0.8, prompt tokens masked | **0.7675**, 3 of 5 tokens counted |
| A4 | Same, prompt tokens p = 0.1, 0.1 counted too | **1.3815**, 5 of 5 |
| A5 | DPO, β = 0.1, policy/ref log-probs: chosen −10/−12, rejected −14/−13 | rewards **+0.2 / −0.1**, margin **0.3**, loss **0.5544**, P(chosen wins) 0.574 |
| A6 | DPO when policy = reference (the first step of any run) | margin 0, loss **ln 2 = 0.6931**, for any β |
| A7 | β direction | The page teaches the paper's reading: **higher β = a shorter leash** (stronger implicit KL to the reference). It flags that smol `unit2/2.md`'s table says the reverse |
| A8 | GRPO, a hand-worked example (not the LLM Course's own G = 8 example): rewards 1.5 / 0.5 / 1.0 / 0.5 | mean 0.875 · sample std (n−1) **0.4787** · advantages **+1.305 / −0.783 / +0.261 / −0.783** with TRL's ε = 1e-4 in the denominator (1.306 without it; the page says so) |
| A9 | Same, ε_clip = 0.2, π_old→π_new 0.30→0.42, 0.25→0.20, 0.15→0.17, 0.25→0.14 | ratios 1.40 / 0.80 / 1.13 / 0.56 · terms 1.566 / −0.627 / 0.296 / −0.627 · clip bites on o1 and o4 only |
| A10 | Group where every reward is equal | every advantage **0** (no divide-by-zero) |
| A11 | Full fine-tune of SmolLM3-3B at 16 B/param | optimizer + weights state **49.2 GB** → fits none of Mac / T4 / 3060 / A10G / A100-40GB |
| A12 | LoRA r = 16 (all 7) on SmolLM3-3B, seq 1024, batch 1, checkpointing | frozen base 6.15 GB + adapter state 0.48 GB + activations (teaching model) 0.83 GB ≈ **7.5 GB** → fits all five |
| A13 | Passes per example | SFT 1F+1B · DPO 2F+2B+2 ref F (2 model copies) · DPO with precomputed ref log-probs 2F+2B (1 copy) · DPO + LoRA: ref F still runs, but on the same weights (1 copy) · GRPO G=8: 8 generations + 8F+8B, ref off by default (TRL β = 0) · GRPO β > 0: +8 ref F |
| A15 | Std scaling on vs off (the std half of Dr. GRPO), the lowest plate | near-tie [1,1,1,0.9] (all right, one slightly messier): **−1.50** with std scaling vs **−0.075** without · real split [1,0,1,0]: **−0.87** vs **−0.50**. With std scaling a trivial 0.1 gap pushes harder than a real right/wrong gap |
| A14 | SmolLM3 thinking switch | system `/no_think` + `enable_thinking=True` → **off** (flag wins) · keyword False, no flag → off · nothing set → on |
| A16 | SmolLM3 ticket, no tools (checked against the model's `chat_template.jinja` and the course's printed renders, 25 Sep 2026) | the system block is **not** closed with `<|im_end|>`; the template only emits that inside its tools branch. Special tokens on the ticket: **4** with thinking on, **6** with thinking off (`<think>`, `</think>` are registered special tokens), one more with a tool |

## B. It teaches (every step)

- B1 Every step (0–6 and the capstone) is interactive: sliders, toggles, drag or clicks, with visuals updating live.
- B2 Every step has at least one **predict → reveal** sticky note, answered before the result is shown.
- B3 Every step ends with a **"say it out loud"** chalkboard line that unlocks after the predictions and some interaction.
- B4 The finishing-school analogy is introduced in step 0. Every technical term has a hover/tap tooltip with its plain meaning and its school equivalent.
- B5 Every step has a "Covers" line naming the smol study-guide section, the LLM-course lesson and the RLHF Book chapter.
- B6 An honesty note says what's exact and what's a teaching model.

## C. Capstone and field test

- C1 Three client briefs (brand-voice bank bot → SFT; editor A/B headlines → DPO; SQL bot with a checker → GRPO). Each has a known-good plan that passes, and named known-bad plans that fail for the **stated** reason: wrong signal for the method, too few pairs, β too small, G = 1, a model too small to ever solve the task (all-zero groups), doesn't fit the machine (full-weight DPO counts its second, frozen reference copy), paid hardware on a zero budget.
- C2 A field test of 8 questions answered by operating the widgets, graded automatically.
- C3 A diploma card appears once all three clients are hired and the best field-test score is 6/8 or better; it carries the local award date and the score, and prints on its own page.
- C4 In step 0, lighting a floor in the widget turns that floor's painted sign yellow inside the cutaway scene (the sign is found by geometry; the art files are unchanged).

## D. It works

- D1 Opens straight from the file (no server, no build step, no fetch of local files).
- D2 Zero console errors across all steps.
- D3 Usable at 375 px wide with no horizontal page scroll.
- D4 Styling follows the recorded design system in `DESIGN.md` (inherited from Inference Kitchen: Busytown cutaway, warm paper, one brown outline, Grandstander / Patrick Hand / Andika).
- D5 Progress persists across reloads (localStorage, wrapped so it degrades safely).
- D6 One illustrated 960×400 cutaway scene per step (0–6) and the capstone, every object labelled.
- D7 A fresh-context adversarial review finds no open correctness issue. (Run 25 Sep 2026: a correctness review found 1 blocker, 7 major and 7 minor issues, and a design finish review found 8 material fixes; all were fixed and re-verified in the browser. A second cold read by a different model, later that day, found the step-1 template quirk in A16 and the special-token undercount; both fixed.)
