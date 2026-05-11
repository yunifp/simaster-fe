import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ApiServicesSection } from './components/ApiServicesSection';
import { IntegrationSection } from './components/IntegrationSection';
import { Footer } from './components/Footer';

export const LandingPage = () => {
  return (
    <div className="min-h-screen font-sans">
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap"
        rel="stylesheet"
      />
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <Header />
      <HeroSection />
      <ApiServicesSection />
      <IntegrationSection />
      <Footer />
    </div>
  );
};
