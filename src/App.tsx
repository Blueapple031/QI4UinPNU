import { useState, useCallback, useEffect } from "react";
import { GraphInput } from "./components/GraphInput.tsx";
import { GraphVisualization } from "./components/GraphVisualization.tsx";
import { ResultPanel } from "./components/ResultPanel.tsx";
import { DebugPanel } from "./components/DebugPanel.tsx";
import { validateAndParse } from "./utils/validation.ts";
import { optimizeSmallWorld } from "./api.ts";
import type { ParsedGraph, OptimizeSmallWorldResponse } from "./types.ts";
import "./App.css";

export default function App() {
  const [verticesRaw, setVerticesRaw] = useState("1,2,3,4,5");
  const [edgesRaw, setEdgesRaw] = useState("1 2\n2 3\n3 4\n4 5\n5 1");
  const [parsedGraph, setParsedGraph] = useState<ParsedGraph | null>(null);
  const [optimizationResult, setOptimizationResult] =
    useState<OptimizeSmallWorldResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const attr = document.documentElement.getAttribute("data-theme");
      if (attr === "light" || attr === "dark") return attr;
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);

  const handleDrawGraph = useCallback(() => {
    const result = validateAndParse(verticesRaw, edgesRaw);
    if (!result.valid) {
      setError(result.error);
      return;
    }
    setError(null);
    setParsedGraph(result.graph);
    setOptimizationResult(null);
    setHasDrawn(true);
  }, [verticesRaw, edgesRaw]);

  const handleOptimize = useCallback(async () => {
    if (!parsedGraph) return;
    const result = validateAndParse(verticesRaw, edgesRaw);
    if (!result.valid) {
      setError(result.error);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await optimizeSmallWorld({
        vertices: parsedGraph.vertices,
        edges: parsedGraph.edges,
      });
      setOptimizationResult(res);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "알 수 없는 오류가 발생했습니다.";
      if (
        msg.includes("fetch") ||
        msg.includes("Failed to fetch") ||
        msg.includes("NetworkError")
      ) {
        setError(
          "CORS 또는 네트워크 오류: 서버에 연결할 수 없습니다. " +
            "브라우저 개발자 도구(F12) > Network 탭에서 요청 상태를 확인해보세요. " +
            "서버가 CORS를 허용하는지 확인이 필요합니다."
        );
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [parsedGraph, verticesRaw, edgesRaw]);

  const handleVerticesChange = useCallback((v: string) => {
    setVerticesRaw(v);
    setError(null);
  }, []);

  const handleEdgesChange = useCallback((e: string) => {
    setEdgesRaw(e);
    setError(null);
  }, []);

  const handleReset = useCallback(() => {
    setVerticesRaw("1,2,3,4,5");
    setEdgesRaw("1 2\n2 3\n3 4\n4 5\n5 1");
    setParsedGraph(null);
    setOptimizationResult(null);
    setHasDrawn(false);
    setError(null);
  }, []);

  const canDraw = verticesRaw.trim().length > 0;
  const canOptimize = parsedGraph !== null && !loading;

  const requestForDebug = parsedGraph
    ? {
        vertices: parsedGraph.vertices,
        edges: parsedGraph.edges,
      }
    : null;

  return (
    <div className="app">
      <header>
        <div className="header-row">
          <div>
            <h1>Small World 그래프 최적화</h1>
            <p>무방향 그래프를 입력하고 경로 탐색으로 최적화된 방향을 확인하세요.</p>
          </div>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
            aria-label={theme === "light" ? "다크 모드" : "라이트 모드"}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <GraphInput
            verticesRaw={verticesRaw}
            edgesRaw={edgesRaw}
            onVerticesChange={handleVerticesChange}
            onEdgesChange={handleEdgesChange}
            onDrawGraph={handleDrawGraph}
            onOptimize={handleOptimize}
            onReset={handleReset}
            canDraw={canDraw}
            canOptimize={canOptimize}
            error={error}
          />
          {loading && (
            <div className="loading">최적화 중...</div>
          )}
          <ResultPanel result={optimizationResult} />
        </aside>

        <main className="main">
          <GraphVisualization
            parsedGraph={parsedGraph}
            directedEdges={optimizationResult?.edges ?? null}
            hasDrawn={hasDrawn}
          />
        </main>
      </div>

      <DebugPanel request={requestForDebug} response={optimizationResult} />
    </div>
  );
}
