import { useEffect, useState } from "react";
import AsterButton from "../../components/AsterButton";
import Loading from "../../components/messages/Loading";
import useFetcher from "../../utils/useFetcher";
import FormInput from "../../components/form/FormInput";
import FormSelect from "../../components/form/FormSelect";
import EditionPicker from "../products/collections/components/EditionPicker";
import { fileToBase64, toEnumValue } from "../../utils/commonUtils";
import { useNavigate } from "react-router";
import SubmitCancelButtons from "../../components/SubmitCancelButtons";

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
      onSuccess: (data) => {
        navigate(`/hackathons/${data?.id}`);
      },
      onError: () => {
        setLoading(false);
      },
    });
  };

  const handleInputChange = async (e) => {
    const { name, type, files, value } = e.target;

    setFormData({
      ...formData,
      [name]: type === "file" ? await fileToBase64(files[0]) : value,
    });
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
          <FormInput
            name={"Internal name"}
            type={"text"}
            value={formData.internalName}
            onChange={handleInputChange}
            required={true}
          />
          <FormInput
            name={"Is it private?"}
            type={"checkbox"}
            value={formData.isPrivate}
            onChange={handleInputChange}
            style={{ width: "21vw" }}
            required={true}
          />
        </div>
        <div
          className="input-box-container"
          style={{ marginBottom: "1rem", fontSize: "0.75rem" }}
        >
          This name will never be shown publicly
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
