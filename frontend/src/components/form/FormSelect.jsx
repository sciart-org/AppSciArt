import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import "./form.css";

export default function FormSelect({
  name,
  value,
  setValue,
  options,
  required,
  multiple,
  style,
  placeholder,
  clearable = true,
  className,
  creatable = false,
}) {
  const newOptions = options?.map((o) => ({ value: o, label: o }));

  const newValues =
    value == null
      ? null
      : multiple
        ? value.map((v) => ({ label: v, value: v }))
        : { label: value, value };

  const handleSelectChange = (v) => {
    v === null || v.length === 0
      ? setValue(null)
      : multiple
        ? setValue(v.map((i) => i.value))
        : setValue(v.value);
  };

  const SelectComponent = creatable ? CreatableSelect : Select;

  return (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
      <div style={{ display: "flex" }}>
        <h3 style={{ margin: 0 }}>{name}</h3>
        {required && <span style={{ color: "red", marginLeft: "3px" }}>*</span>}
      </div>
      <SelectComponent
        className={"multiple-select " + className}
        value={newValues}
        onChange={handleSelectChange}
        options={newOptions}
        noOptionsMessage={() => null}
        components={
          creatable && !options?.length
            ? { DropdownIndicator: null }
            : undefined
        }
        isMulti={multiple}
        isClearable={clearable}
        clearValue={() => setValue(null)}
        required={required}
        placeholder={placeholder || "Select " + name.toLowerCase() + "..."}
      />
    </div>
  );
}
