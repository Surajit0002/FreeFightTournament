import { useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import MobileNavbar from "@/components/layout/mobile-navbar";
import Footer from "@/components/layout/footer";
import HeroBanner from "@/components/home/hero-banner";
import FeaturedTournaments from "@/components/home/featured-tournaments";
import TournamentCategories from "@/components/home/tournament-categories";
import LiveTournaments from "@/components/home/live-tournaments";
import LeaderboardPreview from "@/components/home/leaderboard-preview";
import HowToPlay from "@/components/home/how-to-play";
import AppDownload from "@/components/home/app-download";
import NewsletterSignup from "@/components/home/newsletter-signup";

export default function HomePage() {
  // Set page title
  useEffect(() => {
    document.title = "FireFight - Free Fire Tournament Platform";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow pt-0 md:pt-20 pb-20">
        {/* Hero Banner */}
        <HeroBanner />
        
        {/* Featured Tournaments */}
        <FeaturedTournaments />
        
        {/* Tournament Categories */}
        <TournamentCategories />
        
        {/* Live Tournaments */}
        <LiveTournaments />
        
        {/* Leaderboard Preview */}
        <LeaderboardPreview />
        
        {/* How to Play */}
        <HowToPlay />
        
        {/* App Download */}
        <AppDownload />
        
        {/* Newsletter Signup */}
        <NewsletterSignup />
      </main>
      
      <Footer />
      <MobileNavbar />
    </div>
  );
}
