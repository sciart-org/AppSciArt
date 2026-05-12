import { useState } from "react";
import "./Carousel.css";
import ImageRenderer from "../../../components/ImageRenderer";
import logoFlowerBlack from "../../../assets/logoFlowerBlack.png";
import CarouselContainer from "./CarouselContainer";

const IMAGE_HEIGHT = "40vh";

export default function Carousel({
  allItems,
  small = false,
  onClickItem = () => {},
  loading,
}) {
  const [centerImage, setCenterImage] = useState(0);
  const [animating, setAnimating] = useState(null);

  const noItems = !allItems || allItems.length === 0;

  const handleSlide = (direction) => {
    if (animating) return;
    setAnimating(direction);
    const newImageIndexOffset = direction === "right" ? 1 : -1;
    setTimeout(() => {
      setCenterImage(
        (centerImage + allItems.length + newImageIndexOffset) % allItems.length,
      );
      setAnimating(false);
    }, 500);
  };

  if (!loading && noItems) {
    return (
      <CarouselContainer
        small={small}
        animating={animating}
        handleSlide={handleSlide}
        showButtons={!noItems}
        style={{ height: IMAGE_HEIGHT }}
      >
        <p className="empty-search">No items to display</p>
      </CarouselContainer>
    );
  }

  const shownObjects = [
    allItems[(centerImage - 2 + allItems.length) % allItems.length],
    allItems[(centerImage - 1 + allItems.length) % allItems.length],
    allItems[centerImage],
    allItems[(centerImage + 1) % allItems.length],
    allItems[(centerImage + 2) % allItems.length],
  ];

  const currentEdition = allItems[centerImage];

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
              if (shownObjects[1] === o) handleSlide("left");
              else if (shownObjects[2] === o) onClickItem(o);
              else if (shownObjects[3] === o) handleSlide("right");
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
