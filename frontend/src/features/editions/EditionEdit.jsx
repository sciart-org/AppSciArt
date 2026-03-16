import EditionCollectionButtons from "./components/EditionCollectionButtons";
import AsterButton from "../../components/buttons/AsterButton";
import { useState } from "react";
import useFetcher from "../../utils/useFetcher";
import Loading from "../../components/messages/Loading";
import {
  fileToBase64,
  filterNotChangedFields,
  getFormData,
  scrollToTop,
} from "../../utils/commonUtils";
import { EditionEditContext } from "./components/EditionEditContext";
import "./css/edition-details.css";
import EditionDetails from "./EditionDetails";
import EditionCard from "../../components/cards/EditionCard";
import SelectorBar from "../../components/buttons/SelectorBar";
import EditionsForm from "./EditionForm";
import { EditionActionButton } from "./components/EditionActionButton";

export default function EditionEdit({ edition: editingEdition }) {
  const [edition, setEdition] = useState(editingEdition);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);

  const showPreview = previewItem != null;
  const showDetailsPreview = previewItem === 0;

  const { fetcher } = useFetcher(error, setError);

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
    const body = filterNotChangedFields(formData, edition);
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
        <h1>{edition?.name}</h1>
        <AsterButton
          onClick={() => {
            setPreviewItem(0);
          }}
          type="button"
          variant="secondary"
          style={{ marginBottom: "4vh" }}
        >
          Preview
        </AsterButton>
        <EditionsForm
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          formData={formData}
          isEditable={isEditing}
          onCancel={() => {
            setIsEditing(false);
            setFormData(getFormData(edition));
          }}
        />
        <div
          style={{
            marginTop: "1rem",
            gap: "5rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {!isEditing && (
            <>
              <AsterButton
                onClick={() => {
                  setIsEditing(true);
                  scrollToTop(window.innerHeight * 0.3);
                }}
              >
                Edit
              </AsterButton>
              <EditionActionButton
                type="button"
                variant="secondary"
                edition={edition}
              />
            </>
          )}
        </div>
        <hr />
        <EditionCollectionButtons editionId={edition?.id} />
      </div>
    </EditionEditContext>
  );
}
