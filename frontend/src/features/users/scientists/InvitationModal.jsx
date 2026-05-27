import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import FormInput from "../../../components/form/FormInput";
import { getFullUserName, validateEmail } from "../../../utils/commonUtils";
import useFetcher from "../../../utils/useFetcher";
import EditionPicker from "../../products/collections/components/EditionPicker";
import SubmitCancelButtons from "../../../components/buttons/SubmitCancelButtons";
import FormSelect from "../../../components/form/FormSelect";

export default function InvitationModal({ openModal, setOpenModal }) {
  const [allEditions, setAllEditions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState(null);
  const [showUsers, setShowUsers] = useState(false);

  const [formData, setFormData] = useState({
    selectedEditionId: undefined,
    userProfileId: undefined,
    email: undefined,
    sendEmail: false,
  });

  const selectedUserName = getFullUserName(
    allUsers.find((user) => user.id === formData.userProfileId),
  );
  const selectedEditionName = allEditions.find(
    (edition) => edition.id === formData.selectedEditionId,
  );

  const { fetcher } = useFetcher(error, setError);

  useEffect(() => {
    fetcher({
      url: "editions?state=ACTIVE&state=PLANNED",
      onSuccess: (data) => {
        setAllEditions(data);
      },
    });
    fetcher({
      url: "users",
      onSuccess: (data) => {
        setAllUsers(data);
      },
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.selectedEditionId) {
      window.alert("Select an edition.");
      return;
    }

    if (!showUsers && !validateEmail(scientistEmail)) {
      window.alert("Invalid email format.");
      return;
    }

    const body = {
      ...formData,
      sendEmail: undefined,
      selectedEditionId: undefined,
    };

    fetcher({
      url: `editions/${formData.selectedEditionId}/scientists?sendEmail=${formData.sendEmail}`,
      method: "POST",
      body,
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
          width: "90%",
          margin: "auto",
          marginTop: "1rem",
        }}
      >
        <h3 style={{ textAlign: "start", margin: 0 }}>Edition</h3>
        <EditionPicker
          selectedEdition={selectedEditionName}
          setSelectedEdition={(e) =>
            setFormData({
              ...formData,
              selectedEditionId: e.id,
            })
          }
          allEditions={allEditions}
          size={"small"}
        />
        <FormInput
          name={"Scientist already registered?"}
          type={"checkbox"}
          value={showUsers}
          onChange={() => setShowUsers(!showUsers)}
          style={{ marginBlock: 0 }}
        />
        {showUsers ? (
          <FormSelect
            name={"User"}
            placeholder={"Select user..."}
            value={selectedUserName}
            setValue={(e) =>
              setFormData({
                ...formData,
                email: undefined,
                userProfileId: allUsers.find(
                  (user) => getFullUserName(user) === e,
                ).id,
              })
            }
            options={allUsers.map((user) => getFullUserName(user))}
            clearable={false}
          />
        ) : (
          <FormInput
            name={"Scientist email"}
            placeholder={"Enter scientist email"}
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
                userProfileId: undefined,
              })
            }
            style={{ width: "100%" }}
          />
        )}
        <FormInput
          name={"Send invitation email?"}
          type={"checkbox"}
          value={formData.sendEmail}
          onChange={() =>
            setFormData({
              ...formData,
              sendEmail: !formData.sendEmail,
            })
          }
          style={{ marginBlock: 0 }}
        />
        <SubmitCancelButtons onCancel={() => setOpenModal(false)} />
      </form>
    </Modal>
  );
}
