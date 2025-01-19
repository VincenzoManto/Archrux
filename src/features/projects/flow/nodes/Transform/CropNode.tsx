import { memo, useEffect, useState } from 'react'
import { Handle, Node, NodeProps, Position, useHandleConnections, useNodesData, useReactFlow } from '@xyflow/react'
import { CropNodeProps, DataNodeProps, Dataset, TransformationNodeProps } from '@/lib/publicTypes'
import { MultiColumnSelector } from '../ColumnSelector'
import { Label } from '@/components/ui/label'
import { IconGripVertical } from '@tabler/icons-react'
import { Separator } from '@radix-ui/react-separator'

function CropNode({
  id,
  data,
}: NodeProps<Node<CropNodeProps>>) {

    const connections = useHandleConnections({
      type: 'target',
    })
    const nodesData = useNodesData<Node<DataNodeProps | TransformationNodeProps>>(
      connections.map((connection) => connection.source)
    )

  const { updateNodeData } = useReactFlow()
  const [selectedColumns, setSelectedColumns] = useState<string[]>(data.selectedColumns || [])
  const [input, setInput] = useState<Dataset>([])

  useEffect(() => {
    if (!nodesData?.length) return
    const input = nodesData[0].data?.output;
    if (input) {
      setInput(input)
      let cropped = []
      try {
        cropped = input?.map((row: any) => {
          const newRow = { ...row }
          selectedColumns.forEach((col) => {
            delete newRow[col]
          })
          return newRow
        })
      } catch (error) {
        console.error('Error cropping data:', error)
      }
      updateNodeData(id, { 
        selectedColumns,
        output: cropped })
    }
  }, [nodesData?.length, selectedColumns])

  return (
    <div>
    <div className='drag-handle__custom border-b py-2 text-left mb-2'>
      <IconGripVertical size={12} className='inline' />
      Crop
      <Separator className='shadow' />
    </div>
      <Label>Columns to Remove</Label>
      <MultiColumnSelector
        data={{ input }}
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
      />
      <Handle type='target' className='custom-handle' position={Position.Left} />
      <Handle type='source' className='custom-handle' position={Position.Right} />
    </div>
  )
}
export default memo(CropNode);