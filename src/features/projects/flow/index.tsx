import { useCallback, useEffect, useRef } from 'react'
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import SimpleHeat from 'simpleheat'
import { AnimatedSVGEdge } from './AnimatedEdge'
import AnnotationNode from './AnnotationNode'
import ButtonEdge from './ButtonEdge'
import CircleNode from './CircleNode'
import ResizerNode from './ResizerNode'
import TextInputNode from './TextInputNode'
import ToolbarNode from './ToolbarNode'
import './flow.css'
import { nodes as initialNodes, edges as initialEdges } from './nodes'

const nodeTypes = {
  annotation: AnnotationNode,
  tools: ToolbarNode,
  resizer: ResizerNode,
  circle: CircleNode,
  textinput: TextInputNode,
}

const edgeTypes: any = {
  button: ButtonEdge,
  animatedSvg: AnimatedSVGEdge,
}

const nodeClassName = (node: Node) => node.type

export default function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    []
  )

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const heat = useRef<any>(null)
  const points = useRef<{ x: number; y: number; v: number }[]>([])

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight

      // Inizializza simpleheat
      heat.current = new SimpleHeat(canvas)
      setInterval(() => {
        heat.current.data(
          points.current
            .map((e) => {
              e.v -= 0.025
              if (e.v < 0) {
                return null
              }
              return [e.x, e.y, e.v]
            })
            .filter((e) => e)
        )
      }, 100)
    }
  }, [])

  const updateHeatmap = (x: number, y: number) => {
    if (heat.current && canvasRef.current) {
      heat.current.add([x, y, 0.5])
      points.current.push({ x, y, v: 0.5 })
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      for (const e of document.getElementsByClassName('animated-edge')) {
        const circle = e
        if (circle && canvasRef.current) {
          const { left, top } = canvasRef.current.getBoundingClientRect()
          const { x, y } = circle.getBoundingClientRect()
          const adjustedX = x - left
          const adjustedY = y - top

          // Aggiungi punto alla lista
          updateHeatmap(adjustedX, adjustedY)
        }
      }
      heat.current.draw(0.05)
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        colorMode='dark'
        attributionPosition='top-right'
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        style={{ backgroundColor: '#F7F9FB' }}
      >
        <MiniMap zoomable pannable nodeClassName={nodeClassName} />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  )
}
