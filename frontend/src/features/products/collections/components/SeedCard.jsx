import AsterButton from "../../../../components/buttons/AsterButton";
import ImageRenderer from "../../../../components/ImageRenderer";
import logoSeedBlack from "../../../../assets/logoSeedBlack.png";

export default function SeedCard({ item: seed }) {
  return (
    <div className="collection-item">
      <h2>{seed?.title}</h2>
      <div>
        <ImageRenderer
          image={seed?.mainImage}
          placeholder={logoSeedBlack}
          height={"18rem"}
        />
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
