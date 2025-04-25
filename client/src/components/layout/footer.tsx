import { Link } from "wouter";
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon, Mail, Phone, MessageSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background/80 backdrop-blur-md border-t border-primary/30 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="text-3xl font-bold font-orbitron text-white mb-4">
              <span className="text-primary">Fire</span>Fight
            </div>
            <p className="text-muted-foreground mb-4">
              The ultimate Free Fire tournament platform for competitive gamers and esports enthusiasts.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <FacebookIcon size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <InstagramIcon size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <TwitterIcon size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <YoutubeIcon size={16} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold font-rajdhani mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-muted-foreground hover:text-secondary transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/tournaments">
                  <a className="text-muted-foreground hover:text-secondary transition-colors">Tournaments</a>
                </Link>
              </li>
              <li>
                <Link href="/leaderboard">
                  <a className="text-muted-foreground hover:text-secondary transition-colors">Leaderboard</a>
                </Link>
              </li>
              <li>
                <Link href="/how-to-play">
                  <a className="text-muted-foreground hover:text-secondary transition-colors">How to Play</a>
                </Link>
              </li>
              <li>
                <Link href="/how-to-play#faqs">
                  <a className="text-muted-foreground hover:text-secondary transition-colors">FAQs</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold font-rajdhani mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/auth">
                  <a className="text-muted-foreground hover:text-secondary transition-colors">Sign Up</a>
                </Link>
              </li>
              <li>
                <Link href="/auth">
                  <a className="text-muted-foreground hover:text-secondary transition-colors">Login</a>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <a className="text-muted-foreground hover:text-secondary transition-colors">My Tournaments</a>
                </Link>
              </li>
              <li>
                <Link href="/wallet">
                  <a className="text-muted-foreground hover:text-secondary transition-colors">Wallet & Payments</a>
                </Link>
              </li>
              <li>
                <Link href="/dashboard#support">
                  <a className="text-muted-foreground hover:text-secondary transition-colors">Support</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold font-rajdhani mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="text-primary mt-1 mr-3" size={16} />
                <span className="text-muted-foreground">support@firefight.gg</span>
              </li>
              <li className="flex items-start">
                <Phone className="text-primary mt-1 mr-3" size={16} />
                <span className="text-muted-foreground">+91 9876543210<br/>Mon-Fri 10:00-18:00</span>
              </li>
              <li className="flex items-start">
                <MessageSquare className="text-primary mt-1 mr-3" size={16} />
                <span className="text-muted-foreground">Join our Discord community</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary/20 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-muted-foreground text-sm mb-4 md:mb-0">
            &copy; 2023 FireFight Gaming. All rights reserved.
          </div>
          <div className="flex space-x-4 text-sm">
            <Link href="/terms">
              <a className="text-muted-foreground hover:text-secondary transition-colors">Terms of Service</a>
            </Link>
            <Link href="/privacy">
              <a className="text-muted-foreground hover:text-secondary transition-colors">Privacy Policy</a>
            </Link>
            <Link href="/cookies">
              <a className="text-muted-foreground hover:text-secondary transition-colors">Cookie Policy</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
