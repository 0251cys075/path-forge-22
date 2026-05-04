import React, { useState } from 'react';

const defaultTheme = { pageBg:'#1D2226', cardBg:'#1B1F23', inputBg:'#283039', border:'#38434F', textPrimary:'#E7E9EA', textMuted:'#B0B7BF', accent:'#0A66C2', accentHover:'#004182', accentLight:'#70B5F9', success:'#057642', warning:'#F5C518', error:'#CC1016' };

export default function IndustryDashboard({ onBack, theme = defaultTheme }) {
  const [search, setSearch] = useState('');

  // Mock data for the "Talent Marketplace"
  const candidates = [
    { id: 1, name: "Arjun Sharma", role: "Frontend Developer", score: 94, tokens: 120, skills: ["React", "TypeScript", "Tailwind"], status: "Ready to Interview", velocity: "Fast Learner" },
    { id: 2, name: "Priya Patel", role: "Data Scientist", score: 88, tokens: 95, skills: ["Python", "Pandas", "Scikit-Learn"], status: "Project Verified", velocity: "Consistent" },
    { id: 3, name: "Rahul Verma", role: "Backend Developer", score: 91, tokens: 110, skills: ["Node.js", "MongoDB", "Docker"], status: "Ready to Interview", velocity: "Fast Learner" },
    { id: 4, name: "Sneha Reddy", role: "UI/UX Designer", score: 85, tokens: 70, skills: ["Figma", "Adobe XD", "User Research"], status: "Foundations Complete", velocity: "Consistent" },
    { id: 5, name: "Vikram Singh", role: "Cyber Security", score: 92, tokens: 130, skills: ["Ethical Hacking", "Kali Linux", "Python"], status: "Top 1% Talent", velocity: "Expert Depth" },
  ];

  const filtered = candidates.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.role.toLowerCase().includes(search.toLowerCase()) ||
    c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  const cardStyle = {
    background: theme.cardBg,
    border: `1px solid ${theme.border}`,
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '16px',
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr',
    alignItems: 'center',
    transition: 'all 0.2s',
    cursor: 'pointer'
  };

  return (
    <div style={{ minHeight: '100vh', background: theme.pageBg, color: theme.textPrimary, padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>🏢 Industry Talent Dashboard</h1>
            <p style={{ color: theme.textMuted, fontSize: '14px' }}>Hire pre-vetted candidates with verified "Proof of Work" scores.</p>
          </div>
          <button onClick={onBack} style={{ background: 'transparent', border: `1px solid ${theme.border}`, color: theme.textMuted, padding: '10px 20px', borderRadius: '25px', cursor: 'pointer' }}>Exit Dashboard</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr', gap: '20px', marginBottom: '40px' }}>
          <input 
            placeholder="Search by name, role, or skill (e.g. 'React', 'Fast Learner')..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '16px 24px', borderRadius: '16px', border: `1px solid ${theme.border}`, background: theme.inputBg, color: theme.textPrimary, width: '100%', boxSizing: 'border-box' }}
          />
          <div style={{ background: theme.inputBg, border: `1px solid ${theme.accent}`, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.accent, fontWeight: 'bold' }}>
            {candidates.length} Verified Talents
          </div>
          <div style={{ background: theme.inputBg, border: `1px solid ${theme.success}`, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.success, fontWeight: 'bold' }}>
            5 Hiring Partners
          </div>
        </div>

        <div style={{ background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '20px', padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr', padding: '0 20px 16px', color: theme.textMuted, fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
            <span>Candidate</span>
            <span>Skills & Tech Stack</span>
            <span>Employability</span>
            <span>Proof Score</span>
            <span>Status</span>
          </div>

          {filtered.map((c) => (
            <div key={c.id} style={cardStyle} onMouseEnter={e => e.currentTarget.style.background=theme.inputBg} onMouseLeave={e => e.currentTarget.style.background=theme.cardBg}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: theme.inputBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{c.name}</div>
                  <div style={{ fontSize: '11px', color: theme.textMuted }}>{c.role}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {c.skills.map(s => <span key={s} style={{ fontSize: '10px', background: theme.inputBg, padding: '4px 8px', borderRadius: '6px', border: `1px solid ${theme.border}` }}>{s}</span>)}
              </div>

              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: theme.accent }}>{c.velocity}</div>
                <div style={{ fontSize: '11px', color: theme.textMuted }}>Learning Pace</div>
              </div>

              <div>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{c.score}%</div>
                <div style={{ fontSize: '11px', color: theme.textMuted }}>{c.tokens} Tokens Earned</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', background: theme.inputBg, color: c.status.includes('Top') ? theme.accent : theme.success, padding: '6px 12px', borderRadius: '12px', border: `1px solid ${c.status.includes('Top') ? theme.accent : theme.success}`, fontWeight: 'bold' }}>
                  {c.status}
                </span>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: theme.textMuted }}>
              No candidates found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
