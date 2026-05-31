import { useState } from "react";
import useFetcher from "../../../utils/useFetcher";
import { handleFormInputChange } from "../../../utils/commonUtils";
import Loading from "../../../components/messages/Loading";
import SeedForm from "./components/SeedForm";
import { useNavigate } from "react-router";

export default function CreateSeed() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});

  const { fetcher } = useFetcher(error, setError);

  const handleInputChange = async (e) => {
    return await handleFormInputChange(e, setFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetcher({
      url: "seeds",
      method: "POST",
      body: formData,
      onSuccess: (data) => navigate(`/seeds/${data.id}`),
      onError: () => {
        setLoading(false);
      },
    });
  };

  if (loading) {
    return (
      <>
        <h1>Create Seed</h1>
        <div>
          <Loading />
        </div>
      </>
    );
  }

  return (
    <>
      <h1>Create Seed</h1>
      <SeedForm
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        formData={formData}
        isCreating={true}
      />
    </>
  );
}
