import { useContext, useState } from "react";
import FormInput from "../../components/form/FormInput";
import ImageRenderer from "../../components/ImageRenderer";
import { FormContext } from "./FormContext";

const StyleWrapper = ({ children, style }) => {
  return (
    <div className="edition-wrapper">
      <div style={{ flex: 1, margin: "0 2rem", textAlign: "start", ...style }}>
        {children}
      </div>
    </div>
  );
};

export default function EditableFormInput({ style, ...props }) {
  const { handleInputChange, isEditable } = useContext(FormContext);

  if (isEditable)
    return (
      <StyleWrapper>
        <FormInput {...props} style={style} onChange={handleInputChange} />
      </StyleWrapper>
    );

  if (props.type === "checkbox") {
    return (
      <StyleWrapper>
        <h3>{props.name}</h3>
        <p className="long-text" style={{ margin: "0 0 0 1rem" }}>
          {props.value ? "Yes" : "No"}
        </p>
      </StyleWrapper>
    );
  }

  if (props.type === "image")
    return (
      <StyleWrapper>
        {props.value ? (
          <>
            <h3 style={{ marginBottom: 0 }}>{props.name}</h3>
            <ImageRenderer
              image={props.value}
              style={{ width: 150, margin: 10, marginBottom: "-1rem" }}
            />
          </>
        ) : (
          <>
            <h3>{props.name}</h3>
            <p style={{ margin: "0 0 0 1rem" }}>No content yet</p>
          </>
        )}
      </StyleWrapper>
    );

  const [isOpen, setIsOpen] = useState(false);
  const showFullContent = !props.collapsible || isOpen;

  const ToggleButton = () => {
    if (!props.collapsible) return null;
    return (
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={"editor-toggle"}
      >
        {isOpen ? "▲" : "▼"}
      </button>
    );
  };

  return (
    <StyleWrapper style={style}>
      <div style={{ display: "flex" }}>
        <h3>{props.name}</h3>
        <ToggleButton />
      </div>
      <div
        className={`${!props.value || showFullContent ? "" : "editor-preview"}`}
      >
        <p className="long-text" style={{ margin: "0 0 0 1rem" }}>
          {props.value ?? "No content yet"}
        </p>
      </div>
    </StyleWrapper>
  );
}
