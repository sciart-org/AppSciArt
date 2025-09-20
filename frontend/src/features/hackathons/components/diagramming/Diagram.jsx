import { useState, useCallback, useEffect, useRef } from "react";
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import AsterButton from "../../../../components/AsterButton";
import TextNode from "./TextNode";
import { DiagramContext } from "./DiagramContext";
import AnnotationNode from "./AnnotationNode";
import "./diagramming.css";
import CreateNodeButton from "./CreateNodeButton";

function findFirstMissingNode(list) {
  const numbers = Array.from({ length: list.length + 1 }, (_, i) => i);

  for (const num of numbers) {
    if (!list.includes(num)) {
      return num;
    }
  }

  return null;
}

const nodeTypes = { text: TextNode, annotation: AnnotationNode };

export default function Diagram({ socket, room }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [initialsLoaded, setInitialsLoaded] = useState(false);

  const skipEmit = useRef(false);

  useEffect(() => {
    const handleInitialState = ({ nodes: initNodes, edges: initEdges }) => {
      setNodes(initNodes);
      setEdges(initEdges);
      setInitialsLoaded(true);
    };

    socket.on("initial_state", handleInitialState);

    socket.on("new_nodes", (nodes) => {
      skipEmit.current = true;
      setNodes(nodes);
    });

    socket.on("new_edges", (edges) => {
      skipEmit.current = true;
      setEdges(edges);
    });
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.emit("get_initial_state", room);
  }, [socket]);

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

  const getEdgesWithEnds = () => {
    return edges.map((e) => {
      return {
        ...e,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      };
    });
  };

  const createNode = (type) => {
    const nodeNumber = findFirstMissingNode(
      nodes.map((n) => parseInt(n.id.substring(1)))
    );

    setNodes([
      ...nodes,
      {
        id: "n" + nodeNumber,
        position: { x: 0, y: 0 },
        type: type,
        data: {
          label: "Node " + nodeNumber,
        },
      },
    ]);
  };

  return (
    <div className="diagram-container">
      <DiagramContext value={{ nodes, edges, setNodes, setEdges }}>
        <ReactFlow
          nodes={nodes}
          edges={getEdgesWithEnds()}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          connectionMode="loose"
          fitView
          style={{ marginBottom: "1rem" }}
        >
          <Background />
          <Controls />
          <MiniMap zoomable pannable nodeClassName={(node) => node.type} />
        </ReactFlow>
      </DiagramContext>
      <div className="create-node-buttons-container">
        <CreateNodeButton onClick={() => createNode("text")}>
          Add node
        </CreateNodeButton>
        <CreateNodeButton onClick={() => createNode("annotation")}>
          Add annotation
        </CreateNodeButton>
      </div>
    </div>
  );
}
