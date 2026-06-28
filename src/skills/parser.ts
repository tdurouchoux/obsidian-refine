import matter from "gray-matter";
import type { Skill } from "../types";

function baseNameFromPath(filePath: string): string {
	const fileName = filePath.split("/").pop() ?? filePath;
	return fileName.replace(/\.md$/, "");
}

export function parseSkillFile(raw: string, filePath: string): Skill | null {
	let parsed: matter.GrayMatterFile<string>;
	try {
		parsed = matter(raw);
	} catch {
		return null;
	}

	const data = parsed.data ?? {};
	const name = data.name;
	const description = data.description;

	if (typeof name !== "string" || name.trim() === "") return null;
	if (typeof description !== "string" || description.trim() === "") return null;

	const icon = typeof data.icon === "string" ? data.icon : undefined;
	const primary = data.primary === true;
	const order = typeof data.order === "number" ? data.order : undefined;
	const model = typeof data.model === "string" ? data.model : undefined;
	const temperature = typeof data.temperature === "number" ? data.temperature : undefined;

	return {
		filePath,
		fileBaseName: baseNameFromPath(filePath),
		name,
		description,
		icon,
		primary,
		order,
		model,
		temperature,
		systemPrompt: parsed.content.trim(),
	};
}
