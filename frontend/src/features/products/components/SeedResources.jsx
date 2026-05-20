import { RiVideoLine } from "react-icons/ri";
import { PiPresentationBold } from "react-icons/pi";
import { MdPodcasts } from "react-icons/md";
import { isValidUrl } from "../../../utils/commonUtils";
import "./resources.css";
import Seed from "../../../components/sciartProducts/Seed";

const getComponentProps = (url) => {
  const style = isValidUrl(url)
    ? {}
    : { cursor: "default", color: "var(--aster-light-gray)" };
  const onClick = isValidUrl(url) ? () => window.open(url, "_blank") : () => {};
  return { style, onClick };
};

export default function SeedResources({ seed, isHorizontal, includePdf }) {
  const SeedComponent = ({ link, children }) => {
    const { style, onClick } = getComponentProps(link);
    return (
      <div
        className={`image-text ${isHorizontal ? "horizontal" : ""}`}
        style={style}
        onClick={onClick}
      >
        {children}
      </div>
    );
  };

  const VideoComponent = () => {
    return (
      <SeedComponent link={seed?.videoLink}>
        <RiVideoLine />
        <p>See seed description video</p>
      </SeedComponent>
    );
  };

  const PresentationComponent = () => {
    return (
      <SeedComponent link={seed?.presentationLink}>
        <PiPresentationBold />
        <p style={{ marginTop: 0, marginBottom: 0 }}>See seed presentation</p>
      </SeedComponent>
    );
  };

  const PodcastComponent = () => {
    return (
      <SeedComponent link={seed?.podcastLink}>
        <MdPodcasts />
        <p>See seed description podcast</p>
      </SeedComponent>
    );
  };

  const PdfComponent = () => {
    return (
      <SeedComponent link={seed?.seedPDF}>
        <Seed />
        <p>See seed PDF</p>
      </SeedComponent>
    );
  };

  return (
    <div
      className={`seed-resources-container ${isHorizontal ? "horizontal" : ""}`}
    >
      {!isHorizontal && (
        <p>Resources provided by the Inspiring Scientist(s):</p>
      )}
      {includePdf && <PdfComponent />}
      <VideoComponent />
      <PodcastComponent />
      <PresentationComponent />
    </div>
  );
}
