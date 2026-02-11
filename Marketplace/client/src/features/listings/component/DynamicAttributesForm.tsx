import React from "react";
import type { CategoryAttributeDto } from "../../categories/getCategoryAttributes";
import { CategoryAttributeType } from "../../categories/categoryTypes";


export type AttributeValueMap = Record<string, string>;

interface Props {
  attributes: CategoryAttributeDto[];
  values: AttributeValueMap;
  onChange: (values: AttributeValueMap) => void;
}

export const DynamicAttributesForm: React.FC<Props> = ({
  attributes,
  values,
  onChange,
}) => {
  const handleChange = (id: string, value: string) => {
    onChange({
      ...values,
      [id]: value,
    });
  };

  if (!attributes.length) return null;

  return (
    <div className="space-y-4">
      {attributes.map((attr) => (
        <div key={attr.id} className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            {attr.label}
            {attr.isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>

          <DynamicField
            attribute={attr}
            value={values[attr.id] ?? ""}
            onChange={(value) => handleChange(attr.id, value)}
          />
        </div>
      ))}
    </div>
  );
};

interface FieldProps {
  attribute: CategoryAttributeDto;
  value: string;
  onChange: (value: string) => void;
}

const DynamicField: React.FC<FieldProps> = ({ attribute, value, onChange }) => {
    switch (attribute.type) {
        case CategoryAttributeType.Text:
          return (
            <input
              type="text"
              className="border rounded px-3 py-2 text-sm"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          );
      
        case CategoryAttributeType.Number:
          return (
            <input
              type="number"
              className="border rounded px-3 py-2 text-sm"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          );
      
        case CategoryAttributeType.Select:
          return (
            <select
              className="border rounded px-3 py-2 text-sm"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            >
              <option value="">Select</option>
              {attribute.options.map((opt) => (
                <option key={opt.id} value={opt.value}>
                  {opt.label ?? opt.value}
                </option>
              ))}
            </select>
          );
      
        case CategoryAttributeType.Boolean:
          return (
            <select
              className="border rounded px-3 py-2 text-sm"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            >
              <option value="">Select</option>
              <option value="true">Да</option>
              <option value="false">Не</option>
            </select>
          );
      
        default:
          return null;
      }
      
};
