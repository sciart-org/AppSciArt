import AsterLink from "../../../../components/buttons/AsterLink";

export default function GoBack({ onClick }) {
  return (
    <div style={{ position: "relative", height: 0, width: "10rem" }}>
      <AsterLink
        style={{ position: "absolute", top: "-2rem", left: "1rem" }}
        onClick={onClick}
      >
        {"<"} Go back
      </AsterLink>
    </div>
  );
}
