import "./form.css";
import "../AsterButton.css";
import { toCamelCase } from "../../utils/commonUtils";
import ImageRenderer from "../ImageRenderer";

const InputComponent = ({
  name,
  type,
  placeholder,
  value,
  required,
  multiline,
  min,
  max,
  ...props
}) => {
  if (multiline) {
    return (
      <textarea
        type={type}
        name={toCamelCase(name)}
        placeholder={placeholder ?? name + "..."}
        value={value}
        minLength={min ?? undefined}
        maxLength={max ?? undefined}
        style={{ resize: "vertical" }}
        {...props}
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
            name={toCamelCase(name)}
            accept="image/*"
            style={{ display: "none" }}
            {...props}
          />
        </label>

        {value && (
          <ImageRenderer image={value} style={{ width: 150, margin: 10 }} />
        )}
      </div>
    );
  }

  return (
    <input
      type={type}
      name={toCamelCase(name)}
      placeholder={placeholder ?? name + "..."}
      value={value}
      min={min ?? undefined}
      max={max ?? undefined}
      {...props}
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
        <h3 style={{ margin: 0 }}>{name}</h3>
        {required && <span style={{ color: "red", marginLeft: "3px" }}>*</span>}
      </div>
      <InputComponent {...props} />
    </div>
  );
}
