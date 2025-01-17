import * as echarts from 'echarts';
import { ColumnSelector } from './ColumnSelector';
import { useEffect, useRef, useState } from 'react';
import { VisualizationNodeProps } from '../../../../lib/publicTypes';

export const ScatterplotNode: React.FC<VisualizationNodeProps> = ({ input, columns }) => {
    const [xColumn, setXColumn] = useState<string>('');
    const [yColumn, setYColumn] = useState<string>('');
    const chartRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      if (!input || !xColumn || !yColumn) return;
      const chart = echarts.init(chartRef.current!);
      const xData = input.map((row) => row[xColumn] as number);
      const yData = input.map((row) => row[yColumn] as number);
  
      chart.setOption({
        xAxis: { type: 'value', name: xColumn },
        yAxis: { type: 'value', name: yColumn },
        series: [{ data: xData.map((x, i) => [x, yData[i]]), type: 'scatter' }],
      });
  
      return () => chart.dispose();
    }, [input, xColumn, yColumn]);
  
    return (
      <div style={{ padding: 10, background: '#9b59b6', borderRadius: 8 }}>
        <h4>Scatterplot</h4>
        <label>X-Axis:</label>
        <ColumnSelector data={{ input }} selectedColumn={xColumn} setSelectedColumn={setXColumn} />
        <label>Y-Axis:</label>
        <ColumnSelector data={{ input }} selectedColumn={yColumn} setSelectedColumn={setYColumn} />
        <div ref={chartRef} style={{ width: 300, height: 300 }}></div>
      </div>
    );
  };
  