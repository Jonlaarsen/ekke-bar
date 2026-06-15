const BesokOss = () => {
  return (
    <section
      id="besok-oss"
      className="relative min-h-screen scroll-mt-16 bg-primary/10 px-5 py-24 sm:px-8 lg:px-20"
    >
      <img
        src="/ekke_img/cutlery.png"
        className="z-50 pointer-events-none absolute md:left-1/3 right-20 -top-40 md:-top-80 w-60 md:-translate-x-1/3 md:-scale-x-90 scale-x-90  sm:w-100"
        alt=""
      />
      <img
        src="/ekke_img/sparkle.png"
        className="z-50 pointer-events-none absolute left-4 w-24 -scale-x-100 -top-10 sm:left-40 sm:w-50"
        alt=""
      />
      <img
        src="/ekke_img/sparkle.png"
        className="z-50 pointer-events-none absolute left-4 md:left-1/3 bottom-0 w-24 md:-translate-x-1/3 sm:bottom-5 sm:w-40"
        alt=""
      />
      <img
        src="/ekke_img/cheers.png"
        className="z-50 pointer-events-none absolute right-0 md:right-30 -bottom-10 w-60 scale-x-90  sm:w-90"
        alt=""
      />
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="overflow-hidden max-h-130">
          <img
            src="ekke_img/ekke0.webp"
            className="object-cover object-bottom "
            alt=""
          />
        </div>

        <div className="flex flex-col gap-6 ">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-primary/70">
            Hitta hit
          </p>
          <h2 className="font-display text-primary text-5xl font-bold leading-none sm:text-6xl lg:text-7xl">
            Besök oss
          </h2>
          <span className="block h-px w-16 bg-primary/25" aria-hidden />
          <p className="max-w-md text-base leading-relaxed text-foreground/70 sm:text-lg">
            Kom förbi för en öl, enklare rätter och en avslappnad kväll med
            vänner.
          </p>

          <div className="rounded-lg bg-secondary-bg p-8 text-primary shadow-sm sm:p-10">
            <h3 className="text-xs font-medium uppercase tracking-[0.25em] text-primary/70">
              Adress
            </h3>
            <p className="mt-2 text-lg">Ekke Bar</p>
            <a href="https://www.google.com/maps/place//data=!4m2!3m1!1s0x4653a10028f495d3:0x97cbff1258a34245?sa=X&ved=1t:8290&ictx=111" className="text-foreground/70">Karlskronaplan 6, malmö</a>
          </div>
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.25em] text-primary/70">
              Öppettider
            </h3>
            <ul className="mt-2 space-y-1 text-foreground/70">
              <li>Mån–Tor: 16:00–22:00</li>
              <li>Fre–Lör: 16:00–00:00</li>
              <li>Sön: 13:00–21:00</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.25em] text-primary/70">
              Kontakt
            </h3>
            <p className="mt-2 text-foreground/70">ekkebar@gmail.com</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BesokOss;
