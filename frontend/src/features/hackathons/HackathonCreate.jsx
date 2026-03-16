import { useState } from "react";
import Loading from "../../components/messages/Loading";
import useFetcher from "../../utils/useFetcher";
import { handleFormInputChange, toEnumValue } from "../../utils/commonUtils";
import { useNavigate } from "react-router";
import HackathonForm from "./HackathonForm";

export default function HackathonCreate() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
        editionName: undefined,
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
      <HackathonForm
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        formData={formData}
      />
    </div>
  );
}
