import AsterButton from "../../../components/AsterButton";

export default function FlowerCard({ item: flower }) {
  return (
    <div className="collection-item">
      <h2>{flower?.title}</h2>
      <div>
        <img src={flower?.mainImage} />
      </div>
      <div className="collection-item-details">
        <h4>Authors</h4>
        <p>
          {flower?.authors
            ?.map((a) => {
              return a?.name + " " + a?.surname;
            })
            .join(", ")}
        </p>
        <h4>Original seed</h4>
        <p>{flower?.seedName}</p>
      </div>
      <AsterButton to={`/flowers/${flower?.id}`}>See more</AsterButton>
    </div>
  );
}
