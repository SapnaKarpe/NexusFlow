import { useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import "./App.css";

const initialNodes = [
  {
    id: "1",
    position: { x: 100, y: 150 },
    data: { label: "Turbine Sensor" },
  },
  {
    id: "2",
    position: { x: 400, y: 150 },
    data: { label: "Moving Average Filter" },
  },
  {
    id: "3",
    position: { x: 750, y: 150 },
    data: { label: "SMS Alert" },
  },
];

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
  },
];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection) => {
      setEdges((currentEdges) => addEdge(connection, currentEdges));
    },
    [setEdges]
  );

  return (
    <div className="app">
      <header className="header">
        <h1>NexusFlow</h1>
        <p>Visual IoT Telemetry & Rule Engine</p>
      </header>

      <main className="canvas-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background />
        </ReactFlow>
      </main>
    </div>
  );
}

export default App;