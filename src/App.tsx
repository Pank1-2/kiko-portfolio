import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SiteCursor } from "./components/SiteCursor";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import { ScrollFX } from "./components/ScrollFX";
import { About } from "./pages/About";
import { CaseStudy } from "./pages/CaseStudy";
import { Home } from "./pages/Home";
import { WorkIndex } from "./pages/WorkIndex";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollFX />
      <SiteCursor />
      <div className="grain" />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<WorkIndex />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
