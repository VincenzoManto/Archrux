import React, { use, useCallback, useEffect, useState } from 'react'
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
  Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Dataset, NodeType, Structure } from '../../../lib/publicTypes'
import { SidebarFlow } from './SideBarFlow'
import './flow.css'
import { nodes as initialNodes, edges as initialEdges } from './nodes'
import AnnotationNode from './nodes/Basic/AnnotationNode'
import ButtonEdge from './nodes/Basic/ButtonEdge'
import CircleNode from './nodes/Basic/CircleNode'
import ResizerNode from './nodes/Basic/ResizerNode'
import TextInputNode from './nodes/Basic/TextInputNode'
import ToolbarNode from './nodes/Basic/ToolbarNode'
import BarNode from './nodes/Charts/BarNode'
import HistogramNode from './nodes/Charts/HistogramNode'
import LineNode from './nodes/Charts/LineNode'
import PieNode from './nodes/Charts/PieNode'
import RadarNode from './nodes/Charts/RadarNode'
import ScatterNode from './nodes/Charts/ScatterNode'
import StatsNode from './nodes/Charts/StatsNode'
import TTestNode from './nodes/Charts/TTestNode'
import TableNode from './nodes/Charts/TableNode'
import ExampleDataNode from './nodes/Data/ExampleDataNode'
import TextNode from './nodes/TextNode'
import FilterNode from './nodes/Transform/FilterNode'
import GroupByNode from './nodes/Transform/GroupByNode'
import SortNode from './nodes/Transform/SortNode'
import { DataTable } from '../../tasks/components/data-table'
import { useTheme } from '../../../context/theme-context'
import RenameNode from './nodes/Transform/RenameNode'
import URLNode from './nodes/Data/URLNode'
import { RightSidebarFlow } from './RightSideBarFlow'
import FlattenNode from './nodes/Transform/FlattenNode'

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
  rename: RenameNode,
  line: LineNode,
  flatten: FlattenNode,
  table: TableNode,
  sort: SortNode,
  groupby: GroupByNode,
  URL: URLNode,
  stats: StatsNode,
  ttest: TTestNode,
  resizer: ResizerNode,
  circle: CircleNode,
  textinput: TextInputNode,
}

const edgeTypes = {
  button: ButtonEdge,
}

const nodeClassName: any = (node: Node) => node.type

const isValidConnection = (connection: Connection) => {
  console.log(connection)
  return true
}



export default function Flow({
  onChange,
  structure
}: {
  onChange: (nodes: Node[], edges: Edge[]) => void,
  structure: Structure
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(structure.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(structure.edges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const {theme} = useTheme()
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds) as any),
    []
  )

  useEffect(() => {
    onChange(nodes, edges)
  }, [nodes, edges])

  const addNode = (node: Node) => {
    setNodes((prev) => [...prev, node] as any)
  }

  const onDrop = (event: React.DragEvent, addNode: (node: Node) => void) => {
    event.preventDefault()
    const nodeType: NodeType = JSON.parse(
      event.dataTransfer.getData('nodeType')
    )
    const position = {
      x: event.clientX - event.currentTarget.getBoundingClientRect().left,
      y: event.clientY - event.currentTarget.getBoundingClientRect().top,
    }
    console.log(nodeType.id)
    addNode({
      id: `node-${Date.now()}`,
      type: nodeType.id,
      dragHandle: '.drag-handle__custom',
      position,
      data: { ...nodeType },
    })
  }

  return (
    <div className='overflow-hidden relative h-full w-full'>
      <SidebarFlow
        className='absolute bottom-0 left-0 p-4 w-1/5 lg:w-auto bg-primary-foreground shadow-lg h-full overflow-auto no-scrollbar'
        onDragStart={(event: React.DragEvent, nodeType) => {
          event.dataTransfer.setData('nodeType', JSON.stringify(nodeType))
        }}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_: React.MouseEvent, element: Node) => setSelectedNode(element)}
        fitView
        colorMode={theme}
        isValidConnection={isValidConnection}
        onDrop={(event) => onDrop(event, addNode)}
        onDragOver={(event) => event.preventDefault()}
        attributionPosition='top-right'
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        style={{ backgroundColor: '#F7F9FB' }}
      >
        <MiniMap zoomable pannable nodeClassName={nodeClassName} />
        <Controls />
        <Background />
      </ReactFlow>
      {selectedNode?.data.output ? (
      <RightSidebarFlow selectedNode={selectedNode} setSelectedNode={setSelectedNode} />
      ) : null}
    </div>
  )
}
