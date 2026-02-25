// Request DTO
export type OptimizeSmallWorldRequest = {
  vertices: number[];
  edges: [number, number][];
};

// Response DTO - "_from" 필드명 그대로 유지
export type OptimizedDirectedEdge = {
  _from: number;
  to: number;
};

export type OptimizeSmallWorldResponse = {
  edges: OptimizedDirectedEdge[];
  optimized_graph_score: number;
  bidirectional_graph_score: number;
};

// 파싱된 그래프
export type ParsedGraph = {
  vertices: number[];
  edges: [number, number][];
};
