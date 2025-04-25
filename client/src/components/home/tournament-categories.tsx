import { Link } from "wouter";

export default function TournamentCategories() {
  return (
    <section className="py-12 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-orbitron font-bold mb-8 flex items-center">
          <TrophyIcon className="text-secondary mr-3" />
          Tournament Categories
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/tournaments?mode=Solo">
            <a className="glassmorphic rounded-xl overflow-hidden relative h-36 group hover:border-secondary/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/10"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-rajdhani group-hover:text-secondary transition-colors">Solo</h3>
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/50 group-hover:bg-secondary/30 transition-colors">
                    <UserIcon className="text-secondary" size={16} />
                  </div>
                </div>
              </div>
            </a>
          </Link>
          
          <Link href="/tournaments?mode=Duo">
            <a className="glassmorphic rounded-xl overflow-hidden relative h-36 group hover:border-primary/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/10"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-rajdhani group-hover:text-primary transition-colors">Duo</h3>
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 group-hover:bg-primary/30 transition-colors">
                    <UsersIcon className="text-primary" size={16} />
                  </div>
                </div>
              </div>
            </a>
          </Link>
          
          <Link href="/tournaments?mode=Squad">
            <a className="glassmorphic rounded-xl overflow-hidden relative h-36 group hover:border-accent/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/10"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-rajdhani group-hover:text-accent transition-colors">Squad</h3>
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center border border-accent/50 group-hover:bg-accent/30 transition-colors">
                    <GroupIcon className="text-accent" size={16} />
                  </div>
                </div>
              </div>
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}

// SVG icons
const TrophyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
    <path d="M4 22h16"></path>
    <path d="M10 22V9.5a2.5 2.5 0 0 1 5 0V22"></path>
    <path d="M6 12.76A9 9 0 0 0 12 15a9 9 0 0 0 6-2.24"></path>
  </svg>
);

const UserIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const UsersIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const GroupIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);
