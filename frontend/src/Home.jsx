import React from "react";
import Carousel from "./components/Carousel.jsx";
import Flower from "./components/Flower.jsx";
import Seed from "./components/Seed.jsx";
import Fruit from "./components/Fruit.jsx";
import { FaUser } from "react-icons/fa";

export default function Home() {
  const AsterItems = () => {
    return (
      <>
        <div style={{ display: "flex", marginTop: "2vh" }}>
          <div style={{ flex: 1 }}>
            <Seed />
            <h3>"SciArt Seed"</h3>
          </div>
          <div style={{ flex: 1 }}>
            <Flower />
            <h3>"SciArt Flower"</h3>
          </div>
          <div style={{ flex: 1 }}>
            <Fruit />
            <h3>"SciArt Fruit"</h3>
          </div>
        </div>
      </>
    );
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Carousel />
      <h1 style={{ marginTop: 0 }}>This is SciArt</h1>
      <AsterItems />
    </div>
  );
}
