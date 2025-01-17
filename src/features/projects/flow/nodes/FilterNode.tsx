import { memo, useEffect, useState } from 'react'
import { Handle, Node, NodeProps, Position, useReactFlow } from '@xyflow/react'
import { TransformationNodeProps } from '../../../../lib/publicTypes'
import { ColumnSelector } from './ColumnSelector'
import { Textarea } from '../../../../components/ui/textarea'
import { Label } from '../../../../components/ui/label'
import { Header } from '../../../../components/layout/header'
import { IconDots, IconDragDrop, IconGripVertical } from '@tabler/icons-react'
import { Separator } from '@radix-ui/react-separator'

function FilterNode({
  id,
  data,
}: NodeProps<Node<TransformationNodeProps>>) {
  const { updateNodeData } = useReactFlow()
  const [selectedColumn, setSelectedColumn] = useState<string>('')

  useEffect(() => {
    if (!data.input) return
    const filtered = data.input.filter((row) => +row[selectedColumn] > 0)
    updateNodeData(id, { output: filtered })
  }, [data?.input, selectedColumn])

  return (
    <div>
    <div className='drag-handle__custom border-b py-2 text-left mb-2'>
      <IconGripVertical size={12} className='inline' />
      Filter
      <Separator className='shadow' />
    </div>
      <Label>Column:</Label>
      <ColumnSelector
        data={{ input: data.input }}
        selectedColumn={selectedColumn}
        setSelectedColumn={setSelectedColumn}
      />
      <Handle type='source' className='custom-handle' position={Position.Right} />
      <Handle type='source' className='custom-handle' position={Position.Left} />
    </div>
  )
}
export default memo(FilterNode);