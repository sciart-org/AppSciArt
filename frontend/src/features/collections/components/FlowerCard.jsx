import AsterButton from "../../../components/AsterButton";

export default function FlowerCard({ item: flower }) {
  return (
    <div className="collection-item">
      <h2>{flower.title}</h2>
      <AsterButton to={`/flowers/${flower.id}`}>See more</AsterButton>
    </div>
  );
}
