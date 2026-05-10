import { FaRegUser, FaUsers } from "react-icons/fa";

export default function Participant(props) {
  const Icon = props.multiple ? FaUsers : FaRegUser;
  return (
    <div className={props.className} style={props.style}>
      <Icon size="100%" color="black" />
    </div>
  );
}
