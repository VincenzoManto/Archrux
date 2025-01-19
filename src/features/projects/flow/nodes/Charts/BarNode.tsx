import { memo, useEffect, useRef, useState } from 'react'
import { IconGripVertical } from '@tabler/icons-react'
import {
  Handle,
  Node,
  NodeProps,
  Position,
  useHandleConnections,
  useNodesData,
  useReactFlow,
} from '@xyflow/react'
import * as echarts from 'echarts'
import {
  BarNodeProps,
  DataNodeProps,
  Dataset,
  TransformationNodeProps,
} from '@/lib/publicTypes'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ColumnSelector, MultiColumnSelector } from '../ColumnSelector'

function BarNode({ id, data }: NodeProps<Node<BarNodeProps>>) {
  const connections = useHandleConnections({
    type: 'target',
  })
  const nodesData = useNodesData<Node<DataNodeProps | TransformationNodeProps>>(
    connections.map((connection) => connection.source)
  )

  const [xColumn, setXColumn] = useState<string>(data.xColumn || '')
  const [yColumns, setYColumns] = useState<string[]>(data.yColumns || [])
  const [subCategoryColumn, setSubCategoryColumn] = useState<string>(
    data.subCategoryColumn || 'Column'
  )
  const chartRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState<Dataset>([])
  const { updateNodeData } = useReactFlow()

  useEffect(() => {
    if (!nodesData?.length) return
    const input = nodesData[0].data?.output
    if (input) {
      setInput(input)
      if (!xColumn && !yColumns.length) {
        setXColumn(Object.keys(input[0])[0])
        setYColumns([Object.keys(input[0])[1]])
      }
    }
    if (!input || !xColumn || !yColumns.length) return
    const chart = echarts.init(chartRef.current!)
    const xData = input.map((row: any) => row[xColumn] as string)

    let series = []
    if (subCategoryColumn && subCategoryColumn !== 'Column') {
      const subCategories = Array.from(
        new Set(input.map((row: any) => row[subCategoryColumn]))
      )
      series = subCategories.flatMap((subCategory) =>
        yColumns.map((yColumn) => ({
          name: `${subCategory} - ${yColumn}`,
          type: 'bar',
          stack: subCategory,
          data: input
            .filter((row: any) => row[subCategoryColumn] === subCategory)
            .map((row: any) => row[yColumn] as number),
        }))
      )
    } else {
      series = yColumns.map((yColumn) => ({
        name: yColumn,
        type: 'bar',
        data: input.map((row: any) => row[yColumn] as number),
      }))
    }

    chart.setOption({
      color: [
        '#00d86f',
        '#ff5b5b',
        '#ffcc00',
        '#00a1ff',
        '#ff00ff',
        '#00ff00',
        '#0000ff',
        '#ff0000',
        '#00ffff',
        '#ffff00',
      ],
      xAxis: { type: 'category', name: xColumn, data: xData },
      yAxis: { type: 'value' },
      series: series,
    })

    updateNodeData(id, {
      xColumn,
      yColumns,
      subCategoryColumn,
      output: input,
    })
    return () => chart.dispose()
  }, [nodesData, xColumn, yColumns, subCategoryColumn])

  return (
    <div>
      <div className='drag-handle__custom border-b py-2 text-left mb-2'>
        <IconGripVertical size={12} className='inline' />
        Bar
        <Separator className='shadow' />
      </div>
      <Label>X-Axis</Label>
      <ColumnSelector
        data={{ input: input }}
        selectedColumn={xColumn}
        setSelectedColumn={setXColumn}
      />
      <Label>Y-Axis</Label>
      <MultiColumnSelector
        data={{ input: input }}
        selectedColumns={yColumns}
        setSelectedColumns={setYColumns}
      />
      <Label>Subcategory</Label>
      <ColumnSelector
        data={{ input: input }}
        additionalColumns={['Column']}
        acceptEmpty={true}
        selectedColumn={subCategoryColumn}
        setSelectedColumn={setSubCategoryColumn}
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
export default memo(BarNode)
