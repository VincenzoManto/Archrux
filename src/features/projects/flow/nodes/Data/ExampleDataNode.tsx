import { memo, useEffect, useState } from 'react'
import { Handle, Node, NodeProps, Position, useReactFlow } from '@xyflow/react'
import { DataNodeProps } from '../../../../../lib/publicTypes'
import { TopHandle } from '../TopHandle'

function ExampleDataNode({ id }: NodeProps<Node<DataNodeProps>>) {
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
      <TopHandle name='Example data' />
      <Handle
        type='source'
        className='custom-handle'
        position={Position.Right}
      />
    </div>
  )
}
export default memo(ExampleDataNode)
