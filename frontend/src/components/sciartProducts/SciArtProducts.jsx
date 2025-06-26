import Flower from "./Flower";
import Fruit from "./Fruit";
import Seed from "./Seed";

export default function SciArtProducts(props) {
  const style = props.fixed ? { width: "10vw" } : { width: "10rem" };
  return (
    <div className="items-container" style={{ ...props.style }}>
      <div>
        <Seed style={style} />
        <h3>"SciArt Seed"</h3>
      </div>
      <div>
        <Flower style={style} />
        <h3>"SciArt Flower"</h3>
      </div>
      <div>
        <Fruit style={style} />
        <h3>"SciArt Fruit"</h3>
      </div>
    </div>
  );
}
