import { useContext, useEffect, useRef, useState } from "react";
import { HackathonContext } from "../components/HackathonContext";
import useFetcher from "../../../utils/useFetcher";
import ConfirmPhaseChangeModal from "./components/ConfirmPhaseChangeModal";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import ParticipantCard from "../../../components/drag-and-drop/ParticipantCard";
import Column from "../../../components/drag-and-drop/Column";
import AsterButton from "../../../components/buttons/AsterButton";
import { checkExists } from "../../../../../backend/src/validators/generalValidators";
import MoveParticipantModal from "./components/MoveParticipantModal";
import NewAggregationModal from "./components/NewAggregationModal";
import Loading from "../../../components/messages/Loading";
import AggregationsSection from "../../../components/drag-and-drop/AggregationsSection";
import WarningText from "../../../components/messages/WarningText";

export default function CreateGroups(props) {
  const { hackathon, handleNextPhase } = useContext(HackathonContext);
  const exploringGroups = props.exploringGroups;

  const isCurrentPhase = hackathon.phase === "GROUP_CREATION";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [hasConfirmedChange, setHasConfirmedChange] = useState(false);
  const [openNewGroupModal, setOpenNewGroupModal] = useState(false);

  const [hackathonSeeds, setHackathonSeeds] = useState([]);
  const seedsToDisplay = hackathonSeeds.filter((s) =>
    exploringGroups.map((e) => e.seedId).includes(s.id),
  );

  const [changingParticipant, setChangingParticipant] = useState(false);
  const changingSeedTitle = seedsToDisplay.find(
    (s) => s.id === changingParticipant?.seedId,
  )?.title;

  const { fetcher } = useFetcher(error, setError);

  const fetchSeeds = async () => {
    await fetcher({
      url: `seeds?hackathonId=${hackathon.id}`,
      onSuccess: (data) => setHackathonSeeds(data),
    }).finally(() => setLoading(false));
  };

  const getFullName = (member) => {
    return member.userProfile.name + " " + member.userProfile.surname;
  };

  const sortByName = (members) => {
    return members.sort((a, b) => getFullName(a).localeCompare(getFullName(b)));
  };

  const unassignedParticipants = sortByName(
    hackathon.participations.filter(
      (p) => p.groupSeed == null || Object.keys(p.groupSeed).length === 0,
    ),
  );

  const participantsForSeed = (seedId) =>
    sortByName(
      hackathon.participations.filter((p) => p.groupSeed?.id === seedId),
    );

  const changeSeed = (participant, seedId, group) => {
    const groupId = seedId === null ? null : group?.id;
    if (participant?.groupSeed?.id === groupId) return;
    props.updateParticipant(participant.userProfile.id, { groupId });
  };

  const handleSeedChange = (participant, seedId) => {
    const group = exploringGroupsRef.current.find((g) => g.seedId === seedId);

    if (
      !hasConfirmedChange &&
      !isCurrentPhase &&
      checkExists(participant?.groupSeed?.id)
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
    props.updateParticipant(participant.userProfile.id, {
      isGroupVoice: !participant.isGroupVoice,
    });
  };

  useEffect(() => {
    if (!hackathon.id) return;
    fetchSeeds();
  }, [hackathon?.id]);

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

  if (loading) {
    return <Loading />;
  }

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
            {unassignedParticipants.map((p) => (
              <ParticipantCard key={p.id} participant={p} />
            ))}
          </Column>
        </div>
        <div>
          <h3
            className="group-box-header"
            style={{ margin: 0, borderBottom: 0 }}
          >
            Exploring groups (seeds)
          </h3>
          <div style={{ maxHeight: "80vh", overflowY: "scroll" }}>
            {seedsToDisplay.map((seed) => (
              <AggregationsSection key={seed.id} aggregation={seed}>
                {participantsForSeed(seed.id).map((p) => (
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
            onSuccess: () => {
              props.fetchExploringGroups();
              setOpenNewGroupModal(false);
            },
          });
        }}
        aggregationName={"exploring group"}
      />
    </div>
  );
}
