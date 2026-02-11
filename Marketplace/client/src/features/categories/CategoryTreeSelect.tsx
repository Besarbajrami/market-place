import { useEffect, useState } from "react";
import type { CategoryNode } from "./categoryTypes";
import { useTranslation } from "react-i18next";


  
  type Props = {
    categories: CategoryNode[];
    value: string | null;
    onChange: (categoryId: string) => void;
  };
  
  export function CategoryTreeSelect({ categories, value, onChange }: Props) {
    const [path, setPath] = useState<string[]>([]);
    const { t } = useTranslation();

    // rebuild path when editing existing listing
    useEffect(() => {
      if (!value) return;
  
      const findPath = (
        nodes: CategoryNode[],
        target: string,
        acc: string[]
      ): string[] | null => {
        for (const n of nodes) {
          if (n.id === target) return [...acc, n.id];
          const child = findPath(n.children, target, [...acc, n.id]);
          if (child) return child;
        }
        return null;
      };
  
      const p = findPath(categories, value, []);
      if (p) setPath(p);
    }, [value, categories]);
  
    const levels: CategoryNode[][] = [];
    let current = categories;
  
    levels.push(current);
  
    for (const id of path) {
      const node = current.find(c => c.id === id);
      if (!node) break;
      current = node.children;
      if (current.length) levels.push(current);
    }
  
    function select(levelIndex: number, id: string) {
      const newPath = [...path.slice(0, levelIndex), id];
      setPath(newPath);
  
      const node = levels[levelIndex].find(c => c.id === id);
      if (node && node.children.length === 0) {
        onChange(id); // ✅ LEAF ONLY
      }
    }
  
    return (
      <div style={{ display: "grid", gap: 8 }}>
        {levels.map((cats, i) => (
          <select
            key={i}
            value={path[i] ?? ""}
            onChange={e => select(i, e.target.value)}
          >
      <option value="">{t("common.SelectCategory")}</option>

            {cats.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        ))}
      </div>
    );
  }
  