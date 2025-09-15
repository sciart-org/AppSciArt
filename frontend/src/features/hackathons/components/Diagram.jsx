import { useState, useCallback, useEffect, useRef } from "react";
import {
  Background,
  Controls,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export default function Diagram({ socket, room }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [initialsLoaded, setInitialsLoaded] = useState(false);

  const skipEmit = useRef(false);

  const getInitialNodes = () => {
    if (!socket) return;

    socket.emit("get_initial_state", room);
  };

  const handleInitialState = ({ nodes: initNodes, edges: initEdges }) => {
    setNodes(initNodes);
    setEdges(initEdges);
    setInitialsLoaded(true);
  };

  useEffect(() => {
    if (!socket) return;

    getInitialNodes();
  }, [socket]);

  socket.on("initial_state", handleInitialState);

  socket.on("new_nodes", (nodes) => {
    skipEmit.current = true;
    setNodes(nodes);
  });

  socket.on("new_edges", (edges) => {
    skipEmit.current = true;
    setEdges(edges);
  });

  useEffect(() => {
    if (!socket || !initialsLoaded) return;
    if (skipEmit.current) {
      skipEmit.current = false;
      return;
    }
    socket.emit("update_edges", { room, edges });
  }, [edges]);

  useEffect(() => {
    if (!socket || !initialsLoaded) return;
    if (skipEmit.current) {
      skipEmit.current = false;
      return;
    }
    socket.emit("update_nodes", { room, nodes });
  }, [nodes]);

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  return (
    <div style={{ width: "45vw", height: "50vh", border: "1px solid black" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
