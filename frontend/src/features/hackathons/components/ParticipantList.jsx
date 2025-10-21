import Participant from "../../../components/roles/Participant";

const reorganizeParticipants = (participants) => {
  let participantsLists = [participants];
  if (participants?.length > 4) {
    participantsLists = [];
    for (let i = 0; i < participants?.length; i += 4) {
      participantsLists.push(participants?.slice(i, i + 4));
    }
  }
  return participantsLists;
};

export default function ParticipantList(props) {
  const { participants, participantStyle, fontSize, className } = props;
  const participantsLists = reorganizeParticipants(participants);
  const isGroup = props.isGroup

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {participantsLists?.map((participants) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            {participants?.map((m) => {
              return (
                <div>
                  <Participant style={participantStyle} className={className} />
                  <p style={{ fontSize: fontSize || "1rem", marginBottom: 0 }}>
                    {m.name} {m.surname}
                  </p>
                  <p style={{ fontSize: fontSize || "1rem", marginTop: 0 }}>
                    {isGroup && m?.isGroupVoice && <>(Group voice)</>}
                    {!isGroup && m?.isTeamSpeaker && <>(Team speaker)</>}
                  </p>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
