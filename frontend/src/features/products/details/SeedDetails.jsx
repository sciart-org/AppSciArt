import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useFetcher from "../../../utils/useFetcher";
import Loading from "../../../components/messages/Loading";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

import "./css/details.css";
import tokenService from "../../../utils/token.service";
import SeedResources from "../components/SeedResources";
import RenderPDF from "../../../components/RenderPDF";

export default function SeedDetails() {
  const params = useParams();
  const [error, setError] = useState(null);
  const [seed, setSeed] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const { fetcher } = useFetcher(error, setError);

  const fetchSeed = async () => {
    await fetcher({
      url: `seeds/${params.seedId}`,
      onSuccess: (data) => {
        setSeed(data);
      },
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchSeed();
  }, []);

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

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1>{seed?.title}</h1>
      <div className="seed-details-container">
        <div>
          <img src={seed?.mainImage} />
          <div>
            <LikeComponent />
            <SeedResources seed={seed} />
          </div>
        </div>
        <RenderPDF pdfUrl={seed?.seedPDF} />
      </div>
    </div>
  );
}
