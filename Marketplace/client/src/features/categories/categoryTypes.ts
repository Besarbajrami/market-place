export type CategoryNode = {
    id: string;
    code: string;
    name: string;
    slug: string;
    children: CategoryNode[];
  };
  export function findCategoryPath(
    nodes: CategoryNode[],
    targetId: string,
    path: CategoryNode[] = []
  ): CategoryNode[] | null {
    for (const node of nodes) {
      const newPath = [...path, node];
  
      if (node.id === targetId) {
        return newPath;
      }
  
      const found = findCategoryPath(node.children, targetId, newPath);
      if (found) return found;
    }
  
    return null;
  }
  export enum CategoryAttributeType {
    Text = 1,
    Number = 2,
    Select = 3,
    Boolean = 4,
  }
  