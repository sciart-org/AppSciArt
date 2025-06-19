import React, { useState } from "react";
import tokenService from "../../utils/token.service";
import AsterButton from "../../components/AsterButton";
import Providers from "./components/Providers";
import HackathonCard from "../../components/HackathonCard.jsx";
import { IoChevronBack } from "react-icons/io5";
import RegistrationForm from "./components/RegistrationForm.jsx";
import "./auth.css";

import hackathonLogo from "../../assets/mockHackathonLogo.jpg";

const mockHackathon = {
  editionName: "GreenTech Berlin 2025",
  logo: hackathonLogo,
  startDate: new Date("2025-08-01"),
  endDate: new Date("2025-08-03"),
  type: "ON_SITE",
  location:
    "University of Arts Linz, Hauptplatz 8, Lecture Theater, 4th Floor (Altenberger Str. 69, 4040 Linz, Austria)",
  description:
    "Explore the boundaries of art and science around the brain and cognition, developing new ways to understand the human mind",
  isVisible: true,
  meetLink: null,
};

export default function Register(props) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [error, setError] = useState(null);
  const refreshSession = props.refreshSession;

  const [justRegistered, setJustRegistered] = useState(false);
  const [maybeLater, setMaybeLater] = useState(false);

  const itemsToLowerCase = (list) => {
    if (list === null) return null;
    return list.map((v) => v.toLowerCase());
  };

  const signUp = ({ method }) => {
    fetch(`${API_URL}/register?method=${method}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        affiliations: itemsToLowerCase(formData.affiliations),
        areasOfInterest: itemsToLowerCase(formData.areasOfInterest),
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (!data.error) {
          setFormData({
            email: null,
            password: null,
            name: null,
            surname: null,
            gender: null,
            birthDate: null,
          });
          setError(null);
          tokenService.updateLocalAccessToken(data.jwt);
          tokenService.setUser(data);
          refreshSession();
          setJustRegistered(true);
        } else {
          setError(data.error);
        }
      })
      .catch((error) => setError(error));
  };

  if (justRegistered && maybeLater) {
    return (
      <div>
        <h1>You registered successfully</h1>
        <h2>What now?</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            margin: "10vh",
          }}
        >
          <div>
            <h3>Looking for past examples?</h3>
            <AsterButton to={"/editions"}>
              <text>Our editions</text>
            </AsterButton>
          </div>
          <div>
            <h3>Need more information?</h3>
            <AsterButton to={"/about-the-hackathon"}>
              <text>Our format</text>
            </AsterButton>
          </div>
        </div>
        <div
          className="redirect-buttons-container"
          onClick={() => setMaybeLater(false)}
        >
          <IoChevronBack size={"3.25vh"} />
          <text style={{ fontSize: "larger" }}>Join a hackathon</text>
        </div>
        <div
          className="redirect-buttons-container"
          onClick={() => (window.location.href = "/")}
        >
          <text>Home</text>
        </div>
      </div>
    );
  }

  if (justRegistered) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div>
          <h1>You registered successfully</h1>
          <h2>Join one of our next hackathons!</h2>
          <AsterButton to={"/about-the-hackathon"}>
            <text>What is a hackathon?</text>
          </AsterButton>
        </div>
        <HackathonCard style={{ margin: "5vh" }} hackathon={mockHackathon} />
        <text
          className="clickable-text"
          onClick={() => setMaybeLater(true)}
          style={{ marginTop: "auto" }}
        >
          Maybe later
        </text>
      </div>
    );
  }

  return (
    <div>
      <h1>Register now</h1>
      <div>{error && <p style={{ color: "red" }}>{error}</p>}</div>
      <div style={{ flex: 1 }}>
        <RegistrationForm />
        <Providers />
      </div>
    </div>
  );
}
