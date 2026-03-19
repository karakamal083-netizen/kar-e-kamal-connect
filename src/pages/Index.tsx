import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import AboutSection from "@/components/AboutSection";
import DomainsSection from "@/components/DomainsSection";
import CampaignsSection from "@/components/CampaignsSection";
import ProjectsSection from "@/components/ProjectsSection";
import GallerySection from "@/components/GallerySection";
import VideoSection from "@/components/VideoSection";
import GetInvolvedSection from "@/components/GetInvolvedSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { useSiteImages } from "@/hooks/use-site-images";
import { useSiteContent } from "@/hooks/use-site-content";

const Index = () => {
  const { getImage } = useSiteImages();
  const { getValue, loading } = useSiteContent();

  return (
    <>
      <Navbar />
      <HeroSection heroImage={getImage("hero-bg")} getValue={getValue} />
      <StatsSection getValue={getValue} />
      <AboutSection getValue={getValue} />
      <DomainsSection />
      <CampaignsSection getImage={getImage} />
      <ProjectsSection getImage={getImage} />
      <GallerySection />
      <GetInvolvedSection />
      <ContactSection getValue={getValue} />
      <Footer />
    </>
  );
};

export default Index;
