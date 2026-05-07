import { useState, useRef } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Fraunces:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #f4f1eb; font-family: 'DM Sans', sans-serif; color: #1a1614; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #f4f1eb; }
  ::-webkit-scrollbar-thumb { background: #c8b99a; border-radius: 2px; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0}to{opacity:1} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
  @keyframes scanline { 0%{transform:translateY(-100%)}100%{transform:translateY(600%)} }
  @keyframes shimmer { 0%,100%{opacity:0.5}50%{opacity:1} }
  @keyframes float { 0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)} }
`;

/* ── Palette ── */
const C = {
  bg:       "#f4f1eb",
  surface:  "#ffffff",
  surfaceAlt:"#f9f7f3",
  border:   "#e2d9cc",
  borderDark:"#c8b99a",
  ink:      "#1a1614",
  inkMid:   "#5a4f44",
  inkLow:   "#9a8e82",
  forest:   "#1b3a2d",
  forestMid:"#2d5c45",
  sage:     "#4e8b6a",
  sagePale: "#d6ead e",
  sagePale2:"#eef6f1",
  amber:    "#c97c2e",
  amberPale:"#fdf0e0",
  sky:      "#2563a8",
  skyPale:  "#e8f0fb",
  rose:     "#c0392b",
  rosePale: "#fdecea",
  gold:     "#b8860b",
  goldPale: "#fdf6e3",
};

/* ── Data ── */
const JOB_BOARDS = [
  { name:"JobStreet PH",   logo:"JS", color:"#e53e3e", bg:"#fff5f5", desc:"#1 job board in PH",         url:"https://www.jobstreet.com.ph" },
  { name:"LinkedIn Jobs",  logo:"in", color:"#0077b5", bg:"#e8f4fd", desc:"Professional network",       url:"https://www.linkedin.com/jobs/search/?location=Philippines&f_E=1" },
  { name:"Kalibrr",        logo:"Ka", color:"#7c3aed", bg:"#f5f0ff", desc:"Fresh grad specialists",     url:"https://www.kalibrr.com/job-board" },
  { name:"OnlineJobs.ph",  logo:"OJ", color:"#059669", bg:"#ecfdf5", desc:"Local & remote roles",       url:"https://www.onlinejobs.ph" },
  { name:"Indeed PH",      logo:"In", color:"#2164f3", bg:"#eff4ff", desc:"Millions of listings",       url:"https://ph.indeed.com" },
  { name:"Glassdoor PH",   logo:"Gd", color:"#0caa41", bg:"#f0fdf4", desc:"Jobs + company reviews",     url:"https://www.glassdoor.com/Job/philippines-jobs-SRCH_IL.0,11_IN204.htm" },
];

const CAREER_PATHS = [
  { degree:"Computer Science",       icon:"💻", roles:["Junior Developer","Mid Developer","Senior Developer","Tech Lead","CTO"],               salary:"₱25K–₱250K+",         certs:["AWS Certified","Google Cloud","Meta Front-End"],  industries:["FinTech","E-Commerce","Startups","BPO"],              tip:"Build a GitHub portfolio with 3 real projects. AWS certification is highly valued even at entry level in PH." },
  { degree:"Business Administration",icon:"📊", roles:["Marketing Assoc.","Brand Manager","Marketing Director","VP Marketing","CMO"],         salary:"₱18K–₱180K+",         certs:["Google Ads","HubSpot","PMP"],                     industries:["FMCG","Banking","Retail","Consulting"],               tip:"Get Google Analytics certified for free. Build Excel and data skills early. LinkedIn is your most important tool." },
  { degree:"Nursing",                icon:"🏥", roles:["Staff Nurse","Head Nurse","Nurse Supervisor","Director of Nursing","CNO"],             salary:"₱22K–₱200K+ (abroad)",certs:["PRC License","BLS/ACLS","NCLEX (USA)"],           industries:["Hospitals","Clinics","OFW Nursing","Telehealth"],     tip:"Pass PRC board first. Get 1–2 years local experience. Then pursue NCLEX to unlock US opportunities worth ₱200K+/month." },
  { degree:"Accountancy",            icon:"🧾", roles:["Junior Accountant","Senior Accountant","Finance Manager","Controller","CFO"],         salary:"₱20K–₱200K+",         certs:["CPA License","CMA","ACCA"],                       industries:["Big 4 Audit","Banking","Manufacturing","Government"],  tip:"The CPA board exam is everything — it opens every major door in Philippine and international finance." },
  { degree:"Education",              icon:"📚", roles:["Teacher","Department Head","Principal","School Director","DepEd Official"],           salary:"₱18K–₱80K+",          certs:["LET License","TESOL","Special Ed Cert"],          industries:["Public Schools","Private Schools","Online Tutoring","EdTech"], tip:"Pass LET first. Consider ESL online teaching (₱500–₱1,200/hr) on the side for extra income." },
  { degree:"Psychology",             icon:"🧠", roles:["HR Assistant","HR Generalist","HR Manager","HR Director","CHRO"],                   salary:"₱17K–₱160K+",         certs:["RPm License","SHRM","Counseling License"],        industries:["Corporate HR","NGOs","Mental Health","Research"],      tip:"RPm license is your key credential. Build skills in BambooHR and Workday. Network at PMAP events." },
  { degree:"Engineering",            icon:"⚙️", roles:["Junior Engineer","Project Engineer","Senior Engineer","Engineering Manager","VP Eng"],salary:"₱22K–₱220K+",         certs:["PRC License","PMP","Six Sigma"],                  industries:["Construction","Manufacturing","Energy","Telco"],       tip:"Pass your PRC board. BIM and AutoCAD skills are in high demand — learn them early." },
  { degree:"Architecture",           icon:"🏛️", roles:["Junior Architect","Architect","Senior Architect","Principal Architect","Partner"],   salary:"₱20K–₱180K+",         certs:["PRC License","LEED","Revit/BIM"],                 industries:["Real Estate","Construction","Interior Design","Urban Planning"], tip:"Pass the Architecture board. Master Revit and BIM — firms pay a premium for these skills in PH." },
];

const GUIDE_STEPS = [
  { n:"01", icon:"🔍", title:"Know Yourself First",    body:"Before applying anywhere, identify your strengths, interests, and values. Use the Holland Code (RIASEC) test. Write down what energized you most in college — that's your compass.",                                    tip:"Try typefind.com or 16personalities.com for a free career personality test." },
  { n:"02", icon:"📄", title:"Polish Your Resume",     body:"Keep it to 1 page. Lead with a 2-sentence summary. Use numbers: 'increased club membership by 40%' beats 'helped grow the club'. List thesis, org experience, internships, and skills.",                            tip:"Use Canva's free resume templates. Always export as PDF — ATS systems can't read fancy graphic formats." },
  { n:"03", icon:"🌐", title:"Build Your LinkedIn",    body:"Recruiters find YOU on LinkedIn. Use a professional photo, write a headline beyond 'Fresh Graduate', connect with classmates and professors, and set yourself to Open to Work.",                                    tip:"A complete LinkedIn profile gets 40× more recruiter messages than an incomplete one." },
  { n:"04", icon:"🎯", title:"Apply Strategically",    body:"Don't spray 100 applications. Target 10–15 companies that genuinely excite you. Tailor your resume keywords to match each job description. Quality always beats quantity.",                                        tip:"Use GradLaunch's AI matcher to instantly find your best-fit roles across PH job boards." },
  { n:"05", icon:"🤝", title:"Nail the Interview",     body:"Research the company thoroughly. Use STAR method (Situation, Task, Action, Result) for your answers. Arrive 10 minutes early. Bring extra resume copies and a notebook.",                                          tip:"Practice your 90-second 'Tell me about yourself' answer until it flows naturally." },
  { n:"06", icon:"🚀", title:"Start Strong Day One",   body:"Treat your first 90 days as a second interview. Be curious, be early, deliver on every promise. Build relationships across the team, not just with your direct manager.",                                          tip:"Ask on Day 1: 'What does success look like in this role after 90 days?' — makes you instantly stand out." },
];

const TESTIMONIALS = [
  { name:"Rina Mallari",    degree:"BS Computer Science, DLSU '24",   text:"I uploaded my resume and within 30 seconds I had 6 targeted links. I found my first dev job through the JobStreet link in under 2 weeks!", avatar:"RM", color:C.sky },
  { name:"Carlo Aquino",    degree:"BS Nursing, UST '24",             text:"As a fresh board passer I had no idea where to start. GradLaunch pointed me directly to nursing roles in Makati. Got hired at Healthbridge in 3 weeks.", avatar:"CA", color:C.sage },
  { name:"Jasmine Reyes",   degree:"BSBA Marketing, Ateneo '23",      text:"The career path section helped me understand where I could go beyond just 'marketing'. Now I'm a Brand Associate at Unilever PH!", avatar:"JR", color:C.amber },
  { name:"Mark Domingo",    degree:"BS Accountancy, UP Diliman '24",  text:"The AI actually read my resume correctly and matched me to audit associate roles at a Big 4. The match explanation made total sense.", avatar:"MD", color:C.forest },
];

const PLATFORMS = {
  "JobStreet":    { color:"#e53e3e", bg:"#fff5f5", icon:"🔴" },
  "OnlineJobs.ph":{ color:"#059669", bg:"#ecfdf5", icon:"🟢" },
  "LinkedIn":     { color:"#0077b5", bg:"#e8f4fd", icon:"🔵" },
  "Kalibrr":      { color:"#7c3aed", bg:"#f5f0ff", icon:"🟣" },
  "Indeed PH":    { color:"#2164f3", bg:"#eff4ff", icon:"🔷" },
};

/* ── Build job search URLs (30-day filter) ── */
function buildJobLinks(profile, filters) {
  const role = encodeURIComponent(profile.topRole || profile.degree || "fresh graduate");
  const deg  = encodeURIComponent(profile.degree  || "fresh graduate");
  const loc  = encodeURIComponent(filters.location === "Open to Anywhere" ? "Philippines" : filters.location);
  const salMap = { "Any":"","₱15K–₱20K":"15000","₱20K–₱30K":"20000","₱30K–₱50K":"30000","₱50K+":"50000" };
  const sal  = salMap[filters.salary] || "";
  const jtype = filters.type === "Full-time" ? "F" : "P";

  return [
    {
      platform:"JobStreet", title:`${profile.topRole || profile.degree} — Fresh Graduate`,
      url:`https://www.jobstreet.com.ph/en/job-search/${role.toLowerCase().replace(/%20/g,"-")}-jobs/?createdAt=30${sal?`&salary=${sal}`:""}`,
      reason:`JobStreet PH is the #1 job board in the Philippines. Pre-filtered to your role and showing listings posted in the last 30 days — the freshest opportunities with the highest response rates.`,
      matchScore:95, tags:["#1 PH Job Board","30-day Fresh","Fresh Grad OK"],
    },
    {
      platform:"LinkedIn", title:`${profile.topRole || profile.degree} — Philippines`,
      url:`https://www.linkedin.com/jobs/search/?keywords=${role}&location=Philippines&f_E=1&f_JT=${jtype}&f_TPR=r2592000`,
      reason:`LinkedIn's Entry Level filter (f_E=1) combined with a 30-day date filter shows only recent roles open to fresh graduates in the Philippines. Your skills (${profile.skills?.slice(0,3).join(", ")}) align well here.`,
      matchScore:91, tags:["Entry Level Filter","30-Day Fresh","Direct Recruiter Access"],
    },
    {
      platform:"Kalibrr", title:`Entry-Level ${profile.topRole || profile.degree}`,
      url:`https://www.kalibrr.com/job-board/te/${encodeURIComponent((profile.topRole||profile.degree).toLowerCase())}?employment_type=${filters.type==="Full-time"?"full_time":"part_time"}&published_after=30d`,
      reason:`Kalibrr specializes in fresh graduate hiring. Their structured onboarding programs and mentorship offerings make this ideal for someone just starting out with a ${profile.degree} background.`,
      matchScore:88, tags:["Fresh Grad Specialist","Structured Training","Mentorship"],
    },
    {
      platform:"Indeed PH", title:`Junior ${profile.topRole || profile.degree} — ${filters.location}`,
      url:`https://ph.indeed.com/jobs?q=${role}&l=${loc}&fromage=30&explvl=entry_level`,
      reason:`Indeed PH aggregates listings from company websites, recruiters, and other boards into one place. The 30-day and entry-level filters surface roles that explicitly welcome zero-experience applicants.`,
      matchScore:85, tags:["Multi-Source","Entry Level","30-Day Fresh"],
    },
    {
      platform:"JobStreet", title:`${profile.degree} Graduate — ${filters.location}`,
      url:`https://www.jobstreet.com.ph/en/job-search/${deg.toLowerCase().replace(/%20/g,"-")}-graduate-jobs/?where=${loc}&createdAt=30`,
      reason:`A location-specific JobStreet search for ${profile.degree} graduates in ${filters.location}. Reduces commute time and surfaces the most relevant local companies actively hiring fresh grads.`,
      matchScore:82, tags:[`📍 ${filters.location}`,"Degree-Matched","Local Companies"],
    },
    {
      platform:"OnlineJobs.ph", title:`Remote ${profile.topRole || profile.degree} Role`,
      url:`https://www.onlinejobs.ph/jobseekers/info/${deg}`,
      reason:`OnlineJobs.ph connects Filipino fresh grads with local and international remote employers. Great if you prefer WFH — many roles here offer flexible arrangements with above-average pay.`,
      matchScore:78, tags:["Remote Friendly","WFH Possible","Int'l Employers"],
    },
  ];
}

/* ── PDF Text Extractor ── */
async function extractTextFromPDF(file) {
  return new Promise((resolve, reject) => {
    const run = async () => {
      try {
        const pdfjsLib = window["pdfjs-dist/build/pdf"];
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        const buf = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(it => it.str).join(" ") + "\n";
        }
        if (text.trim().length < 50) reject(new Error("PDF has no selectable text. Please use a text-based PDF, not a scanned image."));
        else resolve(text.trim());
      } catch(e) { reject(new Error("Failed to read PDF: " + e.message)); }
    };
    if (window["pdfjs-dist/build/pdf"]) { run(); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload = run;
    s.onerror = () => reject(new Error("Failed to load PDF reader."));
    document.head.appendChild(s);
  });
}

/* ── Shared UI ── */
const Tag = ({ children, color="#2563a8", bg="#e8f0fb" }) => (
  <span style={{ background:bg, color, border:`1px solid ${color}22`, borderRadius:20, padding:"3px 11px", fontSize:11, fontWeight:600, letterSpacing:0.3, whiteSpace:"nowrap" }}>{children}</span>
);

const Btn = ({ children, onClick, variant="primary", style={}, disabled }) => {
  const v = {
    primary:  { background:C.forest,  color:"#fff" },
    outline:  { background:"transparent", color:C.forest, border:`2px solid ${C.forest}` },
    ghost:    { background:"transparent", color:C.inkMid, border:`1.5px solid ${C.border}` },
    amber:    { background:C.amber,   color:"#fff" },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:14, cursor:disabled?"not-allowed":"pointer", border:"none", borderRadius:10, padding:"11px 24px", transition:"all 0.2s", opacity:disabled?0.45:1, ...v[variant], ...style }}>
      {children}
    </button>
  );
};

/* ── NavBar ── */
function NavBar({ page, setPage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pages = [["home","Job Finder"],["paths","Career Paths"],["guide","Job Hunt Guide"],["about","About"],["contact","Contact"]];
  return (
    <>
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:200, background:"rgba(244,241,235,0.96)", backdropFilter:"blur(12px)", borderBottom:`1px solid ${C.border}`, padding:"0 1.5rem" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", height:60, gap:16 }}>
          {/* Logo — left */}
          <button onClick={() => setPage("home")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            <div style={{ width:32, height:32, background:C.forest, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Fraunces',serif", fontSize:16, color:"#fff", fontStyle:"italic", fontWeight:700 }}>G</div>
            <span style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:700, color:C.ink, letterSpacing:"-0.3px" }}>GradLaunch</span>
          </button>

          {/* Nav — centered */}
          <div style={{ flex:1, display:"flex", justifyContent:"center" }}>
            <div style={{ display:"flex", gap:2, background:C.surfaceAlt, borderRadius:12, padding:"3px", border:`1px solid ${C.border}` }} className="desktop-nav">
              {pages.map(([p,l]) => (
                <button key={p} onClick={() => setPage(p)}
                  style={{ background:page===p?C.forest:"transparent", color:page===p?"#fff":C.inkMid, border:"none", borderRadius:9, padding:"7px 16px", cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"'DM Sans',sans-serif", transition:"all 0.18s", whiteSpace:"nowrap" }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Btn onClick={() => setPage("home")} style={{ padding:"8px 18px", fontSize:13, flexShrink:0, display:"flex" }}>Try Free →</Btn>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background:"none", border:`1.5px solid ${C.border}`, borderRadius:8, padding:"6px 10px", cursor:"pointer", display:"none", flexDirection:"column", gap:4 }} className="hamburger">
            {[0,1,2].map(i => <div key={i} style={{ width:18, height:2, background:C.ink, borderRadius:2 }} />)}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position:"fixed", top:60, left:0, right:0, zIndex:199, background:C.bg, borderBottom:`1px solid ${C.border}`, padding:"12px 1.5rem 20px" }}>
          {pages.map(([p,l]) => (
            <button key={p} onClick={() => { setPage(p); setMenuOpen(false); }}
              style={{ display:"block", width:"100%", textAlign:"left", background:page===p?C.sagePale2:"transparent", color:page===p?C.forest:C.inkMid, border:"none", borderRadius:8, padding:"12px 16px", cursor:"pointer", fontSize:15, fontWeight:600, fontFamily:"'DM Sans',sans-serif", marginBottom:4 }}>
              {l}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media(max-width:768px){
          .desktop-nav{display:none!important}
          .hamburger{display:flex!important}
        }
        @media(max-width:480px){
          .hide-mobile{display:none!important}
        }
      `}</style>
    </>
  );
}

/* ── Bottom Nav (mobile) ── */
function BottomNav({ page, setPage }) {
  const items = [
    { p:"home",    icon:"🔍", label:"Job Finder" },
    { p:"paths",   icon:"🗺️", label:"Career Paths" },
    { p:"guide",   icon:"📖", label:"Guide" },
    { p:"about",   icon:"ℹ️", label:"About" },
    { p:"contact", icon:"✉️", label:"Contact" },
  ];
  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:200, background:C.surface, borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"space-around", alignItems:"center", padding:"8px 0 max(8px,env(safe-area-inset-bottom))", boxShadow:"0 -4px 20px rgba(0,0,0,0.08)" }} className="bottom-nav">
      {items.map(({ p, icon, label }) => (
        <button key={p} onClick={() => setPage(p)}
          style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"4px 8px", flex:1 }}>
          <span style={{ fontSize:20, filter:page===p?"none":"grayscale(1)", transition:"filter 0.2s" }}>{icon}</span>
          <span style={{ fontSize:10, fontWeight:700, color:page===p?C.forest:C.inkLow, fontFamily:"'DM Sans',sans-serif", letterSpacing:0.3 }}>{label}</span>
          {page===p && <div style={{ width:20, height:2, background:C.forest, borderRadius:2 }} />}
        </button>
      ))}
    </div>
  );
}

/* ── Landing Page ── */
function Home() {
  const [stage, setStage]     = useState("upload");
  const [file, setFile]       = useState(null);
  const [filters, setFilters] = useState({ location:"Metro Manila", type:"Full-time", salary:"Any" });
  const [results, setResults] = useState(null);
  const [loadMsg, setLoadMsg] = useState("Reading your resume…");
  const [dragOver, setDragOver] = useState(false);
  const [openCard, setOpenCard] = useState(null);
  const [error, setError]     = useState("");
  const fileRef = useRef();

  const LOAD_MSGS = ["Reading your resume…","Extracting your degree and skills…","Building your candidate profile…","Identifying your top roles…","Generating personalized job searches…","Matching to Philippine job boards…","Almost ready…"];

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== "application/pdf") { setError("Please upload a PDF file."); return; }
    if (f.size > 10*1024*1024) { setError("File too large. Max 10MB."); return; }
    setError(""); setFile(f);
  };

  const runSearch = async () => {
    if (!file) return;
    setStage("loading"); setError("");
    let mi = 0;
    const mt = setInterval(() => { mi = Math.min(mi+1, LOAD_MSGS.length-1); setLoadMsg(LOAD_MSGS[mi]); }, 2000);
    try {
      const resumeText = await extractTextFromPDF(file);
      const res = await fetch("/api/analyze", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ resumeText, filters }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error. Please try again.");
      clearInterval(mt);
      setResults({ profile: data.profile, jobs: buildJobLinks(data.profile, filters) });
      setStage("results");
    } catch(e) {
      clearInterval(mt);
      setError(e.message || "Something went wrong. Please try again.");
      setStage("upload");
    }
  };

  const reset = () => { setStage("upload"); setFile(null); setResults(null); setOpenCard(null); setError(""); };

  return (
    <div style={{ background:C.bg, paddingTop:60, paddingBottom:72 }}>

      {/* ── HERO ── */}
      {stage === "upload" && (
        <>
          <section style={{ minHeight:"92vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 1.5rem 40px", position:"relative", overflow:"hidden" }}>
            {/* Decorative bg */}
            <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(${C.borderDark}55 1px,transparent 1px)`, backgroundSize:"28px 28px", pointerEvents:"none", opacity:0.5 }} />
            <div style={{ position:"absolute", top:-100, right:-100, width:400, height:400, borderRadius:"50%", background:`radial-gradient(ellipse,#d6ead e80 0%,transparent 70%)`, pointerEvents:"none" }} />

            <div style={{ position:"relative", maxWidth:680, textAlign:"center", animation:"fadeUp 0.7s ease" }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:C.sagePale2, border:`1px solid ${C.sage}44`, borderRadius:40, padding:"6px 18px", marginBottom:28 }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:C.sage, display:"inline-block", animation:"pulse 2s infinite" }} />
                <span style={{ color:C.forestMid, fontSize:11, fontWeight:700, letterSpacing:1.5 }}>FREE · AI-POWERED · NO SIGN-UP NEEDED</span>
              </div>

              <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(2.6rem,6.5vw,4.8rem)", color:C.ink, lineHeight:1.05, marginBottom:20, letterSpacing:"-2px", fontWeight:900 }}>
                Upload your resume.<br />
                <em style={{ color:C.forestMid, fontStyle:"italic" }}>We find your job.</em>
              </h1>

              <p style={{ color:C.inkMid, fontSize:"clamp(1rem,2.2vw,1.15rem)", lineHeight:1.8, maxWidth:500, margin:"0 auto 44px" }}>
                Our AI reads your resume, understands your degree and skills, then generates personalized job search links across JobStreet PH, LinkedIn, Kalibrr, Indeed PH, and more — with a match explanation for each.
              </p>

              {/* Upload zone */}
              <div
                onClick={() => fileRef.current.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                style={{ border:`2px dashed ${dragOver?C.forest:file?C.sage:C.borderDark}`, borderRadius:20, padding:"44px 24px", cursor:"pointer", background:dragOver?"#eef6f1":file?"#f0fdf4":C.surface, transition:"all 0.25s", marginBottom:14, position:"relative", overflow:"hidden" }}
              >
                {!file && <div style={{ position:"absolute", inset:0, background:`linear-gradient(transparent,${C.sage}08 50%,transparent)`, height:"40%", animation:"scanline 4s ease-in-out infinite", pointerEvents:"none" }} />}
                <div style={{ fontSize:48, marginBottom:12 }}>{file?"📄":"⬆️"}</div>
                {file ? (
                  <>
                    <p style={{ color:C.sage, fontWeight:700, fontSize:16, marginBottom:4 }}>✓ {file.name}</p>
                    <p style={{ color:C.inkLow, fontSize:13 }}>Resume loaded · Tap to change file</p>
                  </>
                ) : (
                  <>
                    <p style={{ color:C.ink, fontWeight:700, fontSize:16, marginBottom:4 }}>Drag & drop your resume here</p>
                    <p style={{ color:C.inkLow, fontSize:13 }}>PDF only · Max 10MB · Never stored on any server</p>
                  </>
                )}
                <input ref={fileRef} type="file" accept=".pdf" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])} />
              </div>

              {error && <div style={{ background:C.rosePale, border:`1px solid ${C.rose}33`, borderRadius:10, padding:"12px 16px", marginBottom:14, color:C.rose, fontSize:13, textAlign:"left" }}>⚠ {error}</div>}

              {file && <Btn onClick={() => setStage("filters")} style={{ padding:"14px 44px", fontSize:15, borderRadius:12, width:"100%", maxWidth:360 }}>Continue → Set Preferences</Btn>}

              {/* Stats */}
              <div style={{ display:"flex", gap:24, justifyContent:"center", marginTop:48, flexWrap:"wrap" }}>
                {[["🔒","Private","Resume never stored"],["⚡","~20 sec","Upload to results"],["🇵🇭","PH-Focused","Real local job boards"],["🆓","100% Free","No sign-up needed"]].map(([ic,t,d]) => (
                  <div key={t} style={{ textAlign:"center", minWidth:80 }}>
                    <div style={{ fontSize:22, marginBottom:4 }}>{ic}</div>
                    <div style={{ color:C.ink, fontWeight:700, fontSize:13 }}>{t}</div>
                    <div style={{ color:C.inkLow, fontSize:11 }}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Job Boards Showcase ── */}
          <section style={{ padding:"64px 1.5rem", background:C.surface, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
            <div style={{ maxWidth:1100, margin:"0 auto" }}>
              <div style={{ textAlign:"center", marginBottom:40 }}>
                <p style={{ color:C.inkLow, fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>We search across</p>
                <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(1.8rem,3.5vw,2.6rem)", color:C.ink, marginBottom:10, fontWeight:700 }}>Trusted Philippine Job Boards</h2>
                <p style={{ color:C.inkMid, fontSize:15, maxWidth:480, margin:"0 auto" }}>We generate personalized search links across platforms you already know and trust.</p>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:16 }}>
                {JOB_BOARDS.map(b => (
                  <a key={b.name} href={b.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
                    <div style={{ background:b.bg, border:`1.5px solid ${b.color}22`, borderRadius:16, padding:"20px 16px", textAlign:"center", transition:"all 0.2s", cursor:"pointer" }}
                      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.1)"; e.currentTarget.style.borderColor=b.color+"66"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor=b.color+"22"; }}>
                      <div style={{ width:44, height:44, borderRadius:12, background:b.color, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px", fontWeight:800, fontSize:15, color:"#fff", fontFamily:"'DM Mono',monospace" }}>{b.logo}</div>
                      <p style={{ fontWeight:700, fontSize:14, color:C.ink, marginBottom:3 }}>{b.name}</p>
                      <p style={{ fontSize:11, color:C.inkLow }}>{b.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* ── How it works ── */}
          <section style={{ padding:"64px 1.5rem", background:C.bg }}>
            <div style={{ maxWidth:900, margin:"0 auto" }}>
              <div style={{ textAlign:"center", marginBottom:48 }}>
                <p style={{ color:C.inkLow, fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>How it works</p>
                <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(1.8rem,3.5vw,2.6rem)", color:C.ink, fontWeight:700 }}>Three steps to your first job</h2>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:24 }}>
                {[
                  { n:"01", icon:"📄", title:"Upload Your Resume", desc:"Drag and drop your PDF resume. Our AI reads it instantly — your file is never stored anywhere." },
                  { n:"02", icon:"⚙️", title:"Set Your Preferences", desc:"Tell us your preferred location, job type, and salary. We use this to sharpen the search for you." },
                  { n:"03", icon:"🎯", title:"Get Matched Jobs", desc:"We generate personalized search links across 5+ Philippine job boards, each with a match explanation." },
                ].map(s => (
                  <div key={s.n} style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:18, padding:28 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:13, fontWeight:500, color:C.inkLow }}>{s.n}</span>
                      <span style={{ fontSize:28 }}>{s.icon}</span>
                    </div>
                    <h3 style={{ fontFamily:"'Fraunces',serif", fontSize:18, color:C.ink, marginBottom:8, fontWeight:700 }}>{s.title}</h3>
                    <p style={{ color:C.inkMid, fontSize:14, lineHeight:1.7 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Testimonials ── */}
          <section style={{ padding:"64px 1.5rem", background:C.forest }}>
            <div style={{ maxWidth:1100, margin:"0 auto" }}>
              <div style={{ textAlign:"center", marginBottom:48 }}>
                <p style={{ color:`${C.sage}`, fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>Success Stories</p>
                <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(1.8rem,3.5vw,2.6rem)", color:"#fff", fontWeight:700 }}>Fresh grads who found their jobs</h2>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:20 }}>
                {TESTIMONIALS.map((t,i) => (
                  <div key={i} style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:16, padding:24, animation:`fadeUp 0.5s ease ${i*0.1}s both` }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                      <div style={{ width:42, height:42, borderRadius:"50%", background:t.color+"33", border:`2px solid ${t.color}66`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:13, color:t.color, flexShrink:0 }}>{t.avatar}</div>
                      <div>
                        <p style={{ fontWeight:700, color:"#fff", fontSize:14 }}>{t.name}</p>
                        <p style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>{t.degree}</p>
                      </div>
                    </div>
                    <p style={{ color:"rgba(255,255,255,0.75)", fontSize:13, lineHeight:1.7 }}>"{t.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── FILTERS ── */}
      {stage === "filters" && (
        <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"100px 1.5rem 80px", animation:"fadeUp 0.4s ease" }}>
          <div style={{ width:"100%", maxWidth:520 }}>
            <div style={{ textAlign:"center", marginBottom:32 }}>
              <div style={{ fontSize:40, marginBottom:12 }}>⚙️</div>
              <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:28, color:C.ink, marginBottom:8, fontWeight:700 }}>Set your preferences</h2>
              <p style={{ color:C.inkMid, fontSize:14 }}>This helps us generate more targeted job search links for you.</p>
            </div>
            <div style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:20, padding:"32px 28px", display:"flex", flexDirection:"column", gap:24 }}>
              {[
                { label:"📍 Preferred Location", key:"location", opts:["Metro Manila","Cebu","Davao","Laguna / Cavite","Remote / WFH","Open to Anywhere"], ac:C.forest },
                { label:"💼 Employment Type",    key:"type",     opts:["Full-time","Part-time","Internship","Freelance","Remote"],                          ac:C.forest },
                { label:"💰 Expected Salary",    key:"salary",   opts:["Any","₱15K–₱20K","₱20K–₱30K","₱30K–₱50K","₱50K+"],                              ac:C.amber  },
              ].map(({ label, key, opts, ac }) => (
                <div key={key}>
                  <label style={{ display:"block", fontSize:11, fontWeight:700, color:C.inkLow, letterSpacing:1.5, textTransform:"uppercase", marginBottom:10 }}>{label}</label>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {opts.map(o => (
                      <button key={o} onClick={() => setFilters(f => ({ ...f, [key]:o }))}
                        style={{ padding:"8px 16px", borderRadius:8, border:`1.5px solid ${filters[key]===o?ac:C.border}`, background:filters[key]===o?ac+"12":"transparent", color:filters[key]===o?ac:C.inkMid, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.18s", fontFamily:"'DM Sans',sans-serif" }}>
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ display:"flex", gap:12, marginTop:8 }}>
                <Btn variant="ghost" onClick={() => setStage("upload")} style={{ flex:1, padding:13 }}>← Back</Btn>
                <Btn onClick={runSearch} style={{ flex:2, padding:13, fontSize:14, borderRadius:10 }}>Analyze & Find Jobs ✦</Btn>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── LOADING ── */}
      {stage === "loading" && (
        <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 1.5rem", animation:"fadeIn 0.4s ease" }}>
          <div style={{ textAlign:"center", maxWidth:460 }}>
            <div style={{ width:64, height:64, border:`3px solid ${C.border}`, borderTopColor:C.forest, borderRadius:"50%", animation:"spin 0.9s linear infinite", margin:"0 auto 28px" }} />
            <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:24, color:C.ink, marginBottom:10, fontWeight:700 }}>{loadMsg}</h2>
            <p style={{ color:C.inkMid, fontSize:14, marginBottom:36 }}>Powered by Groq AI (Llama 3.3 70B) — takes about 15–20 seconds.</p>
            <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
              {Object.entries(PLATFORMS).map(([name, cfg]) => (
                <div key={name} style={{ background:cfg.bg, border:`1px solid ${cfg.color}33`, borderRadius:8, padding:"6px 14px", fontSize:11, color:cfg.color, fontWeight:700, animation:"shimmer 2s infinite" }}>{cfg.icon} {name}</div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── RESULTS ── */}
      {stage === "results" && results && (
        <section style={{ minHeight:"100vh", padding:"80px 1.5rem 60px", animation:"fadeUp 0.5s ease" }}>
          <div style={{ maxWidth:1100, margin:"0 auto" }}>
            {/* Profile strip */}
            <div style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:16, padding:"16px 20px", marginBottom:20, display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
              <div style={{ width:44, height:44, borderRadius:"50%", background:C.sagePale2, border:`2px solid ${C.sage}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🎓</div>
              <div style={{ flex:1, minWidth:160 }}>
                <p style={{ fontWeight:800, fontSize:15, color:C.ink, marginBottom:2 }}>{results.profile?.name || "Your Profile"}</p>
                <p style={{ color:C.inkMid, fontSize:12 }}>{results.profile?.degree} · {results.profile?.school} · {filters.location}</p>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {results.profile?.skills?.slice(0,3).map(s => <Tag key={s} color={C.forest} bg={C.sagePale2}>{s}</Tag>)}
              </div>
              <Btn variant="ghost" onClick={reset} style={{ fontSize:12, padding:"7px 14px", flexShrink:0 }}>↺ New Search</Btn>
            </div>

            {/* AI summary */}
            <div style={{ background:C.sagePale2, border:`1.5px solid ${C.sage}44`, borderRadius:14, padding:"16px 20px", marginBottom:24, display:"flex", gap:12 }}>
              <span style={{ fontSize:18, flexShrink:0 }}>✦</span>
              <div>
                <p style={{ color:C.forestMid, fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:6 }}>AI Profile Summary</p>
                <p style={{ color:C.ink, fontSize:14, lineHeight:1.75 }}>{results.profile?.summary}</p>
                {results.profile?.strengths && (
                  <div style={{ display:"flex", gap:8, marginTop:10, flexWrap:"wrap" }}>
                    {results.profile.strengths.map(s => <Tag key={s} color={C.sage} bg="#eef6f1">✓ {s}</Tag>)}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:20, flexWrap:"wrap", gap:10 }}>
              <div>
                <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:24, color:C.ink, fontWeight:700, marginBottom:3 }}>Your Matched Job Searches</h2>
                <p style={{ color:C.inkMid, fontSize:13 }}>{results.jobs?.length} personalized links · Expand to see why it matches · Click to open</p>
              </div>
              <Btn variant="ghost" onClick={() => setStage("filters")} style={{ fontSize:12 }}>⚙ Adjust Filters</Btn>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
              {results.jobs?.map((job, i) => {
                const plat = PLATFORMS[job.platform] || { color:C.sky, bg:C.skyPale, icon:"🔵" };
                const isOpen = openCard === i;
                const scoreColor = job.matchScore>=90?C.sage:job.matchScore>=80?C.amber:C.sky;
                return (
                  <div key={i}
                    style={{ background:C.surface, border:`1.5px solid ${isOpen?C.forest:C.border}`, borderRadius:16, overflow:"hidden", transition:"all 0.25s", cursor:"pointer", animation:`fadeUp 0.4s ease ${i*0.06}s both`, boxShadow:isOpen?"0 8px 32px rgba(0,0,0,0.1)":"none" }}
                    onClick={() => setOpenCard(isOpen?null:i)}>
                    <div style={{ height:3, background:C.border }}>
                      <div style={{ height:"100%", width:`${job.matchScore}%`, background:`linear-gradient(90deg,${C.sage},${C.amber})`, transition:"width 1s ease" }} />
                    </div>
                    <div style={{ padding:20 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", gap:7, alignItems:"center", marginBottom:8 }}>
                            <span style={{ background:plat.bg, color:plat.color, border:`1px solid ${plat.color}33`, borderRadius:6, padding:"2px 9px", fontSize:10, fontWeight:700 }}>{plat.icon} {job.platform}</span>
                            <span style={{ color:C.inkLow, fontSize:10, fontFamily:"'DM Mono',monospace" }}>#{i+1}</span>
                          </div>
                          <h3 style={{ fontFamily:"'Fraunces',serif", fontSize:16, color:C.ink, lineHeight:1.3, fontWeight:700 }}>{job.title}</h3>
                        </div>
                        <div style={{ textAlign:"right", flexShrink:0, marginLeft:10 }}>
                          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:20, fontWeight:500, color:scoreColor }}>{job.matchScore}%</div>
                          <div style={{ color:C.inkLow, fontSize:10 }}>match</div>
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
                        {job.tags?.map(t => <Tag key={t} color={C.inkMid} bg={C.surfaceAlt}>{t}</Tag>)}
                      </div>
                      <p style={{ color:C.inkLow, fontSize:11 }}>{isOpen?"▲ collapse":"▼ see why this matches you"}</p>
                      {isOpen && (
                        <div style={{ marginTop:14, animation:"fadeUp 0.2s ease" }}>
                          <div style={{ background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:10, padding:14, marginBottom:12 }}>
                            <p style={{ fontSize:10, color:C.forestMid, fontWeight:700, letterSpacing:1, marginBottom:8, textTransform:"uppercase" }}>✦ Why This Matches You</p>
                            <p style={{ color:C.inkMid, fontSize:13, lineHeight:1.7 }}>{job.reason}</p>
                          </div>
                          <a href={job.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none", display:"block" }} onClick={e => e.stopPropagation()}>
                            <div style={{ background:C.forest, color:"#fff", borderRadius:10, padding:13, textAlign:"center", fontWeight:700, fontSize:14, fontFamily:"'DM Sans',sans-serif", transition:"opacity 0.18s" }}
                              onMouseEnter={e => e.currentTarget.style.opacity="0.85"}
                              onMouseLeave={e => e.currentTarget.style.opacity="1"}>
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

            {/* All boards */}
            <div style={{ marginTop:36, background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:16, padding:24 }}>
              <p style={{ color:C.inkLow, fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:16 }}>Browse All Philippine Job Boards</p>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {JOB_BOARDS.map(b => (
                  <a key={b.name} href={b.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
                    <div style={{ background:b.bg, border:`1.5px solid ${b.color}33`, borderRadius:9, padding:"9px 18px", color:b.color, fontSize:13, fontWeight:700, transition:"all 0.18s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor=b.color; e.currentTarget.style.transform="translateY(-2px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor=b.color+"33"; e.currentTarget.style.transform="none"; }}>
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

/* ── Career Paths ── */
function CareerPaths() {
  const [active, setActive] = useState(0);
  const p = CAREER_PATHS[active];
  return (
    <div style={{ background:C.bg, paddingTop:60, paddingBottom:72 }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"50px 1.5rem" }}>
        <div style={{ textAlign:"center", marginBottom:44 }}>
          <p style={{ color:C.inkLow, fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>Navigate Your Future</p>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(2rem,4.5vw,3.2rem)", color:C.ink, fontWeight:900, marginBottom:10 }}>Career Paths by Degree</h1>
          <p style={{ color:C.inkMid, fontSize:15, maxWidth:480, margin:"0 auto" }}>Select your degree to see a real roadmap — salaries, certifications, and where to start.</p>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginBottom:40 }}>
          {CAREER_PATHS.map((cp,i) => (
            <button key={cp.degree} onClick={() => setActive(i)}
              style={{ padding:"9px 16px", borderRadius:10, border:`1.5px solid ${active===i?C.forest:C.border}`, background:active===i?C.forest:C.surface, color:active===i?"#fff":C.inkMid, fontSize:12, fontWeight:700, cursor:"pointer", transition:"all 0.2s", fontFamily:"'DM Sans',sans-serif" }}>
              {cp.icon} {cp.degree}
            </button>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <div style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:16, padding:24, gridColumn:"1/-1" }}>
            <p style={{ color:C.inkLow, fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:16 }}>Career Progression</p>
            <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
              {p.roles.map((r,i) => (
                <div key={r} style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ background:i===0?C.sagePale2:C.surfaceAlt, border:`1.5px solid ${i===0?C.sage:C.border}`, borderRadius:10, padding:"8px 16px", color:i===0?C.forestMid:C.inkMid, fontSize:13, fontWeight:i===0?700:400 }}>{r}</div>
                  {i < p.roles.length-1 && <span style={{ color:C.borderDark, fontSize:16 }}>→</span>}
                </div>
              ))}
            </div>
          </div>
          <div style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:16, padding:24 }}>
            <p style={{ color:C.inkLow, fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:10 }}>Salary Range</p>
            <p style={{ fontFamily:"'Fraunces',serif", fontSize:30, color:C.amber, marginBottom:6, fontWeight:700 }}>{p.salary}</p>
            <p style={{ color:C.inkLow, fontSize:12 }}>Philippine market, entry to senior level.</p>
          </div>
          <div style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:16, padding:24 }}>
            <p style={{ color:C.inkLow, fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:14 }}>Certifications to Pursue</p>
            {p.certs.map(c => <div key={c} style={{ display:"flex", gap:10, color:C.inkMid, fontSize:13, marginBottom:10 }}><span style={{ color:C.sage }}>✓</span>{c}</div>)}
          </div>
          <div style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:16, padding:24 }}>
            <p style={{ color:C.inkLow, fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:14 }}>Industries to Explore</p>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>{p.industries.map(ind => <Tag key={ind} color={C.inkMid} bg={C.surfaceAlt}>{ind}</Tag>)}</div>
          </div>
          <div style={{ background:C.sagePale2, border:`1.5px solid ${C.sage}44`, borderRadius:16, padding:24, gridColumn:"1/-1" }}>
            <p style={{ color:C.forestMid, fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:8 }}>✦ Your First Step — Right Now</p>
            <p style={{ color:C.ink, fontSize:15, lineHeight:1.8 }}>{p.tip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Guide ── */
function Guide() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ background:C.bg, paddingTop:60, paddingBottom:72 }}>
      <div style={{ maxWidth:740, margin:"0 auto", padding:"50px 1.5rem" }}>
        <div style={{ textAlign:"center", marginBottom:44 }}>
          <p style={{ color:C.inkLow, fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>Step by Step</p>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(2rem,4.5vw,3.2rem)", color:C.ink, fontWeight:900, marginBottom:10 }}>How to Land Your First Job</h1>
          <p style={{ color:C.inkMid, fontSize:15, maxWidth:440, margin:"0 auto" }}>Never worked full-time? Follow this guide and go from fresh grad to hired — with confidence.</p>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {GUIDE_STEPS.map((s,i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ background:C.surface, border:`1.5px solid ${isOpen?C.forest:C.border}`, borderRadius:14, overflow:"hidden", transition:"all 0.25s" }}>
                <button onClick={() => setOpen(isOpen?null:i)} style={{ width:"100%", background:"none", border:"none", padding:"20px 22px", cursor:"pointer", display:"flex", alignItems:"center", gap:16, textAlign:"left" }}>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:18, color:isOpen?C.forest:C.inkLow, minWidth:32, transition:"color 0.2s" }}>{s.n}</span>
                  <span style={{ fontSize:20 }}>{s.icon}</span>
                  <h3 style={{ color:C.ink, fontFamily:"'Fraunces',serif", fontSize:17, flex:1, fontWeight:700 }}>{s.title}</h3>
                  <span style={{ color:C.inkLow, fontSize:16, transition:"transform 0.25s", transform:isOpen?"rotate(180deg)":"none", display:"inline-block" }}>↓</span>
                </button>
                {isOpen && (
                  <div style={{ padding:"0 22px 22px", animation:"fadeUp 0.2s ease" }}>
                    <p style={{ color:C.inkMid, fontSize:14, lineHeight:1.8, marginBottom:12 }}>{s.body}</p>
                    <div style={{ background:C.sagePale2, border:`1px solid ${C.sage}33`, borderRadius:10, padding:"11px 14px", display:"flex", gap:10 }}>
                      <span style={{ color:C.sage, flexShrink:0 }}>💡</span>
                      <p style={{ color:C.forestMid, fontSize:13 }}><strong>Pro Tip:</strong> {s.tip}</p>
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

/* ── About ── */
function About() {
  return (
    <div style={{ background:C.bg, paddingTop:60, paddingBottom:72 }}>
      <div style={{ maxWidth:800, margin:"0 auto", padding:"50px 1.5rem" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <p style={{ color:C.inkLow, fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>Our Story</p>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(2rem,4.5vw,3.2rem)", color:C.ink, fontWeight:900, marginBottom:16 }}>Built for Filipino Fresh Graduates</h1>
          <p style={{ color:C.inkMid, fontSize:16, lineHeight:1.8, maxWidth:580, margin:"0 auto" }}>GradLaunch was built out of a simple frustration: fresh graduates in the Philippines have no easy way to find jobs aligned with what they studied — and nobody tells them what to do next.</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:40 }}>
          {[
            { icon:"🎯", title:"Our Mission", desc:"To make job hunting less overwhelming for Filipino fresh graduates by giving them AI-powered tools, career roadmaps, and practical guides — completely free." },
            { icon:"🇵🇭", title:"Why Philippines?", desc:"The Philippines produces over 800,000 college graduates every year. Most have no clear path forward. We're here to change that — one resume at a time." },
            { icon:"🔒", title:"Privacy First", desc:"We never store your resume. Your PDF is read locally in your browser, the text is analyzed by AI, and nothing is saved to any server. Your data stays yours." },
            { icon:"🆓", title:"Always Free", desc:"GradLaunch will always be free for job hunters. We believe access to career guidance should not be gated behind a paywall — especially for fresh graduates." },
          ].map(f => (
            <div key={f.title} style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:16, padding:24 }}>
              <div style={{ fontSize:32, marginBottom:12 }}>{f.icon}</div>
              <h3 style={{ fontFamily:"'Fraunces',serif", fontSize:17, color:C.ink, fontWeight:700, marginBottom:8 }}>{f.title}</h3>
              <p style={{ color:C.inkMid, fontSize:14, lineHeight:1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background:C.forest, borderRadius:20, padding:"36px 32px", textAlign:"center" }}>
          <h3 style={{ fontFamily:"'Fraunces',serif", color:"#fff", fontSize:22, marginBottom:12, fontWeight:700 }}>Powered by Groq + Llama 3.3 AI</h3>
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:14, lineHeight:1.7, maxWidth:500, margin:"0 auto 20px" }}>GradLaunch uses Groq's lightning-fast inference with Meta's Llama 3.3 70B model to analyze your resume and generate personalized job search links — all in under 20 seconds.</p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            {["Groq AI","Llama 3.3 70B","PDF.js","Vercel","React"].map(t => (
              <span key={t} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:20, padding:"5px 14px", fontSize:12, color:"rgba(255,255,255,0.8)", fontWeight:600 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Contact / Feedback ── */
function Contact() {
  const [form, setForm]     = useState({ name:"", email:"", type:"feedback", message:"" });
  const [sent, setSent]     = useState(false);
  const [sending, setSending] = useState(false);
  const f = k => v => setForm(p => ({ ...p, [k]:v }));

  const submit = () => {
    if (!form.name || !form.message) return;
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1200);
  };

  return (
    <div style={{ background:C.bg, paddingTop:60, paddingBottom:72 }}>
      <div style={{ maxWidth:900, margin:"0 auto", padding:"50px 1.5rem", display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:32, alignItems:"start" }}>
        {/* Left */}
        <div>
          <p style={{ color:C.inkLow, fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>Get in Touch</p>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(2rem,4vw,2.8rem)", color:C.ink, fontWeight:900, marginBottom:16 }}>We'd love to hear from you.</h1>
          <p style={{ color:C.inkMid, fontSize:15, lineHeight:1.8, marginBottom:32 }}>Whether it's a bug report, a suggestion, a success story, or just a question — we read every message.</p>

          <div style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:36 }}>
            {[
              { icon:"✉️", label:"Email", val:"hello@gradlaunch.ph" },
              { icon:"💬", label:"Response Time", val:"Within 24–48 hours" },
              { icon:"🇵🇭", label:"Based in", val:"Philippines" },
            ].map(({ icon, label, val }) => (
              <div key={label} style={{ display:"flex", gap:14, alignItems:"center" }}>
                <div style={{ width:40, height:40, borderRadius:10, background:C.surface, border:`1.5px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{icon}</div>
                <div>
                  <p style={{ fontSize:11, color:C.inkLow, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</p>
                  <p style={{ fontSize:14, color:C.ink, fontWeight:600 }}>{val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social links */}
          <div>
            <p style={{ fontSize:11, fontWeight:700, color:C.inkLow, textTransform:"uppercase", letterSpacing:1.5, marginBottom:12 }}>Follow Us</p>
            <div style={{ display:"flex", gap:10 }}>
              {[
                { icon:"💼", label:"LinkedIn",  url:"https://linkedin.com",  color:"#0077b5", bg:"#e8f4fd" },
                { icon:"🐦", label:"Twitter/X", url:"https://twitter.com",   color:"#1a1a1a", bg:"#f5f5f5" },
                { icon:"📘", label:"Facebook",  url:"https://facebook.com",  color:"#1877f2", bg:"#e7f0fd" },
                { icon:"📷", label:"Instagram", url:"https://instagram.com", color:"#e1306c", bg:"#fdeef4" },
              ].map(s => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:s.bg, border:`1.5px solid ${s.color}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, transition:"all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.borderColor=s.color+"66"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.borderColor=s.color+"22"; }}
                    title={s.label}>{s.icon}</div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Form */}
        <div style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:20, padding:"32px 28px" }}>
          {sent ? (
            <div style={{ textAlign:"center", padding:"40px 20px", animation:"fadeUp 0.4s ease" }}>
              <div style={{ fontSize:56, marginBottom:16 }}>🎉</div>
              <h3 style={{ fontFamily:"'Fraunces',serif", fontSize:22, color:C.ink, fontWeight:700, marginBottom:8 }}>Message received!</h3>
              <p style={{ color:C.inkMid, fontSize:14, marginBottom:24 }}>Thank you for reaching out. We'll get back to you within 24–48 hours.</p>
              <Btn onClick={() => { setSent(false); setForm({ name:"", email:"", type:"feedback", message:"" }); }}>Send another message</Btn>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:20, color:C.ink, fontWeight:700, marginBottom:24 }}>Send us a message</h2>

              {/* Message type */}
              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:C.inkLow, letterSpacing:1.5, textTransform:"uppercase", marginBottom:10 }}>Message Type</label>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {[["feedback","💬 Feedback"],["bug","🐛 Bug Report"],["suggestion","💡 Suggestion"],["success","🎉 Success Story"]].map(([v,l]) => (
                    <button key={v} onClick={() => setForm(p => ({ ...p, type:v }))}
                      style={{ padding:"7px 14px", borderRadius:8, border:`1.5px solid ${form.type===v?C.forest:C.border}`, background:form.type===v?C.sagePale2:"transparent", color:form.type===v?C.forest:C.inkMid, fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.18s", fontFamily:"'DM Sans',sans-serif" }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {[
                  { label:"Your Name", key:"name", placeholder:"Juan dela Cruz", type:"text" },
                  { label:"Email Address", key:"email", placeholder:"you@email.com", type:"email" },
                ].map(({ label, key, placeholder, type }) => (
                  <div key={key}>
                    <label style={{ display:"block", fontSize:11, fontWeight:700, color:C.inkLow, letterSpacing:1.5, textTransform:"uppercase", marginBottom:8 }}>{label}</label>
                    <input type={type} value={form[key]} onChange={e => f(key)(e.target.value)} placeholder={placeholder}
                      style={{ width:"100%", padding:"11px 14px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, background:C.surfaceAlt, color:C.ink, outline:"none", fontFamily:"'DM Sans',sans-serif", transition:"border 0.2s" }}
                      onFocus={e => e.target.style.borderColor=C.forest}
                      onBlur={e => e.target.style.borderColor=C.border}
                    />
                  </div>
                ))}

                <div>
                  <label style={{ display:"block", fontSize:11, fontWeight:700, color:C.inkLow, letterSpacing:1.5, textTransform:"uppercase", marginBottom:8 }}>Message</label>
                  <textarea value={form.message} onChange={e => f("message")(e.target.value)} placeholder="Tell us what's on your mind…" rows={5}
                    style={{ width:"100%", padding:"11px 14px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, background:C.surfaceAlt, color:C.ink, outline:"none", resize:"vertical", fontFamily:"'DM Sans',sans-serif", transition:"border 0.2s" }}
                    onFocus={e => e.target.style.borderColor=C.forest}
                    onBlur={e => e.target.style.borderColor=C.border}
                  />
                </div>

                <Btn onClick={submit} disabled={sending || !form.name || !form.message} style={{ width:"100%", padding:13, fontSize:15, borderRadius:10, marginTop:4 }}>
                  {sending ? "Sending…" : "Send Message →"}
                </Btn>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Footer ── */
function Footer({ setPage }) {
  return (
    <footer style={{ background:C.forest, padding:"48px 1.5rem 80px" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:32, marginBottom:40 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <div style={{ width:28, height:28, background:"rgba(255,255,255,0.15)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Fraunces',serif", fontSize:14, color:"#fff", fontStyle:"italic" }}>G</div>
              <span style={{ fontFamily:"'Fraunces',serif", color:"#fff", fontSize:16, fontWeight:700 }}>GradLaunch</span>
            </div>
            <p style={{ color:"rgba(255,255,255,0.5)", fontSize:13, lineHeight:1.7, marginBottom:16 }}>Free AI job matching for Filipino fresh graduates. Always free, always private.</p>
            <div style={{ display:"flex", gap:10 }}>
              {[["💼","https://linkedin.com"],["🐦","https://twitter.com"],["📘","https://facebook.com"],["📷","https://instagram.com"]].map(([ic,url]) => (
                <a key={url} href={url} target="_blank" rel="noopener noreferrer"
                  style={{ width:34, height:34, borderRadius:8, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, textDecoration:"none", transition:"all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.15)"}
                  onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.08)"}>
                  {ic}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:14 }}>Platform</p>
            {[["home","Job Finder"],["paths","Career Paths"],["guide","Job Hunt Guide"]].map(([p,l]) => (
              <button key={p} onClick={() => setPage(p)} style={{ display:"block", background:"none", border:"none", color:"rgba(255,255,255,0.65)", fontSize:14, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", marginBottom:10, padding:0, textAlign:"left" }}>{l}</button>
            ))}
          </div>
          <div>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:14 }}>Company</p>
            {[["about","About Us"],["contact","Contact Us"],["contact","Give Feedback"]].map(([p,l]) => (
              <button key={l} onClick={() => setPage(p)} style={{ display:"block", background:"none", border:"none", color:"rgba(255,255,255,0.65)", fontSize:14, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", marginBottom:10, padding:0, textAlign:"left" }}>{l}</button>
            ))}
          </div>
          <div>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:14 }}>Job Boards</p>
            {JOB_BOARDS.map(b => (
              <a key={b.name} href={b.url} target="_blank" rel="noopener noreferrer" style={{ display:"block", color:"rgba(255,255,255,0.65)", fontSize:14, textDecoration:"none", marginBottom:10 }}>{b.name} ↗</a>
            ))}
          </div>
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:24, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <p style={{ color:"rgba(255,255,255,0.3)", fontSize:12 }}>© 2025 GradLaunch · Built for 🇵🇭 Filipino Fresh Graduates · Always Free</p>
          <p style={{ color:"rgba(255,255,255,0.3)", fontSize:12 }}>Powered by Groq AI + Llama 3.3 70B</p>
        </div>
      </div>
    </footer>
  );
}

/* ── App Root ── */
export default function App() {
  const [page, setPage] = useState("home");
  const goTo = (p) => { setPage(p); window.scrollTo({ top:0, behavior:"smooth" }); };
  return (
    <div>
      <style>{STYLES}</style>
      <NavBar page={page} setPage={goTo} />
      <BottomNav page={page} setPage={goTo} />
      {page==="home"    && <><Home /><Footer setPage={goTo} /></>}
      {page==="paths"   && <><CareerPaths /><Footer setPage={goTo} /></>}
      {page==="guide"   && <><Guide /><Footer setPage={goTo} /></>}
      {page==="about"   && <><About /><Footer setPage={goTo} /></>}
      {page==="contact" && <><Contact /><Footer setPage={goTo} /></>}
    </div>
  );
}