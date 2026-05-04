import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const TEMPLATES = {
  modern: {
    name: 'Modern Professional',
    colors: { primary: '#FF6B35', secondary: '#302b63', accent: '#2ECC71' },
    layout: 'two-column'
  },
  classic: {
    name: 'Classic Professional',
    colors: { primary: '#2c3e50', secondary: '#34495e', accent: '#3498DB' },
    layout: 'single-column'
  },
  creative: {
    name: 'Creative Designer',
    colors: { primary: '#9B59B6', secondary: '#8E44AD', accent: '#E74C3C' },
    layout: 'two-column'
  }
};

const INITIAL_RESUME_DATA = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: ''
  },
  experience: [],
  education: [],
  skills: {
    technical: [],
    soft: [],
    languages: []
  },
  projects: [],
  certifications: [],
  achievements: []
};

export default function AIResumeBuilder({ userData, onBack, onProgressUpdate }) {
  const [resumeData, setResumeData] = useState(INITIAL_RESUME_DATA);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const previewRef = useRef(null);

  // Auto-populate from user data on mount
  useEffect(() => {
    if (userData) {
      populateFromUserData();
    }
  }, [userData]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save functionality with debouncing
  useEffect(() => {
    if (!userData) return;
    
    const timer = setTimeout(() => {
      saveResumeData();
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timer);
  }, [resumeData]); // eslint-disable-line react-hooks/exhaustive-deps

  const populateFromUserData = () => {
    // Only populate if we have user data and resume is empty to prevent unnecessary updates
    if (!userData || (resumeData.personalInfo.name && resumeData.personalInfo.name !== '')) {
      return;
    }

    const populated = {
      ...INITIAL_RESUME_DATA,
      personalInfo: {
        name: userData?.name || '',
        email: userData?.email || '',
        phone: userData?.phone || '',
        location: userData?.location || '',
        website: userData?.website || '',
        linkedin: userData?.linkedin || '',
        github: userData?.github || '',
        summary: generateSummary(userData)
      },
      skills: {
        technical: getTechnicalSkills(userData),
        soft: getSoftSkills(userData),
        languages: userData?.languages || ['English']
      },
      experience: generateExperience(userData),
      education: generateEducation(userData),
      projects: generateProjects(userData),
      certifications: getCertifications(userData)
    };

    setResumeData(populated);
  };

  const generateSummary = (data) => {
    const skill = data?.skill?.title || 'Professional';
    const experience = data?.experience?.label || 'Entry-level';
    const onboardingType = data?.onboardingType || 'beginner';
    
    return `Passionate ${skill.toLowerCase()} with ${onboardingType === 'experienced' ? 'extensive' : 'growing'} experience in developing innovative solutions. 
    Strong foundation in ${experience.toLowerCase()} development with a focus on creating efficient, scalable applications. 
    Quick learner with excellent problem-solving skills and a commitment to continuous improvement.`;
  };

  const getTechnicalSkills = (data) => {
    const skill = data?.skill?.title || '';
    const skillMap = {
      'Frontend Development': ['React', 'JavaScript', 'HTML5', 'CSS3', 'TypeScript', 'Git', 'REST APIs'],
      'Backend Development': ['Node.js', 'Express', 'MongoDB', 'SQL', 'Python', 'Docker', 'API Design'],
      'Artificial Intelligence': ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis', 'NLP', 'Deep Learning'],
      'Data Science': ['Python', 'SQL', 'Data Analysis', 'Statistics', 'Machine Learning', 'Tableau'],
      'Mobile Development': ['React Native', 'Flutter', 'JavaScript', 'Mobile UI', 'iOS', 'Android'],
      'Cyber Security': ['Network Security', 'Ethical Hacking', 'Risk Assessment', 'Cryptography', 'SIEM']
    };
    
    return skillMap[skill] || ['JavaScript', 'React', 'Node.js', 'Git'];
  };

  const getSoftSkills = (data) => {
    return ['Problem Solving', 'Team Collaboration', 'Communication', 'Time Management', 'Adaptability'];
  };

  const generateExperience = (data) => {
    const skill = data?.skill?.title || '';
    const experience = data?.experience?.label || 'Entry-level';
    const years = experience === 'Entry-level' ? 0 : experience === 'Intermediate' ? 2 : 5;
    
    if (years === 0) {
      return [
        {
          title: 'Junior Developer',
          company: 'Tech Startup',
          location: 'Remote',
          duration: '2023 - Present',
          description: [
            'Developed responsive web applications using modern frameworks',
            'Collaborated with cross-functional teams to deliver projects on time',
            'Participated in code reviews and implemented best practices',
            'Assisted in troubleshooting and debugging production issues'
          ]
        }
      ];
    }
    
    return [
      {
        title: `${skill} Developer`,
        company: 'Tech Company',
        location: 'City, State',
        duration: `${2022 - years} - Present`,
        description: [
          `Led development of ${skill.toLowerCase()} projects with focus on scalability`,
          'Mentored junior developers and conducted code reviews',
          'Implemented CI/CD pipelines and improved development workflow',
          'Collaborated with product managers to define technical requirements'
        ]
      }
    ];
  };

  const generateEducation = (data) => {
    return [
      {
        degree: 'Bachelor of Technology',
        field: 'Computer Science & Engineering',
        university: 'University Name',
        location: 'City, State',
        graduation: '2020',
        gpa: '8.5/10'
      }
    ];
  };

  const generateProjects = (data) => {
    const skill = data?.skill?.title || '';
    return [
      {
        name: `${skill} Portfolio Project`,
        description: `Developed a comprehensive ${skill.toLowerCase()} application showcasing technical skills and best practices.`,
        technologies: getTechnicalSkills(data).slice(0, 3),
        link: 'https://github.com/username/project',
        highlights: [
          'Implemented responsive design and user-friendly interface',
          'Integrated third-party APIs and services',
          'Optimized performance and loading times',
          'Deployed application on cloud platform'
        ]
      }
    ];
  };

  const getCertifications = (data) => {
    const skill = data?.skill?.title || '';
    const certMap = {
      'Frontend Development': ['React Developer Certification', 'JavaScript Advanced'],
      'Backend Development': ['Node.js Certified Developer', 'Cloud Architecture'],
      'Artificial Intelligence': ['Machine Learning Engineer', 'TensorFlow Developer'],
      'Data Science': ['Data Scientist Certification', 'Python for Data Analysis']
    };
    
    return (certMap[skill] || ['Professional Certification']).map(cert => ({
      name: cert,
      issuer: 'Tech Platform',
      date: '2023',
      credentialId: 'ID123456'
    }));
  };

  const generateAIResume = async () => {
    setIsGenerating(true);
    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY || localStorage.getItem('PATHFORGE_GEMINI_API_KEY');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `Generate a professional resume based on this user profile:
      
      Name: ${userData?.name || 'John Doe'}
      Email: ${userData?.email || 'john@example.com'}
      Skill Track: ${userData?.skill?.title || 'Software Development'}
      Experience Level: ${userData?.experience?.label || 'Entry-level'}
      
      Please enhance the resume with:
      1. Professional summary highlighting strengths
      2. Detailed experience descriptions with quantifiable achievements
      3. Relevant technical and soft skills
      4. Project descriptions with impact statements
      5. Education details
      6. Certifications and achievements
      
      Format as JSON with the same structure as the initial data.
      Make it impressive but realistic for the experience level.`;
      
      const result = await model.generateContent(prompt);
      const enhancedData = JSON.parse(result.response.text());
      setResumeData({ ...INITIAL_RESUME_DATA, ...enhancedData });
      setAutoSaveStatus('AI Resume Generated Successfully!');
    } catch (error) {
      console.error('Error generating AI resume:', error);
      setAutoSaveStatus('Using default template. AI enhancement failed.');
      populateFromUserData();
    } finally {
      setIsGenerating(false);
    }
  };

  const saveResumeData = async () => {
    try {
      if (onProgressUpdate) {
        await onProgressUpdate({
          resumeData: resumeData,
          lastSaved: new Date().toISOString()
        });
      }
      // Only show auto-save status if it's not already showing
      if (autoSaveStatus !== 'Auto-saved') {
        setAutoSaveStatus('Auto-saved');
        // Clear status after 2 seconds to prevent UI clutter
        setTimeout(() => setAutoSaveStatus(''), 2000);
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      setAutoSaveStatus('Save failed');
      setTimeout(() => setAutoSaveStatus(''), 2000);
    }
  };

  const updateResumeData = (section, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: '',
        company: '',
        location: '',
        duration: '',
        description: ['']
      }]
    }));
  };

  const exportToPDF = () => {
    // This would integrate with a PDF library like jsPDF or html2canvas
    alert('PDF export feature coming soon! For now, use browser print (Ctrl+P)');
  };

  const exportToWord = () => {
    // This would integrate with a Word export library
    alert('Word export feature coming soon!');
  };

  const renderPreview = React.useMemo(() => {
    const template = TEMPLATES[selectedTemplate];
    const { personalInfo, experience, education, skills, projects } = resumeData;

    return (
      <div 
        ref={previewRef}
        style={{
          background: 'white',
          color: '#2c3e50',
          padding: '40px',
          fontFamily: 'Arial, sans-serif',
          minHeight: '11in',
          width: '8.5in',
          margin: '0 auto',
          boxShadow: '0 0 20px rgba(0,0,0,0.1)'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: `3px solid ${template.colors.primary}`, paddingBottom: '20px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            margin: '0', 
            color: template.colors.primary,
            fontWeight: 'bold'
          }}>
            {personalInfo.name || 'Your Name'}
          </h1>
          <div style={{ fontSize: '14px', color: '#7f8c8d', marginTop: '10px' }}>
            {personalInfo.email && <span>{personalInfo.email} • </span>}
            {personalInfo.phone && <span>{personalInfo.phone} • </span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
          <div style={{ fontSize: '12px', color: '#95a5a6', marginTop: '5px' }}>
            {personalInfo.website && <span>{personalInfo.website} • </span>}
            {personalInfo.linkedin && <span>LinkedIn: {personalInfo.linkedin} • </span>}
            {personalInfo.github && <span>GitHub: {personalInfo.github}</span>}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ 
              color: template.colors.primary, 
              borderBottom: `1px solid ${template.colors.primary}`,
              paddingBottom: '5px',
              fontSize: '16px'
            }}>
              Professional Summary
            </h3>
            <p style={{ fontSize: '12px', lineHeight: '1.5', textAlign: 'justify' }}>
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ 
              color: template.colors.primary, 
              borderBottom: `1px solid ${template.colors.primary}`,
              paddingBottom: '5px',
              fontSize: '16px'
            }}>
              Experience
            </h3>
            {experience.map((exp, index) => (
              <div key={index} style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <h4 style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>
                    {exp.title}
                  </h4>
                  <span style={{ fontSize: '12px', color: '#7f8c8d' }}>{exp.duration}</span>
                </div>
                <div style={{ fontSize: '12px', color: template.colors.secondary, marginBottom: '5px' }}>
                  {exp.company} • {exp.location}
                </div>
                <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                  {exp.description.map((desc, i) => (
                    <li key={i} style={{ fontSize: '11px', marginBottom: '3px' }}>{desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ 
              color: template.colors.primary, 
              borderBottom: `1px solid ${template.colors.primary}`,
              paddingBottom: '5px',
              fontSize: '16px'
            }}>
              Education
            </h3>
            {education.map((edu, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4 style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>
                    {edu.degree} in {edu.field}
                  </h4>
                  <span style={{ fontSize: '12px', color: '#7f8c8d' }}>{edu.graduation}</span>
                </div>
                <div style={{ fontSize: '12px', color: template.colors.secondary }}>
                  {edu.university} • {edu.location} • GPA: {edu.gpa}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ 
            color: template.colors.primary, 
            borderBottom: `1px solid ${template.colors.primary}`,
            paddingBottom: '5px',
            fontSize: '16px'
          }}>
            Skills
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <h4 style={{ fontSize: '13px', margin: '0 0 5px 0', color: template.colors.secondary }}>
                Technical Skills
              </h4>
              <span style={{ fontSize: '11px' }}>
                {skills.technical.join(', ')}
              </span>
            </div>
            <div>
              <h4 style={{ fontSize: '13px', margin: '0 0 5px 0', color: template.colors.secondary }}>
                Soft Skills
              </h4>
              <span style={{ fontSize: '11px' }}>
                {skills.soft.join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* Projects */}
        {projects.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ 
              color: template.colors.primary, 
              borderBottom: `1px solid ${template.colors.primary}`,
              paddingBottom: '5px',
              fontSize: '16px'
            }}>
              Projects
            </h3>
            {projects.map((project, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <h4 style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>
                  {project.name}
                </h4>
                <p style={{ fontSize: '11px', margin: '5px 0', fontStyle: 'italic' }}>
                  {project.description}
                </p>
                <div style={{ fontSize: '10px', color: '#7f8c8d', marginBottom: '3px' }}>
                  Technologies: {project.technologies.join(', ')}
                </div>
                <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                  {project.highlights.map((highlight, i) => (
                    <li key={i} style={{ fontSize: '10px', marginBottom: '2px' }}>{highlight}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }, [resumeData, selectedTemplate]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button 
          onClick={onBack}
          style={{
            background: 'transparent', color: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(255,255,255,0.2)', padding: '8px 18px',
            borderRadius: '20px', cursor: 'pointer', fontSize: '13px'
          }}
        >
          ← Back
        </button>
        <h1 style={{ color: '#FF6B35', fontSize: '22px', fontWeight: 'bold' }}>⚡ PathForge</h1>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Controls Bar */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={generateAIResume}
              disabled={isGenerating}
              style={{
                background: isGenerating ? '#95a5a6' : '#FF6B35',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: isGenerating ? 'not-allowed' : 'pointer'
              }}
            >
              {isGenerating ? '🤖 Generating...' : '🚀 AI Generate Resume'}
            </button>
            
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '10px 15px',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              {Object.entries(TEMPLATES).map(([key, template]) => (
                <option key={key} value={key} style={{ background: '#2c3e50' }}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              style={{
                background: isPreviewMode ? '#2ECC71' : 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              {isPreviewMode ? '✏️ Edit Mode' : '👁️ Preview Mode'}
            </button>
            
            <button onClick={exportToPDF} style={{
              background: '#3498DB',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              📄 Export PDF
            </button>
            
            <button onClick={exportToWord} style={{
              background: '#2ECC71',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              📝 Export Word
            </button>
          </div>
        </div>

        {/* Auto-save Status */}
        {autoSaveStatus && (
          <div style={{
            background: 'rgba(46,204,113,0.1)',
            border: '1px solid rgba(46,204,113,0.3)',
            borderRadius: '8px',
            padding: '10px 20px',
            marginBottom: '20px',
            fontSize: '14px',
            color: '#2ECC71',
            textAlign: 'center'
          }}>
            {autoSaveStatus}
          </div>
        )}

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: isPreviewMode ? '1fr' : '1fr 1fr', gap: '20px' }}>
          {/* Editor Panel */}
          {!isPreviewMode && (
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '20px',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Resume Editor</h2>
              
              {/* Personal Information */}
              <div style={{ marginBottom: '20px' }}>
                <h3 
                  onClick={() => setEditingSection(editingSection === 'personal' ? null : 'personal')}
                  style={{ 
                    cursor: 'pointer',
                    fontSize: '16px', 
                    marginBottom: '10px',
                    color: '#FF6B35',
                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                    paddingBottom: '5px'
                  }}
                >
                  👤 Personal Information {editingSection === 'personal' ? '▼' : '▶'}
                </h3>
                
                {editingSection === 'personal' && (
                  <div style={{ display: 'grid', gap: '10px' }}>
                    <input
                      placeholder="Full Name"
                      value={resumeData.personalInfo.name}
                      onChange={(e) => updateResumeData('personalInfo', 'name', e.target.value)}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <input
                      placeholder="Email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => updateResumeData('personalInfo', 'email', e.target.value)}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <input
                      placeholder="Phone"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => updateResumeData('personalInfo', 'phone', e.target.value)}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <textarea
                      placeholder="Professional Summary"
                      value={resumeData.personalInfo.summary}
                      onChange={(e) => updateResumeData('personalInfo', 'summary', e.target.value)}
                      rows={4}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Experience */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 
                    onClick={() => setEditingSection(editingSection === 'experience' ? null : 'experience')}
                    style={{ 
                      cursor: 'pointer',
                      fontSize: '16px', 
                      marginBottom: '10px',
                      color: '#FF6B35',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                      paddingBottom: '5px'
                    }}
                  >
                    💼 Experience {editingSection === 'experience' ? '▼' : '▶'}
                  </h3>
                  <button onClick={addExperience} style={{
                    background: '#2ECC71',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}>
                    + Add
                  </button>
                </div>
                
                {editingSection === 'experience' && resumeData.experience.map((exp, index) => (
                  <div key={index} style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '10px'
                  }}>
                    <input
                      placeholder="Job Title"
                      value={exp.title}
                      onChange={(e) => {
                        const newExp = [...resumeData.experience];
                        newExp[index].title = e.target.value;
                        setResumeData(prev => ({ ...prev, experience: newExp }));
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        marginBottom: '8px',
                        width: '100%'
                      }}
                    />
                    <input
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...resumeData.experience];
                        newExp[index].company = e.target.value;
                        setResumeData(prev => ({ ...prev, experience: newExp }));
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        marginBottom: '8px',
                        width: '100%'
                      }}
                    />
                    <input
                      placeholder="Duration (e.g., 2020 - Present)"
                      value={exp.duration}
                      onChange={(e) => {
                        const newExp = [...resumeData.experience];
                        newExp[index].duration = e.target.value;
                        setResumeData(prev => ({ ...prev, experience: newExp }));
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        marginBottom: '8px',
                        width: '100%'
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div style={{ marginBottom: '20px' }}>
                <h3 
                  onClick={() => setEditingSection(editingSection === 'skills' ? null : 'skills')}
                  style={{ 
                    cursor: 'pointer',
                    fontSize: '16px', 
                    marginBottom: '10px',
                    color: '#FF6B35',
                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                    paddingBottom: '5px'
                  }}
                >
                  🛠️ Skills {editingSection === 'skills' ? '▼' : '▶'}
                </h3>
                
                {editingSection === 'skills' && (
                  <div style={{ display: 'grid', gap: '15px' }}>
                    <div>
                      <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                        Technical Skills (comma-separated)
                      </label>
                      <input
                        value={resumeData.skills.technical.join(', ')}
                        onChange={(e) => updateResumeData('skills', 'technical', e.target.value.split(', ').filter(s => s.trim()))}
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          color: 'white',
                          padding: '10px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          width: '100%'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                        Soft Skills (comma-separated)
                      </label>
                      <input
                        value={resumeData.skills.soft.join(', ')}
                        onChange={(e) => updateResumeData('skills', 'soft', e.target.value.split(', ').filter(s => s.trim()))}
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          color: 'white',
                          padding: '10px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          width: '100%'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Preview Panel */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#2c3e50', fontSize: '20px', margin: 0 }}>
                📄 Resume Preview
              </h2>
              <span style={{ fontSize: '12px', color: '#7f8c8d' }}>
                Template: {TEMPLATES[selectedTemplate].name}
              </span>
            </div>
            
            <div style={{ transform: 'scale(0.8)', transformOrigin: 'top left', width: '125%' }}>
              {renderPreview()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
