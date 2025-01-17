import { Handle, Position } from "@xyflow/react";
import { NodeType } from "../../../../lib/publicTypes";

const createNodeConnectors = (node: NodeType) => {
    return {
      sourceHandles: node.outputs.map((output: any, idx: any) => ({
        id: `${node.id}-output-${idx}`,
        type: output,
        position: Position.Right,
      })),
      targetHandles: node.inputs.map((input: any, idx: any) => ({
        id: `${node.id}-input-${idx}`,
        type: input,
        position: Position.Left,
      })),
    };
  };
  

import { ReactNode } from 'react';

export const NodeRenderer = ({ id, label, inputs, outputs, children }: { id: string, label: string, inputs: any[], outputs: any[], children: ReactNode }) => {
  
    return (
      <div style={{ padding: 10, background: '#2c3e50', color: '#ecf0f1', borderRadius: 8 }}>
        <h4>{label}</h4>
        {inputs.map((input: any, idx: any) => (
          <Handle key={idx} id={`${id}-input-${idx}`} type="target" position={Position.Left} />
        ))}
        {children}
        {outputs.map((output: any, idx: any) => (
          <Handle key={idx} id={`${id}-output-${idx}`} type="source" position={Position.Right} />
        ))}
      </div>
    );
  };
  