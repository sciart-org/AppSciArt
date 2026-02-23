import EditionCollectionButtons from "./components/EditionCollectionButtons";
import AsterButton from "../../components/AsterButton";
import { useState } from "react";
import useFetcher from "../../utils/useFetcher";
import Loading from "../../components/messages/Loading";
import { fileToBase64 } from "../../utils/commonUtils";
import EditorWrapper from "./components/EditorWrapper";
import { EditionEditContext } from "./components/EditionEditContext";
import "./css/edition-details.css";
import EditionDetails from "./EditionDetails";
import EditionCard from "../../components/EditionCard";
import { EditionActionButton } from "./components/EditionActionButton";
import SelectorBar from "../../components/SelectorBar";

export default function EditionEdit({ edition: editingEdition }) {
  const [edition, setEdition] = useState(editingEdition);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);

  const showPreview = previewItem != null;
  const showDetailsPreview = previewItem === 0;

  const { fetcher } = useFetcher(error, setError);

  const getFormData = (edition) => {
    return {
      name: edition?.name || null,
      year: edition?.year || null,
      shortDescription: edition?.shortDescription || null,
      longDescription: edition?.longDescription || null,
      logo: edition?.logo || null,
    };
  };

  const filterNotChangedFields = () => {
    return Object.entries(formData).reduce((editedFields, [key, value]) => {
      if (value === edition[key]) return editedFields;
      editedFields[key] = key === "year" ? parseInt(value) : value;
      return editedFields;
    }, {});
  };

  const [formData, setFormData] = useState(getFormData(edition));

  if (loading) {
    return <Loading />;
  }

  const handleInputChange = async (e) => {
    const { name, type, files, value } = e.target;

    setFormData({
      ...formData,
      [name]: type === "file" ? await fileToBase64(files[0]) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    setLoading(true);
    const body = filterNotChangedFields();
    if (Object.keys(body).length === 0) {
      setIsEditing(false);
      setLoading(false);
      return;
    }
    fetcher({
      url: "editions/" + edition.id,
      method: "PUT",
      body,
      onSuccess: (data) => {
        setFormData(getFormData(data));
        setEdition((prev) => ({ ...prev, ...data }));
      },
      onError: () => {
        setFormData(getFormData(edition));
      },
    }).finally(() => {
      setIsEditing(false);
      setLoading(false);
    });
  };

  if (showPreview) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1>{edition?.name} (preview)</h1>
        <AsterButton onClick={() => setPreviewItem(null)}>
          Exit preview
        </AsterButton>
        <SelectorBar style={{ marginTop: "4vh" }}>
          <AsterButton
            onClick={() => setPreviewItem(0)}
            className={showDetailsPreview ? "aster-button-hover" : ""}
          >
            Details preview
          </AsterButton>
          <AsterButton
            onClick={() => setPreviewItem(1)}
            className={!showDetailsPreview ? "aster-button-hover" : ""}
          >
            Card preview
          </AsterButton>
        </SelectorBar>
        <hr />
        {previewItem === 0 ? (
          <EditionDetails edition={formData} />
        ) : (
          <EditionCard
            forceNotAdmin={true}
            edition={formData}
            style={{ marginTop: "4vh" }}
          />
        )}
      </div>
    );
  }

  return (
    <EditionEditContext value={{ isEditing, handleInputChange }}>
      <div>
        <form onSubmit={handleSubmit}>
          <h1>{edition?.name}</h1>
          <AsterButton
            onClick={() => {
              setPreviewItem(0);
            }}
            type="button"
            variant="secondary"
          >
            Preview
          </AsterButton>
          <div
            className="edition-details-container"
            style={{
              border: "1px solid rgb(200, 200, 200)",
              borderRadius: "1rem",
              marginTop: "4vh",
            }}
          >
            <div style={{ display: "flex", alignItems: "start" }}>
              <div style={{ flex: 1 / 2 }}>
                <EditorWrapper
                  value={formData?.name}
                  name={"Name"}
                  required={true}
                />
                <EditorWrapper
                  value={formData?.year}
                  name={"Year"}
                  type={"number"}
                  max={2200}
                  min={1900}
                  required={true}
                />
              </div>
              <div style={{ position: "absolute", left: "50vw" }}>
                <EditorWrapper
                  value={formData?.logo}
                  name={"Logo"}
                  type={"image"}
                />
              </div>
            </div>
            <EditorWrapper
              value={formData?.shortDescription}
              name={"Short description"}
              multiline={true}
            />
            <EditorWrapper
              value={formData?.longDescription}
              name={"Long description"}
              collapsible={true}
              multiline={true}
            />
          </div>
          <div
            style={{
              marginTop: "1rem",
              gap: "5rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <AsterButton type="submit">
              {isEditing ? "Save" : "Edit"}
            </AsterButton>
            {isEditing ? (
              <AsterButton
                onClick={() => {
                  setIsEditing(false);
                  setFormData(getFormData(edition));
                }}
                type="button"
                variant="secondary"
              >
                Discard
              </AsterButton>
            ) : (
              <EditionActionButton
                type="button"
                variant="secondary"
                edition={edition}
              />
            )}
          </div>
        </form>
        <hr />
        <EditionCollectionButtons editionId={edition?.id} />
      </div>
    </EditionEditContext>
  );
}
