import "./Card.css";
import logoSeedBlack from "../../assets/logoSeedBlack.png";
import AsterButton from "../buttons/AsterButton";
import ImageRenderer from "../ImageRenderer";

export default function ScientistSeedCard(props) {
  const seed = props.seed;

  if (!seed) {
    return <></>;
  }

  return (
    <div
      className="card"
      style={{ height: "12rem", width: "40rem", ...props.style }}
    >
        <ImageRenderer
          image={seed?.mainImage}
          placeholder={logoSeedBlack}
          height={"10rem"}
        />
      <div style={{ justifyContent: "center" }}>
        <h2 style={{ textAlign: "center", marginBottom: 0 }}>{seed?.title}</h2>
        <AsterButton style={{ width: "10vw" }} to={`/seeds/${seed?.id}`}>Enter seed</AsterButton>
      </div>
    </div>
  );
}
