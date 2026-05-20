import RedirectButton from "../../../components/buttons/RedirectButton";
import CreationProcessHeader from "../../../components/CreationProcessHeader";
import RenderUrl from "../../../components/RenderUrl";

export default function SeedCreation({ seed }) {
  return (
    <div>
      <CreationProcessHeader>Seed creation</CreationProcessHeader>
      <RedirectButton
        style={{ position: "absolute", right: "10vw", cursor: "pointer" }}
        url={seed?.template}
      />
      <RenderUrl
        url={seed?.template}
        style={{
          width: "75vw",
          height: "95vh",
          margin: "auto",
          border: "1px solid var(--aster-light-gray)",
        }}
      />
    </div>
  );
}
