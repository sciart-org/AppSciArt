import { useContext, useEffect, useState } from "react";
import AsterButton from "../../../components/buttons/AsterButton";
import CreationProcessHeader from "../../../components/CreationProcessHeader";
import RenderUrl from "../../../components/RenderUrl";
import SeedResources from "../../products/components/SeedResources";
import { DiagramGallery } from "../components/diagramming/DiagramGallery";
import { HackathonContext } from "../components/HackathonContext";
import ConfirmPhaseChangeModal from "./components/ConfirmPhaseChangeModal";
import useFetcher from "../../../utils/useFetcher";
import Loading from "../../../components/messages/Loading";
import GoBack from "./components/GoBack";

export default function ManageTeams() {
  const { handleNextPhase, coCreationTeams, hackathon } =
    useContext(HackathonContext);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [teamFlower, setTeamFlower] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { fetcher } = useFetcher(error, setError);

  const isCurrentPhase = hackathon.phase === "TEAM_WORK";

  const getFullName = (member) => {
    return member.name + " " + member.surname;
  };

  const fetchFlower = async () => {
    await fetcher({
      url: `flowers/${selectedTeam.id}`,
      onSuccess: (data) => {
        setTeamFlower(data);
      },
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!selectedTeam) return;
    fetchFlower();
  }, [selectedTeam]);

  if (!selectedTeam) {
    return (
      <>
        <ConfirmPhaseChangeModal
          openCondition={openModal}
          onConfirm={() => {
            setOpenModal(false);
            handleNextPhase();
          }}
          onCancel={() => setOpenModal(false)}
        >
          <p>
            All flowers will be locked and no more changes will be allowed.
            Participants will present their flowers.
          </p>
        </ConfirmPhaseChangeModal>
        <div className="manage-groups-grid">
          {coCreationTeams?.map((team) => (
            <div
              key={team.id}
              className="manage-groups-card"
              onClick={() => setSelectedTeam(team)}
            >
              <div className="manage-groups-header">
                <h2>Team {team.number}</h2>
                {team.isDelivered && (
                  <span className="manage-groups-delivered-badge">
                    ✓ Delivered
                  </span>
                )}
              </div>

              <p className="manage-groups-seed">{team.seedTitle}</p>

              <h4>Members</h4>
              <div className="manage-groups-members">
                {team?.members?.length === 0 ? (
                  <p className="manage-groups-no-members">No members</p>
                ) : (
                  team?.members
                    ?.sort((a, b) =>
                      getFullName(a).localeCompare(getFullName(b)),
                    )
                    .map((m) => (
                      <div key={m.id} className="manage-groups-member">
                        <span className="manage-groups-member-name">
                          {getFullName(m)}
                        </span>
                        {m.isTeamSpeaker && (
                          <span className="manage-groups-voice-badge">
                            Team speaker
                          </span>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>
          ))}
        </div>
        {isCurrentPhase && (
          <>
            <p>
              {`${coCreationTeams.filter((t) => t.isDelivered).length} / ${coCreationTeams.length} flowers `}
              delivered
            </p>
            <AsterButton onClick={() => setOpenModal(true)}>
              Start presentations
            </AsterButton>
          </>
        )}
      </>
    );
  }

  if (loading) {
    return <Loading />;
  }

  const TeamHeader = () => {
    return (
      <>
        <GoBack
          onClick={() => {
            setSelectedTeam(null);
            setTeamFlower(null);
            setShowMap(false);
            setLoading(true);
          }}
        />
        <CreationProcessHeader members={selectedTeam?.members}>
          Co-creation team {selectedTeam.number}
        </CreationProcessHeader>
      </>
    );
  };

  const TeamFlowerDoc = () => {
    return (
      <RenderUrl
        url={teamFlower?.template}
        style={{
          height: "90vh",
          border: "solid 1px rgba(191, 191, 191, 255)",
          borderRadius: "1rem",
          marginTop: "1rem",
          width: "90vw",
          marginInline: "auto",
        }}
      />
    );
  };

  if (selectedTeam?.isDelivered) {
    return (
      <>
        <TeamHeader />
        <h3 style={{ marginTop: 0 }}>
          Team {selectedTeam.number} have submitted their flower!
        </h3>
        <TeamFlowerDoc />
        {isCurrentPhase && (
          <>
            <p>Do they need to modify it?</p>
            <AsterButton onClick={() => {}}>Mark as undelivered</AsterButton>
          </>
        )}
      </>
    );
  }

  return (
    <div>
      <TeamHeader />
      <TeamFlowerDoc />
      <h3>Additional information</h3>
      <p>Seed: {selectedTeam.seedTitle}</p>
      {<SeedResources seed={teamFlower.seed} isHorizontal includePdf />}
      <AsterButton
        onClick={() => setShowMap(!showMap)}
        style={{ margin: "1rem", width: "10rem" }}
      >
        {showMap ? "Hide" : "Show"} maps
      </AsterButton>
      <DiagramGallery showMap={showMap} seedId={selectedTeam.seedId} />
    </div>
  );
}
