import { useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import "./App.css";

import DataSourceNode from "./components/nodes/DataSourceNode";
import MathNode from "./components/nodes/MathNode";
import ActionNode from "./components/nodes/ActionNode";
import Sidebar from "./components/Sidebar";

const nodeTypes = {
  dataSource: DataSourceNode,
  math: MathNode,
  action: ActionNode,
};

const initialNodes = [
  {
    id: "1",
    type: "dataSource",
    position: { x: 100, y: 150 },
    data: { label: "Turbine Sensor" },
  },
  {
    id: "2",
    type: "math",
    position: { x: 400, y: 150 },
    data: { label: "Moving Average" },
  },
  {
    id: "3",
    type: "action",
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

function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialNodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (connection) => {
      setEdges((currentEdges) =>
        addEdge(connection, currentEdges)
      );
    },
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const rawData = event.dataTransfer.getData(
        "application/reactflow"
      );

      if (!rawData) {
        return;
      }

      const { nodeType, label } = JSON.parse(rawData);

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data: {
          label,
        },
      };

      setNodes((currentNodes) => [
        ...currentNodes,
        newNode,
      ]);
    },
    [screenToFlowPosition, setNodes]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDragOver={onDragOver}
      onDrop={onDrop}
      nodeTypes={nodeTypes}
      fitView
    >
      <Controls />
      <MiniMap />
      <Background />
    </ReactFlow>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <div className="app">
        <header className="header">
          <h1>NexusFlow</h1>
          <p>Visual IoT Telemetry & Rule Engine</p>
        </header>

        <div className="workspace">
          <Sidebar />

          <main className="canvas-container">
            <FlowCanvas />
          </main>
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;