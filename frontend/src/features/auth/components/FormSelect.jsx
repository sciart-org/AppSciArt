import Select from "react-select";

export default function FormSelect({
  name,
  value,
  setValue,
  options,
  required,
  multiple,
}) {
  const newOptions = options.map((o) => {
    return {
      value: o,
      label: o,
    };
  });

  const newValues =
    value == null
      ? null
      : multiple
      ? value.map((v) => {
          return {
            label: v,
            value: v,
          };
        })
      : { label: value, value };

  const handleSelectChange = (v) => {
    v === null || v.length === 0
      ? setValue(null)
      : multiple
      ? setValue(v.map((i) => i.value))
      : setValue(v.value);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex" }}>
        <span>{name}</span>
        {required && (
          <span style={{ color: "red", marginLeft: "10px" }}>*</span>
        )}
      </div>
      <Select
        className="multiple-select"
        value={newValues}
        onChange={handleSelectChange}
        options={newOptions}
        isMulti={multiple}
        isClearable
        clearValue={() => setValue(null)}
      />
    </div>
  );
}
