import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import FormInput from "../../../components/form/FormInput";
import { validateEmail } from "../../../utils/commonUtils";
import useFetcher from "../../../utils/useFetcher";
import EditionPicker from "../../products/collections/components/EditionPicker";
import SubmitCancelButtons from "../../../components/SubmitCancelButtons";

export default function InvitationModal({ openModal, setOpenModal }) {
  const [scientistEmail, setScientistEmail] = useState("");
  const [selectedEdition, setSelectedEdition] = useState(null);
  const [allEditions, setAllEditions] = useState([]);
  const [error, setError] = useState(null);

  const { fetcher } = useFetcher(error, setError);

  useEffect(() => {
    fetcher({
      url: "editions",
      onSuccess: (data) => {
        setAllEditions(data);
        if (!data.length > 0) {
          return;
        }
        setSelectedEdition(data[0]);
      },
      onError: () => {
        setAllEditions([]);
      },
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(scientistEmail)) {
      window.alert("Invalid email format.");
      return;
    }
    if (!selectedEdition) {
      window.alert("Select an edition.");
      return;
    }
    fetcher({
      url: `editions/${selectedEdition?.id}/scientists`,
      method: "POST",
      body: {
        email: scientistEmail,
      },
      onSuccess: () => {
        setOpenModal(false);
      },
    });
  };

  return (
    <Modal openCondition={openModal}>
      <h3>Invite Inspiring Scientist</h3>
      <hr style={{ width: "90%", margin: "0 auto" }} />
      <form
        onSubmit={handleSubmit}
        className="seed-creation-form"
        style={{
          width: "80%",
          margin: "auto",
          marginTop: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <text>Edition:</text>
          <EditionPicker
            selectedEdition={selectedEdition}
            setSelectedEdition={setSelectedEdition}
            allEditions={allEditions}
            size={"small"}
            style={{ alignItems: "center" }}
          />
        </div>
        <FormInput
          name={"Scientist email:"}
          placeholder={"Enter scientist email"}
          value={scientistEmail}
          onChange={(e) => setScientistEmail(e.target.value)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        />
        <SubmitCancelButtons />
      </form>
    </Modal>
  );
}
