import { memo, useEffect, useState } from 'react'
import { Handle, Node, NodeProps, Position, useReactFlow } from '@xyflow/react'
import { DataNodeProps } from '../../../../../lib/publicTypes'
import { IconGripVertical } from '@tabler/icons-react'
import { Separator } from '@radix-ui/react-separator'

function ExampleDataNode({
  id,
}: NodeProps<Node<DataNodeProps>>) {
  const { updateNodeData } = useReactFlow()

  useEffect(() => {
    const randomData = Array.from({ length: 100 }, () => ({
        x: Math.random(),
        y: Math.random(),
        z: Math.random(),
        }))
    updateNodeData(id, { output: randomData })
  }, [])

  return (
    <div>
    <div className='drag-handle__custom border-b py-2 text-left mb-2'>
      <IconGripVertical size={12} className='inline' />
      Example data
      <Separator className='shadow' />
    </div>
      <Handle type='source' className='custom-handle' position={Position.Right} />
    </div>
  )
}
export default memo(ExampleDataNode);