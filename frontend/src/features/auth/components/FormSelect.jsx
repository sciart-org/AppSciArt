export default function FormSelect({
  name,
  value,
  onChange,
  options,
  required,
  multiple,
}) {
  const handleChange = (e) => {
    if (multiple) {
      const { options } = e.target;
      const selectedValues = value || [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          if (selectedValues.includes(options[i].value)) {
            selectedValues.pop(options[i].value);
          } else {
            selectedValues.push(options[i].value);
          }
        }
      }
      console.log("Selected values:", selectedValues);
      onChange({
        target: {
          name: e.target.name,
          value: selectedValues.length === 0 ? null : selectedValues,
        },
      });
    } else {
      onChange(e);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex" }}>
        <text>{name}</text>
        {required && <text style={{ color: "red" }}> *</text>}
      </div>

      <select
        name={name.toLowerCase().replaceAll(/ /g, "_")}
        value={value}
        onChange={handleChange}
        multiple={multiple}
      >
        <option value={null} disabled={multiple || required}>
          Select your {name.toLowerCase()}...
        </option>
        {options.map((option) => (
          <option
            key={option}
            value={option.toLowerCase().replaceAll(/ /g, "_")}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
