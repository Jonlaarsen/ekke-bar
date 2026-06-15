import { listMenuCards } from "@/lib/menu-cards-db";

export default async function MenuSection() {
  const cards = await listMenuCards();

  return (
    <div
      id="menu"
      className="relative min-h-screen scroll-mt-16 bg-primary/20 px-5 py-24 text-secondary-bg sm:px-8 lg:px-12"
    >
      <img
        src="/ekke_img/sparkle.png"
        className="pointer-events-none absolute bottom-20 left-10 w-70"
        alt=""
      />
      <img
        src="/ekke_img/sparkle.png"
        className="pointer-events-none absolute top-20 right-10 w-70"
        alt=""
      />

      <div className="relative z-10 mx-auto max-w-6xl space-y-12">
        <div className="space-y-4 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-secondary-bg/70">
            Meny
          </p>
          <h1 className="font-display text-5xl font-bold sm:text-6xl lg:text-7xl">
            Menu
          </h1>
          <p className="mx-auto max-w-lg text-base text-secondary-bg/75 sm:text-lg">
            Våra menykort — ta en titt.
          </p>
        </div>

        {cards.length === 0 ? (
          <p className="text-center text-secondary-bg/60">
            Inga menykort publicerade ännu.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {cards.map((card) => (
              <li key={card.id} className="flex flex-col items-center gap-4">
                <div className="aspect-[210/297] w-full max-w-[min(100%,320px)] overflow-hidden rounded-sm bg-white shadow-lg">
                  <img
                    src={card.image_url}
                    alt={card.title || "Menykort"}
                    className="size-full object-cover"
                  />
                </div>
                {card.title && (
                  <h2 className="font-display text-xl font-bold text-secondary-bg">
                    {card.title}
                  </h2>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
