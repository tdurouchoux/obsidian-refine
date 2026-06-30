import type { Skill } from "../types";
import type { ChatMessage } from "./types";

export function buildMessages(skill: Skill, selectedText: string): ChatMessage[] {
	return [
		{ role: "system", content: skill.systemPrompt },
		{ role: "user", content: selectedText },
	];
}
