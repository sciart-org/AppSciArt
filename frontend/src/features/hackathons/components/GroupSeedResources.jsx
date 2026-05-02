import RenderUrl from "../../../components/RenderUrl";
import SeedResources from "../../products/components/SeedResources";

export default function GroupSeedResources({ pdf, seed }) {
  return (
    <div style={{ flex: 1 }}>
      <RenderUrl url={pdf} style={{ margin: "1rem 0" }} />
      <SeedResources seed={seed} style={{ marginLeft: 0 }} />
    </div>
  );
}
