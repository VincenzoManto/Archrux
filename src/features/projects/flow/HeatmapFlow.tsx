import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  Node,
  useReactFlow,
  ReactFlowProvider,
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
import { Library } from 'lucide-react'
import { LibraryPanel } from './LibraryPanel'

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

// wrapping with ReactFlowProvider is done outside of the component
export default function HeatmapFlowProvider(props: any) {
    return (
      <ReactFlowProvider>
        <HeatmapFlow {...props} />
      </ReactFlowProvider>
    );
  }

 function HeatmapFlow({
  onNodesChange,
  onEdgesChange,
  nodes,
  edges,
  onConnect,
  playState,
}: {
  onNodesChange: any
  onEdgesChange: any
  nodes: Node[]
  edges: any[]
  onConnect: any
  playState: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const heat = useRef<any>(null)
  const points = useRef<{ x: number; y: number; v: number }[]>([])
  const { getZoom } = useReactFlow()
  const [internalNodes, setInternalNodes] = useState<Node[]>(nodes)

  useEffect(() => {
    if (canvasRef.current && playState) {
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
    } else {
      canvasRef.current
        ?.getContext('2d')
        ?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }, [playState])

  const updateHeatmap = (x: number, y: number) => {
    if (heat.current && canvasRef.current) {
      heat.current.add([x, y, 0.5])
      points.current.push({ x, y, v: 0.5 })
    }
  }

  useEffect(() => {
    if (playState) {
      const interval = setInterval(() => {
        for (const e of document.getElementsByClassName('animated-edge')) {
          const circle = e
          if (circle && canvasRef.current) {
            const { left, top } = canvasRef.current.getBoundingClientRect()
            const { x, y } = circle.getBoundingClientRect()
            const adjustedX = x - left
            const adjustedY = y - top

            updateHeatmap(adjustedX, adjustedY)
          }
        }

        const zoom = getZoom() * 2 || 1;
        if (zoom) {
          heat.current.radius(10 * zoom, 20 * zoom)
        }
        heat.current.draw(0.05)
      }, 100)

      return () => clearInterval(interval)
    }
  }, [playState])

  const onDrop = useCallback(
    (event) => {
      // event.preventDefault();
      const reactFlowBounds = event.target.getBoundingClientRect();
      const data = JSON.parse(event.dataTransfer.getData('application/reactflow'));
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };
      const newNode = {
        id: `${data.id}-${Date.now()}`,
        type: data.type,
        position,
        data: { label: data.label },
      };
      setInternalNodes((nds) => nds.concat(newNode));
    },
    [setInternalNodes]
  );

  return (
    <div className="flex">
        <aside>
            <LibraryPanel
                onAddNode={(node) => setInternalNodes((nds) => nds.concat(node))}
            />
        </aside>
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
            nodes={internalNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            colorMode='dark'
            attributionPosition='top-right'
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
        >
            <MiniMap zoomable pannable nodeClassName={nodeClassName} />
            <Controls />
            <Background />
        </ReactFlow>
        </div>
    </div>
  )
}
