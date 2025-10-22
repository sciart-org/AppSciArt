import { isValidUrl } from "../utils/commonUtils";
import "./RenderUrl.css";

export default function RenderUrl({ url, style }) {
  return (
    <div>
      {isValidUrl(url) ? (
        <iframe src={url} className="iframe" style={style} />
      ) : (
        <p>No URL found</p>
      )}
    </div>
  );
}
