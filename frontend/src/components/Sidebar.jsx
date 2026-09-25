function Sidebar() {
  const onDragStart = (event, nodeType, label) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({
        nodeType,
        label,
      })
    );

    event.dataTransfer.effectAllowed = "move";
  };

  const NodeButton = ({ nodeType, label, icon }) => (
    <button
      draggable
      onDragStart={(event) =>
        onDragStart(event, nodeType, label)
      }
    >
      {icon} {label}
    </button>
  );

  return (
    <aside className="sidebar">
      <h2>Node Library</h2>

      <section>
        <h3>Data Sources</h3>

        <NodeButton
          nodeType="dataSource"
          label="Turbine Sensor"
          icon="📡"
        />

        <NodeButton
          nodeType="dataSource"
          label="Temperature Sensor"
          icon="🌡️"
        />
      </section>

      <section>
        <h3>Math Operations</h3>

        <NodeButton
          nodeType="math"
          label="Moving Average"
          icon="📊"
        />

        <NodeButton
          nodeType="math"
          label="Add"
          icon="➕"
        />

        <NodeButton
          nodeType="math"
          label="Multiply"
          icon="✖️"
        />
      </section>

      <section>
        <h3>Action Triggers</h3>

        <NodeButton
          nodeType="action"
          label="SMS Alert"
          icon="🚨"
        />

        <NodeButton
          nodeType="action"
          label="Webhook"
          icon="🔗"
        />
      </section>
    </aside>
  );
}

export default Sidebar;