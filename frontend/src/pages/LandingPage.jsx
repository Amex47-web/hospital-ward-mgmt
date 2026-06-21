import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';
import heroImg from '../assets/hero_doctor.png';
import facilitiesImg from '../assets/facilities_ward.png';
import teamImg from '../assets/cta_team.png';
import Footer from '../components/Footer';

// Custom hook for scroll-triggered animations
function useIntersectionObserver(options = { threshold: 0.15 }) {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target); // Only animate once
      }
    }, options);

    const currentElement = elementRef.current;
    if (currentElement) observer.observe(currentElement);
    
    return () => {
      if (currentElement) observer.disconnect();
    };
  }, [options.threshold]);

  return [elementRef, isVisible];
}

export default function LandingPage() {
  const { token } = useAuth();
  
  const [heroRef, heroVisible] = useIntersectionObserver();
  const [featuresRef, featuresVisible] = useIntersectionObserver();
  const [detailsRef, detailsVisible] = useIntersectionObserver();
  const [ctaRef, ctaVisible] = useIntersectionObserver();

  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="landing-wrapper">
      
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-gradient"></div>
        <div className="container hero-container">
          <div 
            ref={heroRef} 
            className={`hero-content ${heroVisible ? 'animate-fade-up' : 'opacity-0'}`}
          >
            <h1 className="hero-title">
              Streamlined Ward Management,<br/>
              <span className="text-teal">In Real-Time</span>
            </h1>
            <p className="hero-subtitle">
              Manage wards, track bed availability, and monitor staff allocation 
              with our state-of-the-art management dashboard. Say goodbye to manual tracking.
            </p>
            <div className="hero-actions">
              {token ? (
                <Link to="/dashboard" className="btn-solid-teal">View Dashboard</Link>
              ) : (
                <>
                  <Link to="/signup" className="btn-solid-teal">Get Started</Link>
                  <Link to="/login" className="btn-outline-teal">Sign In</Link>
                </>
              )}
            </div>
          </div>
          
          <div className={`hero-image-wrapper ${heroVisible ? 'animate-fade-left' : 'opacity-0'}`}>
            <div className="hero-image-shape">
              <img src={heroImg} alt="Professional Doctor" className="hero-img" />
              
              {/* Floating elements matching the design vibe */}
              <div className="floating-card float-top-right">
                <div className="float-icon">✅</div>
                <div className="float-text">
                  <strong>245+</strong><br/>Beds Tracked
                </div>
              </div>
              <div className="floating-card float-bottom-left">
                <div className="float-icon">📊</div>
                <div className="float-text">
                  <strong>Live</strong><br/>Analytics
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Features Section (Teal Background) */}
      <section className="features-section">
        <div className="container">
          <div className="features-header">
            <h2>Easily Manage Your Wards</h2>
            <p>Everything you need to run a modern hospital floor efficiently.</p>
          </div>
          
          <div ref={featuresRef} className="features-grid">
            <div className={`feature-card ${featuresVisible ? 'animate-stagger-1' : 'opacity-0'}`}>
              <div className="feature-icon-circle">🛏️</div>
              <h3>Bed Allocation</h3>
              <p>Track which beds are available, occupied, or under maintenance instantly.</p>
            </div>
            
            <div className={`feature-card ${featuresVisible ? 'animate-stagger-2' : 'opacity-0'}`}>
              <div className="feature-icon-circle">🏥</div>
              <h3>Ward Overview</h3>
              <p>Get a high-level view of all your hospital wards in one dashboard.</p>
            </div>
            
            <div className={`feature-card ${featuresVisible ? 'animate-stagger-3' : 'opacity-0'}`}>
              <div className="feature-icon-circle">📈</div>
              <h3>Real-Time Data</h3>
              <p>No refreshing needed. Watch occupancy rates update as they happen.</p>
            </div>
            
            <div className={`feature-card ${featuresVisible ? 'animate-stagger-4' : 'opacity-0'}`}>
              <div className="feature-icon-circle">🔒</div>
              <h3>Secure Access</h3>
              <p>Role-based access ensures only authorized staff can manage wards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Detailed Solutions (Tabbed Section) */}
      <section className="details-section">
        <div className="container">
          <h2 className="details-title">Comprehensive <strong>Ward Solutions</strong></h2>
          
          <div ref={detailsRef} className={`details-layout ${detailsVisible ? 'animate-fade-up' : 'opacity-0'}`}>
            <div className="details-sidebar">
              <button 
                className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard Overview
              </button>
              <button 
                className={`tab-btn ${activeTab === 'patients' ? 'active' : ''}`}
                onClick={() => setActiveTab('patients')}
              >
                Patient Flow Tracking
              </button>
              <button 
                className={`tab-btn ${activeTab === 'maintenance' ? 'active' : ''}`}
                onClick={() => setActiveTab('maintenance')}
              >
                Maintenance Logging
              </button>
              <button 
                className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                Data Security
              </button>
            </div>
            
            <div className="details-content-card">
              <div className="details-img-container">
                <img src={facilitiesImg} alt="Modern Ward" />
              </div>
              <div className="details-text-container">
                <h3>{
                  activeTab === 'dashboard' ? 'Dashboard Overview' :
                  activeTab === 'patients' ? 'Patient Flow Tracking' :
                  activeTab === 'maintenance' ? 'Maintenance Logging' : 'Data Security'
                }</h3>
                <p>
                  Our system provides a bird's-eye view of your hospital operations. 
                  Identify bottlenecks, allocate resources efficiently, and ensure 
                  that every patient receives a bed without delay. Built for modern 
                  healthcare facilities that demand speed and accuracy.
                </p>
                <Link to={token ? "/dashboard" : "/signup"} className="btn-solid-teal btn-small">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA Banner Section */}
      <section className="cta-section">
        <div className="container">
          <div ref={ctaRef} className={`cta-banner ${ctaVisible ? 'animate-scale-in' : 'opacity-0'}`}>
            <div className="cta-text">
              <h2>Ready to upgrade your hospital operations?</h2>
              <p>Join hundreds of modern clinics using our ward management system.</p>
              <Link to={token ? "/dashboard" : "/signup"} className="btn-solid-white">
                Create Free Account
              </Link>
            </div>
            <div className="cta-image">
              <img src={teamImg} alt="Medical Team" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <Footer />

    </div>
  );
}
