import { IconGripVertical, IconX } from '@tabler/icons-react'
import { Separator } from '../../../../components/ui/separator'
import { Node } from '@xyflow/react'

export function TopHandle({
    name,
    node
}: {
    name: string,
    node: Node
}) {
  return (
    <div className='drag-handle__custom border-b py-2 text-left mb-2'>
      <IconGripVertical size={12} className='inline mr-2' />
      {name}
      <IconX size={12} className='inline float-right cursor-pointer' onClick={
        () => {
            
        }
      }/>
      <Separator className='shadow' />
    </div>
  )
}
