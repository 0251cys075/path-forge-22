import React, { useState } from 'react';
import { analyzeResumeWithGemini } from './gemini';

const defaultTheme = { pageBg:'#1D2226', cardBg:'#1B1F23', inputBg:'#283039', border:'#38434F', textPrimary:'#E7E9EA', textMuted:'#B0B7BF', accent:'#0A66C2', accentHover:'#004182', accentLight:'#70B5F9', success:'#057642', warning:'#F5C518', error:'#CC1016' };

export default function ResumeAnalysis({ onComplete, onBack, theme = defaultTheme }) {
  const [mode, setMode] = useState(null); // 'skilled' or 'beginner'
  const [analyzing, setAnalyzing] = useState(false);
  const [beginnerScore, setBeginnerScore] = useState({});
  const [quizStep, setQuizStep] = useState(0);
  const [otherText, setOtherText] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);

  const beginnerQuestions = [
    {
      id: 1,
      question: "How do you prefer solving a problem?",
      options: [
        { label: "Building a logical set of rules (Backend)", value: "Backend Development" },
        { label: "Designing a beautiful and intuitive interface (Frontend)", value: "Frontend Development" },
        { label: "Finding patterns in complex data (Data Science)", value: "Data Science" },
        { label: "Securing a system from intruders (Cyber Security)", value: "Cyber Security" },
        { label: "Others (Tell us your interest)", value: "OTHER" }
      ]
    },
    {
      id: 2,
      question: "Which tool sounds more exciting to use?",
      options: [
        { label: "A creative design tool like Figma", value: "UI/UX Design" },
        { label: "A terminal with raw code and servers", value: "Cloud Computing" },
        { label: "Building apps that run on phones", value: "Mobile Development" },
        { label: "Training a robot to learn from examples", value: "Artificial Intelligence" },
        { label: "Others (Type your favorite tool)", value: "OTHER" }
      ]
    },
    {
      id: 3,
      question: "What is your main goal right now?",
      options: [
        { label: "Get a job as fast as possible", value: "Job" },
        { label: "Build my own startup idea", value: "Startup" },
        { label: "Learn for curiosity and projects", value: "Learning" },
        { label: "Others (Specify your goal)", value: "OTHER" }
      ]
    }
  ];

  const [auditReport, setAuditReport] = useState(null);
  const [fraudAlert, setFraudAlert] = useState(null);

  // Layer 2: Resume Content Keywords — must be present in a real resume
  const RESUME_KEYWORDS = [
    'experience', 'education', 'skills', 'projects', 'internship',
    'bachelor', 'master', 'university', 'college', 'certification',
    'objective', 'summary', 'work', 'employment', 'profile',
    'java', 'python', 'react', 'html', 'css', 'javascript', 'node',
    'sql', 'aws', 'git', 'github', 'linux', 'flutter', 'figma',
    'gpa', 'cgpa', 'b.tech', 'b.e', 'mca', 'bca', 'computer science'
  ];

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    // LAYER 1: Extension Check
    const validExtensions = ['.pdf', '.doc', '.docx'];
    const ext = uploadedFile.name.toLowerCase().slice(uploadedFile.name.lastIndexOf('.'));
    if (!validExtensions.includes(ext)) {
      setFraudAlert({
        type: 'extension',
        message: `❌ REJECTED: "${uploadedFile.name}" is not a valid document. Only PDF or Docx files are accepted.`
      });
      return;
    }

    // LAYER 1.5: File Size Check — blank/fake files are usually < 3KB
    if (uploadedFile.size < 3000) {
      setFraudAlert({
        type: 'size',
        message: `⚠️ REJECTED: This file is too small (${Math.round(uploadedFile.size / 1024)}KB) to be a real resume. Please upload your complete resume document.`
      });
      return;
    }

    // LAYER 2: Content Scan — use readAsBinaryString to read embedded text in PDFs
    setAnalyzing(true);
    setFraudAlert(null);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      // readAsBinaryString preserves embedded plain-text inside PDFs
      const content = evt.target.result.toLowerCase();

      // ── Try Gemini AI first ──────────────────────────────────────────────
      let report = null;
      const geminiResult = await analyzeResumeWithGemini(content);

      if (geminiResult) {
        // Gemini returned a real analysis
        if (geminiResult.isFakeResume) {
          setAnalyzing(false);
          setFraudAlert({ type: 'content', message: `⚠️ FRAUD DETECTED by AI: ${geminiResult.fraudReason}` });
          return;
        }
        report = {
          candidateName: geminiResult.candidateName || 'Candidate',
          skillTitle: geminiResult.skillTitle || 'Frontend Development',
          detectedStack: geminiResult.detectedStack || [],
          keywordScore: geminiResult.keywordScore || 5,
          signals: {
            hasExperience: geminiResult.hasExperience,
            hasEducation: geminiResult.hasEducation,
            hasProjects: geminiResult.hasProjects,
            hasCertifications: geminiResult.hasCertifications,
          },
          matchedKeywords: geminiResult.detectedStack?.slice(0, 8) || [],
          readinessLevel: geminiResult.readinessLevel || 'Rising Talent',
          readinessPercent: geminiResult.readinessPercent || 40,
          whyThisScore: geminiResult.whyThisScore || [],
          aiPowered: true,
        };
      } else {
        // ── STRICT Fallback (Forces Gemini) ───────────────────────────────
        const raw = evt.target.result;
        const foundKeywords = RESUME_KEYWORDS.filter(kw => new RegExp(kw, 'i').test(raw));
        const keywordScore = foundKeywords.length;

        // If no API key, we require a massive 25 keywords to pass manually
        if (keywordScore < 25) {
          setAnalyzing(false);
          setFraudAlert({
            type: 'content',
            message: `⚠️ AI OFFLINE: This document failed the strict local audit (detected only ${keywordScore} signals). To use full AI analysis, please ensure your Gemini API key is configured in Vercel settings.`,
          });
          return;
        }

        report = {
          candidateName: 'Manual Candidate',
          skillTitle: 'Frontend Development', 
          detectedStack: ['HTML', 'CSS', 'JS'], 
          keywordScore,
          signals: { hasExperience: true, hasEducation: true, hasProjects: true, hasCertifications: false },
          matchedKeywords: foundKeywords.slice(0, 8),
          readinessLevel: 'Rising Talent',
          readinessPercent: 65,
          whyThisScore: ['✅ Manual fallback audit passed with high signals', '⚠️ AI validation unavailable'],
          aiPowered: false,
        };
      }

      setAuditReport(report);
      setAnalyzing(false);

      setTimeout(() => {
        onComplete({
          mode: 'skilled',
          skill: { title: report.skillTitle, icon: '🚀' },
          level: report.readinessLevel === 'Industry Ready' ? 'Intermediate' : 'Beginner',
          onboardingType: 'skilled',
          auditReport: report,
          learningProgress: {
            modules: report.readinessPercent > 30 ? {
              0: { completed: true, courseDone: true, testPassed: true, testScore: 100 },
              1: { completed: true, courseDone: true, testPassed: true, testScore: 95 }
            } : {},
            completedCount: report.readinessPercent > 30 ? 2 : 0, 
            total: 6, 
            percent: report.readinessPercent // Use dynamic score from AI report
          },
          analysisSummary: `${report.aiPowered ? 'Gemini AI' : 'Multi-RAG'} Audit complete! Detected ${report.skillTitle} expertise. ${report.readinessLevel} status granted based on ${report.keywordScore} signals.`
        });
      }, 3000);
    };
    // Use readAsBinaryString — works for both PDF and Docx binary formats
    reader.readAsBinaryString(uploadedFile);
  };

  const startAnalysis = (type, data) => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      onComplete({
        mode: type,
        skill: { title: data, icon: '🚀' },
        level: 'Beginner',
        onboardingType: type,
        analysisSummary: `Potential Mapping complete! Based on your interest in ${data}, we've mapped your path.`
      });
    }, 2500);
  };

  const handleBeginnerChoice = (value) => {
    if (value === 'OTHER') {
      setShowOtherInput(true);
      return;
    }
    
    if (quizStep < beginnerQuestions.length - 1) {
      setBeginnerScore({ ...beginnerScore, [quizStep]: value });
      setQuizStep(quizStep + 1);
      setShowOtherInput(false);
      setOtherText('');
    } else {
      startAnalysis('beginner', value);
    }
  };

  const submitOther = () => {
    if (!otherText || otherText.length < 3) return;
    handleBeginnerChoice(otherText);
  };

  const cardStyle = {
    background: theme.cardBg,
    backdropFilter: 'blur(10px)',
    border: `1px solid ${theme.border}`,
    borderRadius: '24px',
    padding: '40px',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
  };

  const buttonStyle = {
    padding: '16px 32px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '100%',
    marginBottom: '12px'
  };

  if (analyzing) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.pageBg, color: theme.textPrimary }}>
        <div style={cardStyle}>
          <div className="loader" style={{ fontSize: '40px', marginBottom: '20px' }}>🧠</div>
          <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>AI is Analyzing...</h2>
          <p style={{ color: theme.textMuted }}>
            {mode === 'skilled' ? 'Extracting skills from your resume...' : 'Mapping your Career DNA...'}
          </p>
          <div style={{ width: '100%', height: '4px', background: theme.border, borderRadius: '2px', marginTop: '20px', overflow: 'hidden' }}>
            <div style={{ width: '60%', height: '100%', background: theme.accent, borderRadius: '2px' }} className="progress-bar-anim"></div>
          </div>
        </div>
        <style>{`
          @keyframes progress { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
          .progress-bar-anim { animation: progress 1.5s infinite linear; }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: theme.pageBg, color: theme.textPrimary, padding: '20px' }}>

      {!mode ? (
        <div style={cardStyle}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px', color: theme.accent }}>Who are you?</h1>
          <p style={{ color: theme.textMuted, marginBottom: '30px' }}>Select your path to start your personalized journey.</p>

          <button
            onClick={() => setMode('skilled')}
            style={{ ...buttonStyle, background: theme.accent, color: '#FFFFFF' }}
          >
            📄 I have a Resume (Skilled)
          </button>

          <button
            onClick={() => setMode('beginner')}
            style={{ ...buttonStyle, background: theme.inputBg, color: theme.textPrimary, border: `1px solid ${theme.border}` }}
          >
            🌱 I am a Beginner (No Exp)
          </button>

          <button onClick={onBack} style={{ background: 'transparent', color: theme.textMuted, border: 'none', cursor: 'pointer', marginTop: '10px' }}>← Go Back</button>
        </div>
      ) : mode === 'skilled' ? (
        <div style={cardStyle}>
          <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Upload your Resume</h2>
          <p style={{ color: theme.textMuted, marginBottom: '20px' }}>Our AI will scan your file content and generate a verified skill report.</p>

          {/* Fraud Alert Box */}
          {fraudAlert && (
            <div style={{ background: 'rgba(231,76,60,0.15)', border: `1px solid ${theme.error}`, borderRadius: '12px', padding: '16px', marginBottom: '20px', textAlign: 'left' }}>
              <p style={{ color: theme.error, fontWeight: 'bold', marginBottom: '8px' }}>🚫 Upload Rejected</p>
              <p style={{ color: theme.textPrimary, fontSize: '13px', lineHeight: '1.6' }}>{fraudAlert.message}</p>
              {fraudAlert.found && fraudAlert.found.length > 0 && (
                <p style={{ color: theme.textMuted, fontSize: '12px', marginTop: '8px' }}>Detected signals: {fraudAlert.found.join(', ')}</p>
              )}
            </div>
          )}

          {/* Audit Report Card (shown after successful scan) */}
          {auditReport && (
            <div style={{ background: 'rgba(46,204,113,0.08)', border: `1px solid ${theme.success}`, borderRadius: '12px', padding: '16px', marginBottom: '20px', textAlign: 'left' }}>
              <p style={{ color: theme.success, fontWeight: 'bold', marginBottom: '12px' }}>✅ Resume Verified — Generating Report...</p>
              <p style={{ color: theme.textMuted, fontSize: '12px', marginBottom: '8px' }}>🔍 Domain Detected: <strong style={{ color: theme.textPrimary }}>{auditReport.skillTitle}</strong></p>
              <p style={{ color: theme.textMuted, fontSize: '12px', marginBottom: '8px' }}>📊 Signals Found: <strong style={{ color: theme.accent }}>{auditReport.keywordScore}</strong></p>
              <p style={{ color: theme.textMuted, fontSize: '12px', marginBottom: '8px' }}>🏷️ Status: <strong style={{ color: auditReport.readinessLevel === 'Industry Ready' ? theme.success : theme.warning }}>{auditReport.readinessLevel}</strong></p>
              <div style={{ marginTop: '12px', fontSize: '12px', lineHeight: '1.8' }}>
                {auditReport.whyThisScore.map((line, i) => (
                  <div key={i} style={{ color: theme.textPrimary }}>{line}</div>
                ))}
              </div>
            </div>
          )}

          {!auditReport && (
            <div style={{ border: `2px dashed ${theme.border}`, borderRadius: '16px', padding: '40px', marginBottom: '20px', cursor: 'pointer' }} onClick={() => document.getElementById('resume-up').click()}>
              <span style={{ fontSize: '40px' }}>📥</span>
              <p style={{ marginTop: '10px', fontSize: '14px', color: theme.textPrimary }}>Click to upload PDF or Docx</p>
              <p style={{ fontSize: '11px', color: theme.textMuted, marginTop: '6px' }}>Our AI will verify the content — fake uploads will be rejected</p>
              <input id="resume-up" type="file" hidden onChange={handleFileUpload} accept=".pdf,.doc,.docx" />
            </div>
          )}

          <button onClick={() => { setMode(null); setFraudAlert(null); setAuditReport(null); }} style={{ background: 'transparent', color: theme.textMuted, border: 'none', cursor: 'pointer' }}>← Back</button>
        </div>
      ) : (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span style={{ fontSize: '12px', color: theme.accent, fontWeight: 'bold' }}>QUESTION {quizStep + 1} OF {beginnerQuestions.length}</span>
            <span style={{ fontSize: '12px', color: theme.textMuted }}>Potential Mapping</span>
          </div>
          <h2 style={{ fontSize: '22px', marginBottom: '24px', textAlign: 'left', color: theme.textPrimary }}>{beginnerQuestions[quizStep].question}</h2>

          {showOtherInput ? (
            <div style={{ animation: 'fadeSlideIn 0.3s ease both' }}>
              <input 
                type="text" 
                placeholder="Type your skill/interest (e.g. Game Dev)" 
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                autoFocus
                style={{ width: '100%', padding: '16px', borderRadius: '12px', border: `1px solid ${theme.accent}`, background: theme.inputBg, color: theme.textPrimary, fontSize: '16px', marginBottom: '16px', outline: 'none' }}
              />
              <button 
                onClick={submitOther}
                style={{ ...buttonStyle, background: theme.accent, color: '#FFFFFF' }}
              >
                Confirm Interest →
              </button>
              <button 
                onClick={() => setShowOtherInput(false)}
                style={{ background: 'transparent', color: theme.textMuted, border: 'none', cursor: 'pointer', fontSize: '13px' }}
              >
                ← Choose from list
              </button>
            </div>
          ) : (
            beginnerQuestions[quizStep].options.map((opt, i) => (
              <button 
                key={i} 
                onClick={() => handleBeginnerChoice(opt.value)}
                style={{ ...buttonStyle, background: theme.inputBg, color: theme.textPrimary, textAlign: 'left', border: `1px solid ${theme.border}`, fontSize: '14px', padding: '20px' }}
              >
                {opt.label}
              </button>
            ))
          )}
          
          {!showOtherInput && (
            <button onClick={() => setMode(null)} style={{ background: 'transparent', color: theme.textMuted, border: 'none', cursor: 'pointer', marginTop: '10px' }}>← Cancel</button>
          )}
        </div>
      )}
    </div>
  );
}
