import React from 'react';

interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased font-display">
      {/* Header/Navbar */}
      <header className="fixed top-0 w-full z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-1.5 rounded-lg">
              <span className="material-symbols-outlined text-background-dark font-bold">query_stats</span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tighter text-slate-900 dark:text-white uppercase">
              Kinetix <span className="text-primary">Protocol</span>
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#">How it Works</a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#">Customer Dashboard</a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#">Rider App</a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#">About Us</a>
          </nav>
          <button 
            onClick={onLoginClick}
            className="bg-primary hover:bg-primary/90 text-background-dark px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/20"
          >
            Login
          </button>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                POWERED BY SOMNIA BLOCKCHAIN
              </div>
              <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-6 tracking-tight">
                Eliminate the <span className="text-primary italic">'Trust Tax'</span> in African Logistics
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-xl">
                Kinetix is the first protocol that converts physical delivery into a verifiable, programmable financial stream. We secure last-mile logistics by streaming payments based on real-time progress.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-primary hover:bg-primary/90 text-background-dark px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2">
                  Book a Delivery (NGN)
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
                <button className="bg-surface border border-border-subtle hover:bg-primary/5 text-slate-100 px-8 py-4 rounded-xl font-bold transition-all">
                  Become a Rider
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full"></div>
              <div className="relative bg-surface border border-border-subtle rounded-3xl p-4 shadow-2xl overflow-hidden aspect-video group">
                <div 
                  className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center relative overflow-hidden" 
                  style={{ 
                    backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA1oSu1SoxyR4DEnN1vTT6ntL4Y2WR9drXxgKtnYbsVcb6bEbY5Nw1YdV8CQ-P3c1HvjAr32VMfJhsCxtM5sR9sf0MzrcHPv50VLuArLpg9uFRD3LKyTqtpgFX1NRNIixffwbrgVnqaFQMhba0urxs4m5A8tX2O5cX6yXUfe85Usv24DmvNDDG4kXaB7JLcwiK4gvGJs52ME3luwlXCRI4aNbiiJ1R7RKojTFnaJG_Ag_ecOCJc78ECR90fB_1gSHB8K-7wKfsHLjM')", 
                    backgroundSize: 'cover' 
                  }}
                >
                  {/* Overlay UI elements simulated */}
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
                  <div className="absolute top-10 left-10 right-10 flex justify-between items-start">
                    <div className="bg-background-dark/90 p-4 rounded-xl border border-primary/30 shadow-xl max-w-[180px]">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Current Progress</p>
                      <p className="text-xl font-black text-primary">4.2km / 12km</p>
                      <div className="w-full h-1 bg-slate-800 mt-2 rounded-full overflow-hidden">
                        <div className="w-1/3 h-full bg-primary"></div>
                      </div>
                    </div>
                    <div className="bg-background-dark/90 p-4 rounded-xl border border-primary/30 shadow-xl text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Streamed Payout</p>
                      <p className="text-xl font-black text-white">842.00 <span className="text-xs text-primary">cNGN</span></p>
                    </div>
                  </div>
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-20 bg-background-dark/90 border border-primary/20 rounded-2xl flex items-center justify-around px-6">
                    <span className="material-symbols-outlined text-primary text-3xl">local_shipping</span>
                    <div className="flex-1 mx-4 h-0.5 border-t border-dashed border-primary/50 relative">
                      <div className="absolute top-1/2 -translate-y-1/2 left-1/4 w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_#14b8a5]"></div>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 text-3xl">inventory_2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Broken Logistics Section */}
        <section className="py-24 bg-surface/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold mb-4">The Broken Logistics</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Traditional delivery networks in emerging markets are plagued by friction and lack of trust between all parties.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Problem 1 */}
              <div className="p-8 rounded-2xl bg-surface border border-border-subtle hover:border-primary/50 transition-all">
                <div className="size-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-red-500">warning</span>
                </div>
                <h3 className="text-xl font-bold mb-3">The Payment-on-Delivery Trap</h3>
                <p className="text-slate-400 leading-relaxed">Merchants risk 30% cancellation rates, while customers fear being defrauded by pre-payment. Friction dominates every step.</p>
              </div>
              {/* Problem 2 */}
              <div className="p-8 rounded-2xl bg-surface border border-border-subtle hover:border-primary/50 transition-all">
                <div className="size-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-amber-500">payments</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Courier Cash Crunch</h3>
                <p className="text-slate-400 leading-relaxed">Riders often wait 24-48 hours for fuel reimbursements and payouts, causing severe operational liquidity issues for drivers.</p>
              </div>
              {/* Problem 3 */}
              <div className="p-8 rounded-2xl bg-surface border border-border-subtle hover:border-primary/50 transition-all">
                <div className="size-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-blue-500">location_disabled</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Passive Tracking</h3>
                <p className="text-slate-400 leading-relaxed">Static GPS updates are easily spoofed and don't provide programmatic accountability for delivery milestones or route integrity.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Kinetix Solution Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-16">Kinetix Solution: <span className="text-primary">Streaming-on-Delivery</span></h2>
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Step 1 */}
              <div className="flex-1 flex flex-col items-center group">
                <div className="size-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mb-6 relative z-10">
                  <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
                  <div className="absolute -top-2 -right-2 bg-primary text-background-dark text-xs font-bold size-6 rounded-full flex items-center justify-center">1</div>
                </div>
                <h4 className="text-xl font-bold mb-2">Bridge NGN to cNGN</h4>
                <p className="text-slate-400 max-w-xs">Instantly convert local currency into programmable stablecoins on the Somnia network.</p>
              </div>
              <div className="hidden lg:block w-24 h-0.5 bg-border-subtle relative top-[-24px]">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-transparent border-l-border-subtle"></div>
              </div>
              {/* Step 2 */}
              <div className="flex-1 flex flex-col items-center group">
                <div className="size-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mb-6 relative z-10">
                  <span className="material-symbols-outlined text-primary text-3xl">motion_sensor_active</span>
                  <div className="absolute -top-2 -right-2 bg-primary text-background-dark text-xs font-bold size-6 rounded-full flex items-center justify-center">2</div>
                </div>
                <h4 className="text-xl font-bold mb-2">Native Reactivity</h4>
                <p className="text-slate-400 max-w-xs">The protocol streams micro-payouts automatically for every 500m of verified progress.</p>
              </div>
              <div className="hidden lg:block w-24 h-0.5 bg-border-subtle relative top-[-24px]">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-transparent border-l-border-subtle"></div>
              </div>
              {/* Step 3 */}
              <div className="flex-1 flex flex-col items-center group">
                <div className="size-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mb-6 relative z-10">
                  <span className="material-symbols-outlined text-primary text-3xl">security</span>
                  <div className="absolute -top-2 -right-2 bg-primary text-background-dark text-xs font-bold size-6 rounded-full flex items-center justify-center">3</div>
                </div>
                <h4 className="text-xl font-bold mb-2">Vector Analysis</h4>
                <p className="text-slate-400 max-w-xs">On-chain logic freezes the payment stream immediately if the delivery route deviates from the plan.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Built on Somnia */}
        <section className="py-24 bg-primary/5 border-y border-border-subtle">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">Why Built on Somnia?</h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  Logistics data is high-frequency. Kinetix leverages Somnia's unprecedented performance to handle thousands of concurrent delivery streams without congestion.
                </p>
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 rounded-xl bg-surface/50 border border-border-subtle">
                    <span className="material-symbols-outlined text-primary">dynamic_form</span>
                    <div>
                      <h4 className="font-bold">Native Reactivity</h4>
                      <p className="text-sm text-slate-400">Smart contracts that react to external data triggers without costly oracles.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-xl bg-surface/50 border border-border-subtle">
                    <span className="material-symbols-outlined text-primary">bolt</span>
                    <div>
                      <h4 className="font-bold">1M+ TPS & Ultra-Low Fees</h4>
                      <p className="text-sm text-slate-400">Massive scale ensures micro-payments stay profitable even for small deliveries.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-xl bg-surface/50 border border-border-subtle">
                    <span className="material-symbols-outlined text-primary">timer</span>
                    <div>
                      <h4 className="font-bold">Sub-Second Finality</h4>
                      <p className="text-sm text-slate-400">Instant confirmation for every meter traveled by the courier.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative aspect-square">
                <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
                <div className="absolute inset-12 bg-primary/5 rounded-full"></div>
                <div className="w-full h-full flex items-center justify-center">
                  <div className="relative w-4/5 h-4/5 rounded-3xl bg-surface border border-primary/20 p-8 flex flex-col justify-between overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="bg-primary/20 px-3 py-1 rounded text-primary text-[10px] font-bold">SOMNIA MAINNET</div>
                      <div className="text-xs text-slate-500">BLOCK #1,204,551</div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-10 bg-slate-800/50 rounded-lg flex items-center px-4 justify-between border-l-4 border-primary">
                        <span className="text-xs text-white">Tx: Delivery_Update_#A01</span>
                        <span className="text-xs text-primary">Confirmed</span>
                      </div>
                      <div className="h-10 bg-slate-800/50 rounded-lg flex items-center px-4 justify-between border-l-4 border-primary">
                        <span className="text-xs text-white">Tx: Stream_Payout_#042</span>
                        <span className="text-xs text-primary">Confirmed</span>
                      </div>
                      <div className="h-10 bg-slate-800/50 rounded-lg flex items-center px-4 justify-between border-l-4 border-primary">
                        <span className="text-xs text-white">Tx: Vector_Validation_#99</span>
                        <span className="text-xs text-primary">Confirmed</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-border-subtle flex justify-between items-end">
                      <div>
                        <p className="text-[10px] text-slate-500">TPS</p>
                        <p className="text-2xl font-black text-white">1,204,500</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-500">Gas Fee</p>
                        <p className="text-lg font-bold text-primary">&lt; $0.0001</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Choose Your Role */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative group overflow-hidden rounded-3xl p-1 bg-gradient-to-br from-primary/30 to-border-subtle">
                <div className="bg-surface rounded-[22px] p-10 h-full flex flex-col">
                  <span className="material-symbols-outlined text-primary text-5xl mb-6">shopping_cart</span>
                  <h3 className="text-3xl font-bold mb-4">I am a Customer</h3>
                  <p className="text-slate-400 mb-8 leading-relaxed">Book secure deliveries with escrow protection. Only pay for the distance your items actually travel. No more prepayment anxiety.</p>
                  <button className="mt-auto bg-primary text-background-dark py-4 rounded-xl font-bold hover:bg-white transition-colors">Book Now</button>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-3xl p-1 bg-gradient-to-br from-slate-700 to-border-subtle">
                <div className="bg-surface rounded-[22px] p-10 h-full flex flex-col">
                  <span className="material-symbols-outlined text-white text-5xl mb-6">pedal_bike</span>
                  <h3 className="text-3xl font-bold mb-4">I am a Rider</h3>
                  <p className="text-slate-400 mb-8 leading-relaxed">Get paid in real-time. Access your earnings every kilometer. Improve your trust score and access better delivery rates.</p>
                  <button className="mt-auto bg-white text-background-dark py-4 rounded-xl font-bold hover:bg-primary transition-colors">Apply to Ride</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border-subtle py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-1.5 rounded-lg">
              <span className="material-symbols-outlined text-background-dark font-bold">query_stats</span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tighter text-white uppercase">Kinetix</h1>
          </div>
          <div className="flex gap-10 text-sm text-slate-500">
            <a className="hover:text-primary" href="#">Docs</a>
            <a className="hover:text-primary" href="#">Governance</a>
            <a className="hover:text-primary" href="#">Github</a>
            <a className="hover:text-primary" href="#">Somnia Explorer</a>
          </div>
          <p className="text-xs text-slate-600">© 2024 Kinetix Protocol. Built for the future of logistics.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
