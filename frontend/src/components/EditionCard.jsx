import AsterButton from "./AsterButton";
import "./Card.css";

export default function EditionCard(props) {
  const edition = props.edition;

  return (
    <div className="card" style={{ ...props.style }}>
      <div>
        <img src={edition?.logo} />
      </div>
      <div>
        <div style={{ width: "100%", textAlign: "center" }}>
          <h2 style={{ marginBottom: 0 }}>{edition?.name}</h2>
          <h3 style={{ marginTop: 0 }}>{edition?.year}</h3>
          <p className="long-text">{edition?.shortDescription}</p>
        </div>
        <AsterButton to={`/editions/${edition?.id}`}>Know more</AsterButton>
      </div>
    </div>
  );
}
