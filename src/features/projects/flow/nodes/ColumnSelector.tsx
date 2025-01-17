import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select'
import { Dataset } from '../../../../lib/publicTypes'
import { FormLabel, FormControl } from '../../../../components/ui/form'
import { Label } from '../../../../components/ui/label'

export interface ColumnSelectorProps {
  data: { input: Dataset | null }
  selectedColumn: string
  setSelectedColumn: (column: string) => void
}

export function ColumnSelector({
  data,
  selectedColumn,
  setSelectedColumn,
}: ColumnSelectorProps) {
  const [columns, setColumns] = useState<string[]>([])

  useEffect(() => {
    if (data.input) {
      setColumns(Object.keys(data.input[0] || {}))
    }
  }, [data.input])

  return (
    <>
      <Select onValueChange={(e) => setSelectedColumn(e)}>
          <SelectTrigger>
            <SelectValue placeholder='Column' />
          </SelectTrigger>
        <SelectContent>
          {columns.map((col) => (
            <SelectItem key={col} value={col}>
              {col}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}
