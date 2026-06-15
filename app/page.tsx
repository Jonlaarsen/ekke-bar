import BesokOss from "@/components/BesokOss";
import HeroVideo from "@/components/HeroVideo";
import MenuSection from "@/components/MenuSection";
import OmOss from "@/components/OmOss";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-secondary-bg text-background">
      <HeroVideo />
      <OmOss />
      {/* <MenuSection /> */}
      <BesokOss />
      <Footer />
    </main>
  );
}
