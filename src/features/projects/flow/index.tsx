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
  Connection,
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
import { SidebarFlow } from './SideBarFlow';
import { NodeType } from '../../../lib/publicTypes';
import FilterNode from './nodes/FilterNode';
import TextNode from './nodes/TextNode';

const nodeTypes = {
  annotation: AnnotationNode,
  tools: ToolbarNode,
  text: TextNode,
  filter: FilterNode,
/*   sort: SortNode,
  javascript: JavascriptNode,
  merge: MergeNode,
  group: GroupNode,
  transpose: TransposeNode,
  pivot: PivotNode, */
  resizer: ResizerNode,
  circle: CircleNode,
  textinput: TextInputNode,
};
 
const edgeTypes = {
  button: ButtonEdge,
};
 
const nodeClassName = (node: Node) => node.type;

const isValidConnection = (connection: Connection) => {
  console.log(connection);
  return true;
};
 
export default function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const addNode = (node: Node) => {
    setNodes((prev) => [...prev, node]);
  };
  
  const onDrop = (event: React.DragEvent, addNode: (node: Node) => void) => {
    event.preventDefault();
    const nodeType: NodeType = JSON.parse(event.dataTransfer.getData('nodeType'));
    const position = {
      x: event.clientX - event.currentTarget.getBoundingClientRect().left,
      y: event.clientY - event.currentTarget.getBoundingClientRect().top,
    };
    console.log(nodeType.id)
    addNode({
      id: `node-${Date.now()}`,
      type: nodeType.id,
      dragHandle: '.drag-handle__custom',
      position,
      data: { ...nodeType },
    });
  };

  return (
    <div className='flex'><SidebarFlow
    onDragStart={(event: React.DragEvent, nodeType) => {
      event.dataTransfer.setData('nodeType', JSON.stringify(nodeType));
    }}
  />
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      colorMode="dark"
      isValidConnection={isValidConnection}
      onDrop={(event) => onDrop(event, addNode)}
      onDragOver={(event) => event.preventDefault()}
      attributionPosition="top-right"
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      style={{ backgroundColor: "#F7F9FB" }}
    >
      <MiniMap zoomable pannable nodeClassName={nodeClassName} />
      <Controls />
    <Background  />
    </ReactFlow>
    </div>
  );
};
 ;