import { useState } from "react";
import "./Carousel.css";
import { GrCaretNext } from "react-icons/gr";
import ImageRenderer from "../../../components/ImageRenderer";
import logoFlowerBlack from "../../../assets/logoFlowerBlack.png";

const IMAGE_HEIGHT = "40vh";

const CarouselContainer = ({ children, small, animating, handleSlide }) => {
  return (
    <div
      className={small ? "carousel-container small" : "carousel-container"}
      style={{ height: IMAGE_HEIGHT }}
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
      <GrCaretNext
        className={
          small
            ? "disable-select carousel-button left small"
            : "disable-select carousel-button left"
        }
        size={"10vh"}
        color="rgba(0,0,0,0.35)"
        onClick={() => handleSlide("left")}
      />
      <GrCaretNext
        className={
          small
            ? "disable-select carousel-button right small"
            : "disable-select carousel-button right"
        }
        size={"10vh"}
        color="rgba(0,0,0,0.35)"
        onClick={() => handleSlide("right")}
      />
    </div>
  );
};

export default function Carousel({
  allItems,
  small = false,
  onClickItem = () => {},
  loading,
}) {
  if (!loading && (!allItems || allItems.length === 0)) {
    return (
      <CarouselContainer
        small={small}
        animating={animating}
        handleSlide={handleSlide}
      >
        <p>No items to display</p>
      </CarouselContainer>
    );
  }

  const [centerImage, setCenterImage] = useState(0);
  const [animating, setAnimating] = useState(null);

  const shownObjects = [
    allItems[(centerImage - 2 + allItems.length) % allItems.length],
    allItems[(centerImage - 1 + allItems.length) % allItems.length],
    allItems[centerImage],
    allItems[(centerImage + 1) % allItems.length],
    allItems[(centerImage + 2) % allItems.length],
  ];

  const currentEdition = allItems[centerImage];

  const handleSlide = (direction) => {
    if (animating) return;
    setAnimating(direction);
    const newImageIndexOffset = direction == "right" ? 1 : -1;
    setTimeout(() => {
      setCenterImage(
        (centerImage + allItems.length + newImageIndexOffset) % allItems.length,
      );
      setAnimating(false);
    }, 500);
  };

  return (
    <>
      <CarouselContainer
        small={small}
        animating={animating}
        handleSlide={handleSlide}
      >
        {shownObjects.map((o) => (
          <div
            className={small ? "image-container small" : "image-container"}
            onClick={() => {
              if (shownObjects[1] === o) {
                handleSlide("left");
              } else if (shownObjects[2] === o) {
                onClickItem(o);
              } else if (shownObjects[3] === o) {
                handleSlide("right");
              }
            }}
            style={{ cursor: "pointer" }}
          >
            <ImageRenderer
              image={loading ? undefined : o?.logo}
              placeholder={loading ? undefined : logoFlowerBlack}
              height={IMAGE_HEIGHT}
            />
          </div>
        ))}
      </CarouselContainer>
      <h3 style={{ marginBottom: "-1rem" }}>
        {loading ? "Loading.." : currentEdition?.name}
      </h3>
    </>
  );
}
