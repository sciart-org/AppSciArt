import CreationProcessHeader from "../../../components/CreationProcessHeader";
import RenderUrl from "../../../components/RenderUrl";

export default function SeedCreation({ seed }) {
  return (
    <div>
      <CreationProcessHeader>Seed creation</CreationProcessHeader>
      <RenderUrl
        url={seed?.template}
        style={{ width: "75vw", height: "95vh", margin: "auto" }}
      />
    </div>
  );
}
