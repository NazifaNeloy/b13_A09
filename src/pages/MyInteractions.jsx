import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAxiosSecure } from '../hooks/useAxiosSecure';
import { MessageSquare, Calendar, ArrowRight, Bookmark } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const MyInteractions = () => {
  const axiosSecure = useAxiosSecure();
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "IdeaVault | My Interactions";
    fetchMyInteractions();
  }, []);

  const fetchMyInteractions = () => {
    setLoading(true);
    axiosSecure.get('/my-interactions')
      .then(res => {
        setInteractions(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching my interactions:', err);
        toast.error('Failed to load your interactions.');
        setLoading(false);
      });
  };

  return (
    <div className="container main-content animate-fade-in" style={{ marginTop: '40px' }}>
      <div style={{ marginBottom: '40px' }}>
        <span className="gradient-text" style={{ fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dashboard</span>
        <h1 style={{ fontSize: '36px', marginTop: '6px' }}>My Interactions</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review validation feedback, recommendations, and discussion threads you have contributed to.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : interactions.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          <MessageSquare size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
          <h3>No community interactions recorded</h3>
          <p style={{ marginTop: '8px', marginBottom: '24px' }}>Explore the platform ideas and leave comments to validate concepts!</p>
          <Link to="/ideas" className="btn btn-primary">Browse Ideas</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {interactions.map(idea => (
            <div key={idea._id} className="glass-panel" style={{ padding: '30px', borderRadius: 'var(--radius-lg)' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <span className="card-badge" style={{ display: 'inline-block', marginBottom: '8px' }}>{idea.category}</span>
                  <h3 style={{ fontSize: '20px' }}>{idea.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                    Pitch Creator: <strong>{idea.userName || 'Unknown Innovator'}</strong>
                  </p>
                </div>

                <Link to={`/ideas/${idea._id}`} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                  <span>View Full Pitch</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* User's comments feed on this idea */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                  <MessageSquare size={14} className="gradient-text" />
                  <span>Your feedback contribution(s) on this pitch:</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {idea.userComments?.map(comment => (
                    <div 
                      key={comment._id} 
                      className="glass-card" 
                      style={{ padding: '16px', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-color)', backgroundColor: 'var(--bg-primary)' }}
                    >
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        "{comment.text}"
                      </p>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                        <Calendar size={11} />
                        <span>Submitted on {new Date(comment.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyInteractions;
