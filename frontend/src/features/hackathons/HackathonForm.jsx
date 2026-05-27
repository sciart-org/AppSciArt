import { useEffect, useState } from "react";
import EditableFormCreator from "../../components/form/EditableFormCreator";
import EditableFormInput from "../../components/form/EditableFormInput";
import EditionPicker from "../products/collections/components/EditionPicker";
import useFetcher from "../../utils/useFetcher";
import { simulateInputChange } from "../../utils/commonUtils";

export default function HackathonForm({
  formData,
  isEditable = true,
  ...props
}) {
  const [selectedEdition, setSelectedEdition] = useState(null);
  const [allEditions, setAllEditions] = useState([]);
  const [error, setError] = useState(null);

  const currentYear = new Date().getFullYear();

  const minStartDate =
    !selectedEdition?.year || selectedEdition?.year === currentYear
      ? new Date().toISOString().split("T")[0]
      : `${selectedEdition.year}-01-01`;

  const maxDate = `${selectedEdition?.year ?? currentYear}-12-31`;

  const minEndDate =
    formData.startDate && formData.startDate > minStartDate
      ? formData.startDate
      : minStartDate;

  const { fetcher } = useFetcher(error, setError);
  const showMeetLink = formData?.type && formData?.type !== "On site";

  useEffect(() => {
    fetcher({
      url: "editions?state=ACTIVE",
      onSuccess: (data) => {
        setAllEditions(data);
      },
    });
  }, []);

  useEffect(() => {
    if (!allEditions || allEditions.length <= 0) return;
    setSelectedEdition(
      allEditions.find((e) => e.name === formData.editionName),
    );
  }, [allEditions, formData.editionName]);

  useEffect(() => {
    if (!selectedEdition) return;
    simulateInputChange(
      "editionId",
      selectedEdition?.id,
      props.handleInputChange,
    );
    simulateInputChange(
      "editionName",
      selectedEdition?.name,
      props.handleInputChange,
    );
  }, [selectedEdition]);

  return (
    <EditableFormCreator isEditable={isEditable} {...props}>
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
        <EditableFormInput
          name={"Type"}
          type={"select"}
          options={["On site", "Online", "Hybrid"]}
          value={formData.type}
          required={true}
          clearable={false}
        />
      </div>
      {showMeetLink && (
        <div className="long-input-box-container">
          <EditableFormInput
            name={"Meet link"}
            value={formData.meetLink}
            required={true}
          />
        </div>
      )}
      <div className="input-box-container">
        <EditableFormInput
          name={"Internal name"}
          type={"text"}
          value={formData.internalName}
          required={true}
        />
        <EditableFormInput
          name={"Is private?"}
          type={"checkbox"}
          value={formData.isPrivate}
        />
      </div>
      <div className="input-box-container">
        <EditableFormInput
          name={"Start date"}
          type={"date"}
          value={formData.startDate}
          min={minStartDate}
          max={maxDate}
        />
        <EditableFormInput
          name={"End date"}
          type={"date"}
          value={formData.endDate}
          min={minEndDate}
          max={maxDate}
        />
      </div>
      <div className="input-box-container">
        <EditableFormInput name={"Logo"} type={"image"} value={formData.logo} />
      </div>
      <div className="long-input-box-container">
        <EditableFormInput
          name={"Location"}
          value={formData.location}
          required={formData.type && formData.type !== "Online"}
        />
      </div>
      <div className="long-input-box-container">
        <EditableFormInput
          name={"Description"}
          type={"text"}
          value={formData.description}
          multiline={true}
          style={isEditable ? {} : { marginBottom: "0.5rem" }}
        />
      </div>
    </EditableFormCreator>
  );
}
