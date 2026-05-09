import { Link } from "react-router";

export default function GoBack({ onClick }) {
  return (
    <div style={{ position: "relative", height: 0, width: "10rem" }}>
      <Link
        style={{ position: "absolute", top: "-1rem", left: 0 }}
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
      >
        {"<"} Go back
      </Link>
    </div>
  );
}
