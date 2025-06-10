import { Route, Routes } from "react-router";
import "./App.css";

import AppFooter from "./components/core/AppFooter";
import AppNavbar from "./components/core/AppNavbar";
import NotFound from "./NotFound";
import Editions from "./features/editions/Editions";
import Register from "./features/auth/Register";
import Login from "./features/auth/Login";
import Home from "./features/home/Home";
import tokenService from "./utils/token.service";
import { useEffect } from "react";
import Profile from "./features/auth/Profile";
import AuthCallback from "./features/auth/AuthCallback";
import Hackathons from "./features/hackathons/Hackathons";
import Format from "./features/hackathons/Format";

function App() {
  useEffect(() => {
    tokenService.checkToken();
  }, []);

  const user = tokenService.getUser();

  const publicRoutes = (
    <>
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Home />} />
      <Route path="/editions" element={<Editions />} />
      <Route path="/hackathons" element={<Hackathons />} />
      <Route path="/about-the-hackathon" element={<Format />} />
    </>
  );

  const unauthorizedRoutes = (
    <>
      <Route path="/signin" element={<Login />} />{" "}
      <Route path="/signup" element={<Register />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
    </>
  );

  const authorizedRoutes = (
    <>
      <Route path="/profile" element={<Profile />} />
    </>
  );

  return (
    <>
      <AppNavbar id="navbar" />
      <div style={{ flex: 1, height: "100%" }}>
        <Routes>
          {publicRoutes}
          {user ? authorizedRoutes : unauthorizedRoutes}
        </Routes>
      </div>
      <AppFooter />
    </>
  );
}

export default App;
