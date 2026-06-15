"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/#om-oss", label: "Om oss" },
  { href: "/menu", label: "Menu" },
  { href: "/#besok-oss", label: "Besök oss" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-100 border-b text-primary transition-[background-color,border-color,box-shadow] duration-300 ease-out ${menuOpen
        ? "border-white/15 bg-secondary-bg shadow-lg shadow-black/30 backdrop-blur-lg"
        : "border-transparent "
        }`}
    >
      <nav
        className="mx-auto flex  max-w-7xl items-center justify-between px-5 py-2 sm:px-6"
        aria-label="Main"
      >
        <Link
          href="/"
          className="font-display text-outline text-5xl text-center font-semibold uppercase tracking-[0.2em]  transition-colors flex flex-col"
          onClick={closeMenu}
        >
          <span className="tracking-[-0.07em]">EKKE</span>
          <span className="text-2xl tracking-[-0.07em]">BAR</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map(({ href, label }) => (
            <li key={label}>
              <Link
                href={href}
                className="text-md font-medium uppercase text-primary tracking-[0.15em] hover:text-green-500 transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="relative z-50 flex h-10 w-10 items-center justify-center rounded-md text-primary md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">{menuOpen ? "Close" : "Menu"}</span>
          <span className="flex h-4 w-5 flex-col justify-between">
            <span
              className={`block h-px w-full bg-current transition-transform duration-300 ${menuOpen ? "translate-y-1.75 rotate-45" : ""
                }`}
            />
            <span
              className={`block h-px w-full bg-current transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""
                }`}
            />
            <span
              className={`block h-px w-full bg-current transition-transform duration-300 ${menuOpen ? "-translate-y-1.75 -rotate-45" : ""
                }`}
            />
          </span>
        </button>
      </nav>

      <div
        id="mobile-nav"
        className={`overflow-hidden border-t border-white/10  backdrop-blur-lg transition-[max-height,opacity] duration-300 ease-out md:hidden ${menuOpen
          ? "max-h-64 opacity-100"
          : "max-h-0 opacity-0 border-transparent"
          }`}
        aria-hidden={!menuOpen}
      >
        <ul className="flex flex-col gap-1 px-5 py-4 sm:px-6">
          {links.map(({ href, label }) => (
            <li key={label}>
              <Link
                href={href}
                className="block rounded-md px-3 py-3 text-sm font-medium uppercase tracking-[0.15em] text-primary/80 transition-colors hover:bg-white/10 hover:text-primary"
                onClick={closeMenu}
                tabIndex={menuOpen ? 0 : -1}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
