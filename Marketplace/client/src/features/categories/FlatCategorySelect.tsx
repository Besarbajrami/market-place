import type { CategoryNode } from "./categoryTypes";

type FlatCategory = {
  id: string;
  label: string;
};

function flattenCategories(
  categories: CategoryNode[],
  parentPath: string[] = []
): FlatCategory[] {
  let result: FlatCategory[] = [];

  for (const c of categories) {
    const path = [...parentPath, c.name];

    result.push({
      id: c.id,
      label: path.join(" › ")
    });

    if (c.children?.length) {
      result = result.concat(
        flattenCategories(c.children, path)
      );
    }
  }

  return result;
}

type Props = {
  categories: CategoryNode[];
  value: string | null;
  onChange: (id: string) => void;
};

export function FlatCategorySelect({
  categories,
  value,
  onChange
}: Props) {
  const flat = flattenCategories(categories);

  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      required
      style={{ width: "100%", padding: 8 }}
    >
      <option value="">Select category</option>

      {flat.map((c) => (
        <option key={c.id} value={c.id}>
          {c.label}
        </option>
      ))}
    </select>
  );
}
