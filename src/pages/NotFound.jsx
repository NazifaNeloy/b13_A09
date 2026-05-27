import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Lightbulb, MapPinOff } from 'lucide-react';

const NotFound = () => {
  useEffect(() => {
    document.title = "IdeaVault | Page Not Found";
  }, []);

  return (
    <div className="container main-content animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 150px)' }}>
      <div className="error-page glass-panel" style={{ padding: '60px 40px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--accent-color)', marginBottom: '24px' }}>
          <MapPinOff size={64} className="gradient-text" />
        </div>
        
        <h1 className="error-title gradient-text">404</h1>
        <h2 className="error-subtitle">Vault Link Broken</h2>
        
        <p className="error-desc">
          The resources you are attempting to locate do not exist or may have been consolidated by their author.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Home size={16} />
            <span>Return Home</span>
          </Link>
          <Link to="/ideas" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Lightbulb size={16} />
            <span>Browse Pitches</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
