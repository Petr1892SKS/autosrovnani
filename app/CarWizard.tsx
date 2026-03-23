"use client";
import { useState, useRef } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const CAR_DATA: Record<string, string[]> = {
  "Škoda": ["Citigo","Fabia","Fabia Combi","Rapid","Scala","Octavia","Octavia Combi","Octavia RS","Superb","Superb Combi","Enyaq","Kamiq","Karoq","Kodiaq","Kodiaq RS","Roomster","Yeti"],
  "Volkswagen": ["Polo","Golf","Golf Variant","Golf GTI","Golf R","Passat","Passat Variant","Arteon","T-Roc","T-Cross","Tiguan","Tiguan Allspace","Touareg","ID.3","ID.4","ID.5","ID.7","Sharan","Touran","Caddy","Transporter","Up!","Amarok"],
  "Ford": ["Fiesta","Focus","Focus Combi","Focus ST","Mondeo","Mondeo Combi","Mustang","Mustang Mach-E","Puma","EcoSport","Kuga","Edge","Explorer","Ranger","Transit","Transit Custom","Transit Connect","Galaxy","S-Max","C-Max","B-Max","Ka"],
  "BMW": ["Řada 1","Řada 2","Řada 2 Active Tourer","Řada 3","Řada 3 Touring","Řada 4","Řada 4 Gran Coupé","Řada 5","Řada 5 Touring","Řada 6 Gran Turismo","Řada 7","Řada 8","X1","X2","X3","X4","X5","X6","X7","iX","iX1","iX3","i3","i4","i5","i7","M2","M3","M4","M5","Z4"],
  "Audi": ["A1","A1 Sportback","A3","A3 Sportback","A3 Limousine","A4","A4 Avant","A5","A5 Sportback","A6","A6 Avant","A7","A8","Q2","Q3","Q3 Sportback","Q4 e-tron","Q5","Q5 Sportback","Q7","Q8","e-tron","e-tron GT","RS3","RS4","RS5","RS6","RS7","S3","S4","S5","TT"],
  "Toyota": ["Aygo","Aygo X","Yaris","Yaris Cross","Corolla","Corolla Touring Sports","Corolla GR Sport","Camry","C-HR","RAV4","Highlander","Land Cruiser","Land Cruiser Prado","Hilux","Proace","Proace City","GR86","GR Yaris","bZ4X","Prius"],
  "Hyundai": ["i10","i20","i30","i30 Fastback","i30 N","i30 Wagon","Elantra","Sonata","Bayon","Kona","Kona Electric","Tucson","Santa Fe","Ioniq","Ioniq 5","Ioniq 6","Staria","H-1"],
  "Kia": ["Picanto","Rio","Ceed","Ceed SW","ProCeed","Xceed","Stonic","Niro","Niro EV","Sportage","Sorento","Telluride","EV6","EV9","Soul","Stinger","Carnival"],
  "Renault": ["Twingo","Clio","Clio Grandtour","Captur","Mégane","Mégane Grandtour","Mégane E-Tech","Talisman","Talisman Grandtour","Arkana","Kadjar","Koleos","Austral","Espace","Scenic","ZOE","Kangoo","Trafic","Master","Duster"],
  "Peugeot": ["108","208","e-208","308","308 SW","e-308","408","508","508 SW","2008","e-2008","3008","e-3008","5008","e-5008","Rifter","Traveller","Expert","Boxer"],
  "Opel": ["Karl","Corsa","Corsa-e","Astra","Astra Sports Tourer","Astra-e","Insignia","Insignia Sports Tourer","Crossland","Grandland","Grandland X","Mokka","Mokka-e","Zafira","Combo","Vivaro","Movano"],
  "Mercedes-Benz": ["A-třída","B-třída","C-třída","C-třída Kombi","E-třída","E-třída Kombi","S-třída","CLA","CLA Shooting Brake","CLS","GLA","GLB","GLC","GLE","GLS","AMG GT","EQA","EQB","EQC","EQE","EQS","Vito","Sprinter","Citan","Marco Polo"],
  "Seat": ["Mii","Ibiza","Leon","Leon Sportstourer","Leon FR","Arona","Ateca","Tarraco","Alhambra"],
  "Nissan": ["Micra","Note","Juke","Qashqai","X-Trail","Ariya","Leaf","Navara","NV200","Townstar"],
  "Mazda": ["Mazda2","Mazda3","Mazda3 Fastback","Mazda6","Mazda6 Combi","CX-3","CX-30","CX-5","CX-60","CX-80","MX-5","MX-30"],
  "Citroën": ["C1","C3","C3 Aircross","C4","ë-C4","C5 Aircross","C5 X","Berlingo","Jumpy","Dispatch","SpaceTourer"],
  "Fiat": ["500","500e","500X","500L","Panda","Tipo","Tipo Combi","Doblo","Ducato","Fiorino"],
  "Volvo": ["V40","V60","V60 Cross Country","V90","V90 Cross Country","S60","S90","XC40","XC60","XC90","C40 Recharge"],
  "Jeep": ["Renegade","Compass","Cherokee","Grand Cherokee","Wrangler","Avenger"],
  "Dacia": ["Sandero","Sandero Stepway","Logan","Logan MCV","Duster","Jogger","Spring"],
};

const BRANDS = Object.keys(CAR_DATA).sort();
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1989 }, (_, i) => String(currentYear - i));

const FUELS = ["Benzín","Diesel","Hybrid","Plug-in hybrid","Elektromotor","LPG","CNG"];
const GEARBOXES = ["Automatická","Manuální"];
const BODY_TYPES = ["Hatchback","Sedan","Kombi","SUV","Kupé","MPV","Kabriolet","Off road","Pickup","Dodávka","Bus"];
const DRIVES = ["Přední","Zadní","4x4"];
const SEATS = ["2","4","5","6","7","8","9+"];

// ─── TYPES ──────────────────────────────────────────────────────────────────

export type WizardData = {
  brand: string;
  model: string;
  year: string;
  km: string;
  gearbox: string;
  fuel: string;
  bodyType: string;
  engineCcm: string;
  engineKw: string;
  drive: string;
  seats: string;
  czOrigin: string;
  vatDeductible: string;
  serviceBook: string;
  factoryWarranty: string;
  aircon: string;
  name: string;
  phone: string;
  email: string;
  gdpr: boolean;
  photos: File[];
};

type StepId =
  | "car" | "km" | "gearbox" | "fuel" | "body"
  | "engine" | "extras" | "photos" | "contact";

// ─── HELPERS ────────────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);

const CarAngleIcon = ({ angle }: { angle: string }) => {
  const color = "var(--green, #f97316)";
  if (angle === "interior") return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="2"/>
    </svg>
  );
  if (angle === "engine") return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <rect x="3" y="8" width="18" height="8" rx="2"/><path d="M7 8V6M12 8V5M17 8V6M3 12h1M20 12h1"/>
    </svg>
  );
  // front, rear, side-l, side-r — all use car silhouette with direction arrow
  if (angle === "front") return (
    <svg width="36" height="28" viewBox="0 0 36 28" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round">
      <rect x="4" y="10" width="28" height="12" rx="3"/>
      <path d="M8 10L11 4h14l3 6"/>
      <circle cx="9" cy="22" r="3"/><circle cx="27" cy="22" r="3"/>
      <rect x="12" y="5" width="12" height="5" rx="1" opacity=".4"/>
      <path d="M4 14h2M30 14h2" strokeWidth="1"/>
    </svg>
  );
  if (angle === "rear") return (
    <svg width="36" height="28" viewBox="0 0 36 28" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round">
      <rect x="4" y="10" width="28" height="12" rx="3"/>
      <path d="M8 10L11 4h14l3 6"/>
      <circle cx="9" cy="22" r="3"/><circle cx="27" cy="22" r="3"/>
      <rect x="6" y="11" width="5" height="3" rx="1" opacity=".5"/>
      <rect x="25" y="11" width="5" height="3" rx="1" opacity=".5"/>
      <rect x="13" y="11" width="10" height="4" rx="1" opacity=".3"/>
    </svg>
  );
  // side-r / side-l
  return (
    <svg width="40" height="24" viewBox="0 0 40 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round"
      style={angle === "side-l" ? { transform: "scaleX(-1)" } : {}}>
      <path d="M2 16h36"/>
      <path d="M4 16V12c0 0 3-6 10-7h10c4 0 8 3 10 7v4"/>
      <circle cx="11" cy="16" r="3.5"/><circle cx="29" cy="16" r="3.5"/>
      <path d="M14 9c2-3 5-4 8-4h4" opacity=".5"/>
    </svg>
  );
};

// ─── CHIP BUTTON ────────────────────────────────────────────────────────────

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" className={`wiz-chip${active ? " active" : ""}`} onClick={onClick}>
      {label}
    </button>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

type Props = {
  onSubmit: (data: WizardData) => void;
  loading?: boolean;
};

export default function CarWizard({ onSubmit, loading }: Props) {
  const [data, setData] = useState<WizardData>({
    brand: "", model: "", year: "", km: "",
    gearbox: "", fuel: "", bodyType: "", engineCcm: "", engineKw: "",
    drive: "", seats: "", czOrigin: "", vatDeductible: "",
    serviceBook: "", factoryWarranty: "", aircon: "",
    name: "", phone: "", email: "", gdpr: false, photos: [],
  });

  // which steps have been unlocked
  const STEP_ORDER: StepId[] = ["car","km","gearbox","fuel","body","engine","extras","photos","contact"];
  const [unlockedUpTo, setUnlockedUpTo] = useState(0); // index in STEP_ORDER
  const stepRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const set = <K extends keyof WizardData>(k: K, v: WizardData[K]) => {
    setData(prev => ({ ...prev, [k]: v }));
  };

  // unlock next step and scroll to it
  const unlock = (currentIdx: number) => {
    const next = currentIdx + 1;
    if (next > unlockedUpTo) {
      setUnlockedUpTo(next);
      setTimeout(() => {
        const nextId = STEP_ORDER[next];
        const el = stepRefs.current[nextId];
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 90;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 80);
    }
  };

  // auto-advance when a value is picked
  const pick = <K extends keyof WizardData>(k: K, v: WizardData[K], stepIdx: number) => {
    set(k, v);
    unlock(stepIdx);
  };

  const stepDone: Record<StepId, boolean> = {
    car: !!(data.brand && data.model && data.year),
    km: !!data.km,
    gearbox: !!data.gearbox,
    fuel: !!data.fuel,
    body: !!data.bodyType,
    engine: !!(data.engineCcm || data.engineKw),
    extras: !!(data.czOrigin && data.aircon),
    photos: data.photos.length >= 3,
    contact: !!(data.name && data.phone && data.email && data.gdpr),
  };

  const [errors, setErrors] = useState<Partial<Record<keyof WizardData | "gdpr_err", string>>>({});

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!data.name.trim()) errs.name = "Povinné";
    if (!data.phone.trim()) errs.phone = "Povinné";
    if (!data.email.trim() || !data.email.includes("@")) errs.email = "Platný email";
    if (!data.gdpr) errs.gdpr_err = "Nutný souhlas";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit(data);
  };

  const isUnlocked = (idx: number) => idx <= unlockedUpTo;

  return (
    <>
      <style>{`
        .wizard { display: flex; flex-direction: column; gap: 0; }

        .wiz-step {
          border-left: 2px solid var(--border, #d1fae5);
          margin-left: 20px;
          padding-left: 24px;
          padding-bottom: 4px;
          position: relative;
        }
        .wiz-step:last-child { border-left: 2px solid transparent; }

        .wiz-bullet {
          position: absolute; left: -13px; top: 18px;
          width: 24px; height: 24px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.72rem; font-weight: 700;
          border: 2px solid var(--border, #d1fae5);
          background: white; color: var(--text2, #4b5e50);
          transition: all 0.3s;
        }
        .wiz-step.done .wiz-bullet {
          background: var(--green, #16a34a); border-color: var(--green, #16a34a); color: white;
        }
        .wiz-step.active .wiz-bullet {
          border-color: var(--green, #16a34a); color: var(--green, #16a34a);
        }
        .wiz-step.locked { opacity: 0.35; pointer-events: none; }

        .wiz-header {
          display: flex; align-items: center; gap: 8px;
          padding: 14px 0 12px; cursor: default;
        }
        .wiz-title {
          font-size: 0.9rem; font-weight: 700; color: var(--text, #0d1f0f);
        }
        .wiz-required { color: var(--green, #16a34a); font-size: 0.85rem; }
        .wiz-summary {
          font-size: 0.8rem; color: var(--text2, #4b5e50);
          background: var(--green-xlight, #f0fdf4); border-radius: 6px;
          padding: 3px 10px; margin-left: auto;
        }

        .wiz-body { padding-bottom: 20px; }

        /* SELECT */
        .wiz-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
        .wiz-group { display: flex; flex-direction: column; gap: 4px; }
        .wiz-group label { font-size: 0.75rem; font-weight: 600; color: var(--text2); letter-spacing: 0.3px; }
        .wiz-select {
          border: 1.5px solid var(--border, #d1fae5); border-radius: 10px;
          padding: 10px 36px 10px 14px; font-size: 0.9rem; font-family: inherit;
          color: var(--text, #0d1f0f); background: var(--bg, #f7fdf8);
          appearance: none; outline: none; cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234b5e50' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 12px center;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .wiz-select:focus { border-color: var(--green, #16a34a); box-shadow: 0 0 0 3px rgba(22,163,74,0.12); }
        .wiz-select:disabled { opacity: 0.4; cursor: not-allowed; }

        /* INPUT */
        .wiz-input-wrap { position: relative; }
        .wiz-input {
          width: 100%; border: 1.5px solid var(--border, #d1fae5); border-radius: 10px;
          padding: 10px 14px; font-size: 0.9rem; font-family: inherit;
          color: var(--text, #0d1f0f); background: var(--bg, #f7fdf8);
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .wiz-input:focus { border-color: var(--green, #16a34a); box-shadow: 0 0 0 3px rgba(22,163,74,0.12); }
        .wiz-input.err { border-color: #dc2626; }
        .wiz-unit {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          font-size: 0.8rem; font-weight: 600; color: var(--text3, #7a9080);
        }
        .wiz-err { font-size: 0.75rem; color: #dc2626; margin-top: 3px; }

        /* CHIPS */
        .wiz-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 4px; }
        .wiz-chip {
          border: 1.5px solid var(--border, #d1fae5); border-radius: 8px;
          padding: 7px 14px; font-size: 0.83rem; font-weight: 500; font-family: inherit;
          color: var(--text, #0d1f0f); background: white; cursor: pointer;
          transition: all 0.15s;
        }
        .wiz-chip:hover { border-color: var(--green, #16a34a); color: var(--green, #16a34a); }
        .wiz-chip.active { background: var(--green, #16a34a); border-color: var(--green, #16a34a); color: white; }

        /* CONTINUE BTN */
        .wiz-continue {
          margin-top: 14px; background: var(--green, #16a34a); color: white;
          border: none; border-radius: 50px; padding: 10px 22px;
          font-size: 0.88rem; font-weight: 600; font-family: inherit;
          cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px;
        }
        .wiz-continue:hover { background: var(--green-dark, #15803d); transform: translateY(-1px); }
        .wiz-continue:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        /* GDPR */
        .wiz-gdpr { display: flex; align-items: flex-start; gap: 10px; margin: 12px 0; }
        .wiz-gdpr input[type="checkbox"] { margin-top: 3px; accent-color: var(--green); width: 16px; height: 16px; flex-shrink: 0; }
        .wiz-gdpr label { font-size: 0.8rem; color: var(--text2); line-height: 1.5; cursor: pointer; }
        .wiz-gdpr a { color: var(--green); }

        /* SUBMIT */
        .wiz-submit {
          width: 100%; padding: 13px; border-radius: 10px;
          background: var(--green, #16a34a); color: white; border: none;
          font-size: 1rem; font-weight: 700; font-family: inherit;
          cursor: pointer; transition: all 0.2s; margin-top: 4px;
        }
        .wiz-submit:hover { background: var(--green-dark, #15803d); }
        .wiz-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        /* PHOTO UPLOAD */
        .photo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px; }
        .photo-slot {
          border: 1.5px dashed var(--border, #d1fae5); border-radius: 12px;
          aspect-ratio: 4/3; display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 6px; cursor: pointer; position: relative;
          overflow: hidden; transition: border-color 0.2s, background 0.2s;
          background: var(--bg, #f7fdf8);
        }
        .photo-slot:hover { border-color: var(--green, #f97316); background: white; }
        .photo-slot.filled { border-style: solid; border-color: var(--green, #f97316); }
        .photo-slot input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
        .photo-slot-label { font-size: 0.68rem; font-weight: 600; color: var(--text2); text-align: center; line-height: 1.3; }
        .photo-slot-req { font-size: 0.6rem; color: var(--green, #f97316); font-weight: 700; }
        .photo-preview { position: absolute; inset: 0; object-fit: cover; width: 100%; height: 100%; border-radius: 10px; }
        .photo-preview-overlay {
          position: absolute; inset: 0; background: rgba(0,0,0,0.45); opacity: 0;
          transition: opacity 0.2s; display: flex; align-items: center; justify-content: center;
          color: white; font-size: 0.72rem; font-weight: 600; border-radius: 10px;
        }
        .photo-slot:hover .photo-preview-overlay { opacity: 1; }
        .photo-count { font-size: 0.78rem; color: var(--text2); margin-bottom: 12px; }
        .photo-count span { font-weight: 700; color: var(--green, #f97316); }

        /* ANIMATE IN */
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .wiz-body { animation: slideDown 0.3s ease; }

        @media(max-width: 600px) {
          .wiz-row { grid-template-columns: 1fr; }
          .wiz-step { margin-left: 14px; padding-left: 18px; }
        }
      `}</style>

      <form className="wizard" onSubmit={handleSubmit} noValidate>

        {/* ── STEP 1: AUTO ── */}
        <div
          ref={el => { stepRefs.current["car"] = el; }}
          className={`wiz-step${stepDone.car ? " done" : isUnlocked(0) ? " active" : " locked"}`}
        >
          <div className="wiz-bullet">{stepDone.car ? <CheckIcon /> : "1"}</div>
          <div className="wiz-header">
            <span className="wiz-title">Vozidlo <span className="wiz-required">*</span></span>
            {stepDone.car && (
              <span className="wiz-summary">{data.brand} {data.model}, {data.year}</span>
            )}
          </div>
          {isUnlocked(0) && (
            <div className="wiz-body">
              <div className="wiz-row">
                <div className="wiz-group">
                  <label>Značka</label>
                  <select className="wiz-select" value={data.brand} onChange={e => { set("brand", e.target.value); set("model", ""); }}>
                    <option value="">Vyberte značku</option>
                    {BRANDS.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div className="wiz-group">
                  <label>Model</label>
                  <select className="wiz-select" value={data.model} onChange={e => set("model", e.target.value)} disabled={!data.brand}>
                    <option value="">{data.brand ? "Vyberte model" : "Nejdřív značku"}</option>
                    {(CAR_DATA[data.brand] ?? []).map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div className="wiz-group" style={{ marginBottom: 12 }}>
                <label>Rok výroby</label>
                <select className="wiz-select" value={data.year} onChange={e => set("year", e.target.value)}>
                  <option value="">Vyberte rok</option>
                  {YEARS.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
              <button
                type="button" className="wiz-continue"
                disabled={!stepDone.car}
                onClick={() => unlock(0)}
              >
                Pokračovat
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          )}
        </div>

        {/* ── STEP 2: KILOMETRY ── */}
        <div
          ref={el => { stepRefs.current["km"] = el; }}
          className={`wiz-step${stepDone.km ? " done" : isUnlocked(1) ? " active" : " locked"}`}
        >
          <div className="wiz-bullet">{stepDone.km ? <CheckIcon /> : "2"}</div>
          <div className="wiz-header">
            <span className="wiz-title">Najeto <span className="wiz-required">*</span></span>
            {stepDone.km && <span className="wiz-summary">{Number(data.km).toLocaleString("cs-CZ")} km</span>}
          </div>
          {isUnlocked(1) && (
            <div className="wiz-body">
              <div className="wiz-input-wrap" style={{ maxWidth: 220 }}>
                <input
                  className="wiz-input" type="number" placeholder="např. 120000"
                  value={data.km} min={0} max={999999}
                  onChange={e => set("km", e.target.value)}
                  onBlur={() => { if (data.km) unlock(1); }}
                />
                <span className="wiz-unit">km</span>
              </div>
              <button type="button" className="wiz-continue" style={{ marginTop: 12 }} disabled={!data.km} onClick={() => unlock(1)}>
                Pokračovat <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          )}
        </div>

        {/* ── STEP 3: PŘEVODOVKA ── */}
        <div
          ref={el => { stepRefs.current["gearbox"] = el; }}
          className={`wiz-step${stepDone.gearbox ? " done" : isUnlocked(2) ? " active" : " locked"}`}
        >
          <div className="wiz-bullet">{stepDone.gearbox ? <CheckIcon /> : "3"}</div>
          <div className="wiz-header">
            <span className="wiz-title">Převodovka <span className="wiz-required">*</span></span>
            {stepDone.gearbox && <span className="wiz-summary">{data.gearbox}</span>}
          </div>
          {isUnlocked(2) && (
            <div className="wiz-body">
              <div className="wiz-chips">
                {GEARBOXES.map(g => (
                  <Chip key={g} label={g} active={data.gearbox === g} onClick={() => pick("gearbox", g, 2)} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── STEP 4: PALIVO ── */}
        <div
          ref={el => { stepRefs.current["fuel"] = el; }}
          className={`wiz-step${stepDone.fuel ? " done" : isUnlocked(3) ? " active" : " locked"}`}
        >
          <div className="wiz-bullet">{stepDone.fuel ? <CheckIcon /> : "4"}</div>
          <div className="wiz-header">
            <span className="wiz-title">Palivo <span className="wiz-required">*</span></span>
            {stepDone.fuel && <span className="wiz-summary">{data.fuel}</span>}
          </div>
          {isUnlocked(3) && (
            <div className="wiz-body">
              <div className="wiz-chips">
                {FUELS.map(f => (
                  <Chip key={f} label={f} active={data.fuel === f} onClick={() => pick("fuel", f, 3)} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── STEP 5: KAROSERIE ── */}
        <div
          ref={el => { stepRefs.current["body"] = el; }}
          className={`wiz-step${stepDone.body ? " done" : isUnlocked(4) ? " active" : " locked"}`}
        >
          <div className="wiz-bullet">{stepDone.body ? <CheckIcon /> : "5"}</div>
          <div className="wiz-header">
            <span className="wiz-title">Karoserie <span className="wiz-required">*</span></span>
            {stepDone.body && <span className="wiz-summary">{data.bodyType}</span>}
          </div>
          {isUnlocked(4) && (
            <div className="wiz-body">
              <div className="wiz-chips">
                {BODY_TYPES.map(b => (
                  <Chip key={b} label={b} active={data.bodyType === b} onClick={() => pick("bodyType", b, 4)} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── STEP 6: MOTOR ── */}
        <div
          ref={el => { stepRefs.current["engine"] = el; }}
          className={`wiz-step${stepDone.engine ? " done" : isUnlocked(5) ? " active" : " locked"}`}
        >
          <div className="wiz-bullet">{stepDone.engine ? <CheckIcon /> : "6"}</div>
          <div className="wiz-header">
            <span className="wiz-title">Motor</span>
            {stepDone.engine && <span className="wiz-summary">{data.engineCcm ? `${data.engineCcm} ccm` : ""}{data.engineCcm && data.engineKw ? " / " : ""}{data.engineKw ? `${data.engineKw} kW` : ""}</span>}
          </div>
          {isUnlocked(5) && (
            <div className="wiz-body">
              <div className="wiz-row">
                <div className="wiz-group">
                  <label>Objem motoru</label>
                  <div className="wiz-input-wrap">
                    <input className="wiz-input" type="number" placeholder="1500" value={data.engineCcm} onChange={e => set("engineCcm", e.target.value)} />
                    <span className="wiz-unit">ccm</span>
                  </div>
                </div>
                <div className="wiz-group">
                  <label>Výkon motoru</label>
                  <div className="wiz-input-wrap">
                    <input className="wiz-input" type="number" placeholder="110" value={data.engineKw} onChange={e => set("engineKw", e.target.value)} />
                    <span className="wiz-unit">kW</span>
                  </div>
                </div>
              </div>
              <div className="wiz-row">
                <div className="wiz-group">
                  <label>Pohon</label>
                  <div className="wiz-chips" style={{ marginTop: 2 }}>
                    {DRIVES.map(d => (
                      <Chip key={d} label={d} active={data.drive === d} onClick={() => set("drive", d)} />
                    ))}
                  </div>
                </div>
                <div className="wiz-group">
                  <label>Míst k sezení</label>
                  <select className="wiz-select" value={data.seats} onChange={e => set("seats", e.target.value)}>
                    <option value="">Vyberte</option>
                    {SEATS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <button type="button" className="wiz-continue" disabled={!stepDone.engine} onClick={() => unlock(5)}>
                Pokračovat <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          )}
        </div>

        {/* ── STEP 7: EXTRAS ── */}
        <div
          ref={el => { stepRefs.current["extras"] = el; }}
          className={`wiz-step${stepDone.extras ? " done" : isUnlocked(6) ? " active" : " locked"}`}
        >
          <div className="wiz-bullet">{stepDone.extras ? <CheckIcon /> : "7"}</div>
          <div className="wiz-header">
            <span className="wiz-title">Doplňující info</span>
          </div>
          {isUnlocked(6) && (
            <div className="wiz-body">
              {[
                { label: "Vozidlo koupené jako nové v ČR?", key: "czOrigin" as const },
                { label: "Možnost odpočtu DPH", key: "vatDeductible" as const },
                { label: "Servisní knížka", key: "serviceBook" as const },
                { label: "Tovární záruka", key: "factoryWarranty" as const },
                { label: "Klimatizace", key: "aircon" as const },
              ].map(({ label, key }) => (
                <div key={key} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text2)", marginBottom: 6 }}>{label}</div>
                  <div className="wiz-chips">
                    {["Ano","Ne"].map(v => (
                      <Chip key={v} label={v} active={data[key] === v} onClick={() => set(key, v)} />
                    ))}
                  </div>
                </div>
              ))}
              <button type="button" className="wiz-continue" disabled={!stepDone.extras} onClick={() => unlock(6)}>
                Pokračovat <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          )}
        </div>

        {/* ── STEP 8: FOTOGRAFIE ── */}
        <div
          ref={el => { stepRefs.current["photos"] = el; }}
          className={`wiz-step${stepDone.photos ? " done" : isUnlocked(7) ? " active" : " locked"}`}
        >
          <div className="wiz-bullet">{stepDone.photos ? <CheckIcon /> : "8"}</div>
          <div className="wiz-header">
            <span className="wiz-title">Fotografie auta <span className="wiz-required">*</span></span>
            {!isUnlocked(7) && <span className="wiz-hint">min. 3 fotky</span>}
          </div>
          {isUnlocked(7) && (
            <div className="wiz-body">
              <div className="photo-count">Nahráno: <span>{data.photos.length}</span> / doporučeno 6 (min. 3)</div>
              <div className="photo-grid">
                {[
                  { label: "Přední část", req: true, angle: "front" },
                  { label: "Pravý bok", req: true, angle: "side-r" },
                  { label: "Zadní část", req: true, angle: "rear" },
                  { label: "Levý bok", req: false, angle: "side-l" },
                  { label: "Interiér", req: false, angle: "interior" },
                  { label: "Motor", req: false, angle: "engine" },
                ].map((slot, idx) => {
                  const file = data.photos[idx];
                  const previewUrl = file ? URL.createObjectURL(file) : null;
                  return (
                    <div key={slot.angle} className={`photo-slot${file ? " filled" : ""}`}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const next = [...data.photos];
                          next[idx] = f;
                          set("photos", next);
                        }}
                      />
                      {previewUrl ? (
                        <>
                          <img src={previewUrl} className="photo-preview" alt={slot.label} />
                          <div className="photo-preview-overlay">Změnit</div>
                        </>
                      ) : (
                        <>
                          <CarAngleIcon angle={slot.angle} />
                          <span className="photo-slot-label">{slot.label}</span>
                          {slot.req && <span className="photo-slot-req">povinná</span>}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              <button type="button" className="wiz-continue" disabled={!stepDone.photos} onClick={() => unlock(7)}>
                Pokračovat <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          )}
        </div>

        {/* ── STEP 9: KONTAKT ── */}
        <div
          ref={el => { stepRefs.current["contact"] = el; }}
          className={`wiz-step${stepDone.contact ? " done" : isUnlocked(8) ? " active" : " locked"}`}
          style={{ borderLeft: "2px solid transparent" }}
        >
          <div className="wiz-bullet">{stepDone.contact ? <CheckIcon /> : "9"}</div>
          <div className="wiz-header">
            <span className="wiz-title">Vaše kontaktní údaje <span className="wiz-required">*</span></span>
          </div>
          {isUnlocked(7) && (
            <div className="wiz-body">
              <div className="wiz-group" style={{ marginBottom: 10 }}>
                <label>Jméno a příjmení</label>
                <input className={`wiz-input${errors.name ? " err" : ""}`} placeholder="Jan Novák" value={data.name} onChange={e => { set("name", e.target.value); setErrors(p => ({ ...p, name: undefined })); }} />
                {errors.name && <div className="wiz-err">{errors.name}</div>}
              </div>
              <div className="wiz-row">
                <div className="wiz-group">
                  <label>Telefon</label>
                  <input className={`wiz-input${errors.phone ? " err" : ""}`} placeholder="+420 xxx xxx xxx" value={data.phone} onChange={e => { set("phone", e.target.value); setErrors(p => ({ ...p, phone: undefined })); }} />
                  {errors.phone && <div className="wiz-err">{errors.phone}</div>}
                </div>
                <div className="wiz-group">
                  <label>Email</label>
                  <input className={`wiz-input${errors.email ? " err" : ""}`} placeholder="jan@email.cz" value={data.email} onChange={e => { set("email", e.target.value); setErrors(p => ({ ...p, email: undefined })); }} />
                  {errors.email && <div className="wiz-err">{errors.email}</div>}
                </div>
              </div>
              <div className="wiz-gdpr">
                <input type="checkbox" id="wiz-gdpr" checked={data.gdpr} onChange={e => { set("gdpr", e.target.checked); setErrors(p => ({ ...p, gdpr_err: undefined })); }} />
                <label htmlFor="wiz-gdpr">
                  Souhlasím se <a href="#">zpracováním osobních údajů</a> za účelem zprostředkování nabídek od autobazarů.
                </label>
              </div>
              {errors.gdpr_err && <div className="wiz-err">{errors.gdpr_err}</div>}
              <button type="submit" className="wiz-submit" disabled={loading}>
                {loading ? "Odesílám..." : "Získat nabídky zdarma →"}
              </button>
            </div>
          )}
        </div>

      </form>
    </>
  );
}
