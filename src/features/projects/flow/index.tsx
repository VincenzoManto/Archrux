import { useCallback } from 'react'
import {
  addEdge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './flow.css'
import { nodes as initialNodes, edges as initialEdges } from './nodes'
import HeatmapFlow from './HeatmapFlow'

export default function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    []
  )


  return (
    <HeatmapFlow
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}>
    </HeatmapFlow>
  )
}
