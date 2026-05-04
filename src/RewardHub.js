import React, { useState } from 'react';

const defaultTheme = { pageBg:'#1D2226', cardBg:'#1B1F23', inputBg:'#283039', border:'#38434F', textPrimary:'#E7E9EA', textMuted:'#B0B7BF', accent:'#0A66C2', accentHover:'#004182', accentLight:'#70B5F9', success:'#057642', warning:'#F5C518', error:'#CC1016' };

export default function RewardHub({ userData, onBack, theme = defaultTheme }) {
  const [redeeming, setRedeeming] = useState(false);
  const [showSandbox, setShowSandbox] = useState(false);
  
  // Calculate tokens from scores and modules
  const projectScore = userData?.projectAuditScore || 0;
  const modulesDone = userData?.learningProgress?.completedCount || 0;
  const totalTokens = Math.floor(projectScore / 10) + (modulesDone * 5);
  const tokensUsed = userData?.tokensUsed || 0;
  const availableTokens = totalTokens - tokensUsed;

  const handleRedeem = () => {
    if (availableTokens < 10) return;
    setRedeeming(true);
    setTimeout(() => {
      setRedeeming(false);
      setShowSandbox(true);
    }, 2000);
  };

  const cardStyle = {
    background: theme.cardBg,
    border: `1px solid ${theme.border}`,
    borderRadius: '24px',
    padding: '30px',
    textAlign: 'center',
    backdropFilter: 'blur(10px)'
  };

  if (showSandbox) {
    return (
      <div style={{ minHeight: '100vh', background: theme.pageBg, color: theme.textPrimary, padding: '40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '24px', color: theme.accent }}>💎 Gemini Pro Premium Sandbox</h1>
            <button onClick={() => setShowSandbox(false)} style={{ background: 'transparent', border: `1px solid ${theme.border}`, color: theme.textMuted, padding: '8px 16px', borderRadius: '20px' }}>Exit Sandbox</button>
          </div>
          <div style={{ height: '500px', background: theme.cardBg, borderRadius: '20px', border: `1px solid ${theme.accent}`, padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, color: theme.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div>
                <div style={{ fontSize: '40px', marginBottom: '10px', textAlign: 'center' }}>✨</div>
                <p>Welcome to the Premium Sandbox. Your Gemini Pro access is active for 24 hours.</p>
                <p style={{ fontSize: '12px' }}>Ask advanced architectural questions or request deep code refactoring.</p>
              </div>
            </div>
            <input placeholder="Ask Gemini Pro anything..." style={{ width: '100%', padding: '16px', borderRadius: '12px', border: `1px solid ${theme.border}`, background: theme.inputBg, color: theme.textPrimary }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.pageBg, color: theme.textPrimary, padding: '60px 20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          <button onClick={onBack} style={{ background: 'transparent', border: `1px solid ${theme.border}`, color: theme.textMuted, padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' }}>← Back</button>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>🏆 Reward Hub</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div>
            <div style={{ ...cardStyle, background: theme.inputBg, border: `1px solid ${theme.accent}`, marginBottom: '30px' }}>
              <div style={{ fontSize: '14px', color: theme.accent, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px' }}>Available PathTokens</div>
              <div style={{ fontSize: '64px', fontWeight: '900', color: theme.textPrimary }}>{availableTokens}</div>
              <p style={{ color: theme.textMuted, fontSize: '13px' }}>Earned from Project Audits & Learning Modules</p>
            </div>

            <div style={cardStyle}>
              <h3 style={{ fontSize: '18px', marginBottom: '20px', textAlign: 'left' }}>Unlock Premium Rewards</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: theme.inputBg, borderRadius: '16px', border: `1px solid ${theme.border}`, marginBottom: '12px' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>✨ Gemini Pro Access (24h)</div>
                  <div style={{ fontSize: '12px', color: theme.textMuted }}>Advanced AI coding assistant</div>
                </div>
                <button 
                  onClick={handleRedeem}
                  disabled={availableTokens < 10 || redeeming}
                  style={{ background: availableTokens >= 10 ? theme.accent : theme.inputBg, color: availableTokens >= 10 ? '#FFFFFF' : theme.textMuted, border: 'none', padding: '8px 16px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {redeeming ? 'Unlocking...' : '10 Tokens'}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: theme.inputBg, borderRadius: '16px', border: `1px solid ${theme.border}`, opacity: 0.6 }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>💼 Priority Shortlist</div>
                  <div style={{ fontSize: '12px', color: theme.textMuted }}>Direct referral to partner companies</div>
                </div>
                <button disabled style={{ background: theme.inputBg, color: theme.textMuted, border: 'none', padding: '8px 16px', borderRadius: '12px', fontWeight: 'bold' }}>50 Tokens</button>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontSize: '18px', marginBottom: '20px', textAlign: 'left' }}>How to earn tokens?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { activity: "Complete a Learning Module", reward: "+5 Tokens", icon: "📘" },
                { activity: "High-Depth Project Audit", reward: "+10-15 Tokens", icon: "🚀" },
                { activity: "Pass Industry Assessment", reward: "+20 Tokens", icon: "🎯" },
                { activity: "Help others in Community", reward: "+2 Tokens", icon: "🤝" }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: theme.inputBg, borderRadius: '12px' }}>
                  <div style={{ fontSize: '24px' }}>{item.icon}</div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600' }}>{item.activity}</div>
                    <div style={{ fontSize: '12px', color: theme.accent }}>{item.reward}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
