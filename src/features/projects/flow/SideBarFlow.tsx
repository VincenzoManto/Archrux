import { NodeType } from "../../../lib/publicTypes";
import { NODE_CATALOG, type MyNode } from "./nodes";

export const SidebarFlow: React.FC<{ onDragStart: (event: any, nodeType: NodeType) => void }> = ({
    onDragStart,
  }) => {

    

    return (
      <div style={{ width: 200, padding: 10 }}>
        <h3>Nodes</h3>
        {NODE_CATALOG.map((node) => (
          <div
            key={node.id}
            draggable
            onDragStart={(event) => onDragStart(event, node)}
            style={{
              padding: 10,
              margin: 5,
              background: '#3498db',
              color: 'white',
              borderRadius: 5,
              cursor: 'grab',
            }}
          >
            {node.label}
          </div>
        ))}
      </div>
    );
  };
  