import { memo, useEffect, useState } from 'react'
import {
  Handle,
  Node,
  NodeProps,
  Position,
  useHandleConnections,
  useNodesData,
  useReactFlow,
} from '@xyflow/react'
import _ from 'lodash'
import {
  DataNodeProps,
  Dataset,
  TransformationNodeProps,
} from '@/lib/publicTypes'
import { Label } from '@/components/ui/label'
import { Input } from '../../../../../components/ui/input'
import { TopHandle } from '../TopHandle'

function FlattenNode({ id, data }: NodeProps<Node<TransformationNodeProps>>) {
  const connections = useHandleConnections({
    type: 'target',
  })
  const nodesData = useNodesData<Node<DataNodeProps | TransformationNodeProps>>(
    connections.map((connection) => connection.source)
  )

  const { updateNodeData } = useReactFlow()
  const [depth, setDepth] = useState<number>(1)
  const [input, setInput] = useState<Dataset>([])

  useEffect(() => {
    if (!nodesData?.length) return
    const input = nodesData[0].data?.output
    if (input) {
      setInput(input)
      const depth = 4
      let flattened = input
      if (!Array.isArray(flattened)) {
        flattened = Object.values(flattened).flat()
      }
      if (Array.isArray(flattened)) {
        for (let i = 0; i < depth; i++) {
          flattened = _.flatMap(flattened, (row: any) => {
            if (!row) {
              return row
            }
            const keys = Object.keys(row)
            keys.forEach((key) => {
              if (Array.isArray(row[key])) {
              } else if (typeof row[key] === 'object') {
                const nestedKeys = Object.keys(row[key])
                nestedKeys.forEach((nestedKey) => {
                  row[`${key}_${nestedKey}`] = row[key][nestedKey]
                })
                delete row[key]
              }
            })
            return row
          })
        }
      }
      updateNodeData(id, { depth: depth, output: flattened })
    }
  }, [nodesData, depth])

  return (
    <div>
      <TopHandle name='Flatten' />
      <Label>Depth</Label>
      <Input
        type='number'
        value={depth}
        min={1}
        onChange={(e) => setDepth(parseInt(e.target.value))}
      />

      <Handle
        type='target'
        className='custom-handle'
        position={Position.Left}
      />
      <Handle
        type='source'
        className='custom-handle'
        position={Position.Right}
      />
    </div>
  )
}
export default memo(FlattenNode)
