import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Import Pages (to be created)
import Home from './pages/Home';
import About from './pages/About';
import Solutions from './pages/Solutions';
import Methodology from './pages/Methodology';
import Contact from './pages/Contact';
import ServiceOffering from './pages/ServiceOffering';
import { LogoFull } from './components/Logo';

// ===== NAVBAR ===== //
const Navbar = () => {
  const navRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top -50',
        onUpdate: (self) => {
          if (self.direction === 1) {
            gsap.to(navRef.current, { backgroundColor: 'rgba(18, 22, 32, 0.8)', backdropFilter: 'blur(16px)', color: '#F8FAFC', borderColor: 'rgba(248, 250, 252, 0.1)', top: '1rem', duration: 0.4 });
          } else if (self.progress === 0) {
            gsap.to(navRef.current, { backgroundColor: 'transparent', backdropFilter: 'blur(0px)', color: '#F8FAFC', borderColor: 'transparent', top: '2rem', duration: 0.4 });
          }
        }
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <nav ref={navRef} className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-6 py-3 rounded-full border border-transparent text-primary transition-colors w-[90%] max-w-5xl">
      <Link to="/" className="flex items-center gap-3">
        <LogoFull className="h-8" />
      </Link>
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
        <Link to="/about" className="nav-link text-primary/80 hover:text-accent">About</Link>
        <Link to="/solutions" className="nav-link text-primary/80 hover:text-accent">Solutions</Link>
        <Link to="/methodology" className="nav-link text-primary/80 hover:text-accent">Methodology</Link>
      </div>
      <Link to="/contact" className="magnetic-btn bg-accent text-background px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
        <span>Contact</span>
      </Link>
    </nav>
  );
};

// ===== FOOTER ===== //
const Footer = () => {
  return (
    <footer className="bg-[#0B0E14] text-primary rounded-t-[4rem] px-8 py-16 md:py-24 mt-20 relative border-t border-accent/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 relative z-10">
        <div className="md:col-span-2">
          <div className="mb-8">
             <LogoFull className="h-12 opacity-80" />
          </div>
          <p className="text-primary/60 max-w-sm mb-8 text-sm leading-relaxed font-mono">
            Elevate • Protect • Succeed <br />
            Member of Cyberwin Group of Companies. <br/>
            Boutique expertise, bespoke solutions tailored to modern threats.
          </p>
          <div className="flex items-center gap-3 text-xs font-mono bg-dark/40 w-max px-4 py-2 rounded-full border border-white/5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.4)]"></span>
            System Operational
          </div>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 text-accent">Navigation</h4>
          <ul className="space-y-4 text-sm text-primary/70 font-mono">
            <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
            <li><Link to="/solutions" className="hover:text-accent transition-colors">Solutions</Link></li>
            <li><Link to="/methodology" className="hover:text-accent transition-colors">Methodology</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 text-accent">Contact</h4>
          <ul className="space-y-4 text-sm text-primary/70 font-mono">
            <li><a href="mailto:william@Securepathconsulting.co.za" className="hover:text-white transition-colors">william@securepathconsulting.co.za</a></li>
            <li><a href="https://www.securepathconsulting.co.za" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">www.securepathconsulting.co.za</a></li>
          </ul>
        </div>
      </div>
      <div className="absolute inset-0 overflow-hidden rounded-t-[4rem] z-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[600px] h-[300px] bg-accent/10 blur-[100px] rounded-full"></div>
      </div>
    </footer>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// ===== APP WRAPPER ===== //
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="w-full bg-background min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/services/:slug" element={<ServiceOffering />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
