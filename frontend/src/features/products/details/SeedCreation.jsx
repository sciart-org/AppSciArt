import { useState } from "react";
import AsterButton from "../../../components/buttons/AsterButton";
import RedirectButton from "../../../components/buttons/RedirectButton";
import SelectorBar from "../../../components/buttons/SelectorBar";
import CreationProcessHeader from "../../../components/CreationProcessHeader";
import RenderUrl from "../../../components/RenderUrl";
import SeedForm from "../creators/components/SeedForm";
import {
  filterNotChangedFields,
  getFormData,
  handleFormInputChange,
  scrollToTop,
} from "../../../utils/commonUtils";
import Loading from "../../../components/messages/Loading";
import useFetcher from "../../../utils/useFetcher";

export default function SeedCreation({ seed: creatingSeed }) {
  const [showTemplate, setShowTemplate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  const [seed, setSeed] = useState(creatingSeed);
  const [formData, setFormData] = useState(getFormData(seed));

  const { fetcher } = useFetcher(error, setError);

  const SeedTemplate = () => {
    return (
      <>
        <RedirectButton
          style={{
            position: "absolute",
            right: "4vw",
            cursor: "pointer",
          }}
          url={seed?.template}
        />
        <RenderUrl
          url={seed?.template}
          style={{
            height: "90vh",
            border: "solid 1px var(--aster-dark-gray)",
            borderRadius: "1rem",
            width: "85vw",
            marginInline: "auto",
          }}
        />
      </>
    );
  };

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
    const body = filterNotChangedFields(formData, seed);
    if (Object.keys(body).length === 0) {
      setIsEditing(false);
      setLoading(false);
      return;
    }

    fetcher({
      url: `seeds/${seed.id}`,
      method: "PUT",
      body: body,
      onSuccess: (data) => {
        setFormData(getFormData(data));
        setSeed((prev) => ({ ...prev, ...data }));
      },
      onError: () => {
        setFormData(getFormData(seed));
      },
    }).finally(() => {
      setIsEditing(false);
      setLoading(false);
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <CreationProcessHeader>
        Seed: {seed?.title || "New Seed"}
      </CreationProcessHeader>
      <SelectorBar style={{ marginBottom: "4vh", width: "85vw" }}>
        <AsterButton
          onClick={() => setShowTemplate(true)}
          className={showTemplate ? "aster-button-hover" : ""}
        >
          Seed template
        </AsterButton>
        <AsterButton
          onClick={() => setShowTemplate(false)}
          className={!showTemplate ? "aster-button-hover" : ""}
        >
          Seed information
        </AsterButton>
      </SelectorBar>

      {showTemplate ? (
        <SeedTemplate />
      ) : (
        <>
          <SeedForm
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            formData={formData}
            isEditable={isEditing}
            onCancel={() => {
              setIsEditing(false);
              setFormData(getFormData(seed));
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
        </>
      )}
    </div>
  );
}
