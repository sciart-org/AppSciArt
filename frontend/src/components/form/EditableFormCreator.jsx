import SubmitCancelButtons from "../../components/buttons/SubmitCancelButtons";
import { FormContext } from "./FormContext";

export default function EditableFormCreator({
  handleSubmit,
  handleInputChange,
  isEditable = true,
  onCancel,
  children,
}) {
  return (
    <FormContext value={{ handleInputChange, isEditable }}>
      <form onSubmit={handleSubmit} className="editable-form-creator">
        <div
          className="details-container"
          style={{
            border: "1px solid var(--aster-mid-gray)",
            borderRadius: "1rem",
            paddingTop: isEditable ? "1.2rem" : 0,
          }}
        >
          {children}
        </div>
        {isEditable && <SubmitCancelButtons onCancel={onCancel} />}
      </form>
    </FormContext>
  );
}
