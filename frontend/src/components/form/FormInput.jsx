export default function FormInput({
  name,
  type,
  placeholder,
  value,
  onChange,
  required,
  disabled,
  multiline,
  style,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      <div style={{ display: "flex" }}>
        <text>{name}</text>
        {required && <span style={{ color: "red", marginLeft: "3px" }}>*</span>}
      </div>
      {multiline ? (
        <textarea
          type={type}
          name={name?.toLowerCase()}
          placeholder={placeholder || name + "..."}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
        />
      ) : (
        <input
          type={type}
          name={name?.toLowerCase()}
          placeholder={placeholder || name + "..."}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
        />
      )}
    </div>
  );
}
