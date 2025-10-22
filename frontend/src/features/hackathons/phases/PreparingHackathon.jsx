import Meet from "../../home/components/Meet";

export default function PreparingHackathon({ hackathon }) {
  return (
    <>
      <h2>Welcome! We are getting started...</h2>
      {hackathon.type !== "ON_SITE" && <Meet hackathon={hackathon} />}
    </>
  );
}
