import { Route, Routes } from "react-router";
import "./App.css";

import AppFooter from "./AppFooter";
import AppNavbar from "./AppNavbar";
import Home from "./Home";
import NotFound from "./NotFound";

function App() {
  return (
    <>
      <AppNavbar id="navbar" />
      <Routes>
        <Route path='*' element={<NotFound />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <AppFooter />
    </>
  );
}

export default App;
