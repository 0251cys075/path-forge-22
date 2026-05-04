import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const PREDEFINED_FIELDS = [
  "Frontend Developer",
  "Backend Engineer",
  "Data Scientist",
  "UI/UX Designer",
  "Product Manager",
  "Full Stack Engineer",
  "Other"
];

const MAX_WARNINGS = 5;
const MAX_PERSON_WARNINGS = 3; // Terminate after 3 person violations
const MAX_EYE_WARNINGS = 5; // Terminate after 5 eye tracking violations

export default function AIInterview({ userData, onBack, onComplete, theme }) {
  const defaultTheme = {
    pageBg: '#1D2226',
    cardBg: '#1B1F23',
    inputBg: '#283039',
    border: '#38434F',
    textPrimary: '#E7E9EA',
    textMuted: '#B0B7BF',
    accent: '#0A66C2',
    accentHover: '#004182',
    accentLight: '#70B5F9',
    success: '#057642',
    warning: '#F5C518',
    error: '#CC1016',
  };
  const currentTheme = theme || defaultTheme;
  // Setup Phase
  const [setupPhase, setSetupPhase] = useState(true);
  const [selectedField, setSelectedField] = useState('');
  const [customField, setCustomField] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // Recording / Transcription States
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [timer, setTimer] = useState(60); 
  const [stream, setStream] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [results, setResults] = useState(null);
  const [transcripts, setTranscripts] = useState([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  // Integrity States
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [personCount, setPersonCount] = useState(1);
  const [securityViolation, setSecurityViolation] = useState(null);
  const [boundingBox, setBoundingBox] = useState(null);
  
  // Enhanced Detection States
  const [warnings, setWarnings] = useState([]);
  const [warningCount, setWarningCount] = useState(0);
  const [eyeContactScore, setEyeContactScore] = useState(100);
  const [personDetected, setPersonDetected] = useState(false);
  const [sessionTerminated, setSessionTerminated] = useState(false);
  
  // Biometric Protection States
  const [personWarningCount, setPersonWarningCount] = useState(0);
  const [eyeWarningCount, setEyeWarningCount] = useState(0);
  const [eyeTrackingData, setEyeTrackingData] = useState({ x: 0, y: 0, movement: 0 });
  const [personBoundingBox, setPersonBoundingBox] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [biometricStatus, setBiometricStatus] = useState('active'); // active, warning, terminated
  
  const videoRef = useRef(null);
  const canvasRef = useRef(document.createElement('canvas'));
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const lastWarningTime = useRef(0);
  const analyzerRef = useRef(null);
  const recognitionRef = useRef(null);
  const prevMassesRef = useRef({ l: 0, r: 0 });
  
  // Biometric Tracking Refs
  const lastPersonWarningTime = useRef(0);
  const lastEyeWarningTime = useRef(0);
  const previousEyePosition = useRef({ x: 0, y: 0 });
  const eyeMovementAccumulator = useRef(0);
  const personDetectionHistory = useRef([]);

  const targetField = selectedField === 'Other' ? customField : selectedField;
  const isFieldValid = targetField.length > 2 && /^[a-zA-Z\s]+$/.test(targetField);

  // Biometric Protection Functions
  const detectPersonInFrame = (frameData) => {
    // Square detection method - analyze frame for human presence
    let skinPixels = 0;
    let totalPixels = frameData.length / 4;
    let minX = 320, maxX = 0, minY = 240, maxY = 0;
    
    for (let i = 0; i < frameData.length; i += 4) {
      const x = (i / 4) % 320;
      const y = Math.floor((i / 4) / 320);
      const r = frameData[i];
      const g = frameData[i + 1];
      const b = frameData[i + 2];
      
      // Skin detection
      const isSkin = (r > 95 && g > 40 && b > 20 && r > g && r > b);
      
      if (isSkin) {
        skinPixels++;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
    
    const skinRatio = skinPixels / totalPixels;
    const hasPerson = skinRatio > 0.05; // At least 5% skin pixels
    
    // Calculate bounding box for person
    const boundingBox = hasPerson ? {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    } : null;
    
    // Check for multiple people using square method
    const personArea = (maxX - minX) * (maxY - minY);
    const expectedSinglePersonArea = 15000; // Expected area for one person
    const multiplePersonThreshold = expectedSinglePersonArea * 2.5;
    
    const multiplePeopleDetected = hasPerson && personArea > multiplePersonThreshold;
    
    return {
      hasPerson,
      multiplePeopleDetected,
      boundingBox,
      confidence: skinRatio
    };
  };
  
  const trackEyeMovement = (frameData, boundingBox) => {
    if (!boundingBox) return { x: 0, y: 0, movement: 0, valid: false };
    
    // Focus on eye region (upper third of face)
    const eyeRegionY = boundingBox.y + (boundingBox.height * 0.2);
    const eyeRegionHeight = boundingBox.height * 0.3;
    const eyeRegionX = boundingBox.x + (boundingBox.width * 0.2);
    const eyeRegionWidth = boundingBox.width * 0.6;
    
    let eyePixels = [];
    
    for (let y = eyeRegionY; y < eyeRegionY + eyeRegionHeight && y < 240; y++) {
      for (let x = eyeRegionX; x < eyeRegionX + eyeRegionWidth && x < 320; x++) {
        const i = (y * 320 + x) * 4;
        const r = frameData[i];
        const g = frameData[i + 1];
        const b = frameData[i + 2];
        
        // Eye detection (dark pixels in eye region)
        const brightness = (r + g + b) / 3;
        if (brightness < 80) { // Dark pixels likely eyes
          eyePixels.push({ x, y, brightness });
        }
      }
    }
    
    if (eyePixels.length < 10) return { x: 0, y: 0, movement: 0, valid: false };
    
    // Calculate center of eye region
    const avgX = eyePixels.reduce((sum, p) => sum + p.x, 0) / eyePixels.length;
    const avgY = eyePixels.reduce((sum, p) => sum + p.y, 0) / eyePixels.length;
    
    // Calculate movement from previous position
    const prevX = previousEyePosition.current.x || avgX;
    const prevY = previousEyePosition.current.y || avgY;
    const movement = Math.sqrt(Math.pow(avgX - prevX, 2) + Math.pow(avgY - prevY, 2));
    
    // Update previous position
    previousEyePosition.current = { x: avgX, y: avgY };
    
    // Accumulate movement
    eyeMovementAccumulator.current += movement;
    
    return {
      x: avgX,
      y: avgY,
      movement: eyeMovementAccumulator.current,
      valid: true
    };
  };
  
  const handlePersonViolation = () => {
    const now = Date.now();
    if (now - lastPersonWarningTime.current < 10000) return; // 10 second throttle
    
    setPersonWarningCount(prev => {
      const newCount = prev + 1;
      
      if (newCount >= MAX_PERSON_WARNINGS) {
        setBiometricStatus('terminated');
        terminateSession('Multiple person violations detected. Session terminated for security reasons.');
      } else {
        setBiometricStatus('warning');
        addWarning('multiple_persons', `👥 Unauthorized person detected! Warning ${newCount}/${MAX_PERSON_WARNINGS}`);
      }
      
      return newCount;
    });
    
    lastPersonWarningTime.current = now;
  };
  
  const handleEyeViolation = () => {
    const now = Date.now();
    if (now - lastEyeWarningTime.current < 8000) return; // 8 second throttle for eye tracking
    
    setEyeWarningCount(prev => {
      const newCount = prev + 1;
      
      if (newCount >= MAX_EYE_WARNINGS) {
        setBiometricStatus('terminated');
        terminateSession('Excessive eye movement detected. Session terminated for security reasons.');
      } else {
        addWarning('eye_tracking', `👁️ Suspicious eye movement detected! Warning ${newCount}/${MAX_EYE_WARNINGS}`);
      }
      
      return newCount;
    });
    
    lastEyeWarningTime.current = now;
  };
  
  const resetEyeMovementAccumulator = () => {
    eyeMovementAccumulator.current = 0;
  };

  // Warning System Functions
  const addWarning = (type, message) => {
    const now = Date.now();
    if (now - lastWarningTime < 2000) return; // Prevent spam warnings
    
    const newWarning = {
      id: Date.now(),
      type,
      message,
      timestamp: now
    };
    
    setWarnings(prev => [...prev, newWarning]);
    
    // Auto-remove warning after 5 seconds
    setTimeout(() => {
      setWarnings(prev => prev.filter(w => w.id !== newWarning.id));
    }, 5000);
    
    // Terminate session after 5 warnings
    if (warnings.length >= 4) {
      terminateSession('Maximum warnings reached. Session terminated for security reasons.');
    }
  };

  const terminateSession = (reason) => {
    setSessionTerminated(true);
    stopRecording();
    stopStream();
    setSecurityViolation(reason);
    setRecorded(false);
  };

  // TAB & WINDOW FOCUS LOCK
  useEffect(() => {
    const triggerViolation = () => {
      if (recording) handleViolation("🚫 SECURITY VIOLATION: Unauthorized window switch or focus loss detected.");
    };
    window.addEventListener("blur", triggerViolation);
    document.addEventListener("visibilitychange", () => { if (document.hidden) triggerViolation(); });
    return () => {
      window.removeEventListener("blur", triggerViolation);
      document.removeEventListener("visibilitychange", triggerViolation);
    };
    // eslint-disable-next-line
  }, [recording]);

  // Speech Recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      let finalStr = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) finalStr += event.results[i][0].transcript;
      }
      if (finalStr) setCurrentTranscript(prev => prev + ' ' + finalStr);
    };
    recognitionRef.current = recognition;
  }, []);

  // Kill Stream Utility
  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    recognitionRef.current?.stop();
  };

  // Start Camera & Audio Analysis
  useEffect(() => {
    if (setupPhase) return;
    async function startCam() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyzer = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(s);
        source.connect(analyzer);
        analyzer.fftSize = 256;
        audioContextRef.current = audioContext;
        analyzerRef.current = analyzer;
        
        const dataArray = new Uint8Array(analyzer.frequencyBinCount);
        const checkNoise = () => {
          if (!analyzerRef.current) return;
          analyzerRef.current.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setNoiseLevel(Math.round(avg * 1.5));
          requestAnimationFrame(checkNoise);
        };
        checkNoise();
      } catch (err) { alert("Camera access denied."); }
    }
    startCam();
    return () => stopStream();
    // eslint-disable-next-line
  }, [setupPhase]);

  // ENHANCED BIOMETRIC PROTECTION SYSTEM
  useEffect(() => {
    if (setupPhase || !videoRef.current || results || sessionTerminated) return;

    const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
    let frameCount = 0;
    
    const interval = setInterval(() => {
      if (!videoRef.current) return;

      canvasRef.current.width = 320;
      canvasRef.current.height = 240;
      ctx.drawImage(videoRef.current, 0, 0, 320, 240);
      const frame = ctx.getImageData(0, 0, 320, 240).data;
      
      frameCount++;
      
      // BIOMETRIC PERSON DETECTION (Square Method)
      const personDetection = detectPersonInFrame(frame);
      
      if (personDetection.hasPerson) {
        setPersonDetected(true);
        
        // Update person bounding box
        if (personDetection.boundingBox) {
          const normalizedBox = {
            x: (personDetection.boundingBox.x / 320) * 100,
            y: (personDetection.boundingBox.y / 240) * 100,
            w: (personDetection.boundingBox.width / 320) * 100,
            h: (personDetection.boundingBox.height / 240) * 100
          };
          setBoundingBox(normalizedBox);
          setPersonBoundingBox(personDetection.boundingBox);
        }
        
        // Check for multiple people using square detection
        if (personDetection.multiplePeopleDetected && recording) {
          handlePersonViolation();
        }
        
        // EYE TRACKING SYSTEM
        if (personDetection.boundingBox && recording) {
          const eyeTracking = trackEyeMovement(frame, personDetection.boundingBox);
          
          if (eyeTracking.valid) {
            setEyeTrackingData(eyeTracking);
            
            // Check for excessive eye movement
            const movementThreshold = 500; // Accumulated movement threshold
            if (eyeTracking.movement > movementThreshold) {
              handleEyeViolation();
              resetEyeMovementAccumulator(); // Reset after violation
            }
            
            // Update eye contact score based on stability
            const movementStability = Math.max(0, 100 - (eyeTracking.movement / 10));
            setEyeContactScore(movementStability);
          }
        }
        
      } else {
        setPersonDetected(false);
        setBoundingBox(null);
        setPersonBoundingBox({ x: 0, y: 0, width: 0, height: 0 });
        
        // Warning for no person detected
        if (frameCount % 60 === 0 && recording) { // Check every ~9 seconds
          addWarning('no_person', '⚠️ No person detected in camera view');
        }
      }
      
      // Update biometric status based on warnings
      if (personWarningCount >= 2 || eyeWarningCount >= 4) {
        setBiometricStatus('warning');
      } else if (personWarningCount === 0 && eyeWarningCount === 0) {
        setBiometricStatus('active');
      }
      
    }, 150); // Monitor every 150ms

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [setupPhase, recording, results, sessionTerminated]);

  // Countdown Timer
  useEffect(() => {
    let interval;
    if (recording && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && recording) {
      nextQuestion();
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [recording, timer]);

  const handleViolation = (msg) => {
    stopRecording();
    setSecurityViolation(msg);
    setRecorded(false);
    stopStream();
  };

  const handleBack = () => {
    stopStream();
    onBack();
  };

  const generateQuestions = async () => {
    if (!isFieldValid) return;
    setAnalyzing(true);
    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY || localStorage.getItem('PATHFORGE_GEMINI_API_KEY');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Generate 5 high-quality technical interview questions for: ${targetField}. Return as plain list.`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const qList = text.split('\n').filter(q => q.trim().length > 5).slice(0, 5);
      setQuestions(qList.length > 0 ? qList : ["Tell us about your background.", "Describe a complex bug.", "How do you handle scalability?", "What is your testing strategy?", "Explain a technical trade-off."]);
      setSetupPhase(false);
    } catch (e) {
      setQuestions(["Explain your technical background.", "Describe a complex bug.", "How do you handle scalability?", "What is your testing strategy?", "Explain a technical trade-off."]);
      setSetupPhase(false);
    } finally { setAnalyzing(false); }
  };

  const startRecording = () => {
    setRecording(true);
    setRecorded(false);
    setTimer(60);
    setCurrentTranscript('');
    setTranscripts([]);
    chunksRef.current = [];
    try { recognitionRef.current?.start(); } catch(e){}
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setVideoUrl(URL.createObjectURL(blob));
    };
    recorder.start();
  };

  const stopRecording = () => {
    setRecording(false);
    setRecorded(true);
    recognitionRef.current?.stop();
    if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current?.stop();
  };

  const nextQuestion = () => {
    setTranscripts(prev => [...prev, currentTranscript]);
    setCurrentTranscript('');
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setTimer(60);
    } else { stopRecording(); }
  };

  const analyzeInterview = async () => {
    setAnalyzing(true);
    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY || localStorage.getItem('PATHFORGE_GEMINI_API_KEY');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const interviewContext = questions.map((q, i) => `Q: ${q}\nA: ${transcripts[i] || 'Silent'}`).join('\n\n');
      const prompt = `Perform a brutal technical audit of this ${targetField} interview. 
      STRICT RULES:
      - If answers are gibberish, empty, or unrelated, the rating MUST be 0.0/10.
      - Evaluate technical depth only.
      
      TRANSCRIPT:
      ${interviewContext}
      
      Return ONLY a valid JSON:
      {
        "rating": number (out of 10),
        "confidence": "string",
        "feelings": "string",
        "explanation": "brutal 1-sentence summary",
        "detailedJudgement": "A detailed 3-sentence technical audit.",
        "metrics": { "communication": number, "technical": number, "integrity": 100 }
      }`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.replace(/```json|```/g, '').trim();
      setResults(JSON.parse(cleaned));
      stopStream();
    } catch (e) {
      setResults({ rating: 0.0, confidence: "None", feelings: "Silent", explanation: "Failed audit.", detailedJudgement: "No depth.", metrics: { communication: 0, technical: 0, integrity: 100 } });
      stopStream();
    } finally { setAnalyzing(false); }
  };

  if (setupPhase) {
    return (
      <div style={{ minHeight:'100vh', background:currentTheme.pageBg, color:currentTheme.textPrimary, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
        <div style={{ maxWidth:'600px', width:'100%', background:currentTheme.cardBg, border:`1px solid ${currentTheme.border}`, padding:'40px', borderRadius:'30px', textAlign:'center' }}>
          <div style={{ fontSize:'50px', marginBottom:'10px' }}>🎥</div>
          <h2 style={{ fontSize:'28px', fontWeight:'900', marginBottom:'15px' }}>Mock Interview Studio</h2>
          <p style={{ color:currentTheme.textMuted, marginBottom:'30px' }}>Select your target field for a precise AI evaluation.</p>
          
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'10px', marginBottom:'25px' }}>
            {PREDEFINED_FIELDS.map(f => (
              <button 
                key={f}
                onClick={() => setSelectedField(f)}
                style={{ padding:'12px', borderRadius:'12px', background: selectedField === f ? currentTheme.accent : currentTheme.inputBg, border:'1px solid ' + (selectedField === f ? currentTheme.accent : currentTheme.border), color: selectedField === f ? 'white' : currentTheme.textPrimary, cursor:'pointer', fontSize:'13px', fontWeight:'bold', transition:'all 0.2s' }}
              >
                {f}
              </button>
            ))}
          </div>

          {selectedField === 'Other' && (
            <input 
              type="text" 
              placeholder="Enter your field (e.g. DevOps Engineer)" 
              value={customField}
              onChange={(e) => setCustomField(e.target.value)}
              style={{ width:'100%', padding:'15px', borderRadius:'15px', background:currentTheme.inputBg, border:`1px solid ${isFieldValid ? currentTheme.border : currentTheme.error}`, color:currentTheme.textPrimary, marginBottom:'20px', outline:'none' }}
            />
          )}

          <button 
            onClick={generateQuestions}
            disabled={!isFieldValid || analyzing}
            style={{ width:'100%', padding:'18px', borderRadius:'15px', background: isFieldValid ? currentTheme.accent : currentTheme.inputBg, color:currentTheme.textPrimary, border:'none', fontWeight:'bold', cursor: isFieldValid ? 'pointer' : 'not-allowed' }}
          >
            {analyzing ? 'Initializing AI...' : 'Start Proctored Session ⚡'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100vh', background:currentTheme.pageBg, color:currentTheme.textPrimary, padding:'40px 20px', fontFamily:'Arial, sans-serif' }}>
      
      <div style={{ display:'flex', alignItems:'center', gap:'16px', maxWidth:'1000px', margin:'0 auto 30px' }}>
        <button onClick={handleBack} style={{ background:'transparent', color:currentTheme.textMuted, border:`1px solid ${currentTheme.border}`, padding:'8px 18px', borderRadius:'20px', cursor:'pointer' }}>← Back</button>
        <h1 style={{ color:currentTheme.accent, fontSize:'22px', fontWeight:'bold', margin:0 }}>🎥 AI Mock Interview Studio</h1>
      </div>

      {securityViolation && (
        <div style={{ maxWidth:'1000px', margin:'0 auto 30px', background:currentTheme.error + '26', border:'2px solid ' + currentTheme.error, borderRadius:'16px', padding:'20px', textAlign:'center', color:currentTheme.error }}>
          <div style={{ fontSize:'24px', fontWeight:'bold' }}>⚠️ SECURITY TERMINATION</div>
          <p>{securityViolation}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop:'15px', background:currentTheme.error, color:'white', border:'none', padding:'8px 20px', borderRadius:'12px', cursor:'pointer' }}>Restart Session</button>
        </div>
      )}

      <div style={{ maxWidth:'1000px', margin:'0 auto', display:'grid', gridTemplateColumns: results ? '1fr 1.4fr' : '1fr', gap:'30px' }}>
        
        <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
          {!results && (
            <div style={{ background:currentTheme.inputBg, border:`1px solid ${currentTheme.accent}`, padding:'25px', borderRadius:'20px', animation:'fadeIn 0.5s ease' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
                <div style={{ fontSize:'12px', color:currentTheme.accent, fontWeight:'800' }}>QUESTION {currentQIndex + 1} OF {questions.length}</div>
                <div style={{ display:'flex', gap:'15px', alignItems:'center' }}>
                  {recording && <div style={{ fontSize:'14px', fontWeight:'900', color:currentTheme.error }}>⏱️ {timer}s</div>}
                  
                  {/* Biometric Protection Indicators */}
                  <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                    <div style={{ 
                      fontSize:'11px', 
                      fontWeight:'900', 
                      padding:'4px 8px',
                      borderRadius:'6px',
                      background: biometricStatus === 'terminated' ? currentTheme.error : biometricStatus === 'warning' ? currentTheme.warning : currentTheme.success,
                      color: 'white'
                    }}>
                      {biometricStatus === 'terminated' ? '🔒 BIOMETRIC LOCK' : biometricStatus === 'warning' ? '⚠️ BIOMETRIC WARNING' : '✅ BIOMETRIC ACTIVE'}
                    </div>
                    
                    <div style={{ 
                      fontSize:'11px', 
                      fontWeight:'900', 
                      color: personWarningCount >= 2 ? currentTheme.error : personWarningCount >= 1 ? currentTheme.warning : currentTheme.accent,
                      padding:'4px 6px',
                      borderRadius:'4px',
                      background: currentTheme.inputBg
                    }}>
                      👥 PERSON: {personWarningCount}/{MAX_PERSON_WARNINGS}
                    </div>
                    
                    <div style={{ 
                      fontSize:'11px', 
                      fontWeight:'900', 
                      color: eyeWarningCount >= 4 ? currentTheme.error : eyeWarningCount >= 2 ? currentTheme.warning : currentTheme.accent,
                      padding:'4px 6px',
                      borderRadius:'4px',
                      background: currentTheme.inputBg
                    }}>
                      👁️ EYES: {eyeWarningCount}/{MAX_EYE_WARNINGS}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ fontSize:'20px', fontWeight:'700', lineHeight:'1.5' }}>{questions[currentQIndex]}</div>
            </div>
          )}

          <div style={{ position:'relative', borderRadius:'24px', overflow:'hidden', background:'#000', border:`1px solid ${currentTheme.border}` }}>
            {!recorded ? (
              <>
                <video ref={videoRef} autoPlay muted playsInline style={{ width:'100%', display:'block', filter: securityViolation ? 'blur(10px) grayscale(1)' : 'none' }} />
                {boundingBox && !securityViolation && (
                  <div style={{ 
                    position:'absolute', 
                    border:`2px solid ${personCount > 1 ? currentTheme.error : currentTheme.accent}`, 
                    left: `${boundingBox.x}%`, 
                    top: `${boundingBox.y}%`, 
                    width: `${boundingBox.w}%`, 
                    height: `${boundingBox.h}%`, 
                    transition: 'all 0.15s ease-out',
                    boxShadow: `0 0 15px ${personCount > 1 ? currentTheme.error + '80' : currentTheme.accent + '80'}`,
                    borderRadius: '8px',
                    pointerEvents: 'none'
                  }}>
                    <div style={{ position:'absolute', top:'-25px', left:0, background: personCount > 1 ? currentTheme.error : currentTheme.accent, color:'white', fontSize:'10px', padding:'2px 8px', borderRadius:'4px', fontWeight:'bold', whiteSpace:'nowrap' }}>
                      {personCount > 1 ? '⚠️ MULTIPLE ENTITIES' : '🎯 TARGET LOCKED'}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <video src={videoUrl} controls style={{ width:'100%', display:'block' }} />
            )}

            {recording && currentTranscript && (
              <div style={{ position:'absolute', bottom:20, left:20, right:20, background:currentTheme.pageBg, padding:'15px', borderRadius:'15px', border:`1px solid ${currentTheme.border}`, backdropFilter:'blur(10px)' }}>
                <div style={{ fontSize:'10px', color:currentTheme.accent, fontWeight:'800', marginBottom:'5px' }}>LIVE SPEECH CAPTURE</div>
                <div style={{ fontSize:'13px', color:currentTheme.textPrimary, fontStyle:'italic' }}>"...{currentTranscript.slice(-120)}"</div>
              </div>
            )}

            {!results && (
              <div style={{ position:'absolute', top:20, left:20, display:'flex', flexDirection:'column', gap:'8px' }}>
                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                  <div style={{ 
                    background: personDetected ? currentTheme.success : currentTheme.error, 
                    padding:'6px 12px', 
                    borderRadius:'10px', 
                    fontSize:'11px', 
                    border:`1px solid ${currentTheme.border}`, 
                    backdropFilter:'blur(5px)',
                    fontWeight: 'bold'
                  }}>
                    👤 {personDetected ? 'PERSON DETECTED' : 'NO PERSON'}
                  </div>
                  <div style={{ 
                    background: eyeContactScore > 70 ? currentTheme.success : eyeContactScore > 40 ? currentTheme.warning : currentTheme.error, 
                    padding:'6px 12px', 
                    borderRadius:'10px', 
                    fontSize:'11px', 
                    border:`1px solid ${currentTheme.border}`, 
                    backdropFilter:'blur(5px)',
                    fontWeight: 'bold'
                  }}>
                    �️ EYE: {eyeContactScore}%
                  </div>
                  <div style={{ 
                    background: noiseLevel > 65 ? currentTheme.error : currentTheme.success, 
                    padding:'6px 12px', 
                    borderRadius:'10px', 
                    fontSize:'11px', 
                    border:`1px solid ${currentTheme.border}`, 
                    backdropFilter:'blur(5px)',
                    fontWeight: 'bold'
                  }}>
                    🔊 NOISE: {noiseLevel > 65 ? 'LOUD' : 'OPTIMAL'}
                  </div>
                </div>
                
                {/* Warning Counter */}
                {warnings.length > 0 && (
                  <div style={{ 
                    background: currentTheme.error, 
                    padding:'6px 12px', 
                    borderRadius:'10px', 
                    fontSize:'11px', 
                    border:`1px solid ${currentTheme.error}`, 
                    backdropFilter:'blur(5px)',
                    fontWeight: 'bold',
                    animation: 'pulse 2s infinite'
                  }}>
                    ⚠️ WARNINGS: {warnings.length}/5
                  </div>
                )}
              </div>
            )}

            {/* Warnings Display */}
            {warnings.length > 0 && (
              <div style={{ 
                position: 'absolute', 
                top: 20, 
                right: 20, 
                maxWidth: '300px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {warnings.map(warning => (
                  <div
                    key={warning.id}
                    style={{
                      background: currentTheme.error,
                      border: `1px solid ${currentTheme.error}`,
                      borderRadius: '12px',
                      padding: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#FFFFFF',
                      backdropFilter: 'blur(10px)',
                      animation: 'slideInRight 0.3s ease-out',
                      boxShadow: `0 4px 15px ${currentTheme.error}4d`
                    }}
                  >
                    {warning.message}
                  </div>
                ))}
              </div>
            )}
          </div>

          {!recording && !recorded && !securityViolation && (
            <button onClick={startRecording} style={{ width:'100%', padding:'18px', borderRadius:'15px', background:currentTheme.accent, color:'#FFFFFF', border:'none', fontWeight:'bold', fontSize:'16px', cursor:'pointer' }}>Start Interview</button>
          )}
          {recording && (
             <button onClick={nextQuestion} style={{ width:'100%', padding:'18px', borderRadius:'15px', background:currentTheme.accentLight, color:'#FFFFFF', border:'none', fontWeight:'bold', fontSize:'16px', cursor:'pointer' }}>
               {currentQIndex === questions.length - 1 ? 'Finish Interview' : 'Next Question'}
             </button>
          )}
          {recorded && !results && !analyzing && (
            <button onClick={analyzeInterview} style={{ width:'100%', padding:'18px', borderRadius:'15px', background:currentTheme.success, color:'#FFFFFF', border:'none', fontWeight:'bold', fontSize:'16px', cursor:'pointer' }}>Generate AI Scorecard</button>
          )}
          {analyzing && (
            <div style={{ textAlign:'center', padding:'30px', background:currentTheme.inputBg, borderRadius:'24px' }}>
              <div style={{ fontSize:'40px', marginBottom:'15px' }}>🧠</div>
              <div style={{ fontWeight:'bold', color:currentTheme.accentLight }}>GEMINI AI IS PERFORMING TECHNICAL AUDIT...</div>
            </div>
          )}
        </div>

        {results && (
          <div style={{ background:currentTheme.cardBg, borderRadius:'24px', padding:'35px', border:`1px solid ${currentTheme.success}`, animation:'fadeIn 0.5s ease' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'25px' }}>
              <h3 style={{ fontSize:'24px', fontWeight:'900' }}>AI Technical Scorecard</h3>
              <div style={{ fontSize:'32px', fontWeight:'900', color: results.rating > 5 ? currentTheme.success : currentTheme.error }}>{results.rating}/10</div>
            </div>
            <div style={{ marginBottom:'30px' }}>
              <div style={{ fontSize:'11px', color:currentTheme.accent, fontWeight:'900', textTransform:'uppercase', marginBottom:'10px' }}>Detailed Technical Audit</div>
              <p style={{ fontSize:'14px', lineHeight:'1.7', color:currentTheme.textPrimary, background:currentTheme.inputBg, padding:'20px', borderRadius:'15px', borderLeft:`4px solid ${currentTheme.accent}` }}>{results.detailedJudgement}</p>
            </div>
            <button onClick={handleBack} style={{ width:'100%', marginTop:'35px', padding:'18px', borderRadius:'15px', background:currentTheme.inputBg, color:currentTheme.textPrimary, border:'none', fontWeight:'bold', cursor:'pointer' }}>Return to Dashboard</button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
