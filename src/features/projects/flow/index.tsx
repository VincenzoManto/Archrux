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
import AnnotationNode from './nodes/Basic/AnnotationNode';
import ButtonEdge from './nodes/Basic/ButtonEdge';
import CircleNode from './nodes/Basic/CircleNode';
import ResizerNode from './nodes/Basic/ResizerNode';
import TextInputNode from './nodes/Basic/TextInputNode';
import ToolbarNode from './nodes/Basic/ToolbarNode';
import './flow.css'; 
import { SidebarFlow } from './SideBarFlow';
import { NodeType } from '../../../lib/publicTypes';
import FilterNode from './nodes/Transform/FilterNode';
import TextNode from './nodes/TextNode';
import ExampleDataNode from './nodes/ExampleDataNode';
import ScatterNode from './nodes/Charts/ScatterNode';
import BarNode from './nodes/Charts/BarNode';
import RadarNode from './nodes/Charts/RadarNode';
import HistogramNode from './nodes/Charts/HistogramNode';
import PieNode from './nodes/Charts/PieNode';
import LineNode from './nodes/Charts/LineNode';
import TableNode from './nodes/Charts/TableNode';
import SortNode from './nodes/Transform/SortNode';
import GroupByNode from './nodes/Transform/GroupByNode';
import StatsNode from './nodes/Charts/StatsNode';
import TTestNode from './nodes/Charts/TTestNode';

const nodeTypes = {
  annotation: AnnotationNode,
  tools: ToolbarNode,
  text: TextNode,
  exampleData: ExampleDataNode,
  filter: FilterNode,
  scatter: ScatterNode,
  bar: BarNode,
  radar: RadarNode,
  histogram: HistogramNode,
  pie: PieNode,
  line: LineNode,
  table: TableNode,
  sort: SortNode,
  group: GroupByNode,
  stats: StatsNode,
  ttest: TTestNode,
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
    <><SidebarFlow
    className="absolute top-0 left-0 h-100 w-auto"
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
    </>
  );
};
 ;