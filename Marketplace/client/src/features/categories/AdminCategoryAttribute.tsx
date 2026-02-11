import { useState } from "react";
import { CategoryAttributeType} from "../categories/categoryTypes";
import { useCategoryAttributes } from "./hooks/useCategoryAttributes";
import { useCreateCategoryAttribute } from "./getCategoryAttributes";
import {useAddCategoryAttributeOption } from "./useAdminCategoryAttributes";
export function AdminCategoryAttributes({ categoryId }: { categoryId: string }) {
  const { data: attributes = [] } = useCategoryAttributes(categoryId);
  const createAttr = useCreateCategoryAttribute();
  const addOption = useAddCategoryAttributeOption();

  const [key, setKey] = useState("");
  const [type, setType] = useState<CategoryAttributeType>(CategoryAttributeType.Text);
  const [isRequired, setIsRequired] = useState(false);

  function submitAttribute() {
    if (!key.trim()) return;

    createAttr.mutate({
      categoryId,
      key: key.trim(),
      type,
      isRequired,
      sortOrder: attributes.length + 1
    });

    setKey("");
    setType(CategoryAttributeType.Text);
    setIsRequired(false);
  }

  return (
    <div style={{ marginTop: 24 }}>
      <h3>Category Attributes</h3>

      {attributes.length === 0 ? (
        <p style={{ opacity: 0.7 }}>No attributes yet for this category.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {attributes.map(a => (
            <AttributeRow
              key={a.id}
              categoryId={categoryId}
              attribute={a}
              onAddOption={(value) =>
                addOption.mutate({
                  categoryId,
                  attributeId: a.id,
                  value
                })
              }
              isAddingOption={addOption.isPending}
            />
          ))}
        </div>
      )}

      <div style={{ display: "grid", gap: 8, marginTop: 16 }}>
        <h4 style={{ margin: 0 }}>Add new attribute</h4>

        <input
          placeholder="key (e.g. brand)"
          value={key}
          onChange={e => setKey(e.target.value)}
        />

        <select
          value={type}
          onChange={e => setType(Number(e.target.value) as CategoryAttributeType)}
        >
          <option value={CategoryAttributeType.Text}>Text</option>
          <option value={CategoryAttributeType.Number}>Number</option>
          <option value={CategoryAttributeType.Select}>Select</option>
          <option value={CategoryAttributeType.Boolean}>Boolean</option>
        </select>

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={isRequired}
            onChange={e => setIsRequired(e.target.checked)}
          />
          Required
        </label>

        <button onClick={submitAttribute} disabled={createAttr.isPending}>
          {createAttr.isPending ? "Saving..." : "Add attribute"}
        </button>
      </div>
    </div>
  );
}

function AttributeRow({
  categoryId,
  attribute,
  onAddOption,
  isAddingOption
}: {
  categoryId: string;
  attribute: any; // if you have CategoryAttributeDto type, use it here
  onAddOption: (value: string) => void;
  isAddingOption: boolean;
}) {
  const [optValue, setOptValue] = useState("");

  const isSelect = attribute.type === CategoryAttributeType.Select;

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <strong>{attribute.label}</strong>
        <span style={{ opacity: 0.7 }}>
          ({CategoryAttributeType[attribute.type]})
        </span>
        {attribute.isRequired && <span style={{ color: "red" }}>*</span>}
      </div>

      {isSelect && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>
            Options
          </div>

          {attribute.options.length === 0 ? (
            <div style={{ opacity: 0.7 }}>No options yet.</div>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {attribute.options.map((o: any) => (
                <li key={o.id}>{o.label ?? o.value}</li>
              ))}
            </ul>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input
              value={optValue}
              onChange={(e) => setOptValue(e.target.value)}
              placeholder="Add option (e.g. BMW)"
            />
            <button
              type="button"
              disabled={!optValue.trim() || isAddingOption}
              onClick={() => {
                onAddOption(optValue.trim());
                setOptValue("");
              }}
            >
              {isAddingOption ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
