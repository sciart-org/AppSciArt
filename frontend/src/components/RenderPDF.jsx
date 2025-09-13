import { isValidUrl } from "../utils/commonUtils";
import "./RenderPDF.css";

export default function RenderPDF({ pdfUrl, style }) {
  return (
    <div style={style}>
      {isValidUrl(pdfUrl) ? (
        <iframe src={pdfUrl} className="pdf" title="PDF" />
      ) : (
        <p>No PDF found</p>
      )}
    </div>
  );
}
