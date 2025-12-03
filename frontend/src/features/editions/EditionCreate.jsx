import { useState } from "react";
import FormInput from "../../components/form/FormInput";
import AsterButton from "../../components/AsterButton";
import useFetcher from "../../utils/useFetcher";
import { fileToBase64 } from "../../utils/commonUtils";
import { useNavigate } from "react-router";

export default function EditionCreate(props) {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  const { fetcher } = useFetcher(error, setError);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
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
    });
  };

  const handleInputChange = async (e) => {
    const { name, type, files, value } = e.target;

    setFormData({
      ...formData,
      [name]: type === "file" ? await fileToBase64(files[0]) : value,
    });
  };

  return (
    <div>
      <h1>Create Edition</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="input-box-container">
          <FormInput
            name={"Name"}
            type={"text"}
            value={formData.name}
            onChange={handleInputChange}
            required={true}
          />
          <FormInput
            name={"Year"}
            type={"number"}
            value={formData.year}
            onChange={handleInputChange}
            required={true}
            min={1900}
            max={3000}
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
            name={"Short description"}
            type={"text"}
            value={formData.shortDescription}
            onChange={handleInputChange}
            multiline={true}
          />
        </div>
        <div className="long-input-box-container">
          <FormInput
            name={"Long description"}
            type={"text"}
            value={formData.longDescription}
            onChange={handleInputChange}
            multiline={true}
          />
        </div>
        <AsterButton type="submit">Submit</AsterButton>
      </form>
    </div>
  );
}
