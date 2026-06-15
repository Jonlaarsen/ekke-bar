import Footer from "@/components/Footer";
import MenuSection from "@/components/MenuSection";

export const metadata = {
  title: "Menu | Ekke Bar",
  description: "Drinks and snacks at Ekke Bar",
};

export default function MenuPage() {
  return (
    <main className="bg-primary/20 text-background">
      <div className="">
        <MenuSection />
      </div>
      <Footer />
    </main>
  );
}
