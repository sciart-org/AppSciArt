import "./form.css";
import "../AsterButton.css";

const InputComponent = (props) => {
  const {
    name,
    type,
    placeholder,
    value,
    onChange,
    required,
    disabled,
    multiline,
    min,
    max,
  } = props;
  if (multiline) {
    return (
      <textarea
        type={type}
        name={name?.toLowerCase()}
        placeholder={placeholder ?? name + "..."}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        minLength={min ?? undefined}
        maxLength={max ?? undefined}
        style={{ resize: "vertical" }}
      />
    );
  }

  if (type === "image") {
    return (
      <div style={{ display: "flex" }}>
        <label className="aster-button image-picker-label">
          {value instanceof File ? "Change file" : "Choose file"}
          <input
            type="file"
            name={name?.toLowerCase()}
            accept="image/*"
            onChange={onChange}
            style={{ display: "none" }}
            required={required}
            disabled={disabled}
          />
        </label>

        {value instanceof File && (
          <img
            src={URL.createObjectURL(value)}
            alt="preview"
            style={{ width: 150, margin: 10 }}
          />
        )}
      </div>
    );
  }

  return (
    <input
      type={type}
      name={name?.toLowerCase()}
      placeholder={placeholder ?? name + "..."}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      min={min ?? undefined}
      max={max ?? undefined}
    />
  );
};

export default function FormInput(props) {
  const { name, required, style } = props;

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
      <InputComponent {...props} />
    </div>
  );
}
