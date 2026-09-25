import { Handle, Position } from "@xyflow/react";

function ActionNode({ data }) {
  return (
    <div className="custom-node action-node">
      <Handle
        type="target"
        position={Position.Left}
      />

      <div className="node-header">
        🚨 Action Trigger
      </div>

      <div className="node-content">
        <strong>{data.label || "SMS Alert"}</strong>
        <span>Alert & Notification</span>
      </div>
    </div>
  );
}

export default ActionNode;