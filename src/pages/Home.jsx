import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, ChevronLeft, ChevronRight, Rocket, Target, DollarSign, Users, Award, TrendingUp } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const bannerSlides = [
  {
    id: 1,
    tag: "Next-Gen AI",
    title: "AI-Powered Smart AgriTech Farms",
    desc: "Revolutionizing crop yields and water conservation through real-time autonomous IoT sensors and deep neural networking forecasts.",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    tag: "FinTech & Web3",
    title: "DeFi Micro-Bonds for Local Co-ops",
    desc: "Empowering rural communities and local merchants to issue secure, collateral-backed micro-bonds with zero intermediary fees.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    tag: "Immersive VR",
    title: "Global XR Immersive Science Labs",
    desc: "Breaking spatial educational barriers by putting photorealistic virtual reality science laboratories in the hands of global students.",
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1200&q=80"
  }
];

const ecosystemStages = [
  {
    stage: "1. Pre-Seed Ideation",
    headline: "Formulating your hypothesis",
    metric: "Target: $25k - $100k",
    focus: "Customer interviews, landing page signups, low-fidelity mockups.",
    strategy: "Focus 100% on verifying whether the problem is painful enough to command a financial return from early adopters."
  },
  {
    stage: "2. Seed Validation",
    headline: "Building the Minimum Viable Product",
    metric: "Target: $250k - $1.5M",
    focus: "Product-market fit (PMF), initial revenue, user retention.",
    strategy: "Iterate rapidly on feedback. Do not scale marketing budget until retention metrics remain consistently stable over a 30-day cohort."
  },
  {
    stage: "3. Series A Scaling",
    headline: "Accelerating repeatable growth",
    metric: "Target: $3M - $12M",
    focus: "Unit economics optimization, building a sales engine, unit margins.",
    strategy: "Expand the executive team, industrialize lead acquisition pipelines, and drive customer acquisition cost (CAC) downward."
  },
  {
    stage: "4. Unicorn Dominance",
    headline: "Global market expansion",
    metric: "Target: $30M+",
    focus: "Market consolidation, strategic acquisitions, global scale.",
    strategy: "Diversify product offerings, acquire smaller geographic competitors, and establish robust defensive moats."
  }
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [trendingIdeas, setTrendingIdeas] = useState([]);
  const [loadingIdeas, setLoadingIdeas] = useState(true);
  const [activeStage, setActiveStage] = useState(0);
  const navigate = useNavigate();

  // Feasibility Estimator State
  const [budgetValue, setBudgetValue] = useState(50000);
  const [audienceSize, setAudienceSize] = useState("medium");
  const [uniqueness, setUniqueness] = useState("high");
  const [calculatedScore, setCalculatedScore] = useState(null);

  // Auto-carousel timing
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Fetch trending ideas
  useEffect(() => {
    const getApiUrl = () => {
      if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      return isLocal ? 'http://localhost:5001' : 'https://b13-a09-server-chi.vercel.app';
    };
    const apiUrl = getApiUrl();
    axios.get(`${apiUrl}/ideas/trending`)
      .then(res => {
        setTrendingIdeas(res.data);
        setLoadingIdeas(false);
      })
      .catch(err => {
        console.error('Error fetching trending ideas:', err);
        setLoadingIdeas(false);
      });
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  // Run feasibility deck index algorithm
  const handleEstimateFeasibility = (e) => {
    e.preventDefault();
    let score = 50;

    // Budget weighting (sweet spot is 10k - 100k for capital efficiency)
    if (budgetValue >= 15000 && budgetValue <= 80000) {
      score += 15;
    } else if (budgetValue < 15000) {
      score += 5; // potential capital deficiency
    } else {
      score += 8; // high capital burn rate
    }

    // Audience sizing
    if (audienceSize === "large") {
      score += 15;
    } else if (audienceSize === "medium") {
      score += 10;
    } else {
      score += 5;
    }

    // Uniqueness
    if (uniqueness === "high") {
      score += 20;
    } else if (uniqueness === "medium") {
      score += 10;
    } else {
      score += -5;
    }

    setCalculatedScore(score);
  };

  return (
    <div className="container main-content animate-fade-in">
      {/* Banner Carousel Section */}
      <div className="hero-carousel">
        {bannerSlides.map((slide, idx) => (
          <div 
            key={slide.id} 
            className={`carousel-slide ${idx === currentSlide ? 'active' : ''}`}
            style={{ 
              backgroundImage: `url(${slide.image})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center' 
            }}
          >
            <div className="carousel-overlay">
              <div className="carousel-content">
                <span className="carousel-tag">{slide.tag}</span>
                <h1 className="carousel-title">{slide.title}</h1>
                <p className="carousel-desc">{slide.desc}</p>
                <Link to="/ideas" className="btn btn-primary">
                  <span>Explore Ideas</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Sliders navigation controls */}
        <button onClick={handlePrevSlide} className="carousel-nav-btn carousel-prev" aria-label="Previous slide">
          <ChevronLeft size={24} />
        </button>
        <button onClick={handleNextSlide} className="carousel-nav-btn carousel-next" aria-label="Next slide">
          <ChevronRight size={24} />
        </button>

        {/* Indicators */}
        <div className="carousel-indicators">
          {bannerSlides.map((_, idx) => (
            <span 
              key={idx}
              className={`carousel-indicator ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
            ></span>
          ))}
        </div>
      </div>

      {/* Trending Ideas Section */}
      <section style={{ margin: '60px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
          <div>
            <span className="gradient-text" style={{ fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trending Concepts</span>
            <h2 style={{ fontSize: '32px', marginTop: '6px' }}>Voted Top Startup Pitch Decks</h2>
          </div>
          <Link to="/ideas" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loadingIdeas ? (
          <LoadingSpinner />
        ) : trendingIdeas.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            No ideas submitted yet. Be the first innovator by sharing yours!
          </div>
        ) : (
          <div className="ideas-grid">
            {trendingIdeas.map(idea => (
              <div key={idea._id} className="glass-card idea-card animate-fade-in">
                <div className="card-img-wrapper">
                  <img src={idea.imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80'} alt={idea.title} className="card-img" />
                  <span className="card-badge">{idea.category}</span>
                </div>
                <div className="card-body">
                  <h3 className="card-title">{idea.title}</h3>
                  <p className="card-desc">{idea.shortDescription}</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '15px 0 20px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <DollarSign size={15} className="gradient-text" />
                      <span><strong>Budget:</strong> ${idea.estimatedBudget?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Target size={15} className="gradient-text" />
                      <span><strong>Audience:</strong> {idea.targetAudience}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <TrendingUp size={15} className="gradient-text" />
                      <span><strong>Engagement:</strong> {idea.likes?.length || 0} Likes</span>
                    </div>
                  </div>

                  <div className="card-meta">
                    <div className="card-author">
                      <img src={idea.userPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=50&q=80'} alt={idea.userName} className="card-author-avatar" />
                      <span>{idea.userName || 'Innovator'}</span>
                    </div>
                    <Link to={`/ideas/${idea._id}`} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Extra Section 1: Interactive Startup Ecosystem Explorer */}
      <section className="glass-panel" style={{ padding: '40px', margin: '60px 0', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span className="gradient-text" style={{ fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interactive Stepper</span>
          <h2 style={{ fontSize: '32px', marginTop: '6px' }}>Startup Ecosystem Growth Map</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '600px', margin: '8px auto 0 auto' }}>
            Navigate the sequential funding milestones and validate your business logic step-by-step from zero to unicorn scale.
          </p>
        </div>

        {/* Stepper Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '30px' }}>
          {ecosystemStages.map((stage, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveStage(idx)}
              className={`btn ${idx === activeStage ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '13px', padding: '8px 16px' }}
            >
              {stage.stage.split(' ')[1]}
            </button>
          ))}
        </div>

        {/* Stepper Display */}
        <div className="glass-card" style={{ padding: '30px', borderRadius: 'var(--radius-md)', borderLeft: '5px solid var(--accent-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '22px' }}>{ecosystemStages[activeStage].stage}</h3>
            <span style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent-color)', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 700 }}>
              {ecosystemStages[activeStage].metric}
            </span>
          </div>
          <h4 style={{ color: 'var(--accent-color)', fontWeight: 600, fontSize: '16px', marginBottom: '12px' }}>
            {ecosystemStages[activeStage].headline}
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
            <strong>Operational Focus:</strong> {ecosystemStages[activeStage].focus}
          </p>
          <p style={{ color: 'var(--text-primary)', fontSize: '14px', lineHeight: '1.6', padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--success)' }}>
            <strong>Execution Strategy:</strong> {ecosystemStages[activeStage].strategy}
          </p>
        </div>
      </section>

      {/* Extra Section 2: Pitch Deck Feasibility Estimator */}
      <section style={{ margin: '60px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span className="gradient-text" style={{ fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pitch Simulator</span>
          <h2 style={{ fontSize: '32px', marginTop: '6px' }}>Crowdsourced Feasibility Deck Estimator</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '600px', margin: '8px auto 0 auto' }}>
            Simulate feasibility outcomes by entering parameters to predict product viability prior to committing seed capital.
          </p>
        </div>

        <div className="glass-panel estimator-card">
          <form onSubmit={handleEstimateFeasibility}>
            <div className="form-group">
              <label className="form-label">Estimated Operating Budget ($): {budgetValue.toLocaleString()}</label>
              <input 
                type="range" 
                min="5000" 
                max="500000" 
                step="5000"
                value={budgetValue}
                onChange={(e) => setBudgetValue(parseInt(e.target.value))}
                className="form-control"
                style={{ padding: '0', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>$5,000 (Lean Startup)</span>
                <span>$500,000 (Capital Intensive)</span>
              </div>
            </div>

            <div className="estimator-grid">
              <div className="form-group">
                <label className="form-label">Target Audience Reach</label>
                <select 
                  className="form-control form-select"
                  value={audienceSize}
                  onChange={(e) => setAudienceSize(e.target.value)}
                >
                  <option value="small">Niche B2B (Under 10k users)</option>
                  <option value="medium">Mid-Market B2B/B2C (10k - 500k)</option>
                  <option value="large">Mass Scale B2C (500k+ global)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Market Uniqueness Score</label>
                <select 
                  className="form-control form-select"
                  value={uniqueness}
                  onChange={(e) => setUniqueness(e.target.value)}
                >
                  <option value="low">Saturated (Existing heavy giants)</option>
                  <option value="medium">Evolutionary (Optimized incremental value)</option>
                  <option value="high">Disruptive (First-mover blue ocean)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Rocket size={16} />
              <span>Compute Pitch Feasibility Index</span>
            </button>
          </form>

          {calculatedScore !== null && (
            <div className="score-display glass-card" style={{ border: '1px solid var(--border-color)', marginTop: '30px' }}>
              <div 
                className="score-circle" 
                style={{ 
                  background: calculatedScore >= 75 ? 'var(--success)' : calculatedScore >= 55 ? 'var(--warning)' : 'var(--error)'
                }}
              >
                {calculatedScore}%
              </div>
              <h4 style={{ fontSize: '18px', marginBottom: '8px' }}>
                {calculatedScore >= 75 ? 'Strong Business Viability!' : calculatedScore >= 55 ? 'Moderate Potential' : 'High Market Friction'}
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {calculatedScore >= 75 
                  ? 'Your inputs display an optimal balance between market efficiency and disruptive capacity. Proceed to build a high-fidelity MVP immediately!'
                  : calculatedScore >= 55 
                  ? 'Your idea shows promise but may face substantial competitive drag or capital limitations. Focus on tightening your B2B value proposition.'
                  : 'Friction is high. Saturated sectors or excessive lean capital reserves might impede scale. We advise pivoting towards adjacent niche blue oceans.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
