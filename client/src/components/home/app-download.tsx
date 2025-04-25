// No need to import icons as we're using custom SVG components

export default function AppDownload() {
  return (
    <section className="py-12 bg-background/80 backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
        <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-2xl md:text-4xl font-orbitron font-bold mb-4">
              Download Our <span className="text-primary">Mobile App</span>
            </h2>
            <p className="text-muted-foreground mb-6">
              Get the FireFight Mobile App for a better tournament experience. Receive instant notifications, 
              join matches with one tap, and upload screenshots directly from your device.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="#" className="flex items-center bg-background rounded-md px-4 py-3 hover:bg-muted transition-colors">
                <TabletSmartphone className="text-3xl text-secondary mr-3" />
                <div>
                  <div className="text-xs text-muted-foreground">Get it on</div>
                  <div className="font-medium">Google Play</div>
                </div>
              </a>
              <a href="#" className="flex items-center bg-background rounded-md px-4 py-3 hover:bg-muted transition-colors">
                <AppleIcon className="text-3xl text-primary mr-3" />
                <div>
                  <div className="text-xs text-muted-foreground">Download on</div>
                  <div className="font-medium">App Store</div>
                </div>
              </a>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative max-h-96 w-56 rounded-2xl border-4 border-primary/30 shadow-[0_0_20px_theme(colors.primary.DEFAULT)]">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <AppIcon className="mx-auto mb-4 text-primary" size={48} />
                  <p className="text-lg font-bold font-rajdhani">FireFight App</p>
                  <p className="text-sm text-muted-foreground">Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// SVG icons
const TabletSmartphone = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15v5c0 .5.5 1 1 1h3V10H5c-.5 0-1 .5-1 1Z"></path>
    <path d="M20 15v5c0 .5-.5 1-1 1h-3V10h3c.5 0 1 .5 1 1Z"></path>
    <rect x="7" y="10" width="10" height="11" rx="1"></rect>
    <path d="m12 2-2 3h4l-2-3Z"></path>
    <path d="M13 5H8c-.5 0-1 .5-1 1v4h4"></path>
    <path d="M16 5h-3v5h5V6c0-.5-.5-1-1-1Z"></path>
  </svg>
);

const AppleIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path>
    <path d="M12 7c2-.66 4 1.34 4 3.66.02 1.36-.59 2.74-1.17 3.56-1.77 2.96-3.83 2.96-3.83 2.96"></path>
  </svg>
);

const AppIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5"></polyline>
    <line x1="12" y1="19" x2="20" y2="19"></line>
  </svg>
);
