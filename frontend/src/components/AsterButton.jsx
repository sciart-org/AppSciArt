import { Link } from "react-router";
import "./AsterButton.css";

export default function AsterButton(props) {
  return (
    <Link className="aster-button" style={{ ...props.style }} to={props.to} onClick={props.onClick}>
      {props.children}
    </Link>
  );
}
