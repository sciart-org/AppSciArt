import { useEffect, useState } from "react";
import Loading from "../../components/messages/Loading";
import useFetcher from "../../utils/useFetcher";
import FormInput from "../../components/form/FormInput";
import FormSelect from "../../components/form/FormSelect";
import EditionPicker from "../products/collections/components/EditionPicker";
import { handleFormInputChange, toEnumValue } from "../../utils/commonUtils";
import { useNavigate } from "react-router";
import SubmitCancelButtons from "../../components/buttons/SubmitCancelButtons";

export default function HackathonCreate() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allEditions, setAllEditions] = useState([]);
  const [selectedEdition, setSelectedEdition] = useState(null);

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
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetcher({
      url: "hackathons",
      method: "POST",
      body: {
        ...formData,
        type: toEnumValue(formData?.type),
        editionId: selectedEdition?.id,
      },
      onSuccess: () => {
        navigate("/hackathons");
      },
      onError: () => {
        setLoading(false);
      },
    });
  };

  const handleInputChange = async (e) => {
    return await handleFormInputChange(e, setFormData);
  };

  useEffect(() => {
    fetcher({
      url: "editions?state=ACTIVE",
      onSuccess: (data) => {
        setAllEditions(data);
      },
      onError: () => {
        setAllEditions([]);
      },
    });
  }, []);

  if (loading) {
    return (
      <>
        <h1>Create Hackathon</h1>
        <Loading />
      </>
    );
  }

  return (
    <div>
      <h1>Create Hackathon</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="input-box-container">
          <EditionPicker
            selectedEdition={selectedEdition}
            setSelectedEdition={setSelectedEdition}
            allEditions={allEditions}
            size={"small"}
            required={true}
            name={"Edition"}
          />
          <FormSelect
            name={"Type"}
            options={["On-site", "Online", "Hybrid"]}
            value={formData.type}
            setValue={(v) => {
              setFormData({ ...formData, type: v });
            }}
            required={true}
          />
        </div>
        <div className="input-box-container">
          <div style={{ marginBottom: "0.5rem" }}>
            <FormInput
              name={"Internal name"}
              type={"text"}
              value={formData.internalName}
              onChange={handleInputChange}
              required={true}
            />
            <p style={{ margin: 0, fontSize: "0.75rem" }}>
              This name will never be shown publicly
            </p>
          </div>
          <div style={{ width: "21vw", display: "flex" }}>
            <FormInput
              name={"Is private?"}
              type={"checkbox"}
              value={formData.isPrivate}
              onChange={handleInputChange}
              required={true}
              style={{ marginRight: "auto" }}
            />
          </div>
        </div>
        <div className="input-box-container">
          <FormInput
            name={"Start date"}
            type={"date"}
            value={formData.startDate}
            onChange={handleInputChange}
            min={minStartDate}
            max={maxDate}
          />
          <FormInput
            name={"End date"}
            type={"date"}
            value={formData.endDate}
            onChange={handleInputChange}
            min={minEndDate}
            max={maxDate}
          />
        </div>
        <div className="input-box-container">
          <FormInput
            name={"Logo"}
            type={"image"}
            value={formData.logo}
            onChange={handleInputChange}
          />
        </div>
        <div className="long-input-box-container">
          <FormInput
            name={"Location"}
            value={formData.location}
            onChange={handleInputChange}
            required={formData.type && formData.type !== "Online"}
          />
        </div>
        <div className="long-input-box-container">
          <FormInput
            name={"Description"}
            type={"text"}
            value={formData.description}
            onChange={handleInputChange}
            multiline={true}
          />
        </div>
        <SubmitCancelButtons />
      </form>
    </div>
  );
}
