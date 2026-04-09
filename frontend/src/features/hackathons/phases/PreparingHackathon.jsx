import { useContext } from "react";
import Meet from "../../home/components/Meet";
import { HackathonContext } from "../components/HackathonContext";

export default function PreparingHackathon() {
  const { hackathon } = useContext(HackathonContext);

  return (
    <>
      <h2>Welcome! We are getting started...</h2>
      {hackathon.type !== "ON_SITE" && <Meet />}
    </>
  );
}
