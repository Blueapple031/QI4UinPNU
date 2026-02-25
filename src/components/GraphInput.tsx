import type { ChangeEvent } from "react";

type GraphInputProps = {
  verticesRaw: string;
  edgesRaw: string;
  onVerticesChange: (v: string) => void;
  onEdgesChange: (e: string) => void;
  onDrawGraph: () => void;
  onOptimize: () => void;
  onReset: () => void;
  canDraw: boolean;
  canOptimize: boolean;
  error: string | null;
};

export function GraphInput({
  verticesRaw,
  edgesRaw,
  onVerticesChange,
  onEdgesChange,
  onDrawGraph,
  onOptimize,
  onReset,
  canDraw,
  canOptimize,
  error,
}: GraphInputProps) {
  return (
    <div className="graph-input">
      <h3>그래프 입력</h3>

      <div className="field">
        <label htmlFor="vertices">정점 (쉼표로 구분)</label>
        <input
          id="vertices"
          type="text"
          value={verticesRaw}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onVerticesChange(e.target.value)
          }
          placeholder="예: 1,2,3,4,5"
        />
      </div>

      <div className="field">
        <label htmlFor="edges">간선 (한 줄에 하나씩, 띄어쓰기 또는 쉼표)</label>
        <textarea
          id="edges"
          value={edgesRaw}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            onEdgesChange(e.target.value)
          }
          placeholder={"예:\n1 2\n2 3\n3 4"}
          rows={5}
        />
      </div>

      {error && <div className="error">{error}</div>}

      <div className="buttons">
        <button className="btn-primary" onClick={onDrawGraph} disabled={!canDraw}>
          그래프 그리기
        </button>
        <button className="btn-primary" onClick={onOptimize} disabled={!canOptimize}>
          경로 탐색
        </button>
        <button className="btn-secondary" onClick={onReset} type="button">
          초기화
        </button>
      </div>
    </div>
  );
}
