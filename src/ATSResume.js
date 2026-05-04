import React, { useState, useRef, useEffect } from 'react';

const TEMPLATES = {
  modern: {
    name: 'Modern',
    colors: { primary: '#2c3e50', secondary: '#3498db', accent: '#e74c3c' },
    layout: 'two-column'
  },
  classic: {
    name: 'Classic',
    colors: { primary: '#2c3e50', secondary: '#7f8c8d', accent: '#34495e' },
    layout: 'single-column'
  },
  creative: {
    name: 'Creative',
    colors: { primary: '#8e44ad', secondary: '#e67e22', accent: '#16a085' },
    layout: 'sidebar'
  }
};

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

function ATSResume({ userData, onBack, onProgressUpdate, theme }) {
  const defaultTheme = {
    pageBg: '#F3F2EF',
    cardBg: '#FFFFFF',
    inputBg: '#F9F9F9',
    border: '#D0D0D0',
    textPrimary: '#000000',
    textMuted: '#666666',
    accent: '#0A66C2',
    accentHover: '#004182',
    accentLight: '#0A66C2',
    success: '#057642',
    warning: '#B06B00',
    error: '#CC1016',
  };
  const currentTheme = theme || defaultTheme;
  const [formData, setFormData] = useState({
    fullName: userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    location: userData?.city || '',
    website: userData?.website || '',
    linkedin: userData?.linkedin || '',
    github: userData?.github || '',
    summary: userData?.bio || '',
    experience: userData?.experience || [],
    education: userData?.education || [],
    skills: userData?.skills || [],
    projects: userData?.projects || [],
    certifications: userData?.certifications || [],
    languages: userData?.languages || []
  });

  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isEditing, setIsEditing] = useState(true);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [resumeScore, setResumeScore] = useState(0);
  const [validationErrors, setValidationErrors] = useState([]);
  const fileInputRef = useRef(null);

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.fullName || formData.email) {
        saveResumeData();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData]);

  // Validate and score resume
  useEffect(() => {
    validateResume();
  }, [formData]);

  const saveResumeData = async () => {
    try {
      if (onProgressUpdate) {
        await onProgressUpdate({
          resumeData: formData,
          lastSaved: new Date().toISOString()
        });
      }
      setAutoSaveStatus('Auto-saved');
      setTimeout(() => setAutoSaveStatus(''), 2000);
    } catch (error) {
      console.error('Error saving resume:', error);
      setAutoSaveStatus('Save failed');
      setTimeout(() => setAutoSaveStatus(''), 2000);
    }
  };

  const validateResume = () => {
    const errors = [];
    let score = 0;

    if (!formData.fullName) errors.push('Full name is required');
    else score += 10;
    
    if (!formData.email) errors.push('Email is required');
    else score += 10;
    
    if (!formData.phone) errors.push('Phone is required');
    else score += 10;
    
    if (!formData.summary || formData.summary.length < 50) {
      errors.push('Professional summary should be at least 50 characters');
    } else score += 15;
    
    if (formData.experience.length === 0) {
      errors.push('Add at least one work experience');
    } else score += 20;
    
    if (formData.education.length === 0) {
      errors.push('Add at least one education entry');
    } else score += 15;
    
    if (formData.skills.length === 0) {
      errors.push('Add at least one skill');
    } else score += 10;
    
    if (formData.projects.length > 0) score += 5;
    if (formData.certifications.length > 0) score += 5;

    setValidationErrors(errors);
    setResumeScore(score);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { 
        company: '', 
        position: '', 
        duration: '', 
        location: '',
        description: '',
        achievements: []
      }]
    }));
  };

  const updateExperience = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { 
        institution: '', 
        degree: '', 
        field: '',
        year: '',
        gpa: '',
        honors: ''
      }]
    }));
  };

  const updateEducation = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', level: 'Intermediate' }]
    }));
  };

  const updateSkill = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { 
        name: '', 
        description: '', 
        technologies: [],
        link: '',
        duration: ''
      }]
    }));
  };

  const updateProject = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  const removeProject = (index) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { 
        name: '', 
        issuer: '', 
        date: '',
        credentialId: '',
        credentialUrl: ''
      }]
    }));
  };

  const updateCertification = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => 
        i === index ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const removeCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const addLanguage = () => {
    setFormData(prev => ({
      ...prev,
      languages: [...prev.languages, { name: '', proficiency: 'Intermediate' }]
    }));
  };

  const updateLanguage = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.map((lang, i) => 
        i === index ? { ...lang, [field]: value } : lang
      )
    }));
  };

  const removeLanguage = (index) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const exportToPDF = () => {
    window.print();
  };

  const exportToWord = () => {
    alert('Word export feature coming soon! For now, use browser print (Ctrl+P)');
  };

  const renderTemplate = () => {
    const template = TEMPLATES[selectedTemplate];
    
    if (template.layout === 'two-column') {
      return renderModernTemplate();
    } else if (template.layout === 'single-column') {
      return renderClassicTemplate();
    } else {
      return renderCreativeTemplate();
    }
  };

  const renderModernTemplate = () => (
    <div style={{ background: 'white', color: 'black', padding: '40px', borderRadius: '12px', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '3px solid #3498db', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2c3e50', margin: '0 0 10px 0' }}>
          {formData.fullName || 'Your Name'}
        </h1>
        <p style={{ color: '#7f8c8d', margin: '0 0 10px 0', fontSize: '14px' }}>
          {formData.email} | {formData.phone} | {formData.location}
        </p>
        <p style={{ color: '#7f8c8d', margin: '0', fontSize: '12px' }}>
          {formData.website && `${formData.website} | `}{formData.linkedin && `LinkedIn: ${formData.linkedin}`}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '30px' }}>
        {/* Left Column */}
        <div style={{ flex: '2' }}>
          {formData.summary && (
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#3498db', marginBottom: '10px' }}>
                PROFESSIONAL SUMMARY
              </h2>
              <p style={{ color: '#34495e', lineHeight: '1.5', fontSize: '13px' }}>{formData.summary}</p>
            </div>
          )}

          {formData.experience.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#3498db', marginBottom: '15px' }}>
                PROFESSIONAL EXPERIENCE
              </h2>
              {formData.experience.map((exp, index) => (
                <div key={index} style={{ marginBottom: '15px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c3e50', margin: '0 0 5px 0' }}>
                    {exp.position}
                  </h3>
                  <p style={{ color: '#7f8c8d', fontSize: '12px', margin: '0 0 5px 0', fontStyle: 'italic' }}>
                    {exp.company} | {exp.location} | {exp.duration}
                  </p>
                  <p style={{ color: '#34495e', fontSize: '12px', lineHeight: '1.4' }}>{exp.description}</p>
                </div>
              ))}
            </div>
          )}

          {formData.projects.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#3498db', marginBottom: '15px' }}>
                PROJECTS
              </h2>
              {formData.projects.map((project, index) => (
                <div key={index} style={{ marginBottom: '15px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c3e50', margin: '0 0 5px 0' }}>
                    {project.name}
                  </h3>
                  <p style={{ color: '#7f8c8d', fontSize: '12px', margin: '0 0 5px 0' }}>
                    {project.duration}
                  </p>
                  <p style={{ color: '#34495e', fontSize: '12px', lineHeight: '1.4' }}>{project.description}</p>
                  {project.technologies.length > 0 && (
                    <p style={{ color: '#7f8c8d', fontSize: '11px', margin: '5px 0' }}>
                      <strong>Technologies:</strong> {project.technologies.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={{ flex: '1' }}>
          {formData.skills.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#3498db', marginBottom: '10px' }}>
                SKILLS
              </h2>
              {formData.skills.map((skill, index) => (
                <div key={index} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#2c3e50' }}>{skill.name}</span>
                    <span style={{ fontSize: '10px', color: '#7f8c8d' }}>{skill.level}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {formData.education.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#3498db', marginBottom: '10px' }}>
                EDUCATION
              </h2>
              {formData.education.map((edu, index) => (
                <div key={index} style={{ marginBottom: '15px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c3e50', margin: '0 0 5px 0' }}>
                    {edu.degree}
                  </h3>
                  <p style={{ color: '#7f8c8d', fontSize: '12px', margin: '0 0 5px 0' }}>
                    {edu.institution}
                  </p>
                  <p style={{ color: '#7f8c8d', fontSize: '11px', margin: '0' }}>
                    {edu.field && `${edu.field} | `}{edu.year}
                  </p>
                </div>
              ))}
            </div>
          )}

          {formData.certifications.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#3498db', marginBottom: '10px' }}>
                CERTIFICATIONS
              </h2>
              {formData.certifications.map((cert, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#2c3e50', margin: '0 0 3px 0' }}>
                    {cert.name}
                  </h3>
                  <p style={{ color: '#7f8c8d', fontSize: '10px', margin: '0' }}>
                    {cert.issuer} | {cert.date}
                  </p>
                </div>
              ))}
            </div>
          )}

          {formData.languages.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#3498db', marginBottom: '10px' }}>
                LANGUAGES
              </h2>
              {formData.languages.map((lang, index) => (
                <div key={index} style={{ marginBottom: '5px' }}>
                  <span style={{ fontSize: '12px', color: '#2c3e50' }}>
                    {lang.name} - {lang.proficiency}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderClassicTemplate = () => (
    <div style={{ background: 'white', color: 'black', padding: '40px', borderRadius: '12px', fontFamily: 'Times New Roman, serif' }}>
      {/* Classic single-column layout */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#2c3e50', margin: '0 0 10px 0' }}>
          {formData.fullName || 'Your Name'}
        </h1>
        <p style={{ color: '#7f8c8d', margin: '0 0 10px 0', fontSize: '14px' }}>
          {formData.email} | {formData.phone} | {formData.location}
        </p>
      </div>

      {formData.summary && (
        <div style={{ marginBottom: '25px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '10px', textTransform: 'uppercase' }}>
            Professional Summary
          </h2>
          <p style={{ color: '#34495e', lineHeight: '1.5', fontSize: '13px' }}>{formData.summary}</p>
        </div>
      )}

      {formData.experience.length > 0 && (
        <div style={{ marginBottom: '25px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '15px', textTransform: 'uppercase' }}>
            Experience
          </h2>
          {formData.experience.map((exp, index) => (
            <div key={index} style={{ marginBottom: '15px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c3e50', margin: '0 0 5px 0' }}>
                {exp.position} - {exp.company}
              </h3>
              <p style={{ color: '#7f8c8d', fontSize: '12px', margin: '0 0 5px 0', fontStyle: 'italic' }}>
                {exp.duration}
              </p>
              <p style={{ color: '#34495e', fontSize: '12px', lineHeight: '1.4' }}>{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {formData.education.length > 0 && (
        <div style={{ marginBottom: '25px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '15px', textTransform: 'uppercase' }}>
            Education
          </h2>
          {formData.education.map((edu, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c3e50', margin: '0 0 5px 0' }}>
                {edu.degree}
              </h3>
              <p style={{ color: '#7f8c8d', fontSize: '12px', margin: '0' }}>
                {edu.institution} - {edu.year}
              </p>
            </div>
          ))}
        </div>
      )}

      {formData.skills.length > 0 && (
        <div style={{ marginBottom: '25px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '10px', textTransform: 'uppercase' }}>
            Skills
          </h2>
          <p style={{ color: '#34495e', fontSize: '12px' }}>
            {formData.skills.map(skill => skill.name).join(', ')}
          </p>
        </div>
      )}
    </div>
  );

  const renderCreativeTemplate = () => (
    <div style={{ background: 'white', color: 'black', borderRadius: '12px', fontFamily: 'Arial, sans-serif', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ background: '#8e44ad', color: 'white', padding: '30px', width: '250px', borderRadius: '12px 0 0 12px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 20px 0' }}>
          {formData.fullName || 'Your Name'}
        </h1>
        
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', textTransform: 'uppercase' }}>Contact</h3>
          <p style={{ fontSize: '12px', margin: '5px 0' }}>{formData.email}</p>
          <p style={{ fontSize: '12px', margin: '5px 0' }}>{formData.phone}</p>
          <p style={{ fontSize: '12px', margin: '5px 0' }}>{formData.location}</p>
        </div>

        {formData.skills.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', textTransform: 'uppercase' }}>Skills</h3>
            {formData.skills.map((skill, index) => (
              <div key={index} style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{skill.name}</div>
                <div style={{ background: 'rgba(255,255,255,0.3)', height: '4px', borderRadius: '2px', marginTop: '3px' }}>
                  <div style={{ 
                    background: '#16a085', 
                    height: '100%', 
                    borderRadius: '2px',
                    width: `${(SKILL_LEVELS.indexOf(skill.level) + 1) * 25}%`
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {formData.languages.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', textTransform: 'uppercase' }}>Languages</h3>
            {formData.languages.map((lang, index) => (
              <p key={index} style={{ fontSize: '12px', margin: '5px 0' }}>
                {lang.name} - {lang.proficiency}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: '1', padding: '30px' }}>
        {formData.summary && (
          <div style={{ marginBottom: '25px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#8e44ad', marginBottom: '10px' }}>
              About Me
            </h2>
            <p style={{ color: '#34495e', lineHeight: '1.5', fontSize: '13px' }}>{formData.summary}</p>
          </div>
        )}

        {formData.experience.length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#8e44ad', marginBottom: '15px' }}>
              Experience
            </h2>
            {formData.experience.map((exp, index) => (
              <div key={index} style={{ marginBottom: '15px', borderLeft: '3px solid #e67e22', paddingLeft: '15px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c3e50', margin: '0 0 5px 0' }}>
                  {exp.position}
                </h3>
                <p style={{ color: '#e67e22', fontSize: '12px', margin: '0 0 5px 0', fontWeight: 'bold' }}>
                  {exp.company} | {exp.duration}
                </p>
                <p style={{ color: '#34495e', fontSize: '12px', lineHeight: '1.4' }}>{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {formData.education.length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#8e44ad', marginBottom: '15px' }}>
              Education
            </h2>
            {formData.education.map((edu, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c3e50', margin: '0 0 5px 0' }}>
                  {edu.degree}
                </h3>
                <p style={{ color: '#7f8c8d', fontSize: '12px', margin: '0' }}>
                  {edu.institution} | {edu.year}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '8px',
    border: '1px solid ' + currentTheme.border,
    borderRadius: '8px',
    background: currentTheme.inputBg,
    color: currentTheme.textPrimary,
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const sectionStyle = {
    background: currentTheme.cardBg,
    border: '1px solid ' + currentTheme.border,
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px'
  };

  return (
    <div style={{ minHeight: '100vh', background: currentTheme.pageBg, color: currentTheme.textPrimary, padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: currentTheme.accent, margin: '0 0 5px 0' }}>
              Advanced ATS Resume Builder
            </h1>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: currentTheme.textMuted }}>Resume Score:</span>
                <span style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  color: resumeScore >= 80 ? currentTheme.success : resumeScore >= 60 ? currentTheme.warning : currentTheme.error 
                }}>
                  {resumeScore}/100
                </span>
              </div>
              {autoSaveStatus && (
                <span style={{ fontSize: '12px', color: currentTheme.success }}>{autoSaveStatus}</span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setIsEditing(!isEditing)}
              style={{
                background: isEditing ? currentTheme.success : currentTheme.accent,
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {isEditing ? 'Preview' : 'Edit'}
            </button>
            <button
              onClick={onBack}
              style={{
                background: 'transparent',
                color: currentTheme.textMuted,
                border: `1px solid ${currentTheme.border}`,
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Back
            </button>
          </div>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div style={{
            background: currentTheme.error + '20',
            border: '1px solid ' + currentTheme.error + '4D',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: currentTheme.error, fontSize: '14px', margin: '0 0 10px 0' }}>Please fix these issues:</h3>
            <ul style={{ margin: '0', paddingLeft: '20px' }}>
              {validationErrors.map((error, index) => (
                <li key={index} style={{ color: currentTheme.error, fontSize: '12px', marginBottom: '5px' }}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {isEditing ? (
          /* Edit Mode */
          <div style={{ display: 'flex', gap: '20px' }}>
            {/* Left Column */}
            <div style={{ flex: '1' }}>
              {/* Template Selection */}
              <div style={sectionStyle}>
                <h2 style={{ fontSize: '18px', marginBottom: '15px', color: currentTheme.accent }}>Choose Template</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {Object.entries(TEMPLATES).map(([key, template]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTemplate(key)}
                      style={{
                        background: selectedTemplate === key ? currentTheme.accent : currentTheme.inputBg,
                        color: '#FFFFFF',
                        border: `1px solid ${currentTheme.border}`,
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Information */}
              <div style={sectionStyle}>
                <h2 style={{ fontSize: '18px', marginBottom: '15px', color: currentTheme.accent }}>Personal Information</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input
                    style={inputStyle}
                    placeholder="Full Name *"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                  />
                  <input
                    style={inputStyle}
                    placeholder="Email *"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                  <input
                    style={inputStyle}
                    placeholder="Phone *"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                  <input
                    style={inputStyle}
                    placeholder="Location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                  <input
                    style={inputStyle}
                    placeholder="Website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                  />
                  <input
                    style={inputStyle}
                    placeholder="LinkedIn"
                    value={formData.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  />
                </div>
                <textarea
                  style={{ ...inputStyle, minHeight: '100px' }}
                  placeholder="Professional Summary (min 50 characters) *"
                  value={formData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                />
              </div>

              {/* Experience */}
              <div style={sectionStyle}>
                <h2 style={{ fontSize: '18px', marginBottom: '15px', color: currentTheme.accent }}>Work Experience</h2>
                {formData.experience.map((exp, index) => (
                  <div key={index} style={{ background: currentTheme.inputBg, padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <input
                        style={{ ...inputStyle, marginBottom: '8px' }}
                        placeholder="Position"
                        value={exp.position}
                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                      />
                      <input
                        style={{ ...inputStyle, marginBottom: '8px' }}
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      />
                      <input
                        style={{ ...inputStyle, marginBottom: '8px' }}
                        placeholder="Duration (e.g., Jan 2020 - Present)"
                        value={exp.duration}
                        onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                      />
                      <input
                        style={{ ...inputStyle, marginBottom: '8px' }}
                        placeholder="Location"
                        value={exp.location}
                        onChange={(e) => updateExperience(index, 'location', e.target.value)}
                      />
                    </div>
                    <textarea
                      style={{ ...inputStyle, minHeight: '80px' }}
                      placeholder="Job description and achievements..."
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    />
                    <button
                      onClick={() => removeExperience(index)}
                      style={{
                        background: currentTheme.error,
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        marginTop: '8px'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={addExperience}
                  style={{
                    background: currentTheme.accentLight,
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Add Experience
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div style={{ flex: '1' }}>
              {/* Education */}
              <div style={sectionStyle}>
                <h2 style={{ fontSize: '18px', marginBottom: '15px', color: currentTheme.accent }}>Education</h2>
                {formData.education.map((edu, index) => (
                  <div key={index} style={{ background: currentTheme.inputBg, padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <input
                        style={{ ...inputStyle, marginBottom: '8px' }}
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      />
                      <input
                        style={{ ...inputStyle, marginBottom: '8px' }}
                        placeholder="Institution"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      />
                      <input
                        style={{ ...inputStyle, marginBottom: '8px' }}
                        placeholder="Field of Study"
                        value={edu.field}
                        onChange={(e) => updateEducation(index, 'field', e.target.value)}
                      />
                      <input
                        style={{ ...inputStyle, marginBottom: '8px' }}
                        placeholder="Year"
                        value={edu.year}
                        onChange={(e) => updateEducation(index, 'year', e.target.value)}
                      />
                    </div>
                    <button
                      onClick={() => removeEducation(index)}
                      style={{
                        background: currentTheme.error,
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        marginTop: '8px'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={addEducation}
                  style={{
                    background: currentTheme.accentLight,
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Add Education
                </button>
              </div>

              {/* Skills */}
              <div style={sectionStyle}>
                <h2 style={{ fontSize: '18px', marginBottom: '15px', color: currentTheme.accent }}>Skills</h2>
                {formData.skills.map((skill, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input
                      style={{ ...inputStyle, marginBottom: '0', flex: '2' }}
                      placeholder="Skill name"
                      value={skill.name}
                      onChange={(e) => updateSkill(index, 'name', e.target.value)}
                    />
                    <select
                      style={{ ...inputStyle, marginBottom: '0', flex: '1' }}
                      value={skill.level}
                      onChange={(e) => updateSkill(index, 'level', e.target.value)}
                    >
                      {SKILL_LEVELS.map(level => (
                        <option key={level} value={level} style={{ background: currentTheme.cardBg }}>{level}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeSkill(index)}
                      style={{
                        background: currentTheme.error,
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={addSkill}
                  style={{
                    background: currentTheme.accentLight,
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Add Skill
                </button>
              </div>

              {/* Projects */}
              <div style={sectionStyle}>
                <h2 style={{ fontSize: '18px', marginBottom: '15px', color: currentTheme.accent }}>Projects</h2>
                {formData.projects.map((project, index) => (
                  <div key={index} style={{ background: currentTheme.inputBg, padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
                    <input
                      style={{ ...inputStyle, marginBottom: '8px' }}
                      placeholder="Project Name"
                      value={project.name}
                      onChange={(e) => updateProject(index, 'name', e.target.value)}
                    />
                    <textarea
                      style={{ ...inputStyle, minHeight: '60px' }}
                      placeholder="Project description..."
                      value={project.description}
                      onChange={(e) => updateProject(index, 'description', e.target.value)}
                    />
                    <button
                      onClick={() => removeProject(index)}
                      style={{
                        background: currentTheme.error,
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        marginTop: '8px'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={addProject}
                  style={{
                    background: currentTheme.accentLight,
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Add Project
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Preview Mode */
          <div>
            {/* Export Options */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
              <button
                onClick={exportToPDF}
                style={{
                  background: currentTheme.accent,
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                📄 Export to PDF
              </button>
              <button
                onClick={exportToWord}
                style={{
                  background: currentTheme.accentLight,
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                📝 Export to Word
              </button>
            </div>

            {/* Resume Preview */}
            {renderTemplate()}
          </div>
        )}
      </div>
    </div>
  );
}

export default ATSResume;
