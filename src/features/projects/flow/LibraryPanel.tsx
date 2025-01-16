import { Button } from '../../../components/ui/button'
import { UMLComponents } from '../../../lib/umlComponents'



export function LibraryPanel({
  onAddNode,
}: {
  onAddNode: (node: any) => void
}) {
  return (
    <div
      className='p-3 w-full overflow-y-auto no-scrollbar'
      style={{ height: '50vh' }}
    >
      {Object.entries(UMLComponents).map(([category, components]) => (
        <div key={category} className='my-2'>
          <h4 className='text-xs uppercase opacity-50'>{category}</h4>
          {components.map((component) => (
            <Button
              key={component.id}
              variant='outline'
              className='cursor-hand block w-full text-left my-2'
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  'application/reactflow',
                  JSON.stringify(component)
                )
                e.dataTransfer.effectAllowed = 'move'
              }}
            >
              {(component.icon && <component.icon className='mr-2 inline' />) ||
                null}
              {component.label}
            </Button>
          ))}
        </div>
      ))}
    </div>
  )
}
