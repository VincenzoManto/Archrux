import React from 'react'
import {
  IconAnalyze,
  IconArrowMerge,
  IconArrowsDiff,
  IconArrowsJoin,
  IconArrowsSplit,
  IconBrandJavascript,
  IconCalendarDue,
  IconChartBar,
  IconChartHistogram,
  IconChartLine,
  IconChartPie,
  IconChartRadar,
  IconChartScatter,
  IconColumnRemove,
  IconCubeSpark,
  IconCubeUnfolded,
  IconCursorText,
  IconDatabaseLeak,
  IconFilterBolt,
  IconLambda,
  IconMatrix,
  IconSortAscending,
  IconTable,
  IconTestPipe,
  IconTextCaption,
  IconTextGrammar,
  IconWebhook,
} from '@tabler/icons-react'
import { MarkerType } from '@xyflow/react'
import { NodeType } from '../../../lib/publicTypes'

export const nodes = [
  {
    id: 'annotation-1',
    type: 'annotation',
    draggable: false,
    selectable: false,
    data: {
      level: 1,
      label:
        'Built-in node and edge types. Draggable, deletable and connectable!',
      arrowStyle: {
        right: 0,
        bottom: 0,
        transform: 'translate(-30px,10px) rotate(-80deg)',
      },
    },
    position: { x: -200, y: -30 },
  },
  {
    id: '1-1',
    type: 'input',
    data: {
      label: 'Input Node',
    },
    position: { x: 150, y: 0 },
  },
  {
    id: '1-2',
    type: 'default',
    data: {
      label: 'Default Node',
    },
    position: { x: 0, y: 100 },
  },
  {
    id: '1-3',
    type: 'output',
    data: {
      label: 'Output Node',
    },
    position: { x: 300, y: 100 },
  },
  {
    id: 'annotation-2',
    type: 'annotation',
    draggable: false,
    selectable: false,
    data: {
      level: 2,
      label: 'Sub flows, toolbars and resizable nodes!',
      arrowStyle: {
        left: 0,
        bottom: 0,
        transform: 'translate(5px, 25px) scale(1, -1) rotate(100deg)',
      },
    },
    position: { x: 220, y: 200 },
  },
  {
    id: '2-1',
    type: 'group',
    position: {
      x: -170,
      y: 250,
    },
    style: {
      width: 380,
      height: 180,
    },
  },
  {
    id: '2-2',
    data: {},
    type: 'tools',
    position: { x: 50, y: 50 },
    style: {
      width: 80,
      height: 80,
    },
    parentId: '2-1',
    extent: 'parent',
  },
  {
    id: '2-3',
    type: 'resizer',
    data: {
      label: 'Resize Me',
    },
    position: { x: 250, y: 50 },
    style: {
      width: 80,
      height: 80,
    },
    parentId: '2-1',
    extent: 'parent',
  },
  {
    id: 'annotation-3',
    type: 'annotation',
    draggable: false,
    selectable: false,
    data: {
      level: 3,
      label: <>Nodes and edges can be anything and are fully customizable!</>,
      arrowStyle: {
        right: 0,
        bottom: 0,
        transform: 'translate(-35px, 20px) rotate(-80deg)',
      },
    },
    position: { x: -40, y: 570 },
  },
  {
    id: '3-2',
    type: 'textinput',
    position: { x: 150, y: 650 },
    data: {},
  },
  {
    id: '3-1',
    type: 'circle',
    position: { x: 350, y: 500 },
    data: {},
  },
]

export const edges = [
  {
    id: 'e1-2',
    source: '1-1',
    target: '1-2',
    label: 'edge',
    type: 'smoothstep',
  },
  {
    id: 'e1-3',
    source: '1-1',
    target: '1-3',
    animated: true,
    label: 'animated edge',
  },
  {
    id: 'e2-2',
    source: '1-2',
    target: '2-2',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e2-3',
    source: '2-2',
    target: '2-3',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e3-3',
    source: '2-3',
    sourceHandle: 'a',
    target: '3-2',
    type: 'button',
    animated: true,
    style: { stroke: 'rgb(158, 118, 255)' },
  },
  {
    id: 'e3-4',
    source: '2-3',
    sourceHandle: 'b',
    target: '3-1',
    type: 'button',
  },
]

export const NODE_CATALOG: { title: string; items: NodeType[] }[] = [
  {
    title: 'Data',
    items: [
      {
        id: 'exampleData',
        label: 'Example Data',
        icon: IconDatabaseLeak,
      },

      {
        id: 'URL',
        label: 'URL',
        icon: IconWebhook,
      },
    ],
  },
  {
    title: 'Alter',
    items: [
      {
        id: 'filter',
        label: 'Filter',
        icon: IconFilterBolt,
      },
      {
        id: 'sort',
        label: 'Sort',
        icon: IconSortAscending,
      },
      {
        id: 'flatten',
        label: 'Flatten',
        icon: IconLambda
      },
      {
        id: 'merge',
        label: 'Merge',
        icon: IconArrowMerge,
      },
      {
        id: 'crop',
        label: 'Crop',
        icon: IconColumnRemove,
      },
      {
        id: 'groupby',
        label: 'Group By',
        icon: IconArrowsDiff,
      },
      {
        id: 'rename',
        label: 'Rename',
        icon: IconTextGrammar,
      },
      {
        id: 'split',
        label: 'Split',
        icon: IconArrowsSplit,
      },
      {
        id: 'join',
        label: 'Join',
        icon: IconArrowsJoin,
      },
      {
        id: 'transpose',
        label: 'Transpose',
        icon: IconMatrix,
      },
      {
        id: 'pivot',
        label: 'Pivot',
        icon: IconCubeUnfolded,
      },
      {
        id: 'javascript',
        label: 'JavaScript',
        icon: IconBrandJavascript,
      },
    ],
  },
  {
    title: 'Charts',
    items: [
      {
        id: 'scatter',
        label: 'Scatter Chart',
        icon: IconChartScatter,
      },
      {
        id: 'bar',
        label: 'Bar Chart',
        icon: IconChartBar,
      },
      {
        id: 'table',
        label: 'Table',
        icon: IconTable,
      },
      {
        id: 'Pie Chart',
        label: 'Pie Chart',
        icon: IconChartPie,
      },
      {
        id: 'Histogram',
        label: 'Histogram',
        icon: IconChartHistogram,
      },
      {
        id: 'line',
        label: 'Line Chart',
        icon: IconChartLine,
      },
      {
        id: 'radar',
        label: 'Radar Chart',
        icon: IconChartRadar,
      },
    ],
  },
  {
    title: 'Compute',
    items: [
      {
        id: 'stats',
        label: 'Stats',
        icon: IconAnalyze,
      },
      {
        id: 'ttest',
        label: 'T-Test',
        icon: IconTestPipe,
      },
    ],
  },
  {
    title: 'Annotations',
    items: [
      {
        id: 'annotation',
        label: 'Annotation',
        icon: IconTextCaption,
      },
      {
        id: 'text',
        label: 'Text',
        icon: IconCursorText,
      },
      {
        id: 'Heatmap',
        label: 'Heatmap Calendar',
        icon: IconCalendarDue,
      },
    ],
  },
]
