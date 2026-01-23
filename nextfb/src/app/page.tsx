import Hero from "@/components/home/Hero";
import DashboardCategories from "@/components/home/DashboardCategories";
import BoutiqueFavorites from "@/components/home/BoutiqueFavorites";
import Newsletter from "@/components/home/Newsletter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen w-full px-6 lg:px-12 py-8">
        <Hero />
        <DashboardCategories />
        <BoutiqueFavorites />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
