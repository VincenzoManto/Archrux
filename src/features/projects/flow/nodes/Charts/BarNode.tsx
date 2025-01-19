import { memo } from 'react'
import {
  Node,
  NodeProps,
} from '@xyflow/react'
import {
  BarNodeProps,
} from '@/lib/publicTypes'
import ChartBaseNode from './ChartBaseNode'

function BarNode(props: NodeProps<Node<BarNodeProps>>) {
  
  return (
    <ChartBaseNode 
      {...props}
    type='bar' />
  )
}
export default memo(BarNode)
