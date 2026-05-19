import Flower from "../../../../components/sciartProducts/Flower";
import { getFullUserName } from "../../../../utils/commonUtils";

const SeedFlowerTitles = ({ flowerTitle, seedTitle }) => {
  return (
    <div
      style={{
        display: "flex",
        textAlign: "start",
      }}
    >
      <div style={{ flex: 1 }}>
        <h3 style={{ marginBottom: 0 }}>Flower:</h3>
        <h3 style={{ fontWeight: "unset" }}>{flowerTitle ?? "No title yet"}</h3>
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ marginBottom: 0 }}>Original seed:</h3>
        <h3 style={{ fontWeight: "unset" }}>{seedTitle}</h3>
      </div>
    </div>
  );
};

const SeedFlowerAuthors = ({ flowerAuthors, seedScientists }) => {
  return (
    <div
      style={{
        display: "flex",
        textAlign: "start",
      }}
    >
      <div style={{ flex: 1 }}>
        <h3>Authors:</h3>
        {flowerAuthors?.map((m) => {
          return <h3 className="member-name">{getFullUserName(m)}</h3>;
        })}
      </div>
      <div style={{ flex: 1 }}>
        <h3>Scientists:</h3>
        {seedScientists?.map((m) => {
          return <h3 className="member-name">{getFullUserName(m)}</h3>;
        })}
      </div>
    </div>
  );
};

export default function FlowerPresentationCard({
  flowerTitle,
  seedTitle,
  flowerAuthors,
  seedScientists,
}) {
  return (
    <div className="team-presentation-container">
      <Flower style={{ height: "50vh", marginRight: "2rem" }} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <SeedFlowerTitles flowerTitle={flowerTitle} seedTitle={seedTitle} />
        <SeedFlowerAuthors
          flowerAuthors={flowerAuthors}
          seedScientists={seedScientists}
        />
      </div>
    </div>
  );
}
