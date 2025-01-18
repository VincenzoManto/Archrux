import { memo, useEffect } from 'react';
import {
  Position,
  Handle,
  useReactFlow,
  useHandleConnections,
  useNodesData,
  type NodeProps,
} from '@xyflow/react';
 
import { isTextNode, type MyNode } from '../initialElements';
 
function UppercaseNode({ id }: NodeProps) {
  const { updateNodeData } = useReactFlow();
  const connections = useHandleConnections({
    type: 'target',
  });
  const nodesData = useNodesData<MyNode>(connections[0]?.source);
  const textNode = isTextNode(nodesData) ? nodesData : null;
 
  useEffect(() => {
    updateNodeData(id, { text: textNode?.data.text.toUpperCase() });
  }, [textNode]);
 
  return (
    <div>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={connections.length === 0}
      />
      <div>uppercase transform</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}