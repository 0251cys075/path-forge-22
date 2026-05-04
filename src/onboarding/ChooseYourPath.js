import React from 'react';

const defaultTheme = { pageBg:'#1D2226', cardBg:'#1B1F23', inputBg:'#283039', border:'#38434F', textPrimary:'#E7E9EA', textMuted:'#B0B7BF', accent:'#0A66C2', accentHover:'#004182', accentLight:'#70B5F9', success:'#057642', warning:'#F5C518', error:'#CC1016' };

export default function ChooseYourPath({ onNext, onBack, theme = defaultTheme }) {
  const cardStyle = {
    background: theme.cardBg,
    border: `1px solid ${theme.border}`,
    borderRadius: '24px',
    padding: '40px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
    position: 'relative',
    overflow: 'hidden'
  };

  const cardHoverStyle = {
    transform: 'translateY(-8px)',
    background: theme.accent + '1A',
    borderColor: theme.accent + '4D'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.pageBg,
      color: theme.textPrimary,
      fontFamily: 'var(--font-main)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 1
    }}>
      {/* Header */}
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        {onBack && (
          <button 
            onClick={onBack}
            style={{
              background: theme.inputBg,
              color: theme.textMuted,
              border: `1px solid ${theme.border}`,
              padding: '10px 20px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '30px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = theme.textPrimary;
              e.currentTarget.style.background = theme.cardBg;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = theme.textMuted;
              e.currentTarget.style.background = theme.inputBg;
            }}
          >
            ← Back
          </button>
        )}
        
        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 48px)',
          fontWeight: '900',
          marginBottom: '16px',
          letterSpacing: '-0.5px',
          lineHeight: '1.2'
        }}>
          Choose Your <span style={{ color: theme.accent }}>Path</span>
        </h1>
        
        <p style={{
          fontSize: '18px',
          color: theme.textMuted,
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Tell us about your experience level so we can create the perfect learning journey for you.
        </p>
      </div>

      {/* Cards Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 20px 60px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          maxWidth: '800px',
          width: '100%'
        }}>
          {/* Beginner Card */}
          <div
            style={cardStyle}
            onClick={() => onNext('beginner')}
            onMouseEnter={e => {
              Object.assign(e.currentTarget.style, cardHoverStyle);
            }}
            onMouseLeave={e => {
              Object.assign(e.currentTarget.style, cardStyle);
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🌱</div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '800',
              marginBottom: '12px',
              color: theme.accent
            }}>
              I am a Beginner
            </h2>
            <p style={{
              fontSize: '16px',
              color: theme.textMuted,
              lineHeight: '1.5',
              margin: 0
            }}>
              Never coded before or just starting out
            </p>
          </div>

          {/* Experienced Card */}
          <div
            style={cardStyle}
            onClick={() => onNext('experienced')}
            onMouseEnter={e => {
              Object.assign(e.currentTarget.style, cardHoverStyle);
            }}
            onMouseLeave={e => {
              Object.assign(e.currentTarget.style, cardStyle);
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>⚡</div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '800',
              marginBottom: '12px',
              color: theme.accentLight
            }}>
              I Know Something
            </h2>
            <p style={{
              fontSize: '16px',
              color: theme.textMuted,
              lineHeight: '1.5',
              margin: 0
            }}>
              Already have some skills and experience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
