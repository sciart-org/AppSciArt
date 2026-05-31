import Seed from "../../../components/sciartProducts/Seed";
import Flower from "../../../components/sciartProducts/Flower";
import Fruit from "../../../components/sciartProducts/Fruit";
import AsterButton from "../../../components/buttons/AsterButton";
import "../EditionDetails.css";

export default function EditionCollectionButtons({ editionId }) {
  return (
    <>
      <h2>Explore all collections</h2>
      <div className="edition-collections-container">
        <AsterButton to={`/seeds?editionId=${editionId}`}>
          <Seed style={{ width: "10rem" }} />
          <p>Seeds</p>
        </AsterButton>
        <AsterButton to={`/flowers?editionId=${editionId}`}>
          <Flower style={{ width: "10rem" }} />
          <p>Flowers</p>
        </AsterButton>
        <AsterButton to={`/fruits?editionId=${editionId}`}>
          <Fruit style={{ width: "10rem" }} />
          <p>Fruits</p>
        </AsterButton>
      </div>
    </>
  );
}
