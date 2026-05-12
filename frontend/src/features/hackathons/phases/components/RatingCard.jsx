import StarRating from "../../../../components/buttons/StarRating";
import ImageRenderer from "../../../../components/ImageRenderer";
import Seed from "../../../../components/sciartProducts/Seed";
import logoSeedBlack from "../../../../assets/logoSeedBlack.png";

export default function RatingCard({ item, setRatingItems }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ImageRenderer
          image={item.mainImage}
          style={{ maxHeight: "30vh" }}
          placeholder={logoSeedBlack}
        />
      </div>
      <p style={{ width: "20rem", marginInline: "auto" }}>{item.title}</p>
      <div className="rating-card-content">
        <div
          onClick={() => window.open(`/seeds/${item.id}`, "_blank")}
          style={{ cursor: "pointer" }}
        >
          <Seed style={{ width: "3rem" }} />
        </div>
        <StarRating
          onChange={(newRating) => {
            setRatingItems((prevItems) =>
              prevItems.map((ri) =>
                ri.id === item.id ? { ...ri, rating: newRating } : ri,
              ),
            );
          }}
        />
        <div style={{ width: "3rem" }} />
      </div>
    </div>
  );
}
