import "./Card.css";
import logoSeedBlack from "../assets/logoSeedBlack.png";
import AsterButton from "./AsterButton";

export default function SeedCard(props) {
  const seed = props.seed;

  if (!seed) {
    return <></>;
  }

  return (
    <div
      className="card"
      style={{ height: "12rem", width: "40rem", ...props.style }}
    >
      <div>
        <img
          style={{ height: "10rem" }}
          src={seed?.mainImage || logoSeedBlack}
        />
      </div>
      <div style={{ justifyContent: "center" }}>
        <h2 style={{ textAlign: "center", marginBottom: 0 }}>{seed?.title}</h2>
        <AsterButton style={{ width: "10vw" }} to={`/seeds/${seed?.id}`}>Enter seed</AsterButton>
      </div>
    </div>
  );
}
