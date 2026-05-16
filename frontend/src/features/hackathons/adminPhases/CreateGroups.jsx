import { useContext, useEffect, useRef, useState } from "react";
import { HackathonContext } from "../components/HackathonContext";
import useFetcher from "../../../utils/useFetcher";
import ConfirmPhaseChangeModal from "./components/ConfirmPhaseChangeModal";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import ParticipantCard from "../../../components/drag-and-drop/ParticipantCard";
import Column from "../../../components/drag-and-drop/Column";
import AsterButton from "../../../components/buttons/AsterButton";
import MoveParticipantModal from "./components/MoveParticipantModal";
import NewAggregationModal from "./components/NewAggregationModal";
import AggregationsSection from "../../../components/drag-and-drop/AggregationsSection";
import WarningText from "../../../components/messages/WarningText";
import { sortParticipantsBySurname } from "../../../utils/commonUtils";

export default function CreateGroups() {
  const {
    hackathon,
    handleNextPhase,
    hackathonSeeds,
    exploringGroups,
    updateParticipant,
  } = useContext(HackathonContext);

  const isCurrentPhase = hackathon.phase === "GROUP_CREATION";

  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [hasConfirmedChange, setHasConfirmedChange] = useState(false);
  const [openNewGroupModal, setOpenNewGroupModal] = useState(false);

  const seedsToDisplay = hackathonSeeds.filter((s) =>
    exploringGroups.map((e) => e.seedId).includes(s.id),
  );

  const [changingParticipant, setChangingParticipant] = useState(false);
  const changingSeedTitle = seedsToDisplay.find(
    (s) => s.id === changingParticipant?.seedId,
  )?.title;

  const { fetcher } = useFetcher(error, setError);

  const unassignedParticipants = sortParticipantsBySurname(
    hackathon.participations.filter(
      (p) => p.groupSeed == null || Object.keys(p.groupSeed).length === 0,
    ),
  );

  const participantsForSeed = (seedId) =>
    sortParticipantsBySurname(
      hackathon.participations.filter((p) => p.groupSeed?.id === seedId),
    );

  const changeSeed = (participant, seedId, group) => {
    const groupId = seedId === null ? null : group?.id;
    if (participant?.groupSeed?.id === groupId) return;
    updateParticipant(participant.userProfile.id, { groupId });
  };

  const handleSeedChange = (participant, seedId) => {
    const group = exploringGroupsRef.current.find((g) => g.seedId === seedId);

    if (
      !hasConfirmedChange &&
      !isCurrentPhase &&
      !!participant?.groupSeed?.id
    ) {
      setChangingParticipant({
        participant,
        seedId,
        group,
      });
      return;
    }

    changeSeed(participant, seedId, group);
  };

  const handleToggleGroupVoice = (participant) => {
    updateParticipant(participant.userProfile.id, {
      isGroupVoice: !participant.isGroupVoice,
    });
  };

  const exploringGroupsRef = useRef(exploringGroups);
  useEffect(() => {
    exploringGroupsRef.current = exploringGroups;
  }, [exploringGroups]);

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) return;

        const { participant } = source.data;
        const { data } = destination.data;

        if (!participant || data === undefined) return;

        handleSeedChange(participant, data);
      },
    });
  }, []);

  return (
    <div>
      <h2>Exploring groups creation</h2>
      {!isCurrentPhase && (
        <WarningText
          style={{
            maxWidth: "25rem",
            marginInline: "auto",
            marginBottom: "2rem",
          }}
        >
          ⚠ Making changes to groups after their creation is not recommended.
          Proceed with caution.
        </WarningText>
      )}
      <ConfirmPhaseChangeModal
        openCondition={openModal}
        onConfirm={() => {
          setOpenModal(false);
          handleNextPhase();
        }}
        onCancel={() => setOpenModal(false)}
      >
        <p>
          Groups will be created and participants will start working on creating
          conceptual maps.
        </p>
      </ConfirmPhaseChangeModal>
      <div className="group-box-container">
        <div>
          <h3 className="group-box-header">Unassigned participants</h3>
          <Column
            data={null}
            style={{ height: "100%", maxHeight: "80vh", overflowY: "scroll" }}
          >
            {unassignedParticipants.map((p, i) => (
              <ParticipantCard
                key={p.id}
                participant={p}
                style={
                  i === unassignedParticipants.length - 1
                    ? { padding: "1rem" }
                    : undefined
                }
              />
            ))}
          </Column>
        </div>
        <div>
          <h3 className="group-box-header" style={{ margin: 0 }}>
            Exploring groups (seeds)
          </h3>
          <div className="group-box-content">
            {seedsToDisplay.map((seed) => (
              <AggregationsSection
                key={seed.id}
                data={seed.id}
                title={seed.title}
              >
                {participantsForSeed(seed.id)?.length !== 0 &&
                  participantsForSeed(seed.id).map((p) => (
                    <ParticipantCard
                      key={p.id}
                      participant={p}
                      checkboxValue={!!p.isGroupVoice}
                      onToggleCheckbox={handleToggleGroupVoice}
                      isAssigned={true}
                    />
                  ))}
              </AggregationsSection>
            ))}
          </div>
        </div>
      </div>
      {isCurrentPhase ? (
        <AsterButton onClick={() => setOpenModal(true)}>Create</AsterButton>
      ) : (
        <>
          <p>Need a new group?</p>
          <AsterButton onClick={() => setOpenNewGroupModal(!isCurrentPhase)}>
            Create group
          </AsterButton>
        </>
      )}
      <MoveParticipantModal
        changingParticipant={changingParticipant}
        changingSeedTitle={changingSeedTitle}
        aggregationNumber={changingParticipant?.group?.number}
        aggregationName={"Group"}
        onConfirm={() => {
          setHasConfirmedChange(true);
          changeSeed(
            changingParticipant.participant,
            changingParticipant.seedId,
            changingParticipant.group,
          );
          setChangingParticipant(null);
        }}
        onCancel={() => setChangingParticipant(null)}
      />
      <NewAggregationModal
        openCondition={openNewGroupModal}
        seedOptions={hackathonSeeds.filter((s) => !seedsToDisplay.includes(s))}
        participantOptions={unassignedParticipants}
        onClose={() => setOpenNewGroupModal(false)}
        onCreate={(selection) => {
          fetcher({
            url: `hackathons/${selection.participants[0].hackathonId}/clusters/${0}/exploring-groups?broadcast=ALL`,
            method: "POST",
            body: {
              participantIds: selection.participants.map((p) => p.id),
              seedId: selection.seed.id,
            },
          });
        }}
        aggregationName={"exploring group"}
      />
    </div>
  );
}
