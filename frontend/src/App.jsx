import { Route, Routes } from "react-router";
import "./App.css";

import AppFooter from "./components/core/AppFooter";
import AppNavbar from "./components/core/AppNavbar";
import NotFound from "./NotFound";
import Editions from "./features/editions/Editions";
import Login from "./features/auth/Login";
import Home from "./features/home/Home";
import tokenService from "./utils/token.service";
import { useEffect, useState } from "react";
import Profile from "./features/auth/Profile";
import AuthCallback from "./features/auth/AuthCallback";
import Hackathons from "./features/hackathons/Hackathons";
import Format from "./features/hackathons/Format";
import RegistrationEntry from "./features/auth/RegistrationEntry";

function App() {
  useEffect(() => {
    tokenService.checkToken();
  }, []);

  const [user, setUser] = useState(tokenService.getUser());
  const [justRegistered, setJustRegistered] = useState(false);

  const refreshSession = () => {
    const foundUser = tokenService.getUser();
    setUser(foundUser);
    setJustRegistered(true);
  };

  const publicRoutes = (
    <>
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Home />} />
      <Route path="/editions" element={<Editions />} />
      <Route path="/hackathons" element={<Hackathons />} />
      <Route path="/about-the-hackathon" element={<Format />} />
    </>
  );

  const unauthenticatedRoutes = (
    <>
      {!user && (
        <>
          <Route path="/signin" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/signup/complete"
            element={
              <RegistrationEntry
                isCompleting={true}
                refreshSession={refreshSession}
                justRegistered={justRegistered}
                setJustRegistered={setJustRegistered}
              />
            }
          />
        </>
      )}
      {(!user || justRegistered) && (
        <Route
          path="/signup"
          element={
            <RegistrationEntry
              isCompleting={false}
              refreshSession={refreshSession}
              justRegistered={justRegistered}
              setJustRegistered={setJustRegistered}
            />
          }
        />
      )}
    </>
  );

  const authenticatedRoutes = (
    <>
      {user && (
        <>
          <Route path="/profile" element={<Profile />} />
        </>
      )}
    </>
  );

  return (
    <>
      <AppNavbar id="navbar" />
      <div style={{ flex: 1, height: "100%" }}>
        <Routes>
          {publicRoutes}
          {unauthenticatedRoutes}
          {authenticatedRoutes}
        </Routes>
      </div>
      <AppFooter />
    </>
  );
}

export default App;
