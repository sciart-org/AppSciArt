import { useContext, useEffect, useState } from "react";
import { HackathonContext } from "../components/HackathonContext";
import "./manageGroups.css";
import CreationProcessHeader from "../../../components/CreationProcessHeader";
import { DiagramContext } from "../components/diagramming/DiagramContext";
import Diagram from "../components/diagramming/Diagram";
import { Link } from "react-router";
import useFetcher from "../../../utils/useFetcher";
import Loading from "../../../components/messages/Loading";
import GroupSeedResources from "../components/GroupSeedResources";
import AsterButton from "../../../components/buttons/AsterButton";

export default function ManageGroups(props) {
  const { socket, hackathon } = useContext(HackathonContext);
  const exploringGroups = props.exploringGroups;
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupSeed, setGroupSeed] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { fetcher } = useFetcher(error, setError);

  const groupRoom = `${hackathon?.id}/group/${selectedGroup?.id}`;
  const getFullName = (member) => {
    return member.name + " " + member.surname;
  };

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
                group?.members
                  ?.sort((a, b) => getFullName(a).localeCompare(getFullName(b)))
                  .map((m) => (
                    <div key={m.id} className="manage-groups-member">
                      <span className="manage-groups-member-name">
                        {getFullName(m)}
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
    );
  }

  const GoBack = () => {
    return (
      <div style={{ position: "relative", height: 0, width: "10rem" }}>
        <Link
          style={{ position: "absolute", top: "-1rem", left: 0 }}
          onClick={(e) => {
            e.preventDefault();
            setSelectedGroup(null);
          }}
        >
          {"<"} Go back
        </Link>
      </div>
    );
  };

  if (loading) {
    return <Loading />;
  }

  const undeliverGroupMap = async () => {
    await fetcher({
      url: `exploring-groups/${selectedGroup.id}/conceptual-map/reopen?broadcast=ALL`,
      method: "PATCH",
    });
  };

  if (selectedGroup?.isDelivered) {
    return (
      <>
        <GoBack />
        <CreationProcessHeader members={selectedGroup?.members} isGroup={true}>
          Exploring group {selectedGroup.number}
        </CreationProcessHeader>
        <h3 style={{ marginTop: "1rem" }}>
          Group {selectedGroup.number} have submitted their conceptual map!
        </h3>
        <p>Do they need to modify it?</p>
        <AsterButton onClick={undeliverGroupMap}>
          Mark as undelivered
        </AsterButton>
      </>
    );
  }

  return (
    <>
      <GoBack />
      <CreationProcessHeader members={selectedGroup?.members} isGroup={true}>
        Exploring group {selectedGroup.number}
      </CreationProcessHeader>
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
