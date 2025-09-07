import AsterButton from "../../../../components/AsterButton";
import Participant from "../../../../components/roles/Participant";

export default function CreatedGroups({ participation }) {
  return (
    <>
      <h2>
        Now, you will work in groups to get familiar with the scientific seeds.
      </h2>
      <h3 style={{ marginBottom: "1rem", marginTop: "2rem" }}>
        Groups have been created! Your group will discover the seed:
      </h3>
      <h3 style={{ marginTop: 0 }}>{participation?.groupSeed?.title}</h3>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {participation?.groupMembers?.map((m) => {
          return (
            <div style={{ margin: "2rem" }}>
              <Participant />
              <p>
                {m.name} {m.surname}
              </p>
            </div>
          );
        })}
      </div>
      <AsterButton to={`groups/${participation?.groupSeed?.id}`}>
        <p>Enter exploring group</p>
      </AsterButton>
    </>
  );
}
