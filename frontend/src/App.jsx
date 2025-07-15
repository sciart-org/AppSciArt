import { Route, Routes, useLocation } from "react-router";
import "./App.css";

import AppFooter from "./components/core/AppFooter";
import AppNavbar from "./components/core/AppNavbar";
import NotFound from "./NotFound";
import Editions from "./features/editions/Editions";
import Login from "./features/auth/Login";
import Home from "./features/home/Home";
import tokenService from "./utils/token.service";
import { useEffect, useLayoutEffect, useState } from "react";
import Profile from "./features/auth/Profile";
import AuthCallback from "./features/auth/AuthCallback";
import Hackathons from "./features/hackathons/Hackathons";
import Format from "./features/hackathons/Format";
import RegistrationEntry from "./features/auth/RegistrationEntry";
import JoinHackathon from "./features/hackathons/JoinHackathon";
import { Message } from "./components/messages/Message";
import Collection from "./features/products/collections/Collection";
import SeedDetails from "./features/products/details/SeedDetails";

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

  const ScrollToTopWrapper = ({ children }) => {
    const location = useLocation();

    useLayoutEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [location.pathname]);

    return children;
  };

  const publicRoutes = (
    <>
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Home />} />
      <Route path="/editions" element={<Editions />} />
      <Route path="/hackathons" element={<Hackathons />} />
      <Route path="/about-the-hackathon" element={<Format />} />
      <Route path="/hackathons/:hackathonId/join" element={<JoinHackathon />} />
      <Route
        path="/signup/complete/:earlySignupId"
        element={
          <RegistrationEntry
            isCompleting={true}
            refreshSession={refreshSession}
            justRegistered={justRegistered}
            setJustRegistered={setJustRegistered}
          />
        }
      />
      <Route
        path="/collections/seeds"
        element={<Collection itemName="seed" />}
      />
      <Route
        path="/collections/flowers"
        element={<Collection itemName="flower" />}
      />
      <Route
        path="/collections/fruits"
        element={<Collection itemName="fruit" />}
      />
      <Route path="/seeds/:seedId" element={<SeedDetails />} />
    </>
  );

  const unauthenticatedRoutes = (
    <>
      {!user && (
        <>
          <Route path="/signin" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
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
    <ScrollToTopWrapper>
      <Message />
      <AppNavbar id="navbar" />
      <div style={{ flex: 1, height: "100%" }}>
        <Routes>
          {publicRoutes}
          {unauthenticatedRoutes}
          {authenticatedRoutes}
        </Routes>
      </div>
      <AppFooter />
    </ScrollToTopWrapper>
  );
}

export default App;
