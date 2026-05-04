import React, { useState } from 'react';

const defaultTheme = { pageBg:'#1D2226', cardBg:'#1B1F23', inputBg:'#283039', border:'#38434F', textPrimary:'#E7E9EA', textMuted:'#B0B7BF', accent:'#0A66C2', accentHover:'#004182', accentLight:'#70B5F9', success:'#057642', warning:'#F5C518', error:'#CC1016' };

export default function BeginnerFlow({ onNext, onBack, trackId, theme = defaultTheme }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);

  const trackInfo = {
    frontend: {
      title: 'Frontend Development',
      icon: '🎨'
    },
    backend: {
      title: 'Backend Development', 
      icon: '⚙️'
    },
    ai: {
      title: 'AI & Machine Learning',
      icon: '🤖'
    },
    mobile: {
      title: 'Mobile Development',
      icon: '📱'
    },
    game: {
      title: 'Game Development',
      icon: '🎮'
    },
    cybersecurity: {
      title: 'Cybersecurity',
      icon: '🔐'
    }
  };

  const questions = [
    {
      question: `What excites you most about ${trackInfo[trackId]?.title || 'this field'}?`,
      options: [
        'Creating things people will use every day',
        'Solving complex technical problems',
        'Building something from scratch',
        'Making a good living with my skills',
        'Being part of the tech community',
        'Always learning new things'
      ]
    },
    {
      question: 'How do you imagine yourself working?',
      options: [
        'In an office with a team',
        'Remote from home',
        'Freelance on different projects',
        'Starting my own company',
        'For a big tech company',
        'Flexible - I\'m open to anything'
      ]
    },
    {
      question: 'What would you be proudest to build?',
      options: [
        'A popular app thousands use',
        'A system that runs smoothly behind the scenes',
        'Something that helps people solve real problems',
        'A beautiful, user-friendly website',
        'A cutting-edge AI tool',
        'Something that pushes technical boundaries'
      ]
    },
    {
      question: 'How do you like to learn new things?',
      options: [
        'Step by step with clear guidance',
        'Jump in and learn by doing',
        'Watching others then trying myself',
        'Reading documentation and examples',
        'Building projects that interest me',
        'With a mentor or teacher'
      ]
    }
  ];

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // All questions answered, move to result
      onNext({
        experienceLevel: 'beginner',
        trackId,
        answers: newAnswers,
        level: 'beginner'
      });
    }
  };

  const optionStyle = {
    background: theme.cardBg,
    border: `1px solid ${theme.border}`,
    borderRadius: '16px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'left',
    backdropFilter: 'blur(10px)',
    fontSize: '16px',
    color: theme.textPrimary,
    lineHeight: '1.5'
  };

  const optionHoverStyle = {
    background: theme.inputBg,
    borderColor: theme.accent,
    transform: 'translateY(-2px)'
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
        
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>
          {trackInfo[trackId]?.icon}
        </div>
        
        <h1 style={{
          fontSize: 'clamp(24px, 4vw, 32px)',
          fontWeight: '900',
          marginBottom: '16px',
          letterSpacing: '-0.5px',
          lineHeight: '1.2'
        }}>
          Let's confirm {trackInfo[trackId]?.title} is right for you
        </h1>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '40px'
        }}>
          {questions.map((_, index) => (
            <div
              key={index}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: index <= currentQuestion ? theme.accent : theme.border,
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
        
        <p style={{
          fontSize: '20px',
          color: theme.textMuted,
          maxWidth: '500px',
          margin: '0 auto',
          lineHeight: '1.6',
          fontWeight: '600'
        }}>
          {questions[currentQuestion].question}
        </p>
      </div>

      {/* Options */}
      <div style={{
        flex: 1,
        padding: '0 20px 60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          maxWidth: '600px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {questions[currentQuestion].options.map((option, index) => (
            <div
              key={index}
              style={optionStyle}
              onClick={() => handleAnswer(option)}
              onMouseEnter={e => {
                Object.assign(e.currentTarget.style, optionHoverStyle);
              }}
              onMouseLeave={e => {
                Object.assign(e.currentTarget.style, optionStyle);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
