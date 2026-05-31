import { useState } from "react";
import useFetcher from "../../utils/useFetcher";
import { fileToBase64 } from "../../utils/commonUtils";
import { useNavigate } from "react-router";
import Loading from "../../components/messages/Loading";
import EditionForm from "./EditionForm";

export default function EditionCreate() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { fetcher } = useFetcher(error, setError);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetcher({
      url: "editions",
      method: "POST",
      body: {
        ...formData,
        year: parseInt(formData.year),
      },
      onSuccess: (data) => {
        navigate("/editions/" + data.id);
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

  if (loading) {
    return (
      <>
        <h1>Create Edition</h1>
        <div>
          <Loading />
        </div>
      </>
    );
  }

  return (
    <div>
      <h1>Create Edition</h1>
      <EditionForm
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        formData={formData}
      />
    </div>
  );
}
