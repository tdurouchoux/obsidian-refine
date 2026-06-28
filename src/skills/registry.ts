import type { Skill } from "../types";

export class SkillRegistry {
	private skills = new Map<string, Skill>();

	set(filePath: string, skill: Skill): void {
		this.skills.set(filePath, skill);
	}

	remove(filePath: string): void {
		this.skills.delete(filePath);
	}

	clear(): void {
		this.skills.clear();
	}

	getByPath(filePath: string): Skill | undefined {
		return this.skills.get(filePath);
	}

	getByName(name: string): Skill | undefined {
		return this.getAll().find((skill) => skill.name === name);
	}

	getAll(): Skill[] {
		return Array.from(this.skills.values()).sort((a, b) => a.name.localeCompare(b.name));
	}

	getPrimary(): Skill[] {
		return Array.from(this.skills.values())
			.filter((skill) => skill.primary)
			.sort((a, b) => {
				const orderA = a.order ?? Number.POSITIVE_INFINITY;
				const orderB = b.order ?? Number.POSITIVE_INFINITY;
				if (orderA !== orderB) return orderA - orderB;
				return a.fileBaseName.localeCompare(b.fileBaseName);
			});
	}
}
