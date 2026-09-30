import { Handle, Position } from "@xyflow/react";

function ActionNode({ data }) {
  return (
    <div
      className="custom-node action-node"
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
        🚨 Action Trigger
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
          {data.label || "SMS Alert"}
        </strong>

        <span style={{ fontSize: "13px" }}>
          Alert & Notification
        </span>
      </div>
    </div>
  );
}

export default ActionNode;