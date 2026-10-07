import { ArrowDown, ArrowUpRight, Compass, MapPin, Moon, MoveUpRight, ShieldCheck } from "lucide-react";
import { MoonFinder } from "@/components/MoonFinder";
import { LiveMoon } from "@/components/landing/LiveMoon";
import { faqs } from "@/lib/faq";

const steps = [
  { icon: MapPin, title: "Start where you are", text: "Use your current location or enter coordinates. Your location stays on your device." },
  { icon: Compass, title: "Get your bearings", text: "Enable your phone’s compass and hold it flat. Turn toward the moon’s direction." },
  { icon: MoveUpRight, title: "Look a little higher", text: "Use the altitude to find how high above the horizon to look. The rest is up to the sky." },
];

export default function Home() {
  return (
    <div className="landing">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header section-shell">
        <a className="wordmark" href="#main" aria-label="Sight Moon home"><span className="brand-icon"><Moon size={21} strokeWidth={1.7} /></span> sight moon<span className="wordmark-dot">✳</span></a>
        <nav aria-label="Main navigation"><a href="#how">How it works</a><a className="header-cta" href="#find">Find the moon <ArrowUpRight size={16} /></a></nav>
      </header>
      <main id="main">
        <section className="hero section-shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="live-dot" /> A POCKET GUIDE TO THE NIGHT SKY</p>
            <h1 id="hero-title">Less scrolling.<br />More <em>looking up.</em></h1>
            <p className="hero-description">The moon is out there. We’ll help you find it.<br className="desktop-break" /> A little direction, a live compass, and a whole sky to explore.</p>
            <div className="hero-actions"><a className="primary-cta" href="#find">Find my moon <ArrowUpRight size={19} /></a><a className="explore-link" href="#how">How it works <ArrowDown size={16} /></a></div>
            <p className="hero-footnote"><ShieldCheck size={14} /> Free to explore. No account. Just the sky.</p>
            <div className="hero-coordinate" aria-hidden="true"><span>☾</span><p>ONE MOON. A MILLION PLACES TO SEE IT.<br /><span>Your next small adventure starts here.</span></p></div>
          </div>
          <LiveMoon />
        </section>
        <div className="field-strip section-shell"><span>A little tool for a bigger perspective.</span><div><span>For the curious</span><span>For the moon chasers</span><span>For a moment outside</span></div></div>
        <section id="find" className="finder-section section-shell" aria-labelledby="find-title">
          <div className="section-heading"><div><p className="eyebrow">01 / FIND YOUR MOON</p><h2 id="find-title">Your place in the sky.</h2></div><p>Pick a place. Choose a date.<br /> We’ll point you in the right direction.</p></div>
          <MoonFinder />
          <p className="finder-hint"><ShieldCheck size={14} /> Calculated in your browser. Your coordinates stay with you.</p>
        </section>
        <section id="how" className="how-section section-shell" aria-labelledby="how-title">
          <div className="section-heading"><div><p className="eyebrow">02 / FROM HERE TO OUT THERE</p><h2 id="how-title">Three steps to a little wonder.</h2></div></div>
          <ol className="steps">{steps.map(({ icon: Icon, title, text }, index) => <li key={title}><div className="step-top"><span>0{index + 1}</span><Icon size={24} strokeWidth={1.5} /></div><h3>{title}</h3><p>{text}</p></li>)}</ol>
        </section>
        <section className="night-note section-shell"><Moon size={32} strokeWidth={1} /><div><p className="eyebrow">EVERY NIGHT HAS A REASON</p><h2>Chase a crescent. Plan a photo.<br /><em>Or just follow your curiosity.</em></h2></div><a className="round-link" href="#find" aria-label="Open the moon finder"><ArrowUpRight size={25} /></a></section>
        <section className="faq-section section-shell" aria-labelledby="faq-title"><div><p className="eyebrow">03 / FIELD NOTES</p><h2 id="faq-title">A few good<br /> <em>questions.</em></h2><p className="faq-intro">A little clarity before you head outside.</p></div><div className="faq-list">{faqs.map((faq) => <details key={faq.q}><summary>{faq.q}<span aria-hidden="true" className="faq-plus">+</span></summary><p>{faq.a}</p></details>)}</div></section>
      </main>
      <footer className="site-footer section-shell"><div className="footer-top"><a className="wordmark" href="#main"><span className="brand-icon"><Moon size={19} /></span> sight moon</a><p>For the nights that make you look up.</p><a href="https://zameel7.me">Made by Zameel <ArrowUpRight size={14} /></a></div><div className="footer-bottom"><p>© {new Date().getFullYear()} Sight Moon</p><span>Small screen. Big sky.</span></div></footer>
    </div>
  );
}
