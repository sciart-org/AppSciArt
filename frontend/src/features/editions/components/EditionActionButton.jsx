import { createContext, useContext, useState } from "react";
import AsterButton from "../../../components/AsterButton";
import useFetcher from "../../../utils/useFetcher";
import Modal from "../../../components/Modal";
import { useNavigate } from "react-router";
import Loading from "../../../components/messages/Loading";
import { showSuccessMessage } from "../../../components/messages/Message";

const EditionActionContext = createContext(null);

const EditionActionModal = () => {
  const context = useContext(EditionActionContext);
  const { openModal, setOpenModal, action, onAction, loading } = context;

  return (
    <Modal openCondition={openModal}>
      <h3 style={{ textAlign: "center" }}>
        Are you sure you want to {action.toLowerCase()} this edition?
      </h3>
      {loading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
            }}
          >
            <AsterButton onClick={onAction}>{action}</AsterButton>
            <AsterButton
              variant="secondary"
              onClick={() => setOpenModal(false)}
            >
              Cancel
            </AsterButton>
          </div>
        </>
      )}
    </Modal>
  );
};

export const EditionActionButton = ({ edition, ...props }) => {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { fetcher } = useFetcher(error, setError);
  const navigate = useNavigate();

  const announceEdition = async (editionId) => {
    setLoading(true);
    await fetcher({
      url: `editions/${editionId}/announce`,
      method: "POST",
      onSuccess: () => {
        edition.state = "ACTIVE";
        navigate("/editions");
        showSuccessMessage("Edition announced successfully!");
      },
    }).finally(() => {
      setLoading(false);
      setOpenModal(false);
    });
  };

  const EditionButtonCreator = ({ action, onAction }) => {
    return (
      <EditionActionContext
        value={{ openModal, setOpenModal, action, onAction, loading }}
      >
        <EditionActionModal />
        <AsterButton {...props} onClick={() => setOpenModal(true)}>
          {action}
        </AsterButton>
      </EditionActionContext>
    );
  };

  switch (edition?.state) {
    case "PLANNED":
      return (
        <EditionButtonCreator
          action="Announce"
          onAction={() => announceEdition(edition.id)}
        />
      );

    case "ACTIVE":
      return (
        <AsterButton {...props} onClick={() => console.log("Close")}>
          Close
        </AsterButton>
      );

    case "CLOSED":
      return (
        <AsterButton {...props} onClick={() => console.log("Publish")}>
          Publish
        </AsterButton>
      );

    default:
      return null;
  }
};
