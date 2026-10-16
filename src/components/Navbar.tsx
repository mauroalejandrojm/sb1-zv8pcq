import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { MLLogo } from '@/components/Logo';

const links = [
  { label: 'Products', to: '/products' },
  { label: 'Services', to: '/services' },
  { label: 'Experience', to: '/experience' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/60 backdrop-blur-lg border-b border-border/70' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="relative flex h-7 w-7 items-center justify-center rounded-md bg-transparent text-background font-black text-sm">
            <MLLogo/>
          </span>
          <span className="font-heading text-[15px] font-bold tracking-tight">MadnessLab</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              className="font-mono-label text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link
            to="/contact"
            className="group inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[13px] font-semibold text-background transition-transform hover:scale-[1.02]"
          >
            Book a Call
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="flex flex-col px-5 py-4">
            {links.map((l) => (
              <Link key={l.label} to={l.to} className="py-3 font-mono-label text-muted-foreground hover:text-foreground">
                {l.label}
              </Link>
            ))}
            <Link to="/contact" className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-foreground px-4 py-3 text-sm font-semibold text-background">
              Book a Call <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}