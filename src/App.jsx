import { useState, useEffect, useRef } from "react";

// ─── Fonts & Global Styles ────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f7f5f0; font-family: 'Plus Jakarta Sans', sans-serif; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #f0ede6; }
  ::-webkit-scrollbar-thumb { background: #c8bfad; border-radius: 3px; }
  input, textarea, select { font-family: 'Plus Jakarta Sans', sans-serif; }
  input::placeholder, textarea::placeholder { color: #b5a992; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes shimmer { 0%,100% { opacity:.6; } 50% { opacity:1; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
`;

// ─── Color Palette ────────────────────────────────────────────────────────────
const C = {
  cream: "#f7f5f0",
  parchment: "#ede9e0",
  stone: "#c8bfad",
  muted: "#9a8f7e",
  ink: "#1a1714",
  inkLight: "#3d3530",
  forest: "#1a3a2a",
  forestLight: "#2a5a40",
  moss: "#4a7c59",
  sage: "#8fb89a",
  sagePale: "#d4e8da",
  amber: "#c97d2e",
  amberPale: "#f5e6ce",
  rose: "#c45c52",
  rosePale: "#f5d9d6",
  sky: "#3a6ea8",
  skyPale: "#d6e4f5",
};

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED_JOBS = [
  { id: 1, title: "Junior Software Developer", company: "Synapse Technologies", companyId: "c1", location: "Makati, Metro Manila", type: "Full-time", degree: "Computer Science", salary: "₱25,000–₱35,000/mo", posted: "2 days ago", tags: ["React", "Node.js", "Entry Level"], description: "Build modern web applications as part of an agile team. No experience required — we train you from day one. Join a team of 40 engineers building the future of Filipino fintech.", logo: "ST", color: C.sky, applicants: 12 },
  { id: 2, title: "Staff Nurse", company: "Healthbridge Medical Center", companyId: "c2", location: "Quezon City", type: "Full-time", degree: "Nursing", salary: "₱22,000–₱28,000/mo", posted: "1 day ago", tags: ["PRC Licensed", "ICU", "Fresh Grads OK"], description: "Provide quality patient care in our state-of-the-art facilities. Fresh board passers are highly encouraged to apply. Competitive HMO benefits on Day 1.", logo: "HM", color: C.moss, applicants: 8 },
  { id: 3, title: "Junior Accountant", company: "Navarro & Partners CPAs", companyId: "c3", location: "BGC, Taguig", type: "Full-time", degree: "Accountancy", salary: "₱20,000–₱26,000/mo", posted: "3 days ago", tags: ["CPA Eligible", "Audit", "Tax"], description: "Assist senior accountants in audits, financial reports, and tax compliance. Great mentorship program and clear promotion track within 12 months.", logo: "NP", color: C.amber, applicants: 5 },
  { id: 4, title: "Marketing Associate", company: "Lumiere Creative Agency", companyId: "c4", location: "Ortigas, Pasig", type: "Full-time", degree: "Business Administration", salary: "₱18,000–₱24,000/mo", posted: "Today", tags: ["Social Media", "Content", "Creative"], description: "Craft campaigns that move people. Join a young, energetic team working with top local and international brands across FMCG, tech, and lifestyle.", logo: "LC", color: C.rose, applicants: 20 },
  { id: 5, title: "Elementary School Teacher", company: "Horizon Academy", companyId: "c5", location: "San Juan, Metro Manila", type: "Full-time", degree: "Education", salary: "₱18,000–₱22,000/mo", posted: "5 days ago", tags: ["LET Passer", "English", "Math"], description: "Shape the next generation in a supportive school environment that values teacher growth and student success.", logo: "HA", color: C.forestLight, applicants: 7 },
  { id: 6, title: "HR Assistant", company: "Pinnacle Corp", companyId: "c6", location: "Mandaluyong", type: "Full-time", degree: "Psychology", salary: "₱17,000–₱22,000/mo", posted: "1 day ago", tags: ["Recruitment", "Onboarding", "People"], description: "Support our People & Culture team in hiring, onboarding, and employee engagement programs.", logo: "PC", color: C.sky, applicants: 3 },
];

const DEGREES = ["Computer Science","Business Administration","Nursing","Engineering","Education","Psychology","Accountancy","Architecture","Communication","Tourism & Hospitality"];

const CAREER_PATHS = [
  { degree: "Computer Science", icon: "💻", color: C.sky, roles: ["Junior Developer","Mid-level Developer","Senior Developer","Tech Lead","CTO"], salary: "₱25K → ₱250K+", certs: ["AWS Certified","Google Associate Dev","Meta Front-End Cert"], industries: ["FinTech","E-Commerce","Startups","Government IT","BPO"], firstStep: "Build a GitHub portfolio with 3 projects, then apply to entry-level roles or coding bootcamps." },
  { degree: "Business Administration", icon: "📊", color: C.amber, roles: ["Marketing Assoc.","Brand Manager","Marketing Director","VP Marketing","CMO"], salary: "₱18K → ₱180K+", certs: ["Google Ads","HubSpot Marketing","PMP"], industries: ["FMCG","Real Estate","Banking","Retail","Consulting"], firstStep: "Intern at a marketing or operations team, build Excel/data skills, get Google Analytics certified." },
  { degree: "Nursing", icon: "🏥", color: C.moss, roles: ["Staff Nurse","Head Nurse","Nurse Supervisor","Director of Nursing","Chief Nursing Officer"], salary: "₱22K → ₱200K+ (abroad)", certs: ["PRC License","BLS/ACLS","NCLEX (USA)"], industries: ["Hospitals","Clinics","Occupational Health","OFW Nursing","Telehealth"], firstStep: "Pass PRC board, volunteer at a local hospital for 1–2 yrs experience, then consider NCLEX for abroad." },
  { degree: "Accountancy", icon: "🧾", color: C.amber, roles: ["Junior Accountant","Senior Accountant","Finance Manager","Controller","CFO"], salary: "₱20K → ₱200K+", certs: ["CPA License","CMA","ACCA"], industries: ["Big 4 Audit","Banking","Manufacturing","Government","Consulting"], firstStep: "Pass the CPA board exam — it opens every major door in finance and business." },
  { degree: "Education", icon: "📚", color: C.forestLight, roles: ["Teacher","Department Head","Principal","School Director","DepEd Official"], salary: "₱18K → ₱80K+", certs: ["LET License","Special Ed Cert","TESOL"], industries: ["Public Schools","Private Schools","Online Tutoring","Publishing","EdTech"], firstStep: "Pass the LET, apply to DepEd or private schools, consider ESL online teaching for extra income." },
  { degree: "Psychology", icon: "🧠", color: C.rose, roles: ["HR Assistant","HR Generalist","HR Manager","HR Director","CHRO"], salary: "₱17K → ₱160K+", certs: ["RPm License","SHRM","Counseling License"], industries: ["Corporate HR","Mental Health","NGOs","Research","Academe"], firstStep: "Get your RPm license, build skills in HR tools (Workday, BambooHR), network at PMAP events." },
];

const TUTORIAL_STEPS = [
  { step: "01", icon: "🔍", title: "Know Yourself First", content: "Before applying anywhere, identify your strengths, interests, and values. Use free tools like the Holland Code (RIASEC) test. Write down what energized you most during college — that's your compass.", tip: "Try typefind.com or 16personalities.com for a free career personality test." },
  { step: "02", icon: "📄", title: "Polish Your Resume", content: "Keep it to 1 page. Lead with a 2-sentence summary. List your thesis, org experience, internships, and skills. Use numbers wherever possible — 'increased club membership by 40%' beats 'helped grow the club'.", tip: "Use Canva's free resume templates, but export as PDF. Avoid fancy graphics — ATS systems can't read them." },
  { step: "03", icon: "🌐", title: "Build a LinkedIn Profile", content: "LinkedIn is where recruiters find you. Use a professional photo, write a headline beyond 'Fresh Graduate', and connect with classmates, professors, and professionals. Set your profile to Open to Work.", tip: "A complete LinkedIn profile gets 40× more recruiter messages." },
  { step: "04", icon: "🎯", title: "Apply Strategically", content: "Don't spam 100 companies. Target 10–15 that excite you. Tailor your resume for each role — match keywords in the job description. Quality beats quantity every single time.", tip: "Use GradLaunch to filter jobs by your degree and track your applications." },
  { step: "05", icon: "🤝", title: "Nail the Interview", content: "Research the company. Prepare answers using STAR (Situation, Task, Action, Result). Arrive 10 minutes early. Bring extra copies of your resume and a notebook.", tip: "Most common question: 'Tell me about yourself.' Practice a confident 90-second answer." },
  { step: "06", icon: "🚀", title: "Negotiate & Start Strong", content: "It's okay to negotiate politely. Research market rates for your role. Once hired, treat your first 90 days as a second interview — be curious, be early, deliver on every promise.", tip: "Ask your manager on Day 1: 'What does success look like after 90 days?' This makes you stand out." },
];

// ─── Shared UI Primitives ─────────────────────────────────────────────────────
const Btn = ({ children, variant = "primary", onClick, style = {}, disabled }) => {
  const base = { fontFamily: "inherit", fontWeight: 700, fontSize: 14, cursor: disabled ? "not-allowed" : "pointer", border: "none", borderRadius: 10, padding: "10px 22px", transition: "all 0.18s", opacity: disabled ? 0.5 : 1, ...style };
  const variants = {
    primary: { background: C.forest, color: C.cream },
    ghost: { background: "transparent", color: C.inkLight, border: `1.5px solid ${C.stone}` },
    accent: { background: C.amber, color: "#fff" },
    danger: { background: C.rose, color: "#fff" },
    sage: { background: C.sagePale, color: C.forest, border: `1px solid ${C.sage}` },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}>{children}</button>;
};

const Badge = ({ children, color = C.forest, bg = C.sagePale }) => (
  <span style={{ background: bg, color, borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700, letterSpacing: 0.3 }}>{children}</span>
);

const Input = ({ label, value, onChange, placeholder, type = "text", required }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 700, color: C.inkLight, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}{required && <span style={{ color: C.rose }}> *</span>}</label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ padding: "11px 14px", border: `1.5px solid ${C.stone}`, borderRadius: 10, fontSize: 14, background: "#fff", color: C.ink, outline: "none", transition: "border 0.2s" }}
      onFocus={e => e.target.style.borderColor = C.forest}
      onBlur={e => e.target.style.borderColor = C.stone}
    />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder, rows = 4 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 700, color: C.inkLight, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</label>}
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      style={{ padding: "11px 14px", border: `1.5px solid ${C.stone}`, borderRadius: 10, fontSize: 14, background: "#fff", color: C.ink, outline: "none", resize: "vertical", transition: "border 0.2s" }}
      onFocus={e => e.target.style.borderColor = C.forest}
      onBlur={e => e.target.style.borderColor = C.stone}
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 700, color: C.inkLight, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</label>}
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ padding: "11px 14px", border: `1.5px solid ${C.stone}`, borderRadius: 10, fontSize: 14, background: "#fff", color: C.ink, outline: "none" }}>
      {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
    </select>
  </div>
);

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{ background: "#fff", border: `1.5px solid ${C.parchment}`, borderRadius: 16, padding: 24, transition: "all 0.2s", cursor: onClick ? "pointer" : "default", ...style }}>{children}</div>
);

const Modal = ({ children, onClose, title, width = 540 }) => (
  <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(26,23,20,0.55)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
    <div style={{ background: C.cream, borderRadius: 20, width: "100%", maxWidth: width, maxHeight: "90vh", overflow: "auto", position: "relative", animation: "fadeUp 0.25s ease" }} onClick={e => e.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 28px", borderBottom: `1px solid ${C.parchment}`, position: "sticky", top: 0, background: C.cream, zIndex: 1 }}>
        <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, color: C.ink }}>{title}</h3>
        <button onClick={onClose} style={{ background: C.parchment, border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 18, color: C.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
      </div>
      <div style={{ padding: 28 }}>{children}</div>
    </div>
  </div>
);

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type = "success" }) => (
  <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 999, background: type === "success" ? C.forest : C.rose, color: "#fff", borderRadius: 12, padding: "12px 24px", fontWeight: 600, fontSize: 14, animation: "fadeUp 0.25s ease", boxShadow: "0 8px 32px rgba(0,0,0,0.25)", whiteSpace: "nowrap" }}>
    {type === "success" ? "✓ " : "✕ "}{msg}
  </div>
);

// ─── NavBar ───────────────────────────────────────────────────────────────────
function NavBar({ page, setPage, user, setUser }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const tabs = user?.role === "poster"
    ? [["poster-dashboard","Dashboard"],["poster-jobs","My Listings"],["poster-applicants","Applicants"]]
    : user?.role === "hunter"
    ? [["hunter-jobs","Find Jobs"],["hunter-saved","Saved Jobs"],["hunter-profile","My Profile"],["paths","Career Paths"],["tutorial","Guide"]]
    : [["landing","Home"],["hunter-jobs","Browse Jobs"],["paths","Career Paths"],["tutorial","Guide"]];

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: scrolled ? "rgba(247,245,240,0.96)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? `1px solid ${C.parchment}` : "none", transition: "all 0.3s", padding: "0 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 }}>
        <button onClick={() => setPage("landing")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, background: C.forest, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: C.sage, fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 900 }}>G</div>
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 19, fontWeight: 900, color: C.ink, letterSpacing: "-0.5px" }}>GradLaunch</span>
        </button>

        <div style={{ display: "flex", gap: 2 }}>
          {tabs.map(([p, l]) => (
            <button key={p} onClick={() => setPage(p)} style={{ background: page === p ? C.forest : "transparent", color: page === p ? C.cream : C.inkLight, border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.18s" }}>{l}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {user ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: user.role === "poster" ? C.amberPale : C.sagePale, border: `2px solid ${user.role === "poster" ? C.amber : C.moss}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: user.role === "poster" ? C.amber : C.moss }}>
                  {user.name[0]}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.inkLight }}>{user.name.split(" ")[0]}</span>
              </div>
              <Btn variant="ghost" onClick={() => { setUser(null); setPage("landing"); }} style={{ padding: "7px 16px", fontSize: 12 }}>Sign Out</Btn>
            </>
          ) : (
            <>
              <Btn variant="ghost" onClick={() => setPage("login")} style={{ padding: "7px 16px", fontSize: 13 }}>Sign In</Btn>
              <Btn variant="primary" onClick={() => setPage("signup")} style={{ padding: "7px 16px", fontSize: 13 }}>Join Free</Btn>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
function Landing({ setPage }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let t = 1247, c = 0, step = 22;
    const timer = setInterval(() => { c = Math.min(c + step, t); setCount(c); if (c >= t) clearInterval(timer); }, 16);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: C.cream }}>
      {/* Hero */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 2rem 80px", textAlign: "center", position: "relative", overflow: "hidden", background: `radial-gradient(ellipse 80% 50% at 50% -10%, ${C.sagePale} 0%, transparent 70%), ${C.cream}` }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle, ${C.stone}30 1px, transparent 1px)`, backgroundSize: "32px 32px", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 780, animation: "fadeUp 0.6s ease" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.sagePale, border: `1px solid ${C.sage}`, borderRadius: 40, padding: "6px 18px", marginBottom: 32 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.moss, display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ color: C.forest, fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>{count.toLocaleString()} OPPORTUNITIES FOR FRESH GRADUATES</span>
          </div>

          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(2.8rem, 6vw, 5rem)", fontWeight: 900, color: C.ink, lineHeight: 1.08, marginBottom: 24, letterSpacing: "-2px" }}>
            Your Degree Is<br />Your <span style={{ color: C.moss, textDecoration: "underline", textDecorationStyle: "wavy", textUnderlineOffset: 6 }}>Starting Line.</span>
          </h1>

          <p style={{ color: C.muted, fontSize: "clamp(1rem, 2vw, 1.18rem)", lineHeight: 1.75, marginBottom: 48, maxWidth: 560, margin: "0 auto 48px" }}>
            Find jobs matched to your college degree, map your career path, and get practical guidance for your first job — all in one place.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 64 }}>
            <Btn onClick={() => setPage("signup-hunter")} style={{ padding: "14px 32px", fontSize: 15, background: C.forest, color: C.cream, borderRadius: 12 }}>I'm Looking for a Job →</Btn>
            <Btn variant="ghost" onClick={() => setPage("signup-poster")} style={{ padding: "14px 32px", fontSize: 15, borderRadius: 12 }}>I'm Hiring Fresh Grads</Btn>
          </div>

          <div style={{ display: "flex", gap: 48, justifyContent: "center", flexWrap: "wrap" }}>
            {[["1,200+","Open Roles"],["300+","Companies Hiring"],["10","Degree Tracks"],["Free","Always"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 30, fontWeight: 900, color: C.forest }}>{n}</div>
                <div style={{ color: C.muted, fontSize: 12, fontWeight: 600, letterSpacing: 0.5 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two paths */}
      <section style={{ background: C.ink, padding: "80px 2rem" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {[
            { role: "hunter", icon: "🎓", title: "Job Hunters", sub: "Fresh Graduates", color: C.sage, bg: C.forest, items: ["Browse degree-matched jobs","Save your favorite listings","Apply directly on GradLaunch","Build your grad profile","Career path roadmaps","Step-by-step job hunting guide"] },
            { role: "poster", icon: "🏢", title: "Employers", sub: "Companies & Recruiters", color: C.amber, bg: "#2a1f0a", items: ["Post job listings in minutes","Reach 1,200+ fresh graduates","Edit or close listings anytime","View all applicants per role","Company profile page","100% free — always"] },
          ].map(card => (
            <div key={card.role} style={{ background: card.bg, border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 20, padding: 36, cursor: "pointer" }} onClick={() => setPage(`signup-${card.role}`)}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{card.icon}</div>
              <div style={{ color: card.color, fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>{card.sub.toUpperCase()}</div>
              <h2 style={{ fontFamily: "'Fraunces', serif", color: "#fff", fontSize: 28, marginBottom: 20 }}>{card.title}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {card.items.map(it => <div key={it} style={{ display: "flex", gap: 10, alignItems: "center", color: "rgba(255,255,255,0.65)", fontSize: 13 }}><span style={{ color: card.color }}>✓</span>{it}</div>)}
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: card.color, fontWeight: 700, fontSize: 14 }}>Get Started →</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 2rem", background: C.parchment }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", color: C.ink, marginBottom: 12 }}>Built for Day One</h2>
            <p style={{ color: C.muted, fontSize: 15, maxWidth: 500, margin: "0 auto" }}>Everything a fresh graduate needs to launch a career with confidence.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 24 }}>
            {[{i:"🎯",t:"Degree-Matched Jobs",d:"Every listing tagged to your college course. No guessing."},{i:"🗺️",t:"Career Path Maps",d:"See where your first job leads — salaries, promotions, timelines."},{i:"📖",t:"Job Hunting 101",d:"Step-by-step guides on resumes, interviews, and negotiation."},{i:"🤝",t:"Fresh Grad Friendly",d:"All companies actively welcome zero-experience applicants."}].map(f => (
              <Card key={f.t} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{f.i}</div>
                <h3 style={{ fontFamily: "'Fraunces', serif", color: C.ink, fontSize: 17, marginBottom: 8 }}>{f.t}</h3>
                <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{f.d}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer setPage={setPage} />
    </div>
  );
}

// ─── Auth Pages ───────────────────────────────────────────────────────────────
function AuthPage({ mode, setPage, setUser, showToast }) {
  const isLogin = mode === "login";
  const [role, setRole] = useState("hunter");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [degree, setDegree] = useState(DEGREES[0]);
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);

  // Pre-fill role from signup-hunter / signup-poster
  useEffect(() => {
    if (mode === "signup-hunter") setRole("hunter");
    if (mode === "signup-poster") setRole("poster");
  }, [mode]);

  const handleSubmit = () => {
    if (!email || (!isLogin && !name)) { showToast("Please fill in all required fields.", "error"); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const user = { name: name || email.split("@")[0], email, role, degree: role === "hunter" ? degree : null, company: role === "poster" ? company : null, savedJobs: [], applications: [], postedJobs: [] };
      setUser(user);
      showToast(`Welcome${isLogin ? " back" : ""}, ${user.name.split(" ")[0]}!`);
      setPage(role === "poster" ? "poster-dashboard" : "hunter-jobs");
    }, 900);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.cream, display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 2rem 60px" }}>
      <div style={{ width: "100%", maxWidth: 440, animation: "fadeUp 0.4s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 48, height: 48, background: C.forest, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", color: C.sage, fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 900, margin: "0 auto 16px" }}>G</div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, color: C.ink, marginBottom: 6 }}>{isLogin ? "Welcome back" : "Create your account"}</h1>
          <p style={{ color: C.muted, fontSize: 14 }}>{isLogin ? "Sign in to continue to GradLaunch" : "Free forever. No credit card needed."}</p>
        </div>

        <Card style={{ padding: 32 }}>
          {!isLogin && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
              {[["hunter","🎓 Job Hunter"],["poster","🏢 Employer"]].map(([r, l]) => (
                <button key={r} onClick={() => setRole(r)} style={{ padding: "10px", borderRadius: 10, border: `2px solid ${role === r ? C.forest : C.parchment}`, background: role === r ? C.sagePale : "#fff", color: role === r ? C.forest : C.muted, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.18s" }}>{l}</button>
              ))}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {!isLogin && <Input label="Full Name" value={name} onChange={setName} placeholder="Juan dela Cruz" required />}
            <Input label="Email Address" value={email} onChange={setEmail} placeholder="you@email.com" type="email" required />
            <Input label="Password" value={password} onChange={setPassword} placeholder="Min. 8 characters" type="password" required />
            {!isLogin && role === "hunter" && <Select label="Your Degree" value={degree} onChange={setDegree} options={DEGREES} />}
            {!isLogin && role === "poster" && <Input label="Company Name" value={company} onChange={setCompany} placeholder="Your company name" />}
          </div>

          <Btn onClick={handleSubmit} disabled={loading} style={{ width: "100%", marginTop: 24, padding: "13px", fontSize: 15, background: C.forest, color: C.cream, borderRadius: 12 }}>
            {loading ? "Please wait…" : isLogin ? "Sign In" : "Create Account"}
          </Btn>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: C.muted }}>
            {isLogin ? "No account yet? " : "Already have an account? "}
            <button onClick={() => setPage(isLogin ? "signup" : "login")} style={{ background: "none", border: "none", color: C.forest, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
              {isLogin ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job, onView, onSave, savedIds = [], showSave = false }) {
  const isSaved = savedIds.includes(job.id);
  const [hov, setHov] = useState(false);
  return (
    <Card style={{ cursor: "pointer", transform: hov ? "translateY(-3px)" : "none", boxShadow: hov ? "0 12px 32px rgba(0,0,0,0.1)" : "none", borderColor: hov ? C.stone : C.parchment }}
      onClick={() => onView(job)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: job.color + "18", border: `1.5px solid ${job.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: job.color, flexShrink: 0 }}>{job.logo}</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 16, color: C.ink, marginBottom: 2 }}>{job.title}</h3>
          <p style={{ color: C.muted, fontSize: 12 }}>{job.company} · {job.location}</p>
        </div>
        {showSave && (
          <button onClick={e => { e.stopPropagation(); onSave(job.id); }} style={{ background: isSaved ? C.amberPale : C.parchment, border: "none", borderRadius: 8, width: 34, height: 34, cursor: "pointer", fontSize: 16, transition: "all 0.18s", flexShrink: 0 }}>{isSaved ? "★" : "☆"}</button>
        )}
      </div>
      <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>{job.description.slice(0, 100)}…</p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {job.tags.map(t => <Badge key={t} color={C.forest} bg={C.sagePale}>{t}</Badge>)}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: C.forest, fontWeight: 800, fontSize: 13 }}>{job.salary}</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Badge color={C.muted} bg={C.parchment}>{job.posted}</Badge>
          <Badge color={job.color} bg={job.color + "18"}>{job.degree}</Badge>
        </div>
      </div>
    </Card>
  );
}

// ─── Job Detail Modal ─────────────────────────────────────────────────────────
function JobDetailModal({ job, onClose, onApply, onSave, savedIds = [], applied = false, showApply = true }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [step, setStep] = useState("view"); // view | apply
  const fileRef = useRef();
  if (!job) return null;

  const handleApply = () => {
    setApplying(true);
    setTimeout(() => { setApplying(false); onApply(job.id); onClose(); }, 1000);
  };

  return (
    <Modal title={step === "apply" ? "Apply for this Role" : job.title} onClose={onClose} width={600}>
      {step === "view" ? (
        <>
          <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: job.color + "18", border: `2px solid ${job.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: job.color }}>{job.logo}</div>
            <div><h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: C.ink, marginBottom: 3 }}>{job.title}</h2><p style={{ color: C.muted, fontSize: 13 }}>{job.company} · {job.location}</p></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            {[["📍 Location",job.location],["💰 Salary",job.salary],["📋 Type",job.type],["🎓 Degree",job.degree],["👥 Applicants",`${job.applicants} applied`],["🕐 Posted",job.posted]].map(([k,v]) => (
              <div key={k} style={{ background: C.parchment, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 11, color: C.muted, marginBottom: 3 }}>{k}</div><div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{v}</div></div>
            ))}
          </div>
          <p style={{ color: C.inkLight, fontSize: 14, lineHeight: 1.75, marginBottom: 20 }}>{job.description} Fresh graduates with a strong academic background and willingness to learn are highly encouraged. We offer mentorship, training allowance, and a clear promotion path within 12 months.</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            {job.tags.map(t => <Badge key={t} color={C.forest} bg={C.sagePale}>{t}</Badge>)}
          </div>
          {showApply && (
            <div style={{ display: "flex", gap: 10 }}>
              {applied ? <Btn variant="sage" disabled style={{ flex: 1, padding: 13 }}>✓ Already Applied</Btn>
                : <Btn onClick={() => setStep("apply")} style={{ flex: 1, padding: 13, background: C.forest, color: C.cream, borderRadius: 12 }}>Apply Now →</Btn>}
              <Btn variant="ghost" onClick={() => onSave(job.id)} style={{ padding: "13px 16px" }}>{savedIds.includes(job.id) ? "★ Saved" : "☆ Save"}</Btn>
            </div>
          )}
        </>
      ) : (
        <>
          <p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>Applying for <strong style={{ color: C.ink }}>{job.title}</strong> at <strong style={{ color: C.ink }}>{job.company}</strong></p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: C.inkLight, letterSpacing: 0.5, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Upload Resume (PDF) <span style={{ color: C.rose }}>*</span></label>
              <div onClick={() => fileRef.current.click()} style={{ border: `2px dashed ${resumeFile ? C.moss : C.stone}`, borderRadius: 12, padding: "24px", textAlign: "center", cursor: "pointer", background: resumeFile ? C.sagePale : C.parchment, transition: "all 0.18s" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{resumeFile ? "📄" : "⬆️"}</div>
                <p style={{ color: resumeFile ? C.forest : C.muted, fontSize: 13, fontWeight: resumeFile ? 700 : 400 }}>{resumeFile ? resumeFile.name : "Click to upload your resume"}</p>
              </div>
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={e => setResumeFile(e.target.files[0])} />
            </div>
            <Textarea label="Cover Letter (Optional)" value={coverLetter} onChange={setCoverLetter} placeholder="Tell the employer why you're a great fit for this role…" rows={5} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <Btn variant="ghost" onClick={() => setStep("view")} style={{ padding: 13 }}>← Back</Btn>
            <Btn onClick={handleApply} disabled={applying || !resumeFile} style={{ flex: 1, padding: 13, background: C.forest, color: C.cream, borderRadius: 12 }}>
              {applying ? "Submitting…" : "Submit Application →"}
            </Btn>
          </div>
        </>
      )}
    </Modal>
  );
}

// ─── Hunter: Find Jobs ────────────────────────────────────────────────────────
function HunterJobs({ user, setUser, showToast }) {
  const [jobs, setJobs] = useState(SEED_JOBS);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(null);

  const handleSave = (id) => {
    if (!user) { showToast("Sign in to save jobs.", "error"); return; }
    setUser(u => { const saved = u.savedJobs.includes(id) ? u.savedJobs.filter(x => x !== id) : [...u.savedJobs, id]; showToast(saved.includes(id) ? "Job saved!" : "Job removed."); return { ...u, savedJobs: saved }; });
  };

  const handleApply = (id) => {
    setUser(u => { showToast("Application submitted! 🎉"); return { ...u, applications: [...(u.applications || []), { jobId: id, date: new Date().toLocaleDateString(), status: "Under Review" }] }; });
  };

  const filtered = filter ? jobs.filter(j => j.degree === filter) : jobs;
  const appliedIds = user?.applications?.map(a => a.jobId) || [];

  return (
    <div style={{ minHeight: "100vh", background: C.cream, paddingTop: 80 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "50px 2rem" }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem,4vw,2.8rem)", color: C.ink, marginBottom: 8 }}>Find Your First Role</h1>
          <p style={{ color: C.muted, fontSize: 15 }}>Every listing is fresh-graduate friendly and matched to your degree.</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
          <button onClick={() => setFilter("")} style={{ padding: "8px 18px", borderRadius: 24, border: `1.5px solid ${!filter ? C.forest : C.stone}`, background: !filter ? C.sagePale : "transparent", color: !filter ? C.forest : C.muted, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>All Degrees</button>
          {DEGREES.slice(0, 7).map(d => <button key={d} onClick={() => setFilter(d)} style={{ padding: "8px 18px", borderRadius: 24, border: `1.5px solid ${filter === d ? C.forest : C.stone}`, background: filter === d ? C.sagePale : "transparent", color: filter === d ? C.forest : C.muted, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{d}</button>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px,1fr))", gap: 20 }}>
          {filtered.map(j => <JobCard key={j.id} job={j} onView={setSelected} onSave={handleSave} savedIds={user?.savedJobs || []} showSave={!!user} />)}
        </div>
      </div>
      {selected && <JobDetailModal job={selected} onClose={() => setSelected(null)} onApply={handleApply} onSave={handleSave} savedIds={user?.savedJobs || []} applied={appliedIds.includes(selected.id)} showApply={!!user} />}
    </div>
  );
}

// ─── Hunter: Saved Jobs ───────────────────────────────────────────────────────
function HunterSaved({ user, setUser, showToast }) {
  const [selected, setSelected] = useState(null);
  const savedJobs = SEED_JOBS.filter(j => user?.savedJobs?.includes(j.id));
  const handleSave = (id) => { setUser(u => ({ ...u, savedJobs: u.savedJobs.filter(x => x !== id) })); showToast("Job removed from saved."); };
  const handleApply = (id) => { setUser(u => { showToast("Application submitted! 🎉"); return { ...u, applications: [...(u.applications || []), { jobId: id, date: new Date().toLocaleDateString(), status: "Under Review" }] }; }); };

  return (
    <div style={{ minHeight: "100vh", background: C.cream, paddingTop: 80 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "50px 2rem" }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem,4vw,2.8rem)", color: C.ink, marginBottom: 8 }}>Saved Jobs</h1>
        <p style={{ color: C.muted, fontSize: 15, marginBottom: 40 }}>Jobs you've bookmarked for later.</p>
        {savedJobs.length === 0
          ? <Card style={{ textAlign: "center", padding: 64 }}><div style={{ fontSize: 48, marginBottom: 16 }}>☆</div><p style={{ color: C.muted }}>No saved jobs yet. Star a job to save it here.</p></Card>
          : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px,1fr))", gap: 20 }}>
              {savedJobs.map(j => <JobCard key={j.id} job={j} onView={setSelected} onSave={handleSave} savedIds={user?.savedJobs || []} showSave />)}
            </div>
        }
      </div>
      {selected && <JobDetailModal job={selected} onClose={() => setSelected(null)} onApply={handleApply} onSave={handleSave} savedIds={user?.savedJobs || []} applied={(user?.applications || []).map(a => a.jobId).includes(selected?.id)} showApply />}
    </div>
  );
}

// ─── Hunter: Profile ──────────────────────────────────────────────────────────
function HunterProfile({ user, setUser, showToast }) {
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [location, setLocation] = useState(user?.location || "");
  const [degree, setDegree] = useState(user?.degree || DEGREES[0]);
  const [school, setSchool] = useState(user?.school || "");
  const [skills, setSkills] = useState(user?.skills || "");
  const [editing, setEditing] = useState(false);
  const applications = user?.applications || [];

  const save = () => {
    setUser(u => ({ ...u, name, bio, location, degree, school, skills }));
    setEditing(false);
    showToast("Profile updated!");
  };

  return (
    <div style={{ minHeight: "100vh", background: C.cream, paddingTop: 80 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "50px 2rem", display: "grid", gridTemplateColumns: "280px 1fr", gap: 24 }}>
        {/* sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Card style={{ textAlign: "center", padding: 28 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: C.sagePale, border: `3px solid ${C.moss}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, color: C.forest, margin: "0 auto 16px", fontFamily: "'Fraunces', serif" }}>{user?.name?.[0]}</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: C.ink, marginBottom: 4 }}>{user?.name}</h2>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 12 }}>{user?.degree}</p>
            <Badge color={C.forest} bg={C.sagePale}>Job Hunter</Badge>
          </Card>
          <Card>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 16, color: C.ink, marginBottom: 16 }}>My Applications</h3>
            {applications.length === 0
              ? <p style={{ color: C.muted, fontSize: 13 }}>No applications yet.</p>
              : applications.map((a, i) => {
                  const job = SEED_JOBS.find(j => j.id === a.jobId);
                  return job ? (
                    <div key={i} style={{ padding: "10px 0", borderBottom: i < applications.length - 1 ? `1px solid ${C.parchment}` : "none" }}>
                      <p style={{ fontWeight: 700, fontSize: 13, color: C.ink }}>{job.title}</p>
                      <p style={{ fontSize: 11, color: C.muted }}>{job.company}</p>
                      <Badge color={C.amber} bg={C.amberPale}>{a.status}</Badge>
                    </div>
                  ) : null;
                })}
          </Card>
        </div>

        {/* main */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: C.ink }}>My Profile</h2>
              {!editing ? <Btn variant="ghost" onClick={() => setEditing(true)} style={{ fontSize: 13 }}>Edit Profile</Btn>
                : <div style={{ display: "flex", gap: 8 }}><Btn variant="ghost" onClick={() => setEditing(false)} style={{ fontSize: 13 }}>Cancel</Btn><Btn onClick={save} style={{ fontSize: 13, background: C.forest, color: C.cream }}>Save Changes</Btn></div>}
            </div>
            {editing ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Input label="Full Name" value={name} onChange={setName} />
                <Textarea label="Bio / Summary" value={bio} onChange={setBio} placeholder="A fresh Computer Science graduate passionate about building products…" rows={3} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Input label="Location" value={location} onChange={setLocation} placeholder="Quezon City, PH" />
                  <Select label="Degree" value={degree} onChange={setDegree} options={DEGREES} />
                </div>
                <Input label="School / University" value={school} onChange={setSchool} placeholder="University of the Philippines" />
                <Input label="Skills (comma-separated)" value={skills} onChange={setSkills} placeholder="JavaScript, Figma, Excel…" />
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[["Name", user?.name],["Email", user?.email],["Location", user?.location || "—"],["Degree", user?.degree],["School", user?.school || "—"],["Bio", user?.bio || "—"]].map(([k,v]) => (
                  <div key={k} style={{ display: "flex", gap: 16 }}>
                    <span style={{ minWidth: 80, fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, paddingTop: 1 }}>{k}</span>
                    <span style={{ fontSize: 14, color: C.ink }}>{v}</span>
                  </div>
                ))}
                {user?.skills && <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{user.skills.split(",").map(s => <Badge key={s} color={C.forest} bg={C.sagePale}>{s.trim()}</Badge>)}</div>}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Poster: Dashboard ────────────────────────────────────────────────────────
function PosterDashboard({ user }) {
  const myJobs = SEED_JOBS.filter(j => j.companyId === "c1").slice(0, 2);
  const stats = [["Active Listings", myJobs.length, "📋"], ["Total Applicants", myJobs.reduce((a, j) => a + j.applicants, 0), "👥"], ["Views This Week", 142, "👁️"], ["Avg. Time to Hire", "12 days", "⏱️"]];
  return (
    <div style={{ minHeight: "100vh", background: C.cream, paddingTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "50px 2rem" }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem,4vw,2.8rem)", color: C.ink, marginBottom: 6 }}>Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
          <p style={{ color: C.muted, fontSize: 15 }}>Here's an overview of your hiring activity on GradLaunch.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 16, marginBottom: 40 }}>
          {stats.map(([label, val, icon]) => (
            <Card key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 900, color: C.forest, marginBottom: 4 }}>{val}</div>
              <div style={{ color: C.muted, fontSize: 12, fontWeight: 600 }}>{label}</div>
            </Card>
          ))}
        </div>
        <Card>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: C.ink, marginBottom: 20 }}>Recent Listings Performance</h2>
          {myJobs.map(j => (
            <div key={j.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 0", borderBottom: `1px solid ${C.parchment}` }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: j.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: j.color }}>{j.logo}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: C.ink, fontSize: 14 }}>{j.title}</p>
                <p style={{ color: C.muted, fontSize: 12 }}>{j.degree} · {j.location}</p>
              </div>
              <div style={{ textAlign: "center" }}><div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: C.forest }}>{j.applicants}</div><div style={{ color: C.muted, fontSize: 11 }}>applicants</div></div>
              <Badge color={C.moss} bg={C.sagePale}>Active</Badge>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ─── Poster: My Listings ──────────────────────────────────────────────────────
function PosterListings({ user, setUser, showToast }) {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", degree: DEGREES[0], location: "", salary: "", type: "Full-time", tags: "", description: "" });
  const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.title || !form.description) { showToast("Title and description are required.", "error"); return; }
    if (editing !== null) {
      setJobs(j => j.map((job, i) => i === editing ? { ...job, ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) } : job));
      showToast("Listing updated!");
    } else {
      setJobs(j => [...j, { ...form, id: Date.now(), logo: user?.company?.[0]?.toUpperCase() || "C", color: C.sky, applicants: 0, posted: "Just now", tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) }]);
      showToast("Job posted! 🎉");
    }
    setShowForm(false); setEditing(null); setForm({ title: "", degree: DEGREES[0], location: "", salary: "", type: "Full-time", tags: "", description: "" });
  };

  const del = (i) => { setJobs(j => j.filter((_, idx) => idx !== i)); showToast("Listing deleted."); };
  const edit = (i) => { const j = jobs[i]; setForm({ ...j, tags: j.tags.join(", ") }); setEditing(i); setShowForm(true); };

  return (
    <div style={{ minHeight: "100vh", background: C.cream, paddingTop: 80 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "50px 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem,4vw,2.8rem)", color: C.ink, marginBottom: 6 }}>My Listings</h1>
            <p style={{ color: C.muted, fontSize: 15 }}>Post and manage your job openings.</p>
          </div>
          <Btn onClick={() => { setEditing(null); setForm({ title: "", degree: DEGREES[0], location: "", salary: "", type: "Full-time", tags: "", description: "" }); setShowForm(true); }} style={{ background: C.forest, color: C.cream, padding: "12px 24px", borderRadius: 12 }}>+ Post New Job</Btn>
        </div>

        {jobs.length === 0
          ? <Card style={{ textAlign: "center", padding: 64 }}><div style={{ fontSize: 48, marginBottom: 16 }}>📋</div><p style={{ color: C.muted, marginBottom: 24 }}>No listings yet. Post your first job to reach fresh graduates!</p><Btn onClick={() => setShowForm(true)} style={{ background: C.forest, color: C.cream }}>Post a Job</Btn></Card>
          : <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {jobs.map((j, i) => (
                <Card key={j.id} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 11, background: j.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: j.color }}>{j.logo}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: 15, color: C.ink }}>{j.title}</p>
                    <p style={{ color: C.muted, fontSize: 12 }}>{j.degree} · {j.location} · {j.posted}</p>
                  </div>
                  <div style={{ textAlign: "center", minWidth: 60 }}><div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: C.forest }}>{j.applicants}</div><div style={{ color: C.muted, fontSize: 11 }}>applicants</div></div>
                  <Badge color={C.moss} bg={C.sagePale}>Active</Badge>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn variant="ghost" onClick={() => edit(i)} style={{ fontSize: 12, padding: "7px 14px" }}>Edit</Btn>
                    <Btn variant="danger" onClick={() => del(i)} style={{ fontSize: 12, padding: "7px 14px" }}>Delete</Btn>
                  </div>
                </Card>
              ))}
            </div>
        }
      </div>

      {showForm && (
        <Modal title={editing !== null ? "Edit Job Listing" : "Post a New Job"} onClose={() => { setShowForm(false); setEditing(null); }} width={580}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Job Title" value={form.title} onChange={f("title")} placeholder="e.g. Junior Software Developer" required />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Select label="Degree Required" value={form.degree} onChange={f("degree")} options={DEGREES} />
              <Select label="Employment Type" value={form.type} onChange={f("type")} options={["Full-time","Part-time","Internship","Contract"]} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Input label="Location" value={form.location} onChange={f("location")} placeholder="Makati, Metro Manila" />
              <Input label="Salary Range" value={form.salary} onChange={f("salary")} placeholder="₱20,000–₱28,000/mo" />
            </div>
            <Input label="Tags (comma-separated)" value={form.tags} onChange={f("tags")} placeholder="React, Entry Level, Fresh Grads OK" />
            <Textarea label="Job Description" value={form.description} onChange={f("description")} placeholder="Describe the role, responsibilities, and what kind of fresh grad you're looking for…" rows={5} required />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <Btn variant="ghost" onClick={() => { setShowForm(false); setEditing(null); }} style={{ flex: 1, padding: 13 }}>Cancel</Btn>
            <Btn onClick={submit} style={{ flex: 2, padding: 13, background: C.forest, color: C.cream, borderRadius: 12 }}>{editing !== null ? "Save Changes" : "Post Job →"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Poster: Applicants ───────────────────────────────────────────────────────
function PosterApplicants() {
  const mockApplicants = [
    { name: "Maria Santos", degree: "Computer Science", school: "DLSU", applied: "2 days ago", job: "Junior Software Developer", status: "Under Review" },
    { name: "Juan dela Cruz", degree: "Computer Science", school: "UP Diliman", applied: "1 day ago", job: "Junior Software Developer", status: "Shortlisted" },
    { name: "Ana Reyes", degree: "Business Administration", school: "Ateneo", applied: "3 days ago", job: "Marketing Associate", status: "Interviewed" },
  ];
  const statusColor = { "Under Review": [C.amber, C.amberPale], "Shortlisted": [C.moss, C.sagePale], "Interviewed": [C.sky, C.skyPale] };

  return (
    <div style={{ minHeight: "100vh", background: C.cream, paddingTop: 80 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "50px 2rem" }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem,4vw,2.8rem)", color: C.ink, marginBottom: 8 }}>Applicants</h1>
        <p style={{ color: C.muted, fontSize: 15, marginBottom: 36 }}>Review everyone who applied to your job listings.</p>
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.parchment }}>
                {["Applicant","Degree","School","Role Applied","Applied","Status","Action"].map(h => <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: 0.8, textTransform: "uppercase" }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {mockApplicants.map((a, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${C.parchment}` }}>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.sagePale, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: C.forest }}>{a.name[0]}</div>
                      <span style={{ fontWeight: 700, fontSize: 14, color: C.ink }}>{a.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: 13, color: C.inkLight }}>{a.degree}</td>
                  <td style={{ padding: "16px 20px", fontSize: 13, color: C.muted }}>{a.school}</td>
                  <td style={{ padding: "16px 20px", fontSize: 13, color: C.inkLight }}>{a.job}</td>
                  <td style={{ padding: "16px 20px", fontSize: 12, color: C.muted }}>{a.applied}</td>
                  <td style={{ padding: "16px 20px" }}><Badge color={statusColor[a.status][0]} bg={statusColor[a.status][1]}>{a.status}</Badge></td>
                  <td style={{ padding: "16px 20px" }}><Btn variant="sage" style={{ fontSize: 11, padding: "6px 14px" }}>View Resume</Btn></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

// ─── Career Paths ─────────────────────────────────────────────────────────────
function CareerPaths() {
  const [active, setActive] = useState(0);
  const p = CAREER_PATHS[active];
  return (
    <div style={{ minHeight: "100vh", background: C.cream, paddingTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "50px 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ color: C.moss, fontSize: 11, letterSpacing: 2, fontWeight: 700, textTransform: "uppercase" }}>Navigate Your Future</span>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem,4vw,3rem)", color: C.ink, marginBottom: 10, marginTop: 8 }}>Career Paths by Degree</h1>
          <p style={{ color: C.muted, fontSize: 15, maxWidth: 520, margin: "0 auto" }}>Select your degree to see where you can go — salaries, certifications, and exactly where to start.</p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 48 }}>
          {CAREER_PATHS.map((cp, i) => (
            <button key={cp.degree} onClick={() => setActive(i)} style={{ padding: "10px 20px", borderRadius: 28, border: `2px solid ${active === i ? cp.color : C.stone}`, background: active === i ? cp.color + "18" : "transparent", color: active === i ? cp.color : C.muted, fontSize: 13, cursor: "pointer", fontWeight: active === i ? 700 : 500, transition: "all 0.2s" }}>
              {cp.icon} {cp.degree}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Card style={{ gridColumn: "1/-1" }}>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: C.ink, marginBottom: 20 }}>📈 Career Progression</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              {p.roles.map((r, i) => (
                <div key={r} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ background: i === 0 ? p.color + "22" : C.parchment, border: `1.5px solid ${i === 0 ? p.color : C.stone}`, borderRadius: 10, padding: "8px 16px", color: i === 0 ? p.color : C.muted, fontSize: 13, fontWeight: i === 0 ? 700 : 400 }}>{r}</div>
                  {i < p.roles.length - 1 && <span style={{ color: C.stone, fontSize: 18 }}>→</span>}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 17, color: C.ink, marginBottom: 12 }}>💰 Salary Range</h3>
            <p style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 900, color: p.color, marginBottom: 8 }}>{p.salary}</p>
            <p style={{ color: C.muted, fontSize: 12 }}>Philippine market, entry to senior level.</p>
          </Card>

          <Card>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 17, color: C.ink, marginBottom: 14 }}>🏭 Industries</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{p.industries.map(ind => <Badge key={ind} color={C.forest} bg={C.sagePale}>{ind}</Badge>)}</div>
          </Card>

          <Card>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 17, color: C.ink, marginBottom: 14 }}>🎖 Certifications</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{p.certs.map(c => <div key={c} style={{ display: "flex", gap: 8, alignItems: "center", color: C.inkLight, fontSize: 13 }}><span style={{ color: p.color }}>✓</span>{c}</div>)}</div>
          </Card>

          <Card style={{ gridColumn: "1/-1", background: p.color + "0f", border: `1.5px solid ${p.color}33` }}>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 17, color: p.color, marginBottom: 10 }}>🚀 Your First Step — Right Now</h3>
            <p style={{ color: C.inkLight, fontSize: 15, lineHeight: 1.75 }}>{p.firstStep}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Tutorial ─────────────────────────────────────────────────────────────────
function Tutorial() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ minHeight: "100vh", background: C.cream, paddingTop: 80 }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "50px 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{ color: C.moss, fontSize: 11, letterSpacing: 2, fontWeight: 700, textTransform: "uppercase" }}>Step-by-Step</span>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem,4vw,3rem)", color: C.ink, marginBottom: 10, marginTop: 8 }}>How to Land Your First Job</h1>
          <p style={{ color: C.muted, fontSize: 15, maxWidth: 500, margin: "0 auto" }}>Never worked full-time? Follow this guide and go from fresh grad to hired — with confidence.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {TUTORIAL_STEPS.map((s, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ background: "#fff", border: `1.5px solid ${isOpen ? C.moss : C.parchment}`, borderRadius: 14, overflow: "hidden", transition: "all 0.25s" }}>
                <button onClick={() => setOpen(isOpen ? null : i)} style={{ width: "100%", background: "none", border: "none", padding: "22px 24px", cursor: "pointer", display: "flex", alignItems: "center", gap: 18, textAlign: "left" }}>
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 900, color: isOpen ? C.moss : C.stone, minWidth: 42, transition: "color 0.2s" }}>{s.step}</span>
                  <span style={{ fontSize: 24 }}>{s.icon}</span>
                  <h3 style={{ color: C.ink, fontFamily: "'Fraunces', serif", fontSize: 17, flex: 1 }}>{s.title}</h3>
                  <span style={{ color: C.muted, fontSize: 18, transition: "transform 0.25s", transform: isOpen ? "rotate(180deg)" : "none", display: "inline-block" }}>↓</span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 24px 24px 24px", animation: "fadeUp 0.2s ease" }}>
                    <p style={{ color: C.inkLight, fontSize: 14, lineHeight: 1.75, marginBottom: 14 }}>{s.content}</p>
                    <div style={{ background: C.sagePale, border: `1px solid ${C.sage}`, borderRadius: 10, padding: "12px 16px", display: "flex", gap: 10 }}>
                      <span style={{ color: C.moss }}>💡</span>
                      <p style={{ color: C.forest, fontSize: 13 }}><strong>Pro Tip:</strong> {s.tip}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer style={{ background: C.ink, padding: "48px 2rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
        <div>
          <div style={{ fontFamily: "'Fraunces', serif", color: "#fff", fontSize: 20, marginBottom: 4 }}>GradLaunch</div>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>Your career starts here. Built for Filipino fresh graduates.</p>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {[["landing","Home"],["hunter-jobs","Browse Jobs"],["paths","Career Paths"],["tutorial","Guide"]].map(([p,l]) => (
            <button key={p} onClick={() => setPage(p)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 13, cursor: "pointer" }}>{l}</button>
          ))}
        </div>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>© 2025 GradLaunch · Free for everyone.</p>
      </div>
    </footer>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const goTo = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const setUserAndPage = (updater) => {
    setUser(updater);
  };

  const pages = {
    landing: <Landing setPage={goTo} />,
    login: <AuthPage mode="login" setPage={goTo} setUser={setUser} showToast={showToast} />,
    signup: <AuthPage mode="signup" setPage={goTo} setUser={setUser} showToast={showToast} />,
    "signup-hunter": <AuthPage mode="signup-hunter" setPage={goTo} setUser={setUser} showToast={showToast} />,
    "signup-poster": <AuthPage mode="signup-poster" setPage={goTo} setUser={setUser} showToast={showToast} />,
    "hunter-jobs": <HunterJobs user={user} setUser={setUserAndPage} showToast={showToast} />,
    "hunter-saved": <HunterSaved user={user} setUser={setUserAndPage} showToast={showToast} />,
    "hunter-profile": <HunterProfile user={user} setUser={setUserAndPage} showToast={showToast} />,
    "poster-dashboard": <PosterDashboard user={user} />,
    "poster-jobs": <PosterListings user={user} setUser={setUserAndPage} showToast={showToast} />,
    "poster-applicants": <PosterApplicants />,
    paths: <CareerPaths />,
    tutorial: <Tutorial />,
  };

  return (
    <div>
      <style>{GLOBAL_CSS}</style>
      <NavBar page={page} setPage={goTo} user={user} setUser={setUser} />
      {pages[page] || pages.landing}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}