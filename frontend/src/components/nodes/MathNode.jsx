import { Handle, Position } from "@xyflow/react";

function MathNode({ data }) {
  return (
    <div
      className="custom-node math-node"
      style={{
        width: "190px",
        minHeight: "115px",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
      />

      <div
        className="node-header"
        style={{
          padding: "12px",
          fontSize: "15px",
        }}
      >
        📊 Math Operation
      </div>

      <div
        className="node-content"
        style={{
          padding: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <strong style={{ fontSize: "16px" }}>
          {data.label || "Moving Average"}
        </strong>

        <span style={{ fontSize: "13px" }}>
          Telemetry Processing
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  );
}

export default MathNode;