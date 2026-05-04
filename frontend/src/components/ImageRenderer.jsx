import { useState } from "react";

export default function ImageRenderer({
  image,
  style,
  className,
  width,
  height,
  reserveSpace = true,
  placeholder,
}) {
  const [loaded, setLoaded] = useState(false);

  const bothSpecified = width && height;
  const noneSpecified = !width && !height;
  const onlyWidth = width && !height;

  const containerWidth = bothSpecified
    ? width
    : noneSpecified
      ? "20rem"
      : (width ?? height);

  const containerHeight = bothSpecified
    ? height
    : noneSpecified
      ? "20rem"
      : onlyWidth
        ? loaded
          ? "auto"
          : width
        : (height ?? width);

  if (!image) {
    if (placeholder) {
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
          }}
        >
          <img
            src={placeholder}
            style={{ maxWidth: "100%", maxHeight: "100%", ...style }}
            className={"disable-select" + (className ? ` ${className}` : "")}
          />
        </div>
      );
    }
    if (!reserveSpace) return null;
    return (
      <div
        style={{
          width: containerWidth,
          height: containerHeight,
          minWidth: containerWidth,
          minHeight: containerHeight,
          flexShrink: 0,
          backgroundColor: "#f0f0f0",
        }}
      />
    );
  }

  const img = (
    <img
      src={image instanceof File ? URL.createObjectURL(image) : image}
      style={{
        display: "block",
        maxWidth: width ?? (noneSpecified ? "20rem" : (height ?? "100%")),
        maxHeight: height ?? (noneSpecified ? "20rem" : (width ?? "100%")),
        ...style,
      }}
      className={"disable-select" + (className ? ` ${className}` : "")}
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
        minHeight: loaded && onlyWidth ? 0 : containerHeight,
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
