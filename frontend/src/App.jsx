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

  const saveRule = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/rules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "High Temperature Alert",
          nodes,
          edges,
        }),
      });

    
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save rule");
      }

      alert("Rule saved successfully!");
      console.log("Saved rule:", data.rule);
    } catch (error) {
      console.error("Save rule error:", error);
      alert("Failed to save rule");
    }
  };
    const loadRule = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/rules");

      const rules = await response.json();

      if (!response.ok) {
        throw new Error("Failed to load rules");
      }

      if (rules.length === 0) {
        alert("No saved rules found");
        return;
      }

      const latestRule = rules[0];

      setNodes(latestRule.nodes);
      setEdges(latestRule.edges);

      alert(`Rule "${latestRule.name}" loaded successfully!`);
    } catch (error) {
      console.error("Load rule error:", error);
      alert("Failed to load rule");
    }
  };

  return (
    <>
      <button className="save-rule-button" onClick={saveRule}>
        Save Rule
      </button>

      <button className="load-rule-button" onClick={loadRule}>
        Load Rule
      </button>

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
    </>
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