import Link from "next/link";

const footerLinks = [
  { href: "/#om-oss", label: "Om oss" },
  { href: "/menu", label: "Menu" },
  { href: "/#besok-oss", label: "Besök oss" },
];

const Footer = () => {
  return (
    <footer className="bg-primary text-secondary-bg">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-14 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12">
        <div className="space-y-3">
          <Link
            href="/"
            className="font-display text-3xl font-bold uppercase leading-none tracking-[0.15em]"
          >
            Ekke Bar
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-secondary-bg/75">
            Ta det lugnt med en öl — välkommen till Ekke Bar.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {footerLinks.map(({ href, label }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-xs font-medium uppercase tracking-[0.2em] text-secondary-bg/80 transition-colors hover:text-secondary-bg"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-secondary-bg/15">
        <p className="mx-auto max-w-7xl px-5 py-5 text-center text-xs text-secondary-bg/60 sm:px-8 lg:px-12">
          © {new Date().getFullYear()} Ekke Bar. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
