import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import tokenService from "../../utils/token.service";
import "./core.css";
import Dropdown from "../buttons/Dropdown";

export default function AppNavbar() {
  const [username, setUsername] = useState("");
  const user = tokenService.getUser();

  useEffect(() => {
    if (user) {
      const name = user.name || "";
      const surname = user.surname || "";
      setUsername(name + " " + surname);
    }
  }, [user]);

  const permanentLinks = {
    left: (
      <>
        <Link to={"/"}>Home</Link>
        <Dropdown title="Collections">
          <Link to={"/collections/seeds"}>Seeds</Link>
          <Link to={"/collections/flowers"}>Flowers</Link>
          <Link to={"/collections/fruits"}>Fruits</Link>
        </Dropdown>
        <Link to={"/hackathons"}>Hackathons</Link>
        <Link to={"/editions"}>Editions</Link>
      </>
    ),
    right: (
      <>
        <Link to={"/about-the-hackathon"}>Our format</Link>
      </>
    ),
  };

  const guestLinks = {
    left: null,
    right: (
      <>
        <Link to={"/signin"}>Log in</Link>
        <Link to={"/signup"}>Register</Link>
      </>
    ),
  };

  const authenticatedLinks = {
    left: null,
    right: <Link to={"/profile"}>{username}</Link>,
  };

  const adminLinks = {
    left: (
      <Dropdown title="Users">
        <Link to={"/users/scientists"}>Scientists</Link>
      </Dropdown>
    ),
    right: null,
  };

  return (
    <div id="navbar">
      <div className="left-button-container">
        {permanentLinks.left}
        {user ? authenticatedLinks.left : guestLinks.left}
        {user && user.roles.includes("administrator") && adminLinks.left}
      </div>

      <h2 style={{ textAlign: "center", flex: 1 }}>AppSciArt</h2>

      <div className="right-button-container">
        {permanentLinks.right}
        {user ? authenticatedLinks.right : guestLinks.right}
        {user && user.roles.includes("administrator") && adminLinks.right}
      </div>
    </div>
  );
}
