import { useNavigate } from "react-router";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import tokenService from "../../../utils/token.service";
import SeedResources from "../components/SeedResources";
import "./details.css";
import RenderUrl from "../../../components/RenderUrl";
import ImageRenderer from "../../../components/ImageRenderer";
import logoSeedBlack from "../../../assets/logoSeedBlack.png";

export default function SeedDetails({ seed, setSeed }) {
  const navigate = useNavigate();

  const likeSeed = () => {
    setSeed({ ...seed, isLiked: true });
  };

  const unlikeSeed = () => {
    setSeed({ ...seed, isLiked: false });
  };

  const LikeComponent = () => {
    const jwt = tokenService.getLocalAccessToken();

    const baseStyle = { width: "30vw", paddingLeft: "5vw" };
    const style = jwt
      ? { ...baseStyle }
      : { ...baseStyle, color: "rgb(200, 200, 200)" };

    const onClick = jwt
      ? seed?.isLiked
        ? unlikeSeed
        : likeSeed
      : () => {
          navigate("/signin");
        };

    if (seed?.isLiked) {
      return (
        <div className="image-text" style={style} onClick={onClick}>
          <FaHeart />
          <p>Unlike this seed</p>
        </div>
      );
    }

    return (
      <div className="image-text" style={style} onClick={onClick}>
        <FaRegHeart />
        <p>Like this seed</p>
      </div>
    );
  };

  return (
    <div>
      <h1 style={{ width: "85vw", marginInline: "auto" }}>{seed?.title}</h1>
      <div className="seed-details-container">
        <div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ImageRenderer
              width={"30vw"}
              image={seed?.mainImage}
              placeholder={logoSeedBlack}
            />
          </div>
          <div>
            <LikeComponent />
            <SeedResources seed={seed} />
          </div>
        </div>
        <RenderUrl url={seed?.seedPDF} />
      </div>
    </div>
  );
}
