import { useState, useMemo, useEffect } from 'react'
import './App.css'
import ResultsDashboard from './components/ResultsDashboard'

const DOMAIN_OPTIONS = [
  "Technology & Innovation",
  "Economic & Capital Systems",
  "Society & Culture",
  "Governance & Geopolitics",
  "Environment & Resources",
  "Infrastructure & Physical Systems",
  "Human Stability & Security"
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [isScanningFinished, setIsScanningFinished] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Build the dynamic flow of screens
  const flow = useMemo(() => {
    const screens = [];

    // Screen 1: Opening
    screens.push({
      id: 'opening',
      type: 'intro',
      header: 'Welcome',
      title: <>The future won’t arrive all at once.<br /><strong>It will break in different places, at different times.</strong></>,
      subtext: "This takes ~5 minutes. There are no right answers—just your perspective.",
      cta: "Begin",
      guideTitle: "Systems map the future",
      guideText: "Most people think about the future in isolated topics. In reality, systems are interconnected. This tool helps map how YOU see change unfolding.",
    });

    // Screen 2: Domain Selection
    screens.push({
      id: 'domains',
      type: 'multi-select',
      maxSelect: 3,
      header: 'Vulnerability',
      title: "Where do you believe the biggest disruptions are most likely to come from?",
      instruction: "Select up to 3",
      options: DOMAIN_OPTIONS,
      guideTitle: "Future Mapping Framework",
      guideText: "Everything is connected, but cascades have to start somewhere. Think about where the initial meaningful breakdown will realistically originate rather than selecting everything.",
      guideExamples: [
        "AI job displacement",
        "Inflation and markets",
        "Political instability",
        "Climate impacts",
        "Infrastructure breakdowns"
      ]
    });

    // Screens 3-5: Domain Deep Dives (Dynamic)
    selectedDomains.forEach(domain => {
      screens.push({
        id: `domain_${domain}`,
        type: 'domain_deep_dive',
        domain: domain,
        header: 'Domain deep dive',
        title: `Let's look at ${domain}`,
        guideTitle: `Assessing ${domain}`,
        guideText: `Consider the concrete signals and risks associated with ${domain}. How fragile is the current structure? What forces are eroding its stability?`,
        guideExamples: [
          "Stability scenario",
          "Mild disruption",
          "Major instability",
          "Breakdown scenario"
        ]
      });
    });

    // Screen 6: Adaptation Readiness
    screens.push({
      id: 'adaptation',
      type: 'single-select',
      header: 'Adaptation',
      title: "How far are you willing to change your life based on your beliefs about the future?",
      options: [
        "Stay mostly the same",
        "Make selective changes",
        "Make significant changes",
        "Redesign my life if needed"
      ],
      guideTitle: "Action, not belief",
      guideText: "Believing a disruption will happen is different than materially altering your daily life or trajectory in preparation for it.",
      guideExamples: [
        "Changing careers",
        "Relocating",
        "Learning new skills",
        "Adjusting lifestyle"
      ]
    });

    // Screen 7: Location Flexibility
    screens.push({
      id: 'location',
      type: 'single-select',
      header: 'Mobility',
      title: "How flexible are you when it comes to where you live?",
      options: [
        "Not able to move",
        "Limited flexibility",
        "Open to major relocation",
        "Highly flexible"
      ],
      guideTitle: "Geography as strategy",
      guideText: "Location may matter more than occupation in future scenarios. Physical distance from cascading failures is a primary defensive strategy.",
      guideExamples: [
        "Family constraints",
        "Work constraints",
        "Financial ability",
        "Legal/immigration limits"
      ]
    });

    // Screen 8: Self-Sufficiency
    screens.push({
      id: 'sufficiency',
      type: 'single-select',
      header: 'Resilience',
      title: "How much do you want to rely on yourself vs external systems?",
      options: [
        "Fully system-reliant",
        "Mostly system-reliant",
        "Hybrid",
        "Highly self-sufficient"
      ],
      guideTitle: "System Dependency",
      guideText: "How insulated are your daily basic needs from the complex supply chains and grids?",
      guideExamples: [
        "Food production",
        "Energy independence",
        "Income diversification"
      ]
    });

    // Screen 9: Community Orientation
    screens.push({
      id: 'community',
      type: 'single-select',
      header: 'Network',
      title: "How do you see other people fitting into your future strategy?",
      options: [
        "Mostly independent",
        "Family-focused",
        "Network-based",
        "Community-oriented"
      ],
      guideTitle: "Social Capital",
      guideText: "When systems fail, human coordination often replaces formal structures. Who is in your survival cohort?",
      guideExamples: [
        "Independent survival",
        "Family reliance",
        "Professional networks",
        "Intentional communities"
      ]
    });

    // Screen 10: Risk Response Style
    screens.push({
      id: 'risk',
      type: 'single-select',
      header: 'Strategy',
      title: "When you believe something is coming, how do you typically respond?",
      options: [
        "Optimize (adjust within system)",
        "Hedge (protect and diversify)",
        "Build (create new systems/life paths)",
        "Wait (delay action)"
      ],
      guideTitle: "Action Bias",
      guideText: "Understanding how you naturally convert anxiety or foresight into action helps define your best path forward.",
      guideExamples: [
        "Incremental improvement",
        "Diversification strategies",
        "Building alternatives",
        "Waiting for clarity"
      ]
    });

    // Screen 11: Reflection
    screens.push({
      id: 'reflection',
      type: 'single-select',
      header: 'Synthesis',
      title: "Which statement feels closest to how you see the future?",
      options: [
        "Things will adapt over time",
        "We’re entering instability",
        "Systems will need to be rebuilt"
      ],
      guideTitle: "Final Alignment",
      guideText: "This refines the nuance of your entire mapping. There are no right answers.",
      guideExamples: []
    });

    // Screen 12: Transition
    screens.push({
      id: 'transition',
      type: 'transition',
      header: 'Processing',
      title: "Mapping your future profile...",
      guideTitle: "Compiling Data",
      guideText: "Analyzing system interdependencies, risk exposure, and adaptation capacity."
    });

    return screens;
  }, [selectedDomains]);

  const screen = flow[currentStep];

  // Logic to simulate transition scan completion
  useEffect(() => {
    if (screen && screen.type === 'transition' && !isScanningFinished) {
      const timer = setTimeout(() => {
        setIsScanningFinished(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [screen, isScanningFinished]);

  // Helper for Option Selection
  const setResponse = (key, value) => {
    setResponses(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleDomain = (domain) => {
    if (selectedDomains.includes(domain)) {
      setSelectedDomains(prev => prev.filter(d => d !== domain));
    } else {
      if (selectedDomains.length < 3) {
        setSelectedDomains(prev => [...prev, domain]);
      }
    }
  };

  const canProceed = () => {
    if (screen.type === 'intro' || screen.type === 'transition') return true;
    if (screen.type === 'multi-select') return selectedDomains.length > 0;
    if (screen.type === 'domain_deep_dive') {
      const q1 = responses[`${screen.domain}_trust`];
      const q2 = responses[`${screen.domain}_timing`];
      return q1 && q2;
    }
    if (screen.type === 'single-select') return !!responses[screen.id];
    return false;
  };

  // If results mode is triggered, render dashboard
  if (showResults) {
    return <ResultsDashboard responses={responses} />;
  }

  const renderLeftPanel = () => {
    return (
      <div className="left-panel animate-fade-in" key={screen.id}>
        <span className="header-accent">{screen.header}</span>
        
        {/* Conditional rendering for Transition state vs Normal text */}
        {screen.type === 'transition' && isScanningFinished ? (
           <h2 className="question-title animate-fade-in" style={{color: 'var(--success-color)'}}>Profile Complete.</h2>
        ) : (
           <h2 className="question-title">{screen.title}</h2>
        )}
        
        {screen.subtext && <p style={{marginBottom: '3rem'}}>{screen.subtext}</p>}
        {screen.instruction && <p className="header-accent" style={{marginBottom: '1rem', color: 'var(--text-secondary)'}}>{screen.instruction}</p>}

        {screen.type === 'intro' && (
          <div className="navigation-controls" style={{justifyContent: 'flex-start'}}>
            <button onClick={handleNext} style={{padding: '1rem 3rem', fontSize: '1.25rem'}}>{screen.cta}</button>
          </div>
        )}

        {screen.type === 'single-select' && (
          <div className="options-container">
            {screen.options.map((opt, i) => (
              <div 
                key={opt} 
                className={`option-card ${responses[screen.id] === opt ? 'selected' : ''}`}
                onClick={() => { setResponse(screen.id, opt); setTimeout(handleNext, 400); }}
                style={{animationDelay: `${i * 100}ms`}}
              >
                {opt}
              </div>
            ))}
          </div>
        )}

        {screen.type === 'multi-select' && (
          <>
            <div className="options-container">
              {screen.options.map((opt, i) => (
                <div 
                  key={opt} 
                  className={`option-card ${selectedDomains.includes(opt) ? 'selected' : ''}`}
                  onClick={() => toggleDomain(opt)}
                >
                  {opt}
                </div>
              ))}
            </div>
          </>
        )}

        {screen.type === 'domain_deep_dive' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <p style={{color: 'var(--text-primary)', marginBottom: '1rem', fontWeight: 500}}>How stable do you believe this system will be?</p>
              <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                {['High trust', 'Moderate trust', 'Low trust', 'Very low trust'].map(opt => (
                  <div key={opt} 
                    className={`option-card ${responses[`${screen.domain}_trust`] === opt ? 'selected' : ''}`}
                    style={{padding: '0.75rem 1rem', fontSize: '0.9rem', flex: '1 1 calc(50% - 1rem)'}}
                    onClick={() => setResponse(`${screen.domain}_trust`, opt)}>
                    {opt}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p style={{color: 'var(--text-primary)', marginBottom: '1rem', fontWeight: 500}}>When do you think major disruption begins?</p>
              <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                {['0–2 years', '2–5 years', '5–15 years', '15+ years'].map(opt => (
                  <div key={opt} 
                    className={`option-card ${responses[`${screen.domain}_timing`] === opt ? 'selected' : ''}`}
                    style={{padding: '0.75rem 1rem', fontSize: '0.9rem', flex: '1 1 calc(50% - 1rem)'}}
                    onClick={() => setResponse(`${screen.domain}_timing`, opt)}>
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {screen.type === 'transition' && (
          <>
            {!isScanningFinished ? (
              <div className="network-animation animate-fade-in" style={{minHeight: '200px'}}>
                <div className="node"></div>
              </div>
            ) : (
              <div className="navigation-controls animate-fade-in" style={{justifyContent: 'flex-start', marginTop: '2rem'}}>
                <button onClick={() => setShowResults(true)} style={{padding: '1rem 3rem', fontSize: '1.25rem'}}>
                  Click to Continue
                </button>
              </div>
            )}
          </>
        )}

        {screen.type !== 'intro' && screen.type !== 'transition' && (
          <div className="navigation-controls">
            <button className="nav-btn secondary" onClick={handleBack} disabled={currentStep === 0}>Back</button>
            <button className="nav-btn" onClick={handleNext} disabled={!canProceed()}>Continue</button>
          </div>
        )}
      </div>
    );
  };

  const renderRightPanel = () => {
    return (
      <div className="right-panel">
        <div className="guidance-content animate-fade-in" key={`guide-${screen.id}`}>
          {screen.type === 'transition' && isScanningFinished ? (
            <>
              <h3 className="guidance-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--success-color)'}}>
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Processing Complete
              </h3>
              <p className="guidance-text">Your responses have been mapped against the Future Modeling Framework.</p>
            </>
          ) : (
            <>
              <h3 className="guidance-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--accent-color)'}}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                {screen.guideTitle}
              </h3>
              <p className="guidance-text">{screen.guideText}</p>
            </>
          )}

          {screen.guideExamples && screen.guideExamples.length > 0 && (
             <ul className="guidance-examples">
                {screen.guideExamples.map(ex => <li key={ex}>{ex}</li>)}
             </ul>
          )}

          {screen.type === 'intro' && (
             <div className="insight-box delay-200">
               <span className="insight-label">System Insight</span>
               <span>The future is not a monolith. It emerges through cascading failures and specific innovations.</span>
             </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="bg-glow"></div>
      <div className="bg-glow-2"></div>
      <div className="layout">
        {renderLeftPanel()}
        {renderRightPanel()}
      </div>
    </div>
  )
}

export default App
