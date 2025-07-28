import { useState } from "react";
import "../css/Carousel.css";
import { GrCaretNext } from "react-icons/gr";

export default function Carousel({
  mocked,
  allItems,
  small = false,
  onClickIem = () => {},
}) {
  const [centerImage, setCenterImage] = useState(0);
  const [animating, setAnimating] = useState(null);
  const mockObjects = [
    {
      id: 1,
      text: "ASTER+S > ART ^ NEUROSCIENCE - 2025",
      image:
        "https://drive.google.com/thumbnail?id=1_DUOT1fdH2Osrnfx7Ua5-YMLaswmBGwh&sz=s4000",
    },
    {
      id: 2,
      text: "ASTER+S > ART ^ SEALIFE - 2023",
      image:
        "https://drive.google.com/thumbnail?id=1csVlBreYkkey1NkDyxE0VnWZJToG7geP&sz=s4000",
    },
    {
      id: 3,
      text: "ASTER+S > ART ^ ENVIRONMENT & AI - 2024",
      image:
        "https://drive.google.com/thumbnail?id=1nntzSuxqmzgW6-DCsHyp1FgqWpZH_MHX&sz=s4000",
    },
    {
      id: 4,
      text: "Example title 1",
      image: "https://i.imgur.com/6nPHtQJ.jpeg",
    },
    {
      id: 5,
      text: "Example title 2",
      image: "https://i.imgur.com/DZ5Imb2.jpeg",
    },
    {
      id: 6,
      text: "Example title 3",
      image: "https://i.imgur.com/0JG20Ii.jpeg",
    },
  ];

  const shownObjects = mocked
    ? [
        mockObjects[
          (centerImage - 2 + mockObjects.length) % mockObjects.length
        ],
        mockObjects[
          (centerImage - 1 + mockObjects.length) % mockObjects.length
        ],
        mockObjects[centerImage],
        mockObjects[(centerImage + 1) % mockObjects.length],
        mockObjects[(centerImage + 2) % mockObjects.length],
      ]
    : [
        allItems[(centerImage - 2 + allItems.length) % allItems.length],
        allItems[(centerImage - 1 + allItems.length) % allItems.length],
        allItems[centerImage],
        allItems[(centerImage + 1) % allItems.length],
        allItems[(centerImage + 2) % allItems.length],
      ];

  const currentEdition = mocked
    ? mockObjects[centerImage]
    : allItems[centerImage];

  const handleSlide = (direction) => {
    if (animating) return;
    setAnimating(direction);
    const newImageIndexOffset = direction == "right" ? 1 : -1;
    setTimeout(() => {
      setCenterImage(
        mocked
          ? (centerImage + mockObjects.length + newImageIndexOffset) %
              mockObjects.length
          : (centerImage + allItems.length + newImageIndexOffset) %
              allItems.length
      );
      setAnimating(false);
    }, 500);
  };

  return (
    <>
      <div
        className={small ? "carousel-container small" : "carousel-container"}
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
          {shownObjects.map((o) => (
            <div
              className={small ? "image-container small" : "image-container"}
              onClick={() => onClickIem(o)}
            >
              <img src={o.image} className="carousel-image" />
            </div>
          ))}
        </div>
        <GrCaretNext
          className={
            small ? "carousel-button left small" : "carousel-button left"
          }
          size={"10vh"}
          color="white"
          onClick={() => handleSlide("left")}
        />
        <GrCaretNext
          className={
            small ? "carousel-button right small" : "carousel-button right"
          }
          size={"10vh"}
          color="white"
          onClick={() => handleSlide("right")}
        />
      </div>
      <h3>{currentEdition.text}</h3>
    </>
  );
}
