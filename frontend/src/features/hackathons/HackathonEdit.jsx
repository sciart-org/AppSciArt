import AsterButton from "../../components/buttons/AsterButton";
import { useState } from "react";
import useFetcher from "../../utils/useFetcher";
import Loading from "../../components/messages/Loading";
import {
  filterNotChangedFields,
  getFormData,
  handleFormInputChange,
  parseEnumValue,
  scrollToTop,
  toEnumValue,
} from "../../utils/commonUtils";
import { HackathonEditContext } from "./components/HackathonEditContext";
import HackathonCard from "../../components/cards/HackathonCard";
import SelectorBar from "../../components/buttons/SelectorBar";
import HackathonForm from "./HackathonForm";

export default function HackathonEdit({ hackathon: editingHackathon }) {
  const [hackathon, setHackathon] = useState(editingHackathon);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);

  const showPreview = previewItem != null;
  const showDetailsPreview = previewItem === 0;

  const { fetcher } = useFetcher(error, setError);

  const getHackathonFormData = (hackathon) => {
    return getFormData(hackathon, {
      startDate:
        new Date(hackathon?.startDate).toISOString().split("T")[0] ?? null,
      endDate: new Date(hackathon?.endDate).toISOString().split("T")[0] ?? null,
      type: parseEnumValue(hackathon?.type),
    });
  };

  const [formData, setFormData] = useState(getHackathonFormData(hackathon));

  if (loading) {
    return <Loading />;
  }

  const handleInputChange = async (e) => {
    return await handleFormInputChange(e, setFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    setLoading(true);
    const body = filterNotChangedFields(formData, hackathon);
    if (Object.keys(body).length === 0) {
      setIsEditing(false);
      setLoading(false);
      return;
    }
    fetcher({
      url: "hackathons/" + hackathon.id,
      method: "PUT",
      body: {
        ...body,
        meetLink: body?.type !== "On site" ? body?.meetLink : undefined,
        type: toEnumValue(body?.type),
        editionName: undefined
      },
      onSuccess: (data) => {
        setFormData(getHackathonFormData(data));
        setHackathon((prev) => ({ ...prev, ...data }));
      },
      onError: () => {
        setFormData(getHackathonFormData(hackathon));
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
        <h1>{hackathon?.internalName} (preview)</h1>
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
          <></>
        ) : (
          <HackathonCard
            forceNotAdmin={true}
            hackathon={formData}
            style={{ marginTop: "4vh" }}
          />
        )}
      </div>
    );
  }

  return (
    <HackathonEditContext value={{ isEditing, handleInputChange }}>
      <div>
        <h1>{hackathon?.internalName}</h1>
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
        <HackathonForm
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          formData={formData}
          isEditable={isEditing}
          onCancel={() => {
            setIsEditing(false);
            setFormData(getHackathonFormData(hackathon));
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
            <AsterButton
              onClick={() => {
                setIsEditing(true);
                scrollToTop(window.innerHeight * 0.3);
              }}
            >
              Edit
            </AsterButton>
          )}
        </div>
      </div>
    </HackathonEditContext>
  );
}
