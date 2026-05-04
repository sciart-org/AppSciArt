const getGroupRatings = (ratings, seedId) =>
  Object.values(ratings)
    .flatMap((r) => r.filter((ri) => ri.seedId === seedId))
    .map((ri) => ri.rating);

const getAverage = (ratings) =>
  ratings.length
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
    : null;

const getSubmissionCount = (ratings, seedId) =>
  Object.values(ratings).filter((r) => r.some((ri) => ri.seedId === seedId))
    .length;

export default function RatingCard({ group, ratings }) {
  const groupRatings = getGroupRatings(ratings, group.seedId);
  const avg = getAverage(groupRatings);
  const submitted = getSubmissionCount(ratings, group.seedId);

  return (
    <div className="manage-groups-card">
      <div className="manage-groups-header">
        <h2>Group {group.number}</h2>
        <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
          {avg ?? "—"}{" "}
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: "normal",
              color: "#666",
            }}
          >
            / 5
          </span>
        </span>
      </div>
      <p className="manage-groups-seed">{group.seedTitle}</p>
      <h4>{submitted} ratings</h4>
      <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
        {groupRatings.map((r, i) => (
          <span
            key={i}
            style={{
              background: "#f0f0f0",
              borderRadius: "0.25rem",
              padding: "0.2rem 0.6rem",
            }}
          >
            {r}
          </span>
        ))}
      </div>
    </div>
  );
}
