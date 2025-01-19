import { memo } from 'react'
import {
  Node,
  NodeProps,
} from '@xyflow/react'
import {
  BarNodeProps,
} from '@/lib/publicTypes'
import ChartBaseNode from './ChartBaseNode'

function LineNode(props: NodeProps<Node<BarNodeProps>>) {
  
  return (
    <ChartBaseNode 
      {...props}
    type='line' />
  )
}
export default memo(LineNode)
