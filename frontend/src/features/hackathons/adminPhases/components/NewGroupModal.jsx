import { useState } from "react";
import FormSelect from "../../../../components/form/FormSelect";
import Modal from "../../../../components/Modal";
import AsterButton from "../../../../components/buttons/AsterButton";
import useFetcher from "../../../../utils/useFetcher";
import { showErrorMessage } from "../../../../components/messages/Message";

export default function NewGroupModal({
  openCondition,
  seedOptions,
  participantOptions,
  onClose,
  onCreate,
}) {
  const [error, setError] = useState(null);
  const [groupSelection, setGroupSelection] = useState({});

  const { fetcher } = useFetcher(error, setError);

  const getFullName = (participant) =>
    `${participant.userProfile?.name} ${participant.userProfile?.surname}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !groupSelection.participants ||
      groupSelection.participants.length === 0
    ) {
      showErrorMessage("You cannot create an empty exploring group");
    }
    if (!groupSelection.seed) {
      showErrorMessage("You need to associate the group to a seed");
    }

    fetcher({
      url: `hackathons/${groupSelection.participants[0].hackathonId}/clusters/${0}/exploring-groups?broadcast=true`,
      method: "POST",
      body: {
        participantIds: groupSelection.participants.map((p) => p.id),
        seedId: groupSelection.seed.id,
      },
      onSuccess: () => {
        onCreate();
        setGroupSelection({});
        onClose();
      },
    });
  };

  if (!participantOptions || participantOptions.length === 0) {
    return (
      <Modal openCondition={openCondition}>
        <h3>No participants available</h3>
        <p>
          All participants are already assigned to a group. Unassign one to
          create a new group.
        </p>
        <AsterButton type="secondary" onClick={onClose}>
          Go back
        </AsterButton>
      </Modal>
    );
  }

  return (
    <Modal openCondition={openCondition}>
      <h3 style={{ textAlign: "center" }}>New exploring group</h3>
      <p>Select the seed and participants to be assigned to the new group</p>
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
          value={groupSelection.seed?.title}
          setValue={(v) => {
            setGroupSelection({
              ...groupSelection,
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
          value={groupSelection.participants?.map((p) => getFullName(p))}
          setValue={(v) => {
            setGroupSelection({
              ...groupSelection,
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <AsterButton type="submit">Confirm</AsterButton>
          <AsterButton
            type="secondary"
            onClick={() => {
              onClose();
              setGroupSelection({});
            }}
          >
            Cancel
          </AsterButton>
        </div>
      </form>
    </Modal>
  );
}
