export default function FormInput({
  name,
  type,
  placeholder,
  value,
  onChange,
  required,
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
        {required && <text style={{ color: "red" }}> *</text>}
      </div>
      <input
        type={type}
        name={name.toLowerCase()}
        placeholder={name + "..."}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}
