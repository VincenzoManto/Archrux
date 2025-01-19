import { Edge, Node } from "@xyflow/react"

export interface Project {
  name: string
  logo: any
  id: string
  createdAt: Date | number
  plan: string
  idx?: string
}

export interface Message {
  title: string
  url: string
  icon: any
}

// Dataset Row Type
export type DatasetRow = {
  [key: string]: string | number | boolean
}

// Dataset Type
export type Dataset = DatasetRow[]

export type URLDataNodeProps = DataNodeProps & {
  url: string
  method: string
  body: string
  headers: string
}

export type SheetDataNodeProps = DataNodeProps & {
  spreadsheetId: string
  range: string
  apiKey: string
}

export type DataNodeProps = {
    output: Dataset | any
}

export type GroupByNodeProps = TransformationNodeProps & {
  selectedColumn: string
  selectedAgg: string
  subColumns: string[]
}

export type CropNodeProps = TransformationNodeProps & {
  selectedColumns: string[]
}

export type AddColumnNodeProps = TransformationNodeProps & {
  newColumnName: string
  formula: string
}

// Transformation Node Input Type
export type TransformationNodeProps = {
  input: Dataset // Input dataset from upstream
  input2?: Dataset | null // Second input dataset from upstream
  columns: string[] // Columns available for selection
  setOutput: (data: Dataset) => void // Function to send output downstream
  output: Dataset | any // Output dataset to send downstream
}

export type BarNodeProps = VisualizationNodeProps & {
  xColumn: string
  yColumns: string[]
  subCategoryColumn: string
}

// Visualization Node Input Type
export type VisualizationNodeProps = {
  input: Dataset | null // Input dataset from upstream
  columns: string[] // Columns available for selection
}

export type NodeInput = Dataset | null
export type NodeOutput = Dataset | any

export type NodeType = {
  id: string;
  label: string;
  icon: any;
};


export type Structure = {
  nodes: Node[]
  edges: Edge[]
}