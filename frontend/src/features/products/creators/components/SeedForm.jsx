import { useState } from "react";
import useFetcher from "../../../../utils/useFetcher";
import EditableFormInput from "../../../../components/form/EditableFormInput";
import EditableFormCreator from "../../../../components/form/EditableFormCreator";
import EditionPicker from "../../collections/components/EditionPicker";
import { useEffect } from "react";
import { simulateInputChange } from "../../../../utils/commonUtils";

export default function SeedForm({
  formData,
  handleInputChange,
  isEditable,
  isCreating = false,
  ...props
}) {
  const [allEditions, setAllEditions] = useState([]);
  const [selectedEdition, setSelectedEdition] = useState(null);

  const [error, setError] = useState(null);
  const { fetcher } = useFetcher(error, setError);

  useEffect(() => {
    if (!isCreating) return;
    fetcher({
      url: "scientists/me/editions",
      onSuccess: (data) => {
        setAllEditions(data);
      },
    });
  }, []);

  useEffect(() => {
    if (!selectedEdition) return;
    simulateInputChange("editionId", selectedEdition?.id, handleInputChange);
  }, [selectedEdition]);

  return (
    <EditableFormCreator
      handleInputChange={handleInputChange}
      isEditable={isEditable}
      {...props}
    >
      <div className="input-box-container">
        <EditableFormInput
          name={"Title"}
          type={"text"}
          value={formData.title}
          required={true}
        />
      </div>
      {isCreating && (
        <div className="input-box-container">
          <EditableFormInput
            name={"Edition"}
            type={"text"}
            value={formData.editionName}
            required={true}
            customEditable={true}
          >
            <EditionPicker
              selectedEdition={selectedEdition}
              setSelectedEdition={setSelectedEdition}
              allEditions={allEditions}
              size={"small"}
              required={true}
              name={"Edition"}
            />
          </EditableFormInput>
        </div>
      )}
      <div className="input-box-container">
        <EditableFormInput
          name={"Branches of knowledge"}
          type={"select"}
          value={formData.branchesOfKnowledge}
          creatable={true}
          multiple={true}
        />
      </div>
      <div className="input-box-container">
        <EditableFormInput
          name={"Main image"}
          type={"image"}
          value={formData.mainImage}
          style={isEditable && isCreating ? {} : { marginBottom: "0.5rem" }}
        />
      </div>
      {!isCreating && (
        <>
          <div className="input-box-container">
            <EditableFormInput name={"Video link"} value={formData.videoLink} />
          </div>
          <div className="input-box-container">
            <EditableFormInput
              name={"Presentation link"}
              value={formData.presentationLink}
            />
          </div>
          <div className="input-box-container">
            <EditableFormInput
              name={"Podcast link"}
              value={formData.podcastLink}
              style={
                isEditable && !isCreating ? {} : { marginBottom: "0.5rem" }
              }
            />
          </div>
        </>
      )}
      {isCreating && (
        <p
          style={{ textAlign: "start", marginLeft: "2rem", fontSize: "0.9rem" }}
        >
          You will be able to change this information later
        </p>
      )}
    </EditableFormCreator>
  );
}
