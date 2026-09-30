import { Handle, Position } from "@xyflow/react";

function DataSourceNode({ data }) {
  return (
    <div
      className="custom-node data-source-node"
      style={{
        width: "190px",
        minHeight: "115px",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <div
        className="node-header"
        style={{
          padding: "12px",
          fontSize: "15px",
        }}
      >
        📡 Data Source
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
          {data.label || "Turbine Sensor"}
        </strong>

        <span style={{ fontSize: "13px" }}>
          IoT Telemetry
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  );
}

export default DataSourceNode;