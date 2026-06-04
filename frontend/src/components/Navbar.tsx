import { useCallback, useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#tracks", label: "Tracks" },
  { href: "#sede", label: "Sede" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Intersection observer for active section tracking
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
      e.preventDefault();
      setMobileOpen(false);
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
    [],
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-abismo/80 backdrop-blur-xl border-b border-raiz/40"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => {
            const el = document.querySelector("#inicio");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <span className="font-makes font-bold text-2xl sm:text-3xl text-gradient-manantial leading-none">
            AMANAL
          </span>
          <span className="hidden sm:inline font-mono text-[10px] text-musgo/60 tracking-widest">
            {"//"}2026
          </span>
        </button>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative px-3 py-1.5 font-mono text-xs tracking-widest uppercase transition-colors duration-200 ${
                  activeSection === link.href.slice(1)
                    ? "text-manantial"
                    : "text-musgo hover:text-niebla"
                }`}
              >
                {activeSection === link.href.slice(1) && (
                  <span className="absolute bottom-0 left-3 right-3 h-px bg-manantial" />
                )}
                {link.label}
              </a>
            </li>
          ))}
          <li className="ml-3">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                const el = document.querySelector("#registro");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="font-product text-xs font-medium px-4 py-2 bg-manantial/10 text-manantial border border-manantial/20 rounded-lg hover:bg-manantial/20 transition-colors duration-200 cursor-pointer"
            >
              Registrarse
            </button>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden relative w-14 h-14 flex items-center justify-center"
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileOpen}
        >
          <span
            className={`absolute block w-7 h-px bg-niebla transition-all duration-300 origin-center ${
              mobileOpen ? "rotate-45" : "-translate-y-1.5"
            }`}
          />
          <span
            className={`absolute block w-7 h-px bg-niebla transition-all duration-300 ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`absolute block w-7 h-px bg-niebla transition-all duration-300 origin-center ${
              mobileOpen ? "-rotate-45" : "translate-y-1.5"
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 pt-4 bg-abismo/95 backdrop-blur-xl border-t border-raiz/30">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`block px-4 py-3 rounded-lg font-mono text-xs tracking-widest uppercase transition-colors duration-200 ${
                    activeSection === link.href.slice(1)
                      ? "text-manantial bg-manantial/5"
                      : "text-musgo hover:text-niebla hover:bg-corteza/30"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-2">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  const el = document.querySelector("#registro");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="block w-full text-center font-product text-xs font-medium px-4 py-3 bg-manantial/10 text-manantial border border-manantial/20 rounded-lg cursor-pointer"
              >
                Registrarse
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
