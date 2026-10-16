import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PigmentDrift from '@/components/PigmentDrift';
import { MLLogo } from '@/components/Logo';
import { useTheme } from 'next-themes';

export default function Footer() {
  const [reduced, setReduced] = useState(false);
  const { resolvedTheme } = useTheme();

  console.log(resolvedTheme);
  React.useEffect(() => {
    if (reduced) document.documentElement.classList.add('drift-paused');
    else document.documentElement.classList.remove('drift-paused');
  }, [reduced]);

  return (
    <footer className="relative overflow-hidden border-t border-border">
      <PigmentDrift 
        variant="cta" 
        imageAngle={0} 
        fadeAngle={0} 
        fadeStart={50} 
        fadeEnd={100} 
        darkness={resolvedTheme === "dark" ? 0.7 : 0}
        backdropBlur={100} 
        backdropBrightness={1.5} 
        fade={true} />
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="relative flex h-7 w-7 items-center justify-center rounded-md bg-transparent text-background font-black text-sm">
                <MLLogo />
              </span>
              <span className="font-heading text-[15px] font-bold tracking-tight">MadnessLab</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              We help small businesses and startups adopt AI to automate workflows and improve efficiency —
              eliminating the need for an in-house AI team.
            </p>
            <Link
              to="/contact"
              className="group mt-6 inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-transform hover:scale-[1.02]"
            >
              Start the Conversation
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="md:col-span-3">
            <p className="font-mono-label text-muted-foreground">/ Navigate</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/" className="text-foreground/80 hover:text-foreground">Home</Link></li>
              <li><Link to="/products" className="text-foreground/80 hover:text-foreground">Products</Link></li>
              <li><Link to="/services" className="text-foreground/80 hover:text-foreground">Services</Link></li>
              <li><Link to="/experience" className="text-foreground/80 hover:text-foreground">Experience</Link></li>
              <li><Link to="/contact" className="text-foreground/80 hover:text-foreground">Contact</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="font-mono-label text-muted-foreground">/ Studio</p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><a href="mailto:mail@madnesslab.dev" className="hover:text-foreground">mail@madnesslab.dev</a></li>
              <li>Barranquilla, Colombia</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono-label text-muted-foreground">© {new Date().getFullYear()} MadnessLab — Intelligence, Engineered.</p>
          <button
            type="button"
            onClick={() => setReduced((v) => !v)}
            className="self-start font-mono-label text-muted-foreground underline-offset-4 hover:underline sm:self-auto"
          >
            Reduced motion: {reduced ? 'on' : 'off'}
          </button>
        </div>
      </div>
    </footer>
  );
}