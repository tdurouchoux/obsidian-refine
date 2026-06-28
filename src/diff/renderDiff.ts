import type { DiffToken } from "./wordDiff";

const CLASS_BY_TYPE: Record<DiffToken["type"], string | null> = {
	added: "refine-diff-added",
	removed: "refine-diff-removed",
	unchanged: null,
};

export function renderWordDiff(container: HTMLElement, tokens: DiffToken[]): void {
	container.empty();
	for (const token of tokens) {
		if (token.type === "removed") continue;
		const className = CLASS_BY_TYPE[token.type];
		if (className) {
			container.createSpan({ cls: className, text: token.text });
		} else {
			container.appendText(token.text);
		}
	}
}
