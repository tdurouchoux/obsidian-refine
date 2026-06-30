export function buildSkillTemplate(): string {
	return `---
name: Untitled Skill
description: Describe when this skill should be used.
icon: 🆕
primary: false
order:
model:
temperature:
---

# Untitled Skill

## Description
Describe what this skill does.

## When to use
Describe when this skill should be used.

## Instructions
Write the instructions to send to the model here.

## Examples

### Input


### Output

`;
}
