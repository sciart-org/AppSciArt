import CreationProcessHeader from "../../../components/CreationProcessHeader";
import RenderUrl from "../../../components/RenderUrl";
import { IoMdOpen } from "react-icons/io";

export default function SeedCreation({ seed }) {
  return (
    <div>
      <CreationProcessHeader>Seed creation</CreationProcessHeader>
      <IoMdOpen
        size={"2vw"}
        style={{ position: "absolute", right: "10vw", cursor: "pointer" }}
        onClick={() => window.open(seed?.template, "_blank")}
      />
      <RenderUrl
        url={seed?.template}
        style={{
          width: "75vw",
          height: "95vh",
          margin: "auto",
          border: "1px solid rgb(200, 200, 200)",
        }}
      />
    </div>
  );
}
