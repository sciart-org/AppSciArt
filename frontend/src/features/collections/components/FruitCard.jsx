import AsterButton from "../../../components/AsterButton";

export default function FruitCard({ item: fruit }) {
  return (
    <div className="collection-item">
      <h2>{fruit?.title}</h2>
      <div>
        <img src={fruit?.mainImage} />
      </div>
      <div className="collection-item-details">
        <h4>Authors</h4>
        <p>
          {fruit?.authors
            ?.map((a) => {
              return a?.name + " " + a?.surname;
            })
            .join(", ")}
        </p>
        <h4>Original seed</h4>
        <p>{fruit?.seedName}</p>
      </div>
      <AsterButton to={`/fruits/${fruit?.id}`}>See more</AsterButton>
    </div>
  );
}
