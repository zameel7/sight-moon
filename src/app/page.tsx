import {
  ArrowDown,
  ArrowUpRight,
  Compass,
  MapPin,
  Moon,
  MoveUpRight,
  ShieldCheck,
  CalendarDays,
  Radio,
  Sparkles,
} from "lucide-react";
import { MoonFinder } from "@/components/MoonFinder";
import { LiveMoon } from "@/components/landing/LiveMoon";
import { faqs } from "@/lib/faq";

const features = [
  {
    icon: Sparkles,
    title: "Just open & look up",
    text: "Free to use. No sign-up, no API key, no extra app to install.",
  },
  {
    icon: Radio,
    title: "Less signal. More sky.",
    text: "Calculations run in your browser. Once loaded, an open page keeps working with a weak signal.",
  },
  {
    icon: Compass,
    title: "A compass that follows you",
    text: "Your phone’s real orientation sensor helps you turn toward the moon.",
  },
  {
    icon: CalendarDays,
    title: "Tonight, or another night",
    text: "Choose any date to explore the moon’s position and plan ahead.",
  },
  {
    icon: ShieldCheck,
    title: "Your place stays yours",
    text: "Your location never leaves your device. Enter coordinates manually if you prefer.",
  },
];
const projects = [
  ["QRapid", "https://qrcode.zameel7.me"],
  ["trim.it", "https://trimit.zameel7.me"],
  ["CalSync", "https://calsync.zameel7.me"],
  ["Photo Frame", "https://photoframe.zameel7.me"],
  ["Slice of Shame", "https://slice.zameel7.me"],
  ["Adkar Champ", "https://adkar.zameel7.me"],
];

export default function Home() {
  return (
    <div className="landing">
      <div className="starfield" aria-hidden="true" />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#main" aria-label="Sight Moon home">
            <Moon size={21} strokeWidth={1.3} aria-hidden="true" />
            Sight Moon<span className="wordmark-dot">.</span>
          </a>
          <a className="header-cta" href="#find">
            Find the moon <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </header>
      <main id="main">
        <section className="hero section-shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="tiny-star" aria-hidden="true">
                ✦
              </span>{" "}
              A LITTLE CLOSER TO THE NIGHT SKY
            </p>
            <h1 id="hero-title">
              Somewhere above,
              <br />
              the moon is waiting.
              <br />
              <em>Find it tonight.</em>
            </h1>
            <p className="hero-description">
              Know exactly where to look. Find the moon’s direction and height
              in the sky, then let your phone’s live compass guide you there.
            </p>
            <a className="primary-cta" href="#find">
              Find the moon now <ArrowUpRight size={19} aria-hidden="true" />
            </a>
            <p className="hero-footnote">
              Free. Made for your phone. Just you and the sky.
            </p>
            <a className="explore-link" href="#how">
              A small guide to looking up{" "}
              <ArrowDown size={15} aria-hidden="true" />
            </a>
          </div>
          <LiveMoon />
        </section>
        <div className="sky-divider section-shell" aria-hidden="true">
          <span />✦<span />
        </div>
        <section
          id="find"
          className="finder-section section-shell"
          aria-labelledby="find-title"
        >
          <div className="section-heading">
            <p className="eyebrow">01 / YOUR WINDOW TO THE SKY</p>
            <h2 id="find-title">Find the moon.</h2>
            <p>Pick your place. Choose your night. Follow the moon.</p>
          </div>
          <div className="finder-frame">
            <div className="finder-topline">
              <span>
                <span className="live-dot" /> MOON FINDER
              </span>
              <span>LOCAL CALCULATIONS</span>
            </div>
            <MoonFinder />
          </div>
          <p className="finder-hint">
            <ShieldCheck size={15} aria-hidden="true" /> No account needed. Your
            coordinates stay in your browser.
          </p>
        </section>
        <section
          id="how"
          className="how-section section-shell"
          aria-labelledby="how-title"
        >
          <div className="section-heading">
            <p className="eyebrow">02 / FROM SCREEN TO SKY</p>
            <h2 id="how-title">Three steps. One small wonder.</h2>
          </div>
          <ol className="steps">
            <li>
              <div className="step-top">
                <span>01</span>
                <MapPin size={25} strokeWidth={1.3} aria-hidden="true" />
              </div>
              <h3>Start where you are</h3>
              <p>
                Allow location in the finder, or enter your coordinates. We’ll
                calculate where the moon is from your spot.
              </p>
            </li>
            <li>
              <div className="step-top">
                <span>02</span>
                <Compass size={25} strokeWidth={1.3} aria-hidden="true" />
              </div>
              <h3>Find your bearings</h3>
              <p>
                Hold your phone flat and enable the compass. On iPhone, allow
                motion access in Safari when asked.
              </p>
            </li>
            <li>
              <div className="step-top">
                <span>03</span>
                <MoveUpRight size={25} strokeWidth={1.3} aria-hidden="true" />
              </div>
              <h3>Turn. Then look up.</h3>
              <p>
                Turn until the moon marker lines up. Use the altitude to see how
                high above the horizon to look.
              </p>
            </li>
          </ol>
        </section>
        <section
          className="features-section section-shell"
          aria-labelledby="features-title"
        >
          <div className="feature-intro">
            <p className="eyebrow">03 / TRAVEL LIGHT</p>
            <h2 id="features-title">
              Everything you need.
              <br />
              <em>Room for the wonder.</em>
            </h2>
            <p>
              A quiet little tool for the great outdoors. Built to get you off
              the screen and into the night.
            </p>
            <div className="mini-orbit" aria-hidden="true">
              <Moon size={35} strokeWidth={1} />
              <span>YOUR PHONE → THE SKY</span>
            </div>
          </div>
          <div className="features-list">
            {features.map(({ icon: Icon, title, text }) => (
              <article key={title}>
                <Icon size={21} strokeWidth={1.4} aria-hidden="true" />
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section
          className="uses-section section-shell"
          aria-labelledby="uses-title"
        >
          <div className="section-heading">
            <p className="eyebrow">04 / EVERY NIGHT HAS A REASON</p>
            <h2 id="uses-title">What brings you outside?</h2>
          </div>
          <div className="use-grid">
            <article>
              <span className="use-symbol" aria-hidden="true">
                ☾
              </span>
              <p className="eyebrow">A NEW BEGINNING</p>
              <h3>Seek the first crescent</h3>
              <p>
                Find the right direction for hilal sighting during Ramadan and
                Eid. Position is a guide; clear skies and actual visibility tell
                the rest.
              </p>
            </article>
            <article>
              <span className="use-symbol" aria-hidden="true">
                ◎
              </span>
              <p className="eyebrow">THE PERFECT FRAME</p>
              <h3>Chase the moonrise</h3>
              <p>
                Scout a direction, plan your date and find a foreground worth
                waiting for. A little preparation for your next night
                photograph.
              </p>
            </article>
            <article>
              <span className="use-symbol" aria-hidden="true">
                ✧
              </span>
              <p className="eyebrow">A MOMENT OF CURIOSITY</p>
              <h3>Know your night sky</h3>
              <p>
                Out stargazing, sharing astronomy with someone, or simply
                wondering where the moon went? Start with a look up.
              </p>
            </article>
          </div>
        </section>
        <section
          className="faq-section section-shell"
          aria-labelledby="faq-title"
        >
          <div className="section-heading">
            <p className="eyebrow">05 / A FEW FIELD NOTES</p>
            <h2 id="faq-title">
              Good questions.
              <br />
              <em>Clear answers.</em>
            </h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.q}>
                <summary>
                  {faq.q}
                  <span aria-hidden="true" className="faq-plus">
                    +
                  </span>
                </summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
        <section
          className="final-cta section-shell"
          aria-labelledby="final-title"
        >
          <span className="eyebrow">THE NIGHT IS STILL YOUNG</span>
          <h2 id="final-title">
            Go find your <em>moon.</em>
          </h2>
          <p>A whole sky above you. A little direction in your hand.</p>
          <a className="primary-cta" href="#find">
            Find the moon <ArrowUpRight size={19} aria-hidden="true" />
          </a>
        </section>
      </main>
      <footer className="site-footer section-shell">
        <div className="footer-top">
          <a className="wordmark" href="#main">
            <Moon size={20} strokeWidth={1.3} aria-hidden="true" />
            Sight Moon<span className="wordmark-dot">.</span>
          </a>
          <p>For the nights that make you look up.</p>
        </div>
        <nav aria-label="More by Zameel">
          <p className="eyebrow">MORE BY ZAMEEL</p>
          <div className="project-links">
            {projects.map(([name, url]) => (
              <a href={url} key={name}>
                {name}
                <ArrowUpRight size={13} aria-hidden="true" />
              </a>
            ))}
          </div>
        </nav>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Sight Moon</p>
          <a href="https://zameel7.me">
            Built by Zameel <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </footer>
    </div>
  );
}
