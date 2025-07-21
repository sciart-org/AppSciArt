import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useFetcher from "../../../utils/useFetcher";
import Loading from "../../../components/messages/Loading";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { RiVideoLine } from "react-icons/ri";
import { PiPresentationBold } from "react-icons/pi";
import { MdPodcasts } from "react-icons/md";
import { isValidUrl } from "../../../utils/commonUtils";

import "./css/details.css";
import tokenService from "../../../utils/token.service";

export default function SeedDetails() {
  const params = useParams();
  const [error, setError] = useState(null);
  const [seed, setSeed] = useState(null);
  const [loading, setLoading] = useState(true);

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
    const style = jwt ? {} : { cursor: "default", color: "rgb(200, 200, 200)" };
    const onClick = jwt ? (seed?.isLiked ? unlikeSeed : likeSeed) : () => {};

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

  const getComponentProps = (url) => {
    const style = isValidUrl(url)
      ? {}
      : { cursor: "default", color: "rgb(200, 200, 200)" };
    const onClick = isValidUrl(url)
      ? () => window.open(url, "_blank")
      : () => {};
    return { style, onClick };
  };

  const VideoComponent = () => {
    const { style, onClick } = getComponentProps(seed?.videoLink);
    return (
      <div className="image-text" style={style} onClick={onClick}>
        <RiVideoLine />
        <p>See seed description video</p>
      </div>
    );
  };

  const PresentationComponent = () => {
    const { style, onClick } = getComponentProps(seed?.presentationLink);
    return (
      <div className="image-text" style={style} onClick={onClick}>
        <PiPresentationBold />
        <p style={{ marginTop: 0, marginBottom: 0 }}>See seed presentation</p>
      </div>
    );
  };

  const PodcastComponent = () => {
    const { style, onClick } = getComponentProps(seed?.podcastLink);
    return (
      <div className="image-text" style={style} onClick={onClick}>
        <MdPodcasts />
        <p>See seed description podcast</p>
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
          <div className="seed-resources-container">
            <LikeComponent />
            <p>Resources provided by the Inspiring Scientist(s):</p>
            <VideoComponent />
            <PresentationComponent />
            <PodcastComponent />
          </div>
        </div>
        <div>
          {isValidUrl(seed?.seedPDF) ? (
            <iframe src={seed?.seedPDF} title="SeedPDF" />
          ) : (
            <p>No PDF found for this seed</p>
          )}
        </div>
      </div>
    </div>
  );
}
