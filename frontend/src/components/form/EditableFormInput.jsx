import { useContext, useState } from "react";
import FormInput from "../../components/form/FormInput";
import ImageRenderer from "../../components/ImageRenderer";
import { FormContext } from "./FormContext";
import {
  formatReadableDate,
  simulateInputChange,
} from "../../utils/commonUtils";
import FormSelect from "./FormSelect";

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
  const [isOpen, setIsOpen] = useState(false);

  if (isEditable && props.customEditable) {
    return <StyleWrapper>{props.children}</StyleWrapper>;
  }

  if (isEditable && props.type === "select") {
    return (
      <StyleWrapper>
        <FormSelect
          {...props}
          style={style}
          setValue={(v) =>
            simulateInputChange(props.name, v, handleInputChange)
          }
        />
      </StyleWrapper>
    );
  }

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
        <p className="justified-text" style={{ margin: "0 0 0 1rem" }}>
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
            <div style={{ margin: 10, marginBottom: 0 }}>
              <ImageRenderer image={props.value} />
            </div>
          </>
        ) : (
          <>
            <h3>{props.name}</h3>
            <p style={{ margin: "0 0 0 1rem" }}>No content yet</p>
          </>
        )}
      </StyleWrapper>
    );

  if (props.type === "date") {
    return (
      <StyleWrapper style={style}>
        <h3>{props.name}</h3>
        <p className="justified-text" style={{ margin: "0 0 0 1rem" }}>
          {props.value ? formatReadableDate(props.value) : "No content yet"}
        </p>
      </StyleWrapper>
    );
  }

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

  const value =
    props.type === "select" && Array.isArray(props.value)
      ? props.value.join(", ")
      : props.value;

  return (
    <StyleWrapper style={style}>
      <div style={{ display: "flex" }}>
        <h3>{props.name}</h3>
        <ToggleButton />
      </div>
      <div
        className={`${!props.value || showFullContent ? "" : "editor-preview"}`}
      >
        <p className="justified-text" style={{ margin: "0 0 0 1rem" }}>
          {value ?? "No content yet"}
        </p>
      </div>
    </StyleWrapper>
  );
}
