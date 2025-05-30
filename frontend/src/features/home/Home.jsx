import React, { useEffect } from "react";
import Carousel from "./components/Carousel.jsx";
import Flower from "../../components/sciartProducts/Flower.jsx";
import Seed from "../../components/sciartProducts/Seed.jsx";
import Fruit from "../../components/sciartProducts/Fruit.jsx";
import InspiringScientist from "./components/InspiringScientist.jsx";
import Participant from "./components/Participant.jsx";
import AsterButton from "../../components/AsterButton.jsx";
import HackathonCard from "../../components/HackathonCard.jsx";
import "./css/Home.css";

function SciArtItems() {
  return (
    <>
      <div className="items-container">
        <div>
          <Seed />
          <h3>"SciArt Seed"</h3>
        </div>
        <div>
          <Flower />
          <h3>"SciArt Flower"</h3>
        </div>
        <div>
          <Fruit />
          <h3>"SciArt Fruit"</h3>
        </div>
      </div>
      <div className="roles-container">
        <div>
          <InspiringScientist />
          <h3>Inspiring Scientists</h3>
        </div>
        <div>
          <Participant />
          <h3>Participants</h3>
        </div>
      </div>
    </>
  );
}

function MoreInfoSection() {
  return (
    <>
      <h2>Want to dive deeper into the process?</h2>
      <div>
        <AsterButton to={"/about"}>
          <text>Find all the details here</text>
        </AsterButton>
      </div>
    </>
  );
}

function QuickRegisterSection() {
  return (
    <div>
      <h2>
        Do you want to participate and create science-inspired art,
        collaborating with minds from diverse disciplines to bring innovative
        ideas to life?
      </h2>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <input
          placeholder="Enter your email here..."
          style={{ width: "30vw", padding: "5px" }}
        />
        <AsterButton style={{ marginLeft: "1vw", width: "10vw" }}>
          <text>Join now!</text>
        </AsterButton>
      </div>
      <text>Check your inbox for the next steps</text>
    </div>
  );
}

function NextEvent() {
  return (
    <div style={{ justifyItems: "center", display: "inline-block" }}>
      <h2 style={{ textAlign: "start" }}>Next event</h2>
      <HackathonCard />
    </div>
  );
}

export default function Home() {
  return (
    <div className="home">
      <Carousel />
      <h1 style={{ marginTop: 0 }}>This is SciArt</h1>
      <SciArtItems />
      <hr />
      <MoreInfoSection />
      <hr />
      <QuickRegisterSection />
      <NextEvent />
    </div>
  );
}
