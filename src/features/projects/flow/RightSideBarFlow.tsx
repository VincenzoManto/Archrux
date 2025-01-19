import { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Node } from '@xyflow/react'
import ReactJson from 'react-json-view'
import { Dataset } from '../../../lib/publicTypes'
import { DataTable } from '../../tasks/components/data-table'

function getNodeColumns(data: Dataset) {
  return Object.keys(data[0]).map((key) => ({
    accessorKey: key,
    header: key,
  }))
}

export function RightSidebarFlow({
  selectedNode,
}: {
  selectedNode: Node<any> | null
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
        {columns ? (
          <DataTable data={selectedNode?.data.output} columns={columns} />
        ) : (
          <ReactJson src={selectedNode?.data.output} collapsed={true} theme={'grayscale'} />
        )}
      </div>
    )
  )
}
