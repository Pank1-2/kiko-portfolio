import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useLocation } from "react-router-dom";
import { consumeCover } from "../cover";
import { ThemeToggle } from "./ThemeToggle";

function goToHero() {
  consumeCover();
  window.setTimeout(() => {
    document.getElementById("portfolio-start")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 80);
}

export function Nav() {
  const { pathname, hash } = useLocation();
  const workActive = pathname.startsWith("/work") || hash === "#case-studies";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 480px)");
    const sync = () => {
      setIsPhone(mq.matches);
      if (!mq.matches) setMenuOpen(false);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, hash]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("nav-menu-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("nav-menu-open");
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const links = (
    <>
      <Link
        to={{ pathname: "/", hash: "case-studies" }}
        className={workActive ? "active" : ""}
        onClick={() => {
          closeMenu();
          consumeCover();
        }}
      >
        Work
      </Link>
      <NavLink
        to="/about"
        className={({ isActive }) => (isActive ? "active" : "")}
        onClick={closeMenu}
      >
        About
      </NavLink>
      <a
        href="https://drive.google.com/file/d/1zIgUrUnQ81I9cpqMX2nbtHMpaYeTsQ2F/view?usp=sharing"
        target="_blank"
        rel="noreferrer"
        onClick={closeMenu}
      >
        Resume
      </a>
      <a
        href="https://www.linkedin.com/in/kiko-pan"
        target="_blank"
        rel="noreferrer"
        onClick={closeMenu}
      >
        LinkedIn
      </a>
      <ThemeToggle />
    </>
  );

  const phoneMenu =
    isPhone &&
    createPortal(
      <>
        {menuOpen ? (
          <button
            type="button"
            className="nav-backdrop"
            aria-label="Close menu"
            onClick={closeMenu}
          />
        ) : null}
        <nav
          id={menuId}
          className={`nav-links nav-drawer${menuOpen ? " is-open" : ""}`}
          aria-hidden={!menuOpen}
          {...(!menuOpen ? { inert: true } : {})}
        >
          <button
            type="button"
            className="nav-drawer-close"
            aria-label="Close menu"
            tabIndex={menuOpen ? 0 : -1}
            onClick={closeMenu}
          >
            <span className="nav-menu-toggle-bars" aria-hidden />
          </button>
          {links}
        </nav>
      </>,
      document.body,
    );

  return (
    <header className={`nav${scrolled ? " nav--scrolled" : ""}`}>
      <div className="shell nav-bar">
        <NavLink
          to={{ pathname: "/", hash: "portfolio-start" }}
          className="nav-brand"
          onClick={() => {
            closeMenu();
            goToHero();
          }}
        >
          Kiko Pan
        </NavLink>

        <button
          type="button"
          className={`nav-menu-toggle${menuOpen ? " is-open" : ""}`}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="nav-menu-toggle-bars" aria-hidden />
        </button>

        {!isPhone ? <nav className="nav-links">{links}</nav> : null}
        {phoneMenu}
      </div>
    </header>
  );
}
