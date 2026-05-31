import { GrCaretNext } from "react-icons/gr";

export default function CarouselContainer({
  children,
  small,
  animating,
  handleSlide,
  showButtons,
  style,
}) {
  return (
    <div
      className={small ? "carousel-container small" : "carousel-container"}
      style={style}
    >
      <div
        className={
          animating
            ? small
              ? "carousel animating " + animating + " small"
              : "carousel animating " + animating
            : small
              ? "carousel small"
              : "carousel"
        }
      >
        {children}
      </div>
      {showButtons && (
        <>
          <GrCaretNext
            className={
              small
                ? "disable-select carousel-button left small"
                : "disable-select carousel-button left"
            }
            size={"8vh"}
            onClick={() => handleSlide("left")}
          />
          <GrCaretNext
            className={
              small
                ? "disable-select carousel-button right small"
                : "disable-select carousel-button right"
            }
            size={"8vh"}
            onClick={() => handleSlide("right")}
          />
        </>
      )}
    </div>
  );
}
