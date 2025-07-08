import AsterButton from "../../../components/AsterButton";

export default function SeedCard({ item: seed }) {
  return (
    <div className="collection-item">
      <h2>{seed?.title}</h2>
      <div>
        <img src={seed?.mainImage} />
      </div>
      <div className="collection-item-details">
        <h4>Inspiring Scientists</h4>
        <p>
          {seed?.authors
            ?.map((a) => {
              return a?.name + " " + a?.surname;
            })
            .join(", ")}
        </p>
        <h4>Branches of knowledge</h4>
        <p>{seed?.branchesOfKnowledge?.join(", ")}</p>
      </div>
      <AsterButton to={`/seeds/${seed?.id}`}>See more</AsterButton>
    </div>
  );
}
