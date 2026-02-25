import { useState } from "react";
import type { OptimizeSmallWorldRequest } from "../types.ts";
import type { OptimizeSmallWorldResponse } from "../types.ts";

type DebugPanelProps = {
  request: OptimizeSmallWorldRequest | null;
  response: OptimizeSmallWorldResponse | null;
};

export function DebugPanel({ request, response }: DebugPanelProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="debug-panel">
      <button
        type="button"
        className="debug-toggle"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "▼ 디버깅 접기" : "▶ 디버깅 보기 (Request/Response)"}
      </button>
      {open && (
        <div className="debug-content">
          <div className="debug-grid">
            <div>
              <strong>Request</strong>
              <pre>{request ? JSON.stringify(request, null, 2) : "-"}</pre>
            </div>
            <div>
              <strong>Response</strong>
              <pre>{response ? JSON.stringify(response, null, 2) : "-"}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
