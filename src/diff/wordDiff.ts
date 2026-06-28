import { diffWords } from "diff";

export interface DiffToken {
	type: "added" | "removed" | "unchanged";
	text: string;
}

export function computeWordDiff(original: string, transformed: string): DiffToken[] {
	return diffWords(original, transformed).map((change) => ({
		type: change.added ? "added" : change.removed ? "removed" : "unchanged",
		text: change.value,
	}));
}
