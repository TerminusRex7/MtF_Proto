import { useState } from 'react';
import '../Results.css';

const ARCHETYPES = {
  builder: {
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
  },
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

export default function ResultsDashboard({ responses }) {
  const [activeArchetype, setActiveArchetype] = useState('builder');
  const data = ARCHETYPES[activeArchetype];
  const themeClass = activeArchetype === 'builder' ? 'theme-builder' : 'theme-stabilist';

  return (
    <div className={`results-container ${themeClass}`}>
      <div className="prototype-toggle">
        <button 
          className={`toggle-btn ${activeArchetype === 'builder' ? 'active' : ''}`}
          onClick={() => setActiveArchetype('builder')}
        >
          Resilience Builder
        </button>
        <button 
          className={`toggle-btn ${activeArchetype === 'stabilist' ? 'active' : ''}`}
          onClick={() => setActiveArchetype('stabilist')}
        >
          System Stabilist
        </button>
      </div>

      <div className="results-content" key={activeArchetype}>
        
        {/* HERO SECTION */}
        <section className="hero-section animate-fade-in">
          <div className="hero-text">
            <h1 className="title">{data.title}</h1>
            <p className="subtext">{data.subtext}</p>
            <p className="supporting-line">{data.supportingLine}</p>
          </div>
          <div className="hero-visual">
            <div className="visual-graphic">
               {activeArchetype === 'stabilist' && (
                 <><div></div><div></div><div></div><div></div></>
               )}
            </div>
          </div>
        </section>

        {/* FUTURE MAP */}
        <section className="animate-fade-in delay-100">
          <h2 className="section-title">Future Map</h2>
          <div className="map-grid">
            <div className="data-card">
              <h3 className="card-title">System Trust Profile</h3>
              <div className="radar-chart-container">
                {data.futureMap.radar.map(item => (
                  <div key={item.label} className="radar-item">
                    <div className="radar-label">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="radar-bar">
                      <div className="radar-fill" style={{ width: `${item.value}%` }}></div>
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

        {/* STRATEGIC PLAYBOOK */}
        <section className="animate-fade-in delay-200">
          <h2 className="section-title">Strategic Playbook</h2>
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

        {/* BLIND SPOTS */}
        <section className="animate-fade-in delay-300" style={{ marginBottom: '4rem' }}>
          <h2 className="section-title">Critical Blind Spots</h2>
          <div className="data-card" style={{borderLeft: '4px solid #FF7A18'}}>
            {data.blindSpots.map((item, i) => (
              <div key={i} className="list-item" style={{color: '#EAEAF0'}}>{item}</div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
