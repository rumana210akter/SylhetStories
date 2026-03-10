
import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const rainfallData = [
  { year: "2004", rainfall: 3200, floods: 3, affected: 1.2 },
  { year: "2007", rainfall: 3600, floods: 4, affected: 2.1 },
  { year: "2010", rainfall: 3400, floods: 2, affected: 0.8 },
  { year: "2012", rainfall: 3800, floods: 3, affected: 1.5 },
  { year: "2014", rainfall: 3500, floods: 2, affected: 0.9 },
  { year: "2017", rainfall: 4100, floods: 5, affected: 3.4 },
  { year: "2019", rainfall: 3900, floods: 3, affected: 1.8 },
  { year: "2022", rainfall: 4400, floods: 6, affected: 4.1 },
  { year: "2024", rainfall: 5200, floods: 8, affected: 6.25 },
];

const stories = [
  {
    year: "2004",
    title: "The First Warning",
    icon: "💧",
    desc: "Sylhet's haors begin showing signs of unusual flooding. Farmers notice wetlands shrinking as construction accelerates along riverbeds.",
    stat: "1.2M affected",
    color: "#38bdf8",
  },
  {
    year: "2007",
    title: "The Surma Swells",
    icon: "🌊",
    desc: "The Surma River overflows its banks for 4 consecutive days. Scientists note the river hasn't been dredged since 1971.",
    stat: "2.1M affected",
    color: "#0ea5e9",
  },
  {
    year: "2017",
    title: "The Haor Catastrophe",
    icon: "🌾",
    desc: "Flash floods destroy 80% of Boro rice crops in haors before harvest. Fishermen lose boats; farmers lose a full season's income overnight.",
    stat: "3.4M affected",
    color: "#f59e0b",
  },
  {
    year: "2022",
    title: "City Goes Under",
    icon: "🏚️",
    desc: "Sylhet city itself floods for the first time in decades. Streets become rivers. Airports close. 4.1 million people displaced.",
    stat: "4.1M affected",
    color: "#f97316",
  },
  {
    year: "2024",
    title: "Record Broken — Again",
    icon: "🚨",
    desc: "66% of Sylhet division submerged. 2,124mm of rain recorded in June alone — shattering the 30-year record of 1,288mm set in 2006.",
    stat: "6.25M affected",
    color: "#ef4444",
  },
];

const causes = [
  {
    icon: "🏗️",
    title: "River Silting",
    detail: "Surma River undredged since 1971. Raised riverbed = less water capacity.",
    solution: "Regular dredging + riverside buffer zones",
    color: "#6366f1",
  },
  {
    icon: "🌿",
    title: "Wetland Loss",
    detail: "Haors (natural sponges) are being filled for construction projects.",
    solution: "Wetland protection policy + eco-zoning",
    color: "#10b981",
  },
  {
    icon: "☁️",
    title: "Meghalaya Rainfall",
    detail: "200mm in Meghalaya + 400mm in Sylhet = guaranteed flash flood.",
    solution: "Cross-border early warning system",
    color: "#3b82f6",
  },
  {
    icon: "🌡️",
    title: "Climate Change",
    detail: "Warmer temperatures intensify monsoon cycles every year.",
    solution: "Carbon-neutral infrastructure + renewable energy",
    color: "#f59e0b",
  },
];

const WARNING_THRESHOLDS = { safe: 100, watch: 250, warning: 400, danger: 600 };

function RainDrop({ style }) {
  return (
    <div
      className="raindrop"
      style={{
        position: "absolute",
        width: "2px",
        background: "linear-gradient(to bottom, transparent, rgba(148,210,255,0.6))",
        borderRadius: "1px",
        animation: "fall linear infinite",
        ...style,
      }}
    />
  );
}

function FloodMap({ level }) {
  const districts = [
    { name: "Sylhet Sadar", x: 55, y: 45, r: 22 },
    { name: "Sunamganj", x: 25, y: 30, r: 18 },
    { name: "Habiganj", x: 60, y: 72, r: 16 },
    { name: "Moulvibazar", x: 35, y: 68, r: 15 },
  ];

  const getColor = (base, level) => {
    if (level < 30) return "#1e3a5f";
    if (level < 60) return "#1d4ed8";
    if (level < 80) return "#f59e0b";
    return "#dc2626";
  };

  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", filter: "drop-shadow(0 0 20px rgba(56,189,248,0.3))" }}>
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(56,189,248,0.3)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      {/* Background */}
      <rect width="100" height="100" fill="#0a1628" rx="4" />
      <ellipse cx="50" cy="50" rx="45" ry="40" fill="url(#glow)" />

      {/* Rivers */}
      <path d="M20,20 Q40,40 50,50 Q60,60 75,80" stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M10,50 Q30,48 50,50 Q70,52 90,55" stroke="#38bdf8" strokeWidth="1" fill="none" opacity="0.4" />

      {/* Districts */}
      {districts.map((d, i) => (
        <g key={i}>
          <circle
            cx={d.x}
            cy={d.y}
            r={d.r}
            fill={getColor("#1e3a5f", level)}
            opacity={0.7 + (level / 300)}
            style={{ transition: "fill 0.5s, opacity 0.5s" }}
          />
          <circle cx={d.x} cy={d.y} r={d.r + 2} fill="none" stroke="rgba(148,210,255,0.3)" strokeWidth="0.5" />
          <text x={d.x} y={d.y + 1} textAnchor="middle" fontSize="3.5" fill="white" fontWeight="bold">
            {d.name.split(" ")[0]}
          </text>
          {level > 300 && (
            <text x={d.x} y={d.y + 6} textAnchor="middle" fontSize="3" fill="#fbbf24">
              ⚠️
            </text>
          )}
        </g>
      ))}

      {/* Flood overlay */}
      {level > 200 && (
        <ellipse
          cx="50" cy="50" rx={20 + level / 15} ry={15 + level / 20}
          fill="rgba(56,189,248,0.15)"
          style={{ transition: "all 0.5s" }}
        />
      )}

      {/* Labels */}
      <text x="50" y="95" textAnchor="middle" fontSize="4" fill="rgba(148,210,255,0.7)">
        Sylhet Division
      </text>
    </svg>
  );
}

export default function SylhetStories() {
  const [activeSection, setActiveSection] = useState("home");
  const [rainfall, setRainfall] = useState(50);
  const [meghalaya, setMeghalaya] = useState(50);
  const [activeStory, setActiveStory] = useState(0);
  const [drops, setDrops] = useState([]);
  const [animating, setAnimating] = useState(false);

  const totalRisk = Math.min(100, (rainfall / 600 + meghalaya / 200) * 50);
  const floodLevel = rainfall + meghalaya * 2;

  const alertLevel =
    floodLevel > 800 ? { label: "🚨 DANGER", color: "#dc2626", bg: "rgba(220,38,38,0.15)" } :
    floodLevel > 500 ? { label: "⚠️ WARNING", color: "#f97316", bg: "rgba(249,115,22,0.15)" } :
    floodLevel > 300 ? { label: "👁 WATCH", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" } :
    { label: "✅ SAFE", color: "#10b981", bg: "rgba(16,185,129,0.15)" };

  useEffect(() => {
    const newDrops = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      height: `${10 + Math.random() * 20}px`,
      duration: `${0.5 + Math.random() * 1}s`,
      delay: `${Math.random() * 2}s`,
      opacity: 0.2 + Math.random() * 0.4,
    }));
    setDrops(newDrops);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStory(s => (s + 1) % stories.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "stories", label: "Stories" },
    { id: "data", label: "Data" },
    { id: "warning", label: "Early Warning" },
    { id: "solutions", label: "Solutions" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050d1a",
      color: "#e2e8f0",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Sans+3:wght@300;400;600&display=swap');
        @keyframes fall {
          from { transform: translateY(-20px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          to { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes wave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.1); }
        }
        .nav-btn { transition: all 0.2s; border-bottom: 2px solid transparent; }
        .nav-btn:hover { color: #38bdf8; border-bottom-color: #38bdf8; }
        .nav-btn.active { color: #38bdf8; border-bottom-color: #38bdf8; }
        .card { transition: transform 0.2s, box-shadow 0.2s; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .story-card { transition: all 0.3s; }
        .story-card:hover { transform: scale(1.02); }
        .slider { -webkit-appearance: none; width: 100%; height: 6px; border-radius: 3px; outline: none; }
        .slider-blue { background: linear-gradient(to right, #0ea5e9 0%, #0ea5e9 var(--val), #1e3a5f var(--val), #1e3a5f 100%); }
        .slider-teal { background: linear-gradient(to right, #14b8a6 0%, #14b8a6 var(--tval), #1e3a5f var(--tval), #1e3a5f 100%); }
        .slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: white; cursor: pointer; box-shadow: 0 0 10px rgba(56,189,248,0.5); }
        .section-enter { animation: fadeUp 0.5s ease forwards; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* Rain background */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {drops.map(d => (
          <RainDrop key={d.id} style={{
            left: d.left, height: d.height,
            animationDuration: d.duration,
            animationDelay: d.delay,
            opacity: d.opacity,
            top: "-20px",
          }} />
        ))}
      </div>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(5,13,26,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(56,189,248,0.15)",
        padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "60px",
      }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 900, background: "linear-gradient(90deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          SylhetStories
        </div>
        <div style={{ display: "flex", gap: "24px" }}>
          {navItems.map(n => (
            <button key={n.id} className={`nav-btn ${activeSection === n.id ? "active" : ""}`}
              onClick={() => setActiveSection(n.id)}
              style={{ background: "none", border: "none", color: activeSection === n.id ? "#38bdf8" : "#94a3b8", cursor: "pointer", fontSize: "13px", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, letterSpacing: "0.05em", paddingBottom: "4px" }}>
              {n.label}
            </button>
          ))}
        </div>
      </nav>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* HOME */}
        {activeSection === "home" && (
          <div className="section-enter">
            {/* Hero */}
            <div style={{
              minHeight: "90vh", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", textAlign: "center",
              padding: "60px 24px",
              background: "radial-gradient(ellipse at 50% 60%, rgba(14,165,233,0.08) 0%, transparent 70%)",
            }}>
              <div style={{ fontSize: "13px", letterSpacing: "0.2em", color: "#38bdf8", fontFamily: "'Source Sans 3', sans-serif", marginBottom: "20px", textTransform: "uppercase" }}>
                🌧 Climate × Sustainability Exhibition — Sylhet, Bangladesh
              </div>
              <h1 style={{
                fontFamily: "'Playfair Display', serif", fontSize: "clamp(48px, 8vw, 96px)",
                fontWeight: 900, lineHeight: 1.05,
                background: "linear-gradient(135deg, #e2e8f0 30%, #38bdf8 60%, #818cf8 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                marginBottom: "24px",
              }}>
                When the Sky<br />Drowns a City
              </h1>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "18px", color: "#94a3b8", maxWidth: "560px", lineHeight: 1.7, marginBottom: "48px" }}>
                A data-driven story of Sylhet's climate crisis — from rising floodwaters to community-led solutions.
              </p>

              {/* Live story ticker */}
              <div style={{
                background: "rgba(15,23,42,0.8)", border: `1px solid ${stories[activeStory].color}40`,
                borderLeft: `4px solid ${stories[activeStory].color}`,
                borderRadius: "12px", padding: "20px 28px", maxWidth: "500px", width: "100%",
                marginBottom: "40px", transition: "all 0.5s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "28px" }}>{stories[activeStory].icon}</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700, color: stories[activeStory].color }}>
                    {stories[activeStory].year} — {stories[activeStory].title}
                  </span>
                </div>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "14px", color: "#94a3b8", lineHeight: 1.6 }}>
                  {stories[activeStory].desc}
                </p>
                <div style={{ marginTop: "10px", fontSize: "13px", fontWeight: 700, color: stories[activeStory].color }}>
                  {stories[activeStory].stat}
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                {stories.map((_, i) => (
                  <div key={i} onClick={() => setActiveStory(i)} style={{
                    width: i === activeStory ? "24px" : "8px", height: "8px",
                    borderRadius: "4px", background: i === activeStory ? "#38bdf8" : "#1e3a5f",
                    cursor: "pointer", transition: "all 0.3s",
                  }} />
                ))}
              </div>

              <div style={{ display: "flex", gap: "16px", marginTop: "48px" }}>
                {["stories", "warning", "solutions"].map((s, i) => (
                  <button key={s} onClick={() => setActiveSection(s)} style={{
                    padding: "12px 24px", borderRadius: "8px", cursor: "pointer",
                    fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "14px",
                    border: i === 0 ? "none" : "1px solid rgba(56,189,248,0.3)",
                    background: i === 0 ? "linear-gradient(135deg, #0ea5e9, #6366f1)" : "transparent",
                    color: "white",
                  }}>
                    {s === "stories" ? "📖 Read Stories" : s === "warning" ? "⚡ Flood Simulator" : "💡 Solutions"}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", padding: "0 24px 60px", maxWidth: "900px", margin: "0 auto" }}>
              {[
                { n: "66%", label: "of Sylhet flooded in 2024", icon: "🌊", color: "#38bdf8" },
                { n: "6.25M", label: "people affected (2024)", icon: "👥", color: "#f59e0b" },
                { n: "2124mm", label: "rain in June 2024 alone", icon: "🌧", color: "#818cf8" },
                { n: "53yrs", label: "since last river dredging", icon: "⏳", color: "#ef4444" },
              ].map((s, i) => (
                <div key={i} className="card" style={{
                  background: "rgba(15,23,42,0.7)", border: `1px solid ${s.color}20`,
                  borderTop: `3px solid ${s.color}`, borderRadius: "12px", padding: "20px",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 900, color: s.color }}>{s.n}</div>
                  <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "12px", color: "#64748b", marginTop: "4px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STORIES */}
        {activeSection === "stories" && (
          <div className="section-enter" style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "42px", fontWeight: 900, marginBottom: "8px" }}>
              Sylhet's <span style={{ color: "#38bdf8" }}>Climate Timeline</span>
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#64748b", marginBottom: "40px" }}>
              Two decades of rising waters — told through data and human stories.
            </p>

            <div style={{ position: "relative" }}>
              {/* Timeline line */}
              <div style={{ position: "absolute", left: "28px", top: "20px", bottom: "20px", width: "2px", background: "linear-gradient(to bottom, #38bdf8, #ef4444)", borderRadius: "1px" }} />

              {stories.map((s, i) => (
                <div key={i} className="story-card" style={{
                  display: "flex", gap: "24px", marginBottom: "32px",
                  paddingLeft: "60px", position: "relative",
                }}>
                  {/* Dot */}
                  <div style={{
                    position: "absolute", left: "18px", top: "20px",
                    width: "22px", height: "22px", borderRadius: "50%",
                    background: s.color, border: "3px solid #050d1a",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "10px", zIndex: 1,
                  }} />

                  <div style={{
                    flex: 1, background: "rgba(15,23,42,0.8)",
                    border: `1px solid ${s.color}25`, borderLeft: `4px solid ${s.color}`,
                    borderRadius: "12px", padding: "24px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                      <div>
                        <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "12px", color: s.color, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                          {s.year}
                        </div>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 700, marginTop: "4px" }}>
                          {s.icon} {s.title}
                        </h3>
                      </div>
                      <div style={{ background: `${s.color}20`, border: `1px solid ${s.color}40`, borderRadius: "8px", padding: "6px 14px", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 700, fontSize: "13px", color: s.color }}>
                        {s.stat}
                      </div>
                    </div>
                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#94a3b8", lineHeight: 1.7, marginTop: "12px" }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Causes */}
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 900, marginTop: "48px", marginBottom: "24px" }}>
              Why Does <span style={{ color: "#f59e0b" }}>Sylhet Flood?</span>
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              {causes.map((c, i) => (
                <div key={i} className="card" style={{
                  background: "rgba(15,23,42,0.8)", border: `1px solid ${c.color}25`,
                  borderRadius: "12px", padding: "20px",
                }}>
                  <div style={{ fontSize: "32px", marginBottom: "10px" }}>{c.icon}</div>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700, color: c.color, marginBottom: "8px" }}>{c.title}</h4>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", color: "#64748b", lineHeight: 1.6, marginBottom: "12px" }}>{c.detail}</p>
                  <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "12px", color: "#10b981", background: "rgba(16,185,129,0.1)", borderRadius: "6px", padding: "6px 10px" }}>
                    ✅ {c.solution}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DATA */}
        {activeSection === "data" && (
          <div className="section-enter" style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "42px", fontWeight: 900, marginBottom: "8px" }}>
              Sylhet <span style={{ color: "#38bdf8" }}>Climate Data</span>
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#64748b", marginBottom: "40px" }}>
              20 years of rainfall, flood frequency, and displacement — visualized.
            </p>

            <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(56,189,248,0.15)", borderRadius: "16px", padding: "28px", marginBottom: "24px" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", marginBottom: "20px", color: "#38bdf8" }}>📈 Annual Rainfall (mm)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={rainfallData}>
                  <defs>
                    <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" stroke="#475569" tick={{ fontFamily: "Source Sans 3", fontSize: 12 }} />
                  <YAxis stroke="#475569" tick={{ fontFamily: "Source Sans 3", fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(56,189,248,0.3)", borderRadius: "8px", fontFamily: "Source Sans 3" }} />
                  <Area type="monotone" dataKey="rainfall" stroke="#38bdf8" strokeWidth={2} fill="url(#rg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: "16px", padding: "24px" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", marginBottom: "16px", color: "#f97316" }}>🌊 Flood Events per Year</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={rainfallData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="year" stroke="#475569" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#475569" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(249,115,22,0.3)", borderRadius: "8px" }} />
                    <Bar dataKey="floods" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "16px", padding: "24px" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", marginBottom: "16px", color: "#ef4444" }}>👥 Millions Affected</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={rainfallData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="year" stroke="#475569" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#475569" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px" }} />
                    <Line type="monotone" dataKey="affected" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ marginTop: "24px", background: "rgba(56,189,248,0.05)", border: "1px solid rgba(56,189,248,0.15)", borderRadius: "12px", padding: "16px 20px", fontFamily: "'Source Sans 3', sans-serif", fontSize: "14px", color: "#64748b", lineHeight: 1.6 }}>
              📌 <strong style={{ color: "#38bdf8" }}>Key Insight:</strong> Between 2004 and 2024, annual rainfall increased by <strong style={{ color: "white" }}>62%</strong>, flood events tripled, and the number of people affected grew by <strong style={{ color: "#ef4444" }}>5× (1.2M → 6.25M)</strong>.
            </div>
          </div>
        )}

        {/* EARLY WARNING SIMULATOR */}
        {activeSection === "warning" && (
          <div className="section-enter" style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "42px", fontWeight: 900, marginBottom: "8px" }}>
              Flood <span style={{ color: "#38bdf8" }}>Early Warning</span> Simulator
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#64748b", marginBottom: "40px" }}>
              Adjust rainfall levels to see how Sylhet's flood risk changes in real time.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              {/* Controls */}
              <div>
                <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(56,189,248,0.15)", borderRadius: "16px", padding: "28px", marginBottom: "16px" }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", marginBottom: "24px", color: "#38bdf8" }}>⚙️ Input Parameters</h3>

                  <div style={{ marginBottom: "28px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                      <label style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "14px", color: "#94a3b8" }}>🌧 Sylhet Rainfall (mm)</label>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700, color: "#38bdf8" }}>{rainfall}mm</span>
                    </div>
                    <input type="range" min={0} max={700} value={rainfall} onChange={e => setRainfall(+e.target.value)}
                      className="slider slider-blue" style={{ "--val": `${(rainfall / 700) * 100}%` }} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Source Sans 3', sans-serif", fontSize: "11px", color: "#334155", marginTop: "4px" }}>
                      <span>0mm</span><span>Normal (400mm)</span><span>700mm</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                      <label style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "14px", color: "#94a3b8" }}>☁️ Meghalaya Rainfall (mm)</label>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700, color: "#14b8a6" }}>{meghalaya}mm</span>
                    </div>
                    <input type="range" min={0} max={300} value={meghalaya} onChange={e => setMeghalaya(+e.target.value)}
                      className="slider slider-teal" style={{ "--tval": `${(meghalaya / 300) * 100}%` }} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Source Sans 3', sans-serif", fontSize: "11px", color: "#334155", marginTop: "4px" }}>
                      <span>0mm</span><span>Trigger (200mm)</span><span>300mm</span>
                    </div>
                  </div>
                </div>

                {/* Alert */}
                <div style={{
                  background: alertLevel.bg, border: `1px solid ${alertLevel.color}40`,
                  borderLeft: `5px solid ${alertLevel.color}`,
                  borderRadius: "12px", padding: "20px",
                  animation: alertLevel.label.includes("DANGER") ? "pulse-ring 1s infinite" : "none",
                }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 900, color: alertLevel.color }}>
                    {alertLevel.label}
                  </div>
                  <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", color: "#94a3b8", marginTop: "6px" }}>
                    Combined flood index: <strong style={{ color: "white" }}>{Math.min(floodLevel, 999).toFixed(0)}</strong>
                  </div>
                  <div style={{ marginTop: "12px", background: "rgba(0,0,0,0.3)", borderRadius: "6px", height: "8px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: "6px",
                      width: `${Math.min(100, (floodLevel / 1000) * 100)}%`,
                      background: `linear-gradient(90deg, #10b981, ${alertLevel.color})`,
                      transition: "width 0.3s, background 0.3s",
                    }} />
                  </div>
                </div>

                <div style={{ marginTop: "16px", background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "16px" }}>
                  <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", color: "#64748b", lineHeight: 1.7 }}>
                    {floodLevel > 800 ? "🚨 Evacuate low-lying areas. Emergency response required. Rivers at critical levels." :
                     floodLevel > 500 ? "⚠️ Flood barriers deployed. Avoid riverside areas. Monitor Surma River level hourly." :
                     floodLevel > 300 ? "👁 Alert issued. Haor communities should prepare. Monitor Meghalaya upstream data." :
                     "✅ Normal conditions. Continue monitoring. No immediate action required."}
                  </div>
                </div>
              </div>

              {/* Map */}
              <div>
                <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(56,189,248,0.15)", borderRadius: "16px", padding: "20px", height: "100%" }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", marginBottom: "16px", color: "#38bdf8" }}>🗺️ Live Risk Map</h3>
                  <div style={{ height: "300px" }}>
                    <FloodMap level={Math.min(floodLevel / 10, 100)} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "12px" }}>
                    {[["🟦", "Safe (<30%)", "#1d4ed8"], ["🟨", "Watch (30-60%)", "#f59e0b"], ["🟧", "Warning (60-80%)", "#f97316"], ["🟥", "Danger (>80%)", "#dc2626"]].map(([icon, label, color], i) => (
                      <div key={i} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "11px", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}>
                        <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: color, flexShrink: 0 }} />
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SOLUTIONS */}
        {activeSection === "solutions" && (
          <div className="section-enter" style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "42px", fontWeight: 900, marginBottom: "8px" }}>
              Sustainable <span style={{ color: "#10b981" }}>Solutions</span>
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#64748b", marginBottom: "40px" }}>
              Practical, eco-friendly innovations that can protect Sylhet's people and nature.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
              {[
                {
                  icon: "🌿", title: "Floating Baira Gardens",
                  cat: "Eco-Agriculture", color: "#10b981",
                  desc: "Traditional Sylheti floating gardens — crops grown on water hyacinth rafts that rise with floodwaters. Zero land needed, flood-proof, and completely sustainable.",
                  tags: ["Zero-waste", "Flood-resilient", "Traditional wisdom"],
                },
                {
                  icon: "💧", title: "Rainwater Harvesting",
                  cat: "Water Purification", color: "#38bdf8",
                  desc: "Low-cost rooftop collection systems using bamboo gutters + clay pot filtration. Each unit provides 40L/day of clean drinking water for one family.",
                  tags: ["Low-tech", "Local materials", "Affordable"],
                },
                {
                  icon: "🌱", title: "Riparian Buffer Zones",
                  cat: "Ecosystem Restoration", color: "#84cc16",
                  desc: "Replanting native trees along the Surma riverbank to reduce erosion, slow floodwater, and restore fish habitats — a natural flood barrier.",
                  tags: ["Carbon capture", "Biodiversity", "Flood control"],
                },
                {
                  icon: "📡", title: "IoT Flood Sensor Network",
                  cat: "Tech Innovation", color: "#818cf8",
                  desc: "Arduino-based water level sensors installed at 10 key points. SMS alerts sent to 50,000+ households 6 hours before predicted flooding.",
                  tags: ["Early warning", "Open source", "Community-built"],
                },
                {
                  icon: "🏘️", title: "Amphibious Housing",
                  cat: "Resilient Infrastructure", color: "#f59e0b",
                  desc: "Homes built on buoyant foundations that float during floods and rest on ground during dry seasons — inspired by traditional stilt houses of the haors.",
                  tags: ["Climate adaptation", "Low-cost", "Local design"],
                },
                {
                  icon: "♻️", title: "Flood Debris Composting",
                  cat: "Waste-to-Resource", color: "#f97316",
                  desc: "Converting flood-deposited organic waste and water hyacinth into rich compost fertilizer for haor farming — closing the waste loop completely.",
                  tags: ["Zero-waste", "Circular economy", "Soil health"],
                },
              ].map((s, i) => (
                <div key={i} className="card" style={{
                  background: "rgba(15,23,42,0.8)", border: `1px solid ${s.color}20`,
                  borderTop: `3px solid ${s.color}`, borderRadius: "16px", padding: "24px",
                }}>
                  <div style={{ fontSize: "36px", marginBottom: "12px" }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "11px", color: s.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>
                    {s.cat}
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700, marginBottom: "10px" }}>{s.title}</h3>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", color: "#64748b", lineHeight: 1.7, marginBottom: "14px" }}>{s.desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {s.tags.map((t, j) => (
                      <span key={j} style={{
                        fontFamily: "'Source Sans 3', sans-serif", fontSize: "11px",
                        background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}30`,
                        borderRadius: "4px", padding: "2px 8px",
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* SDG alignment */}
            <div style={{ marginTop: "40px", background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "28px" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 700, marginBottom: "16px" }}>
                🌐 UN Sustainable Development Goals Alignment
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {[
                  ["SDG 2", "Zero Hunger", "#f59e0b"],
                  ["SDG 6", "Clean Water", "#38bdf8"],
                  ["SDG 11", "Sustainable Cities", "#6366f1"],
                  ["SDG 13", "Climate Action", "#10b981"],
                  ["SDG 15", "Life on Land", "#84cc16"],
                ].map(([code, label, color]) => (
                  <div key={code} style={{
                    background: `${color}15`, border: `1px solid ${color}30`,
                    borderRadius: "8px", padding: "10px 16px",
                    fontFamily: "'Source Sans 3', sans-serif",
                  }}>
                    <div style={{ fontSize: "11px", color: color, fontWeight: 700 }}>{code}</div>
                    <div style={{ fontSize: "13px", color: "#94a3b8" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{
          borderTop: "1px solid rgba(255,255,255,0.05)", padding: "24px",
          textAlign: "center", fontFamily: "'Source Sans 3', sans-serif",
          fontSize: "12px", color: "#334155",
        }}>
          SylhetStories — Sustainable Project Exhibition | Data: NASA, BMD, UNICEF Bangladesh | Built for climate awareness
        </footer>
      </div>
    </div>
  );
}
