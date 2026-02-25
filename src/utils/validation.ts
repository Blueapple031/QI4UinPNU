import type { ParsedGraph } from "../types.ts";

export type ValidationResult =
  | { valid: true; graph: ParsedGraph }
  | { valid: false; error: string };

function parseVertices(raw: string): number[] | { error: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { error: "vertices가 비어있습니다." };
  }
  const parts = trimmed.split(/[,\s]+/).filter(Boolean);
  const nums: number[] = [];
  for (const p of parts) {
    const n = parseInt(p, 10);
    if (isNaN(n)) {
      return { error: `잘못된 정점 값: "${p}"` };
    }
    nums.push(n);
  }
  const unique = new Set(nums);
  if (unique.size !== nums.length) {
    return { error: "vertices에 중복이 있습니다." };
  }
  return nums;
}

function parseEdges(
  raw: string,
  vertices: Set<number>
): [number, number][] | { error: string; line?: number } {
  const lines = raw.trim().split("\n").filter((l) => l.trim());
  const edges: [number, number][] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const parts = line.split(/[\s,]+/).filter(Boolean);
    if (parts.length !== 2) {
      return {
        error: `잘못된 간선 형식 (줄 ${i + 1}): "${line}". "u v" 또는 "u,v" 형식으로 입력하세요.`,
        line: i + 1,
      };
    }
    const u = parseInt(parts[0], 10);
    const v = parseInt(parts[1], 10);
    if (isNaN(u) || isNaN(v)) {
      return {
        error: `잘못된 간선 값 (줄 ${i + 1}): "${line}"`,
        line: i + 1,
      };
    }
    if (u === v) {
      return {
        error: `self-loop 불가 (줄 ${i + 1}): "${u} ${v}"`,
        line: i + 1,
      };
    }
    if (!vertices.has(u)) {
      return {
        error: `정점 ${u}가 vertices에 없습니다. (줄 ${i + 1})`,
        line: i + 1,
      };
    }
    if (!vertices.has(v)) {
      return {
        error: `정점 ${v}가 vertices에 없습니다. (줄 ${i + 1})`,
        line: i + 1,
      };
    }
    edges.push([u, v]);
  }
  return edges;
}

export function validateAndParse(
  verticesRaw: string,
  edgesRaw: string
): ValidationResult {
  const vertResult = parseVertices(verticesRaw);
  if (typeof vertResult === "object" && "error" in vertResult) {
    return { valid: false, error: vertResult.error };
  }
  const vertices = vertResult as number[];
  const vertSet = new Set(vertices);

  const edgeResult = parseEdges(edgesRaw, vertSet);
  if (typeof edgeResult === "object" && "error" in edgeResult) {
    return { valid: false, error: edgeResult.error };
  }
  const edges = edgeResult as [number, number][];

  return {
    valid: true,
    graph: { vertices, edges },
  };
}
