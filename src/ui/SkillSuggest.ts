import { AbstractInputSuggest, type App } from "obsidian";
import type { Skill } from "../types";

export class SkillSuggest extends AbstractInputSuggest<Skill> {
	private getSkills: () => Skill[];
	private onPick: (skill: Skill) => void;
	private inputEl: HTMLInputElement;

	constructor(app: App, inputEl: HTMLInputElement, getSkills: () => Skill[], onPick: (skill: Skill) => void) {
		super(app, inputEl);
		this.inputEl = inputEl;
		this.getSkills = getSkills;
		this.onPick = onPick;
	}

	getSuggestions(query: string): Skill[] {
		const lowerQuery = query.toLowerCase();
		return this.getSkills().filter((skill) => skill.name.toLowerCase().includes(lowerQuery));
	}

	renderSuggestion(skill: Skill, el: HTMLElement): void {
		el.setText(skill.icon ? `${skill.icon} ${skill.name}` : skill.name);
	}

	selectSuggestion(skill: Skill): void {
		this.inputEl.value = skill.name;
		this.inputEl.dispatchEvent(new Event("input"));
		this.close();
		this.onPick(skill);
	}
}
