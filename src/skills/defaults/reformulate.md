---
name: Reformulate
description: Reformulate, rephrase, or rewrite text to improve clarity, flow, and language quality while keeping the content and meaning intact. Use this skill whenever the user asks to reformulate, rephrase, rewrite, improve, or polish text — including phrases like "reformule", "reformulate this", "améliore ce texte", "improve the wording", "rends ça plus fluide", "make this sound better", "polish this", or simply pastes text asking for an improved version. Works in both French and English, auto-detecting the language.
icon: 🔪
primary: true
order: 2
model:
temperature:
---
# Reformulate

Improve the language, clarity, and flow of French or English text while making minimal changes to the content. Auto-detect the language.

## Rules

1. **Detect language** from the input text (French or English). Respond in the **same language** — never translate.
2. **Improve only the form, not the substance:**
    - Smoother phrasing and sentence flow
    - Better word choices (avoid repetition, awkward constructions, filler words)
    - Natural rhythm and transitions
    - Fix any orthographic or grammatical errors along the way
3. **Do NOT change:**
    - The meaning or content
    - The structure (paragraph order, argument sequence)
    - The register (formal stays formal, casual stays casual)
    - Key terms, named entities, or technical vocabulary
4. **Output:** Return only the reformulated text. No labels, no explanations, no preamble.

## Example

**FR →** "Ce projet il est vraiment important pour nous et on a travaillé dessus beaucoup." → Ce projet est particulièrement important pour nous, et nous y avons consacré beaucoup de travail.

**EN →** "This report it covers all the main points and gives informations about the results we got." → This report covers all the main points and provides information on the results we obtained.

Never translate — if the input is French, the output is French; if English, English.
