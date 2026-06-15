const menuCat = [
  {
    id: 1,
    name: "Mat",
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/2f/33/2d/healthy-bowl-frische.jpg?w=900&h=500&s=1",
  },
  {
    id: 2,
    name: "Dryck",
    image:
      "https://www.alkoholfrittshop.se/media/catalog/product/cache/4a5cf70630b9c3080e492221e54d9a9f/g/e/german-beer-4-bottles-case.png",
  },
  {
    id: 3,
    name: "Vin mm",
    image:
      "https://ik.imagekit.io/pinvino/ro%CC%88tt%20under%20200.webp?updatedAt=1758282702403&tr=w-1600&f-webp",
  },
];
const OmOsstre = () => {
  return (
    <div className=" min-h-screen size-full flex flex-col items-center justify-center gap-6 py-10">
      <div className="text-center text-primary">
        <h1 className="text-7xl font-display font-bold pb-2">Menu</h1>
        <p className="text-3xl font-thin">- se vad vi har att erbjuda -</p>
      </div>

      <div className="size-full flex items-center justify-evenly">
        {menuCat.map((cat) => (
          <div
            key={cat.id}
            className="relative flex items-center justify-center bg-primary/30 min-w-[1/3] h-[60vh] size-full overflow-hidden "
          >
            <div className="absolute top-0 left-0 right-0 bg-black/20 size-full" />
            <h3 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl text-secondary-bg font-bold font-display w-full text-center">
              {cat.name}
            </h3>
            <img
              src={cat.image}
              alt={cat.name}
              className="size-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OmOsstre;
