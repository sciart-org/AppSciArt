import { useContext, useEffect, useState } from "react";
import { HackathonContext } from "../components/HackathonContext";
import ConfirmPhaseChangeModal from "./components/ConfirmPhaseChangeModal";
import ParticipantCard from "../../../components/drag-and-drop/ParticipantCard";
import Column from "../../../components/drag-and-drop/Column";
import AsterButton from "../../../components/buttons/AsterButton";
import AggregationsSection from "../../../components/drag-and-drop/AggregationsSection";
import NewAggregationModal from "./components/NewAggregationModal";
import useFetcher from "../../../utils/useFetcher";
import WarningText from "../../../components/messages/WarningText";
import MoveParticipantModal from "./components/MoveParticipantModal";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useRef } from "react";
import Loading from "../../../components/messages/Loading";

export default function CreateTeams() {
  const {
    hackathon,
    handleNextPhase,
    hackathonSeeds,
    coCreationTeams,
    updateParticipant,
  } = useContext(HackathonContext);

  const [error, setError] = useState(null);

  const [openNextPhaseModal, setOpenNextPhaseModal] = useState(false);
  const [openNewTeamModal, setOpenNewTeamModal] = useState(false);
  const [hasConfirmedChange, setHasConfirmedChange] = useState(false);
  const [changingParticipant, setChangingParticipant] = useState(false);
  const [loading, setLoading] = useState(false);

  const flowerSeeds = hackathonSeeds.filter((s) =>
    coCreationTeams.map((f) => f.seed.id).includes(s.id),
  );
  const changingFlowerSeedTitle = hackathonSeeds.find(
    (s) => s.id === changingParticipant?.seedId,
  )?.title;
  const seedsWithoutTeam = hackathonSeeds.filter(
    (s) => !flowerSeeds.includes(s),
  );

  const { fetcher } = useFetcher(error, setError);

  const isCurrentPhase = hackathon.phase === "TEAM_CREATION";

  const getFullName = (member) => {
    return member.userProfile.name + " " + member.userProfile.surname;
  };

  const sortByName = (members) => {
    return members.sort((a, b) => getFullName(a).localeCompare(getFullName(b)));
  };

  const unassignedParticipants = sortByName(
    hackathon.participations.filter(
      (p) => p.teamFlower == null || Object.keys(p.teamFlower).length === 0,
    ),
  );

  const participantsForFlowerOfSeed = (seedId) =>
    sortByName(
      hackathon.participations.filter((p) => p.teamFlower?.seed?.id === seedId),
    );

  const handleToggleTeamSpeaker = (participant) => {
    updateParticipant(participant.userProfile.id, {
      isTeamSpeaker: !participant.isTeamSpeaker,
    });
  };

  const changeFlower = (participant, seedId, team) => {
    const teamId = seedId === null ? null : team?.id;
    if (participant?.teamFlower?.id === teamId) return;
    updateParticipant(participant.userProfile.id, { teamId });
  };

  const handleFlowerChange = (participant, seedId) => {
    const coCreationTeam = coCreationTeamsRef.current.find(
      (team) => team.seed.id === seedId,
    );

    if (
      !hasConfirmedChange &&
      !isCurrentPhase &&
      !!participant?.teamFlower?.id
    ) {
      setChangingParticipant({
        participant,
        seedId,
        coCreationTeam,
      });
      return;
    }

    changeFlower(participant, seedId, coCreationTeam);
  };

  const coCreationTeamsRef = useRef(coCreationTeams);
  useEffect(() => {
    coCreationTeamsRef.current = coCreationTeams;
  }, [coCreationTeams]);

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) return;

        const { participant } = source.data;
        const { data } = destination.data;

        if (!participant || data === undefined) return;

        handleFlowerChange(participant, data);
      },
    });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h2>Co-creation teams creation</h2>
      {!isCurrentPhase && (
        <WarningText
          style={{
            maxWidth: "25rem",
            marginInline: "auto",
            marginBottom: "2rem",
          }}
        >
          ⚠ Making changes to teams after their creation is not recommended.
          Proceed with caution.
        </WarningText>
      )}
      <ConfirmPhaseChangeModal
        openCondition={openNextPhaseModal}
        onConfirm={() => {
          setLoading(true);
          setOpenNextPhaseModal(false);
          handleNextPhase({ onError: () => setLoading(false) });
        }}
        onCancel={() => setOpenNextPhaseModal(false)}
      >
        <p>
          Teams will be created and participants will start working on the
          SciArt flowers creation.
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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h3 className="group-box-header" style={{ margin: 0 }}>
            Co-creation teams
          </h3>
          <div className="group-box-content" style={{ flex: 1 }}>
            {flowerSeeds.map((seed) => (
              <AggregationsSection
                key={seed.id}
                data={seed.id}
                title={seed.title}
              >
                {participantsForFlowerOfSeed(seed.id).map((p) => {
                  return (
                    <ParticipantCard
                      key={p.id}
                      participant={p}
                      checkboxValue={!!p.isTeamSpeaker}
                      onToggleCheckbox={handleToggleTeamSpeaker}
                      isAssigned={true}
                    />
                  );
                })}
              </AggregationsSection>
            ))}
          </div>
          {seedsWithoutTeam &&
            seedsWithoutTeam.length !== 0 &&
            isCurrentPhase && (
              <AsterButton
                onClick={() => setOpenNewTeamModal(true)}
                style={{ width: "100%", borderRadius: 0 }}
              >
                Assign seed to new team
              </AsterButton>
            )}
        </div>
      </div>
      {isCurrentPhase ? (
        <AsterButton onClick={() => setOpenNextPhaseModal(true)}>
          Create
        </AsterButton>
      ) : (
        <>
          <p>Need a new team?</p>
          <AsterButton onClick={() => setOpenNewTeamModal(!isCurrentPhase)}>
            Create team
          </AsterButton>
        </>
      )}
      <MoveParticipantModal
        changingParticipant={changingParticipant}
        changingSeedTitle={changingFlowerSeedTitle}
        aggregationNumber={changingParticipant?.coCreationTeam?.number}
        aggregationName={"Team"}
        onConfirm={() => {
          setHasConfirmedChange(true);
          changeFlower(
            changingParticipant.participant,
            changingParticipant.seedId,
            changingParticipant.coCreationTeam,
          );
          setChangingParticipant(null);
        }}
        onCancel={() => setChangingParticipant(null)}
      />
      <NewAggregationModal
        openCondition={openNewTeamModal}
        seedOptions={seedsWithoutTeam}
        participantOptions={unassignedParticipants}
        onClose={() => setOpenNewTeamModal(false)}
        onCreate={(selection) => {
          fetcher({
            url: `hackathons/${selection.participants[0].hackathonId}/clusters/${0}/co-creation-teams?broadcast=ALL`,
            method: "POST",
            body: {
              participantIds: selection.participants.map((p) => p.id),
              seedId: selection.seed.id,
            },
          });
        }}
        aggregationName={"co-creation team"}
      />
    </div>
  );
}
