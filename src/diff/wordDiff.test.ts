import { describe, expect, it } from "vitest";
import { computeWordDiff } from "./wordDiff";

describe("computeWordDiff", () => {
	it("marks identical strings as fully unchanged", () => {
		const tokens = computeWordDiff("hello world", "hello world");
		expect(tokens.every((token) => token.type === "unchanged")).toBe(true);
	});

	it("marks pure additions", () => {
		const tokens = computeWordDiff("hello", "hello world");
		expect(tokens.some((token) => token.type === "added" && token.text.includes("world"))).toBe(true);
		expect(tokens.some((token) => token.type === "removed")).toBe(false);
	});

	it("marks pure removals", () => {
		const tokens = computeWordDiff("hello world", "hello");
		expect(tokens.some((token) => token.type === "removed" && token.text.includes("world"))).toBe(true);
		expect(tokens.some((token) => token.type === "added")).toBe(false);
	});

	it("handles a word replaced in the middle", () => {
		const tokens = computeWordDiff("the quick fox", "the slow fox");
		const types = tokens.map((token) => token.type);
		expect(types).toContain("removed");
		expect(types).toContain("added");
		expect(types[0]).toBe("unchanged");
		expect(types[types.length - 1]).toBe("unchanged");
	});

	it("handles empty strings", () => {
		expect(computeWordDiff("", "").every((t) => t.type === "unchanged")).toBe(true);
		expect(computeWordDiff("", "hello").every((t) => t.type !== "removed")).toBe(true);
		expect(computeWordDiff("hello", "").every((t) => t.type !== "added")).toBe(true);
	});
});
