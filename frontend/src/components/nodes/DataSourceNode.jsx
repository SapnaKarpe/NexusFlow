import { Handle, Position } from "@xyflow/react";

function DataSourceNode({ data }) {
  return (
    <div className="custom-node data-source-node">
      <div className="node-header">
        📡 Data Source
      </div>

      <div className="node-content">
        <strong>{data.label || "Turbine Sensor"}</strong>
        <span>IoT Telemetry</span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  );
}

export default DataSourceNode;