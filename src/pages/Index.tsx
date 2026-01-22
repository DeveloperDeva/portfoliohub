import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import WhoIsThisFor from "@/components/sections/WhoIsThisFor";
import HowItWorks from "@/components/sections/HowItWorks";
import PortfolioSection from "@/components/sections/PortfolioSection";
import WhyPortfolioHub from "@/components/sections/WhyPortfolioHub";
import Testimonials from "@/components/sections/Testimonials";
import BlogPreview from "@/components/sections/BlogPreview";
import Contact from "@/components/sections/Contact";

const Index = () => {
  return (
    <>
      <Header />
      <main className="relative">
        <HeroSection />
        <WhoIsThisFor />
        <HowItWorks />
        <PortfolioSection />
        <WhyPortfolioHub />
        <Testimonials />
        <BlogPreview />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default Index;
