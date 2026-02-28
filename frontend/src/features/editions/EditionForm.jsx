import EditableFormCreator from "../../components/form/EditableFormCreator";
import EditableFormInput from "../../components/form/EditableFormInput";

export default function EditionsForm({
  formData,
  isEditable = true,
  ...props
}) {
  return (
    <EditableFormCreator isEditable={isEditable} {...props}>
      <div className="input-box-container">
        <EditableFormInput
          name={"Name"}
          type={"text"}
          value={formData.name}
          required={true}
        />
        <EditableFormInput
          name={"Year"}
          type={"number"}
          value={formData.year}
          required={true}
          min={1900}
          max={2200}
          step={1}
        />
      </div>
      <div className="input-box-container">
        <EditableFormInput name={"Logo"} type={"image"} value={formData.logo} />
      </div>
      <div className="long-input-box-container">
        <EditableFormInput
          name={"Short description"}
          type={"text"}
          value={formData.shortDescription}
          multiline={true}
          style={{
            marginTop: isEditable ? undefined : "-1.5rem",
            width: "100%",
          }}
        />
      </div>
      <div className="long-input-box-container">
        <EditableFormInput
          name={"Long description"}
          type={"text"}
          value={formData.longDescription}
          multiline={true}
          style={{
            marginBottom: isEditable ? "0.5rem" : "1rem",
            width: "100%",
          }}
        />
      </div>
    </EditableFormCreator>
  );
}
