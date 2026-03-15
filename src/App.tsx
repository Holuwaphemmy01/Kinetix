import { useState } from 'react'

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600 tracking-tight">Kinetix</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">Protocol</a>
              <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">Logistics</a>
              <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">Technology</a>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-all">
                Launch App
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <div className="relative overflow-hidden pt-16 pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
                Native Reactive <span className="text-indigo-600">Logistics Infrastructure</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                Bridging the Trust Gap in African Logistics through On-Chain Reactivity and Fiat-to-Stream Technology.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transform hover:scale-105 transition-all shadow-lg shadow-indigo-200">
                  Get Started
                </button>
                <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
                  Read Whitepaper
                </button>
              </div>
            </div>
          </div>
          
          {/* Abstract background element */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 opacity-10">
            <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-24 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Accepts Local Currency</h3>
                <p className="text-slate-600">Customers pay in NGN via standard gateways. No complex crypto onboarding required for users.</p>
              </div>
              
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Streams in Real-Time</h3>
                <p className="text-slate-600">Converts NGN to cNGN and streams it to drivers based on verifiable physical progress. Trust built on delivery.</p>
              </div>

              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Enforces Safety Reactively</h3>
                <p className="text-slate-600">Uses Somnia SDK to freeze funds or alert security if a driver deviates from a "Safe Corridor."</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400">© 2026 Kinetix Protocol. Built on Somnia Layer 1.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
