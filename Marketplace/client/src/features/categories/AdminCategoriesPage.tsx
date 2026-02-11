import { useState } from "react";
import { useCategories } from "./useCategories";
import type { CategoryNode } from "./categoryTypes";
import { useCreateCategoryAdmin } from "./useAdminCategories";
import { AdminCategoryAttributes } from "./AdminCategoryAttribute";
import { Card } from "../../shared/ui/Card";

type SelectedCategory = {
  id: string | null;
  name: string;
};

export function AdminCategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategoryAdmin();

  const [selected, setSelected] = useState<SelectedCategory>({
    id: null,
    name: "Root",
  });

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!code.trim() || !name.trim() || !slug.trim()) return;

    createCategory.mutate(
      {
        parentId: selected.id,
        code: code.trim(),
        name: name.trim(),
        slug: slug.trim(),
      },
      {
        onSuccess: () => {
          setCode("");
          setName("");
          setSlug("");
        },
      }
    );
  }

  if (isLoading) return <div>Loading categories...</div>;

  return (
    <div style={{ display: "flex", gap: 32, padding: 24 }}>
      {/* LEFT */}
      <div style={{ flex: 1 }}>
        <h2>Category Tree</h2>

        <button
          type="button"
          onClick={() => setSelected({ id: null, name: "Root" })}
        >
          + Add root category
        </button>

        <Card padding={12} >
          <CategoryTreeView
            nodes={categories ?? []}
            selectedId={selected.id}
            onSelect={(id, name) => setSelected({ id, name })}
          />
        </Card>

        {selected.id && (
          <Card >
            <AdminCategoryAttributes categoryId={selected.id} />
          </Card>
        )}
      </div>

      {/* RIGHT */}
      <div style={{ width: 320 }}>
        <Card>
          <h3>Create Category</h3>

          <p style={{ fontSize: 13, opacity: 0.7 }}>
            Parent: <strong>{selected.name}</strong>
          </p>

          <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
            <input
              placeholder="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />

            <button type="submit" disabled={createCategory.isPending}>
              Create
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}

/* TREE */
function CategoryTreeView({
  nodes,
  selectedId,
  onSelect,
}: {
  nodes: CategoryNode[];
  selectedId: string | null;
  onSelect: (id: string, name: string) => void;
}) {
  return (
    <ul style={{ listStyle: "none", paddingLeft: 0 }}>
      {nodes.map((node) => {
        const isSelected = node.id === selectedId;

        return (
          <li key={node.id} style={{ marginBottom: 6 }}>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                padding: "4px 6px",
                borderRadius: 6,
                background: isSelected ? "#eef4ff" : "transparent",
              }}
            >
              <button
                type="button"
                onClick={() => onSelect(node.id, node.name)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: isSelected ? 700 : 500,
                }}
              >
                {node.name} <span style={{ opacity: 0.5 }}>({node.code})</span>
              </button>
            </div>

            {node.children.length > 0 && (
              <div style={{ paddingLeft: 16 }}>
                <CategoryTreeView
                  nodes={node.children}
                  selectedId={selectedId}
                  onSelect={onSelect}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
