import { useContext, useEffect, useRef, useState } from "react";
import { HackathonContext } from "../components/HackathonContext";
import useFetcher from "../../../utils/useFetcher";
import ConfirmPhaseChangeModal from "./ConfirmPhaseChangeModal";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import ParticipantCard from "../../../components/drag-and-drop/ParticipantCard";
import SeedSection from "../../../components/drag-and-drop/SeedSection";
import Column from "../../../components/drag-and-drop/Column";

export default function CreateGroups(props) {
  const { hackathon, handleNextPhase, setHackathon } =
    useContext(HackathonContext);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [hackathonSeeds, setHackathonSeeds] = useState([]);
  const [exploringGroups, setExploringGroups] = useState([]);

  const { fetcher } = useFetcher(error, setError);

  useEffect(() => {
    if (!hackathon.id) return;
    fetcher({
      url: `seeds?hackathonId=${hackathon.id}`,
      onSuccess: (data) => setHackathonSeeds(data),
    });
    fetcher({
      url: `hackathons/${hackathon.id}/clusters/${0}/exploring-groups`,
      onSuccess: (data) => setExploringGroups(data),
    });
  }, [hackathon?.id]);

  const exploringGroupsRef = useRef(exploringGroups);
  useEffect(() => {
    exploringGroupsRef.current = exploringGroups;
  }, [exploringGroups]);

  const handleSeedChange = (participant, seedId) => {
    const group = exploringGroupsRef.current.find((g) => g.seedId === seedId);
    const groupId = seedId === null ? null : group?.id;

    fetcher({
      url: `hackathons/${hackathon.id}/participants/${participant.userProfile.id}?broadcast=true`,
      method: "PUT",
      body: { groupId },
      onSuccess: (updatedParticipation) =>
        props.updateParticipation(updatedParticipation),
    });
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

  return (
    <div>
      <h1>{hackathon.internalName}</h1>
      <h2>Creation of exploring groups</h2>
      <ConfirmPhaseChangeModal
        openCondition={openModal}
        onConfirm={handleNextPhase}
        onCancel={() => setOpenModal(false)}
      />
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
    </div>
  );
}
