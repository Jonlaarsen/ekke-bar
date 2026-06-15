const OmOss = () => {
  return (
    <div>
      <section
        id="om-oss"
        className="relative grid min-h-screen size-full scroll-mt-16 grid-cols-1 items-center gap-12 bg-secondary-bg/90 px-5 py-24 lg:grid-cols-2 lg:gap-20 lg:px-20 overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 size-full bg-secondary-bg/90 z-10" />
        <img
          src="/tak.webp"
          alt="Om oss"
          className="pointer-events-none absolute top-0 left-0 right-0"
        />
        <img
          src="/ekke_img/sparkle.png"
          className="pointer-events-none absolute z-50 left-4 w-24 -scale-x-100 sm:top-0 sm:left-40 sm:w-50"
          alt=""
        />
        <img
          src="/ekke_img/sparkle.png"
          className="pointer-events-none absolute z-50 right-4 bottom-8 w-24 sm:right-8 sm:bottom-5 sm:w-40"
          alt=""
        />

        <div className="relative flex size-full min-h-80 items-center justify-center overflow-hidden z-50">
          <div className="relative z-10 flex max-w-xl flex-col gap-8 px-4 text-primary sm:px-8 lg:pr-12">
            <div className="space-y-5">
              <p className="text-sm font-medium uppercase tracking-[0.35em] text-primary/70">
                Välkommen
              </p>
              <h1 className="font-display text-5xl font-bold leading-none sm:text-7xl lg:text-8xl">
                Om oss
              </h1>
              <span className="block h-px w-16 bg-primary/25" aria-hidden />
            </div>
            <p className="max-w-md text-base leading-relaxed text-foreground/70 sm:text-2xl">
              Vi är ett litet men passionerat gäng som brinner för bra dryck,
              enkel mat och en varm atmosfär — alltid med fokus på kvalitet och
              gemenskap.
            </p>
          </div>
        </div>
        <div className="flex size-full items-center justify-center z-50">
          <div className="relative h-[min(70vh,560px)] w-full max-w-md sm:max-w-lg">
            <div className="absolute top-1/2 left-1/2 z-0 h-[88%] w-[98%] -translate-x-1/2 -translate-y-1/2 overflow-hidden">
              <img
                src="ekke_img/ekke5.webp"
                alt="Ekke Bar interior"
                className="size-full object-cover object-centerf"
              />
            </div>
            <div className="absolute top-1/2 -left-20 z-10 h-[58%] w-[58%] -translate-y-1/2 overflow-hidden shadow-md">
              <img
                src="ekke_img/ekke3.webp"
                alt="Guests at Ekke Bar"
                className="size-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OmOss;
