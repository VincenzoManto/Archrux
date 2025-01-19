import { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Node } from '@xyflow/react'
import ReactJson from 'react-json-view'
import { Dataset } from '../../../lib/publicTypes'
import { DataTable } from '../../tasks/components/data-table'
import { IconX } from '@tabler/icons-react'

function getNodeColumns(data: Dataset) {
  return Object.keys(data[0]).map((key) => ({
    accessorKey: key,
    header: key,
  }))
}

export function RightSidebarFlow({
  selectedNode,
  setSelectedNode
}: {
  selectedNode: Node<any> | null,
  setSelectedNode: (node: Node<any> | null) => void
}) {
  const [columns, setColumns] = useState<ColumnDef<any, any>[] | null>(null)

  useEffect(() => {
    try {
      setColumns(getNodeColumns(selectedNode?.data.output as any))
    } catch {}
  }, [selectedNode])

  return (
    selectedNode?.data.output && (
      <div className='absolute bottom-0 right-0 p-4 w-1/5 bg-primary-foreground shadow-lg h-full overflow-auto no-scrollbar'>
        <IconX className='cursor-pointer float-right text-muted-foreground' 
          onClick={() => {
            setSelectedNode(null)
          }}

        />
        {columns ? (
          <DataTable data={selectedNode?.data.output} columns={columns} />
        ) : (
          <ReactJson src={selectedNode?.data.output} collapsed={true} theme={'grayscale'} />
        )}
      </div>
    )
  )
}
