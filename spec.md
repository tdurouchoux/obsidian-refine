# Refine — Plugin Specification

## Purpose

Refine is an Obsidian plugin that lets users transform selected text using an LLM. It is inspired by Apple Intelligence's writing tools, but gives the user full ownership of the experience: which model is used, which API endpoint is called, and what instructions are sent to the model. All prompts are stored as plain markdown files inside the vault, so they can be edited, versioned, and shared like any other note.

---

## Opening Refine

The Refine panel lives in Obsidian's right sidebar. It can be opened or closed in two ways:

- Clicking the **Refine button in the ribbon** (left edge of the Obsidian window)
- Running the command **Refine: Open panel**

Both do the same thing and can be used interchangeably.

---

## The Refine Panel

The panel is always visible in the sidebar while open. It has three zones: the prompt controls at the top, the result area in the middle, and the action buttons at the bottom.

### Prompt controls

Skills are presented in two ways:

- **Primary skills** each get their own button, displayed prominently at the top of the panel. These are the skills the user reaches for most often.
- **All other skills** are accessible via a text input with autocomplete. The user starts typing the skill name and matching options appear. Primary skills also appear here.

Clicking a primary button or selecting a skill from the autocomplete immediately sends the request — there is no separate confirmation step.

### Result area

The result area shows the output of the last transform, with **word-level diff highlighting** against the original selected text:

- Words that were removed appear in red with strikethrough
- Words that were added appear in green with underline
- Unchanged words appear normally

The result is **sticky**: it stays visible even if the user moves the cursor or changes the selection after a transform has run. It is only replaced when a new transform is triggered.

### Action buttons

Once a result is available, two buttons appear:

- **Replace in note** — substitutes the original selection in the editor with the generated text. This action is undoable with the standard undo shortcut.
- **Copy** — copies the generated text (without diff markup) to the clipboard.

### Panel states

| Situation | What the panel shows |
|---|---|
| No text selected, no result yet | A placeholder message: *"Select some text to refine."* |
| Text is selected, no result yet | Prompt controls are active and ready |
| Request is in progress | Prompt controls are disabled, a loading indicator is shown |
| Result is available | Diff is shown, Replace and Copy buttons are visible |
| Selection changes after a result | Result remains visible until a new transform is run |
| An error occurs | An error message is shown with a Retry option |

---

## Skills

Skills are the prompts that Refine sends to the model. Each skill is a markdown file stored in a dedicated folder inside the vault (configured in settings, default: `Refine/Skills/`).

### Format

Skills follow the [SKILL.md open standard](https://agentskills.io/specification) used by AI agents, extended with a few Refine-specific fields in the frontmatter. The body of the file — everything after the frontmatter — is sent verbatim as the system prompt. The user's selected text is sent as the user message.

```markdown
---
name: Make Formal
description: Rewrites text in a formal, professional tone. Use when the text feels too casual for its context.
icon: 🎩
primary: true
order: 1
model: gpt-4o
temperature: 0.3
---

# Make Formal

## Description
Rewrites text in a formal, professional tone while preserving all factual content.

## When to use
When the selected text is too casual, uses informal language, or needs to sound more professional.

## Instructions
Rewrite the following text in a formal, professional tone.
Preserve all factual content and meaning exactly.
Do not add or remove information.
Return only the rewritten text, no preamble or explanation.

## Examples

### Input
hey can u send me that doc when u get a chance thx

### Output
Could you please send me the document at your earliest convenience? Thank you.
```

### Frontmatter fields

| Field | Required | Description |
|---|---|---|
| `name` | ✅ | Display name shown in the panel |
| `description` | ✅ | Explains when to use this skill |
| `icon` | optional | Emoji shown alongside the name |
| `primary` | optional | If `true`, the skill gets its own button. Default: `false` |
| `order` | optional | Controls the order of primary buttons. Default: alphabetical by filename |
| `model` | optional | Overrides the default model for this skill |
| `temperature` | optional | Overrides the default temperature for this skill |

### Live editing

The plugin watches the skills folder at runtime. Adding, editing, or deleting a skill file takes effect immediately — no need to restart Obsidian or reload the plugin.

### Bundled skills

Refine ships with a set of default skills that are copied into the vault on first install. They are never overwritten by plugin updates, so the user can freely edit them.

| Name | Icon | Primary |
|---|---|---|
| Make Formal | 🎩 | ✅ |
| Simplify | ✂️ | ✅ |
| Fix Grammar | ✨ | ✅ |
| Make Concise | ⬇️ | ✅ |
| Expand | ↕️ | — |
| Make Casual | 💬 | — |
| Summarise | 📋 | — |

---

## Commands

| Command | Description |
|---|---|
| **Refine: Open panel** | Toggles the Refine sidebar panel open or closed |
| **Refine: Transform selection** | Opens the panel if closed, then runs the last-used skill on the current selection. Does nothing if no text is selected. |
| **Refine: New skill** | Creates a new skill file in the skills folder, pre-filled with the standard template, and opens it in the editor |

All commands can be assigned to custom hotkeys in Obsidian's hotkey settings.

---

## Creating a New Skill

Running **Refine: New skill** creates a new untitled `.md` file (e.g. `Untitled.md`, auto-suffixed with a number if that name is already taken) in the skills folder, pre-filled with a template covering all available frontmatter fields and placeholder sections for description, instructions, and examples. The file opens immediately in the editor so the user can rename it and start writing.

---

## Settings

| Setting | Default | Description |
|---|---|---|
| API Base URL | `https://api.openai.com/v1` | The base URL of any OpenAI-compatible endpoint |
| API Key | — | The key used to authenticate with the provider |
| Default model | `gpt-4o` | Used when a skill does not specify its own model |
| Default temperature | `0.7` | Used when a skill does not specify its own temperature |
| Skills folder | `Refine/Skills` | Vault-relative path to the folder where skills are stored |

Refine works with any provider that exposes an OpenAI-compatible API: OpenAI, Anthropic, Ollama, LM Studio, Groq, and others. Switching providers only requires updating the base URL and API key in settings.
