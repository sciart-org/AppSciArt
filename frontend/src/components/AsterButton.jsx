import { Link, useNavigate } from "react-router";
import "./AsterButton.css";
import { useEffect } from "react";

export default function AsterButton(props) {
  const navigate = useNavigate();

  return (
    <button
      className="aster-button"
      style={{ ...props.style }}
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
