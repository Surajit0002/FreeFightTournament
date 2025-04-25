import { useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import MobileNavbar from "@/components/layout/mobile-navbar";
import Footer from "@/components/layout/footer";
import { 
  HelpCircle, UserPlus, Search, Gamepad, Trophy,
  Users, Wallet, Upload, Download, Share2
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function HowToPlayPage() {
  // Set page title
  useEffect(() => {
    document.title = "How to Play | FireFight";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 pt-24 pb-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-orbitron mb-2 flex items-center">
            <HelpCircle className="mr-3 text-secondary h-8 w-8" />
            How to Play
          </h1>
          <p className="text-muted-foreground">
            Simple steps to get started with tournaments on FireFight
          </p>
        </div>
        
        {/* Step by Step Guide */}
        <div className="glassmorphic rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold font-orbitron mb-8 text-center">
            Get Started in Four Easy Steps
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 mb-4">
                <UserPlus className="text-primary text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-rajdhani">1. Register</h3>
              <p className="text-muted-foreground">
                Create your account and set up your gaming profile with your Free Fire ID.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/50 mb-4">
                <Search className="text-secondary text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-rajdhani">2. Find Tournament</h3>
              <p className="text-muted-foreground">
                Browse available tournaments and choose one that matches your skill level.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center border border-accent/50 mb-4">
                <Gamepad className="text-accent text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-rajdhani">3. Join & Play</h3>
              <p className="text-muted-foreground">
                Enter the tournament, join the match room with ID & password, and show your skills.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 mb-4">
                <Trophy className="text-primary text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-rajdhani">4. Win Rewards</h3>
              <p className="text-muted-foreground">
                Finish in top positions to win coins or cash prizes that you can withdraw.
              </p>
            </div>
          </div>
        </div>
        
        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="glassmorphic rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 mr-4 shrink-0">
                <Users className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 font-rajdhani">Create & Join Teams</h3>
                <p className="text-muted-foreground text-sm">
                  Form squads with friends or find teammates for duo and squad tournaments. 
                  Invite players using their username or ID and dominate the battlefield together.
                </p>
              </div>
            </div>
          </div>
          
          <div className="glassmorphic rounded-xl p-6 hover:border-secondary/50 transition-all duration-300">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/50 mr-4 shrink-0">
                <Wallet className="text-secondary" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 font-rajdhani">Wallet System</h3>
                <p className="text-muted-foreground text-sm">
                  Manage your coins and cash balance, add funds for tournament entries, and withdraw 
                  your winnings directly to your preferred payment method.
                </p>
              </div>
            </div>
          </div>
          
          <div className="glassmorphic rounded-xl p-6 hover:border-accent/50 transition-all duration-300">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center border border-accent/50 mr-4 shrink-0">
                <Upload className="text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 font-rajdhani">Results Submission</h3>
                <p className="text-muted-foreground text-sm">
                  Upload screenshots of your match results as proof of your performance.
                  This helps verify your kills and position to distribute prizes fairly.
                </p>
              </div>
            </div>
          </div>
          
          <div className="glassmorphic rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 mr-4 shrink-0">
                <Share2 className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 font-rajdhani">Refer & Earn</h3>
                <p className="text-muted-foreground text-sm">
                  Invite friends using your referral code and earn rewards when they join tournaments.
                  Both you and your referred friends get bonus coins.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQs */}
        <div className="glassmorphic rounded-xl p-8">
          <h2 className="text-2xl font-bold font-orbitron mb-6">
            Frequently Asked Questions
          </h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-rajdhani">
                How do I join a tournament?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Browse to the tournaments section, select a tournament that interests you,
                and click the "Join Tournament" button. You'll need to have enough coins 
                in your wallet to cover the entry fee. After joining, you'll receive the 
                match details including room ID and password closer to the start time.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-rajdhani">
                How are tournament prizes distributed?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Prizes are distributed based on final placements and kill counts. 
                Typically, the top 3 positions receive the largest share of the prize pool,
                with additional rewards for players with high kill counts. Prizes are credited 
                to your FireFight wallet within 30 minutes after tournament completion and verification.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-rajdhani">
                How do I add money to my wallet?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Go to your wallet section in the dashboard, click on "Add Coins" and choose your 
                preferred payment method. We support UPI, credit/debit cards, net banking, and 
                popular wallets. The funds will be instantly added to your account once the 
                payment is successful.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-rajdhani">
                What happens if I can't join a tournament after registering?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                If you can't join a tournament after registering, your entry fee is generally not 
                refunded unless there's a technical issue from our side. However, you can request 
                a refund up to 30 minutes before the tournament start time through the support section.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-rajdhani">
                Can I create custom tournaments for my friends?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes, you can create custom tournaments by contacting our support team or applying for 
                an organizer account. We offer various options for custom tournaments, including private 
                tournaments with password protection and custom prize pools.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-lg font-rajdhani">
                How do I report a player for cheating?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                If you suspect a player of cheating during a tournament, you can report them through 
                the match details page. Click on "Report Player", select the reason, and provide evidence 
                such as screenshots or recordings. Our moderation team will investigate all reports promptly.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      
      <Footer />
      <MobileNavbar />
    </div>
  );
}
