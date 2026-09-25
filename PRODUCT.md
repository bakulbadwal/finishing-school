# Product

## Platform

web

## Stack

Static HTML/CSS/JS, no build step, no dependencies. Hosted on GitHub Pages from `main` (https://bakulbadwal.github.io/finishing-school/). Must also work opened straight from the file.

## Users

Primary: the author, an MBA (UVA Darden '27) who knows the AI stack at a map level and wants to *learn post-training by playing* before working through the Hugging Face smol course and LLM Course chapters 11–12 hands-on. Secondary: people he shares it with (as a portfolio piece next to Inference Kitchen).

## Product Purpose

Teach how a pretrained model gets finished (chat templates, loss masking, LoRA, DPO, GRPO) through direct manipulation: sliders, toggles, predict-then-reveal questions, a scored capstone and an auto-graded field test. Success: after ~90 minutes he can say, for any client brief, which method to use, what data it needs, what it costs to run and which knob breaks it.

## Positioning

The sequel to Inference Kitchen. The Kitchen teaches how a trained model is **served**, and its step 6 ends on "training is a different machine". This lab is that machine. Existing material is either papers and library docs (engineer-grade) or one-line explainers. This one is for operators: one governing analogy (a culinary finishing school), the exact math behind each method, and a capstone where you choose the method for real-sounding clients.

## Operating Context

Used at a laptop in study sessions and on a phone when shared. Steps run 0–6, then the capstone and field test; people also jump between them. Progress persists in localStorage.

## Capabilities and Constraints

- Seven steps (0–6), a capstone and a field test. Every number comes from `js/core.js` (pure functions, `window.FS`); `ACCEPTANCE.md` lists the verified values.
- Model shapes come from each model's Hugging Face `config.json` and must stay credited.
- The honesty note (what's exact vs a teaching model) must remain.
- The finishing-school analogy is the confirmed vocabulary: the model = a young cook; SFT = the copying class; chat template = the order ticket; loss mask = the red pen that grades only the answer; LoRA = sticky notes on the recipe book; DPO = the tasting room; reference model = the day-one photo; β = the leash; GRPO = the exam hall; verifier = the thermometer.

## Brand Commitments

- Name: **Finishing School**.
- Shares Inference Kitchen's recorded design system (`DESIGN.md`): Busytown cutaway in flat gouache on paper.
- Must not look like "every AI tool" (dark ground, neon or gold accent, glowing cards) or a corporate SaaS dashboard.

## Evidence on Hand

Hugging Face *a smol course* Units 1–2; Hugging Face *LLM Course* ch. 11–12; Nathan Lambert, *RLHF Book*; the DPO, DeepSeekMath, Dr. GRPO and LoRA papers; the SmolLM3-3B model card; TRL docs. No testimonials, users or metrics exist; don't invent any.

## Product Principles

1. Play first, prose second. Every concept is something you move.
2. Honest about models: exact where exact, labelled where simplified.
3. One analogy, used consistently, fading into the real terms.
4. Where a course and the paper disagree (DPO's β), say so and follow the paper.
