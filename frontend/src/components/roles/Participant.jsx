import { FaRegUser } from "react-icons/fa";

export default function Participant(props) {
  return (
    <div>
      <FaRegUser
        style={{ ...props.style }}
        className={props.className}
        size={"10vw"}
        color="black"
      />
    </div>
  );
}
