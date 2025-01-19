import { memo } from 'react'
import {
  Node,
  NodeProps,
} from '@xyflow/react'
import {
  BarNodeProps,
} from '@/lib/publicTypes'
import ChartBaseNode from './ChartBaseNode'

function ScatterNode(props: NodeProps<Node<BarNodeProps>>) {
  
  return (
    <ChartBaseNode 
      {...props}
    type='scatter' />
  )
}
export default memo(ScatterNode)
