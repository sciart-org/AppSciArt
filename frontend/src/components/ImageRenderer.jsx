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

  const bothSpecified = width && height;
  const noneSpecified = !width && !height;
  const oneSpecified = !bothSpecified && !noneSpecified;

  const containerWidth = bothSpecified
    ? width
    : noneSpecified
      ? "20rem"
      : (width ?? height);
  const containerHeight = bothSpecified
    ? height
    : noneSpecified
      ? "20rem"
      : (height ?? width);

  const img = (
    <img
      src={image instanceof File ? URL.createObjectURL(image) : image}
      style={{
        display: "block",
        maxWidth: noneSpecified ? "20rem" : (width ?? height),
        maxHeight: noneSpecified ? "20rem" : (height ?? width),
        ...style,
        ...(bothSpecified && { width, height }),
      }}
      className={className}
      referrerPolicy="no-referrer"
      onLoad={() => setLoaded(true)}
      onError={(e) => {
        e.target.style.display = "none";
      }}
    />
  );

  if (!reserveSpace) return img;

  return (
    <div
      style={{
        width: containerWidth,
        height: containerHeight,
        minWidth: containerWidth,
        minHeight: containerHeight,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: loaded ? "transparent" : "#f0f0f0",
        animation: loaded ? "none" : "pulse 2s ease-in-out infinite",
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
