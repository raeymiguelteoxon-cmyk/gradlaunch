import { useState, useRef } from "react";

// ─── Global Styles ────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #080b12; font-family: 'Syne', sans-serif; color: #e8eaf0; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #080b12; }
  ::-webkit-scrollbar-thumb { background: #2a3a5c; border-radius: 2px; }
  input, select, textarea { font-family: 'Syne', sans-serif; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(500%); } }
  @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(99,179,237,0.15)} 50%{box-shadow:0 0 50px rgba(99,179,237,0.4)} }
  @keyframes shimmer { 0%,100%{opacity:0.5} 50%{opacity:1} }
  @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
`;

// ─── Tokens ───────────────────────────────────────────────────────────────────
const T = {
  bg: "#080b12", surface: "#0e1420", surfaceHigh: "#141c2e",
  border: "#1e2d47", borderHigh: "#2a3a5c",
  text: "#e8eaf0", textMid: "#8a9bb8", textLow: "#3a4a68",
  accent: "#63b3ed", accentGlow: "rgba(99,179,237,0.12)",
  gold: "#f6c90e", goldPale: "rgba(246,201,14,0.1)",
  green: "#48bb78", greenPale: "rgba(72,187,120,0.1)",
  rose: "#fc8181", rosePale: "rgba(252,129,129,0.1)",
  violet: "#b794f4", violetPale: "rgba(183,148,244,0.1)",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const CAREER_PATHS = [
  { degree:"Computer Science", icon:"💻", roles:["Junior Developer","Mid Developer","Senior Developer","Tech Lead","CTO"], salary:"₱25K–₱250K+", certs:["AWS Certified","Google Cloud","Meta Front-End"], industries:["FinTech","E-Commerce","Startups","BPO"], tip:"Build a GitHub portfolio with 3 real projects. Contribute to open source. AWS certification is highly valued even at entry level." },
  { degree:"Business Administration", icon:"📊", roles:["Marketing Assoc.","Brand Manager","Marketing Director","VP Marketing","CMO"], salary:"₱18K–₱180K+", certs:["Google Ads","HubSpot","PMP"], industries:["FMCG","Banking","Retail","Consulting"], tip:"Get Google Analytics certified for free. Build Excel and data skills early. LinkedIn is your most important networking tool." },
  { degree:"Nursing", icon:"🏥", roles:["Staff Nurse","Head Nurse","Supervisor","Director of Nursing","CNO"], salary:"₱22K–₱200K+ (abroad)", certs:["PRC License","BLS/ACLS","NCLEX (USA)"], industries:["Hospitals","Clinics","OFW Nursing","Telehealth"], tip:"Pass PRC board first. Get 1–2 years local experience. Then pursue NCLEX to unlock US opportunities worth ₱200K+/month." },
  { degree:"Accountancy", icon:"🧾", roles:["Junior Accountant","Senior Accountant","Finance Manager","Controller","CFO"], salary:"₱20K–₱200K+", certs:["CPA License","CMA","ACCA"], industries:["Big 4 Audit","Banking","Manufacturing","Government"], tip:"The CPA board exam is everything — it opens every major door in Philippine and international finance." },
  { degree:"Education", icon:"📚", roles:["Teacher","Department Head","Principal","School Director","DepEd Official"], salary:"₱18K–₱80K+", certs:["LET License","TESOL","Special Ed Cert"], industries:["Public Schools","Private Schools","Online Tutoring","EdTech"], tip:"Pass LET first. Consider ESL online teaching (₱500–₱1,200/hr) on the side for extra income while building experience." },
  { degree:"Psychology", icon:"🧠", roles:["HR Assistant","HR Generalist","HR Manager","HR Director","CHRO"], salary:"₱17K–₱160K+", certs:["RPm License","SHRM","Counseling License"], industries:["Corporate HR","NGOs","Mental Health","Research"], tip:"RPm license is your key credential. Build skills in BambooHR and Workday. Network actively at PMAP events." },
  { degree:"Engineering", icon:"⚙️", roles:["Junior Engineer","Project Engineer","Senior Engineer","Engineering Manager","VP Engineering"], salary:"₱22K–₱220K+", certs:["PRC License","PMP","Six Sigma"], industries:["Construction","Manufacturing","Energy","Telco"], tip:"Pass your PRC board for your specialization. BIM and AutoCAD skills are in high demand — learn them early." },
  { degree:"Architecture", icon:"🏛️", roles:["Junior Architect","Architect","Senior Architect","Principal Architect","Partner"], salary:"₱20K–₱180K+", certs:["PRC License","LEED","Revit/BIM"], industries:["Real Estate","Construction","Interior Design","Urban Planning"], tip:"Pass the Architecture board. Master Revit and BIM software — firms pay a premium for these skills in PH." },
];

const GUIDE_STEPS = [
  { n:"01", icon:"🔍", title:"Know Yourself First", body:"Before applying anywhere, identify your strengths, interests, and values. Use the Holland Code (RIASEC) test. Write down what energized you most in college — that's your compass.", tip:"Try typefind.com or 16personalities.com for a free career personality test." },
  { n:"02", icon:"📄", title:"Polish Your Resume", body:"Keep it to 1 page. Lead with a 2-sentence summary. Use numbers: 'increased club membership by 40%' beats 'helped grow the club'. List thesis, org experience, internships, and skills. Export as PDF.", tip:"Use Canva's free resume templates. Avoid fancy graphics — ATS systems can't read them." },
  { n:"03", icon:"🌐", title:"Build Your LinkedIn", body:"Recruiters find YOU on LinkedIn. Use a professional photo, write a headline beyond 'Fresh Graduate', connect with classmates and professors, and set yourself to Open to Work.", tip:"A complete LinkedIn profile gets 40× more recruiter messages than an incomplete one." },
  { n:"04", icon:"🎯", title:"Apply Strategically", body:"Don't spray 100 applications. Target 10–15 companies that genuinely excite you. Tailor your resume keywords to match each job description. Quality always beats quantity.", tip:"Use GradLaunch's AI matcher to instantly find your best-fit roles across PH job boards." },
  { n:"05", icon:"🤝", title:"Nail the Interview", body:"Research the company thoroughly before going. Use STAR method (Situation, Task, Action, Result) for your answers. Arrive 10 minutes early. Bring extra resume copies and a notebook.", tip:"Practice your 90-second 'Tell me about yourself' answer until it flows naturally." },
  { n:"06", icon:"🚀", title:"Start Strong on Day One", body:"Treat your first 90 days as a second interview. Be curious, be early, deliver on every promise. Build relationships across the team, not just with your direct manager.", tip:"Ask on Day 1: 'What does success look like in this role after 90 days?' This one question makes you unforgettable." },
];

// ─── Platform config ──────────────────────────────────────────────────────────
const PLATFORMS = {
  "JobStreet":    { color: "#e53e3e", bg: "rgba(229,62,62,0.1)",    icon: "🔴" },
  "OnlineJobs.ph":{ color: "#38a169", bg: "rgba(56,161,105,0.1)",   icon: "🟢" },
  "LinkedIn":     { color: "#63b3ed", bg: "rgba(99,179,237,0.1)",   icon: "🔵" },
  "Kalibrr":      { color: "#b794f4", bg: "rgba(183,148,244,0.1)",  icon: "🟣" },
  "JobBank PH":   { color: "#f6c90e", bg: "rgba(246,201,14,0.1)",   icon: "🟡" },
};

// ─── Gemini API call ──────────────────────────────────────────────────────────
async function callGemini(apiKey, prompt, pdfBase64 = null) {
  const parts = [];
  if (pdfBase64) {
    parts.push({ inline_data: { mime_type: "application/pdf", data: pdfBase64 } });
  }
  parts.push({ text: prompt });

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts }] }),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || "Gemini API error");
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// ─── Build job search URLs ────────────────────────────────────────────────────
function buildJobLinks(profile, filters) {
  const deg = encodeURIComponent(profile.degree || "fresh graduate");
  const role = encodeURIComponent(profile.topRole || profile.degree || "");
  const loc = encodeURIComponent(filters.location === "Open to Anywhere" ? "" : filters.location);
  const salaryMap = { "Any":"", "₱15K–₱20K":"15000", "₱20K–₱30K":"20000", "₱30K–₱50K":"30000", "₱50K+":"50000" };
  const sal = salaryMap[filters.salary] || "";

  return [
    {
      platform: "JobStreet",
      title: `${profile.topRole || profile.degree} — Fresh Graduate`,
      url: `https://www.jobstreet.com.ph/en/job-search/${role.toLowerCase().replace(/%20/g,"-")}-jobs/?createdAt=7&salary=${sal}`,
      reason: `JobStreet PH is the #1 job board in the Philippines. This search is filtered to your role (${profile.topRole || profile.degree}) with fresh grad-friendly listings posted in the last 7 days.`,
      matchScore: 95,
      tags: ["#1 PH Job Board", "Fresh Grad OK", filters.type],
    },
    {
      platform: "Kalibrr",
      title: `Entry-Level ${profile.topRole || profile.degree}`,
      url: `https://www.kalibrr.com/job-board/te/${encodeURIComponent((profile.topRole || profile.degree).toLowerCase())}?employment_type=${filters.type === "Full-time" ? "full_time" : "part_time"}`,
      reason: `Kalibrr specializes in connecting fresh graduates with companies that have structured onboarding. Your ${profile.degree} background matches several active entry-level openings.`,
      matchScore: 91,
      tags: ["Fresh Grad Specialist", "Structured Training", "Fast Response"],
    },
    {
      platform: "LinkedIn",
      title: `${profile.topRole || profile.degree} — Philippines`,
      url: `https://www.linkedin.com/jobs/search/?keywords=${role}&location=Philippines&f_E=1&f_JT=${filters.type === "Full-time" ? "F" : "P"}`,
      reason: `LinkedIn's Entry Level filter (f_E=1) shows only roles open to fresh graduates in the Philippines. Your skills (${profile.skills?.slice(0,3).join(", ")}) align with active postings here.`,
      matchScore: 88,
      tags: ["Entry Level Filter", "Direct Recruiter Access", "Network Effect"],
    },
    {
      platform: "OnlineJobs.ph",
      title: `Remote ${profile.topRole || profile.degree} Role`,
      url: `https://www.onlinejobs.ph/jobseekers/info/${deg}`,
      reason: `OnlineJobs.ph connects Filipino fresh grads with local and international remote employers. Great option if you selected Remote / WFH — many roles allow work-from-home arrangements.`,
      matchScore: 84,
      tags: ["Remote Friendly", "WFH Possible", "PH-based Employers"],
    },
    {
      platform: "JobStreet",
      title: `${profile.degree} Graduate — ${filters.location}`,
      url: `https://www.jobstreet.com.ph/en/job-search/${deg}-graduate-jobs/?where=${loc}`,
      reason: `A location-specific search on JobStreet for ${profile.degree} graduates in ${filters.location}. Filtered to your area to reduce commute and show the most relevant local companies.`,
      matchScore: 82,
      tags: [`📍 ${filters.location}`, "Degree-Matched", "Local Companies"],
    },
    {
      platform: "JobBank PH",
      title: `Junior ${profile.topRole || profile.degree} Openings`,
      url: `https://jobbank.ph/search?q=${role}&l=${loc}&experience=fresh`,
      reason: `JobBank PH aggregates listings from multiple Philippine job boards. Their fresh graduate filter surfaces roles that explicitly welcome zero-experience applicants like yourself.`,
      matchScore: 78,
      tags: ["Aggregator", "Multi-Board", "Zero Experience OK"],
    },
  ];
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
const Tag = ({ children, color = T.accent, bg }) => (
  <span style={{ background: bg || color + "18", color, border: `1px solid ${color}30`, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600, letterSpacing: 0.3, whiteSpace: "nowrap" }}>{children}</span>
);

const Btn = ({ children, onClick, variant = "primary", style = {}, disabled }) => {
  const v = {
    primary: { background: T.accent, color: T.bg },
    ghost: { background: "transparent", color: T.textMid, border: `1px solid ${T.border}` },
    gold: { background: T.gold, color: T.bg },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, cursor: disabled ? "not-allowed" : "pointer", border: "none", borderRadius: 9, padding: "10px 22px", transition: "all 0.2s", opacity: disabled ? 0.45 : 1, letterSpacing: 0.3, ...v[variant], ...style }}>
      {children}
    </button>
  );
};

// ─── NavBar ───────────────────────────────────────────────────────────────────
function NavBar({ page, setPage }) {
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(8,11,18,0.9)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${T.border}`, padding: "0 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, background: `linear-gradient(135deg, ${T.accent}, ${T.violet})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Instrument Serif',serif", fontSize: 15, color: "#fff", fontStyle: "italic" }}>G</div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 800, color: T.text, letterSpacing: "-0.5px" }}>GradLaunch</span>
        </button>

        <div style={{ display: "flex", gap: 2, background: T.surface, borderRadius: 10, padding: 3, border: `1px solid ${T.border}` }}>
          {[["home","✦ Job Finder"],["paths","Career Paths"],["guide","Job Hunt Guide"]].map(([p, l]) => (
            <button key={p} onClick={() => setPage(p)} style={{ background: page === p ? T.surfaceHigh : "transparent", color: page === p ? T.text : T.textMid, border: page === p ? `1px solid ${T.border}` : "1px solid transparent", borderRadius: 7, padding: "7px 16px", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "'Syne',sans-serif", transition: "all 0.18s", letterSpacing: 0.3 }}>{l}</button>
          ))}
        </div>
        <div style={{ width: 120 }} />
      </div>
    </nav>
  );
}

// ─── API Key Gate ─────────────────────────────────────────────────────────────
function ApiKeyGate({ onSave }) {
  const [key, setKey] = useState("");
  const [err, setErr] = useState("");
  const [testing, setTesting] = useState(false);

  const test = async () => {
    if (!key.trim()) { setErr("Please enter your API key."); return; }
    setTesting(true); setErr("");
    try {
      await callGemini(key.trim(), "Reply with the single word: OK");
      onSave(key.trim());
    } catch (e) {
      setErr("Invalid key or API error: " + e.message);
    } finally { setTesting(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 2rem" }}>
      <div style={{ maxWidth: 500, width: "100%", animation: "fadeUp 0.5s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔑</div>
          <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 30, color: T.text, marginBottom: 10, fontStyle: "italic" }}>Enter your Gemini API Key</h2>
          <p style={{ color: T.textMid, fontSize: 14, lineHeight: 1.7 }}>GradLaunch uses Google Gemini to read your resume and find matched jobs. Your key is stored only in your browser — never on any server.</p>
        </div>

        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 18, padding: 32 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMid, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Gemini API Key</label>
          <input
            type="password"
            value={key}
            onChange={e => setKey(e.target.value)}
            onKeyDown={e => e.key === "Enter" && test()}
            placeholder="AIza..."
            style={{ width: "100%", padding: "12px 16px", background: T.surfaceHigh, border: `1.5px solid ${err ? T.rose : T.border}`, borderRadius: 10, color: T.text, fontSize: 14, outline: "none", marginBottom: err ? 10 : 20, fontFamily: "'DM Mono',monospace" }}
          />
          {err && <p style={{ color: T.rose, fontSize: 12, marginBottom: 16 }}>⚠ {err}</p>}

          <Btn onClick={test} disabled={testing} style={{ width: "100%", padding: 14, fontSize: 14, borderRadius: 10 }}>
            {testing ? "Testing key…" : "Save & Continue →"}
          </Btn>

          <div style={{ marginTop: 24, padding: "16px", background: T.accentGlow, border: `1px solid ${T.accent}22`, borderRadius: 10 }}>
            <p style={{ color: T.accent, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>🆓 How to get your free key:</p>
            <ol style={{ color: T.textMid, fontSize: 12, lineHeight: 2, paddingLeft: 16 }}>
              <li>Go to <strong style={{ color: T.text }}>aistudio.google.com</strong></li>
              <li>Sign in with your Google account</li>
              <li>Click <strong style={{ color: T.text }}>"Get API Key"</strong></li>
              <li>Click <strong style={{ color: T.text }}>"Create API Key"</strong></li>
              <li>Copy and paste it here</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Home / Job Finder ────────────────────────────────────────────────────────
function Home({ apiKey, onResetKey }) {
  const [stage, setStage] = useState("upload");
  const [file, setFile] = useState(null);
  const [base64, setBase64] = useState(null);
  const [filters, setFilters] = useState({ location: "Metro Manila", type: "Full-time", salary: "Any" });
  const [results, setResults] = useState(null);
  const [loadMsg, setLoadMsg] = useState("Reading your resume…");
  const [dragOver, setDragOver] = useState(false);
  const [openCard, setOpenCard] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const LOAD_MSGS = [
    "Reading your resume…",
    "Extracting your degree and skills…",
    "Building your candidate profile…",
    "Identifying your strongest roles…",
    "Generating personalized job searches…",
    "Matching to Philippine job boards…",
    "Almost ready…",
  ];

  const handleFile = (f) => {
    if (!f || f.type !== "application/pdf") { setError("Please upload a PDF file."); return; }
    setError("");
    setFile(f);
    const reader = new FileReader();
    reader.onload = e => setBase64(e.target.result.split(",")[1]);
    reader.readAsDataURL(f);
  };

  const runSearch = async () => {
    if (!base64) return;
    setStage("loading"); setError("");
    let mi = 0;
    const mt = setInterval(() => { mi = Math.min(mi + 1, LOAD_MSGS.length - 1); setLoadMsg(LOAD_MSGS[mi]); }, 2000);

    try {
      const prompt = `You are a resume parser for a Philippine job matching platform for fresh graduates.
Analyze the attached resume PDF and return ONLY a valid JSON object. No markdown, no explanation, no backticks.

{
  "name": "full name from resume",
  "degree": "college degree e.g. Computer Science",
  "school": "university name",
  "topRole": "best job title for this person e.g. Junior Software Developer",
  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "summary": "2-sentence professional summary for a fresh graduate",
  "strengths": ["strength1", "strength2", "strength3"]
}

Location preference: ${filters.location}
Job type: ${filters.type}
Salary expectation: ${filters.salary}

Be accurate. If any field is unclear, make a reasonable inference based on the degree.`;

      const raw = await callGemini(apiKey, prompt, base64);
      const clean = raw.replace(/```json|```/g, "").trim();
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Could not parse resume. Please try a clearer PDF.");
      const profile = JSON.parse(jsonMatch[0]);
      const jobs = buildJobLinks(profile, filters);

      clearInterval(mt);
      setResults({ profile, jobs });
      setStage("results");
    } catch (e) {
      clearInterval(mt);
      setError(e.message || "Something went wrong. Please try again.");
      setStage("upload");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, paddingTop: 60 }}>

      {/* ── UPLOAD ── */}
      {stage === "upload" && (
        <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 2rem", position: "relative", overflow: "hidden" }}>
          {/* bg grid */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${T.border}50 1px, transparent 1px), linear-gradient(90deg, ${T.border}50 1px, transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none" }} />
          {/* glow */}
          <div style={{ position: "absolute", width: 600, height: 400, borderRadius: "50%", background: `radial-gradient(ellipse, ${T.accentGlow} 0%, transparent 70%)`, top: "0%", left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }} />

          <div style={{ position: "relative", maxWidth: 720, textAlign: "center", animation: "fadeUp 0.6s ease" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: T.accentGlow, border: `1px solid ${T.accent}33`, borderRadius: 40, padding: "6px 20px", marginBottom: 36 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, display: "inline-block", animation: "pulse 2s infinite" }} />
              <span style={{ color: T.accent, fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>FREE · AI-POWERED · PHILIPPINE JOB BOARDS</span>
            </div>

            <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(2.8rem,7vw,5.2rem)", fontWeight: 400, color: T.text, lineHeight: 1.08, marginBottom: 20, letterSpacing: "-1.5px" }}>
              Upload your resume.<br />
              <em style={{ color: T.accent }}>We find your job.</em>
            </h1>

            <p style={{ color: T.textMid, fontSize: "clamp(0.95rem,2vw,1.1rem)", lineHeight: 1.8, maxWidth: 520, margin: "0 auto 52px" }}>
              Our AI reads your resume, understands your degree and skills, then generates personalized search links across JobStreet PH, OnlineJobs.ph, Kalibrr, and LinkedIn — with a match explanation for each.
            </p>

            {/* Upload zone */}
            <div
              onClick={() => fileRef.current.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              style={{ border: `2px dashed ${dragOver ? T.accent : file ? T.green : T.border}`, borderRadius: 20, padding: "52px 32px", cursor: "pointer", background: dragOver ? T.accentGlow : file ? T.greenPale : T.surface, transition: "all 0.25s", marginBottom: 16, position: "relative", overflow: "hidden", animation: file ? "glow 2s infinite" : "none" }}
            >
              {!file && <div style={{ position: "absolute", inset: 0, background: `linear-gradient(transparent 0%, ${T.accent}06 50%, transparent 100%)`, height: "40%", animation: "scanline 4s ease-in-out infinite", pointerEvents: "none" }} />}
              <div style={{ fontSize: 52, marginBottom: 14 }}>{file ? "📄" : "⬆️"}</div>
              {file ? (
                <>
                  <p style={{ color: T.green, fontWeight: 700, fontSize: 16, marginBottom: 6 }}>✓ {file.name}</p>
                  <p style={{ color: T.textMid, fontSize: 13 }}>Resume loaded · Click to change</p>
                </>
              ) : (
                <>
                  <p style={{ color: T.text, fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Drag & drop your resume here</p>
                  <p style={{ color: T.textMid, fontSize: 13 }}>PDF only · Max 10MB · Never stored on any server</p>
                </>
              )}
              <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
            </div>

            {error && <p style={{ color: T.rose, fontSize: 13, marginBottom: 16 }}>⚠ {error}</p>}

            {file && (
              <Btn onClick={() => setStage("filters")} style={{ padding: "14px 44px", fontSize: 15, borderRadius: 12, background: T.accent, color: T.bg }}>
                Continue → Set Preferences
              </Btn>
            )}

            {/* Stats */}
            <div style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 56, flexWrap: "wrap" }}>
              {[["🔒","Private","Resume never stored"],["⚡","~30 sec","From upload to results"],["🇵🇭","PH-Focused","Real local job boards"],["🆓","Free","Powered by Gemini AI"]].map(([ic,t,d]) => (
                <div key={t} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, marginBottom: 5 }}>{ic}</div>
                  <div style={{ color: T.text, fontWeight: 700, fontSize: 13 }}>{t}</div>
                  <div style={{ color: T.textLow, fontSize: 11 }}>{d}</div>
                </div>
              ))}
            </div>

            <button onClick={onResetKey} style={{ background: "none", border: "none", color: T.textLow, fontSize: 11, cursor: "pointer", marginTop: 32, textDecoration: "underline" }}>Change API Key</button>
          </div>
        </section>
      )}

      {/* ── FILTERS ── */}
      {stage === "filters" && (
        <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 2rem", animation: "fadeUp 0.4s ease" }}>
          <div style={{ width: "100%", maxWidth: 540 }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>⚙️</div>
              <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 32, color: T.text, marginBottom: 8, fontStyle: "italic" }}>Set your preferences</h2>
              <p style={{ color: T.textMid, fontSize: 14 }}>This helps us generate more targeted job search links for you.</p>
            </div>

            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, padding: 36, display: "flex", flexDirection: "column", gap: 28 }}>
              {[
                { label: "📍 Preferred Location", key: "location", opts: ["Metro Manila","Cebu","Davao","Laguna / Cavite","Remote / WFH","Open to Anywhere"], activeColor: T.accent },
                { label: "💼 Employment Type", key: "type", opts: ["Full-time","Part-time","Internship","Freelance","Remote"], activeColor: T.accent },
                { label: "💰 Expected Monthly Salary", key: "salary", opts: ["Any","₱15K–₱20K","₱20K–₱30K","₱30K–₱50K","₱50K+"], activeColor: T.gold },
              ].map(({ label, key, opts, activeColor }) => (
                <div key={key}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMid, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>{label}</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {opts.map(o => (
                      <button key={o} onClick={() => setFilters(f => ({ ...f, [key]: o }))}
                        style={{ padding: "8px 16px", borderRadius: 8, border: `1.5px solid ${filters[key] === o ? activeColor : T.border}`, background: filters[key] === o ? activeColor + "18" : "transparent", color: filters[key] === o ? activeColor : T.textMid, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.18s", fontFamily: "'Syne',sans-serif" }}>
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                <Btn variant="ghost" onClick={() => setStage("upload")} style={{ flex: 1, padding: 13 }}>← Back</Btn>
                <Btn onClick={runSearch} style={{ flex: 2, padding: 13, fontSize: 14, background: T.accent, color: T.bg, borderRadius: 10 }}>
                  Analyze Resume & Find Jobs ✦
                </Btn>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── LOADING ── */}
      {stage === "loading" && (
        <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 2rem", animation: "fadeIn 0.4s ease" }}>
          <div style={{ textAlign: "center", maxWidth: 480 }}>
            <div style={{ width: 72, height: 72, border: `3px solid ${T.border}`, borderTopColor: T.accent, borderRadius: "50%", animation: "spin 0.9s linear infinite", margin: "0 auto 32px" }} />
            <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 26, color: T.text, marginBottom: 12, fontStyle: "italic", transition: "all 0.3s" }}>{loadMsg}</h2>
            <p style={{ color: T.textMid, fontSize: 13, marginBottom: 40 }}>Using Google Gemini AI — this takes about 20–30 seconds.</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              {Object.entries(PLATFORMS).map(([name, cfg]) => (
                <div key={name} style={{ background: T.surface, border: `1px solid ${cfg.color}33`, borderRadius: 8, padding: "6px 14px", fontSize: 11, color: cfg.color, fontWeight: 600, animation: "shimmer 2s infinite", animationDelay: Math.random() * 1 + "s" }}>
                  {cfg.icon} {name}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── RESULTS ── */}
      {stage === "results" && results && (
        <section style={{ minHeight: "100vh", padding: "88px 2rem 60px", animation: "fadeUp 0.5s ease" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>

            {/* Profile strip */}
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "18px 24px", marginBottom: 28, display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: T.accentGlow, border: `2px solid ${T.accent}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🎓</div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ fontWeight: 800, fontSize: 15, color: T.text, marginBottom: 2 }}>{results.profile?.name || "Your Profile"}</p>
                <p style={{ color: T.textMid, fontSize: 12 }}>{results.profile?.degree} · {results.profile?.school} · {filters.location} · {filters.type}</p>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {results.profile?.skills?.slice(0, 4).map(s => <Tag key={s}>{s}</Tag>)}
              </div>
              <Btn variant="ghost" onClick={() => { setStage("upload"); setFile(null); setBase64(null); setResults(null); setOpenCard(null); }} style={{ fontSize: 11, padding: "7px 14px", flexShrink: 0 }}>↺ New Search</Btn>
            </div>

            {/* Summary card */}
            <div style={{ background: T.accentGlow, border: `1px solid ${T.accent}33`, borderRadius: 14, padding: "16px 22px", marginBottom: 28, display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>✦</span>
              <div>
                <p style={{ color: T.accent, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 5 }}>AI Profile Summary</p>
                <p style={{ color: T.text, fontSize: 14, lineHeight: 1.7 }}>{results.profile?.summary}</p>
                {results.profile?.strengths && (
                  <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                    {results.profile.strengths.map(s => <Tag key={s} color={T.green} bg={T.greenPale}>✓ {s}</Tag>)}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 26, color: T.text, marginBottom: 3, fontStyle: "italic" }}>Your Matched Job Searches</h2>
                <p style={{ color: T.textMid, fontSize: 13 }}>{results.jobs?.length} personalized search links · Click a card to expand · Open link to apply</p>
              </div>
              <Btn variant="ghost" onClick={() => setStage("filters")} style={{ fontSize: 12 }}>⚙ Adjust Filters</Btn>
            </div>

            {/* Job cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: 16 }}>
              {results.jobs?.map((job, i) => {
                const plat = PLATFORMS[job.platform] || { color: T.accent, bg: T.accentGlow, icon: "🔵" };
                const isOpen = openCard === i;
                return (
                  <div key={i}
                    style={{ background: T.surface, border: `1.5px solid ${isOpen ? T.accent : T.border}`, borderRadius: 16, overflow: "hidden", transition: "all 0.25s ease", cursor: "pointer", animation: `fadeUp 0.4s ease ${i * 0.06}s both`, transform: isOpen ? "none" : "translateY(0)" }}
                    onClick={() => setOpenCard(isOpen ? null : i)}>
                    {/* match bar */}
                    <div style={{ height: 3, background: T.border }}>
                      <div style={{ height: "100%", width: `${job.matchScore}%`, background: `linear-gradient(90deg, ${T.accent}, ${T.gold})`, borderRadius: 2, transition: "width 1s ease" }} />
                    </div>

                    <div style={{ padding: 22 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 8 }}>
                            <span style={{ background: plat.bg, color: plat.color, border: `1px solid ${plat.color}33`, borderRadius: 6, padding: "2px 9px", fontSize: 10, fontWeight: 700 }}>{plat.icon} {job.platform}</span>
                            <span style={{ color: T.textLow, fontSize: 10, fontFamily: "'DM Mono',monospace" }}>#{i + 1}</span>
                          </div>
                          <h3 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 17, color: T.text, lineHeight: 1.3, marginBottom: 0 }}>{job.title}</h3>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 22, fontWeight: 500, color: job.matchScore >= 90 ? T.green : job.matchScore >= 80 ? T.gold : T.accent }}>{job.matchScore}%</div>
                          <div style={{ color: T.textLow, fontSize: 10 }}>match</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                        {job.tags?.map(t => <Tag key={t} color={T.textMid} bg={T.surfaceHigh}>{t}</Tag>)}
                      </div>

                      <p style={{ color: T.textLow, fontSize: 11 }}>{isOpen ? "▲ collapse" : "▼ see why this matches you"}</p>

                      {isOpen && (
                        <div style={{ marginTop: 16, animation: "fadeUp 0.2s ease" }}>
                          <div style={{ background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px", marginBottom: 14 }}>
                            <p style={{ fontSize: 10, color: T.accent, fontWeight: 700, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>✦ Why This Matches You</p>
                            <p style={{ color: T.textMid, fontSize: 13, lineHeight: 1.7 }}>{job.reason}</p>
                          </div>
                          <a href={job.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }} onClick={e => e.stopPropagation()}>
                            <div style={{ background: plat.color, color: "#fff", borderRadius: 10, padding: "13px", textAlign: "center", fontWeight: 800, fontSize: 14, fontFamily: "'Syne',sans-serif", transition: "opacity 0.18s" }}
                              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                              Search on {job.platform} →
                            </div>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Direct board links */}
            <div style={{ marginTop: 40, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 26 }}>
              <p style={{ color: T.textMid, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 18 }}>Browse All Philippine Job Boards Directly</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  { n:"JobStreet PH", url:"https://www.jobstreet.com.ph", c:"#e53e3e" },
                  { n:"OnlineJobs.ph", url:"https://www.onlinejobs.ph", c:"#38a169" },
                  { n:"Kalibrr", url:"https://www.kalibrr.com/job-board", c:"#b794f4" },
                  { n:"LinkedIn PH", url:`https://www.linkedin.com/jobs/search/?location=Philippines&f_E=1`, c:"#63b3ed" },
                  { n:"JobBank PH", url:"https://jobbank.ph", c:"#f6c90e" },
                  { n:"Glassdoor PH", url:"https://www.glassdoor.com/Job/philippines-jobs-SRCH_IL.0,11_IN204.htm", c:"#48bb78" },
                ].map(b => (
                  <a key={b.n} href={b.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <div style={{ background: T.surfaceHigh, border: `1.5px solid ${b.c}44`, borderRadius: 9, padding: "9px 18px", color: b.c, fontSize: 13, fontWeight: 700, transition: "all 0.18s", cursor: "pointer" }}
                      onMouseEnter={e => { e.currentTarget.style.background = b.c + "18"; e.currentTarget.style.borderColor = b.c; }}
                      onMouseLeave={e => { e.currentTarget.style.background = T.surfaceHigh; e.currentTarget.style.borderColor = b.c + "44"; }}>
                      {b.n} ↗
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Career Paths ─────────────────────────────────────────────────────────────
function CareerPaths() {
  const [active, setActive] = useState(0);
  const p = CAREER_PATHS[active];
  return (
    <div style={{ minHeight: "100vh", background: T.bg, paddingTop: 60 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{ color: T.accent, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Navigate Your Future</p>
          <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(2.2rem,5vw,3.5rem)", color: T.text, fontStyle: "italic", marginBottom: 12 }}>Career Paths by Degree</h1>
          <p style={{ color: T.textMid, fontSize: 15, maxWidth: 500, margin: "0 auto" }}>Select your degree to see a real roadmap — salaries, certifications, and where to start.</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 48 }}>
          {CAREER_PATHS.map((cp, i) => (
            <button key={cp.degree} onClick={() => setActive(i)} style={{ padding: "9px 18px", borderRadius: 10, border: `1.5px solid ${active === i ? T.accent : T.border}`, background: active === i ? T.accentGlow : T.surface, color: active === i ? T.accent : T.textMid, fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s", fontFamily: "'Syne',sans-serif" }}>
              {cp.icon} {cp.degree}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 28, gridColumn: "1/-1" }}>
            <p style={{ color: T.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 18 }}>Career Progression</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              {p.roles.map((r, i) => (
                <div key={r} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ background: i === 0 ? T.accentGlow : T.surfaceHigh, border: `1.5px solid ${i === 0 ? T.accent : T.border}`, borderRadius: 10, padding: "9px 18px", color: i === 0 ? T.accent : T.textMid, fontSize: 13, fontWeight: i === 0 ? 700 : 400 }}>{r}</div>
                  {i < p.roles.length - 1 && <span style={{ color: T.textLow, fontSize: 18 }}>→</span>}
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 28 }}>
            <p style={{ color: T.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Salary Range</p>
            <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 34, color: T.gold, marginBottom: 8 }}>{p.salary}</p>
            <p style={{ color: T.textLow, fontSize: 12 }}>Philippine market, entry to senior level.</p>
          </div>
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 28 }}>
            <p style={{ color: T.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>Certifications to Pursue</p>
            {p.certs.map(c => <div key={c} style={{ display: "flex", gap: 10, alignItems: "center", color: T.textMid, fontSize: 13, marginBottom: 10 }}><span style={{ color: T.green }}>✓</span>{c}</div>)}
          </div>
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 28 }}>
            <p style={{ color: T.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>Industries to Explore</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{p.industries.map(ind => <Tag key={ind} color={T.textMid} bg={T.surfaceHigh}>{ind}</Tag>)}</div>
          </div>
          <div style={{ background: T.accentGlow, border: `1px solid ${T.accent}22`, borderRadius: 16, padding: 28, gridColumn: "1/-1" }}>
            <p style={{ color: T.accent, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>✦ Your First Step — Right Now</p>
            <p style={{ color: T.text, fontSize: 15, lineHeight: 1.8 }}>{p.tip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Guide ────────────────────────────────────────────────────────────────────
function Guide() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ minHeight: "100vh", background: T.bg, paddingTop: 60 }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{ color: T.accent, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Step by Step</p>
          <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(2.2rem,5vw,3.5rem)", color: T.text, fontStyle: "italic", marginBottom: 12 }}>How to Land Your First Job</h1>
          <p style={{ color: T.textMid, fontSize: 15, maxWidth: 460, margin: "0 auto" }}>Never worked full-time? Follow this guide and go from fresh grad to hired — with confidence.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {GUIDE_STEPS.map((s, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ background: T.surface, border: `1.5px solid ${isOpen ? T.accent : T.border}`, borderRadius: 14, overflow: "hidden", transition: "all 0.25s" }}>
                <button onClick={() => setOpen(isOpen ? null : i)} style={{ width: "100%", background: "none", border: "none", padding: "22px 24px", cursor: "pointer", display: "flex", alignItems: "center", gap: 20, textAlign: "left" }}>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 20, color: isOpen ? T.accent : T.textLow, minWidth: 36, transition: "color 0.2s" }}>{s.n}</span>
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                  <h3 style={{ color: T.text, fontFamily: "'Instrument Serif',serif", fontSize: 18, flex: 1 }}>{s.title}</h3>
                  <span style={{ color: T.textLow, fontSize: 16, transition: "transform 0.25s", transform: isOpen ? "rotate(180deg)" : "none", display: "inline-block" }}>↓</span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 24px 24px", animation: "fadeUp 0.2s ease" }}>
                    <p style={{ color: T.textMid, fontSize: 14, lineHeight: 1.8, marginBottom: 14 }}>{s.body}</p>
                    <div style={{ background: T.accentGlow, border: `1px solid ${T.accent}22`, borderRadius: 10, padding: "12px 16px", display: "flex", gap: 10 }}>
                      <span style={{ color: T.accent, flexShrink: 0 }}>💡</span>
                      <p style={{ color: T.accent, fontSize: 13 }}><strong>Pro Tip:</strong> {s.tip}</p>
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
    <footer style={{ background: T.surface, borderTop: `1px solid ${T.border}`, padding: "36px 2rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
        <div>
          <div style={{ fontFamily: "'Instrument Serif',serif", color: T.text, fontSize: 18, marginBottom: 3 }}>GradLaunch</div>
          <p style={{ color: T.textLow, fontSize: 12 }}>Free AI job matching for Filipino fresh graduates. Powered by Google Gemini.</p>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {[["home","Job Finder"],["paths","Career Paths"],["guide","Guide"]].map(([p,l]) => (
            <button key={p} onClick={() => setPage(p)} style={{ background: "none", border: "none", color: T.textLow, fontSize: 12, cursor: "pointer", fontFamily: "'Syne',sans-serif" }}>{l}</button>
          ))}
        </div>
        <p style={{ color: T.textLow, fontSize: 11 }}>© 2025 GradLaunch · Built for 🇵🇭 fresh grads · Always free</p>
      </div>
    </footer>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("gl_gemini_key") || "");

  const saveKey = (key) => {
    localStorage.setItem("gl_gemini_key", key);
    setApiKey(key);
  };

  const resetKey = () => {
    localStorage.removeItem("gl_gemini_key");
    setApiKey("");
  };

  const goTo = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  if (!apiKey) return (
    <div><style>{STYLES}</style><NavBar page={page} setPage={goTo} /><ApiKeyGate onSave={saveKey} /></div>
  );

  return (
    <div>
      <style>{STYLES}</style>
      <NavBar page={page} setPage={goTo} />
      {page === "home"  && <><Home apiKey={apiKey} onResetKey={resetKey} /><Footer setPage={goTo} /></>}
      {page === "paths" && <><CareerPaths /><Footer setPage={goTo} /></>}
      {page === "guide" && <><Guide /><Footer setPage={goTo} /></>}
    </div>
  );
}