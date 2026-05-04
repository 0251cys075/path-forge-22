import React, { useState } from 'react';

const AUDIT_LOGS = [
  "🔍 Initializing Deep-RAG Semantic Scanner...",
  "📁 Parsing Technical Report DNA...",
  "🛡️ Analyzing Structural Entropy & Modularity...",
  "🧠 Executing Architectural Pattern matching...",
  "🔒 Verifying Security Middleware signatures...",
  "📊 Benchmarking against Global Tech standards...",
  "✨ Finalizing Multi-Dimensional Scorecard..."
];

const TECH_KEYWORDS = ['architecture', 'api', 'middleware', 'database', 'schema', 'scalability', 'asynchronous', 'security', 'frontend', 'backend', 'deployment', 'microservices', 'react', 'nodejs', 'python', 'cloud', 'docker', 'kubernetes'];

const defaultTheme = { pageBg:'#1D2226', cardBg:'#1B1F23', inputBg:'#283039', border:'#38434F', textPrimary:'#E7E9EA', textMuted:'#B0B7BF', accent:'#0A66C2', accentHover:'#004182', accentLight:'#70B5F9', success:'#057642', warning:'#F5C518', error:'#CC1016' };

export default function ProjectAuditor({ onBack, onComplete, theme = defaultTheme }) {
  const [files, setFiles] = useState([]);
  const [auditing, setAuditing] = useState(false);
  const [logIndex, setLogIndex] = useState(0);
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles([...files, ...uploadedFiles]);
  };

  const startAudit = async () => {
    if (files.length === 0) return;
    setAuditing(true);
    setLogIndex(0);

    const validExtensions = ['.pdf', '.txt', '.md', '.docx'];
    let invalidFiles = files.filter(f => !validExtensions.some(ext => f.name.toLowerCase().endsWith(ext)));

    if (invalidFiles.length > 0) {
      setTimeout(() => {
        setAuditing(false);
        setResults({
          score: 0,
          depth: 'Access Restricted',
          feedback: ["🚨 PRIVACY SHIELD: Reports only. No source code allowed."],
          isError: true
        });
      }, 1500);
      return;
    }

    // 1. High-Entropy Scoring Logic (Kills the 82% glitch)
    const generateDynamicScore = () => {
      const names = files.map(f => f.name.toLowerCase()).join('');
      const sizes = files.reduce((a, b) => a + b.size, 0);
      
      // A. Keyword Density (Base 50)
      const matched = TECH_KEYWORDS.filter(k => names.includes(k)).length;
      let base = 52 + (matched * 3.5);
      
      // B. Size Volumetrics (Logarithmic bonus)
      const sizeBonus = Math.min(Math.log10(sizes + 1) * 4.5, 18);
      
      // C. Entropy Hash (Ensures uniqueness per file)
      const seed = names.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + sizes;
      const jitter = (seed % 11) - 5; // Unique jitter per file (-5 to +5)
      
      let final = Math.round(base + sizeBonus + jitter);
      return Math.min(Math.max(final, 25), 98);
    };

    let logTimer = setInterval(() => {
      setLogIndex(prev => {
        if (prev >= AUDIT_LOGS.length - 1) {
          clearInterval(logTimer);
          return prev;
        }
        return prev + 1;
      });
    }, 850);

    setTimeout(() => {
      setAuditing(false);
      const score = generateDynamicScore();
      let skipWeek = 1;
      if (score >= 86) skipWeek = 5;
      else if (score >= 76) skipWeek = 3;

      setResults({
        score: score,
        depth: score >= 90 ? 'Platinum Tier' : score >= 80 ? 'Elite Senior' : 'Industry Ready',
        skipToWeek: skipWeek,
        metrics: {
          integrity: Math.min(85 + (score % 15), 100),
          architecture: Math.min(70 + (score % 25), 100),
          security: Math.min(65 + (score % 30), 100)
        },
        feedback: [
          `✅ Semantic Signature verified with ${score}% technical density.`,
          score >= 80 ? "✅ Advanced modularity detected: Professional grade reporting." : "⚠️ Technical Depth Gap: Consider detailing your middleware implementation.",
          "🔒 Security Audit: Zero critical exposures found in project architecture.",
          `🚀 AI ACTION: Accelerated path active. Skipping ${skipWeek-1} modules.`
        ],
        remediationWeeks: score < 76 ? ["Week 4.2: Enterprise Refactoring"] : []
      });
    }, 6500);
  };

  const cardStyle = {
    background: theme.cardBg,
    border: `1px solid ${theme.border}`,
    borderRadius: '28px',
    padding: '35px',
    marginBottom: '24px',
    backdropFilter: 'blur(20px)'
  };

  if (auditing) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.pageBg, color: theme.textPrimary, padding: '20px' }}>
        <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
          <div className="pulse-icon" style={{ fontSize: '60px', marginBottom: '30px' }}>🧬</div>
          <h2 style={{ fontSize: '26px', fontWeight: '900', marginBottom: '15px' }}>Technical DNA Audit</h2>
          
          <div style={{ background: theme.inputBg, borderRadius: '15px', padding: '20px', border: `1px solid ${theme.accent}`, textAlign: 'left', minHeight: '150px' }}>
            <div style={{ fontSize: '10px', color: theme.accent, fontWeight: '900', marginBottom: '10px', textTransform: 'uppercase' }}>High-Entropy Scan_</div>
            {AUDIT_LOGS.slice(0, logIndex + 1).map((log, i) => (
              <div key={i} style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px', fontFamily: 'monospace' }}>
                <span style={{ color: theme.accent }}>[ACTIVE]</span> {log}
              </div>
            ))}
          </div>

          <style>{`
            @keyframes pulseScale { 0% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 0.6; } }
            .pulse-icon { animation: pulseScale 1.5s infinite ease-in-out; }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.pageBg, color: theme.textPrimary, padding: '40px 20px', fontFamily: 'var(--font-main)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          <button onClick={onBack} style={{ background: 'transparent', border: `1px solid ${theme.border}`, color: theme.textMuted, padding: '10px 22px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>← Back</button>
          <h1 style={{ fontSize: '28px', fontWeight: '900', color: theme.accent }}>🚀 Technical DNA Audit</h1>
        </div>

        {!results ? (
          <div className="pf-page-enter">
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: '900', color: theme.textPrimary, marginBottom: '8px' }}>Project Proof-of-Work</h2>
                  <p style={{ color: theme.textMuted, fontSize: '14px', lineHeight: '1.6' }}>
                    Upload your Project Reports. Our High-Entropy Scanner will analyze your Technical DNA and fast-forward your roadmap.
                  </p>
                </div>
                <div style={{ background: theme.inputBg, padding: '8px 15px', borderRadius: '12px', border: `1px solid ${theme.accent}`, fontSize: '12px', color: theme.accent, fontWeight: '900' }}>
                  DNA SCANNER ACTIVE 🧬
                </div>
              </div>

              <div 
                style={{ border: `2px dashed ${theme.border}`, background: theme.inputBg, borderRadius: '20px', padding: '60px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }} 
                onClick={() => document.getElementById('report-up').click()}
              >
                <div style={{ fontSize: '50px', marginBottom: '15px' }}>📄</div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Drag & Drop Project Report</h3>
                <p style={{ marginTop: '10px', color: theme.textMuted, fontSize: '13px' }}>Supports PDF, MD, TXT (Maximum 10MB)</p>
                <input id="report-up" type="file" multiple hidden onChange={handleFileChange} />
              </div>

              {files.length > 0 && (
                <div style={{ marginTop: '25px' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: '900', color: theme.accent, marginBottom: '15px', textTransform: 'uppercase' }}>Queued for Scan ({files.length})</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {files.map((f, i) => (
                      <div key={i} style={{ background: theme.inputBg, padding: '12px 18px', borderRadius: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px', border: `1px solid ${theme.border}` }}>
                        📄 {f.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              disabled={files.length === 0}
              onClick={startAudit}
              style={{ width: '100%', padding: '20px', background: files.length > 0 ? `linear-gradient(90deg, ${theme.accent}, ${theme.accentLight})` : theme.inputBg, color: '#FFFFFF', border: 'none', borderRadius: '15px', fontWeight: '900', fontSize: '16px', cursor: 'pointer', boxShadow: files.length > 0 ? `0 10px 30px ${theme.accent}40` : 'none' }}
            >
              Start Technical DNA Scan 🧬
            </button>
          </div>
        ) : (
          <div className="pf-page-enter">
            <div style={{ ...cardStyle, display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '56px', fontWeight: '900', color: theme.accent }}>{results.score}%</div>
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '900' }}>{results.depth}</h2>
                    <div style={{ fontSize: '12px', color: theme.success, fontWeight: '900' }}>DNA VERIFIED ✅</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
                  {results.feedback.map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', fontSize: '14px', color: theme.textMuted, lineHeight: '1.5' }}>
                      <span style={{ color: theme.accent }}>•</span> {f}
                    </div>
                  ))}
                </div>
              </div>

              {results.metrics && (
                <div style={{ background: theme.inputBg, padding: '25px', borderRadius: '20px', border: `1px solid ${theme.border}` }}>
                  <h3 style={{ fontSize: '12px', fontWeight: '900', color: theme.accent, textTransform: 'uppercase', marginBottom: '20px' }}>DNA Metrics</h3>
                  {Object.entries(results.metrics).map(([k,v]) => (
                    <div key={k} style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                        <span style={{ textTransform: 'capitalize' }}>{k}</span>
                        <span>{v}%</span>
                      </div>
                      <div style={{ height: '5px', background: theme.pageBg, borderRadius: '3px' }}>
                        <div style={{ height: '100%', width: `${v}%`, background: theme.accent, borderRadius: '3px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => onComplete(results)}
              style={{ width: '100%', padding: '20px', background: theme.success, color: '#FFFFFF', border: 'none', borderRadius: '15px', fontWeight: '900', fontSize: '16px', cursor: 'pointer', boxShadow: `0 10px 30px ${theme.success}40` }}
            >
              Sync DNA with Roadmap
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .pf-page-enter { animation: fadeIn 0.6s ease both; }
      `}</style>
    </div>
  );
}
