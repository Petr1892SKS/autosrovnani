"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import CarWizard, { type WizardData } from "./CarWizard";

const faqs = [
  {
    q: "Je služba pro mě zdarma?",
    a: "Ano, pro vás jako prodávajícího je služba 100% zdarma. Platí pouze bazary, kteří mají zájem o vaše auto.",
  },
  {
    q: "Jak rychle dostanu nabídky?",
    a: "Většinou do 24 hodin od zadání. Oslovíme prověřené bazary ve vaší oblasti a pošleme vám přehled nejvyšších nabídek.",
  },
  {
    q: "Musím auto někam odvézt?",
    a: "Ne. Nejprve dostanete online nabídky. Teprve po výběru té nejlepší vás bazar kontaktuje a dohodne si s vámi prohlídku nebo rovnou odvoz.",
  },
  {
    q: "Co když se mi žádná nabídka nebude líbit?",
    a: "Žádný problém. Nabídky jsou nezávazné — pokud žádná nevyhovuje, jednoduše ji nepřijmete. Žádné poplatky, žádné závazky.",
  },
  {
    q: "Jak zjistím, který bazar nabídl nejvíc?",
    a: "Pošleme vám srovnání jako Bazar A: 185 000 Kč, Bazar B: 178 000 Kč atd. Jméno bazaru se dozvíte až po výběru — to zajišťuje, že každý bazar nabídne skutečně maximum.",
  },
  {
    q: "Prodávám auto s úvěrem nebo leasingem. Mohu využít službu?",
    a: "Ano. Při zadávání auta tuto informaci uveďte — bazary, kteří s tím umí pracovat, vám pošlou relevantní nabídku.",
  },
];

const steps = [
  {
    num: "01",
    title: "Zadáte auto",
    desc: "Vyplníte krátký formulář — značka, rok, kilometry, stav a pár fotek. Zabere to 3 minuty.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3"/>
        <path d="M8 12h8M8 8h8M8 16h5"/>
      </svg>
    ),
  },
  {
    num: "02",
    title: "Bazary soutěží",
    desc: "Anonymně oslovíme prověřené bazary. Každý nabídne maximum — nevědí, co nabídl konkurent.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
  {
    num: "03",
    title: "Vyberete nejlepší",
    desc: "Pošleme vám srovnání nabídek. Vyberete nejvyšší, my vás propojíme s bazarem. Hotovo.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
    ),
  },
];

const benefits = [
  {
    title: "Průměrně o 18 000 Kč více",
    desc: "Když bazary soutěží, nabízejí víc. Jeden bazar vám dá tržní minimum — deset bazarů dá maximum.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
  },
  {
    title: "Bez objíždění bazarů",
    desc: "Nemusíte nikam jezdit, čekat v čekárnách ani poslouchat, proč je vaše auto \"problémové\". Vše online.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4l3 3"/>
      </svg>
    ),
  },
  {
    title: "Anonymní nabídky",
    desc: "Bazary nevidí navzájem své ceny. Každý proto nabídne skutečně maximum — ne o korunu víc než konkurent.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    title: "Zdarma a nezávazně",
    desc: "Žádné poplatky, žádné skryté podmínky. Pokud vám nabídky nevyhovují, jednoduše je odmítnete.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
    ),
  },
];



function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("revealed"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function AutoSrovnani() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLElement>(null);

  useReveal();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleWizardSubmit = async (_data: WizardData) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --green: #f97316;
          --green-dark: #ea580c;
          --green-light: #ffedd5;
          --green-mid: #fdba74;
          --green-xlight: #fff7ed;
          --text: #1c0f05;
          --text2: #6b4c35;
          --text3: #a07050;
          --border: #fed7aa;
          --bg: #fff9f5;
          --white: #ffffff;
          --radius: 18px;
          --radius-sm: 10px;
          --shadow: 0 4px 24px rgba(249,115,22,0.08);
          --shadow-hover: 0 12px 40px rgba(249,115,22,0.18);
          --font-head: var(--font-jakarta), sans-serif;
          --font-body: var(--font-jakarta), sans-serif;
        }

        html { scroll-behavior: smooth; }
        body { font-family: var(--font-body); background: var(--bg); color: var(--text); line-height: 1.6; }

        /* NAVBAR */
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          height: 68px; display: flex; align-items: center; justify-content: space-between;
          padding: 0 5%; backdrop-filter: blur(16px);
          background: rgba(247,253,248,0.88); border-bottom: 1px solid var(--border);
        }
        .navbar-logo {
          font-family: var(--font-head); font-size: 1.25rem; font-weight: 800;
          color: var(--text); cursor: pointer; letter-spacing: -0.5px;
        }
        .navbar-logo span { color: var(--green); }
        .navbar-links { display: flex; gap: 32px; list-style: none; }
        .navbar-links a { font-size: 0.9rem; font-weight: 500; color: var(--text2); text-decoration: none; transition: color 0.2s; }
        .navbar-links a:hover { color: var(--green); }

        /* BUTTONS */
        .btn-primary {
          background: var(--green); color: #fff; border: none; border-radius: 50px;
          padding: 11px 24px; font-size: 0.9rem; font-weight: 600; font-family: inherit;
          cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px;
        }
        .btn-primary:hover { background: var(--green-dark); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(249,115,22,0.3); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .btn-outline {
          background: transparent; color: var(--green); border: 2px solid var(--green);
          border-radius: 50px; padding: 11px 24px; font-size: 0.9rem; font-weight: 600;
          font-family: inherit; cursor: pointer; transition: all 0.2s;
        }
        .btn-outline:hover { background: var(--green-light); transform: translateY(-1px); }

        /* HERO */
        .hero {
          min-height: 88vh; padding: 100px 5% 60px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center;
          background: #ea580c;
          position: relative; overflow: hidden;
        }
        .hero-road-svg {
          position: absolute; inset: 0; width: 100%; height: 100%;
          pointer-events: none; z-index: 0;
        }
        .hero-left, .hero-car-wrap { position: relative; z-index: 1; }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.12); color: #fed7aa; border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50px; padding: 6px 16px; font-size: 0.82rem; font-weight: 600;
          margin-bottom: 24px;
        }
        .hero-badge-dot { width: 7px; height: 7px; background: #fb923c; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.3)} }
        .hero-left h1 {
          font-family: var(--font-head); font-size: clamp(2.6rem, 5vw, 4rem);
          font-weight: 800; line-height: 1.08; letter-spacing: -2px; margin-bottom: 20px; color: white;
        }
        .hero-left h1 .accent { color: #1a9e4a; }
        .hero-left p { font-size: 1.05rem; color: rgba(255,255,255,0.7); max-width: 460px; margin-bottom: 32px; line-height: 1.7; }
        .hero-pills { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 36px; }
        .hero-pill {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.35);
          border-radius: 50px; padding: 7px 16px; font-size: 0.83rem; font-weight: 600; color: white;
        }
        .hero-pill svg { color: white; }
        .hero-cta { display: flex; gap: 14px; flex-wrap: wrap; }
        .btn-hero-primary {
          background: white; color: #7c2d12; border: none; border-radius: 50px;
          padding: 14px 28px; font-size: 1rem; font-weight: 700; font-family: inherit;
          cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-hero-primary:hover { background: #fff7ed; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.25); }
        .btn-hero-outline {
          background: transparent; color: white; border: 2px solid rgba(255,255,255,0.35);
          border-radius: 50px; padding: 14px 28px; font-size: 1rem; font-weight: 600;
          font-family: inherit; cursor: pointer; transition: all 0.2s;
        }
        .btn-hero-outline:hover { border-color: white; background: rgba(255,255,255,0.08); }

        /* HERO CAR */
        .hero-car-wrap {
          position: relative;
          height: 380px;
        }
        .hero-car-glow {
          position: absolute; bottom: 10%; left: 50%; transform: translateX(-50%);
          width: 70%; height: 40%; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(0,0,0,0.2) 0%, transparent 70%);
          filter: blur(20px); z-index: 0;
        }
        .hero-stat {
          position: absolute; z-index: 2;
          background: rgba(255,255,255,0.15); backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.25); border-radius: 14px;
          padding: 10px 16px; display: flex; flex-direction: column; gap: 2px;
          animation: floatBadge 4s ease-in-out infinite;
        }
        .hero-stat-top { top: 8%; right: 0; animation-delay: 0s; }
        .hero-stat-bottom { bottom: 12%; left: 0; animation-delay: 2s; }
        @keyframes floatBadge {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .hero-stat-num { font-size: 1.1rem; font-weight: 800; color: white; line-height: 1.2; }
        .hero-stat-label { font-size: 0.72rem; color: rgba(255,255,255,0.75); font-weight: 500; }
        .hero-car-placeholder {
          width: 100%; height: 100%;
          background: rgba(255,255,255,0.06); border: 2px dashed rgba(255,255,255,0.2);
          border-radius: 20px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.35); gap: 12px;
        }
        .hero-car-placeholder svg { opacity: 0.5; }
        .hero-car-placeholder span { font-size: 0.85rem; font-weight: 500; }

        /* FORM SECTION */
        .form-section { background: var(--bg); padding: 80px 5%; }
        .form-section-inner { max-width: 640px; margin: 0 auto; }
        .form-section-header { margin-bottom: 36px; }
        .form-section-header h2 {
          font-family: var(--font-head); font-size: clamp(1.8rem, 3vw, 2.4rem);
          font-weight: 800; letter-spacing: -1px; margin-bottom: 10px;
        }
        .form-section-header p { font-size: 1rem; color: var(--text2); }

        /* FORM CARD */
        .form-card-wrap { position: relative; }
        .form-scroll-hint {
          position: sticky; bottom: 0; left: 0; right: 0; height: 64px; pointer-events: none;
          background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 100%);
          display: flex; align-items: flex-end; justify-content: center; padding-bottom: 8px;
          border-radius: 0 0 24px 24px;
        }
        @keyframes bounceDown {
          0%,100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(5px); opacity: 1; }
        }
        .form-scroll-hint svg { animation: bounceDown 1.4s ease-in-out infinite; color: var(--green); }

        .hero-form-card {
          background: white; border-radius: 24px; padding: 36px;
          box-shadow: 0 20px 60px rgba(249,115,22,0.12), 0 2px 8px rgba(0,0,0,0.04);
          border: 1.5px solid var(--border); position: relative; z-index: 1;
        }
        .hero-form-card h3 {
          font-family: var(--font-head); font-size: 1.25rem; font-weight: 700;
          margin-bottom: 6px; color: var(--text);
        }
        .hero-form-card p { font-size: 0.88rem; color: var(--text2); margin-bottom: 24px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .form-group { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
        .form-group label { font-size: 0.8rem; font-weight: 600; color: var(--text2); letter-spacing: 0.3px; }
        .form-group input, .form-group select {
          border: 1.5px solid var(--border); border-radius: var(--radius-sm);
          padding: 10px 14px; font-size: 0.9rem; font-family: inherit; color: var(--text);
          background: var(--bg); transition: border-color 0.2s, box-shadow 0.2s; outline: none;
        }
        .form-group input:focus, .form-group select:focus {
          border-color: var(--green); box-shadow: 0 0 0 3px rgba(249,115,22,0.12);
        }
        .form-group input.err, .form-group select.err { border-color: #dc2626; }
        .err-msg { font-size: 0.75rem; color: #dc2626; }
        .gdpr-row { display: flex; align-items: flex-start; gap: 10px; margin: 14px 0; }
        .gdpr-row input[type="checkbox"] { margin-top: 3px; accent-color: var(--green); width: 16px; height: 16px; flex-shrink: 0; cursor: pointer; }
        .gdpr-row label { font-size: 0.8rem; color: var(--text2); cursor: pointer; line-height: 1.5; }
        .gdpr-row label a { color: var(--green); }
        .form-submit { width: 100%; padding: 13px; font-size: 1rem; border-radius: var(--radius-sm); }
        .success-box {
          text-align: center; padding: 32px 16px;
        }
        .success-icon {
          width: 60px; height: 60px; background: var(--green-light); border-radius: 50%;
          display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;
          color: var(--green);
        }
        .success-box h3 { font-family: var(--font-head); font-size: 1.3rem; font-weight: 700; margin-bottom: 8px; }
        .success-box p { font-size: 0.9rem; color: var(--text2); }

        /* REVEAL */
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .reveal.revealed { opacity: 1; transform: translateY(0); }
        .d1{transition-delay:0.1s} .d2{transition-delay:0.2s} .d3{transition-delay:0.3s} .d4{transition-delay:0.4s}

        /* SECTION COMMON */
        section { padding: 96px 5%; }
        .section-label {
          display: inline-block; font-size: 0.78rem; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; color: var(--green); margin-bottom: 12px;
        }
        .section-title {
          font-family: var(--font-head); font-size: clamp(1.9rem, 3.5vw, 2.8rem);
          font-weight: 800; line-height: 1.15; letter-spacing: -1px; margin-bottom: 16px;
        }
        .section-sub { font-size: 1.05rem; color: var(--text2); max-width: 560px; line-height: 1.7; }

        /* HOW IT WORKS */
        .how-section { background: white; }
        .how-inner { max-width: 1100px; margin: 0 auto; }
        .how-header { margin-bottom: 60px; }
        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .step-card {
          background: var(--bg); border: 1.5px solid var(--border); border-radius: var(--radius);
          padding: 36px 28px; position: relative; overflow: hidden; cursor: pointer;
          transition: transform 0.28s cubic-bezier(.22,.68,0,1.2), box-shadow 0.28s, border-color 0.28s, background 0.28s;
          opacity: 0;
          animation: cardIn 0.6s cubic-bezier(.22,.68,0,1.2) forwards;
        }
        .step-card:nth-child(1) { animation-delay: 0.1s; }
        .step-card:nth-child(2) { animation-delay: 0.22s; }
        .step-card:nth-child(3) { animation-delay: 0.34s; }
        .step-card:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 16px 48px rgba(249,115,22,0.18);
          border-color: var(--green);
          background: white;
        }
        .step-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--green), #fb923c);
          transform: scaleX(0); transition: transform 0.3s cubic-bezier(.22,.68,0,1.2); transform-origin: left;
        }
        .step-card:hover::before { transform: scaleX(1); }
        .step-num {
          font-family: var(--font-head); font-size: 3rem; font-weight: 800;
          color: var(--green-mid); line-height: 1; margin-bottom: 16px;
        }
        .step-icon {
          width: 52px; height: 52px; background: var(--green-light); border-radius: 14px;
          display: flex; align-items: center; justify-content: center; color: var(--green);
          margin-bottom: 20px;
        }
        .step-card h3 { font-family: var(--font-head); font-size: 1.15rem; font-weight: 700; margin-bottom: 10px; }
        .step-card p { font-size: 0.9rem; color: var(--text2); line-height: 1.65; }

        /* BENEFITS */
        .benefits-section { background: var(--bg); }
        .benefits-inner { max-width: 1100px; margin: 0 auto; }
        .benefits-header { margin-bottom: 56px; }
        .benefits-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
        .benefit-card {
          background: white; border: 1.5px solid var(--border); border-radius: var(--radius);
          padding: 32px; display: flex; gap: 20px;
          transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
        }
        .benefit-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-hover); border-color: var(--green); }
        .benefit-icon {
          width: 52px; height: 52px; background: var(--green-light); border-radius: 14px;
          display: flex; align-items: center; justify-content: center; color: var(--green); flex-shrink: 0;
        }
        .benefit-body h3 { font-family: var(--font-head); font-size: 1.05rem; font-weight: 700; margin-bottom: 8px; }
        .benefit-body p { font-size: 0.9rem; color: var(--text2); line-height: 1.65; }

        /* FAQ */
        .faq-section { background: white; }
        .faq-inner { max-width: 780px; margin: 0 auto; }
        .faq-header { margin-bottom: 48px; }
        .faq-list { display: flex; flex-direction: column; gap: 12px; }
        .faq-item {
          border: 1.5px solid var(--border); border-radius: var(--radius-sm);
          overflow: hidden; transition: border-color 0.2s;
        }
        .faq-item.open { border-color: var(--green); }
        .faq-q {
          width: 100%; background: none; border: none; text-align: left;
          padding: 20px 22px; font-size: 0.95rem; font-weight: 600; color: var(--text);
          font-family: inherit; cursor: pointer; display: flex; justify-content: space-between;
          align-items: center; gap: 16px;
        }
        .faq-icon {
          width: 28px; height: 28px; background: var(--green-light); border-radius: 50%;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--green);
          transition: transform 0.25s;
        }
        .faq-item.open .faq-icon { transform: rotate(45deg); background: var(--green); color: white; }
        .faq-a { padding: 0 22px 20px; font-size: 0.9rem; color: var(--text2); line-height: 1.7; }

        /* CTA BANNER */
        .cta-banner {
          margin: 0 5% 80px; background: linear-gradient(135deg, var(--green) 0%, #c2410c 100%);
          border-radius: 24px; padding: 56px 60px;
          display: flex; align-items: center; justify-content: space-between; gap: 32px;
        }
        .cta-banner h2 {
          font-family: var(--font-head); font-size: clamp(1.6rem, 2.8vw, 2.2rem);
          font-weight: 800; color: white; letter-spacing: -0.5px; margin-bottom: 8px;
        }
        .cta-banner p { color: rgba(255,255,255,0.8); font-size: 1rem; }
        .btn-white {
          background: white; color: var(--green-dark); border: none; border-radius: 50px;
          padding: 14px 30px; font-size: 1rem; font-weight: 700; font-family: inherit;
          cursor: pointer; transition: all 0.2s; white-space: nowrap; flex-shrink: 0;
        }
        .btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }

        /* FOOTER */
        footer {
          background: #1c0a03; padding: 56px 5% 32px;
          display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 48px;
        }
        .footer-logo { font-family: var(--font-head); font-size: 1.3rem; font-weight: 800; color: white; margin-bottom: 12px; }
        .footer-logo span { color: var(--green); }
        .footer-desc { font-size: 0.88rem; color: rgba(255,255,255,0.45); line-height: 1.7; max-width: 280px; }
        .footer-col h4 { font-size: 0.78rem; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 16px; }
        .footer-col a { display: block; font-size: 0.88rem; color: rgba(255,255,255,0.6); text-decoration: none; margin-bottom: 10px; transition: color 0.2s; }
        .footer-col a:hover { color: var(--green); }
        .footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); margin-top: 48px; padding-top: 24px; grid-column: 1/-1; display: flex; justify-content: space-between; align-items: center; }
        .footer-bottom p { font-size: 0.8rem; color: rgba(255,255,255,0.3); }

        /* RESPONSIVE */
        @media(max-width: 1024px) {
          .steps-grid { grid-template-columns: 1fr; max-width: 520px; margin: 0 auto; }
          .benefits-grid { grid-template-columns: 1fr; }
        }
        @media(max-width: 900px) {
          .hero { grid-template-columns: 1fr; padding-top: 100px; min-height: auto; }
          .hero-left { text-align: center; }
          .hero-pills, .hero-cta { justify-content: center; }
          .hero-car-wrap { height: 220px; }
          .hero-stat { display: flex; }
          .hero-pills { display: none; }
          .navbar-links { display: none; }
          footer { grid-template-columns: 1fr 1fr; }
          .footer-desc { display: none; }
          .cta-banner { flex-direction: column; text-align: center; }
        }
        @media(max-width: 600px) {
          .hero { padding: 90px 5% 60px; }
          .form-row { grid-template-columns: 1fr; }
          .hero-form-card { padding: 24px 18px; }
          section { padding: 64px 5%; }
          .cta-banner { padding: 40px 24px; margin: 0 4% 60px; }
          footer { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => scrollTo("hero")}>
          auto<span>srovnani</span>.cz
        </div>
        <ul className="navbar-links">
          {[["Jak to funguje", "jak"], ["Výhody", "vyhody"], ["FAQ", "faq"]].map(([label, id]) => (
            <li key={id}><a href="#" onClick={(e) => { e.preventDefault(); scrollTo(id); }}>{label}</a></li>
          ))}
        </ul>
        <button className="btn-primary" onClick={() => scrollTo("hero-form")}>
          Získat nabídky zdarma
        </button>
      </nav>

      {/* HERO */}
      <section id="hero" className="hero">
        {/* Decorative background SVG */}
        <svg className="hero-road-svg" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          {/* Glow top-left */}
          <ellipse cx="100" cy="80" rx="320" ry="180" fill="rgba(255,255,255,0.06)"/>
          {/* Large decorative rings */}
          <circle cx="980" cy="300" r="260" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"/>
          <circle cx="980" cy="300" r="190" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5"/>
          <circle cx="980" cy="300" r="120" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5"/>
          {/* Bottom right glow */}
          <ellipse cx="1100" cy="560" rx="200" ry="120" fill="rgba(255,255,255,0.05)"/>
        </svg>

        <div className="hero-left">
          <h1>
            Prodejte auto<br />
            za <span className="accent">nejvyšší cenu.</span><br />
            Bez objíždění.
          </h1>
          <p>
            Zadejte auto jednou. My oslovíme prověřené bazary, necháme je soutěžit a pošleme vám srovnání nabídek. Vy vyberete tu nejlepší.
          </p>
          <div className="hero-pills">
            {["Průměrně o 18 000 Kč více", "Výsledek do 24 hodin", "Žádné závazky"].map((t) => (
              <span key={t} className="hero-pill">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                {t}
              </span>
            ))}
          </div>
          <div className="hero-cta">
            <button className="btn-hero-primary" onClick={() => scrollTo("hero-form")}>
              Chci nabídky zdarma
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <button className="btn-hero-outline" onClick={() => scrollTo("jak")}>Jak to funguje?</button>
          </div>
        </div>

        {/* CAR IMAGE */}
        <div className="hero-car-wrap">
          {/* Glow behind car */}
          <div className="hero-car-glow" />
          <Image
            src="/images/Návrh bez názvu.svg"
            alt="Auto k prodeji"
            fill
            style={{ objectFit: "contain", objectPosition: "center bottom", filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.25))" }}
            priority
          />
          {/* Floating stat badges */}
          <div className="hero-stat hero-stat-top">
            <span className="hero-stat-num">500+</span>
            <span className="hero-stat-label">prověřených bazarů</span>
          </div>
          <div className="hero-stat hero-stat-bottom">
            <span className="hero-stat-num">18 000 Kč</span>
            <span className="hero-stat-label">průměrný rozdíl v nabídkách</span>
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section id="hero-form" className="form-section">
        <div className="form-section-inner">
          <div className="form-section-header">
            <h2>Zadejte auto a získejte nabídky</h2>
            <p>Zabere to 2 minuty. Výsledek do 24 hodin.</p>
          </div>
          <div className="form-card-wrap">
          <div className="hero-form-card" style={{ maxHeight: "70vh", overflowY: "auto", scrollbarWidth: "thin" }}>
            {submitted ? (
              <div className="success-box">
                <div className="success-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <h3>Poptávka odeslána!</h3>
                <p>Oslovujeme bazary. Srovnání nabídek vám pošleme <strong>do 24 hodin</strong> na zadaný email.</p>
              </div>
            ) : (
              <>
                <h3 style={{ marginBottom: 4 }}>Zadejte auto</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text2)", marginBottom: 20 }}>
                  Každý krok se odkryje postupně — zabere to 2 minuty.
                </p>
                <CarWizard onSubmit={handleWizardSubmit} loading={loading} />
              </>
            )}
          </div>
          <div className="form-scroll-hint">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
          </div>
        </div>
      </section>

      {/* JAK TO FUNGUJE */}
      <section id="jak" className="how-section">
        <div className="how-inner">
          <div className="how-header reveal">
            <span className="section-label">Postup</span>
            <h2 className="section-title">Jak to funguje?</h2>
            <p className="section-sub">Tři jednoduché kroky. Žádné volání bazarů, žádné čekání v čekárnách.</p>
          </div>
          <div className="steps-grid">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`step-card${activeStep === i ? " active" : ""}`}
                onMouseEnter={() => setActiveStep(i)}
              >
                <div className="step-num">{s.num}</div>
                <div className="step-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VÝHODY */}
      <section id="vyhody" className="benefits-section">
        <div className="benefits-inner">
          <div className="benefits-header reveal">
            <span className="section-label">Proč přes nás</span>
            <h2 className="section-title">Prodejte lépe než<br />do prvního bazaru</h2>
            <p className="section-sub">Jeden bazar vám nabídne tržní minimum. Deset bazarů v soutěži — to je úplně jiná hra.</p>
          </div>
          <div className="benefits-grid">
            {benefits.map((b, i) => (
              <div key={i} className={`benefit-card reveal d${(i % 2) + 1}`}>
                <div className="benefit-icon">{b.icon}</div>
                <div className="benefit-body">
                  <h3>{b.title}</h3>
                  <p>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="faq-section">
        <div className="faq-inner">
          <div className="faq-header reveal">
            <span className="section-label">Časté dotazy</span>
            <h2 className="section-title">Máte otázky?</h2>
            <p className="section-sub">Nejčastější dotazy od prodávajících, kteří zvažují naši službu.</p>
          </div>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div key={i} className={`faq-item reveal d${(i % 3) + 1}${openFaq === i ? " open" : ""}`}>
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {f.q}
                  <div className="faq-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                  </div>
                </button>
                {openFaq === i && <div className="faq-a">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <div className="cta-banner reveal">
        <div>
          <h2>Zjistěte, kolik vaše auto skutečně stojí.</h2>
          <p>Zadejte auto za 3 minuty. Nabídky pošleme do 24 hodin. Zdarma.</p>
        </div>
        <button className="btn-white" onClick={() => scrollTo("hero-form")}>
          Začít zdarma →
        </button>
      </div>

      {/* FOOTER */}
      <footer>
        <div>
          <div className="footer-logo">auto<span>srovnani</span>.cz</div>
          <p className="footer-desc">Srovnáváme nabídky bazarů, aby prodávající dostali za auto maximum. Zdarma.</p>
        </div>
        <div className="footer-col">
          <h4>Navigace</h4>
          {[["Jak to funguje", "jak"], ["Výhody", "vyhody"], ["FAQ", "faq"]].map(([l, id]) => (
            <a key={id} href="#" onClick={(e) => { e.preventDefault(); scrollTo(id); }}>{l}</a>
          ))}
        </div>
        <div className="footer-col">
          <h4>Právní</h4>
          <a href="#">Ochrana osobních údajů</a>
          <a href="#">Podmínky použití</a>
          <a href="#">Pro autobazary</a>
        </div>
        <div className="footer-bottom">
          <p>© 2025 autosrovnani.cz — Všechna práva vyhrazena</p>
          <p>Služba pro prodávající je 100% zdarma</p>
        </div>
      </footer>
    </>
  );
}
