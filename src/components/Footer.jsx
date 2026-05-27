import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer animate-fade-in">
      <div className="container">
        <div className="footer-grid">
          {/* Logo & Platform Pitch */}
          <div>
            <div className="footer-logo">
              <Lightbulb className="gradient-text" size={24} fill="currentColor" />
              <span>IdeaVault</span>
            </div>
            <p className="footer-text">
              IdeaVault is a premium startup launchpad and validation platform. Explore groundbreaking pitches, share your visions, and collaborate to turn raw concepts into venture-ready solutions.
            </p>
            <div className="footer-socials">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="GitHub">
                <Github size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              {/* Updated X Logo (replaces legacy Twitter) */}
              <a href="https://x.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="X (formerly Twitter)">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h3 className="footer-title">Platform</h3>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/ideas" className="footer-link">Explore Ideas</Link></li>
              <li><Link to="/add-idea" className="footer-link">Share Pitch</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="footer-title">Categories</h3>
            <ul className="footer-links">
              <li><Link to="/ideas?category=Tech" className="footer-link">Technology</Link></li>
              <li><Link to="/ideas?category=AI" className="footer-link">Artificial Intelligence</Link></li>
              <li><Link to="/ideas?category=Health" className="footer-link">Health & BioTech</Link></li>
              <li><Link to="/ideas?category=Education" className="footer-link">EdTech</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="footer-title">Connect</h3>
            <ul className="footer-links">
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <Mail size={16} className="gradient-text" />
                <span>support@ideavault.com</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <Phone size={16} className="gradient-text" />
                <span>+1 (555) 019-2834</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <MapPin size={16} className="gradient-text" />
                <span>Silicon Valley, CA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} IdeaVault Inc. Empowering builders to create the future. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
