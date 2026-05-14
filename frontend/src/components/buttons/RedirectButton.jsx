import { IoMdOpen } from "react-icons/io";

export default function RedirectButton({ style, url }) {
  return (
    <IoMdOpen
      size={"2vw"}
      style={style}
      onClick={() => window.open(url, "_blank")}
    />
  );
}
