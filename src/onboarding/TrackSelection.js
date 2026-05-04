import React from 'react';

const TRACKS = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    icon: '🎨',
    description: 'Build beautiful user interfaces and web applications',
    color: '#0A66C2',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'UI/UX'],
    examples: 'Websites, web apps, mobile interfaces, dashboards'
  },
  {
    id: 'backend',
    title: 'Backend Development',
    icon: '⚙️',
    description: 'Create powerful server-side applications and APIs',
    color: '#3498DB',
    skills: ['Node.js', 'Python', 'Databases', 'APIs', 'Cloud'],
    examples: 'Server logic, databases, APIs, cloud services'
  },
  {
    id: 'ai',
    title: 'Artificial Intelligence',
    icon: '🤖',
    description: 'Build intelligent systems and machine learning models',
    color: '#9B59B6',
    skills: ['Python', 'Machine Learning', 'Deep Learning', 'NLP', 'Data Science'],
    examples: 'Chatbots, prediction models, computer vision, NLP'
  },
  {
    id: 'data',
    title: 'Data Science',
    icon: '📊',
    description: 'Analyze data and create meaningful insights',
    color: '#057642',
    skills: ['Python', 'Statistics', 'SQL', 'Visualization', 'Analytics'],
    examples: 'Data analysis, reports, dashboards, predictions'
  },
  {
    id: 'mobile',
    title: 'Mobile Development',
    icon: '📱',
    description: 'Create amazing mobile applications',
    color: '#F5C518',
    skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Mobile UI'],
    examples: 'iOS apps, Android apps, cross-platform apps'
  },
  {
    id: 'cyber',
    title: 'Cyber Security',
    icon: '🔒',
    description: 'Protect systems and data from cyber threats',
    color: '#CC1016',
    skills: ['Network Security', 'Ethical Hacking', 'Cryptography', 'Risk Assessment'],
    examples: 'Security testing, vulnerability assessment, protection systems'
  }
];

const defaultTheme = { pageBg:'#1D2226', cardBg:'#1B1F23', inputBg:'#283039', border:'#38434F', textPrimary:'#E7E9EA', textMuted:'#B0B7BF', accent:'#0A66C2', accentHover:'#004182', accentLight:'#70B5F9', success:'#057642', warning:'#F5C518', error:'#CC1016' };

export default function TrackSelection({ onNext, onBack, experienceLevel, theme = defaultTheme }) {
  const cardStyle = {
    background: theme.cardBg,
    border: `1px solid ${theme.border}`,
    borderRadius: '20px',
    padding: '24px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'left',
    position: 'relative',
    overflow: 'hidden'
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
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '20px',
              transition: 'all 0.3s ease'
            }}
          >
            ← Back
          </button>
        )}
        <h1 style={{
          fontSize: '36px',
          fontWeight: '800',
          marginBottom: '12px',
          background: 'linear-gradient(135deg, #0A66C2, #F5C518)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Choose Your Career Path
        </h1>
        <p style={{
          fontSize: '18px',
          color: theme.textMuted,
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Select the field that interests you most. We'll create a personalized learning journey based on your choice.
        </p>
      </div>

      {/* Track Cards */}
      <div style={{
        flex: 1,
        padding: '0 20px 40px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {TRACKS.map(track => (
            <div
              key={track.id}
              onClick={() => onNext(track.id)}
              style={cardStyle}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.background = `${track.color}15`;
                e.currentTarget.style.borderColor = `${track.color}40`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = theme.cardBg;
                e.currentTarget.style.borderColor = theme.border;
              }}
            >
              {/* Icon and Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{
                  fontSize: '32px',
                  background: `${track.color}20`,
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {track.icon}
                </div>
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    margin: 0,
                    color: track.color
                  }}>
                    {track.title}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p style={{
                fontSize: '14px',
                color: theme.textMuted,
                lineHeight: '1.5',
                margin: '0 0 16px 0'
              }}>
                {track.description}
              </p>

              {/* Skills */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '12px',
                  color: theme.textMuted,
                  marginBottom: '8px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Key Skills
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {track.skills.slice(0, 3).map(skill => (
                    <span key={skill} style={{
                      background: `${track.color}15`,
                      color: track.color,
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      {skill}
                    </span>
                  ))}
                  {track.skills.length > 3 && (
                    <span style={{
                      background: theme.inputBg,
                      color: theme.textMuted,
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      +{track.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Examples */}
              <div>
                <div style={{
                  fontSize: '12px',
                  color: theme.textMuted,
                  marginBottom: '6px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  What You'll Build
                </div>
                <div style={{
                  fontSize: '13px',
                  color: theme.textMuted,
                  fontStyle: 'italic'
                }}>
                  {track.examples}
                </div>
              </div>

              {/* Arrow indicator */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                fontSize: '20px',
                color: track.color,
                opacity: 0.7
              }}>
                →
              </div>
            </div>
          ))}
        </div>

        {/* Help Text */}
        <div style={{
          textAlign: 'center',
          marginTop: '32px',
          padding: '20px',
          background: theme.cardBg,
          borderRadius: '16px',
          border: `1px solid ${theme.border}`
        }}>
          <div style={{ fontSize: '16px', color: theme.textPrimary, marginBottom: '8px' }}>
            💡 Not sure which to choose?
          </div>
          <div style={{ fontSize: '14px', color: theme.textMuted }}>
            Don't worry! You can always switch paths later. Pick what sounds most interesting right now.
          </div>
        </div>
      </div>
    </div>
  );
}
