import React from 'react';

const TRACKS = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    icon: '🎨',
    description: 'Build beautiful user interfaces and web applications',
    color: '#FF6B35',
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
    color: '#2ECC71',
    skills: ['Python', 'Statistics', 'SQL', 'Visualization', 'Analytics'],
    examples: 'Data analysis, reports, dashboards, predictions'
  },
  {
    id: 'mobile',
    title: 'Mobile Development',
    icon: '📱',
    description: 'Create amazing mobile applications',
    color: '#F39C12',
    skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Mobile UI'],
    examples: 'iOS apps, Android apps, cross-platform apps'
  },
  {
    id: 'cyber',
    title: 'Cyber Security',
    icon: '🔒',
    description: 'Protect systems and data from cyber threats',
    color: '#E74C3C',
    skills: ['Network Security', 'Ethical Hacking', 'Cryptography', 'Risk Assessment'],
    examples: 'Security testing, vulnerability assessment, protection systems'
  }
];

export default function TrackSelection({ onNext, onBack, experienceLevel }) {
  const cardStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
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
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      color: 'white',
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
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.1)',
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
          background: 'linear-gradient(135deg, #FF6B35, #F39C12)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Choose Your Career Path
        </h1>
        <p style={{
          fontSize: '18px',
          color: 'rgba(255,255,255,0.7)',
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
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
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
                color: 'rgba(255,255,255,0.7)',
                lineHeight: '1.5',
                margin: '0 0 16px 0'
              }}>
                {track.description}
              </p>

              {/* Skills */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.5)',
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
                      background: 'rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.5)',
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
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: '6px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  What You'll Build
                </div>
                <div style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.6)',
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
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
            💡 Not sure which to choose?
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
            Don't worry! You can always switch paths later. Pick what sounds most interesting right now.
          </div>
        </div>
      </div>
    </div>
  );
}
