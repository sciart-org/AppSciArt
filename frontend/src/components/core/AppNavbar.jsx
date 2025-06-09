import { useEffect, useState } from "react";
import { Link } from "react-router";
import tokenService from "../../utils/token.service";
import "./core.css";

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

  const [showCollections, setShowCollections] = useState(false);

  return (
    <div id="navbar">
      <div className="left-button-container">
        <Link to={"/"}>Home</Link>
        <Link onClick={() => setShowCollections(!showCollections)}>
          Collections
        </Link>
        <Link to={"/about-the-hackathon"}>Our format</Link>
        <Link to={"/hackathons"}>Hackathons</Link>
        <Link to={"/editions"}>Editions</Link>
      </div>
      <h2 style={{ textAlign: "center", flex: 1 }}>AppSciArt</h2>
      {!user ? (
        <div className="right-button-container">
          <Link to={"/signin"}>Log in</Link>
          <Link to={"/signup"}>Register</Link>
        </div>
      ) : (
        <div className="right-button-container">
          <Link to={"/profile"}>{username}</Link>
        </div>
      )}
    </div>
  );
}
