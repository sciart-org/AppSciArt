import { RiVideoLine } from "react-icons/ri";
import { PiPresentationBold } from "react-icons/pi";
import { MdPodcasts } from "react-icons/md";
import { isValidUrl } from "../../../utils/commonUtils";
import "./resources.css";

const getComponentProps = (url) => {
  const style = isValidUrl(url)
    ? {}
    : { cursor: "default", color: "rgb(200, 200, 200)" };
  const onClick = isValidUrl(url) ? () => window.open(url, "_blank") : () => {};
  return { style, onClick };
};

export default function SeedResources({ seed }) {
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

  return (
    <div className="seed-resources-container">
      <p>Resources provided by the Inspiring Scientist(s):</p>
      <VideoComponent />
      <PresentationComponent />
      <PodcastComponent />
    </div>
  );
}
