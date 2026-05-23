import { useContext, useEffect, useState } from "react";
import { HackathonContext } from "../components/HackathonContext";
import "./ManagePresentations.css";
import CreationProcessHeader from "../../../components/CreationProcessHeader";
import { DiagramContext } from "../components/diagramming/DiagramContext";
import Diagram from "../components/diagramming/Diagram";
import useFetcher from "../../../utils/useFetcher";
import Loading from "../../../components/messages/Loading";
import GroupSeedResources from "../components/GroupSeedResources";
import AsterButton from "../../../components/buttons/AsterButton";
import ConfirmPhaseChangeModal from "./components/ConfirmPhaseChangeModal";
import GoBack from "./components/GoBack";
import {
  getFullUserName,
  sortUsersBySurname,
} from "../../../utils/commonUtils";

export default function ManageGroups() {
  const {
    socket,
    hackathon,
    handleNextPhase,
    exploringGroups,
    isEvaluatorOfHackathon,
  } = useContext(HackathonContext);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupSeed, setGroupSeed] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const { fetcher } = useFetcher(error, setError);

  const isCurrentPhase = hackathon.phase === "GROUP_WORK";

  const groupRoom = `${hackathon?.id}/group/${selectedGroup?.id}`;

  useEffect(() => {
    if (!socket || !selectedGroup?.id) return;
    socket.emit("join_room", groupRoom);
    return () => socket.emit("leave_room", groupRoom);
  }, [socket, selectedGroup?.id]);

  useEffect(() => {
    if (!selectedGroup || !selectedGroup.seedId) return;

    fetcher({
      url: `seeds/${selectedGroup.seedId}`,
      onSuccess: (data) => {
        setGroupSeed(data);
      },
    }).finally(() => setLoading(false));
  }, [selectedGroup]);

  useEffect(() => {
    if (!selectedGroup) return;
    const updated = exploringGroups?.find((g) => g.id === selectedGroup.id);
    if (updated) setSelectedGroup(updated);
  }, [exploringGroups]);

  if (!selectedGroup) {
    return (
      <>
        <h2>Groups follow-up</h2>
        <ConfirmPhaseChangeModal
          openCondition={openModal && !isEvaluatorOfHackathon}
          onConfirm={() => {
            if (isEvaluatorOfHackathon) return;
            setOpenModal(false);
            handleNextPhase();
          }}
          onCancel={() => setOpenModal(false)}
        >
          <p>
            All conceptual maps will be locked and no more changes will be
            allowed. Participants will present their conceptual maps.
          </p>
        </ConfirmPhaseChangeModal>
        <div className="manage-groups-grid">
          {exploringGroups?.map((group) => (
            <div
              key={group.id}
              className="manage-groups-card"
              onClick={() => setSelectedGroup(group)}
            >
              <div className="manage-groups-header">
                <h2>Group {group.number}</h2>
                {group.isDelivered && (
                  <span className="manage-groups-delivered-badge">
                    ✓ Delivered
                  </span>
                )}
              </div>

              <p className="manage-groups-seed">{group.seedTitle}</p>

              <h4>Members</h4>
              <div className="manage-groups-members">
                {group?.members?.length === 0 ? (
                  <p className="manage-groups-no-members">No members</p>
                ) : (
                  sortUsersBySurname(group?.members)?.map((m) => (
                    <div key={m.id} className="manage-groups-member">
                      <span className="manage-groups-member-name">
                        {getFullUserName(m)}
                      </span>
                      {m.isGroupVoice && (
                        <span className="manage-groups-voice-badge">
                          Group voice
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
              {`${exploringGroups.filter((g) => g.isDelivered).length} / ${exploringGroups.length} conceptual maps `}
              delivered
            </p>
            {!isEvaluatorOfHackathon && (
              <AsterButton onClick={() => setOpenModal(true)}>
                Start presentations
              </AsterButton>
            )}
          </>
        )}
      </>
    );
  }

  if (loading) {
    return <Loading />;
  }

  const undeliverGroupMap = async () => {
    if (isEvaluatorOfHackathon) return;
    await fetcher({
      url: `exploring-groups/${selectedGroup.id}/conceptual-map/reopen?broadcast=ALL`,
      method: "PATCH",
    });
  };

  const GroupHeader = () => {
    return (
      <>
        <GoBack
          onClick={() => {
            setSelectedGroup(null);
            setEdges([]);
            setNodes([]);
            setGroupSeed(null);
            setLoading(true);
          }}
        />
        <CreationProcessHeader
          members={selectedGroup?.members}
          scientists={groupSeed.authors}
          isGroup={true}
        >
          Exploring group {selectedGroup.number}
        </CreationProcessHeader>
      </>
    );
  };

  if (selectedGroup?.isDelivered) {
    return (
      <>
        <GroupHeader />
        <h3 style={{ marginTop: 0 }}>
          Group {selectedGroup.number} have submitted their conceptual map!
        </h3>
        <div style={{ flex: 1 }}>
          <DiagramContext value={{ nodes, edges, setNodes, setEdges }}>
            <Diagram
              socket={socket}
              room={groupRoom}
              editionMode={false}
              style={{ width: "70vw" }}
            />
          </DiagramContext>
        </div>
        {isCurrentPhase && !isEvaluatorOfHackathon && (
          <>
            <p>Do they need to modify it?</p>
            <AsterButton onClick={undeliverGroupMap}>
              Mark as undelivered
            </AsterButton>
          </>
        )}
      </>
    );
  }

  return (
    <>
      <GroupHeader />
      <div style={{ display: "flex" }}>
        <GroupSeedResources pdf={groupSeed?.seedPDF} seed={groupSeed} />
        <div style={{ flex: 1 }}>
          <DiagramContext value={{ nodes, edges, setNodes, setEdges }}>
            <Diagram socket={socket} room={groupRoom} editionMode={false} />
          </DiagramContext>
        </div>
      </div>
    </>
  );
}
