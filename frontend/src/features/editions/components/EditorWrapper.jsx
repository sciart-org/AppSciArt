import { useContext, useState } from "react";
import FormInput from "../../../components/form/FormInput";
import ImageRenderer from "../../../components/ImageRenderer";
import { EditionEditContext } from "./EditionEditContext";

const StyleWrapper = ({ children }) => {
  return (
    <div className="edition-wrapper">
      <div style={{ flex: 1, margin: "0 2rem", textAlign: "start" }}>
        {children}
      </div>
    </div>
  );
};

export default function EditorWrapper(rawProps) {
  const { isEditing, handleInputChange } = useContext(EditionEditContext);
  const { collapsible, ...props } = rawProps;
  props.type = rawProps.type || "text";
  props.multiline = rawProps.multiline || false;

  if (props.type === "image") {
    return (
      <StyleWrapper>
        {isEditing ? (
          <div
            className="long-input-box-container"
            style={{ width: "100%", margin: "1rem 0 0" }}
          >
            <FormInput {...props} onChange={handleInputChange} />
          </div>
        ) : (
          <>
            <h3>{props.name}</h3>
            {props.value ? (
              <ImageRenderer
                image={props.value}
                style={{ maxHeight: "10rem", margin: 10 }}
              />
            ) : (
              <p style={{ margin: "0 0 0 1rem" }}>No content yet</p>
            )}
          </>
        )}
      </StyleWrapper>
    );
  }

  const [isOpen, setIsOpen] = useState(false);
  const showFullContent = !collapsible || isOpen;

  const ToggleButton = () => {
    if (!collapsible || isEditing) return null;
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
    <StyleWrapper>
      {isEditing ? (
        <div
          className="long-input-box-container"
          style={{ width: "100%", margin: "1rem 0 0" }}
        >
          <FormInput {...props} onChange={handleInputChange} />
        </div>
      ) : (
        <>
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
        </>
      )}
    </StyleWrapper>
  );
}
