import { useContext } from "react";
import { HackathonContext } from "../components/HackathonContext";
import "./manageGroups.css";

export default function ManageGroups(props) {
  const { hackathon } = useContext(HackathonContext);
  const exploringGroups = props.exploringGroups;
  
  const enterGroup = (group) => {};
  
  return (
    <div className="manage-groups-grid">
      {exploringGroups?.map((group) => (
        <div
          key={group.id}
          className="manage-groups-card"
          onClick={() => enterGroup(group)}
        >
          <div className="manage-groups-header">
            <h2>Group {group.number}</h2>
            {group.isDelivered && (
              <span className="manage-groups-delivered-badge">✓ Delivered</span>
            )}
          </div>
          
          <p className="manage-groups-seed">{group.seedTitle}</p>
          
          <h4>Members</h4>
          <div className="manage-groups-members">
            {group.members.length === 0 ? (
              <p className="manage-groups-no-members">No members</p>
            ) : (
              group.members.map((m) => (
                <div key={m.id} className="manage-groups-member">
                  <span className="manage-groups-member-name">
                    {m.name} {m.surname}
                  </span>
                  {m.isGroupVoice && (
                    <span className="manage-groups-voice-badge">voice</span>
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