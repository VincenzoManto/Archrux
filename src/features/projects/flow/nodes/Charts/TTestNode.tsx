import { memo, useEffect, useState } from 'react'
import { IconGripVertical } from '@tabler/icons-react'
import {
  Handle,
  Node,
  NodeProps,
  Position,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react'
import { Separator } from '@/components/ui/separator'
import { DataNodeProps, Dataset, TransformationNodeProps, VisualizationNodeProps } from '@/lib/publicTypes'
import { ColumnSelector } from '../ColumnSelector'
import { Label } from '@/components/ui/label'
import { tTestTwoSample } from '@/lib/statistics' // Assuming you have a function to calculate t-test

function TTestNode(props: NodeProps<Node<VisualizationNodeProps>>) {
  const connections = useHandleConnections({
    type: 'target',
  })
  const nodesData = useNodesData<Node<DataNodeProps | TransformationNodeProps>>(
    connections.map((connection) => connection.source)
  )

  const [xColumn, setXColumn] = useState<string>('')
  const [yColumn, setYColumn] = useState<string>('')
  const [tTestResult, setTTestResult] = useState<number | null>(null)
  const [pValue, setPValue] = useState<number | null>(null)
  const [input, setInput] = useState<Dataset>([])

  useEffect(() => {
    if (!nodesData?.length) return
    const input = nodesData[0].data?.output;
    if (input) {
      setInput(input)
      if (!xColumn && !yColumn) {
        setXColumn(Object.keys(input[0])[0])
        setYColumn(Object.keys(input[0])[1])
      }
    }
    if (!input || !xColumn || !yColumn) return

    const xData = input.map((row: any) => row[xColumn] as number)
    const yData = input.map((row: any) => row[yColumn] as number)

    const { tValue, pValue } = tTestTwoSample(xData, yData)
    setTTestResult(tValue)
    setPValue(pValue)
  }, [nodesData, xColumn, yColumn])

  return (
    <div>
      <div className='drag-handle__custom border-b py-2 text-left mb-2'>
        <IconGripVertical size={12} className='inline' />
        T-Test
        <Separator className='shadow' />
      </div>
      <Label>X-Axis</Label>
      <ColumnSelector
        data={{ input: input }}
        selectedColumn={xColumn}
        setSelectedColumn={setXColumn}
      />
      <Label>Y-Axis</Label>
      <ColumnSelector
        data={{ input: input }}
        selectedColumn={yColumn}
        setSelectedColumn={setYColumn}
      />
      <div>
        <Label>T-Test Result:</Label>
        <div>{tTestResult !== null ? tTestResult.toFixed(4) : 'N/A'}</div>
      </div>
      <div>
        <Label>P-Value:</Label>
        <div>{pValue !== null ? pValue.toFixed(4) : 'N/A'}</div>
      </div>
      <Handle
        type='target'
        className='custom-handle'
        position={Position.Left}
      />
    </div>
  )
}
export default memo(TTestNode)