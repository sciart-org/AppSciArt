import { useContext, useEffect, useRef, useState } from "react";
import { HackathonContext } from "../components/HackathonContext";
import useFetcher from "../../../utils/useFetcher";
import ConfirmPhaseChangeModal from "./ConfirmPhaseChangeModal";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import ParticipantCard from "../../../components/drag-and-drop/ParticipantCard";
import SeedSection from "../../../components/drag-and-drop/SeedSection";
import Column from "../../../components/drag-and-drop/Column";
import AsterButton from "../../../components/buttons/AsterButton";
import { checkExists } from "../../../../../backend/src/validators/generalValidators";
import Modal from "../../../components/Modal";

export default function CreateGroups(props) {
  const { hackathon, handleNextPhase } = useContext(HackathonContext);

  const isCurrentPhase = hackathon.phase === "GROUP_CREATION";

  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [hackathonSeeds, setHackathonSeeds] = useState([]);
  const [exploringGroups, setExploringGroups] = useState([]);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [changingParticipant, setChangingParticipant] = useState(false);

  const { fetcher } = useFetcher(error, setError);

  const fetchSeeds = async (groups) => {
    await fetcher({
      url: `seeds?hackathonId=${hackathon.id}`,
      onSuccess: (data) => {
        let seeds = data;
        if (!isCurrentPhase) {
          seeds = seeds.filter((s) =>
            groups.map((e) => e.seedId).includes(s.id),
          );
        }
        setHackathonSeeds(seeds);
      },
    });
  };

  useEffect(() => {
    if (!hackathon.id) return;
    fetcher({
      url: `hackathons/${hackathon.id}/clusters/${0}/exploring-groups`,
      onSuccess: (data) => {
        setExploringGroups(data);
        fetchSeeds(data);
      },
    });
  }, [hackathon?.id]);

  const exploringGroupsRef = useRef(exploringGroups);
  useEffect(() => {
    exploringGroupsRef.current = exploringGroups;
  }, [exploringGroups]);

  const changeSeed = (participant, seedId, group) => {
    const groupId = seedId === null ? null : group?.id;

    if (participant?.groupSeed?.id === groupId) return;

    fetcher({
      url: `hackathons/${hackathon.id}/participants/${participant.userProfile.id}?broadcast=true`,
      method: "PUT",
      body: { groupId },
      onSuccess: (updatedParticipation) =>
        props.updateParticipation(updatedParticipation),
    });
  };

  const handleSeedChange = (participant, seedId) => {
    const group = exploringGroupsRef.current.find((g) => g.seedId === seedId);

    if (
      !hasConfirmed &&
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

  const unassignedParticipants = hackathon.participations.filter(
    (p) => p.groupSeed == null || Object.keys(p.groupSeed).length === 0,
  );

  const participantsForSeed = (seedId) =>
    hackathon.participations.filter((p) => p.groupSeed?.id === seedId);

  const MoveParticipantModal = () => {
    return (
      <Modal openCondition={checkExists(changingParticipant)}>
        <h3 style={{ textAlign: "center" }}>Are you sure?</h3>
        <p>
          {`${changingParticipant?.participant?.userProfile?.name} ${changingParticipant?.participant?.userProfile?.surname} `}
          is already in a group.
          {changingParticipant?.seedId
            ? " Do you want to move them to:"
            : " Do you want to remove them from their current group?"}
        </p>
        {changingParticipant?.seedId && (
          <p>
            {`Group ${changingParticipant?.group?.number} — `}
            {
              hackathonSeeds.find((s) => s.id === changingParticipant?.seedId)
                ?.title
            }
            {"?"}
          </p>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
          }}
        >
          <AsterButton
            onClick={() => {
              setHasConfirmed(true);
              changeSeed(
                changingParticipant.participant,
                changingParticipant.seedId,
                changingParticipant.group,
              );
              setChangingParticipant(null);
            }}
          >
            Confirm
          </AsterButton>
          <AsterButton
            variant="secondary"
            onClick={() => setChangingParticipant(null)}
          >
            Cancel
          </AsterButton>
        </div>
      </Modal>
    );
  };

  return (
    <div>
      <h2>Exploring groups creation</h2>
      {!isCurrentPhase && (
        <p
          className="warning-text justified-text"
          style={{
            maxWidth: "25rem",
            marginInline: "auto",
            marginBottom: "2rem",
          }}
        >
          ⚠ Making changes to groups after their creation is not recommended.
          Proceed with caution.
        </p>
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
          Groups will be created and participants will start working on the
          SciArt flowers creation
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
            {hackathonSeeds.map((seed) => (
              <SeedSection key={seed.id} seed={seed}>
                {participantsForSeed(seed.id).map((p) => (
                  <ParticipantCard
                    key={p.id}
                    participant={p}
                    seedId={seed.id}
                  />
                ))}
              </SeedSection>
            ))}
          </div>
        </div>
      </div>
      {isCurrentPhase && (
        <AsterButton onClick={() => setOpenModal(true)}>Create</AsterButton>
      )}
      <MoveParticipantModal />
    </div>
  );
}
