import { useState } from "react";
import "./Carousel.css";
import { GrCaretNext } from "react-icons/gr";

export default function Carousel() {
  const [centerImage, setCenterImage] = useState(0);
  const [animating, setAnimating] = useState(null);
  const mockObjects = [
    {
      id: 1,
      name: "ASTER+S > ART ^ NEUROSCIENCE",
      year: 2025,
      url: "https://i.imgur.com/EA8mGro.jpeg",
    },
    {
      id: 2,
      name: "ASTER+S > ART ^ SEALIFE",
      year: 2023,
      url: "https://i.imgur.com/IZZd9er.jpeg",
    },
    {
      id: 3,
      name: "ASTER+S > ART ^ ENVIRONMENT & AI",
      year: 2024,
      url: "https://i.imgur.com/egkfGhQ.jpeg",
    },
    {
      id: 4,
      name: "Example title 1",
      year: 1990,
      url: "https://i.imgur.com/6nPHtQJ.jpeg",
    },
    {
      id: 5,
      name: "Example title 2",
      year: 2019,
      url: "https://i.imgur.com/DZ5Imb2.jpeg",
    },
    {
      id: 6,
      name: "Example title 3",
      year: 2026,
      url: "https://i.imgur.com/0JG20Ii.jpeg",
    },
  ];

  const shownObjects = [
    mockObjects[(centerImage - 2 + mockObjects.length) % mockObjects.length],
    mockObjects[(centerImage - 1 + mockObjects.length) % mockObjects.length],
    mockObjects[centerImage],
    mockObjects[(centerImage + 1) % mockObjects.length],
    mockObjects[(centerImage + 2) % mockObjects.length],
  ];

  const currentEdition = mockObjects[centerImage];

  const handleNext = () => {
    setAnimating("left"); // Enable animation
    setTimeout(() => {
      setCenterImage((centerImage + 1) % mockObjects.length);
      setAnimating(false); // Reset animation after transition
    }, 500); // Adjust timeout to match CSS transition duration
  };

  const handlePrev = () => {
    setAnimating("right");
    setTimeout(() => {
      setCenterImage(
        (centerImage - 1 + mockObjects.length) % mockObjects.length
      );
      setAnimating(false);
    }, 500);
  };

  return (
    <>
      <div className="carousel-container">
        <div
          className={animating ? "carousel animating " + animating : "carousel"}
        >
          {shownObjects.map((o) => (
            <div className="image-container">
              <img src={o.url} className="carousel-image" />
            </div>
          ))}
        </div>
        <GrCaretNext
          className="carousel-button left"
          size={"10vh"}
          color="white"
          onClick={handlePrev}
        />
        <GrCaretNext
          className="carousel-button right"
          size={"10vh"}
          color="white"
          onClick={handleNext}
        />
      </div>
      <h3>
        {currentEdition.name} - {currentEdition.year}
      </h3>
    </>
  );
}
