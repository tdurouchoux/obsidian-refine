# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Refine (`obsidian-refine`) is an Obsidian plugin that lets users transform selected text using an LLM, inspired by Apple Intelligence's Writing Tools. Users define "skills" (prompts) as plain markdown files in their vault, following the SKILL.md standard. The plugin sends the selected text plus a skill's instructions to an OpenAI-compatible API endpoint and shows the result as a word-level diff in a sidebar panel.

The codebase has not been implemented yet — this repository currently contains only `spec.md`, `README.md`, and `LICENSE`.

## spec.md is the source of truth

`spec.md` is the authoritative specification for this plugin's behavior: panel UI/states, skill file format and frontmatter fields, commands, settings, and bundled default skills.

**`spec.md` must always be kept up to date.** Whenever a feature is added, changed, or removed, update `spec.md` in the same change so it accurately reflects current behavior. Do not let the spec drift from the implementation.
