import { memo, useEffect, useState } from 'react'
import { Handle, Node, NodeProps, Position, useHandleConnections, useNodesData, useReactFlow } from '@xyflow/react'
import { AddColumnNodeProps, DataNodeProps, Dataset, TransformationNodeProps } from '@/lib/publicTypes'
import { Label } from '@/components/ui/label'
import { IconGripVertical } from '@tabler/icons-react'
import { Separator } from '@radix-ui/react-separator'
import { Input } from '../../../../../components/ui/input'

function AddColumnNode({
  id,
  data,
}: NodeProps<Node<AddColumnNodeProps>>) {

  const connections = useHandleConnections({
    type: 'target',
  })
  const nodesData = useNodesData<Node<DataNodeProps | TransformationNodeProps>>(
    connections.map((connection) => connection.source)
  )

  const { updateNodeData } = useReactFlow()
  const [newColumnName, setNewColumnName] = useState<string>(data.newColumnName || '')
  const [formula, setFormula] = useState<string>(data.formula || '')
  const [input, setInput] = useState<Dataset>([])

  useEffect(() => {
    if (!nodesData?.length) return
    const input = nodesData[0].data?.output;
    if (input) {
      setInput(input)
      let updatedData = []
      try {
        updatedData = input?.map((row: any) => {
          const newRow = { ...row }
          newRow[newColumnName] = eval(formula) // Note: eval is used here for simplicity, but it's not recommended for production code
          return newRow
        })
      } catch (error) {
        console.error('Error adding column:', error)
      }
      updateNodeData(id, { 
        newColumnName,
        formula,
        output: updatedData })
    }
  }, [nodesData?.length, newColumnName, formula])

  return (
    <div>
      <div className='drag-handle__custom border-b py-2 text-left mb-2'>
        <IconGripVertical size={12} className='inline' />
        Add Column
        <Separator className='shadow' />
      </div>
      <Label>New Column Name</Label>
      <Input
        type="text"
        value={newColumnName}
        onChange={(e) => setNewColumnName(e.target.value)}
      />
      <Label>Formula</Label>
      <Input
        type="text"
        value={formula}
        onChange={(e) => setFormula(e.target.value)}
      />
      <Handle type='target' className='custom-handle' position={Position.Left} />
      <Handle type='source' className='custom-handle' position={Position.Right} />
    </div>
  )
}
export default memo(AddColumnNode);