import { memo, useEffect, useRef, useState } from 'react'
import { IconGripVertical } from '@tabler/icons-react'
import {
  Handle,
  Node,
  NodeProps,
  Position,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react'
import * as echarts from 'echarts'
import {
  DataNodeProps,
  Dataset,
  TransformationNodeProps,
  VisualizationNodeProps,
} from '@/lib/publicTypes'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ColumnSelector, MultiColumnSelector } from '../ColumnSelector'
import { TopHandle } from '../TopHandle'

function RadarNode(props: NodeProps<Node<VisualizationNodeProps>>) {
  const connections = useHandleConnections({
    type: 'target',
  })
  const nodesData = useNodesData<Node<DataNodeProps | TransformationNodeProps>>(
    connections.map((connection) => connection.source)
  )

  const [categoryColumn, setCategoryColumn] = useState<string>('')
  const [valueColumns, setValueColumns] = useState<string[]>([])
  const chartRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState<Dataset>([])

  useEffect(() => {
    if (!nodesData?.length) return
    const input = nodesData[0].data?.output
    if (input) {
      setInput(input)
      if (!categoryColumn && !valueColumns.length) {
        setCategoryColumn(Object.keys(input[0])[0])
        setValueColumns(Object.keys(input[0]).slice(1))
      }
    }
    if (!input || !categoryColumn || !valueColumns.length) return
    const chart = echarts.init(chartRef.current!)
    const indicators = valueColumns.map((col) => ({ name: col }))
    const data = input.map((row: any) => ({
      value: valueColumns.map((col) => row[col]),
      name: row[categoryColumn],
    }))

    chart.setOption({
      color: ['#00d86f', '#ff6f00', '#ff006f', '#6f00ff', '#006fff'],
      radar: {
        indicator: indicators,
      },
      series: [
        {
          type: 'radar',
          data,
        },
      ],
    })

    return () => chart.dispose()
  }, [nodesData, categoryColumn, valueColumns])

  return (
    <div>
      <TopHandle name='Radar' />
      <Label>Category</Label>
      <ColumnSelector
        data={{ input: input }}
        selectedColumn={categoryColumn}
        setSelectedColumn={setCategoryColumn}
      />
      <Label>Values</Label>
      <MultiColumnSelector
        data={{ input: input }}
        selectedColumns={valueColumns}
        setSelectedColumns={(cols) => setValueColumns(cols)}
      />
      <div ref={chartRef} style={{ width: 300, height: 300 }}></div>
      <Handle
        type='target'
        className='custom-handle'
        position={Position.Left}
      />
    </div>
  )
}

export default memo(RadarNode)
