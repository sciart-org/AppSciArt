import { useEffect, useState } from "react";
import tokenService from "../../utils/token.service";
import "./core.css";
import Dropdown from "../buttons/Dropdown";
import AsterLink from "../buttons/AsterLink";

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
        <AsterLink to={"/"}>Home</AsterLink>
        <Dropdown title="Collections">
          <AsterLink to={"/seeds"}>Seeds</AsterLink>
          <AsterLink to={"/flowers"}>Flowers</AsterLink>
          <AsterLink to={"/fruits"}>Fruits</AsterLink>
        </Dropdown>
        <AsterLink to={"/hackathons"}>Hackathons</AsterLink>
        <AsterLink to={"/editions"}>Editions</AsterLink>
      </>
    ),
    right: (
      <>
        <AsterLink to={"/about-the-hackathon"}>Our format</AsterLink>
      </>
    ),
  };

  const guestLinks = {
    left: null,
    right: (
      <>
        <AsterLink to={"/signin"}>Log in</AsterLink>
        <AsterLink to={"/signup"}>Register</AsterLink>
      </>
    ),
  };

  const authenticatedLinks = {
    left: null,
    right: <AsterLink to={"/profile"}>{username}</AsterLink>,
  };

  const staffLinks = {
    left: (
      <Dropdown title="Users">
        <AsterLink to={"/users/scientists"}>Scientists</AsterLink>
      </Dropdown>
    ),
    right: null,
  };

  return (
    <div id="navbar">
      <div className="left-button-container">
        {permanentLinks.left}
        {user ? authenticatedLinks.left : guestLinks.left}
        {user && user.roles.includes("staff") && staffLinks.left}
      </div>

      <h2 style={{ textAlign: "center", flex: 1 }}>AppSciArt</h2>

      <div className="right-button-container">
        {permanentLinks.right}
        {user ? authenticatedLinks.right : guestLinks.right}
        {user && user.roles.includes("staff") && staffLinks.right}
      </div>
    </div>
  );
}
