/* Finishing School — UI. Every number shown is computed by window.FS (core.js);
   this file only wires controls to it and draws. */
(function () {
  "use strict";
  var FS = window.FS, GL = window.FS_GLOSSARY || {};
  var $ = function (id) { return document.getElementById(id); };
  var qa = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  /* ---------------- formatting ---------------- */
  function fmt(n, d) { return Number(n).toLocaleString("en-US", { maximumFractionDigits: d == null ? 0 : d, minimumFractionDigits: d == null ? 0 : d }); }
  function sgn(n, d) { var s = fmt(n, d); if (+s.replace(/,/g, "") === 0) return fmt(0, d); return (n > 0 ? "+" : "") + s.replace(/^-/, "−"); }
  function fnum(n, d) { return fmt(n, d).replace(/^-/, "−"); }
  function fpar(n) { return n >= 1e9 ? fmt(n / 1e9, 2) + "B" : n >= 1e6 ? fmt(n / 1e6, 1) + "M" : n >= 1e3 ? fmt(n / 1e3, 0) + "K" : fmt(n); }
  function fgb(n) { return fmt(n, n < 10 ? 2 : 1) + " GB"; }

  /* ---------------- persistence (never required) ---------------- */
  var KEY = "finishing-school-v1";
  var store = { predicts: {}, touched: {}, said: {}, briefs: {}, ft: {}, ladder: {}, meta: {} };
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  function longDate(d) { return ("0" + d.getDate()).slice(-2) + " " + MONTHS[d.getMonth()] + " " + d.getFullYear(); }
  try { var raw = localStorage.getItem(KEY); if (raw) { var got = JSON.parse(raw); if (got && typeof got === "object") Object.keys(store).forEach(function (k) { if (got[k] && typeof got[k] === "object") store[k] = got[k]; }); } } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} }

  /* ---------------- icons (nav + key map) ---------------- */
  var S = ' stroke="#4A2E1E" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"';
  function svg(inner) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + inner + "</svg>"; }
  var ICONS = {
    ladder: svg('<path d="M7 2v20M17 2v20"' + S + ' fill="none"/><path d="M7 6h10M7 11h10M7 16h10"' + S + ' fill="none"/><rect x="8" y="15" width="8" height="2" fill="#F4C430"' + S + "/>"),
    ticket: svg('<path d="M5 3h14v17l-2-2-2 2-2-2-2 2-2-2-2 2-2-2z" fill="#FFFDF6"' + S + '/><path d="M8 7h8M8 10h8"' + S + '/><rect x="8" y="13" width="8" height="3" fill="#B8A3DC"' + S + "/>"),
    pen: svg('<rect x="3" y="4" width="12" height="16" rx="1" fill="#FFFDF6"' + S + '/><path d="M6 9l2 2 3-4M6 15h6"' + S + ' fill="none"/><path d="M16 19l5-11 1.5 1-5 11z" fill="#C8452F"' + S + "/>"),
    note: svg('<rect x="3" y="3" width="15" height="18" rx="1" fill="#DDBB8A"' + S + '/><path d="M11 6h10v9l-3 3h-7z" fill="#FFF1A8"' + S + '/><path d="M18 18v-3h3" fill="#F4C430"' + S + "/>"),
    taste: svg('<ellipse cx="7" cy="15" rx="5" ry="2.5" fill="#FFFDF6"' + S + '/><ellipse cx="17" cy="15" rx="5" ry="2.5" fill="#FFFDF6"' + S + '/><path d="M7 5l1.2 2.5 2.7.3-2 1.8.6 2.7L7 11l-2.5 1.3.6-2.7-2-1.8 2.7-.3z" fill="#F4C430"' + S + '/><path d="M17 12V6l3 1.5-3 1.5" fill="#C8452F"' + S + "/>"),
    photo: svg('<rect x="3" y="4" width="18" height="16" rx="1" fill="#FFFDF6"' + S + '/><circle cx="12" cy="10" r="3" fill="#DDBB8A"' + S + '/><path d="M6 18c1-4 11-4 12 0" fill="#9CCBEA"' + S + "/>"),
    thermo: svg('<rect x="9" y="2" width="6" height="14" rx="3" fill="#FFFDF6"' + S + '/><circle cx="12" cy="18" r="4" fill="#C8452F"' + S + '/><path d="M12 8v8"' + S + ' stroke="#C8452F"/>'),
    cap: svg('<path d="M2 9l10-5 10 5-10 5z" fill="#F4C430"' + S + '/><path d="M6 11v5c0 2 12 2 12 0v-5" fill="#C8452F"' + S + '/><path d="M21 10v6"' + S + "/>"),
    pencil: svg('<rect x="4" y="3" width="13" height="18" rx="1" fill="#FFFDF6"' + S + '/><path d="M7 8l2 2 4-4M7 14l2 2 4-4"' + S + ' fill="none"/><path d="M15 20l6-12 1 1-6 12z" fill="#C8452F"' + S + "/>"),
    cook: svg('<path d="M7 11c-4 0-5-6-1-7 0-4 6-5 7-2 2-3 7-2 7 2 4 1 3 7-1 7z" fill="#FFFDF6"' + S + '/><rect x="7" y="11" width="10" height="4" fill="#FFFDF6"' + S + '/><circle cx="12" cy="18.5" r="3" fill="#DDBB8A"' + S + "/>"),
    plates: svg('<ellipse cx="12" cy="15" rx="10" ry="5" fill="#FFFDF6"' + S + '/><ellipse cx="12" cy="14" rx="5" ry="2.5" fill="#5FA03C"' + S + '/><path d="M12 3v5M10 5h4"' + S + "/>"),
    leash: svg('<rect x="2" y="3" width="8" height="9" rx="1" fill="#FFFDF6"' + S + '/><circle cx="18" cy="17" r="3.5" fill="#DDBB8A"' + S + '/><path d="M10 8c5 0 4 8 5 7"' + S + ' fill="none" stroke-dasharray="2 2"/>')
  };
  var NAV_ICON = { s0: "ladder", s1: "ticket", s2: "pen", s3: "note", s4: "taste", s5: "photo", s6: "thermo", cap: "cap", ft: "pencil" };

  /* ---------------- nav ---------------- */
  var sections = qa("section");
  function buildNav() {
    var nav = $("nav"); nav.innerHTML = "";
    sections.forEach(function (s) {
      var b = document.createElement("button");
      b.type = "button";
      b.innerHTML = '<span class="ic" aria-hidden="true">' + (ICONS[NAV_ICON[s.id]] || "") + '</span><span class="n">' + s.dataset.n + "</span>" + s.dataset.title + (store.said[s.id] ? '<span class="chk">✓</span>' : "");
      b.onclick = function () { show(s.id); };
      b.dataset.for = s.id;
      nav.appendChild(b);
    });
  }
  function markNav() { var cur = sections.filter(function (s) { return s.classList.contains("on"); })[0]; if (cur) qa("#nav button").forEach(function (b) { b.classList.toggle("on", b.dataset.for === cur.id); }); }
  function show(id) {
    sections.forEach(function (s) { s.classList.toggle("on", s.id === id); });
    markNav();
    var active = document.querySelector("#nav button.on"), nav = $("nav");
    if (active && nav.scrollWidth > nav.clientWidth) nav.scrollLeft = active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2;
    /* The hash is written as #/s3, not #s3: no element has the id "/s3", so the browser never performs
       its own fragment jump (which Chrome re-applies on the first layout after load, when the fonts land). */
    try { history.replaceState(null, "", "#/" + id); } catch (e) {}
    window.scrollTo(0, 0);
    if (id === "s3") s3fitLabels();
    if (id === "s0") s0lightFloors();
  }

  /* ---------------- engagement: predict + say ---------------- */
  function touch(sec) { store.touched[sec] = (store.touched[sec] || 0) + 1; save(); checkSay(sec); }
  function checkSay(sec) {
    var s = $(sec); if (!s) return;
    var sayEl = s.querySelector(".say"); if (!sayEl) return;
    var preds = qa(".predict", s);
    var allAnswered = preds.every(function (p) { return store.predicts[p.dataset.p] != null; });
    var open = allAnswered && (store.touched[sec] || 0) >= 3;
    var tag = sayEl.querySelector(".tag");
    if (open) {
      if (!sayEl.classList.contains("open")) sayEl.classList.add("open");
      tag.textContent = "Say it out loud";
      if (!store.said[sec]) { store.said[sec] = true; save(); buildNav(); markNav(); }
    } else {
      tag.textContent = "Say it out loud · unlocks after you answer the prediction" + (preds.length > 1 ? "s" : "") + " and play with the controls";
    }
  }
  function initPredicts() {
    qa(".predict").forEach(function (p) {
      var key = p.dataset.p, sec = p.closest("section").id;
      var btns = qa(".opts button", p);
      function reveal(idx) {
        btns.forEach(function (b, i) {
          b.disabled = true;
          if (b.hasAttribute("data-right")) b.classList.add("right");
          else if (i === idx) b.classList.add("wrong");
        });
        p.classList.add("done");
      }
      btns.forEach(function (b, i) {
        b.type = "button";
        b.onclick = function () { store.predicts[key] = i; save(); reveal(i); checkSay(sec); };
      });
      if (store.predicts[key] != null) reveal(store.predicts[key]);
    });
  }

  /* ---------------- glossary tooltip ---------------- */
  var tip = $("tip");
  function placeTip(el) {
    var g = GL[el.dataset.g]; if (!g) return;
    tip.innerHTML = "<b>" + esc(g[0]) + "</b><br>" + esc(g[1]) + '<span class="kt">At school: ' + esc(g[2]) + "</span>";
    tip.style.display = "block";
    var r = el.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
    tip.style.left = Math.min(Math.max(8, r.left), window.innerWidth - w - 8) + "px";
    var y = r.bottom + 8; if (y + h > window.innerHeight - 8) y = r.top - h - 8;
    tip.style.top = Math.max(8, y) + "px";
  }
  function bindTips(root) {
    qa(".g", root).forEach(function (el) {
      if (el.dataset.bound) return; el.dataset.bound = "1";
      el.tabIndex = 0; el.setAttribute("role", "button");
      el.addEventListener("mouseenter", function () { placeTip(el); });
      el.addEventListener("mouseleave", function () { tip.style.display = "none"; });
      el.addEventListener("focus", function () { placeTip(el); });
      el.addEventListener("blur", function () { tip.style.display = "none"; });
      el.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); if (tip.style.display === "block") tip.style.display = "none"; else placeTip(el); });
    });
  }
  document.addEventListener("click", function () { tip.style.display = "none"; });
  window.addEventListener("scroll", function () { tip.style.display = "none"; }, { passive: true });

  /* ---------------- controls ---------------- */
  function seg(el, opts, val, onChange) {
    el.innerHTML = "";
    var state = { value: val };
    opts.forEach(function (o) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = o.label; b.dataset.v = o.v;
      if (String(o.v) === String(val)) b.classList.add("on");
      b.onclick = function () {
        if (b.disabled) return;
        state.value = o.v;
        qa("button", el).forEach(function (x) { x.classList.toggle("on", x === b); });
        onChange(o.v);
      };
      el.appendChild(b);
    });
    state.set = function (v) { state.value = v; qa("button", el).forEach(function (x) { x.classList.toggle("on", String(x.dataset.v) === String(v)); }); };
    return state;
  }
  var MODEL_OPTS = FS.MODELS.map(function (m) { return { v: m.id, label: m.name }; });
  var MSHORT = { mac: "Mac (M3 Pro)", t4: "Free Colab T4", "3060": "RTX 3060", a10g: "A10G · HF Jobs", a100: "A100 · HF Jobs" };
  var MTICK = { mac: "Mac", t4: "T4", "3060": "3060", a10g: "A10G", a100: "A100" };
  function machine(id) { return FS.MACHINES.filter(function (x) { return x.id === id; })[0]; }
  function mLabel(x) { return (MSHORT[x.id] || x.name) + " · " + x.gb + " GB"; }
  var MACHINE_OPTS = FS.MACHINES.map(function (x) { return { v: x.id, label: mLabel(x) }; });

  /* ================= STEP 0 · The Ladder ================= */
  var SIGNALS = [
    { id: "ex", label: "a worked example to copy", rung: "sft", icon: "plates" },
    { id: "pair", label: "two plates, one preferred", rung: "dpo", icon: "taste" },
    { id: "thermo", label: "a thermometer reading 0 or 1", rung: "grpo", icon: "thermo" }
  ];
  var RUNGS = [
    { id: "grpo", floor: "Top floor", name: "Exam Hall · GRPO", need: "The exam hall needs a score for each of the cook's own answers (here a checker reading 0 or 1), not an answer to copy or a taster's choice." },
    { id: "dpo", floor: "2nd floor", name: "Tasting Room · DPO", need: "The tasting room needs two plates and a finger pointing at the better one." },
    { id: "sft", floor: "1st floor", name: "Copying Class · SFT", need: "The copying class needs a finished answer to copy, word for word." }
  ];
  var s0 = { sel: null };
  /* The cutaway answers the widget: when a floor is lit, its painted sign in the scene turns
     school-bus yellow. The sign is found by geometry (the smallest rect around the floor's name),
     so the art files stay untouched. */
  var FLOOR_TEXT = { grpo: "EXAM HALL", dpo: "TASTING ROOM", sft: "COPYING CLASS" };
  function s0lightFloors() {
    var svg = document.querySelector("#s0 .scene svg"); if (!svg) return;
    var texts = qa("text", svg), rects = qa("rect", svg);
    Object.keys(FLOOR_TEXT).forEach(function (id) {
      var txt = texts.filter(function (t) { return t.textContent === FLOOR_TEXT[id]; })[0]; if (!txt) return;
      if (!txt._sign) {
        var tb = txt.getBoundingClientRect(); if (!tb.width) return;
        var cx = tb.left + tb.width / 2, cy = tb.top + tb.height / 2, area = Infinity, best = null;
        rects.forEach(function (r) {
          var b = r.getBoundingClientRect();
          if (cx >= b.left && cx <= b.right && cy >= b.top && cy <= b.bottom && b.width * b.height < area && b.width < tb.width * 2.5) { area = b.width * b.height; best = r; }
        });
        txt._sign = best || false;
      }
      var lit = !!store.ladder[id];
      txt.classList.toggle("floor-lit", lit);
      if (txt._sign) txt._sign.classList.toggle("floor-lit", lit);
    });
  }
  function s0render() {
    var sigs = $("s0sigs"), rungs = $("s0rungs");
    sigs.innerHTML = ""; rungs.innerHTML = "";
    var placed = {};
    Object.keys(store.ladder).forEach(function (r) { placed[store.ladder[r]] = r; });
    SIGNALS.forEach(function (sg) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "sig" + (placed[sg.id] ? " placed" : "") + (s0.sel === sg.id ? " sel" : "");
      b.innerHTML = '<span class="ic">' + ICONS[sg.icon] + "</span>" + sg.label;
      b.disabled = !!placed[sg.id];
      b.setAttribute("aria-pressed", s0.sel === sg.id ? "true" : "false");
      b.draggable = !placed[sg.id];
      b.onclick = function (e) { e.stopPropagation(); s0.sel = s0.sel === sg.id ? null : sg.id; s0render(); if (s0.sel) $("s0out").innerHTML = "Now tap the floor that learns from <b>" + sg.label + "</b>."; };
      b.addEventListener("dragstart", function (e) { s0.sel = sg.id; try { e.dataTransfer.setData("text/plain", sg.id); e.dataTransfer.effectAllowed = "move"; } catch (x) {} });
      sigs.appendChild(b);
    });
    RUNGS.forEach(function (r) {
      var b = document.createElement("button");
      var lit = store.ladder[r.id];
      var sg = lit && SIGNALS.filter(function (x) { return x.id === lit; })[0];
      b.type = "button"; b.className = "rung" + (lit ? " lit" : "");
      b.innerHTML = '<span class="fl">' + r.floor + "</span><b>" + r.name + "</b>" + (sg ? '<span class="got">learns from ' + sg.label + "</span>" : '<span class="got empty">drop a signal here</span>');
      b.onclick = function () { s0place(r.id); };
      b.addEventListener("dragover", function (e) { e.preventDefault(); });
      b.addEventListener("drop", function (e) { e.preventDefault(); var id = null; try { id = e.dataTransfer.getData("text/plain"); } catch (x) {} if (id) s0.sel = id; s0place(r.id); });
      rungs.appendChild(b);
    });
    var base = document.createElement("div");
    base.className = "rung ground";
    base.innerHTML = '<span class="fl">Ground floor</span><b>Arrivals · base model</b><span class="got">learned from pretraining: predict the next word of everything</span>';
    rungs.appendChild(base);
  }
  function s0place(rungId) {
    var out = $("s0out");
    if (store.ladder[rungId]) { out.innerHTML = "That floor is already lit."; return; }
    if (!s0.sel) { out.innerHTML = "Pick a signal card first, then tap its floor."; return; }
    var sg = SIGNALS.filter(function (x) { return x.id === s0.sel; })[0];
    var r = RUNGS.filter(function (x) { return x.id === rungId; })[0];
    touch("s0");
    if (sg.rung === rungId) {
      store.ladder[rungId] = sg.id; save(); s0.sel = null; s0render(); s0lightFloors();
      var n = Object.keys(store.ladder).length;
      out.innerHTML = n < 3 ? "<b>Lit.</b> " + r.name + " learns from " + sg.label + ". " + (3 - n) + " to go."
        : "<b>All three floors lit.</b> Copying needs answers, comparing needs pairs, the exam needs a score for each answer (here, a checker). A real model usually climbs them in order: SFT first, then DPO or GRPO on top of the SFT checkpoint.";
    } else {
      out.innerHTML = "<b>Not that floor.</b> " + r.need;
      var el = qa(".rung", $("s0rungs"))[RUNGS.indexOf(r)];
      if (el) { el.classList.remove("nope"); void el.offsetWidth; el.classList.add("nope"); }
    }
  }
  var COOKS = {
    base: { label: "Base cook", cls: "base",
      prompt: "Write a one-line reply to a customer whose parcel is late.",
      out: "Write a one-line reply to a customer who wants a refund. Write a one-line reply to a customer whose parcel arrived damaged. Write a one-line reply to a customer who",
      note: "The <b>base model</b> treats your request as the start of a document and continues it: here, a list of writing prompts. It never answers and never stops on its own." },
    sft: { label: "After SFT", cls: "sft",
      prompt: "Write a one-line reply to a customer whose parcel is late.",
      out: "Sorry your parcel is late. It's on its way and should arrive by Friday.",
      note: "After the <b>copying class</b> the cook answers in the shape of the worked examples: one line, on topic, then stops. Correct, a little flat." },
    dpo: { label: "After DPO", cls: "dpo",
      prompt: "Write a one-line reply to a customer whose parcel is late.",
      out: "I'm sorry your parcel is running late. It's due Friday, and I've flagged it so you'll hear from us the moment it moves.",
      note: "After the <b>tasting room</b> the cook writes the reply tasters kept choosing: warmer, owns the problem, says what happens next. Same facts, preferred voice." },
    grpo: { label: "After GRPO", cls: "grpo",
      prompt: "Solve 2 + 3 × 4. Show your work in <think>, then the answer in <answer>.",
      out: "<think>Multiplication comes first: 3 × 4 = 12. Then 2 + 12 = 14.</think>\n<answer>14</answer>",
      note: "Here the <b>exam hall</b> uses questions a program can check (RLVR). After GRPO the cook reasons inside <code>&lt;think&gt;</code> and puts a checkable answer in <code>&lt;answer&gt;</code>, because that's what the checker rewarded." }
  };
  var s0cook = "base";
  function s0cookRender() {
    var c = COOKS[s0cook];
    var out = esc(c.out).replace(/\n/g, "<br>");
    if (s0cook === "grpo") out = out.replace(/(&lt;\/?(think|answer)&gt;)/g, '<span class="tg2">$1</span>');
    $("s0cookout").innerHTML = '<div class="cticket"><span class="ck">Order</span>' + esc(c.prompt) + '</div><div class="cplate ' + c.cls + '"><span class="ck">' + c.label + "</span>" + out + (s0cook === "base" ? '<span class="more">…</span>' : "") + '</div><div class="callout co-i">' + c.note + "</div>";
  }
  function initS0() {
    s0render();
    if (Object.keys(store.ladder).length === 3) $("s0out").innerHTML = "<b>All three floors lit.</b> Copying needs answers, comparing needs pairs, the exam needs a score for each answer (here, a checker).";
    seg($("s0cook"), Object.keys(COOKS).map(function (k) { return { v: k, label: COOKS[k].label }; }), s0cook, function (v) { s0cook = v; s0cookRender(); touch("s0"); });
    s0cookRender();
    document.addEventListener("click", function (e) { if (s0.sel && !e.target.closest(".ladder")) { s0.sel = null; s0render(); } });
  }

  /* ================= STEP 1 · The Order Ticket ================= */
  var s1 = { dia: "smol" };
  function T(t, k) { return { t: t, k: k }; }
  var BR = { br: true };
  function s1pieces() {
    var sys = $("s1sys").value, user = $("s1user").value || " ";
    var think = $("s1think").checked, tool = $("s1tool").checked;
    var P = [];
    if (s1.dia === "smol") {
      var mode = FS.thinkingMode({ system: sys, enableThinking: think });
      var custom = sys.replace(/\/no_think\b/g, "").replace(/\/think\b/g, "").replace(/\s+$/, "").replace(/^\s+/, "");
      /* The template's own defaults: a long reasoning persona in /think mode, a one-liner in /no_think. */
      if (!custom) custom = mode.on
        ? "You are a helpful AI assistant named SmolLM, trained by Hugging Face. Your role as an assistant involves thoroughly exploring questions through a systematic thinking process before providing the final precise and accurate solutions. … (the template's long reasoning persona)"
        : "You are a helpful AI assistant named SmolLM, trained by Hugging Face.";
      /* strftime_now("%d %B %Y"), as the template prints it. The cutoff line is a constant in the template. */
      var today = longDate(new Date());
      P.push(T("<|im_start|>", "sp"), T("system", "role"), BR,
        T("## Metadata", "tpl"), BR, T("Knowledge Cutoff Date: June 2025", "tpl"), BR, T("Today Date: " + today, "tpl"), BR,
        T("Reasoning Mode: " + (mode.on ? "/think" : "/no_think"), "think"), BR, BR,
        T("## Custom Instructions", "tpl"), BR, T(custom, "tx"), BR);
      /* Quirk, verified against the model's chat_template.jinja: the closing <|im_end|> of the system
         block is only emitted inside the tools branch. With no tools, the user turn follows directly. */
      if (tool) P.push(BR, T("### Tools", "tool"), BR, T("<tools>", "tool"), BR, T("{'name': 'get_weather', 'parameters': {'location': …}}", "tool"), BR, T("</tools>", "tool"), BR,
        T("Return each call as {\"name\": …, \"arguments\": …} inside <tool_call></tool_call>", "tpl"), BR, T("<|im_end|>", "sp"), BR);
      else P.push(T("(no <|im_end|> here: without tools, the template leaves the system block open)", "note"), BR);
      P.push(T("<|im_start|>", "sp"), T("user", "role"), BR, T(user, "tx"), T("<|im_end|>", "sp"), BR,
        T("<|im_start|>", "sp"), T("assistant", "role"), BR);
      if (!mode.on) P.push(T("<think>", "spt"), BR, BR, T("</think>", "spt"), BR, T("(the cook answers directly from here)", "note"));
      else P.push(T("(the cook writes <think> … </think>, then the answer)", "note"));
      return { P: P, mode: mode };
    }
    P.push(T("<|begin_of_text|>", "sp"), T("<|start_header_id|>", "sp"), T("system", "role"), T("<|end_header_id|>", "sp"), BR, BR);
    if (tool) P.push(T("Environment: ipython", "tool"), BR);
    P.push(T("Cutting Knowledge Date: …", "tpl"), BR, T("Today Date: …", "tpl"), BR, BR, T(sys || " ", "tx"), T("<|eot_id|>", "sp"),
      T("<|start_header_id|>", "sp"), T("user", "role"), T("<|end_header_id|>", "sp"), BR, BR);
    if (tool) P.push(T("Given the following functions, reply with a JSON function call …", "tool"), BR, T("{\"name\": \"get_weather\", \"parameters\": {\"location\": …}}", "tool"), BR, BR);
    P.push(T(user, "tx"), T("<|eot_id|>", "sp"), T("<|start_header_id|>", "sp"), T("assistant", "role"), T("<|end_header_id|>", "sp"), BR, BR,
      T("(the cook answers from here; no think box on this ticket)", "note"));
    return { P: P, mode: null };
  }
  function s1render() {
    var r = s1pieces(), n = 0;
    $("s1strip").innerHTML = r.P.map(function (p) {
      if (p.br) return '<span class="br"></span>';
      if (p.k === "sp" || p.k === "spt") n++;   // <think> and </think> are registered special tokens too
      return '<span class="tok k-' + p.k + '">' + esc(p.t) + "</span>";
    }).join("");
    var sys = $("s1sys").value, think = $("s1think").checked;
    var m = FS.thinkingMode({ system: sys, enableThinking: think });
    $("s1mode").textContent = m.on ? "ON" : "OFF";
    $("s1mode").className = "v " + (m.on ? "good" : "bad");
    $("s1why").textContent = /flag/.test(m.why) ? "flag wins" : /keyword/.test(m.why) ? "keyword off" : "default: on";
    $("s1n").textContent = fmt(n);
    var note = "<b>SmolLM3 thinking is " + (m.on ? "on" : "off") + ":</b> " + esc(m.why) + ". ";
    if (s1.dia === "llama") {
      note += "<b>Llama 3.1</b> prints roles between <code>&lt;|start_header_id|&gt;</code> and <code>&lt;|end_header_id|&gt;</code> and ends every turn with <code>&lt;|eot_id|&gt;</code>. It has no thinking switch: <code>enable_thinking</code> is ignored, and a <code>/no_think</code> in the system box is just text to this model. The readout above is what <i>SmolLM3</i> would do with the same settings." + ($("s1tool").checked ? " Tools go in the first <b>user</b> turn, with <code>Environment: ipython</code> in the system box." : "");
    } else {
      note += "<b>SmolLM3</b> is ChatML-style: <code>&lt;|im_start|&gt;role</code> … <code>&lt;|im_end|&gt;</code>. The template writes its own <b>## Metadata</b> block, including the reasoning mode, then puts your system text under <b>## Custom Instructions</b> (with the flag taken out). " +
        (m.on ? "Thinking is on, so the assistant turn is left open and the cook writes its reasoning inside <code>&lt;think&gt;</code> first." : "Thinking is off, so the template closes an <b>empty</b> think box before the answer: the model reads \"thinking already happened\" and answers directly. <code>&lt;think&gt;</code> and <code>&lt;/think&gt;</code> are special tokens in SmolLM3's vocabulary, so they count above.") +
        ($("s1tool").checked ? " Tools land in the <b>system block</b> under ### Tools, inside <code>&lt;tools&gt;&lt;/tools&gt;</code>, and only then does the block close with <code>&lt;|im_end|&gt;</code>."
          : " <b>Quirk:</b> with no tools, SmolLM3's template never closes the system block with <code>&lt;|im_end|&gt;</code>; the user turn starts straight after the custom instructions. That's how the model was trained, so serve it the same way. Switch the tool on and the <code>&lt;|im_end|&gt;</code> appears.");
      if (/\/(no_)?think\b/.test(sys) && ((m.on && !think) || (!m.on && think))) note += " <b>Notice:</b> the flag in the system box overrode the <code>enable_thinking</code> keyword.";
    }
    $("s1note").innerHTML = note;
  }
  function initS1() {
    seg($("s1dia"), [{ v: "smol", label: "SmolLM3 (ChatML)" }, { v: "llama", label: "Llama 3.1" }], s1.dia, function (v) { s1.dia = v; s1render(); touch("s1"); });
    ["s1sys", "s1user"].forEach(function (id) { $(id).addEventListener("input", function () { s1render(); }); $(id).addEventListener("change", function () { touch("s1"); }); });
    ["s1think", "s1tool"].forEach(function (id) { $(id).onchange = function () { s1render(); touch("s1"); }; });
    function flag(f) { var v = $("s1sys").value.replace(/\s*\/(no_)?think\b/g, "").replace(/\s+$/, ""); $("s1sys").value = f ? (v ? v + " " : "") + f : v; s1render(); touch("s1"); }
    $("s1addno").onclick = function () { flag("/no_think"); };
    $("s1addthink").onclick = function () { flag("/think"); };
    $("s1clr").onclick = function () { flag(""); };
    s1render();
  }

  /* ================= STEP 2 · Grading the Answer ================= */
  var PSTEPS = [0.1, 0.25, 0.5, 0.8, 0.95];
  var S2DEF = [
    { t: "Name a", p: 0.1, role: "prompt" }, { t: "red fruit.", p: 0.1, role: "prompt" },
    { t: "A", p: 0.5, role: "answer" }, { t: "cherry", p: 0.25, role: "answer" }, { t: ".", p: 0.8, role: "answer" }
  ];
  var s2 = { toks: S2DEF.map(function (t) { return { t: t.t, p: t.p, role: t.role }; }) };
  function surprise(p) { return FS.sftLoss([{ p: p, role: "answer" }], false).loss; }
  function s2render() {
    var mask = $("s2mask").checked;
    var maxS = surprise(PSTEPS[0]);
    var strip = $("s2strip"); strip.innerHTML = "";
    s2.toks.forEach(function (t, i) {
      var s = surprise(t.p), masked = mask && t.role !== "answer";
      var b = document.createElement("button");
      b.type = "button";
      b.className = "lt " + t.role + (masked ? " masked" : "");
      b.setAttribute("aria-label", t.t + ", p " + t.p + (masked ? ", not graded" : ""));
      b.innerHTML = '<span class="lbar"><i style="height:' + Math.max(3, s / maxS * 100) + '%"></i>' + (masked ? '<span class="stamp">not graded</span>' : "") + "</span>" +
        '<span class="lw">' + esc(t.t) + '</span><span class="lp">p = ' + t.p + '</span><span class="ls">−ln p = ' + fmt(s, 2) + "</span>";
      b.onclick = function () { var j = PSTEPS.indexOf(t.p); t.p = PSTEPS[(j + 1) % PSTEPS.length]; s2render(); touch("s2"); };
      strip.appendChild(b);
      if (i === 1) { var d = document.createElement("span"); d.className = "ldiv"; d.textContent = "answer →"; strip.appendChild(d); }
    });
    var r = FS.sftLoss(s2.toks, mask);
    $("s2loss").textContent = fmt(r.loss, 2);
    $("s2n").textContent = r.counted + " of " + r.total;
    $("s2sum").textContent = fmt(r.loss * r.counted, 2);
    var parts = s2.toks.filter(function (t) { return !mask || t.role === "answer"; }).map(function (t) { return fmt(surprise(t.p), 2); });
    $("s2note").innerHTML = "loss = (" + parts.join(" + ") + ") ÷ " + r.counted + " = <b>" + fmt(r.loss, 4) + "</b>. " +
      (mask ? "The prompt tokens are still <b>read</b> by the model; their labels are just set to −100, so the red pen skips them." : "Every token counts, including the customer's order. The cook is partly graded on guessing what the customer would type.");
  }
  function initS2() {
    $("s2mask").onchange = function () { s2render(); touch("s2"); };
    $("s2reset").onclick = function () { s2.toks = S2DEF.map(function (t) { return { t: t.t, p: t.p, role: t.role }; }); s2render(); touch("s2"); };
    s2render();
  }

  /* ================= STEP 3 · Sticky Notes ================= */
  var RANKS = [1, 2, 4, 8, 16, 32, 64, 128];
  var s3 = { model: "qwen3-1.7b", mode: "lora", r: 16, mods: FS.ALL_MODULES.slice(), seq: 1024 };
  function s3calc() {
    var m = FS.model(s3.model);
    return { m: m, mem: FS.trainMemory(m, { mode: s3.mode, r: s3.r, modules: s3.mods, seq: s3.seq, batch: 1, ckpt: $("s3ckpt").checked }) };
  }
  function s3render() {
    var c = s3calc(), m = c.m, r = c.mem;
    $("s3lora").style.display = s3.mode === "lora" ? "" : "none";
    $("s3tot").textContent = fpar(r.totalParams);
    $("s3tr").textContent = fpar(r.trainable);
    $("s3pct").textContent = fmt(r.pct, r.pct < 10 ? 2 : 0) + "%";
    $("s3gb").textContent = "≈ " + fgb(r.totalGB);
    $("s3bpp").textContent = FS.BYTES.trainable + " B";
    $("s3bfz").textContent = FS.BYTES.weightBf16 + " B";
    var axis = Math.max(40, r.totalGB * 1.08);
    function w(x) { return (x / axis * 100) + "%"; }
    $("s3bar").innerHTML =
      (r.weightsGB > 0 ? '<div class="fz" style="width:' + w(r.weightsGB) + '"><span>' + fgb(r.weightsGB) + "</span></div>" : "") +
      '<div class="ts" style="width:' + w(r.stateGB) + '"><span>' + fgb(r.stateGB) + "</span></div>" +
      '<div class="ac" style="width:' + w(r.actGB) + '"><span>' + fgb(r.actGB) + "</span></div>" +
      FS.MACHINES.map(function (x) { return '<i class="tk" style="left:' + w(x.usable) + '"></i>'; }).join("");
    $("s3lfz").textContent = r.weightsGB > 0 ? "· " + fgb(r.weightsGB) : "· none";
    $("s3lts").textContent = "· " + fgb(r.stateGB);
    $("s3lac").textContent = "· " + fgb(r.actGB);
    s3fitLabels();
    $("s3ticks").innerHTML = FS.MACHINES.map(function (x, i) {
      var at = x.usable / axis, edge = at > 0.86 ? " r" : at < 0.08 ? " l" : "";
      return '<span class="' + (i % 2 ? "lo" : "") + edge + '" style="left:' + w(x.usable) + '">' + MTICK[x.id] + " " + x.usable + "</span>";
    }).join("");
    var fits = FS.fits(r.totalGB);
    $("s3fits").innerHTML = fits.map(function (f) {
      var x = machine(f.id);
      return '<div class="chip ' + (f.ok ? "ok" : "no") + '"><b>' + (f.ok ? "✓ fits" : "✗ too big") + "</b>" + esc(mLabel(x)) + '<span>about ' + x.usable + " GB usable · " + esc(f.note) + "</span></div>";
    }).join("");
    var P = FS.projections(m);
    $("s3tab").innerHTML = FS.ALL_MODULES.map(function (k) {
      var on = s3.mode === "full" || s3.mods.indexOf(k) >= 0;
      var cnt = s3.mode === "full" ? P[k][0] * P[k][1] * m.layers : FS.loraParams(m, s3.r, [k]);
      return '<div class="mrow' + (on ? "" : " off") + '"><b>' + k + "</b><span>" + fmt(P[k][0]) + " → " + fmt(P[k][1]) + "</span><em>" + (on ? fpar(cnt) : "not adapted") + "</em></div>";
    }).join("");
    var none = FS.MACHINES.every(function (x) { return r.totalGB > x.usable; });
    var note;
    if (s3.mode === "full") note = "<b>Full fine-tune:</b> every one of " + fpar(r.totalParams) + " weights pays " + FS.BYTES.trainable + " bytes, so the trainable state alone is " + fgb(r.stateGB) + " before activations." + (none ? " It fits none of these machines." : "") + " The module table shows the full matrices being rewritten.";
    else if (!s3.mods.length) note = "No modules picked: no sticky notes, nothing to train. Pick at least one kind of page.";
    else note = "<b>LoRA:</b> the frozen book sits at " + FS.BYTES.weightBf16 + " bytes a weight (" + fgb(r.weightsGB) + "); only the " + fpar(r.trainable) + " adapter weights pay the full " + FS.BYTES.trainable + " bytes (" + fgb(r.stateGB) + "). The frozen book is most of the bill, so rank barely moves memory.";
    note += " Activations are a <b>teaching estimate</b>" + ($("s3ckpt").checked ? " with checkpointing on." : ": turn checkpointing on to shrink them.") + " Most of it is the fp32 logits over the vocabulary (" + fmt(m.vocab) + " tokens) for every position.";
    $("s3note").innerHTML = note;
  }
  /* A segment's label is hidden when the segment is too narrow to hold it; the legend carries the values. */
  function s3fitLabels() {
    qa(".mbar>div", $("s3bar")).forEach(function (d) {
      var sp = d.querySelector("span"); if (sp) sp.style.visibility = d.offsetWidth < 56 ? "hidden" : "";
    });
  }
  function initS3() {
    seg($("s3model"), MODEL_OPTS, s3.model, function (v) { s3.model = v; s3render(); touch("s3"); });
    seg($("s3mode"), [{ v: "lora", label: "LoRA (sticky notes)" }, { v: "full", label: "Full fine-tune" }], s3.mode, function (v) { s3.mode = v; s3render(); touch("s3"); });
    seg($("s3r"), RANKS.map(function (r) { return { v: r, label: "r " + r }; }), s3.r, function (v) { s3.r = +v; s3render(); touch("s3"); });
    seg($("s3seq"), [512, 1024, 2048].map(function (n) { return { v: n, label: fmt(n) }; }), s3.seq, function (v) { s3.seq = +v; s3render(); touch("s3"); });
    var mods = $("s3mods");
    mods.innerHTML = FS.ALL_MODULES.map(function (k) { return '<label class="mod"><input type="checkbox" value="' + k + '" checked><span>' + k + "</span></label>"; }).join("");
    qa("input", mods).forEach(function (cb) {
      cb.onchange = function () { s3.mods = qa("input", mods).filter(function (x) { return x.checked; }).map(function (x) { return x.value; }); s3render(); touch("s3"); };
    });
    $("s3ckpt").onchange = function () { s3render(); touch("s3"); };
    window.addEventListener("resize", s3fitLabels);
    s3render();
  }

  /* ================= STEP 4 · The Tasting Room ================= */
  var BETAS = [0.01, 0.02, 0.05, 0.1, 0.2, 0.3, 0.5, 0.75, 1];
  var S4DEF = { pc: -10, rc: -12, pr: -14, rr: -13, b: 3 };
  var PAIRS = [
    { pc: -10, rc: -12, pr: -14, rr: -13 }, { pc: -20, rc: -20, pr: -18, rr: -18 },
    { pc: -15, rc: -14, pr: -12, rr: -14 }, { pc: -8, rc: -11, pr: -16, rr: -12 },
    { pc: -25, rc: -24, pr: -20, rr: -22 }, { pc: -12, rc: -12.5, pr: -13, rr: -12 },
    { pc: -18, rc: -16, pr: -17, rr: -19 }, { pc: -9, rc: -10, pr: -11, rr: -11 }
  ];
  var s4 = { batch: null, steps: 0 };
  function s4beta() { return BETAS[+$("s4b").value]; }
  function s4vals() { return { pc: +$("s4pc").value, rc: +$("s4rc").value, pr: +$("s4pr").value, rr: +$("s4rr").value }; }
  function seesaw(margin) {
    var th = -Math.max(-0.38, Math.min(0.38, margin * 0.22));   // radians; chosen (left) sinks when margin > 0
    var cx = 160, cy = 62, L = 118, c = Math.cos(th), s = Math.sin(th);
    var lx = cx - L * c, ly = cy - L * s, rx = cx + L * c, ry = cy + L * s;
    function pan(x, y, good) {
      return '<path d="M' + x + " " + y + "v26" + '" stroke="#4A2E1E" stroke-width="2"/>' +
        '<ellipse cx="' + x + '" cy="' + (y + 30) + '" rx="34" ry="8" fill="#FFFDF6" stroke="#4A2E1E" stroke-width="2.5"/>' +
        (good ? '<path transform="translate(' + (x - 10) + " " + (y + 4) + ')" d="M10 0l3 6.5 7 .8-5.2 4.8 1.4 7L10 15.6 3.8 19.1l1.4-7L0 7.3l7-.8z" fill="#F4C430" stroke="#4A2E1E" stroke-width="1.8" stroke-linejoin="round"/>'
          : '<path d="M' + (x - 2) + " " + (y + 24) + "v-20l14 5-14 5" + '" fill="#C8452F" stroke="#4A2E1E" stroke-width="1.8" stroke-linejoin="round"/>') +
        '<text x="' + x + '" y="' + (y + 56) + '" text-anchor="middle" font-family="Patrick Hand" font-size="15" fill="#3A2418">' + (good ? "chosen" : "rejected") + "</text>";
    }
    return '<svg viewBox="0 0 320 170" width="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
      '<path d="M146 150l14-86 14 86z" fill="#B8793F" stroke="#4A2E1E" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<rect x="120" y="148" width="80" height="10" rx="3" fill="#DDBB8A" stroke="#4A2E1E" stroke-width="2.5"/>' +
      '<path d="M' + fmt(lx, 1) + " " + fmt(ly, 1) + "L" + fmt(rx, 1) + " " + fmt(ry, 1) + '" stroke="#4A2E1E" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M' + fmt(lx, 1) + " " + fmt(ly, 1) + "L" + fmt(rx, 1) + " " + fmt(ry, 1) + '" stroke="#F4C430" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="160" cy="62" r="5" fill="#C8452F" stroke="#4A2E1E" stroke-width="2"/>' +
      pan(lx, ly, true) + pan(rx, ry, false) +
      '<text x="160" y="22" text-anchor="middle" font-family="Grandstander" font-weight="700" font-size="17" fill="#3A2418">margin ' + sgn(margin, 2) + "</text></svg>";
  }
  function s4render() {
    var v = s4vals(), beta = s4beta();
    $("s4pcv").textContent = fnum(v.pc, 1); $("s4rcv").textContent = fnum(v.rc, 1);
    $("s4prv").textContent = fnum(v.pr, 1); $("s4rrv").textContent = fnum(v.rr, 1);
    $("s4bv").textContent = "β = " + beta;
    var d = FS.dpo(v.pc, v.rc, v.pr, v.rr, beta);
    $("s4rwc").textContent = sgn(d.rewardChosen, 3);
    $("s4rwr").textContent = sgn(d.rewardRejected, 3);
    $("s4m").textContent = sgn(d.margin, 3);
    $("s4p").textContent = fmt(d.prob, 3);
    $("s4l").textContent = fmt(d.loss, 3);
    $("s4g").textContent = fmt(d.gradWeight, 3);
    $("s4saw").innerHTML = seesaw(d.margin);
    var day1 = v.pc === v.rc && v.pr === v.rr;
    $("s4note").innerHTML = "Implicit reward = β × (cook now − day one): chosen " + beta + " × (" + fnum(v.pc, 1) + " − " + fnum(v.rc, 1) + ") = " + sgn(d.rewardChosen, 3) +
      "; rejected " + beta + " × (" + fnum(v.pr, 1) + " − " + fnum(v.rr, 1) + ") = " + sgn(d.rewardRejected, 3) + ". " +
      (day1 ? "<b>Day one:</b> the cook is the photo, both rewards are 0, and the loss is ln 2 = 0.693 whatever β is." :
        d.margin > 0 ? "The taster and the cook agree: the chosen plate has the higher implicit reward. The push fades as the margin grows (σ(−margin))." :
        "The cook still prefers the rejected plate relative to day one, so this pair pushes hard.");
  }
  function s4reset() { s4.batch = PAIRS.map(function (p) { return { pc: p.pc, rc: p.rc, pr: p.pr, rr: p.rr }; }); s4.steps = 0; }
  function s4batchRender() {
    var beta = s4beta();
    var rows = s4.batch.map(function (p, i) {
      var d = FS.dpo(p.pc, p.rc, p.pr, p.rr, beta);
      return '<tr class="' + (d.margin > 0 ? "rw-ok" : "rw-no") + '"><td>' + (i + 1) + "</td><td>" + fnum(p.pc, 3) + " <span class=\"muted\">/ " + fnum(p.rc, 1) + "</span></td><td>" + fnum(p.pr, 3) + " <span class=\"muted\">/ " + fnum(p.rr, 1) + "</span></td><td>" + sgn(d.margin, 3) + '</td><td class="' + (d.margin > 0 ? "ok" : "bad") + '">' + (d.margin > 0 ? "✓" : "✗") +
        '</td><td><span class="gw"><i style="width:' + (d.gradWeight * 100) + '%"></i></span> ' + fmt(d.gradWeight, 3) + "</td></tr>";
    }).join("");
    $("s4tab").innerHTML = "<thead><tr><th>pair</th><th>chosen: now / day one</th><th>rejected: now / day one</th><th>margin</th><th>right?</th><th>push</th></tr></thead><tbody>" + rows + "</tbody>";
    var b = FS.dpoBatch(s4.batch, beta);
    $("s4acc").textContent = fmt(b.rewardAccuracy * 100, 1) + "%";
    $("s4mm").textContent = sgn(b.meanMargin, 3);
    $("s4ml").textContent = fmt(b.meanLoss, 3);
    $("s4steps").textContent = s4.steps ? s4.steps + " step" + (s4.steps > 1 ? "s" : "") + " taken at β = " + beta : "β = " + beta;
  }
  /* The judge's scorecard: a reward model on the same pair. Same Bradley–Terry loss as DPO. */
  function s4jRender() {
    var c = +$("s4jc").value, r = +$("s4jr").value, d = FS.rewardPair(c, r);
    $("s4jcv").textContent = sgn(c, 1); $("s4jrv").textContent = sgn(r, 1);
    $("s4jd").textContent = sgn(d.delta, 2); $("s4jp").textContent = fmt(d.prob, 3); $("s4jl").textContent = fmt(d.loss, 3);
    $("s4jnote").innerHTML = "loss = −ln σ(" + sgn(c, 1) + " − " + (r < 0 ? "(" + sgn(r, 1) + ")" : sgn(r, 1)) + ") = −ln σ(" + sgn(d.delta, 2) + ") = <b>" + fmt(d.loss, 3) + "</b>. " +
      (Math.abs(d.delta) < 1e-9 ? "<b>Equal scores:</b> the judge is guessing, σ(0) = 0.5 and the loss is ln 2 = 0.693, the same starting point as DPO's."
        : d.delta > 0 ? "The judge agrees with the taster. A bigger gap is a more confident judge and a smaller loss; the push on the scores fades as the gap grows."
        : "The judge prefers the rejected plate, so the loss is above ln 2 and training pushes the two scores apart the other way.");
  }
  function initS4() {
    ["s4jc", "s4jr"].forEach(function (id) { $(id).oninput = s4jRender; $(id).onchange = function () { touch("s4"); }; });
    $("s4jsame").onclick = function () { $("s4jr").value = $("s4jc").value; s4jRender(); touch("s4"); };
    $("s4jshift").onclick = function () {
      var c = +$("s4jc").value, r = +$("s4jr").value, k = Math.max(c, r) + 2 <= 5 ? 2 : -2;   // stay inside the sliders' range
      $("s4jc").value = c + k; $("s4jr").value = r + k; s4jRender(); touch("s4");
    };
    s4jRender();
    ["s4pc", "s4rc", "s4pr", "s4rr", "s4b"].forEach(function (id) {
      $(id).oninput = function () { s4render(); s4batchRender(); };
      $(id).onchange = function () { touch("s4"); };
    });
    $("s4day1").onclick = function () { $("s4pc").value = $("s4rc").value; $("s4pr").value = $("s4rr").value; s4render(); touch("s4"); };
    $("s4def").onclick = function () { $("s4pc").value = S4DEF.pc; $("s4rc").value = S4DEF.rc; $("s4pr").value = S4DEF.pr; $("s4rr").value = S4DEF.rr; $("s4b").value = S4DEF.b; s4render(); s4batchRender(); touch("s4"); };
    s4reset();
    $("s4step").onclick = function () {
      var beta = s4beta();
      s4.batch.forEach(function (p) { var g = FS.dpo(p.pc, p.rc, p.pr, p.rr, beta).gradWeight; p.pc += 0.5 * g; p.pr -= 0.5 * g; });
      s4.steps++; s4batchRender(); touch("s4");
    };
    $("s4breset").onclick = function () { s4reset(); s4batchRender(); touch("s4"); };
    s4render(); s4batchRender();
  }

  /* ================= STEP 5 · The Day-One Photo ================= */
  var s5 = { m: "dpo", G: 8 };
  function s5opts() { return { lora: $("s5lora").checked, precompute: $("s5pre").checked, G: s5.G, beta: $("s5kl").checked ? 0.04 : 0 }; }
  function feet(n, cls, label) {
    var shown = Math.min(n, 16), h = "";
    for (var i = 0; i < shown; i++) h += '<i class="ft ' + cls + '"></i>';
    return '<div class="srow2"><span class="sl2">' + label + '</span><span class="fts">' + (n ? h : '<span class="muted">none</span>') + '</span><b>' + n + "</b></div>";
  }
  function s5render() {
    var m = s5.m;
    $("s5loraw").style.display = m === "sft" ? "none" : "";
    $("s5prew").style.display = m === "dpo" ? "" : "none";
    $("s5gw").style.display = m === "grpo" ? "" : "none";
    $("s5klw").style.display = m === "grpo" ? "" : "none";
    var o = s5opts(), p = FS.passes(m, o);
    $("s5steps").innerHTML = feet(p.F, "f", "forward passes (with gradients)") + feet(p.B, "b", "backward passes") + feet(p.refF, "r", "reference forwards (no gradients)") +
      feet(p.gen, "g", "answers sampled") + feet(p.copies, "c", "model copies in memory");
    $("s5tot").textContent = fmt(p.F + p.B + p.refF);
    $("s5gen").textContent = fmt(p.gen);
    $("s5cp").textContent = fmt(p.copies);
    var hint = { sft: "SFT has no reference: one pass forward over the example, one pass back.",
      dpo: "DPO scores two answers (chosen and rejected) under the cook and under the day-one photo.",
      grpo: "GRPO first samples G answers, then scores and updates all of them. TRL's default β = 0 loads no reference model." }[m];
    $("s5hint").innerHTML = hint;
    var note;
    if (m === "sft") note = "The baseline: <b>" + (p.F + p.B) + " passes</b> per example and one copy of the model.";
    else if (m === "dpo") {
      if (o.precompute) note = "<b>Precomputed:</b> the photo's scores for every chosen and rejected answer are worked out once before training and filed on index cards. The reference is frozen, so they never change: no reference passes during training, and no second copy.";
      else if (o.lora) note = "<b>LoRA:</b> the reference forwards still run, but on the <b>same weights with the adapter switched off</b>. One copy in memory.";
      else note = "<b>Plain DPO:</b> a second, frozen full copy of the model sits in memory just to be the photo, and it runs " + p.refF + " forward passes per example.";
      note += " Either way: " + (p.F + p.B) + " passes with gradients, twice SFT's " + (FS.passes("sft").F + FS.passes("sft").B) + ".";
    } else {
      note = "<b>" + p.gen + " answers are generated</b> before any scoring, and generation (one token at a time) usually dominates the bill. " +
        (o.beta > 0 ? "KL on: " + p.refF + " reference forwards per example" + (o.lora ? ", on the same weights with the adapter off." : ", on a second frozen copy.") : "KL off (TRL's default β = 0): no reference passes and no reference model at all.") +
        " No critic network in either case.";
    }
    $("s5note").innerHTML = note;
  }
  function initS5() {
    seg($("s5m"), [{ v: "sft", label: "SFT" }, { v: "dpo", label: "DPO" }, { v: "grpo", label: "GRPO" }], s5.m, function (v) { s5.m = v; s5render(); touch("s5"); });
    seg($("s5g"), [4, 8, 16].map(function (g) { return { v: g, label: "G = " + g }; }), s5.G, function (v) { s5.G = +v; s5render(); touch("s5"); });
    ["s5lora", "s5pre", "s5kl"].forEach(function (id) { $(id).onchange = function () { s5render(); touch("s5"); }; });
    s5render();
  }

  /* ================= STEP 6 · The Exam Hall ================= */
  var C12 = [{ c: true, n: true }, { c: false, n: true }, { c: true, n: false }, { c: false, n: true }];
  var POL = [[0.30, 0.42], [0.25, 0.20], [0.15, 0.17], [0.25, 0.14]];
  var s6 = { G: 4, plates: C12.map(function (p) { return { c: p.c, n: p.n }; }), scale: "group", pol: POL.map(function (x) { return x.slice(); }) };
  var s6G, s6S;
  function s6weights() {
    var a = parseFloat($("s6wa").value), f = parseFloat($("s6wf").value);
    return { a: isNaN(a) ? 0 : a, f: isNaN(f) ? 0 : f };
  }
  function s6rewards() { var w = s6weights(); return s6.plates.map(function (p) { return (p.c ? w.a : 0) + (p.n ? w.f : 0); }); }
  function s6adv() { return FS.grpoAdvantages(s6rewards(), null, s6.scale); }
  /* New plates copy the last plate, so a preset such as "everyone gets it right" survives a resize. */
  function s6resize(G) {
    var last = s6.plates[s6.plates.length - 1] || { c: true, n: true };
    while (s6.plates.length < G) s6.plates.push({ c: last.c, n: last.n });
    s6.plates.length = G;
  }
  function s6render() {
    var rw = s6rewards(), a = s6adv();
    var box = $("s6plates"); box.innerHTML = "";
    s6.plates.forEach(function (p, i) {
      var d = document.createElement("div");
      d.className = "plate" + (a.adv[i] > 1e-9 ? " up" : a.adv[i] < -1e-9 ? " dn" : "");
      d.innerHTML = '<div class="pn">o' + (i + 1) + '</div><button type="button" class="pt ' + (p.c ? "yes" : "no") + '" aria-pressed="' + p.c + '">' + (p.c ? "✓ says 14" : "✗ wrong number") + '</button><button type="button" class="pt ' + (p.n ? "yes" : "no") + '" aria-pressed="' + p.n + '">' + (p.n ? "neat tags" : "no tags") + '</button><div class="pr">reward <b>' + fmt(rw[i], 2) + '</b></div><div class="pa">A = <b>' + sgn(a.adv[i], 3) + "</b></div>";
      var bs = d.querySelectorAll("button");
      bs[0].onclick = function () { p.c = !p.c; s6render(); touch("s6"); };
      bs[1].onclick = function () { p.n = !p.n; s6render(); touch("s6"); };
      box.appendChild(d);
    });
    var mx = Math.max(1.5, Math.max.apply(null, a.adv.map(Math.abs)));
    $("s6chart").innerHTML = '<div class="chalk"><span>group mean ' + fmt(a.mean, 3) + "</span></div>" + a.adv.map(function (v, i) {
      var h = Math.abs(v) / mx * 50;
      return '<div class="acol"><i class="' + (v >= 0 ? "pos" : "neg") + '" style="height:' + h + "%;" + (v >= 0 ? "bottom:50%" : "top:50%") + '"></i><span class="an">o' + (i + 1) + "</span></div>";
    }).join("");
    $("s6mean").textContent = fmt(a.mean, 3);
    $("s6std").textContent = fmt(a.std, 4);
    var moving = a.adv.filter(function (v) { return Math.abs(v) > 1e-9; }).length;
    $("s6teach").textContent = moving + " of " + a.adv.length;
    s6clipRender(a);
    s6cmpRender();
  }
  function s6clipRender(a) {
    var eps = +$("s6e").value;
    $("s6ev").textContent = "ε = " + fmt(eps, 2) + " → ratio kept in [" + fmt(1 - eps, 2) + ", " + fmt(1 + eps, 2) + "]";
    var rows = s6.pol.map(function (pp, i) {
      var A = a.adv[i], t = FS.grpoTerm(pp[0], pp[1], A, eps);
      return "<tr><td>o" + (i + 1) + "</td><td>" + sgn(A, 3) + '</td><td><input type="number" step="0.01" min="0.01" max="1" value="' + pp[0] + '" data-i="' + i + '" data-j="0" aria-label="pi old o' + (i + 1) + '"></td><td><input type="number" step="0.01" min="0.01" max="1" value="' + pp[1] + '" data-i="' + i + '" data-j="1" aria-label="pi new o' + (i + 1) + '"></td><td>' + fmt(t.ratio, 2) + "</td><td>" + fmt(t.clippedRatio, 2) + "</td><td><b>" + sgn(t.term, 3) + '</b></td><td>' + (t.bit ? '<span class="bite">clip bit</span>' : '<span class="muted">no</span>') + "</td></tr>";
    }).join("");
    var tab = $("s6clip");
    tab.innerHTML = "<thead><tr><th>plate</th><th>A</th><th>π old</th><th>π new</th><th>ratio</th><th>clipped</th><th>term</th><th>clip?</th></tr></thead><tbody>" + rows + "</tbody>";
    qa("input", tab).forEach(function (inp) {
      inp.onchange = function () {
        var v = parseFloat(inp.value); if (isNaN(v) || v <= 0) v = 0.01; if (v > 1) v = 1;
        s6.pol[+inp.dataset.i][+inp.dataset.j] = v; s6clipRender(s6adv()); touch("s6");
      };
    });
  }
  var CMP = [
    { t: "Near-tie: all right, one slightly messier", r: [1, 1, 1, 0.9], l: ["right", "right", "right", "right, messier"] },
    { t: "Real split: half right", r: [1, 0, 1, 0], l: ["right", "wrong", "right", "wrong"] }
  ];
  function advTxt(v) { return sgn(v, Math.abs(v) > 1e-9 && Math.abs(v) < 0.1 ? 3 : 2); }
  function s6cmpRender() {
    $("s6cmp").innerHTML = CMP.map(function (q) {
      var a = FS.grpoAdvantages(q.r, null, s6.scale), lo = Math.min.apply(null, q.r);
      var low = Math.min.apply(null, a.adv);
      return '<div class="cmpq"><b>' + q.t + "</b><div class=\"cmprow\">" + q.r.map(function (r, i) {
        return '<span class="cmpp ' + (r >= 0.5 ? "yes" : "no") + (r === lo ? " fail" : "") + '">o' + (i + 1) + " · " + q.l[i] + " (" + fmt(r, r % 1 ? 1 : 0) + ")<em>A = " + advTxt(a.adv[i]) + "</em></span>";
      }).join("") + '</div><div class="muted hand">mean ' + fmt(a.mean, 3) + " · std " + fmt(a.std, 3) + (s6.scale === "none" ? " (not used)" : "") + " · lowest plate <b>" + advTxt(low) + "</b></div></div>";
    }).join("");
  }
  function initS6() {
    s6G = seg($("s6g"), [4, 8, 16].map(function (g) { return { v: g, label: "G = " + g }; }), s6.G, function (v) { s6.G = +v; s6resize(s6.G); s6render(); touch("s6"); });
    s6S = seg($("s6scale"), [{ v: "group", label: "yes (GRPO, TRL default scale_rewards='group')" }, { v: "none", label: "no (the std half of Dr. GRPO)" }], s6.scale, function (v) { s6.scale = v; s6render(); touch("s6"); });
    ["s6wa", "s6wf"].forEach(function (id) { $(id).addEventListener("input", s6render); $(id).addEventListener("change", function () { touch("s6"); }); });
    $("s6c12").onclick = function () {
      s6.G = 4; s6G.set(4); s6.plates = C12.map(function (p) { return { c: p.c, n: p.n }; });
      s6.scale = "group"; s6S.set("group"); $("s6wa").value = 1; $("s6wf").value = 0.5;
      s6.pol = POL.map(function (x) { return x.slice(); }); $("s6e").value = 0.2;
      s6render(); touch("s6");
    };
    $("s6all").onclick = function () { s6.plates.forEach(function (p) { p.c = true; p.n = true; }); s6render(); touch("s6"); };
    $("s6e").oninput = function () { s6clipRender(s6adv()); };
    $("s6e").onchange = function () { touch("s6"); };
    s6render();
  }

  /* ================= CAPSTONE · Graduation ================= */
  var CAP_BETAS = [0.001, 0.005, 0.01, 0.05, 0.1, 0.2, 0.5, 1];
  var BRIEFS = [
    { id: "bank", title: "1 · Brand-voice help desk",
      story: "A regional bank has <b>3,000 replies</b> its best agents wrote and compliance approved. It wants a small model that answers in exactly that tone and format. <b>Budget: free hardware only.</b>",
      brief: function () { return { signal: "demos", dataCount: 3000, budget: 0 }; } },
    { id: "ads", title: "2 · Headline polisher", data: true,
      story: "An ad agency's editors have picked the better of two headlines <b>12,000 times</b>. It wants a model that writes the headline editors would pick. <b>Budget: $200.</b>",
      brief: function (st) { return { signal: "pairs", dataCount: st.data === "week" ? 50 : 12000, budget: 200 }; } },
    { id: "sql", title: "3 · SQL answer bot",
      story: "A software company has <b>5,000 business questions</b>, each with a database that can run the query and check the answer. There are <b>no gold SQL queries to copy, only databases that can check an answer</b>. It wants a model that gets the numbers right. <b>Budget: $100.</b>",
      brief: function () { return { signal: "verifier", dataCount: 5000, budget: 100 }; } }
  ];
  var capState = {};
  function capAllDone() { return BRIEFS.every(function (b) { return store.briefs[b.id]; }); }
  function capStamp() {
    var done = capAllDone();
    $("capstamp").hidden = !done;
    if (done && !store.said.cap) { store.said.cap = true; save(); buildNav(); markNav(); }
    checkDiploma();
  }
  /* The diploma: all three clients hired and a field test of 6/8 or better. Dated the first time it's earned. */
  function checkDiploma() {
    var card = $("dipcard"); if (!card) return;
    var ok = capAllDone() && (store.meta.ftBest || 0) >= 6;
    if (ok && !store.meta.diploma) { var n = new Date(); store.meta.diploma = n.getFullYear() + "-" + ("0" + (n.getMonth() + 1)).slice(-2) + "-" + ("0" + n.getDate()).slice(-2); save(); }   // local date, not UTC
    card.hidden = !ok;
    if (ok) {
      var p = String(store.meta.diploma).split("-"), d = new Date(+p[0], +p[1] - 1, +p[2]);
      $("dipdate").textContent = "Awarded " + longDate(d);
      $("dipscore").textContent = "Field test " + store.meta.ftBest + " / " + FT.length;
    }
  }
  function capCard(b) {
    var st = capState[b.id] = { method: "sft", model: "smollm3-3b", lora: false, machine: "t4", beta: 4, G: 8, data: "all" };
    var card = document.createElement("div");
    card.className = "card";
    card.innerHTML = "<h3>" + b.title + (store.briefs[b.id] ? ' <span class="hired">hired</span>' : "") + '</h3><div class="brief">' + b.story + "</div>" +
      '<div class="pg"><div class="panel">' +
      '<div class="lbl">Class</div><div class="seg" data-c="method"></div>' +
      (b.data ? '<div class="lbl">Data</div><div class="seg" data-c="data"></div>' : "") +
      '<div data-show="dpo"><div class="sl"><div class="sl-h"><span>β (DPO leash)</span><b data-o="beta"></b></div><input type="range" min="0" max="' + (CAP_BETAS.length - 1) + '" step="1" value="' + st.beta + '" data-c="beta" aria-label="Beta"></div></div>' +
      '<div data-show="grpo"><div class="lbl">Group size G</div><div class="seg" data-c="G"></div></div>' +
      '<div class="lbl">Model</div><div class="seg" data-c="model"></div>' +
      '<label class="tg"><input type="checkbox" data-c="lora"><span class="sw"></span>LoRA (sticky notes, r = 16)</label>' +
      '<div class="lbl">Machine</div><div class="seg" data-c="machine"></div>' +
      '<div class="btnrow"><button class="act" type="button" data-c="go">Grade this plan</button></div>' +
      '</div><div class="capres" data-o="res"><div class="idle">' + ICONS.cap + '<b>No plan graded yet</b>Choose a class, a model and a machine, then grade it.</div></div></div>';
    function q(sel) { return card.querySelector(sel); }
    function vis() {
      q('[data-show="dpo"]').style.display = st.method === "dpo" ? "" : "none";
      q('[data-show="grpo"]').style.display = st.method === "grpo" ? "" : "none";
      q('[data-o="beta"]').textContent = "β = " + CAP_BETAS[st.beta];
    }
    seg(q('[data-c="method"]'), [{ v: "sft", label: "SFT" }, { v: "dpo", label: "DPO" }, { v: "grpo", label: "GRPO" }], st.method, function (v) { st.method = v; vis(); touch("cap"); });
    if (b.data) seg(q('[data-c="data"]'), [{ v: "all", label: "use all 12,000 pairs" }, { v: "week", label: "use only the 50 pairs labelled this week" }], st.data, function (v) { st.data = v; touch("cap"); });
    seg(q('[data-c="G"]'), [1, 4, 8, 16].map(function (g) { return { v: g, label: "G = " + g }; }), st.G, function (v) { st.G = +v; touch("cap"); });
    seg(q('[data-c="model"]'), MODEL_OPTS, st.model, function (v) { st.model = v; touch("cap"); });
    seg(q('[data-c="machine"]'), MACHINE_OPTS, st.machine, function (v) { st.machine = v; touch("cap"); });
    var br = q('[data-c="beta"]'); br.oninput = function () { st.beta = +br.value; vis(); }; br.onchange = function () { touch("cap"); };
    var lr = q('[data-c="lora"]'); lr.checked = st.lora; lr.onchange = function () { st.lora = lr.checked; touch("cap"); };
    q('[data-c="go"]').onclick = function () {
      var plan = { method: st.method, model: st.model, lora: st.lora, machine: st.machine };
      if (st.method === "dpo") plan.beta = CAP_BETAS[st.beta];
      if (st.method === "grpo") plan.G = st.G;
      var r = FS.scorePlan(b.brief(st), plan), x = machine(st.machine);
      var memRow = '<div class="check ' + (r.memGB <= x.usable ? "ok" : "no") + '"><span class="ic">' + (r.memGB <= x.usable ? "✓" : "✗") + "</span><div>Estimated training memory: " + fgb(r.memGB) + '<div class="why">' + esc(mLabel(x)) + " has about " + x.usable + " GB usable. " + (st.lora ? "LoRA r = 16 on all seven modules." : "Full fine-tune at 16 bytes per parameter" + (st.method === "dpo" ? ", plus a second, frozen bf16 copy of the model as DPO's reference." : ".")) + (st.method === "grpo" ? " The KV cache for the G sampled answers isn't counted." : "") + "</div></div></div>";
      var res = q('[data-o="res"]');
      if (r.pass) {
        res.innerHTML = '<div class="stampbox"><span class="stamp2">Hired</span></div>' +
          '<div class="check ok"><span class="ic">✓</span><div>Right class for the signal<div class="why">' + { sft: "Worked examples → the copying class.", dpo: "Preference pairs → the tasting room.", grpo: "A checker → the exam hall." }[st.method] + "</div></div></div>" + memRow +
          '<div class="check ok"><span class="ic">✓</span><div>Within budget</div></div>';
        if (!store.briefs[b.id]) { store.briefs[b.id] = true; save(); var h = card.querySelector("h3"); h.innerHTML += ' <span class="hired">hired</span>'; }
        capStamp();
      } else {
        res.innerHTML = r.fails.map(function (f) { return '<div class="check no"><span class="ic">✗</span><div>' + esc(f.split("the " + x.name).join(mLabel(x))) + "</div></div>"; }).join("") + memRow;
      }
      touch("cap");
    };
    vis();
    return card;
  }
  function initCap() {
    var box = $("capbriefs");
    BRIEFS.forEach(function (b) { box.appendChild(capCard(b)); });
    bindTips(box);
    capStamp();
  }

  /* ================= FIELD TEST ================= */
  var FULL3B = function () { return FS.fits(FS.trainMemory(FS.model("smollm3-3b"), { mode: "full", seq: 1024, batch: 1, ckpt: true }).totalGB); };
  var FT = [
    { ph: "e.g. 4.2", q: "Step 3: <b>Qwen3-1.7B</b>, LoRA with r = 8 on <b>q and v only</b>. How many trainable parameters, in millions (1 decimal)?",
      a: function () { return FS.loraParams(FS.model("qwen3-1.7b"), 8, ["q", "v"]) / 1e6; }, tol: 0.051, d: 1 },
    { ph: "e.g. 2.4", q: "Step 3: <b>SmolLM2-135M</b>, LoRA with r = 16 on all seven modules. What percentage of the model is trainable (1 decimal)?",
      a: function () { var m = FS.model("smollm2-135m"); return 100 * FS.loraParams(m, 16, FS.ALL_MODULES) / FS.paramCount(m); }, tol: 0.051, d: 1 },
    { ph: "e.g. 1.05", q: "Step 2: start from the default probabilities and grade <b>only the answer</b>, then tap \"cherry\" until its p is <b>0.95</b> instead of 0.25. What's the loss (2 decimals)?",
      a: function () { return FS.sftLoss(S2DEF.map(function (t) { return { p: t.t === "cherry" ? 0.95 : t.p, role: t.role }; }), true).loss; }, tol: 0.006, d: 2 },
    { ph: "e.g. 0.62", q: "Step 4: the default sliders, but with <b>β = 0.5</b>. What's P(chosen wins) (2 decimals)?",
      a: function () { return FS.dpo(S4DEF.pc, S4DEF.rc, S4DEF.pr, S4DEF.rr, 0.5).prob; }, tol: 0.006, d: 2 },
    { ph: "e.g. −0.40", q: "Step 6: load the <b>worked example</b> (divide by the spread: yes). What's plate <b>o3</b>'s advantage (2 decimals)?",
      a: function () { return FS.grpoAdvantages(C12.map(function (p) { return (p.c ? 1 : 0) + (p.n ? 0.5 : 0); })).adv[2]; }, tol: 0.006, d: 2 },
    { ph: "e.g. −0.120", q: "Step 6, the spread-divisor panel: the near-tie question (1, 1, 1, 0.9) with the divisor switched <b>off</b>. What's its lowest plate's advantage (3 decimals)?",
      a: function () { return Math.min.apply(null, FS.grpoAdvantages(CMP[0].r, null, "none").adv); }, tol: 0.005, d: 3 },
    { q: "Step 3: a <b>full fine-tune of SmolLM3-3B</b>. Which machine fits it?",
      choice: FS.MACHINES.map(mLabel).concat(["None of them"]),
      right: function () { var f = FULL3B(); for (var i = 0; i < f.length; i++) if (f[i].ok) return i; return FS.MACHINES.length; } },
    { ph: "e.g. 4", q: "Step 5: GRPO with the KL leash <b>off</b>. How many reference forward passes per example?",
      a: function () { return FS.passes("grpo", { G: 8, beta: 0 }).refF; }, tol: 0, d: 0 }
  ];
  function parseNum(v) { return parseFloat(String(v).replace(/[−–]/g, "-").replace(/[,%\s]/g, "").replace(/m$/i, "")); }
  function initFT() {
    $("ftq").innerHTML = FT.map(function (f, i) {
      var input = f.choice ? '<select id="ft' + i + '" aria-label="Answer ' + (i + 1) + '"><option value="">choose…</option>' + f.choice.map(function (c, j) { return '<option value="' + j + '">' + esc(c) + "</option>"; }).join("") + "</select>"
        : '<input type="text" inputmode="decimal" id="ft' + i + '" aria-label="Answer ' + (i + 1) + '" placeholder="' + esc(f.ph || "") + '">';
      return '<div class="fq"><div class="fqt"><span class="num">' + (i + 1) + ".</span> " + f.q + "</div>" + input + '<span class="res" id="ftr' + i + '"></span></div>';
    }).join("");
    FT.forEach(function (f, i) { if (store.ft[i] != null) $("ft" + i).value = store.ft[i]; });
    $("ftgo").onclick = function () {
      var score = 0;
      FT.forEach(function (f, i) {
        var v = $("ft" + i).value, ok, truth;
        store.ft[i] = v;
        if (f.choice) { var rt = f.right(); ok = v !== "" && +v === rt; truth = f.choice[rt]; }
        else { var t = f.a(), n = parseNum(v); ok = v !== "" && !isNaN(n) && Math.abs(n - t) <= f.tol + 1e-12; truth = fnum(Math.abs(t) < 1e-9 ? 0 : t, f.d); }
        if (ok) score++;
        $("ftr" + i).innerHTML = v === "" ? '<span class="muted">skipped</span>' : ok ? '<span class="ok">✓ right</span>' : '<span class="bad">✗</span> <span class="muted">answer: ' + esc(truth) + "</span>";
      });
      store.meta.ftBest = Math.max(store.meta.ftBest || 0, score);
      save();
      $("ftscore").innerHTML = "<b>" + score + " / " + FT.length + "</b>" + (score === FT.length ? " · you're finished." : score >= 6 ? " · nearly there." : "");
      if (score >= 6 && !store.said.ft) { store.said.ft = true; save(); buildNav(); markNav(); }
      checkDiploma();
      if (!$("dipcard").hidden && score >= 6) $("dipcard").scrollIntoView({ behavior: "smooth", block: "start" });
    };
    $("dipprint").onclick = function () { window.print(); };
    checkDiploma();
    $("reset").onclick = function () { try { localStorage.removeItem(KEY); } catch (e) {} try { history.replaceState(null, "", location.pathname); } catch (e) {} location.reload(); };
  }

  /* ---------------- art ---------------- */
  function renderArt() {
    var A = window.FS_ART || {};
    /* The inner wrapper carries the paper grain, so on a phone the grain scrolls with the picture. */
    qa(".scene[data-art]").forEach(function (el) {
      var s = A[el.dataset.art];
      if (typeof s === "string" && s && !el.firstChild) {
        el.innerHTML = '<div class="scene-in">' + s + "</div>";
        var hint = document.createElement("div");
        hint.className = "swipe-hint"; hint.setAttribute("aria-hidden", "true"); hint.textContent = "swipe the picture →";
        el.parentNode.insertBefore(hint, el.nextSibling);
      }
    });
  }

  /* ---------------- boot ---------------- */
  renderArt();
  qa(".kmap .k[data-i]").forEach(function (el) { el.innerHTML = ICONS[el.dataset.i] || ""; });
  buildNav();
  initPredicts();
  /* Each step boots on its own, so one failing panel can't blank the whole page. */
  [initS0, initS1, initS2, initS3, initS4, initS5, initS6, initCap, initFT].forEach(function (init) {
    try { init(); } catch (e) { if (window.console) console.error("Finishing School: a step failed to start", e); }
  });
  bindTips(document);
  sections.forEach(function (s) { checkSay(s.id); });
  function hashId() { return (location.hash || "").replace(/^#\/?/, ""); }
  var start = hashId(), legacyHash = !!location.hash && location.hash.indexOf("#/") !== 0;
  var startOk = !!($(start) && $(start).tagName === "SECTION");
  /* A legacy #s3 link is rewritten to #/s3 before parsing finishes, so the browser's later
     fragment-jump attempts find no target. */
  if (legacyHash) { try { history.replaceState(null, "", location.pathname + location.search + (startOk ? "#/" + start : "")); } catch (e) {} }
  show(startOk ? start : "s0");
  try { if ("scrollRestoration" in history) history.scrollRestoration = "manual"; } catch (e) {}
  if (legacyHash && startOk) {
    /* Fallback for a jump the browser had already queued before this script ran: Chrome applies it on
       the first layout after load (typically when the web fonts arrive), so reset once after that. */
    window.addEventListener("load", function () {
      var top = function () { window.scrollTo(0, 0); };
      setTimeout(top, 0);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { requestAnimationFrame(function () { requestAnimationFrame(top); }); });
    });
  }
  window.addEventListener("hashchange", function () {
    var id = hashId();
    if ($(id) && $(id).tagName === "SECTION" && !$(id).classList.contains("on")) show(id);
  });
  window.FSApp = { show: show, BRIEFS: BRIEFS, FT: FT };
})();
