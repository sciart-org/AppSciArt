import { useState } from "react";
import "./Carousel.css";
import { GrCaretNext } from "react-icons/gr";

export default function Carousel() {
  const [firstImage, setFirstImage] = useState(0);
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
      url: "https://i.imgur.com/6nPHtQJ.jpeg",
    },
    {
      id: 5,
      url: "https://i.imgur.com/DZ5Imb2.jpeg",
    },
    {
      id: 6,
      url: "https://i.imgur.com/0JG20Ii.jpeg",
    },
  ];

  const shownObjects = [
    mockObjects[firstImage],
    mockObjects[(firstImage + 1) % mockObjects.length],
    mockObjects[(firstImage + 2) % mockObjects.length],
  ];

  const currentEdition = mockObjects[(firstImage + 1) % mockObjects.length];

  return (
    <>
      <div className="carousel">
        {shownObjects.map((o) => (
          <img src={o.url} className="carousel-image" />
        ))}
        <GrCaretNext
          className="carousel-button left"
          size={"10vh"}
          color="white"
          onClick={() => {
            setFirstImage(
              (firstImage - 1 + mockObjects.length) % mockObjects.length
            );
          }}
        />
        <GrCaretNext
          className="carousel-button right"
          size={"10vh"}
          color="white"
          onClick={() => {
            setFirstImage((firstImage + 1) % mockObjects.length);
          }}
        />
      </div>
      <h3>
        {currentEdition.name} - {currentEdition.year}
      </h3>
    </>
  );
}
