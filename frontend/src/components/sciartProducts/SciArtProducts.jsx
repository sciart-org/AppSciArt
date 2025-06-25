import Flower from "./Flower";
import Fruit from "./Fruit";
import Seed from "./Seed";

export default function SciArtProducts(props) {
  return (
    <div className="items-container" style={{ ...props.style }}>
      <div>
        <Seed />
        <h3>"SciArt Seed"</h3>
      </div>
      <div>
        <Flower />
        <h3>"SciArt Flower"</h3>
      </div>
      <div>
        <Fruit />
        <h3>"SciArt Fruit"</h3>
      </div>
    </div>
  );
}
