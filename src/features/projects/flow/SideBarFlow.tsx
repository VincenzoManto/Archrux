import { Badge } from "../../../components/ui/badge";
import { Label } from "../../../components/ui/label";
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
          <>
            <Label>{node.title}</Label>
            {node.items.map((node) => (
              <Badge
                key={node.id}
                draggable
                variant='secondary'
                className='block p-2 m-2 rounded cursor-grab'
                onDragStart={(event) => onDragStart(event, node)}
              >
                {<node.icon className='inline mr-2' size={16} />}
                {node.label}
              </Badge>
            ))}
          </>
        ))}
      </div>
    );
  };
  