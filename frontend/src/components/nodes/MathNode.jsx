import { Handle, Position } from "@xyflow/react";

function MathNode({ data }) {
  return (
    <div className="custom-node math-node">
      <Handle
        type="target"
        position={Position.Left}
      />

      <div className="node-header">
        📊 Math Operation
      </div>

      <div className="node-content">
        <strong>{data.label || "Moving Average"}</strong>
        <span>Telemetry Processing</span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  );
}

export default MathNode;