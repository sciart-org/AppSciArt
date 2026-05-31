import { useState } from "react";
import FormSelect from "../../../../components/form/FormSelect";
import Modal from "../../../../components/Modal";
import AsterButton from "../../../../components/buttons/AsterButton";
import { showErrorMessage } from "../../../../components/messages/Message";
import SubmitCancelButtons from "../../../../components/buttons/SubmitCancelButtons";

export default function NewAggregationModal({
  openCondition,
  seedOptions,
  participantOptions,
  onClose,
  onCreate,
  aggregationName,
}) {
  const [selection, setSelection] = useState({});
  const lowerCaseName = aggregationName.toLowerCase();

  const getFullName = (participant) =>
    `${participant.userProfile?.name} ${participant.userProfile?.surname}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selection.participants || selection.participants.length === 0) {
      showErrorMessage(`You cannot create an empty ${lowerCaseName}`);
    }
    if (!selection.seed) {
      showErrorMessage(`You need to associate the ${lowerCaseName} to a seed`);
    }

    onCreate(selection);
    onClose();
    setSelection({});
  };

  if (!participantOptions || participantOptions.length === 0) {
    return (
      <Modal openCondition={openCondition}>
        <h3>No participants available</h3>
        <p>
          All participants are already assigned. Unassign one to create a new{" "}
          {lowerCaseName}.
        </p>
        <AsterButton type="secondary" onClick={onClose}>
          Go back
        </AsterButton>
      </Modal>
    );
  }

  return (
    <Modal openCondition={openCondition}>
      <h3 style={{ textAlign: "center" }}>New {lowerCaseName}</h3>
      <p>
        Select the seed and participants to be assigned to the new{" "}
        {lowerCaseName}
      </p>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <FormSelect
          name={"Seed"}
          placeholder={"Select seed..."}
          options={seedOptions.map((s) => s.title)}
          value={selection.seed?.title}
          setValue={(v) => {
            setSelection({
              ...selection,
              seed: seedOptions.find((s) => s.title === v),
            });
          }}
          required={true}
          style={{ width: "100%" }}
        />
        <FormSelect
          name={"Participants"}
          placeholder={"Select participants..."}
          options={participantOptions.map((p) => getFullName(p))}
          value={selection.participants?.map((p) => getFullName(p))}
          setValue={(v) => {
            setSelection({
              ...selection,
              participants: v
                ? v.map((name) =>
                    participantOptions.find((p) => getFullName(p) === name),
                  )
                : [],
            });
          }}
          required={true}
          clearable={true}
          multiple={true}
          style={{ width: "100%" }}
        />
        <SubmitCancelButtons
          submitText="Confirm"
          onCancel={() => {
            onClose();
            setSelection({});
          }}
        />
      </form>
    </Modal>
  );
}
