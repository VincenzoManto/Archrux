import React, { useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
} from '@xyflow/react';
 
import '@xyflow/react/dist/style.css';
 
 
import {
  nodes as initialNodes,
  edges as initialEdges,
} from './nodes';
import AnnotationNode from './AnnotationNode';
import ButtonEdge from './ButtonEdge';
import CircleNode from './CircleNode';
import ResizerNode from './ResizerNode';
import TextInputNode from './TextInputNode';
import ToolbarNode from './ToolbarNode';
import './flow.css'; 

const nodeTypes = {
  annotation: AnnotationNode,
  tools: ToolbarNode,
  resizer: ResizerNode,
  circle: CircleNode,
  textinput: TextInputNode,
};
 
const edgeTypes = {
  button: ButtonEdge,
};
 
const nodeClassName = (node: Node) => node.type;
 
export default function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [],
  );
 
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      colorMode="dark"
      attributionPosition="top-right"
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      style={{ backgroundColor: "#F7F9FB" }}
    >
      <MiniMap zoomable pannable nodeClassName={nodeClassName} />
      <Controls />
    <Background  />
    </ReactFlow>
  );
};
 ;