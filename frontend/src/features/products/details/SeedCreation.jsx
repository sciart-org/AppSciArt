import { use, useState } from "react";
import AsterButton from "../../../components/buttons/AsterButton";
import RedirectButton from "../../../components/buttons/RedirectButton";
import SelectorBar from "../../../components/buttons/SelectorBar";
import CreationProcessHeader from "../../../components/CreationProcessHeader";
import RenderUrl from "../../../components/RenderUrl";
import SeedForm from "../creators/components/SeedForm";
import { getFormData, handleFormInputChange, scrollToTop } from "../../../utils/commonUtils";
import Loading from "../../../components/messages/Loading";

export default function SeedCreation({ seed: creatingSeed }) {
  const [showTemplate, setShowTemplate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState(getFormData(creatingSeed));

  const SeedTemplate = () => {
    return (
      <>
        <RedirectButton
          style={{
            position: "absolute",
            right: "4vw",
            cursor: "pointer",
          }}
          url={creatingSeed?.template}
        />
        <RenderUrl
          url={creatingSeed?.template}
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
    setLoading(true);
    // TODO: update seed
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <CreationProcessHeader>
        Seed: {creatingSeed?.title || "New Seed"}
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
              setFormData(getFormData(creatingSeed));
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
