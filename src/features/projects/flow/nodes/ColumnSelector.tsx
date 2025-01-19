import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select'
import { Dataset } from '../../../../lib/publicTypes'
import { Button } from '../../../../components/ui/button'
import { IconPlus } from '@tabler/icons-react'

export interface ColumnSelectorProps {
  data: { input: Dataset | null }
  selectedColumn: string
  setSelectedColumn: (column: string) => void
  acceptEmpty?: boolean
  additionalColumns?: string[]
}

export function ColumnSelector({
  data,
  selectedColumn,
  setSelectedColumn,
  additionalColumns = [],
  acceptEmpty = false,
}: ColumnSelectorProps) {
  const [columns, setColumns] = useState<string[]>([])

  useEffect(() => {
    try {
      if (data.input) {
        const keys = Object.keys(data.input[0] || {})
        if (additionalColumns.length) {
          setColumns([...additionalColumns, ...keys])
        } else if (acceptEmpty) {
          setColumns(['', ...keys])
        } else {
          setColumns(keys)
        }
      }
    } catch (error) {

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

export interface MultiColumnSelectorProps {
  data: { input: Dataset | null }
  selectedColumns: string[]
  setSelectedColumns: (columns: string[]) => void
}

export function MultiColumnSelector({
  data,
  selectedColumns,
  setSelectedColumns,
}: MultiColumnSelectorProps) {
  const [columns, setColumns] = useState<string[]>([])

  useEffect(() => {
    if (data.input) {
      setColumns(Object.keys(data.input[0] || {}))
    }
  }, [data.input])

  const handleColumnChange = (index: number, value: string) => {
    const newSelectedColumns = [...selectedColumns]
    newSelectedColumns[index] = value
    setSelectedColumns(newSelectedColumns)
  }

  const addColumnSelector = () => {
    setSelectedColumns([...selectedColumns, 'Empty'])
  }

  return (
    <>
      {selectedColumns.map((col, index) => (        
        <Select
          key={index}
          onValueChange={(e) => handleColumnChange(index, e)}
          value={col}
        >
          <SelectTrigger className='my-2'>
            <SelectValue placeholder='Column' />
          </SelectTrigger>
          <SelectContent>
            {columns.map((column) => (
              <SelectItem key={column} value={column}>
                {column}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
      {selectedColumns.length < columns.length && (
        <Button onClick={addColumnSelector} className='w-full p-1 my-2' variant='secondary'>
          <IconPlus size={16} className='inline' />
           Column</Button>
      )}
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


export interface OrderSelectorProps {
  selectedOrder: 'asc' | 'desc'
  setSelectedOrder: (order: 'asc' | 'desc') => void
}

export function OrderSelector({
  selectedOrder,
  setSelectedOrder,
}: OrderSelectorProps) {
  const [orders] = useState<string[]>(['asc', 'desc'])

  return (
    <>
      <Select onValueChange={(e) => setSelectedOrder(e as 'asc' | 'desc')} value={selectedOrder}>
        <SelectTrigger>
          <SelectValue placeholder='Order' />
        </SelectTrigger>
        <SelectContent>
          {orders.map((order) => (
            <SelectItem key={order} value={order}>
              {order}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}