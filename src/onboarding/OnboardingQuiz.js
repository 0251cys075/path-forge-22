import React, { useState } from 'react';
import ChooseYourPath from './ChooseYourPath';
import TrackSelection from './TrackSelection';
import BeginnerFlow from './BeginnerFlow';
import ExperiencedFlow from './ExperiencedFlow';
import ResultScreen from './ResultScreen';

const defaultTheme = { pageBg:'#1D2226', cardBg:'#1B1F23', inputBg:'#283039', border:'#38434F', textPrimary:'#E7E9EA', textMuted:'#B0B7BF', accent:'#0A66C2', accentHover:'#004182', accentLight:'#70B5F9', success:'#057642', warning:'#F5C518', error:'#CC1016' };

export default function OnboardingQuiz({ onComplete, onBack, theme = defaultTheme }) {
  const [currentStep, setCurrentStep] = useState('choose-path');
  const [experienceLevel, setExperienceLevel] = useState(null);
  const [trackId, setTrackId] = useState(null);
  const [quizData, setQuizData] = useState({});

  const handleChoosePath = (level) => {
    setExperienceLevel(level);
    setCurrentStep('track-selection');
  };

  const handleTrackSelection = (track) => {
    setTrackId(track);
    
    if (experienceLevel === 'beginner') {
      setCurrentStep('beginner-flow');
    } else {
      setCurrentStep('experienced-flow');
    }
  };

  const handleBeginnerComplete = (data) => {
    const result = {
      ...data,
      completedAt: new Date().toISOString()
    };
    setQuizData(result);
    setCurrentStep('result');
  };

  const handleExperiencedComplete = (data) => {
    const result = {
      ...data,
      completedAt: new Date().toISOString()
    };
    setQuizData(result);
    setCurrentStep('result');
  };

  const handleResultComplete = (finalResult) => {
    // Save the complete onboarding data
    const completeData = {
      ...finalResult,
      onboardingCompleted: true,
      onboardingVersion: '1.0'
    };
    onComplete(completeData);
  };

  const handleTryDifferentTrack = () => {
    setCurrentStep('track-selection');
    setTrackId(null);
    // Keep experience level but reset track selection
  };

  const handleBack = () => {
    if (currentStep === 'track-selection') {
      setCurrentStep('choose-path');
      setExperienceLevel(null);
    } else if (currentStep === 'beginner-flow' || currentStep === 'experienced-flow') {
      setCurrentStep('track-selection');
      setTrackId(null);
    } else if (currentStep === 'result') {
      // From result screen, exit onboarding completely
      onBack();
    } else {
      onBack();
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'choose-path':
        return (
          <ChooseYourPath
            onNext={handleChoosePath}
            onBack={onBack}
            theme={theme}
          />
        );
      
      case 'track-selection':
        return (
          <TrackSelection
            onNext={handleTrackSelection}
            onBack={handleBack}
            experienceLevel={experienceLevel}
            theme={theme}
          />
        );
      
      case 'beginner-flow':
        return (
          <BeginnerFlow
            onNext={handleBeginnerComplete}
            onBack={handleBack}
            trackId={trackId}
            theme={theme}
          />
        );
      
      case 'experienced-flow':
        return (
          <ExperiencedFlow
            onNext={handleExperiencedComplete}
            onBack={handleBack}
            trackId={trackId}
            theme={theme}
          />
        );
      
      case 'result':
        return (
          <ResultScreen
            onComplete={handleResultComplete}
            onBack={handleBack}
            onTryDifferentTrack={handleTryDifferentTrack}
            result={quizData}
            theme={theme}
          />
        );
      
      default:
        return null;
    }
  };

  return renderCurrentStep();
}
