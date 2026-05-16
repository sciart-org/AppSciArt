import { useContext } from "react";
import { HackathonContext } from "../../components/HackathonContext";
import StarRating from "../../../../components/buttons/StarRating";
import "./ParticipantRatings.css";

export default function ParticipantRatings({ userRatings }) {
  const { hackathonSeeds } = useContext(HackathonContext);

  if (!userRatings) return <></>;

  const seedsRated = userRatings
    .map((rating) => {
      const ratedSeedTitle = hackathonSeeds.find(
        (h) => h.id === rating.seedId,
      ).title;
      return {
        ...rating,
        seedTitle: ratedSeedTitle,
      };
    })
    .sort((a, b) => Number(b.rating) - Number(a.rating));

  return (
    <div className="ratings-container">
      {seedsRated.slice(0, 3).map((r) => (
        <div>
          <p style={{ margin: 0 }}>{`${r.seedTitle}: `}</p>
          <StarRating
            initialRating={r.rating}
            style={{ position: "relative" }}
            modifiable={false}
          />
        </div>
      ))}
    </div>
  );
}
