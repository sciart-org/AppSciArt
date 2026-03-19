import { useState } from "react";

export default function ImageRenderer({
  image,
  style,
  className,
  width,
  height,
  reserveSpace = true,
}) {
  const [loaded, setLoaded] = useState(false);

  if (!image) return null;

  const img = (
    <img
      src={image instanceof File ? URL.createObjectURL(image) : image}
      style={{ maxWidth: "20rem", maxHeight: "20rem", ...style, width, height }}
      className={className}
      referrerPolicy="no-referrer"
      onLoad={() => setLoaded(true)}
      onError={(e) => {
        e.target.style.display = "none";
      }}
    />
  );

  if (!reserveSpace || loaded) return img;

  return (
    <div
      style={{
        minWidth: width,
        minHeight: height,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        animation: "pulse 2s ease-in-out infinite",
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      {img}
    </div>
  );
}
