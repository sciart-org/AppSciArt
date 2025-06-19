export default function FormInput({
  name,
  type,
  placeholder,
  value,
  onChange,
  required,
  disabled,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex" }}>
        <text>{name}</text>
        {required && <span style={{ color: "red", marginLeft: "3px" }}>*</span>}
      </div>
      <input
        type={type}
        name={name.toLowerCase()}
        placeholder={name + "..."}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
      />
    </div>
  );
}
