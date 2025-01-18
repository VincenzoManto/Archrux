import { NodeType } from "../../../lib/publicTypes";
import { NODE_CATALOG } from "./nodes";

export const SidebarFlow: React.FC<{ onDragStart: (event: any, nodeType: NodeType) => void, className: string }> = ({
    onDragStart,
    className
  }) => {

    

    return (
      <div style={{ padding: 10, zIndex: 9999 }} className={className}>
        <h3>Nodes</h3>
        {NODE_CATALOG.map((node) => (
          <div
            key={node.id}
            draggable
            onDragStart={(event) => onDragStart(event, node)}
            style={{
              padding: 10,
              margin: 5,
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
  