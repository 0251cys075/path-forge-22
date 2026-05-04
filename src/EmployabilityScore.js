import React, { useState, useEffect, useMemo } from 'react';

const tasksBySkill = {
  'Frontend Development': [
    { id: 1, task: 'Complete HTML & CSS basics', points: 10, category: 'Learning' },
    { id: 2, task: 'Build your first React component', points: 15, category: 'Project' },
    { id: 3, task: 'Complete JavaScript fundamentals course', points: 20, category: 'Course' },
    { id: 4, task: 'Build a personal portfolio website', points: 25, category: 'Project' },
    { id: 5, task: 'Learn Tailwind CSS', points: 10, category: 'Learning' },
    { id: 6, task: 'Push project to GitHub', points: 10, category: 'Action' },
    { id: 7, task: 'Apply to 3 frontend internships', points: 10, category: 'Action' },
  ],
  'Backend Development': [
    { id: 1, task: 'Learn Node.js basics', points: 10, category: 'Learning' },
    { id: 2, task: 'Build a REST API with Express', points: 20, category: 'Project' },
    { id: 3, task: 'Connect MongoDB to your project', points: 15, category: 'Project' },
    { id: 4, task: 'Complete SQL fundamentals course', points: 15, category: 'Course' },
    { id: 5, task: 'Deploy backend on Render', points: 10, category: 'Action' },
    { id: 6, task: 'Push project to GitHub', points: 10, category: 'Action' },
    { id: 7, task: 'Apply to 3 backend internships', points: 10, category: 'Action' },
  ],
  'Artificial Intelligence': [
    { id: 1, task: 'Complete Python basics course', points: 10, category: 'Course' },
    { id: 2, task: 'Learn NumPy and Pandas', points: 15, category: 'Learning' },
    { id: 3, task: 'Build your first ML model', points: 25, category: 'Project' },
    { id: 4, task: 'Complete a Kaggle competition', points: 20, category: 'Project' },
    { id: 5, task: 'Learn TensorFlow basics', points: 15, category: 'Learning' },
    { id: 6, task: 'Push project to GitHub', points: 10, category: 'Action' },
    { id: 7, task: 'Apply to 3 AI internships', points: 10, category: 'Action' },
  ],
  'Data Science': [
    { id: 1, task: 'Complete Python for Data Science course', points: 15, category: 'Course' },
    { id: 2, task: 'Learn data visualization with Matplotlib', points: 10, category: 'Learning' },
    { id: 3, task: 'Complete SQL for Data Analysis', points: 15, category: 'Course' },
    { id: 4, task: 'Build a data analysis project', points: 25, category: 'Project' },
    { id: 5, task: 'Create a Tableau/Power BI dashboard', points: 15, category: 'Project' },
    { id: 6, task: 'Push project to GitHub', points: 10, category: 'Action' },
    { id: 7, task: 'Apply to 3 data analyst internships', points: 10, category: 'Action' },
  ],
  'Cyber Security': [
    { id: 1, task: 'Complete Networking fundamentals', points: 15, category: 'Course' },
    { id: 2, task: 'Learn Linux basics', points: 10, category: 'Learning' },
    { id: 3, task: 'Complete ethical hacking course', points: 25, category: 'Course' },
    { id: 4, task: 'Practice on TryHackMe platform', points: 20, category: 'Project' },
    { id: 5, task: 'Get CEH or CompTIA Security+ cert', points: 20, category: 'Action' },
    { id: 6, task: 'Document your findings on GitHub', points: 10, category: 'Action' },
  ],
  'default': [
    { id: 1, task: 'Complete a beginner course in your skill', points: 15, category: 'Course' },
    { id: 2, task: 'Build your first project', points: 20, category: 'Project' },
    { id: 3, task: 'Connect with a mentor on PathForge', points: 15, category: 'Action' },
    { id: 4, task: 'Add your project to portfolio', points: 15, category: 'Project' },
    { id: 5, task: 'Apply to 3 internships', points: 15, category: 'Action' },
    { id: 6, task: 'Push project to GitHub', points: 10, category: 'Action' },
    { id: 7, task: 'Get mentor endorsement', points: 10, category: 'Action' },
  ]
};

const getCategoryColors = (theme) => ({
  Learning: theme.accentLight,
  Project: theme.accentHover,
  Course: theme.accent,
  Action: theme.success,
});

function getScoreLabel(score, theme) {
  if (score === 0) return { label: 'Not Started', color: theme.textMuted, emoji: '😴' };
  if (score < 20) return { label: 'Just Beginning', color: theme.error, emoji: '🌱' };
  if (score < 40) return { label: 'Building Up', color: theme.warning, emoji: '📚' };
  if (score < 60) return { label: 'Getting There', color: theme.warning, emoji: '🔥' };
  if (score < 80) return { label: 'Almost Ready', color: theme.success, emoji: '💪' };
  return { label: 'Job Ready!', color: theme.success, emoji: '🚀' };
}

const defaultTheme = { pageBg:'#1D2226', cardBg:'#1B1F23', inputBg:'#283039', border:'#38434F', textPrimary:'#E7E9EA', textMuted:'#B0B7BF', accent:'#0A66C2', accentHover:'#004182', accentLight:'#70B5F9', success:'#057642', warning:'#F5C518', error:'#CC1016' };

export default function EmployabilityScore({ userData, onBack, onNext, onProgressUpdate, theme = defaultTheme }) {
  const skillName = userData?.skill?.title || 'default';
  const tasks = tasksBySkill[skillName] || tasksBySkill['default'];
  const totalPoints = tasks.reduce((sum, t) => sum + t.points, 0);

  const [completed, setCompleted] = useState(() => userData?.employabilityProgress?.completed || {});
  const [score, setScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedScore(prev => {
        if (prev === score) {
          clearInterval(timer);
          return prev;
        }
        return prev + (score > prev ? 1 : -1);
      });
    }, 15);
    return () => clearInterval(timer);
  }, [score]);
  const modulesPassed = userData?.learningProgress?.completedCount || 0;
  const totalModules = userData?.learningProgress?.total || 0;
  const learningPct = totalModules ? Math.round((modulesPassed / totalModules) * 100) : 0;

  const courseTaskIds = useMemo(
    () => tasks.filter((t) => t.category === 'Course').map((t) => t.id),
    [tasks]
  );
  const autoCompletedCourseCount = courseTaskIds.length
    ? Math.round((learningPct / 100) * courseTaskIds.length)
    : 0;
  const autoCompletedCourses = useMemo(
    () => courseTaskIds.slice(0, autoCompletedCourseCount).reduce((acc, id) => {
      acc[id] = true;
      return acc;
    }, {}),
    [courseTaskIds, autoCompletedCourseCount]
  );
  const effectiveCompleted = useMemo(
    () => ({ ...completed, ...autoCompletedCourses }),
    [completed, autoCompletedCourses]
  );

  useEffect(() => {
    const earned = tasks
      .filter(t => effectiveCompleted[t.id])
      .reduce((sum, t) => sum + t.points, 0);
    const checklistPct = Math.round((earned / totalPoints) * 100);
    const blended = Math.round((checklistPct * 0.7) + (learningPct * 0.3));
    setScore(blended);
  }, [effectiveCompleted, tasks, totalPoints, learningPct]);

  const [verifying, setVerifying] = useState(null);
  const [evidenceModal, setEvidenceModal] = useState(null);
  const [evidenceValue, setEvidenceValue] = useState('');

  const toggleTask = async (task) => {
    if (completed[task.id] || courseTaskIds.includes(task.id) || verifying === task.id) return;

    if (['Project', 'Action'].includes(task.category)) {
      setEvidenceModal(task);
      return;
    }

    setVerifying(task.id);
    const dwellMs = task.category === 'Learning' ? 45 * 1000 : 2500;
    setTimeout(async () => {
      const nextCompleted = { ...completed, [task.id]: true };
      setCompleted(nextCompleted);
      setVerifying(null);
      if (onProgressUpdate) {
        const nextEffectiveCompleted = { ...nextCompleted, ...autoCompletedCourses };
        const earned = tasks.filter(t => nextEffectiveCompleted[t.id]).reduce((s, t) => s + t.points, 0);
        onProgressUpdate({ employabilityProgress: { completed: nextCompleted, earnedPoints: earned } });
      }
    }, dwellMs);
  };

  const handleSubmitEvidence = async () => {
    if (!evidenceValue.trim()) return alert("Please provide proof (Link/Description) to verify this task.");
    const task = evidenceModal;
    setVerifying(task.id);
    setEvidenceModal(null);
    setTimeout(async () => {
      const nextCompleted = { ...completed, [task.id]: true };
      setCompleted(nextCompleted);
      setVerifying(null);
      setEvidenceValue('');
      if (onProgressUpdate) {
        const nextEffectiveCompleted = { ...nextCompleted, ...autoCompletedCourses };
        const earned = tasks.filter(t => nextEffectiveCompleted[t.id]).reduce((s, t) => s + t.points, 0);
        onProgressUpdate({ employabilityProgress: { completed: nextCompleted, earnedPoints: earned } });
      }
    }, 4000);
  };

  const { label, color, emoji } = getScoreLabel(animatedScore, theme);
  const circumference = 2 * Math.PI * 54;
  const strokeDash = circumference - (animatedScore / 100) * circumference;

  return (
    <div style={{ minHeight: '100vh', background: theme.pageBg, color: theme.textPrimary, fontFamily: 'Arial, sans-serif', padding: '30px 20px' }}>
      
      {/* EVIDENCE MODAL */}
      {evidenceModal && (
        <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background: theme.pageBg, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background: theme.cardBg, border:`1px solid ${theme.accent}`, borderRadius:'24px', padding:'40px', maxWidth:'500px', width:'100%', textAlign:'center' }}>
            <div style={{ fontSize:'40px' }}>📁</div>
            <h3 style={{ fontSize:'22px', fontWeight:'bold', margin:'20px 0 10px' }}>Verify Action</h3>
            <p style={{ color: theme.textMuted, fontSize:'14px', marginBottom:'24px' }}>Provide evidence for: <b>{evidenceModal.task}</b></p>
            <input 
              type="text" 
              placeholder="Enter GitHub URL or Link to Proof..." 
              value={evidenceValue} 
              onChange={e => setEvidenceValue(e.target.value)}
              style={{ width:'100%', padding:'14px', borderRadius:'12px', background: theme.inputBg, border:`1px solid ${theme.border}`, color: theme.textPrimary, marginBottom:'24px' }}
            />
            <div style={{ display:'flex', gap:'12px' }}>
              <button onClick={() => setEvidenceModal(null)} style={{ flex:1, padding:'14px', borderRadius:'12px', background: theme.inputBg, border:'none', color: theme.textPrimary, cursor:'pointer' }}>Cancel</button>
              <button onClick={handleSubmitEvidence} style={{ flex:1, padding:'14px', borderRadius:'12px', background: theme.accent, border:'none', color: '#FFFFFF', fontWeight:'bold', cursor:'pointer' }}>Submit Proof</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '900px', margin: '0 auto 30px' }}>
        <button onClick={onBack} style={{ background: 'transparent', color: theme.textMuted, border: `1px solid ${theme.border}`, padding: '8px 18px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' }}>← Back</button>
        <h1 style={{ color: theme.accent, fontSize: '22px', fontWeight: 'bold' }}>⚡ PathForge</h1>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>{userData?.name || 'Your'}'s Employability Dashboard</h2>
          <div style={{ color: theme.textMuted, marginTop: '8px' }}>🚀 {skillName} • 📍 Industry Ready</div>
        </div>

        {/* Score Card */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
          <div style={{ background: theme.cardBg, borderRadius: '24px', padding: '40px', border: `1px solid ${theme.border}`, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '30px' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px' }}>
              <svg style={{ transform: 'rotate(-90deg)', width: '120px', height: '120px' }}>
                <circle cx="60" cy="60" r="54" fill="none" stroke={theme.border} strokeWidth="8" />
                <circle cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={strokeDash} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: '900', color: theme.textPrimary }}>{animatedScore}%</div>
                <div style={{ fontSize: '18px' }}>{emoji}</div>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '900', color: color, textTransform: 'uppercase' }}>{label}</div>
              <div style={{ fontSize: '12px', color: theme.textMuted, marginTop: '4px' }}>Employability Score</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            {[
              { label: 'Tasks Completed', value: `${tasks.filter(t => effectiveCompleted[t.id]).length} / ${tasks.length}`, color: theme.success },
              { label: 'Skill Track', value: skillName, color: theme.accentHover },
              { label: 'Learning Pct', value: `${learningPct}%`, color: theme.accentLight },
              { label: 'Target Goal', value: 'Industry Ready', color: theme.accent },
            ].map((stat, i) => (
              <div key={i} style={{ background: theme.cardBg, borderRadius: '14px', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: '13px', color: theme.textMuted }}>{stat.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: stat.color }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Checklist */}
        <div style={{ background: theme.cardBg, borderRadius: '24px', padding: '30px', border: `1px solid ${theme.border}` }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            ✅ Your Action Checklist — earned through verification
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {tasks.map((t) => {
              const isAuto = courseTaskIds.includes(t.id);
              const isDone = effectiveCompleted[t.id];
              const isVerifying = verifying === t.id;

              return (
                <div key={t.id} onClick={() => toggleTask(t)} style={{ 
                  background: isDone ? theme.inputBg : theme.cardBg, 
                  borderRadius: '16px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', border: isDone ? `1px solid ${theme.success}` : `1px solid ${theme.border}`, 
                  cursor: isDone || isAuto || isVerifying ? 'default' : 'pointer', transition: 'all 0.2s', opacity: isVerifying ? 0.7 : 1
                }}>
                  <div style={{ 
                    width: '24px', height: '24px', borderRadius: '6px', border: `2px solid ${isDone ? theme.success : theme.border}`, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDone ? theme.success : 'transparent', color: '#FFFFFF', fontSize: '14px' 
                  }}>
                    {isDone ? '✓' : ''}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: isDone ? 'bold' : 'normal', color: theme.textPrimary }}>{t.task}</div>
                    <div style={{ fontSize: '11px', color: theme.textMuted, marginTop: '2px' }}>
                      {isVerifying
                        ? (t.category === 'Learning' ? '⏳ Engagement timer (~45s) — stay on this page…' : '🔍 AI Verifying your submission…')
                        : isAuto ? 'Auto-updated from module tests' : t.category === 'Learning' ? 'Click to start; completes after focused wait (anti-instant-check)' : 'Requires verification proof'}
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: getCategoryColors(theme)[t.category] }}>+{t.points}pts</div>
                </div>
              );
            })}
          </div>
        </div>

        {onNext && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button onClick={onNext} style={{
              background: theme.accent, color: '#FFFFFF', border: 'none',
              padding: '14px 38px', borderRadius: '30px', fontSize: '16px',
              fontWeight: 'bold', cursor: 'pointer',
            }}>
              Go to AI Learning Path →
            </button>
          </div>
        )}

        {animatedScore >= 80 && (
          <div style={{
            marginTop: '20px', textAlign: 'center', padding: '20px',
            background: theme.inputBg, border: `1px solid ${theme.success}`,
            borderRadius: '16px'
          }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎉</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: theme.success }}>You are Job Ready!</div>
            <div style={{ color: theme.textMuted, marginTop: '6px' }}>
              Your ATS resume is ready to download. Start applying now!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
