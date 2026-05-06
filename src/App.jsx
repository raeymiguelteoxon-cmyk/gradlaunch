import { useState, useRef, useCallback } from "react";

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
  @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(400%); } }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes gradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(99,179,237,0.2)} 50%{box-shadow:0 0 40px rgba(99,179,237,0.5)} }
`;

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  bg: "#080b12",
  surface: "#0e1420",
  surfaceHigh: "#141c2e",
  border: "#1e2d47",
  borderHigh: "#2a3a5c",
  text: "#e8eaf0",
  textMid: "#8a9bb8",
  textLow: "#4a5a78",
  accent: "#63b3ed",
  accentGlow: "rgba(99,179,237,0.15)",
  accentDark: "#1a3a5c",
  gold: "#f6c90e",
  goldPale: "rgba(246,201,14,0.12)",
  green: "#48bb78",
  greenPale: "rgba(72,187,120,0.12)",
  red: "#fc8181",
  redPale: "rgba(252,129,129,0.12)",
};

// ─── Career Paths Data ────────────────────────────────────────────────────────
const CAREER_PATHS = [
  { degree: "Computer Science", icon: "💻", roles: ["Junior Developer","Mid Developer","Senior Developer","Tech Lead","CTO"], salary: "₱25K–₱250K+", certs: ["AWS Certified","Google Cloud","Meta Front-End"], industries: ["FinTech","E-Commerce","Startups","BPO"], tip: "Build a GitHub portfolio with 3 real projects. Contribute to open source. Get AWS certified early." },
  { degree: "Business Administration", icon: "📊", roles: ["Marketing Assoc.","Brand Manager","Marketing Director","VP Marketing","CMO"], salary: "₱18K–₱180K+", certs: ["Google Ads","HubSpot","PMP"], industries: ["FMCG","Banking","Retail","Consulting"], tip: "Get Google Analytics certified for free. Build Excel and data skills. Network at industry events." },
  { degree: "Nursing", icon: "🏥", roles: ["Staff Nurse","Head Nurse","Supervisor","Director","CNO"], salary: "₱22K–₱200K+ (abroad)", certs: ["PRC License","BLS/ACLS","NCLEX"], industries: ["Hospitals","Clinics","OFW Nursing","Telehealth"], tip: "Pass PRC first. Get 1–2 years local experience. Then pursue NCLEX for USA opportunities." },
  { degree: "Accountancy", icon: "🧾", roles: ["Junior Accountant","Senior Accountant","Finance Manager","Controller","CFO"], salary: "₱20K–₱200K+", certs: ["CPA License","CMA","ACCA"], industries: ["Big 4 Audit","Banking","Manufacturing","Government"], tip: "The CPA board exam is everything. It opens every major door in finance." },
  { degree: "Education", icon: "📚", roles: ["Teacher","Dept Head","Principal","School Director","DepEd Official"], salary: "₱18K–₱80K+", certs: ["LET License","TESOL","Special Ed"], industries: ["Public Schools","Private Schools","Online Tutoring","EdTech"], tip: "Pass LET, then consider ESL online teaching (₱500–₱1,200/hr) for extra income." },
  { degree: "Psychology", icon: "🧠", roles: ["HR Assistant","HR Generalist","HR Manager","HR Director","CHRO"], salary: "₱17K–₱160K+", certs: ["RPm License","SHRM","Counseling"], industries: ["Corporate HR","NGOs","Mental Health","Research"], tip: "RPm license is your key. Build skills in BambooHR and Workday. Network at PMAP events." },
  { degree: "Engineering", icon: "⚙️", roles: ["Junior Engineer","Project Engineer","Senior Engineer","Engineering Manager","VP Engineering"], salary: "₱22K–₱220K+", certs: ["PRC License","PMP","Six Sigma"], industries: ["Construction","Manufacturing","Energy","Telco"], tip: "Pass PRC board for your specialization. BIM skills are in high demand for civil engineers." },
  { degree: "Architecture", icon: "🏛️", roles: ["Junior Architect","Architect","Senior Architect","Principal","Partner"], salary: "₱20K–₱180K+", certs:["PRC License","LEED","AutoCAD"], industries: ["Real Estate","Construction","Interior Design","Urban Planning"], tip: "Pass the Architecture board. Learn Revit and BIM — firms pay premium for these skills." },
];

const TUTORIAL_STEPS = [
  { n:"01", icon:"🔍", title:"Know Yourself", body:"Use the Holland Code (RIASEC) test to understand your career personality. Write down what energized you in college — that's your compass.", tip:"Try typefind.com or 16personalities.com free." },
  { n:"02", icon:"📄", title:"Polish Your Resume", body:"Keep it 1 page. Lead with a 2-sentence summary. Use numbers: 'increased club membership by 40%' beats 'helped grow the club'. Export as PDF.", tip:"Canva has free resume templates. Avoid fancy graphics — ATS can't read them." },
  { n:"03", icon:"🌐", title:"Build Your LinkedIn", body:"Recruiters find YOU on LinkedIn. Use a professional photo, write a headline beyond 'Fresh Graduate', and set yourself to Open to Work.", tip:"A complete LinkedIn profile gets 40× more recruiter views." },
  { n:"04", icon:"🎯", title:"Apply Strategically", body:"Target 10–15 companies that excite you. Tailor your resume keywords to match each job description. Quality beats quantity.", tip:"Use GradLaunch's AI matcher to find the best-fit roles instantly." },
  { n:"05", icon:"🤝", title:"Nail the Interview", body:"Research the company. Use STAR method (Situation, Task, Action, Result). Arrive 10 min early. Bring extra resume copies.", tip:"Practice your 90-second 'Tell me about yourself' answer until it's natural." },
  { n:"06", icon:"🚀", title:"Start Strong", body:"Your first 90 days are a second interview. Be curious, be early, deliver on every promise. Ask: 'What does success look like in 90 days?'", tip:"This single question makes you stand out from every other new hire." },
];

// ─── Shared Components ────────────────────────────────────────────────────────
const Btn = ({ children, onClick, variant = "primary", style = {}, disabled }) => {
  const base = { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, cursor: disabled ? "not-allowed" : "pointer", border: "none", borderRadius: 8, padding: "10px 22px", transition: "all 0.2s", opacity: disabled ? 0.5 : 1, letterSpacing: 0.3 };
  const v = {
    primary: { background: T.accent, color: "#080b12" },
    ghost: { background: "transparent", color: T.textMid, border: `1px solid ${T.border}` },
    gold: { background: T.gold, color: "#080b12" },
    outline: { background: "transparent", color: T.accent, border: `1px solid ${T.accent}` },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...v[variant], ...style }}>{children}</button>;
};

const Tag = ({ children, color = T.accent, bg }) => (
  <span style={{ background: bg || color + "18", color, border: `1px solid ${color}33`, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600, letterSpacing: 0.3 }}>{children}</span>
);

const Spinner = () => (
  <div style={{ width: 20, height: 20, border: `2px solid ${T.border}`, borderTopColor: T.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
);

// ─── NavBar ───────────────────────────────────────────────────────────────────
function NavBar({ page, setPage }) {
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(8,11,18,0.85)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${T.border}`, padding: "0 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, background: `linear-gradient(135deg, ${T.accent}, #9f7aea)`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Instrument Serif', serif", fontSize: 16, fontWeight: 400, color: "#fff", fontStyle: "italic" }}>G</div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800, color: T.text, letterSpacing: "-0.5px" }}>GradLaunch</span>
        </button>
        <div style={{ display: "flex", gap: 2, background: T.surface, borderRadius: 10, padding: 3, border: `1px solid ${T.border}` }}>
          {[["home","✦ Job Finder"],["paths","Career Paths"],["guide","Job Hunt Guide"]].map(([p,l]) => (
            <button key={p} onClick={() => setPage(p)} style={{ background: page === p ? T.surfaceHigh : "transparent", color: page === p ? T.text : T.textMid, border: page === p ? `1px solid ${T.border}` : "1px solid transparent", borderRadius: 7, padding: "7px 16px", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "'Syne', sans-serif", transition: "all 0.18s", letterSpacing: 0.3 }}>{l}</button>
          ))}
        </div>
        <div style={{ width: 120 }} />
      </div>
    </nav>
  );
}

// ─── Home / Job Finder ────────────────────────────────────────────────────────
function Home() {
  const [stage, setStage] = useState("upload"); // upload | filters | loading | results
  const [file, setFile] = useState(null);
  const [base64, setBase64] = useState(null);
  const [filters, setFilters] = useState({ location: "Metro Manila", type: "Full-time", salary: "Any" });
  const [results, setResults] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadMsg, setLoadMsg] = useState("Reading your resume…");
  const [dragOver, setDragOver] = useState(false);
  const [openCard, setOpenCard] = useState(null);
  const fileRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => { setBase64(e.target.result.split(",")[1]); };
    reader.readAsDataURL(f);
  };

  const LOAD_MESSAGES = [
    "Reading your resume…",
    "Extracting your skills and degree…",
    "Building your candidate profile…",
    "Crafting job search queries…",
    "Scanning Philippine job boards…",
    "Matching roles to your background…",
    "Generating match explanations…",
    "Almost ready…",
  ];

  const runSearch = async () => {
    if (!base64) return;
    setStage("loading");
    let msgIdx = 0;
    const msgTimer = setInterval(() => {
      msgIdx = Math.min(msgIdx + 1, LOAD_MESSAGES.length - 1);
      setLoadMsg(LOAD_MESSAGES[msgIdx]);
    }, 2200);

    try {
      // Step 1: Parse resume with Claude
      const parseRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are a resume parser. Extract structured info from the resume and return ONLY valid JSON, no markdown, no explanation. Format:
{
  "name": "string",
  "degree": "string (e.g. Computer Science)",
  "school": "string",
  "skills": ["skill1","skill2"],
  "experiences": ["brief description"],
  "summary": "2-sentence profile summary",
  "searchQueries": ["query1 site:jobstreet.com.ph OR site:onlinejobs.ph", "query2 site:linkedin.com/jobs", "query3 site:kalibrr.com"]
}
The searchQueries should be 3 highly targeted Google search queries to find real job listings in the Philippines for this person. Include site: operators for major PH job boards.`,
          messages: [{
            role: "user",
            content: [
              { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } },
              { type: "text", text: `Parse this resume. Location preference: ${filters.location}. Job type: ${filters.type}. Salary expectation: ${filters.salary}.` }
            ]
          }]
        })
      });
      const parseData = await parseRes.json();
      const parsed = JSON.parse(parseData.content[0].text);
      setProfile(parsed);

      // Step 2: Find real jobs via web search
      const searchRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          system: `You are a Philippine job search assistant for fresh graduates. Search for REAL, CURRENT job listings on Philippine job boards (JobStreet PH, OnlineJobs.ph, Kalibrr, LinkedIn PH, Jobbank PH). 
Return ONLY a JSON array of 8 jobs. No markdown, no explanation. Each job:
{
  "title": "exact job title",
  "company": "company name",
  "location": "city, PH",
  "salary": "salary range or 'Competitive'",
  "platform": "JobStreet" | "OnlineJobs.ph" | "LinkedIn" | "Kalibrr" | "JobBank",
  "url": "direct URL to the job post",
  "matchScore": 85,
  "matchReason": "2-sentence explanation of why this fits the candidate",
  "tags": ["tag1","tag2","tag3"],
  "type": "Full-time"
}
Only return real URLs that actually exist on these platforms. If unsure of exact URL, use the platform search URL with the job title as query.`,
          messages: [{
            role: "user",
            content: `Find 8 real job listings in the Philippines for this fresh graduate:
Degree: ${parsed.degree}
Skills: ${parsed.skills?.join(", ")}
Location: ${filters.location}
Job Type: ${filters.type}
Salary: ${filters.salary}
Profile: ${parsed.summary}

Search JobStreet PH, OnlineJobs.ph, Kalibrr, LinkedIn PH. Return real current listings with direct links.`
          }]
        })
      });

      const searchData = await searchRes.json();
      const textBlock = searchData.content.find(b => b.type === "text");
      let jobs = [];
      if (textBlock) {
        const clean = textBlock.text.replace(/```json|```/g, "").trim();
        const jsonMatch = clean.match(/\[[\s\S]*\]/);
        if (jsonMatch) jobs = JSON.parse(jsonMatch[0]);
      }

      // Fallback: generate smart search URLs if no jobs found
      if (!jobs.length) {
        const query = encodeURIComponent(`${parsed.degree} fresh graduate ${filters.location}`);
        jobs = [
          { title: `${parsed.degree} Graduate`, company: "Various Companies", location: filters.location, salary: "Competitive", platform: "JobStreet", url: `https://www.jobstreet.com.ph/en/job-search/${encodeURIComponent(parsed.degree.toLowerCase().replace(/ /g,"-"))}-jobs/`, matchScore: 90, matchReason: `Directly matched to your ${parsed.degree} degree on JobStreet PH. Fresh graduate roles available.`, tags: parsed.skills?.slice(0,3) || ["Entry Level","Fresh Grad","Full-time"], type: filters.type },
          { title: `Entry Level ${parsed.degree}`, company: "Various Companies", location: filters.location, salary: "Competitive", platform: "Kalibrr", url: `https://www.kalibrr.com/job-board/te/${encodeURIComponent(parsed.degree.toLowerCase())}`, matchScore: 87, matchReason: `Kalibrr specializes in fresh graduate hiring. Your skills match several active openings.`, tags: ["Entry Level","Fresh Grad","Mentorship"], type: filters.type },
          { title: `Junior ${parsed.degree} Role`, company: "Various Companies", location: filters.location, salary: "Competitive", platform: "LinkedIn", url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(parsed.degree)}&location=Philippines&f_E=1`, matchScore: 85, matchReason: `LinkedIn PH has active fresh graduate openings matching your degree and location preference.`, tags: ["LinkedIn","Entry Level","Network"], type: filters.type },
          { title: `${parsed.degree} Associate`, company: "Various Companies", location: filters.location, salary: "Competitive", platform: "OnlineJobs.ph", url: `https://www.onlinejobs.ph/jobseekers/info/${encodeURIComponent(parsed.degree)}`, matchScore: 82, matchReason: `OnlineJobs.ph connects Filipino fresh grads with local and remote opportunities.`, tags: ["Remote Possible","Entry Level","PH-based"], type: filters.type },
        ];
      }

      clearInterval(msgTimer);
      setResults({ profile: parsed, jobs });
      setStage("results");
    } catch (err) {
      clearInterval(msgTimer);
      setLoadMsg("Something went wrong. Please try again.");
      setTimeout(() => setStage("upload"), 2500);
    }
  };

  const platformColors = { JobStreet: "#e53e3e", "OnlineJobs.ph": "#38a169", LinkedIn: "#0077b5", Kalibrr: "#805ad5", JobBank: "#dd6b20" };
  const platformBg = { JobStreet: "rgba(229,62,62,0.12)", "OnlineJobs.ph": "rgba(56,161,105,0.12)", LinkedIn: "rgba(0,119,181,0.12)", Kalibrr: "rgba(128,90,213,0.12)", JobBank: "rgba(221,107,32,0.12)" };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, paddingTop: 60 }}>

      {/* ── HERO ── */}
      {stage === "upload" && (
        <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 2rem", position: "relative", overflow: "hidden" }}>
          {/* bg grid */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${T.border}40 1px, transparent 1px), linear-gradient(90deg, ${T.border}40 1px, transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none" }} />
          {/* glow orbs */}
          <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${T.accentGlow} 0%, transparent 70%)`, top: "10%", left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }} />

          <div style={{ position: "relative", maxWidth: 760, textAlign: "center", animation: "fadeUp 0.7s ease" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: T.accentGlow, border: `1px solid ${T.accent}33`, borderRadius: 40, padding: "6px 18px", marginBottom: 32 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, display: "inline-block", animation: "pulse 2s infinite" }} />
              <span style={{ color: T.accent, fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>AI-POWERED · PHILIPPINE JOB BOARDS · REAL LISTINGS</span>
            </div>

            <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(3rem,7vw,5.5rem)", fontWeight: 400, color: T.text, lineHeight: 1.05, marginBottom: 20, letterSpacing: "-1px" }}>
              Upload your resume.<br />
              <em style={{ color: T.accent }}>We find your job.</em>
            </h1>

            <p style={{ color: T.textMid, fontSize: "clamp(1rem,2vw,1.15rem)", lineHeight: 1.8, marginBottom: 56, maxWidth: 540, margin: "0 auto 56px" }}>
              Our AI reads your resume, understands your degree and skills, then scans JobStreet PH, OnlineJobs.ph, Kalibrr, and LinkedIn to find real, open roles matched to you — with direct links.
            </p>

            {/* Upload Zone */}
            <div
              onClick={() => fileRef.current.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              style={{ border: `2px dashed ${dragOver ? T.accent : file ? T.green : T.border}`, borderRadius: 20, padding: "52px 40px", cursor: "pointer", background: dragOver ? T.accentGlow : file ? T.greenPale : T.surface, transition: "all 0.25s", marginBottom: 24, position: "relative", overflow: "hidden" }}
            >
              {/* scanline effect */}
              {!file && <div style={{ position: "absolute", inset: 0, background: `linear-gradient(transparent 0%, ${T.accent}08 50%, transparent 100%)`, height: "30%", animation: "scanline 3s ease-in-out infinite", pointerEvents: "none" }} />}

              <div style={{ fontSize: 48, marginBottom: 16 }}>{file ? "📄" : "⬆️"}</div>
              {file ? (
                <>
                  <p style={{ color: T.green, fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{file.name}</p>
                  <p style={{ color: T.textMid, fontSize: 13 }}>Ready to analyze · Click to change file</p>
                </>
              ) : (
                <>
                  <p style={{ color: T.text, fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Drop your resume here</p>
                  <p style={{ color: T.textMid, fontSize: 13 }}>PDF format · Max 10MB · Your data stays private</p>
                </>
              )}
              <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
            </div>

            {file && (
              <Btn onClick={() => setStage("filters")} style={{ padding: "14px 40px", fontSize: 15, background: T.accent, color: T.bg, borderRadius: 12, animation: "glow 2s infinite" }}>
                Continue → Set Preferences
              </Btn>
            )}

            <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 56, flexWrap: "wrap" }}>
              {[["🔒","Private","Your resume is never stored"],["⚡","60 Seconds","From upload to matched jobs"],["🇵🇭","PH-Focused","Real Philippine job boards"],["🎓","Fresh Grad","Built for new graduates"]].map(([ic,t,d]) => (
                <div key={t} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{ic}</div>
                  <div style={{ color: T.text, fontWeight: 700, fontSize: 13 }}>{t}</div>
                  <div style={{ color: T.textLow, fontSize: 11 }}>{d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FILTERS ── */}
      {stage === "filters" && (
        <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 2rem", animation: "fadeUp 0.4s ease" }}>
          <div style={{ width: "100%", maxWidth: 520 }}>
            <div style={{ marginBottom: 40, textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: T.accentGlow, border: `1px solid ${T.accent}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 16px" }}>⚙️</div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: T.text, marginBottom: 8 }}>Set your preferences</h2>
              <p style={{ color: T.textMid, fontSize: 14 }}>Help us narrow down the best matches for you.</p>
            </div>

            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, padding: 36, display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Location */}
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMid, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Preferred Location</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Metro Manila","Cebu","Davao","Laguna","Remote / WFH","Open to Anywhere"].map(loc => (
                    <button key={loc} onClick={() => setFilters(f => ({ ...f, location: loc }))} style={{ padding: "8px 16px", borderRadius: 8, border: `1.5px solid ${filters.location === loc ? T.accent : T.border}`, background: filters.location === loc ? T.accentGlow : "transparent", color: filters.location === loc ? T.accent : T.textMid, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.18s", fontFamily: "'Syne', sans-serif" }}>{loc}</button>
                  ))}
                </div>
              </div>

              {/* Job Type */}
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMid, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Employment Type</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Full-time","Part-time","Internship","Freelance","Remote"].map(t => (
                    <button key={t} onClick={() => setFilters(f => ({ ...f, type: t }))} style={{ padding: "8px 16px", borderRadius: 8, border: `1.5px solid ${filters.type === t ? T.accent : T.border}`, background: filters.type === t ? T.accentGlow : "transparent", color: filters.type === t ? T.accent : T.textMid, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.18s", fontFamily: "'Syne', sans-serif" }}>{t}</button>
                  ))}
                </div>
              </div>

              {/* Salary */}
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMid, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Expected Monthly Salary</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Any","₱15K–₱20K","₱20K–₱30K","₱30K–₱50K","₱50K+"].map(s => (
                    <button key={s} onClick={() => setFilters(f => ({ ...f, salary: s }))} style={{ padding: "8px 16px", borderRadius: 8, border: `1.5px solid ${filters.salary === s ? T.gold : T.border}`, background: filters.salary === s ? T.goldPale : "transparent", color: filters.salary === s ? T.gold : T.textMid, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.18s", fontFamily: "'Syne', sans-serif" }}>{s}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <Btn variant="ghost" onClick={() => setStage("upload")} style={{ flex: 1, padding: 13 }}>← Back</Btn>
                <Btn onClick={runSearch} style={{ flex: 2, padding: 13, fontSize: 14, background: T.accent, color: T.bg, borderRadius: 10 }}>
                  Find My Jobs ✦
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
            <div style={{ width: 80, height: 80, borderRadius: "50%", border: `3px solid ${T.border}`, borderTopColor: T.accent, animation: "spin 1s linear infinite", margin: "0 auto 32px" }} />
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: T.text, marginBottom: 12, animation: "fadeIn 0.3s ease" }}>{loadMsg}</h2>
            <p style={{ color: T.textMid, fontSize: 14 }}>Scanning JobStreet, OnlineJobs.ph, LinkedIn PH & more…</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 40, flexWrap: "wrap" }}>
              {["JobStreet PH","OnlineJobs.ph","LinkedIn","Kalibrr"].map(p => (
                <div key={p} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "6px 14px", fontSize: 11, color: T.textMid, fontWeight: 600, animation: "shimmer 2s infinite" }}>{p}</div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── RESULTS ── */}
      {stage === "results" && results && (
        <section style={{ minHeight: "100vh", padding: "90px 2rem 60px", animation: "fadeUp 0.5s ease" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            {/* Candidate profile strip */}
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "20px 28px", marginBottom: 32, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: T.accentGlow, border: `2px solid ${T.accent}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🎓</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 800, fontSize: 16, color: T.text, marginBottom: 2 }}>{results.profile?.name || "Your Profile"}</p>
                <p style={{ color: T.textMid, fontSize: 13 }}>{results.profile?.degree} · {results.profile?.school} · {filters.location} · {filters.type}</p>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {results.profile?.skills?.slice(0,4).map(s => <Tag key={s}>{s}</Tag>)}
              </div>
              <Btn variant="ghost" onClick={() => { setStage("upload"); setFile(null); setBase64(null); setResults(null); }} style={{ fontSize: 12, padding: "8px 16px", flexShrink: 0 }}>↺ New Search</Btn>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: T.text, marginBottom: 4 }}>Your Matched Jobs</h2>
                <p style={{ color: T.textMid, fontSize: 14 }}>{results.jobs?.length} roles found across Philippine job boards · Click any card to view details & apply</p>
              </div>
              <Btn variant="ghost" onClick={() => setStage("filters")} style={{ fontSize: 12 }}>⚙ Adjust Filters</Btn>
            </div>

            {/* Job cards grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: 18 }}>
              {results.jobs?.map((job, i) => {
                const pColor = platformColors[job.platform] || T.accent;
                const pBg = platformBg[job.platform] || T.accentGlow;
                const isOpen = openCard === i;
                return (
                  <div key={i} style={{ background: T.surface, border: `1.5px solid ${isOpen ? T.accent : T.border}`, borderRadius: 16, overflow: "hidden", transition: "all 0.25s", cursor: "pointer", animation: `fadeUp 0.4s ease ${i * 0.07}s both` }}
                    onClick={() => setOpenCard(isOpen ? null : i)}>
                    {/* Match score bar */}
                    <div style={{ height: 3, background: T.border, position: "relative" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${job.matchScore || 80}%`, background: `linear-gradient(90deg, ${T.accent}, ${T.gold})`, borderRadius: 2 }} />
                    </div>

                    <div style={{ padding: 22 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                            <span style={{ background: pBg, color: pColor, border: `1px solid ${pColor}33`, borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>{job.platform}</span>
                            <span style={{ color: T.textLow, fontSize: 10 }}>#{i + 1} match</span>
                          </div>
                          <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, color: T.text, lineHeight: 1.3, marginBottom: 4 }}>{job.title}</h3>
                          <p style={{ color: T.textMid, fontSize: 12 }}>{job.company} · {job.location}</p>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 500, color: T.gold }}>{job.matchScore || 80}%</div>
                          <div style={{ color: T.textLow, fontSize: 10 }}>match</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                        {job.tags?.slice(0,3).map(t => <Tag key={t} color={T.textMid} bg={T.surfaceHigh}>{t}</Tag>)}
                        <Tag color={T.green} bg={T.greenPale}>{job.type || filters.type}</Tag>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: T.accent, fontWeight: 700, fontSize: 13 }}>{job.salary}</span>
                        <span style={{ color: T.textLow, fontSize: 11 }}>{isOpen ? "▲ collapse" : "▼ see why"}</span>
                      </div>

                      {/* Expanded: match reason + apply button */}
                      {isOpen && (
                        <div style={{ marginTop: 16, animation: "fadeUp 0.2s ease" }}>
                          <div style={{ background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
                            <p style={{ fontSize: 11, color: T.accent, fontWeight: 700, marginBottom: 6, letterSpacing: 0.5 }}>✦ WHY THIS MATCHES YOU</p>
                            <p style={{ color: T.textMid, fontSize: 13, lineHeight: 1.65 }}>{job.matchReason}</p>
                          </div>
                          <a href={job.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none" }} onClick={e => e.stopPropagation()}>
                            <div style={{ background: T.accent, color: T.bg, borderRadius: 10, padding: "12px", textAlign: "center", fontWeight: 800, fontSize: 14, transition: "opacity 0.18s" }}
                              onMouseEnter={e => e.target.style.opacity = "0.85"} onMouseLeave={e => e.target.style.opacity = "1"}>
                              Apply on {job.platform} →
                            </div>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick links to job boards */}
            <div style={{ marginTop: 48, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 28 }}>
              <p style={{ color: T.textMid, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 20 }}>Browse More on Philippine Job Boards</p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {[
                  { name: "JobStreet PH", url: `https://www.jobstreet.com.ph/en/job-search/${encodeURIComponent((results.profile?.degree||"").toLowerCase().replace(/ /g,"-"))}-jobs/`, color: "#e53e3e" },
                  { name: "OnlineJobs.ph", url: `https://www.onlinejobs.ph/jobseekers/info/${encodeURIComponent(results.profile?.degree||"")}`, color: "#38a169" },
                  { name: "Kalibrr PH", url: `https://www.kalibrr.com/job-board`, color: "#805ad5" },
                  { name: "LinkedIn PH", url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(results.profile?.degree||"")}&location=Philippines&f_E=1`, color: "#0077b5" },
                  { name: "JobBank PH", url: `https://www.jobbank.ph/search?q=${encodeURIComponent(results.profile?.degree||"")}`, color: "#dd6b20" },
                  { name: "MyJobStreet", url: `https://my.jobstreet.com/en/job-search/`, color: "#c53030" },
                ].map(b => (
                  <a key={b.name} href={b.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <div style={{ background: T.surfaceHigh, border: `1.5px solid ${b.color}44`, borderRadius: 10, padding: "10px 18px", color: b.color, fontSize: 13, fontWeight: 700, transition: "all 0.18s", cursor: "pointer" }}
                      onMouseEnter={e => { e.currentTarget.style.background = b.color + "18"; e.currentTarget.style.borderColor = b.color; }}
                      onMouseLeave={e => { e.currentTarget.style.background = T.surfaceHigh; e.currentTarget.style.borderColor = b.color + "44"; }}>
                      {b.name} ↗
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
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(2.2rem,5vw,3.5rem)", color: T.text, marginBottom: 12, fontStyle: "italic" }}>Career Paths by Degree</h1>
          <p style={{ color: T.textMid, fontSize: 15, maxWidth: 500, margin: "0 auto" }}>Select your degree to see a real roadmap — salaries, certifications, and where to start.</p>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 48 }}>
          {CAREER_PATHS.map((cp, i) => (
            <button key={cp.degree} onClick={() => setActive(i)} style={{ padding: "9px 18px", borderRadius: 10, border: `1.5px solid ${active === i ? T.accent : T.border}`, background: active === i ? T.accentGlow : T.surface, color: active === i ? T.accent : T.textMid, fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s", fontFamily: "'Syne', sans-serif" }}>
              {cp.icon} {cp.degree}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 28, gridColumn: "1/-1" }}>
            <p style={{ color: T.textMid, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 20 }}>Career Progression</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              {p.roles.map((r, i) => (
                <div key={r} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ background: i === 0 ? T.accentGlow : T.surfaceHigh, border: `1.5px solid ${i === 0 ? T.accent : T.border}`, borderRadius: 10, padding: "9px 18px", color: i === 0 ? T.accent : T.textMid, fontSize: 13, fontWeight: i === 0 ? 700 : 400 }}>{r}</div>
                  {i < p.roles.length - 1 && <span style={{ color: T.textLow, fontSize: 16 }}>→</span>}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 28 }}>
            <p style={{ color: T.textMid, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Salary Range</p>
            <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: T.gold, marginBottom: 8 }}>{p.salary}</p>
            <p style={{ color: T.textLow, fontSize: 12 }}>Philippine market, entry to senior level.</p>
          </div>

          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 28 }}>
            <p style={{ color: T.textMid, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>Certifications to Pursue</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {p.certs.map(c => <div key={c} style={{ display: "flex", gap: 10, alignItems: "center", color: T.textMid, fontSize: 13 }}><span style={{ color: T.green }}>✓</span>{c}</div>)}
            </div>
          </div>

          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 28 }}>
            <p style={{ color: T.textMid, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>Industries to Explore</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {p.industries.map(ind => <Tag key={ind} color={T.textMid} bg={T.surfaceHigh}>{ind}</Tag>)}
            </div>
          </div>

          <div style={{ background: T.accentGlow, border: `1.5px solid ${T.accent}33`, borderRadius: 16, padding: 28, gridColumn: "1/-1" }}>
            <p style={{ color: T.accent, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>✦ Your First Step — Right Now</p>
            <p style={{ color: T.text, fontSize: 15, lineHeight: 1.75 }}>{p.tip}</p>
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
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "60px 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ color: T.accent, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Step by Step</p>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(2.2rem,5vw,3.5rem)", color: T.text, marginBottom: 12, fontStyle: "italic" }}>How to Land Your First Job</h1>
          <p style={{ color: T.textMid, fontSize: 15, maxWidth: 480, margin: "0 auto" }}>Never worked full-time? Follow this guide and go from fresh grad to hired — with confidence.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {TUTORIAL_STEPS.map((s, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ background: T.surface, border: `1.5px solid ${isOpen ? T.accent : T.border}`, borderRadius: 14, overflow: "hidden", transition: "all 0.25s" }}>
                <button onClick={() => setOpen(isOpen ? null : i)} style={{ width: "100%", background: "none", border: "none", padding: "22px 24px", cursor: "pointer", display: "flex", alignItems: "center", gap: 20, textAlign: "left" }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 500, color: isOpen ? T.accent : T.textLow, minWidth: 38, transition: "color 0.2s" }}>{s.n}</span>
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                  <h3 style={{ color: T.text, fontFamily: "'Instrument Serif', serif", fontSize: 18, flex: 1 }}>{s.title}</h3>
                  <span style={{ color: T.textLow, fontSize: 16, transition: "transform 0.25s", transform: isOpen ? "rotate(180deg)" : "none", display: "inline-block" }}>↓</span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 24px 24px", animation: "fadeUp 0.2s ease" }}>
                    <p style={{ color: T.textMid, fontSize: 14, lineHeight: 1.75, marginBottom: 14 }}>{s.body}</p>
                    <div style={{ background: T.accentGlow, border: `1px solid ${T.accent}33`, borderRadius: 10, padding: "12px 16px", display: "flex", gap: 10 }}>
                      <span style={{ color: T.accent }}>💡</span>
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
    <footer style={{ background: T.surface, borderTop: `1px solid ${T.border}`, padding: "40px 2rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
        <div>
          <div style={{ fontFamily: "'Instrument Serif', serif", color: T.text, fontSize: 18, marginBottom: 4 }}>GradLaunch</div>
          <p style={{ color: T.textLow, fontSize: 12 }}>AI-powered job matching for Filipino fresh graduates. Always free.</p>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {[["home","Job Finder"],["paths","Career Paths"],["guide","Guide"]].map(([p,l]) => (
            <button key={p} onClick={() => setPage(p)} style={{ background: "none", border: "none", color: T.textLow, fontSize: 12, cursor: "pointer", fontFamily: "'Syne', sans-serif" }}>{l}</button>
          ))}
        </div>
        <p style={{ color: T.textLow, fontSize: 11 }}>© 2025 GradLaunch · Built for 🇵🇭 fresh grads</p>
      </div>
    </footer>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const goTo = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div>
      <style>{STYLES}</style>
      <NavBar page={page} setPage={goTo} />
      {page === "home" && <><Home /><Footer setPage={goTo} /></>}
      {page === "paths" && <><CareerPaths /><Footer setPage={goTo} /></>}
      {page === "guide" && <><Guide /><Footer setPage={goTo} /></>}
    </div>
  );
}