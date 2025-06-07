import { Route, Routes } from "react-router";
import "./App.css";

import AppFooter from "./components/core/AppFooter";
import AppNavbar from "./components/core/AppNavbar";
import NotFound from "./NotFound";
import Editions from "./features/editions/Editions";
import Register from "./features/auth/Register";
import Login from "./features/auth/Login";
import Home from "./features/home/Home"
import tokenService from "./utils/token.service";
import { useEffect } from "react";
import Profile from "./features/auth/Profile";
import AuthCallback from "./features/auth/AuthCallback";

function App() {
  useEffect(() => {
    tokenService.checkToken();
  }, []);
  
  return (
    <>
      <AppNavbar id="navbar" />
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Home />} />
        <Route path="/editions" element={<Editions />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
      <AppFooter />
    </>
  );
}

export default App;
