import AsterButton from "../../../components/AsterButton";

export default function FruitCard({ item: fruit }) {
  return (
    <div className="collection-item">
      <h2>{fruit.title}</h2>
      <AsterButton to={`/fruits/${fruit.id}`}>See more</AsterButton>
    </div>
  );
}
