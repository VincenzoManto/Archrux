import { useCallback, useRef, useState } from 'react'
import {
  addEdge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './flow.css'
import { nodes as initialNodes, edges as initialEdges } from './nodes'
import HeatmapFlowProvider from './HeatmapFlow'

export default function Flow({playState}: {playState: boolean}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    []
  )


  return (
    <HeatmapFlowProvider
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodes={nodes}
      edges={edges}
      playState={playState}
      onConnect={onConnect}>
    </HeatmapFlowProvider>
  )
}
