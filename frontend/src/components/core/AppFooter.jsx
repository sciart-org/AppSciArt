import logoAstersBlack from "../../assets/logoAstersBlack.png";
import SocialNetworks from "../SocialNetworks";
import "./core.css";

export default function AppFooter() {
  return (
    <div id="footer">
      <div>
        <img src={logoAstersBlack} style={{ height: "15rem" }} />
      </div>
      <div className="footer-text-container">
        <h2 style={{ marginBottom: 0, textAlign: "start" }}>
          The ASTER+S Project
        </h2>
        <p>
          This project is led by a dedicated team from Art the Science, a group
          of SciArt researchers and creators in Seville, Spain. As our
          commitment to support the SciArt community, we provide a platform for
          creators working within this emerging genre to share their practice
          with an international audience.
          <br /> The content of our project is divided into four main
          categories:
          <br /> · Artists
          <br /> · Creations
          <br /> · Resources
          <br /> · Hackathon
          <br /> · Impact
        </p>
      </div>
      <SocialNetworks />
    </div>
  );
}
