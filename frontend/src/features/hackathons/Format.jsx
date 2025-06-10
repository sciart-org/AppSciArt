import SciArtProducts from "../../components/sciartProducts/SciArtProducts";
import "./format.css";
import hackathonLogo from "../../assets/mockHackathonLogo.jpg";
import AsterButton from "../../components/AsterButton";

export default function Format() {
  return (
    <div className="format-container">
      <h1>ASTER+S Hackathons</h1>
      <h2>Hackathon objectives</h2>
      <div className="text-container">
        <text>
          The hackathon aims to bring together interdisciplinary teams to
          collaboratively create a SciArt artwork that merges scientific
          concepts with artistic expression.
        </text>
        <text>
          By fostering collaboration and innovation, it seeks to expand the
          SciArt community and encourage participants to explore the
          intersection of these fields.
        </text>
        <text>
          Additionally, the hackathon aspires to bring science closer to
          society, making it more accessible and engaging through the power of
          creativity and art
        </text>
      </div>
      <h2>Our format</h2>
      <SciArtProducts />
      <h3>1. Pre-hackathon</h3>
      <div className="text-container">
        <text>
          In the pre-hackathon phase, participants pre-register and are
          introduced to the scientific seeds — the foundational scientific ideas
          and concepts that will inspire their creations.
        </text>
        <text>
          During this time, participants can explore these seeds in depth,
          reflecting on their potential artistic interpretations.
        </text>
        <text>
          A series of webinars featuring experts in science, art, and
          interdisciplinary collaboration are held to provide insights and
          guidance, setting the stage for creative exploration and preparation.
        </text>
      </div>
      <h3>2. During the hackathon</h3>
      <div className="text-container">
        <text>
          The hackathon begins with participants collaborating to create quick
          conceptual maps of the scientific seeds, brainstorming how these ideas
          could inspire artistic prototypes.
        </text>
        <text>
          Teams are then formed based on shared interests, and they work
          together to develop their flowers — SciArt prototypes that embody the
          fusion of science and art.
        </text>
        <text>
          Over several days, the teams refine their concepts, guided by mentors,
          to produce innovative and impactful prototypes ready for presentation{" "}
        </text>
      </div>
      <h3>3. Post-hackathon</h3>
      <div className="text-container">
        <text>
          Following the hackathon, the completed flowers are evaluated, with the
          best prototypes selected for further development and funding to become
          fruits — fully realized SciArt projects.
        </text>
        <text>
          This phase focuses on supporting the growth of these works, showcasing
          them to a broader audience, and fostering their impact.
        </text>
        <text>
          Additionally, the post-hackathon phase promotes ongoing collaboration,
          encouraging participants to continue expanding the SciArt community
          and bridging the gap between science and society.
        </text>
      </div>
      <div style={{ padding: "5vh" }}>
        <h2>Are you interested in participating?</h2>
        <AsterButton to={"/hackathons"}>
          <text>Check incoming hackathons</text>
        </AsterButton>
      </div>
    </div>
  );
}
