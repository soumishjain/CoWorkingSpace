import CTA from "../components/CTA";
import Features from "../components/Features";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Showcase from "../components/Showcase";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Features */}
      <Features />

      {/* Workspace Showcase */}
      <Showcase />

      {/* CTA */}
      <CTA />

      {/* Footer */}
      <Footer />

    </div>
  );
}