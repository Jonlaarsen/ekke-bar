import React from "react";

const OmOsstva = () => {
  return (
    <section className="relative flex min-h-[80vh] size-full items-center justify-center overflow-hidden">
      <img
        src="./tak.webp"
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 right-0 inset-0 size-full object-cover object-center opacity-80"
      />

      {/* <img
        src="/ekke_img/sparkle.png"
        className="pointer-events-none absolute left-4 z-10 w-24 -scale-x-100 sm:top-0 sm:left-40 sm:w-80"
        alt=""
      /> */}
      <img
        src="/ekke_img/sparkle.png"
        className="pointer-events-none absolute right-4 bottom-0 z-10 w-24 sm:right-8 sm:-bottom-10 sm:w-60"
        alt=""
      />

      <div className="relative z-10 flex size-full max-w-7xl items-center justify-between rounded-2xl p-8">
        <div className="size-full bg-secondary-bg p-8">
          <div className="space-y-5">
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-primary/70">
              Välkommen
            </p>
            <h1 className="font-display text-5xl font-bold leading-none text-primary sm:text-7xl lg:text-8xl">
              Om oss
            </h1>
            <span className="block h-px w-16 bg-primary/25" aria-hidden />
          </div>
          <p className="max-w-md p-2 text-base leading-relaxed text-primary/70 sm:text-2xl">
            Vi är ett litet men passionerat gäng som brinner för bra dryck,
            enkel mat och en varm atmosfär — alltid med fokus på kvalitet och
            gemenskap.
          </p>
        </div>
        <div className="size-full">
          <div className="relative h-[min(70vh,560px)] w-full max-w-md sm:max-w-lg">
            <div className="absolute top-0 right-0 left-0 h-full w-full overflow-hidden">
              <img
                src="https://static.bonniernews.se/ba/9d16f82a-cc5b-42d7-bfff-23bdaa2f24a0.jpg?crop=4597%2C2586%2Cx1%2Cy0&width=2500&format=pjpg&auto=avif"
                alt="Ekke Bar interior"
                className="size-full object-cover object-center"
              />
            </div>
            <div className="absolute top-1/2 -left-20 z-10 h-[58%] w-[58%] -translate-y-1/2 overflow-hidden shadow-md">
              <img
                src="https://static.bonniernews.se/ba/74f2e648-43c6-403d-a191-2083013278a3.jpeg?width=2500&format=pjpg&auto=avif"
                alt="Guests at Ekke Bar"
                className="size-full object-cover object-bottom"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OmOsstva;
