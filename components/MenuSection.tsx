import { getMenuTree } from "@/lib/menu-db";
import { countMenuItems, formatMenuPrice, type MenuItem } from "@/lib/menu";

function MenuItemRow({ item }: { item: MenuItem }) {
  return (
    <li className="space-y-1">
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-display text-lg font-bold sm:text-xl">
          {item.name}
        </span>
        <span className="max-w-[45%] shrink-0 text-right font-display text-lg font-bold leading-snug sm:max-w-none sm:text-xl">
          {formatMenuPrice(item.price)}
        </span>
      </div>
      {item.ingredients_origin && (
        <p className="max-w-xl text-sm leading-relaxed text-secondary-bg/70">
          {item.ingredients_origin}
        </p>
      )}
    </li>
  );
}

export default async function MenuSection() {
  const tree = await getMenuTree();
  const itemCount = countMenuItems(tree);

  return (
    <div
      id="menu"
      className="relative min-h-screen scroll-mt-16 bg-primary/20 px-5 py-24 text-secondary-bg sm:px-8 lg:px-12"
    >
      <img
        src="/ekke_img/sparkle.png"
        className="pointer-events-none absolute bottom-5 left-10 z-50 w-30 md:bottom-20 md:w-70"
        alt=""
      />
      <img
        src="/ekke_img/sparkle.png"
        className="pointer-events-none absolute top-20 right-10 md:w-70 w-30"
        alt=""
      />

      <div className="relative z-10 mx-auto max-w-3xl space-y-12">
        <div className="space-y-4 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-secondary-bg/70">
            Meny
          </p>
          <h1 className="font-display text-5xl font-bold sm:text-6xl lg:text-7xl">
            Menu
          </h1>
          <p className="mx-auto max-w-lg text-base text-secondary-bg/75 sm:text-lg">
            Dryck och mat på Ekke Bar.
          </p>
        </div>

        {itemCount === 0 ? (
          <p className="text-center text-secondary-bg/60">
            Menyn uppdateras snart.
          </p>
        ) : (
          <div className="space-y-14 bg-primary/30 py-16 px-20 box rounded-4xl">
            {tree.map((category) => {
              const hasDirectItems = (category.items?.length ?? 0) > 0;
              const hasSubItems = category.subcategories?.some(
                (sub) => (sub.items?.length ?? 0) > 0,
              );
              if (!hasDirectItems && !hasSubItems) return null;

              return (
                <section key={category.id} className="space-y-8">
                  <h2 className="text-center font-display text-4xl font-bold sm:text-5xl">
                    {category.name}
                  </h2>

                  <div className="space-y-10">
                    {hasDirectItems && (
                      <ul className="space-y-5">
                        {category.items!.map((item) => (
                          <MenuItemRow key={item.id} item={item} />
                        ))}
                      </ul>
                    )}

                    {category.subcategories?.map((sub) => {
                      if (!sub.items?.length) return null;

                      return (
                        <div key={sub.id} className="space-y-4">
                          <h3 className="border-b border-secondary-bg/25 pb-2 text-center text-sm font-semibold uppercase tracking-[0.35em] text-secondary-bg/85">
                            {sub.name}
                          </h3>

                          <ul className="space-y-5">
                            {sub.items.map((item) => (
                              <MenuItemRow key={item.id} item={item} />
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
