import { Route, Routes, useLocation } from "react-router";
import "./App.css";

import AppFooter from "./components/core/AppFooter";
import AppNavbar from "./components/core/AppNavbar";
import NotFound from "./NotFound";
import Editions from "./features/editions/Editions";
import Login from "./features/auth/Login";
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
import FruitDetails from "./features/products/details/FruitDetails";
import FlowerDetails from "./features/products/details/FlowerDetails";
import Unauthorized from "./features/auth/errors/Unauthorized";
import HomeRouter from "./features/home/HomeRouter";
import Forbidden from "./features/auth/errors/Forbidden";
import SeedRouter from "./features/products/details/SeedRouter";
import EditionRouter from "./features/editions/EditionRouter";
import SeedCreator from "./features/products/creators/SeedCreator";
import Scientists from "./features/users/scientists/Scientists";
import EditionCreate from "./features/editions/EditionCreate";
import HackathonCreate from "./features/hackathons/HackathonCreate";
import HackathonRouter from "./features/hackathons/HackathonRouter";
import { scrollToTop } from "./utils/commonUtils";

function App() {
  const [user, setUser] = useState(tokenService.getUser());
  const [justRegistered, setJustRegistered] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!tokenService.checkToken()) {
      setUser(undefined);
    }
  }, [location]);

  const refreshSession = () => {
    const foundUser = tokenService.getUser();
    setUser(foundUser);
    setJustRegistered(true);
  };

  const ScrollToTopWrapper = ({ children }) => {
    const location = useLocation();

    useLayoutEffect(() => {
      scrollToTop(0);
    }, [location.pathname]);

    return children;
  };

  const publicRoutes = (
    <>
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<HomeRouter />} />
      <Route path="/not-found" element={<NotFound resource={true} />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/forbidden" element={<Forbidden />} />
      <Route path="/editions" element={<Editions />} />
      <Route path="/editions/:editionId" element={<EditionRouter />} />
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
      <Route path="/seeds/:seedId" element={<SeedRouter />} />
      <Route path="/flowers/:flowerId" element={<FlowerDetails />} />
      <Route path="/fruits/:fruitId" element={<FruitDetails />} />
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
          <Route
            path="/hackathons/:hackathonId"
            element={<HackathonRouter />}
          />
        </>
      )}
    </>
  );

  const adminRoutes = (
    <>
      {user && user.roles.includes("administrator") && (
        <>
          <Route path="/collections/seeds/create" element={<SeedCreator />} />
          <Route path="/users/scientists" element={<Scientists />} />
          <Route path="/editions/create" element={<EditionCreate />} />
          <Route path="/hackathons/create" element={<HackathonCreate />} />
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
          {adminRoutes}
        </Routes>
      </div>
      <AppFooter />
    </ScrollToTopWrapper>
  );
}

export default App;
