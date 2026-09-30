import { useCallback, useEffect, useState } from "react";
import Login from "./Login";
import Register from "./Register";

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

import { io } from "socket.io-client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
    position: { x: 80, y: 180 },
    data: { label: "Turbine Sensor" },
  },
  {
    id: "2",
    type: "math",
    position: { x: 330, y: 180 },
    data: { label: "Moving Average" },
  },
  {
    id: "3",
    type: "action",
    position: { x: 580, y: 180 },
    data: { label: "SMS Alert" },
  },
];

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "smoothstep",
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    type: "smoothstep",
  },
];

function FlowCanvas({
  telemetry,
  setTelemetry,
  telemetryHistory,
  setTelemetryHistory,
}) {
  const [executionStatus, setExecutionStatus] = useState("");

  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialNodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  const { screenToFlowPosition } = useReactFlow();

  

  const onConnect = useCallback(
    (connection) => {
      setEdges((currentEdges) =>
        addEdge(
          {
            ...connection,
            type: "smoothstep",
          },
          currentEdges
        )
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

      if (!rawData) return;

      const { nodeType, label } = JSON.parse(rawData);

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data: { label },
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
      const response = await fetch(
        "http://localhost:5000/api/rules",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "High Temperature Alert",
            nodes,
            edges,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save rule"
        );
      }

      setExecutionStatus("Rule saved successfully.");
    } catch (error) {
      console.error(error);
      setExecutionStatus(
        `Save failed: ${error.message}`
      );
    }
  };

  const loadRule = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/rules"
      );

      const rules = await response.json();

      if (!response.ok) {
        throw new Error("Failed to load rules");
      }

      if (!rules.length) {
        setExecutionStatus("No saved rules found.");
        return;
      }

      const latestRule = rules[0];

      setNodes(latestRule.nodes);
      setEdges(latestRule.edges);

      setExecutionStatus(
        `Rule "${latestRule.name}" loaded successfully.`
      );
    } catch (error) {
      console.error(error);
      setExecutionStatus(
        `Load failed: ${error.message}`
      );
    }
  };

  const runRule = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/execute",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nodes,
            edges,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Rule execution failed"
        );
      }

      setExecutionStatus(
        `Rule executed successfully - ${result.nodeCount} nodes, ${result.edgeCount} connections.`
      );
    } catch (error) {
      console.error(error);
      setExecutionStatus(
        `Execution failed: ${error.message}`
      );
    }
  };

  return (
    <div className="flow-section">
      <div className="section-heading">
        <div>
          <h2>Visual Rule Builder</h2>
          <p>
            Connect telemetry, processing and alert actions
            visually.
          </p>
        </div>

        <div className="flow-actions">
          <button
            className="secondary-button"
            onClick={loadRule}
          >
            Load Rule
          </button>

          <button
            className="secondary-button"
            onClick={saveRule}
          >
            Save Rule
          </button>

          <button
            className="primary-button"
            onClick={runRule}
          >
            Run Rule
          </button>
        </div>
      </div>

      {executionStatus && (
        <div className="execution-status">
          {executionStatus}
        </div>
      )}

      <div className="flow-canvas">
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
      </div>

      {telemetryHistory.length > 0 && (
        <div className="chart-card">
          <div className="card-heading">
            <div>
              <h3>Telemetry Trends</h3>
              <p>Live sensor measurements</p>
            </div>

            <span className="live-badge">
              LIVE
            </span>
          </div>

          <ResponsiveContainer
            width="100%"
            height={280}
          >
            <LineChart data={telemetryHistory}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="time" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="temperature"
                name="Temperature"
                stroke="#ef4444"
                strokeWidth={3}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="pressure"
                name="Pressure"
                stroke="#2563eb"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const [telemetry, setTelemetry] = useState(null);
  const [telemetryHistory, setTelemetryHistory] =
    useState([]);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Dashboard connected:", socket.id);
    });

    socket.on("telemetry", (data) => {
      console.log("Dashboard telemetry:", data);

      setTelemetry(data);

      setTelemetryHistory((history) => [
        ...history.slice(-9),
        {
          time: new Date(data.timestamp).toLocaleTimeString(),
          temperature: Number(data.temperature),
          pressure: Number(data.pressure),
        },
      ]);
    });

    socket.on("disconnect", () => {
      console.log("Dashboard disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const temperature =
    telemetry?.temperature ?? "--";

  const pressure =
    telemetry?.pressure ?? "--";

  const sensor =
    telemetry?.sensorId ?? "Waiting...";
  return (
    <ReactFlowProvider>
      <div className="app-shell">
        <header className="topbar">
          <div className="brand">
            <div className="brand-logo">
              N
            </div>

            <div>
              <h1>NexusFlow</h1>
              <span>IoT Telemetry & Rule Engine</span>
            </div>
          </div>

          <div className="connection-status">
            <span className="status-dot"></span>
            System Online
          </div>
        </header>

        <div className="dashboard-layout">
          <aside className="dashboard-sidebar">
            <Sidebar />
          </aside>

          <main className="dashboard-main">
            <div className="dashboard-header">
              <div>
                <span className="eyebrow">
                  MONITORING CENTER
                </span>

                <h2>Industrial IoT Dashboard</h2>

                <p>
                  Monitor live telemetry and automate
                  sensor-based actions.
                </p>
              </div>
            </div>

            <section className="metric-grid">
              <div className="metric-card">
                <div className="metric-top">
                  <span>Temperature</span>
                  <span className="metric-icon">
                    C
                  </span>
                </div>

                <strong>
                  {temperature}
                  {temperature !== "--" && " C"}
                </strong>

                <small>
                  Live sensor reading
                </small>
              </div>

              <div className="metric-card">
                <div className="metric-top">
                  <span>Pressure</span>
                  <span className="metric-icon">
                    PSI
                  </span>
                </div>

                <strong>
                  {pressure}
                  {pressure !== "--" && " PSI"}
                </strong>

                <small>
                  Current pressure level
                </small>
              </div>

              <div className="metric-card">
                <div className="metric-top">
                  <span>Active Sensor</span>
                  <span className="metric-icon">
                    ?�
                  </span>
                </div>

                <strong className="sensor-value">
                  {sensor}
                </strong>

                <small>
                  Connected telemetry source
                </small>
              </div>

              <div className="metric-card">
                <div className="metric-top">
                  <span>Alerts</span>
                  <span className="metric-icon">
                    !
                  </span>
                </div>

                <strong>0</strong>

                <small>
                  Active alerts
                </small>
              </div>
            </section>

            <FlowCanvas
              telemetry={telemetry}
              setTelemetry={setTelemetry}
              telemetryHistory={telemetryHistory}
              setTelemetryHistory={
                setTelemetryHistory
              }
            />
          </main>
        </div>
      </div>
    </ReactFlowProvider>
  );
}

function App() {
  const [page, setPage] = useState("login");
  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem(
      "nexusflowToken"
    );

    localStorage.removeItem(
      "nexusflowUser"
    );

    setIsLoggedIn(false);
    setPage("login");
  };

  if (!isLoggedIn) {
    if (page === "register") {
      return (
        <Register
          onRegister={() => setPage("login")}
          onBackToLogin={() => setPage("login")}
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onCreateAccount={() =>
          setPage("register")
        }
      />
    );
  }

  return <Dashboard />;
}

export default App;




