import React, { useState, useMemo } from 'react';
import { deriveScoresFromDomains } from '../logic/domainModel';
import { rankArchetypes } from '../logic/archetypeEngine';
import RadarChart from './RadarChart';
import '../AdvancedExploration.css';

const domainKeyMap = {
  "Technology & Innovation": "technology",
  "Economic & Capital Systems": "economy",
  "Society & Culture": "society",
  "Governance & Geopolitics": "governance",
  "Environment & Resources": "environment",
  "Infrastructure & Physical Systems": "infrastructure",
  "Human Stability & Security": "human_stability"
};

const mapRisk = (val) => {
  if (val?.includes("High")) return 100;
  if (val?.includes("Moderate")) return 66;
  if (val?.includes("Very low")) return 0;
  if (val?.includes("Low")) return 33;
  return 50;
};

const mapTiming = (val) => {
  if (val === '0–2 years') return 100;
  if (val === '2–5 years') return 75;
  if (val === '5–15 years') return 50;
  if (val === '15+ years') return 25;
  return 50;
};

const mapOption = (val, type) => {
  const map = {
    ai: {
      "Stay mostly the same": 10,
      "Make selective changes": 40,
      "Make significant changes": 70,
      "Redesign my life if needed": 100
    },
    mrp: {
      "Not able to move": 10,
      "Limited flexibility": 40,
      "Open to major relocation": 70,
      "Highly flexible": 100
    },
    ap: {
      "Fully system-reliant": 10,
      "Mostly system-reliant": 40,
      "Hybrid": 70,
      "Highly self-sufficient": 100
    },
    co: {
      "Mostly independent": 20,
      "Family-focused": 40,
      "Network-based": 70,
      "Community-oriented": 100
    }
  };
  return map[type][val] || 50;
};

const Slider = ({ label, value, onChange, derivedVal, hint, subtitle }) => (
  <div className="adv-slider-group">
    <div className="adv-slider-header">
      <span><strong>{label}</strong> {subtitle && <span style={{fontWeight:'normal'}}>({subtitle})</span>}</span>
      <strong>{value}</strong>
    </div>
    <div className="slider-wrapper">
      <input 
        type="range" 
        className="adv-range"
        min="0" 
        max="100" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {derivedVal !== undefined && (
        <div 
          className="derived-marker"
          style={{ left: `${derivedVal}%` }} 
          title={`Domain model suggests: ${derivedVal}`}
        />
      )}
    </div>
    <div className="adv-slider-labels">
      <span>Less</span>
      <span>More</span>
    </div>
    {derivedVal !== undefined && (
      <div style={{fontSize: '0.7rem', color: '#8A8F98', marginTop: '0.25rem'}}>
        Domain model suggests {derivedVal} • adjusted {value >= derivedVal ? 'up' : 'down'} by {Math.abs(value - derivedVal)}
      </div>
    )}
  </div>
);

const DeltaRow = ({ label, code, value, derived }) => {
  const diff = value - derived;
  let colorClass = 'neutral';
  if (diff > 0) colorClass = 'positive';
  if (diff < 0) colorClass = 'negative';
  return (
    <div className="delta-item">
      <div>
        <span style={{color: '#8A8F98', marginRight: '0.5rem'}}>{code}</span>
        <span>{label}</span>
      </div>
      <div className={`delta-val ${colorClass}`}>
        {diff > 0 ? '+' : ''}{diff}
      </div>
    </div>
  );
};

export default function AdvancedExploration({ responses, selectedDomains, onComplete }) {
  const [showAllDomains, setShowAllDomains] = useState(false);

  // Initial derived state from responses
  const initialDomainsState = useMemo(() => {
    return Object.keys(domainKeyMap).map(rawName => {
      const isSelected = selectedDomains.includes(rawName);
      return {
        key: domainKeyMap[rawName],
        rawName,
        selected: isSelected,
        risk: isSelected ? mapRisk(responses[`domain_${rawName}_risk`]) : 50,
        timing: isSelected ? mapTiming(responses[`domain_${rawName}_timing`]) : 50
      };
    });
  }, [responses, selectedDomains]);

  // Local state for domains so user can tweak them
  const [domainsState, setDomainsState] = useState(initialDomainsState);

  // Derived scores update whenever domains change
  const derived = useMemo(() => deriveScoresFromDomains(domainsState), [domainsState]);

  // One-time init of adjusted scores
  const initialAdjusted = useMemo(() => {
    return {
      ifs: derived.ifs,
      du: derived.du,
      toc: derived.toc,
      ai: mapOption(responses.adaptation, 'ai'),
      mrp: mapOption(responses.location, 'mrp'),
      ap: mapOption(responses.sufficiency, 'ap'),
      co: mapOption(responses.community, 'co')
    };
  }, []);

  const [adjustedScores, setAdjustedScores] = useState(initialAdjusted);

  const handleDomainChange = (key, field, value) => {
    setDomainsState(prev => prev.map(d => 
      d.key === key ? { ...d, [field]: Number(value) } : d
    ));
  };

  const toggleDomainSelection = (key) => {
    setDomainsState(prev => prev.map(d => 
      d.key === key ? { ...d, selected: !d.selected } : d
    ));
  };

  const handleSliderChange = (key, value) => {
    setAdjustedScores(prev => ({ ...prev, [key]: Number(value) }));
  };

  const applyDomainModel = () => {
    setAdjustedScores(prev => ({
      ...prev,
      ifs: derived.ifs,
      du: derived.du,
      toc: derived.toc
    }));
  };

  const results = useMemo(() => rankArchetypes(adjustedScores), [adjustedScores]);
  const { primary, secondary, ranked, confidence } = results;

  const handleLockIn = () => {
    const deltas = {
      ifs: adjustedScores.ifs - derived.ifs,
      du: adjustedScores.du - derived.du,
      toc: adjustedScores.toc - derived.toc
    };
    onComplete({ derived, adjustedScores, deltas, primary, secondary, ranked, confidence, domainsState });
  };

  const visibleDomains = showAllDomains ? domainsState : domainsState.filter(d => d.selected);

  return (
    <div style={{background: '#0B0B0F', minHeight: '100vh', paddingTop: '1rem', paddingBottom: '3rem'}}>
      <div style={{maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', marginBottom: '1rem'}}>
        <h1 style={{fontSize: '2rem', margin: 0}}>Advanced Archetype Exploration</h1>
        <p style={{color: '#8A8F98', fontSize: '0.9rem', maxWidth: '600px', marginTop: '0.5rem'}}>
          Restored advanced experience with domain drivers, live archetype matching, persona content, blindside content, and top matches ranking.
        </p>
      </div>

      <div className="advanced-exploration-dashboard animate-fade-in">
        
        {/* LEFT COLUMN: Calibration */}
        <div className="adv-panel">
          
          <div className="adv-card">
            <div className="adv-card-header" style={{alignItems: 'flex-start'}}>
              <div>
                <h3 className="adv-card-title" style={{marginBottom: '0.5rem'}}>⚗️ Domain Drivers</h3>
                <p style={{fontSize: '0.8rem', color: '#8A8F98', margin: 0}}>
                  What's shaping your view of the future. By default, only your core selected domains are shown.
                </p>
              </div>
            </div>

            <div style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <div style={{fontSize: '0.85rem', fontWeight: 500}}>Selection mode</div>
                <div style={{fontSize: '0.75rem', color: '#8A8F98'}}>{showAllDomains ? "All 7 domains visible" : "Focused mode: 3 selected"}</div>
              </div>
              <button 
                onClick={() => setShowAllDomains(!showAllDomains)}
                style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500}}
              >
                {showAllDomains ? "Collapse to selected" : "Expand all domains"}
              </button>
            </div>
            
            {visibleDomains.map(domain => (
              <div key={domain.key} className="domain-driver-item" style={{opacity: domain.selected ? 1 : 0.6}}>
                <h4 style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 1rem 0'}}>
                  {domain.rawName}
                  <button 
                    onClick={() => toggleDomainSelection(domain.key)}
                    style={{
                      background: domain.selected ? '#fff' : 'transparent',
                      color: domain.selected ? '#000' : '#fff',
                      border: '1px solid rgba(255,255,255,0.3)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {domain.selected ? '✓ Selected' : 'Add'}
                  </button>
                </h4>
                
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#8A8F98', marginBottom: '0.5rem'}}>
                  <span>Risk Level</span>
                  <span style={{color: '#fff'}}>{domain.risk}</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={domain.risk}
                  onChange={(e) => handleDomainChange(domain.key, 'risk', e.target.value)}
                  style={{width: '100%', marginBottom: '1rem'}}
                />

                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#8A8F98', marginBottom: '0.5rem'}}>
                  <span>Timeline urgency</span>
                  <span style={{color: '#fff'}}>{domain.timing}</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={domain.timing}
                  onChange={(e) => handleDomainChange(domain.key, 'timing', e.target.value)}
                  style={{width: '100%'}}
                />
              </div>
            ))}

            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center'}}>
              <div>
                <div style={{fontSize: '0.7rem', color: '#8A8F98', textTransform: 'uppercase'}}>Derived IFS</div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold'}}>{derived.ifs}</div>
              </div>
              <div>
                <div style={{fontSize: '0.7rem', color: '#8A8F98', textTransform: 'uppercase'}}>Derived DU</div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold'}}>{derived.du}</div>
              </div>
              <div>
                <div style={{fontSize: '0.7rem', color: '#8A8F98', textTransform: 'uppercase'}}>Derived TOC</div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold'}}>{derived.toc}</div>
              </div>
            </div>

            <button 
              onClick={applyDomainModel}
              style={{width: '100%', padding: '0.75rem', background: '#fff', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer'}}
            >
              Apply domain model to overall sliders
            </button>
          </div>

          <div className="adv-card">
            <div className="adv-card-header">
              <h3 className="adv-card-title">⇄ Test Your Assumptions</h3>
            </div>
            <p style={{fontSize: '0.8rem', color: '#8A8F98', marginBottom: '2rem'}}>
              Domain inputs act as evidence. These sliders are your overall judgment and can be adjusted directly.
            </p>

            <Slider label="Institutional Fragility" subtitle="IFS" value={adjustedScores.ifs} derivedVal={derived.ifs} onChange={(v) => handleSliderChange('ifs', v)} />
            <Slider label="Tech Opportunity Confidence" subtitle="TOC" value={adjustedScores.toc} derivedVal={derived.toc} onChange={(v) => handleSliderChange('toc', v)} />
            <Slider label="Disruption Urgency" subtitle="DU" value={adjustedScores.du} derivedVal={derived.du} onChange={(v) => handleSliderChange('du', v)} />
            
            <div style={{height: '1px', background: 'rgba(255,255,255,0.05)', margin: '1.5rem 0'}}></div>
            
            <Slider label="Adaptation Intensity" subtitle="AI" value={adjustedScores.ai} onChange={(v) => handleSliderChange('ai', v)} />
            <Slider label="Mobility / Relocation Potential" subtitle="MRP" value={adjustedScores.mrp} onChange={(v) => handleSliderChange('mrp', v)} />
            <Slider label="Autonomy Preference" subtitle="AP" value={adjustedScores.ap} onChange={(v) => handleSliderChange('ap', v)} />
            <Slider label="Communal Orientation" subtitle="CO" value={adjustedScores.co} onChange={(v) => handleSliderChange('co', v)} />
          </div>

        </div>

        {/* MIDDLE COLUMN: Primary & Media */}
        <div className="adv-panel">
          
          <div className="adv-card primary-archetype-card">
            <div className="adv-card-header">
              <h3 className="adv-card-title" style={{color: '#FF7A18'}}>Updated Primary Archetype</h3>
              <span style={{fontSize: '0.85rem'}}>Match <strong style={{color: '#fff'}}>{primary.match}%</strong></span>
            </div>
            <h2 style={{fontSize: '1.8rem', margin: '0.5rem 0'}}>{primary.name}</h2>
            <p style={{color: '#8A8F98', fontSize: '0.95rem'}}>{primary.description}</p>

            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem', marginBottom: '1rem'}}>
              <RadarChart userVector={adjustedScores} targetVector={primary.vector} size={240} />
            </div>
            
            <div style={{display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.75rem', color: '#8A8F98', marginBottom: '2rem'}}>
              <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <div style={{width: '8px', height: '8px', borderRadius: '50%', background: '#FF7A18'}}></div> User profile
              </span>
              <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <div style={{width: '8px', height: '8px', borderRadius: '50%', background: '#1FE0C9'}}></div> Archetype target
              </span>
            </div>

            <div style={{marginBottom: '1rem', fontSize: '0.8rem', color: '#8A8F98', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Confidence</div>
            <div className="match-bar-bg" style={{height: '8px', marginBottom: '0.5rem'}}>
              <div className="match-bar-fill" style={{width: `${confidence}%`, background: confidence > 50 ? '#1FE0C9' : '#FF7A18'}}></div>
            </div>
            <p style={{fontSize: '0.8rem', color: '#8A8F98', fontStyle: 'italic', marginBottom: '2rem'}}>
              If this shifts easily, the user may need more reflection before locking in their type.
            </p>

            <div className="deltas-grid">
              <DeltaRow label="Institutional Fragility" code="IFS" value={adjustedScores.ifs} derived={derived.ifs} />
              <DeltaRow label="Tech Opportunity" code="TOC" value={adjustedScores.toc} derived={derived.toc} />
              <DeltaRow label="Disruption Urgency" code="DU" value={adjustedScores.du} derived={derived.du} />
              <DeltaRow label="Adaptation Intensity" code="AI" value={adjustedScores.ai} derived={50} />
              <DeltaRow label="Mobility Potential" code="MRP" value={adjustedScores.mrp} derived={50} />
              <DeltaRow label="Autonomy Pref" code="AP" value={adjustedScores.ap} derived={50} />
              <DeltaRow label="Communal Orient." code="CO" value={adjustedScores.co} derived={50} />
            </div>
          </div>

          <div className="adv-card">
            <div className="adv-card-header">
              <h3 className="adv-card-title">Persona Video</h3>
              <span className="adv-card-badge highlight">Suggested</span>
            </div>
            <h4 style={{fontSize: '1.1rem', margin: '0 0 0.5rem 0'}}>{primary.short}: Does this sound like you?</h4>
            <p style={{fontSize: '0.85rem', color: '#8A8F98'}}>
              A short persona explainer mirroring this archetype's worldview, motivations, and planning instinct.
            </p>
            
            <div className="video-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>
              </svg>
              <div style={{marginTop: '0.5rem', fontSize: '0.85rem'}}>Video placeholder</div>
            </div>
          </div>

          <div className="adv-card">
            <div className="adv-card-header">
              <h3 className="adv-card-title">Closest Alternate Archetype</h3>
              <span style={{fontSize: '0.85rem'}}>Match <strong style={{color: '#fff'}}>{secondary.match}%</strong></span>
            </div>
            <h4 style={{fontSize: '1.25rem', margin: '0 0 0.5rem 0'}}>{secondary.name}</h4>
            <p style={{fontSize: '0.85rem', color: '#8A8F98', marginBottom: '1.5rem'}}>{secondary.description}</p>
            
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div style={{width: '150px', margin: '0 1.5rem 0 0', flexShrink: 0}}>
                <RadarChart userVector={adjustedScores} targetVector={secondary.vector} size={150} isSecondary={true} />
              </div>
              <p style={{fontSize: '0.8rem', color: '#8A8F98'}}>
                This is the most useful alternate lens to compare against. It highlights where your assumptions might differ slightly from the primary group.
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Context & CTA */}
        <div className="adv-panel">
          
          <div className="adv-card">
            <div className="adv-card-header">
              <h3 className="adv-card-title">Blindside Content</h3>
              <span className="adv-card-badge counter">Counterpoint</span>
            </div>
            <h4 style={{fontSize: '1.1rem', margin: '0 0 1rem 0'}}>Other perspectives you may be underweighting</h4>
            <p style={{fontSize: '0.85rem', color: '#8A8F98', marginBottom: '1.5rem'}}>
              These should challenge the user from adjacent archetypes and encourage score refinement.
            </p>
            
            <div style={{background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem'}}>
              <h5 style={{margin: '0 0 0.5rem 0', color: '#fff'}}>How a {secondary.short} would challenge your view</h5>
              <p style={{fontSize: '0.8rem', color: '#8A8F98', margin: 0}}>
                A contrasting perspective designed to surface blind spots and pressure test your assumptions about systemic resilience.
              </p>
            </div>

            <div style={{background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px'}}>
              <h5 style={{margin: '0 0 0.5rem 0', color: '#fff'}}>What you may be underestimating</h5>
              <p style={{fontSize: '0.8rem', color: '#8A8F98', margin: 0}}>
                A tighter explainer on where this archetype often gets surprised by other futures arriving sooner or harder.
              </p>
            </div>
          </div>

          <div className="adv-card">
            <div className="adv-card-header">
              <h3 className="adv-card-title">Top Matches</h3>
              <span style={{fontSize: '0.75rem', color: '#8A8F98'}}>Live ranking</span>
            </div>
            <h4 style={{fontSize: '1.1rem', margin: '0 0 0.5rem 0'}}>Where you sit right now</h4>
            <p style={{fontSize: '0.8rem', color: '#8A8F98', marginBottom: '1.5rem'}}>
              Ranked by weighted centroid distance using the current domain and slider settings.
            </p>
            
            <div className="top-matches-list">
              {ranked.slice(0, 5).map((item, index) => (
                <div key={item.id} className={`match-item ${index === 0 ? 'primary' : ''}`}>
                  <div className="match-rank">{index + 1}</div>
                  <div className="match-info">
                    <div className="match-info-top">
                      <span className="match-name">{item.name}</span>
                      <span className="match-percent">{item.match}%</span>
                    </div>
                    <div className="match-bar-bg">
                      <div className="match-bar-fill" style={{width: `${item.match}%`}}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="adv-card" style={{marginTop: 'auto', border: '1px solid var(--accent-color, #1FE0C9)', background: 'linear-gradient(180deg, rgba(31, 224, 201, 0.05) 0%, rgba(31, 224, 201, 0) 100%)'}}>
            <div className="adv-card-header">
              <h3 className="adv-card-title" style={{color: '#fff'}}>Lock In</h3>
              <span className="adv-card-badge" style={{background: 'var(--accent-color, #1FE0C9)', color: '#000', fontWeight: 'bold'}}>Next Steps</span>
            </div>
            <button onClick={handleLockIn} style={{width: '100%', padding: '1.25rem', fontSize: '1.1rem', marginBottom: '1rem', background: '#fff', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}>
              This feels right — Get my personalized plan
            </button>
            <button style={{width: '100%', padding: '1rem', background: 'transparent', color: '#EAEAF0', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer'}}>
              Keep testing assumptions
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
