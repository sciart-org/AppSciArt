import { useNavigate } from "react-router";
import "./AsterButton.css";

export default function AsterButton(props) {
  const navigate = useNavigate();

  return (
    <button
      className="aster-button"
      style={{ ...props.style }}
      disabled={props.disabled}
      type={props.type}
      onClick={() => {
        if (props.onClick) {
          props.onClick();
        } else if (props.to) {
          navigate(props.to);
        }
      }}
    >
      {props.children}
    </button>
  );
}
