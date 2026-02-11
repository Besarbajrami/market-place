import type { CategoryNode } from "./categoryTypes";

type Props = {
  categories: CategoryNode[];
  value: string;
  onChange: (id: string) => void;
};

export function CategorySelect({ categories, value, onChange }: Props) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} >
      <option value="">Select category</option>

      {categories.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  );
}
