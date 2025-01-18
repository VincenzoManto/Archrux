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
      <Select onValueChange={(e) => setSelectedColumn(e)} value={selectedColumn}>
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

export interface OperatorSelectorProps {
  selectedOperator: string
  setSelectedOperator: (operator: string) => void
}

export function OperatorSelector({
  selectedOperator,
  setSelectedOperator,
}: OperatorSelectorProps) {
  const [operators] = useState<string[]>(['>', '<', '==', '!=', '>=', '<=', 'contains', 'startsWith', 'endsWith', 'regex'])


  return (
    <>
      <Select onValueChange={(e) => setSelectedOperator(e)} value={selectedOperator}>
          <SelectTrigger>
            <SelectValue placeholder='Operator' />
          </SelectTrigger>
        <SelectContent>
          {operators.map((col) => (
            <SelectItem key={col} value={col}>
              {col}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}