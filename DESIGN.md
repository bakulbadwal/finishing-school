---
name: Finishing School
description: A hands-on lab for how a pretrained model gets finished (SFT, DPO, GRPO), drawn as a Busytown cutaway of a culinary finishing school in flat gouache on paper. Design system inherited from Inference Kitchen.
colors:
  paper: "#FBF7EC"
  sheet: "#FFFDF6"
  cream-board: "#FFF6DC"
  butter-hover: "#FFF1C6"
  rule: "#E7DCC4"
  ink: "#3A2418"
  line: "#4A2E1E"
  soft: "#6E5040"
  school-bus-yellow: "#F4C430"
  brick: "#C8452F"
  grass: "#5FA03C"
  sky: "#9CCBEA"
  sand: "#DDBB8A"
  lilac: "#B8A3DC"
  steel: "#B9BDC2"
  wood: "#B8793F"
  brick-d: "#A5321F"
  grass-d: "#3B7422"
  sky-d: "#246A9C"
  yellow-d: "#8A6300"
  note-yellow: "#FFF1A8"
  chalkboard: "#2F4A3A"
  chalk: "#E9F1E4"
  scene-sky: "#E5F2FA"
  tint-info: "#EAF4FB"
  tint-warn: "#FFF3CC"
  tint-alarm: "#FBE3DC"
  tint-ok: "#E7F3DE"
  right-green: "#BFE3A6"
  wrong-rose: "#F4B7A7"
  tint-sand: "#EDE3CF"
  tint-steel: "#E4E1DB"
  tint-lilac: "#EEE8F8"
  chalk-dim: "#CFE2C4"
  chalkboard-raised: "#43614F"
  step-sign-tint: "#C9B8E6"
typography:
  display:
    fontFamily: "Grandstander, 'Patrick Hand', system-ui, sans-serif"
    fontSize: "42px"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "0.01em"
  headline:
    fontFamily: "Grandstander, 'Patrick Hand', system-ui, sans-serif"
    fontSize: "29px"
    fontWeight: 800
    lineHeight: 1.15
  title:
    fontFamily: "'Patrick Hand', Kalam, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.2
  readout:
    fontFamily: "Grandstander, 'Patrick Hand', system-ui, sans-serif"
    fontSize: "23px"
    fontWeight: 800
    lineHeight: 1.15
    fontFeature: "tnum"
  body:
    fontFamily: "Andika, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Patrick Hand', Kalam, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.3
rounded:
  tag: "4px"
  field: "7px"
  sign: "8px"
  board: "10px"
  card: "12px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "12px"
  lg: "18px"
  xl: "20px"
components:
  button-act:
    backgroundColor: "{colors.school-bus-yellow}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.board}"
    padding: "8px 20px 9px"
  button-ghost:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sign}"
    padding: "6px 13px 7px"
  button-ghost-hover:
    backgroundColor: "{colors.butter-hover}"
  seg-option:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.field}"
    padding: "4px 10px 5px"
  seg-option-on:
    backgroundColor: "{colors.sky}"
  nav-sign:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sign}"
    padding: "10px 8px 6px"
  card:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "20px 20px 16px"
  panel:
    backgroundColor: "{colors.cream-board}"
    rounded: "{rounded.board}"
    padding: "14px"
  price-tag:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.readout}"
    rounded: "{rounded.sign}"
    padding: "22px 8px 9px"
  sticky-note:
    backgroundColor: "{colors.note-yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tag}"
    padding: "16px 16px 14px"
  chalkboard:
    backgroundColor: "{colors.chalkboard}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.board}"
    padding: "14px 18px"
  text-field:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: "7px 10px"
  footer:
    backgroundColor: "{colors.brick}"
    textColor: "{colors.paper}"
    padding: "8px 14px"
---

# Design System: Finishing School

> Inherited unchanged from its sibling lab, [Inference Kitchen](https://github.com/bakulbadwal/inference-kitchen), so the two read as one series. Where this document says "kitchen", read "school": the cutaway is a culinary finishing school, and the cast is the cook (the model), the red-pen teacher, the taster, the day-one photo and the exam-hall thermometer.

## Overview

**Creative North Star: "The Cutaway Kitchen"**

Every surface is a page from a Busytown cross-section spread: flat gouache fields painted on warm paper, outlined in one warm brown, where every worker and object wears its label. The interface is part of the same picture. Buttons are painted signs, readouts are price tags hung on a nail, predictions are sticky notes taped to the page, takeaways are chalked on a wood-framed board, and the glossary is a café menu board. Nothing is a floating glass card or a dashboard tile; everything is an object that could sit in the kitchen.

Density is moderate and legible first. Numbers are the payload of the product, so readouts get the heaviest face and tabular figures, and the world's texture (grain, mottle, wobble) is applied to paper and pictures, never over a number. The system rejects the dark "every AI tool" look (dark ground, neon or gold accent, glowing cards) and the corporate SaaS dashboard; both are user-confirmed anti-references in PRODUCT.md.

**Key Characteristics:**
- Warm paper ground (paper) with a fine fractal-noise grain on the body.
- One outline colour everywhere: warm brown line, 2 to 2.5px on UI, 1 to 3px in scenes.
- Saturated primaries used as whole flat fields, each with a darker partner for text.
- Three hand-lettered faces with fixed jobs: Grandstander signs, Patrick Hand labels, Andika body.
- Depth by hard, offset, un-blurred shadows, like cut paper, never by blur or glow.
- One illustrated 960x400 cutaway per step, every object labelled with a hairline pointer.

## Colors

A picture-book set of flat primaries (school-bus yellow, brick, grass, sky) plus secondary lilac, sand, steel and wood, all painted on cream paper and held together by a single warm-brown outline.

### Primary
- **School-Bus Yellow** (school-bus-yellow): the action colour. Primary action buttons, slider thumbs, lit prefill tokens, the first step sign's tint, the takeaway tag once revealed, and underline accents in "Covers" chips.
- **Brick Red** (brick): the masthead signboard, the fixed footer strip, the wavy glossary underline, the overflow stripe on the memory counter, and roofs and awnings in scenes. It is a field colour, not a text colour.

### Secondary
- **Grass Green** (grass): "on" state of toggles, total-throughput and success fields, scene foliage and shop awnings.
- **Sky Blue** (sky): selected segment option, decoded output tokens, KV-cache ticket stripe, the sticky-note tape, scene windows and water.

### Tertiary
- **Lilac** (lilac), **Sand** (sand), **Steel** (steel), **Wood** (wood): step-sign tints, Main Street storefront bands, slider track (sand), chalkboard frame (wood), steel appliances and GPU bodies in scenes.

### Neutral
- **Paper** (paper): the page ground and the lettering colour on painted signs in scenes.
- **Sheet** (sheet): card, button, field and price-tag faces; one step lighter than paper so objects sit on the page.
- **Cream Board** (cream-board): inset boards inside cards: control panels, token trays, the menu board, the capstone idle state.
- **Butter** (butter-hover): hover fill for ghost buttons, the "hot" storefront, and inline code.
- **Rule** (rule): the dashed nav baseline and chart gridlines.
- **Ink** (ink): body text and headings.
- **Line** (line): every outline, border, offset shadow, and scene stroke.
- **Soft Brown** (soft): secondary text, labels, captions, muted axis text.

### Text partners
- **brick-d, grass-d, sky-d, yellow-d**: the darker partner of each primary, used whenever that hue carries text or a thin line on paper (card h3s and glossary heads in brick-d, "good" readouts in grass-d, links and focus rings in sky-d, "warn" readouts in yellow-d). Each clears 4.5:1 on paper.

### Surfaces with their own world
- **Note Yellow** (note-yellow), **Chalkboard** (chalkboard) with **Chalk** (chalk), **Scene Sky** (scene-sky, the backdrop behind each cutaway), and the four callout tints (tint-info, tint-warn, tint-alarm, tint-ok) with the answer fills right-green and wrong-rose.

### Added for Finishing School
Six tints the lab needed beyond the Kitchen's set, each defined as a custom property in `:root` (`--tint-sand` and so on) and used through the variable, never as a literal hex.
- **tint-sand** `#EDE3CF`: the ground floor ("Arrivals") on the ladder, the base cook's plate in step 0, and prompt tokens in step 2.
- **tint-steel** `#E4E1DB`: masked (ungraded) tokens in step 2.
- **tint-lilac** `#EEE8F8`: the DPO cook's plate in step 0, keyed to the lilac Tasting Room floor in the scene. The four cooks' plates follow the scene's floors: base tint-sand, SFT tint-ok, DPO tint-lilac, GRPO tint-info (sky floor).
- **chalk-dim** `#CFE2C4`: secondary chalk text on chalkboards (the locked takeaway tag, the exam question's aside).
- **chalkboard-raised** `#43614F`: inline code on a chalkboard.
- **step-sign tint** `#C9B8E6`: the ninth nav sign (Field Test).

### Named Rules
**The Partner Rule.** A primary never sets text on paper. Fields take the primary; words, thin lines and numbers take its `-d` partner.

**The Whole-Field Rule.** Colour is applied as flat, whole shapes: a sign, a roof, a stripe. No gradients, no glows, no tinted transparency washes except the three paper overlays (body grain, scene mottle, scene grain).

## Typography

**Display Font:** Grandstander 700/800 (fallback Patrick Hand, system-ui)
**Label Font:** Patrick Hand 400 (fallback Kalam, system-ui)
**Body Font:** Andika 400/700 (fallback system-ui, -apple-system, Segoe UI)

**Character:** A chunky rounded sign-painter's display, a quick felt-pen hand for anything that reads as a label on an object, and a plain, very legible schoolbook sans for explanations. The three never swap jobs.

### Hierarchy
- **Display** (Grandstander 800, 42px, 1.05, text-shadow 2px 2px 0 in deep brick): the masthead signboard only; 36px at 720px and below.
- **Headline** (Grandstander 800, 29px, 1.15, balanced wrap): page h1 and each step's card h2; 24px (h1) at 720px, 25px (h2) at 480px.
- **Title** (Patrick Hand 400, 22px, 1.2, brick-d): card h3 sub-heads.
- **Readout** (Grandstander 800, 23px, tabular figures; 30px for the big variant): numbers on price tags; 20/25px at 480px.
- **Body** (Andika 400, 16px, 1.6): explanations, capped at 70ch in ledes; 14.5 to 15.5px in callouts and check rows.
- **Label** (Patrick Hand 400, 14.5 to 17px): buttons, slider headers, legends, chart captions, nav signs, the footer, tooltip kitchen-equivalents.

### Named Rules
**The Three Jobs Rule.** Grandstander is for signs and numbers, Patrick Hand is for labels written on objects, Andika is for sentences. A paragraph is never set in Patrick Hand; a readout is never set in Andika.

**The Tabular Readout Rule.** Every live number uses the sign face with tabular figures so it does not jitter while a slider moves.

## Layout

A single centred column (max 1080px, 18px/16px padding) that reads like a picture-book spread: masthead signboard left with headline right, a row of painted step signs over a dashed baseline, then one section per step. Each step opens with a full-width cutaway scene inside its first card, then cards stack with 18px between them.

Interactive steps use a controls-and-stage grid: a 300px control column beside a flexible stage, collapsing to one column at 840px. Readout rows use 2, 3 or 4 equal columns with a 12px gap; 2 and 3 collapse to one column at 760px, 4 collapses to two. Main Street storefronts are a 4-up grid that becomes 2-up at 760px.

Spacing is a loose hand-set rhythm around 6 / 10 / 12 / 18 / 20px rather than a strict scale; paddings are deliberately uneven top-to-bottom (for example 10px 8px 6px on nav signs, 22px top on price tags) to make room for tints, nails and tape.

**Responsive.** At 600px and below, the step signs become one swipeable row (no wrap, horizontal scroll, snap to each sign) and the fixed brick footer becomes a static footer at the end of the page, releasing the 68px bottom padding. At 480px card padding tightens to 14px 12px and headline and readout sizes step down.

### Named Rules
**The One Scene Per Step Rule.** Each step gets exactly one cutaway illustration, full card width, at the top of its first card. Scenes are not repeated as decoration elsewhere.

## Elevation & Depth

Depth is cut paper, not light. Objects sit on the page with a hard, offset, un-blurred shadow in translucent or solid line brown; nothing floats on a blur. The scale is short: a soft lift for sheets and scenes, a solid ink offset for pressable things, and an inset tint band for signs.

### Shadow Vocabulary
- **Lift** (`box-shadow: 3px 4px 0 rgba(74,46,30,.16)`): cards, scenes, the masthead, chalkboard. The page's resting depth.
- **Ink offset** (`box-shadow: 2px 3px 0 #4A2E1E`, growing to `3px 4px 0` on hover and collapsing to `0 0 0` on press): the primary action button. Ghost buttons and prediction options use `1px 2px 0 #4A2E1E`.
- **Sticky-note lift** (`box-shadow: 3px 4px 0 rgba(74,46,30,.2)`), and the tooltip at `.25`.
- **Tint band** (`box-shadow: inset 0 6px 0 <tint>`): the painted top edge of each step sign; 9px on storefront cards.
- **Sign shadow in scenes**: a dark copy of the sign lettering offset by 2px (translate 2,2) under the paper-coloured lettering.

### Named Rules
**The No-Blur Rule.** Shadows have zero blur radius. Pressing a button moves it into its shadow; there is no glow state anywhere.

## Shapes

Softly rounded, hand-cut rectangles with a visible outline on every object: 4px for paper notes, 7px for fields and segment options, 8px for signs, tags and canvases, 10px for boards and panels, 12px for cards and scenes. Borders are 2.5px on primary objects (cards, scenes, action buttons, nav signs) and 2px on secondary ones; 1.5px only for tiny chips and swatches.

Recurring silhouettes: a slight tilt on things that are pinned or hung (masthead -1.5deg, active step sign -1deg, sticky note -0.4deg, tape +2deg); a punched nail hole on price tags; a zig-zag torn bottom on order tickets; dashed borders for placeholders and trays (token trays, the idle state, the "Covers" chip); dotted dividers between rows on boards and checklists.

## Components

### Buttons
Tactile painted signs that press into their shadow.
- **Shape:** gently rounded (10px action, 8px ghost) with a solid line-brown outline (2.5px action, 2px ghost).
- **Primary (action):** school-bus yellow face, ink text in Grandstander 700 18px, 8px 20px 9px padding, ink offset shadow.
- **Hover / Active:** lifts 1px up-left as the shadow grows; on press slides 2px 3px into a zero shadow. Transitions are 0.1s.
- **Ghost:** sheet face, Patrick Hand 16px, 1px 2px ink offset; butter fill on hover.
- **Focus:** 3px sky-d outline, 2px offset, on every button.

### Segmented options
- **Style:** a wrapping row of small sheet signs (2px outline, 7px radius, Patrick Hand 16px).
- **State:** selected fills with sky and an inner bottom shade; hover lifts 1px; disabled drops to 40% opacity.

### Toggles and sliders
- **Toggle:** a sand track with a sheet knob, both outlined; checked fills the track with grass and slides the knob 17px.
- **Slider:** a 10px sand track with a 2px outline and a 24px school-bus-yellow thumb with a 1px 2px ink offset; slider headers are Patrick Hand in soft with the live value in Grandstander ink.

### Inputs / Fields
- **Style:** sheet face, 2px line outline, 7px radius, Andika 16px.
- **Focus:** 3px sky-d outline, 1px offset.

### Cards / Containers
- **Card:** sheet face, 2.5px line outline, 12px radius, lift shadow, 20px 20px 16px padding.
- **Panel:** cream-board inset inside a card, 2px outline, 10px radius, 14px padding.
- **Callout (pinned sign):** sheet or tinted face (tint-info, tint-warn, tint-alarm, tint-ok), 2px outline, 8px radius, Andika 15px.

### Footer
A brick strip fixed to the bottom edge with a 2.5px line top border and Patrick Hand 15px credits, centred. Its lettering is paper (4.5:1 on brick); the build's lighter #FFF1DE measures 4.34:1 and is not the system value.

### Navigation (painted street signs)
A wrapping row of sheet signs over a 3px dashed rule baseline. Each sign carries a drawn 20px icon (bell, counter, dial, chef, buildings, shop, star, pencil) and its step title in Patrick Hand 16px, with a 6px inset tint band across the top. Tints run in order: yellow, coral, leaf, sky, lilac, sand, salmon, mint. Hover lifts 2px; the active sign fills entirely with its tint, lifts 3px and tilts -1deg. A completed step shows a grass-d check. At 600px and below the row becomes a single swipeable strip.

### Drawn icons
24x24 viewBox, flat primary fills, 1.8px line-brown stroke with round joins and caps. They are small scenes objects, not glyphs; the same set appears in the nav, the menu board and the capstone idle state.

### Price-tag readouts
A sheet tag with a 2px outline, 8px radius and a paper-coloured nail hole punched at top centre. The value is Grandstander 800 23px tabular (30px big variant), coloured by meaning: grass-d good, yellow-d warn, brick-d bad, sky-d accent, a deep ochre for "stove-bound". The label beneath is Patrick Hand 14.5px in soft.

### Sticky-note predictions
A note-yellow square, 4px radius, 2px outline, sticky-note lift, tilted -0.4deg, with a strip of translucent sky-blue tape across the top. A brick-d sign-face tag, a bold Andika question, then ghost-style answer options. Answering fills the right option with right-green and strikes the wrong one through on wrong-rose; the explanation rises in below a dashed rule.

### Chalkboard takeaways
A dark green board inside a 6px wood frame with an inset line and the lift shadow. A Patrick Hand tag in chalk green, and the takeaway in Grandstander 700 21px in sheet, blurred 6px until the learner opens it; once open, the tag turns school-bus yellow.

### Menu-board glossary
A cream-board board with an auto-fit grid of 220px columns and dotted row dividers. Each row: a 26px drawn icon, the real term in Grandstander brick-d, "= the kitchen thing" in Patrick Hand, and a soft one-line gloss. In running text, glossary terms carry a wavy 1.5px brick underline and open a sheet tooltip (2.5px outline, tooltip lift) with the term in brick-d and the kitchen equivalent below a dotted rule. (As built, that kitchen line is prefixed with a frying-pan emoji; it breaks the no-emoji rule and should become the drawn chef icon at 16px.)

### Main Street storefront cards
Four sheet shopfronts, 2.5px outline, 8px radius, each with a 9px inset awning band (steel, grass, sky, lilac). Name in Grandstander 19px, examples in Patrick Hand soft. The highlighted shop turns butter and rises 4px; the others fade to 45%.

### Capstone check rows and idle state
- **Check rows:** a 26px outlined circle badge (right-green with a grass-d mark, or wrong-rose with a brick-d mark), Andika text, a soft reason line, dotted dividers.
- **Idle state:** a 360px-tall cream-board area with a 2.5px dashed faint outline, the 120px chef icon, a Grandstander heading ("The pass is empty") and Patrick Hand guidance. It is the empty state, not a spinner.

### Charts
Canvas charts sit on a sheet face with a 2px outline and 8px radius. Gridlines are 1px rule; axis text is Patrick Hand 14px in soft. Data lines are 2.2px in the partner colours (sky-d for per-user speed, grass-d for total throughput); thresholds are dashed (5 4) verticals; the "doesn't fit" region is a flat 13% brick wash; the current setting is a 5px dot on each line. Captions sit below in Patrick Hand 15px with inline outlined swatches. Chart text follows The Partner Rule too: the build's gold threshold colour (#C98A0B, 2.75:1 on sheet) is fine as a dashed line but is not a text colour; label a threshold in yellow-d.

### Illustrated cutaway scenes
- **Frame:** viewBox 960x400, scaled to full card width, on scene-sky inside a 2.5px outlined, 12px-radius frame with the lift shadow.
- **Line:** every shape is outlined in line brown (#4A2E1E), mostly 1.5 to 2px, heavier for silhouettes.
- **Fill:** only the palette primaries, secondaries, paper and sheet, plus three skin tones (#F1C9A5, #D9A27A, #9C6B4A); flat fills, no gradients.
- **Workers:** volumetric cartoon people (rounded bodies, visible hands and faces, chef hats and aprons), not stick figures or flat pictograms.
- **Labels:** every object carries a Patrick Hand label joined to it by a 1px line-brown hairline pointer.
- **Signs:** the scene title is uppercase Grandstander 800 in paper colour on a painted board. Sign lettering 20px and larger gets a 2px dark offset copy beneath it; smaller signs do not.
- **Texture:** the `#gouache` filter (fractal noise, displacement scale 1.3) wobbles every edge; a multiplied overlay of pigment mottle and paper grain sits over the scene at 34% opacity.

### Motion
One gesture per event. Changing step, the section rises 8px into place over 0.35s (cubic-bezier .16,1,.3,1). Each decoded token "plates" in: it drops from 14px above at 70% scale over 0.32s. Meters fill by scaleX over 0.35s on the same curve. Hover lifts are 1 to 4px over 0.1 to 0.2s. `prefers-reduced-motion` removes every animation and transition.

## Do's and Don'ts

### Do:
- **Do** outline every object in line brown (#4A2E1E): 2.5px on primary UI objects, 2px on secondary ones, 1.5 to 2px in scenes.
- **Do** put text in the `-d` partner of a hue and keep the bright primary for the field (The Partner Rule).
- **Do** give depth with a zero-blur offset shadow (3px 4px 0 at 16% line brown for sheets, solid line brown for pressable buttons).
- **Do** set every live number in Grandstander 800 with tabular figures, on a sheet surface with no texture over it.
- **Do** draw one 960x400 cutaway per step, label every object with a hairline pointer, and give 20px-and-up sign lettering a 2px dark offset copy.
- **Do** use drawn SVG icons (24x24, 1.8px line stroke, flat primary fills) wherever an icon is needed.
- **Do** keep one motion per event: the section rise on step change, the plate pop on decode.
- **Do** make the step signs a swipeable single row and release the fixed footer at 600px and below.

### Don't:
- **Don't** use the dark "every AI tool" look: dark ground, neon or gold accent, glowing cards.
- **Don't** use corporate SaaS dashboard chrome: grey sidebars, flat KPI tiles, hairline-bordered data tables, blue primary buttons.
- **Don't** use emoji anywhere; icons are drawn in the scene style. Plain typographic marks (check, cross, star, arrow, return) are allowed as text. The one emoji in the build (the glossary tooltip's frying pan) is a known deviation, not precedent.
- **Don't** use gradients inside scenes; colour is flat and whole. The only multi-colour fills in UI are the hard-stop stripe patterns on the memory counter.
- **Don't** blur a shadow or add a glow, including on hover and focus.
- **Don't** put the paper grain, mottle overlay or gouache wobble over a number, a chart, or body text.
- **Don't** add a 2px offset shadow to sign lettering under 20px; at label size it muddies the letters.
- **Don't** set sentences in Patrick Hand or signs in Andika.
