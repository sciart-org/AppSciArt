import { FaRegUser } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";

export default function Participant(props) {
  const participantProps = {
    style: { ...props.style },
    className: props.className,
    size: "10vw",
    color: "black",
  };
  return (
    <div>
      {props.multiple ? (
        <FaUsers {...participantProps} />
      ) : (
        <FaRegUser {...participantProps} />
      )}
    </div>
  );
}
