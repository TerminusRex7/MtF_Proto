import { useState } from 'react';
import '../Results.css';

const DEFAULT_ARCHETYPE = {
  title: "Decentralized Resilience Builder",
  subtext: "You see the future as a shift away from centralized systems—toward networks, adaptability, and self-directed resilience.",
  supportingLine: "Not a sudden collapse—but a gradual loss of reliability across key systems.",
  futureMap: {
    explanation: "You expect early disruption in economic systems, followed by governance instability, while technology continues to create opportunity.",
    radar: [
      { label: "Governance", value: 30 },
      { label: "Economy", value: 25 },
      { label: "Infrastructure", value: 50 },
      { label: "Technology", value: 85 }
    ],
    timeline: [
      { label: "NOW", markers: [] },
      { label: "2Y", markers: ["Economy"] },
      { label: "5Y", markers: ["Governance"] },
      { label: "15Y", markers: ["Infrastructure"] }
    ]
  },
  playbook: {
    financial: ["Diversify income streams", "Reduce reliance on single institutions"],
    location: ["Increase flexibility", "Consider secondary options"],
    skills: ["Build adaptability", "Develop practical + digital skills"],
    network: ["Build trusted relationships", "Identify aligned individuals"]
  },
  blindSpots: [
    "Overestimating decentralization speed",
    "Underestimating transition instability",
    "Reliance on tech access"
  ]
};

const ARCHETYPES = {
  builder: DEFAULT_ARCHETYPE,
  stabilist: {
    title: "System Optimizing Stabilist",
    subtext: "You believe systems will adapt and evolve—and that the best strategy is to stay positioned within them.",
    supportingLine: "Disruption is real, but manageable through smart positioning and adaptation.",
    futureMap: {
      explanation: "You expect gradual transformation rather than sudden disruption, with technology acting as a primary driver of opportunity.",
      radar: [
        { label: "Governance", value: 70 },
        { label: "Economy", value: 65 },
        { label: "Infrastructure", value: 75 },
        { label: "Technology", value: 90 }
      ],
      timeline: [
        { label: "NOW", markers: [] },
        { label: "2Y", markers: [] },
        { label: "5Y", markers: [] },
        { label: "15Y", markers: ["Gradual Shifts"] },
        { label: "30Y", markers: [] }
      ]
    },
    playbook: {
      financial: ["Lean into growth assets", "Avoid over-hedging"],
      location: ["Stay in strong economic centers"],
      skills: ["Invest in AI leverage", "Maintain competitiveness"],
      network: ["Build professional networks", "Expand influence"]
    },
    blindSpots: [
      "Underestimating systemic fragility",
      "Overconfidence in institutions",
      "Slower response to rapid disruption"
    ]
  }
};

export default function ResultsDashboard({ archetypeData, responses }) {
  const [planDepth, setPlanDepth] = useState('practical');
  
  const primaryId = archetypeData?.primary?.id || 'builder';
  const data = ARCHETYPES[primaryId] || DEFAULT_ARCHETYPE;
  
  const title = archetypeData?.primary?.name || data.title;
  const description = archetypeData?.primary?.description || data.subtext;

  // Use dynamic domains for Domain Risk Profile if available
  const domainRadar = archetypeData?.domainsState ? 
    archetypeData.domainsState.map(d => ({ label: d.key, value: d.risk })) : 
    data.futureMap.radar;

  const deltas = archetypeData?.deltas || { ifs: 0, du: 0, toc: 0 };
  const hasOverrides = Math.abs(deltas.ifs) > 0 || Math.abs(deltas.du) > 0 || Math.abs(deltas.toc) > 0;

  return (
    <div className="results-container theme-builder">
      <div className="results-content">
        
        {/* HERO SECTION */}
        <section className="hero-section animate-fade-in">
          <div className="hero-text">
            <span className="header-accent">Your Confirmed Archetype</span>
            <h1 className="title" style={{marginTop: '1rem'}}>{title}</h1>
            <p className="subtext">{description}</p>
            <p className="supporting-line">{data.supportingLine}</p>
          </div>
          <div className="hero-visual">
            <div className="visual-graphic">
               <div></div><div></div><div></div><div></div>
            </div>
          </div>
        </section>

        {/* FUTURE MAP */}
        <section className="animate-fade-in delay-100">
          <h2 className="section-title">Future Map</h2>
          <div className="map-grid">
            <div className="data-card">
              <h3 className="card-title">Domain Risk Profile</h3>
              <div className="radar-chart-container">
                {domainRadar.map(item => (
                  <div key={item.label} className="radar-item" style={{marginBottom: '1rem'}}>
                    <div className="radar-label" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem'}}>
                      <span style={{textTransform: 'capitalize'}}>{item.label.replace('_', ' ')}</span>
                      <span>{item.value}% Risk</span>
                    </div>
                    <div className="radar-bar" style={{height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden'}}>
                      <div className="radar-fill" style={{ width: `${item.value}%`, height: '100%', background: 'var(--accent-color)' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="data-card">
              <h3 className="card-title">Timeline & Disruption Vectors</h3>
              <p style={{ color: '#8A8F98', marginBottom: '2rem' }}>{data.futureMap.explanation}</p>
              
              <div className="timeline-track">
                {data.futureMap.timeline.map((point, i) => (
                  <div key={i} className="timeline-node">
                    <div className="node-circle"></div>
                    <span className="node-label">{point.label}</span>
                    {point.markers.map(m => (
                      <div key={m} className="node-marker" style={{color: 'var(--text-primary)'}}>{m}</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WHERE YOU OVERRODE THE MODEL */}
        {hasOverrides && (
          <section className="animate-fade-in delay-150" style={{marginTop: '4rem'}}>
            <h2 className="section-title">Where You Overrode the Model</h2>
            <div className="data-card" style={{border: '1px solid rgba(255,255,255,0.1)'}}>
              <p style={{color: 'var(--text-secondary)', marginBottom: '1.5rem'}}>
                Your domain risk assessments suggested different systemic behaviors, but you manually adjusted these metrics during calibration:
              </p>
              <div style={{display: 'flex', gap: '2rem'}}>
                {Object.entries(deltas).filter(([k,v]) => v !== 0).map(([key, value]) => (
                  <div key={key} style={{padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', flex: 1}}>
                    <div style={{textTransform: 'uppercase', fontSize: '0.85rem', color: '#8A8F98'}}>{key} Score</div>
                    <div style={{fontSize: '1.5rem', color: value > 0 ? 'var(--accent-color)' : 'var(--success-color)'}}>
                      {value > 0 ? '+' : ''}{value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* STRATEGIC PLAYBOOK & PLANNING */}
        <section className="animate-fade-in delay-200" style={{marginTop: '4rem'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem'}}>
            <h2 className="section-title" style={{marginBottom: 0}}>Strategic Playbook</h2>
            
            {/* PLANNING DEPTH SELECTOR */}
            <div style={{display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.25rem'}}>
              {['light', 'practical', 'deep'].map(depth => (
                <button 
                  key={depth}
                  onClick={() => setPlanDepth(depth)}
                  style={{
                    background: planDepth === depth ? 'var(--accent-color)' : 'transparent',
                    color: planDepth === depth ? '#fff' : 'var(--text-secondary)',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    textTransform: 'capitalize',
                    cursor: 'pointer'
                  }}
                >
                  {depth} Plan
                </button>
              ))}
            </div>
          </div>
          
          <div className="playbook-grid">
            <div className="data-card">
              <h3 className="card-title">Financial Strategy</h3>
              {data.playbook.financial.map((item, i) => (
                <div key={i} className="list-item">{item}</div>
              ))}
            </div>

            <div className="data-card">
              <h3 className="card-title">Location Strategy</h3>
              {data.playbook.location.map((item, i) => (
                <div key={i} className="list-item">{item}</div>
              ))}
            </div>

            <div className="data-card">
              <h3 className="card-title">Skills Strategy</h3>
              {data.playbook.skills.map((item, i) => (
                <div key={i} className="list-item">{item}</div>
              ))}
            </div>

            <div className="data-card">
              <h3 className="card-title">Network Strategy</h3>
              {data.playbook.network.map((item, i) => (
                <div key={i} className="list-item">{item}</div>
              ))}
            </div>
          </div>
        </section>

        {/* COMMUNITY MODULE & BLIND SPOTS */}
        <section className="animate-fade-in delay-300" style={{ marginTop: '4rem', marginBottom: '4rem', display: 'flex', gap: '2rem' }}>
          
          {/* CRITICAL BLIND SPOTS */}
          <div className="data-card" style={{borderLeft: '4px solid #FF7A18', flex: 1}}>
            <h2 className="section-title" style={{fontSize: '1.2rem', marginBottom: '1rem'}}>Critical Blind Spots</h2>
            {data.blindSpots.map((item, i) => (
              <div key={i} className="list-item" style={{color: '#EAEAF0'}}>{item}</div>
            ))}
          </div>

          {/* CIRCLE COMMUNITY MODULE */}
          <div className="data-card" style={{flex: 1, background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)', border: '1px solid rgba(255,255,255,0.1)'}}>
            <h2 className="section-title" style={{fontSize: '1.2rem', marginBottom: '0.5rem'}}>Map The Future Community</h2>
            <p style={{color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem'}}>
              Join other <strong style={{color: '#fff'}}>{archetypeData?.primary?.short || 'Builders'}</strong> in a private Circle channel to discuss strategies, share localized threat intel, and coordinate plans.
            </p>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <div style={{display: 'flex'}}>
                <div style={{width: '32px', height: '32px', borderRadius: '50%', background: '#444', border: '2px solid #222'}}></div>
                <div style={{width: '32px', height: '32px', borderRadius: '50%', background: '#555', border: '2px solid #222', marginLeft: '-12px'}}></div>
                <div style={{width: '32px', height: '32px', borderRadius: '50%', background: '#666', border: '2px solid #222', marginLeft: '-12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem'}}>+14</div>
              </div>
              <button style={{padding: '0.5rem 1rem', background: '#fff', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
                Join {archetypeData?.primary?.short || 'Network'} Channel
              </button>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}
