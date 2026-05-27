import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { useAxiosSecure } from '../hooks/useAxiosSecure';
import { 
  Heart, DollarSign, Target, Calendar, User, MessageSquare, 
  Trash2, Edit3, Send, AlertTriangle, ArrowLeft, Lightbulb, Bookmark 
} from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const IdeaDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [idea, setIdea] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Comments inputs & actions states
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Like animation state
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  // Fetch idea details and comments
  useEffect(() => {
    setLoading(true);
    
    // Run concurrent fetches
    Promise.all([
      axiosSecure.get(`/ideas/${id}`),
      axiosSecure.get(`/ideas/${id}/comments`)
    ])
      .then(([ideaRes, commentsRes]) => {
        setIdea(ideaRes.data);
        setComments(commentsRes.data);
        setLikesCount(ideaRes.data.likes?.length || 0);
        setHasLiked(ideaRes.data.likes?.includes(user?.email) || false);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching details:', err);
        toast.error('Idea not found or connection lost.');
        setLoading(false);
        navigate('/ideas');
      });
  }, [id, user?.email]);

  useEffect(() => {
    if (idea) {
      document.title = `IdeaVault | ${idea.title}`;
    }
  }, [idea]);

  // Handle Like/Bookmark toggle
  const handleLikeToggle = async () => {
    try {
      const res = await axiosSecure.put(`/ideas/${id}/like`);
      if (res.data.success) {
        setLikesCount(res.data.likesCount);
        setHasLiked(res.data.action === 'liked');
        toast.success(res.data.action === 'liked' ? 'Added to Bookmarks!' : 'Removed from Bookmarks!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to toggle bookmark.');
    }
  };

  // Add Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    const commentPayload = {
      ideaId: id,
      text: commentText,
      userName: user?.displayName || 'Anonymous Developer',
      userPhoto: user?.photoURL || ''
    };

    try {
      const res = await axiosSecure.post('/comments', commentPayload);
      if (res.data.success) {
        setComments([res.data.comment, ...comments]);
        setCommentText('');
        toast.success('Feedback comment added!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to add comment.');
    } finally {
      setSubmittingComment(false);
    }
  };

  // Trigger edit mode
  const startEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditingCommentText(comment.text);
  };

  // Submit edited comment
  const handleEditComment = async (commentId) => {
    if (!editingCommentText.trim()) return;
    setSubmittingEdit(true);

    try {
      const res = await axiosSecure.patch(`/comments/${commentId}`, {
        text: editingCommentText
      });
      if (res.data.success) {
        setComments(comments.map(c => c._id === commentId ? { ...c, text: editingCommentText } : c));
        setEditingCommentId(null);
        setEditingCommentText('');
        toast.success('Comment updated successfully!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to edit comment.');
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const res = await axiosSecure.delete(`/comments/${commentId}`);
      if (res.data.success) {
        setComments(comments.filter(c => c._id !== commentId));
        toast.success('Comment deleted.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete comment.');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!idea) {
    return (
      <div className="container main-content" style={{ textAlign: 'center', marginTop: '60px' }}>
        <h3>Error: Pitch Deck not found.</h3>
        <Link to="/ideas" className="btn btn-primary" style={{ marginTop: '20px' }}>Back to Ideas</Link>
      </div>
    );
  }

  return (
    <div className="container main-content animate-fade-in" style={{ marginTop: '30px' }}>
      {/* Back button */}
      <Link to="/ideas" className="comment-action-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px', fontSize: '14px' }}>
        <ArrowLeft size={16} />
        <span>Back to Pitch Library</span>
      </Link>

      {/* Main Grid */}
      <div className="details-container">
        
        {/* Left Column: Idea details */}
        <div className="details-main">
          {/* Header image */}
          <div style={{ position: 'relative' }}>
            <img 
              src={idea.imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'} 
              alt={idea.title} 
              className="details-header-img"
            />
            <span className="card-badge" style={{ position: 'absolute', top: '24px', left: '24px', fontSize: '14px', padding: '6px 14px' }}>
              {idea.category}
            </span>
          </div>

          {/* Details body */}
          <div className="glass-panel" style={{ padding: '40px', borderRadius: 'var(--radius-lg)' }}>
            
            {/* Title & Likes row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
              <div>
                <h1 style={{ fontSize: '32px' }}>{idea.title}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Posted on {new Date(idea.createdAt).toLocaleDateString()} by</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{idea.userName || 'Unknown Innovator'}</strong>
                </p>
              </div>

              {/* Like / Bookmark button */}
              <button 
                onClick={handleLikeToggle}
                className={`btn ${hasLiked ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '8px 16px', display: 'flex', gap: '8px', alignItems: 'center' }}
              >
                <Bookmark size={18} fill={hasLiked ? 'currentColor' : 'none'} className={hasLiked ? '' : 'gradient-text'} />
                <span>{hasLiked ? 'Bookmarked' : 'Bookmark Pitch'} ({likesCount})</span>
              </button>
            </div>

            {/* Tags row */}
            {idea.tags && idea.tags.length > 0 && (
              <div className="idea-meta-badge-list" style={{ marginBottom: '24px' }}>
                {idea.tags.map((tag, idx) => (
                  <span key={idx} className="tag-badge">#{tag}</span>
                ))}
              </div>
            )}

            <hr style={{ borderColor: 'var(--border-color)', margin: '24px 0' }} />

            {/* Structured details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Hook */}
              <div>
                <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent-color)' }}>
                  <Lightbulb size={18} />
                  <span>Elevator Pitch</span>
                </h3>
                <p style={{ color: 'var(--text-primary)', fontSize: '16px', lineHeight: '1.6', fontWeight: 500 }}>
                  {idea.shortDescription}
                </p>
              </div>

              {/* Problem */}
              <div>
                <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--error)' }}>
                  <AlertTriangle size={18} />
                  <span>Validated Pain Point (Problem)</span>
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6', padding: '16px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--error)' }}>
                  {idea.problemStatement}
                </p>
              </div>

              {/* Solution */}
              <div>
                <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--success)' }}>
                  <CheckCircle2 size={18} />
                  <span>Elegant Solution</span>
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6', padding: '16px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--success)' }}>
                  {idea.proposedSolution}
                </p>
              </div>

              {/* Detailed specification */}
              <div>
                <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Startup Strategy & Architecture</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                  {idea.detailedDescription}
                </p>
              </div>

            </div>

          </div>

          {/* Comments Section */}
          <div className="comments-section">
            <h2 style={{ fontSize: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={22} className="gradient-text" />
              <span>Feedback & Validation Comments ({comments.length})</span>
            </h2>

            {/* Add Comment form */}
            <form onSubmit={handleAddComment} className="comment-form glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Add your perspective</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <textarea 
                    rows="2" 
                    placeholder="Provide constructive feedback, feasibility warnings, or suggestions..." 
                    className="form-control"
                    style={{ flex: 1, resize: 'none' }}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                  ></textarea>
                  <button 
                    type="submit" 
                    className="btn btn-primary animate-fade-in" 
                    style={{ padding: '0 20px', height: 'auto' }}
                    disabled={submittingComment}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </form>

            {/* Comments List */}
            {comments.length === 0 ? (
              <div className="glass-card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No feedback comments yet. Raise validation points to refine this concept!
              </div>
            ) : (
              <div className="comment-list">
                {comments.map(comment => (
                  <div key={comment._id} className="glass-card comment-card animate-fade-in">
                    <img 
                      src={comment.userPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=50&q=80'} 
                      alt={comment.userName} 
                      className="comment-avatar"
                    />
                    
                    <div className="comment-body">
                      <div className="comment-meta">
                        <span className="comment-author-name">{comment.userName || 'Anonymous Developer'}</span>
                        <span className="comment-time">{new Date(comment.createdAt).toLocaleString()}</span>
                      </div>

                      {editingCommentId === comment._id ? (
                        /* Editing form */
                        <div style={{ marginTop: '8px' }}>
                          <textarea 
                            rows="2" 
                            className="form-control"
                            value={editingCommentText}
                            onChange={(e) => setEditingCommentText(e.target.value)}
                            required
                          ></textarea>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                            <button 
                              onClick={() => handleEditComment(comment._id)} 
                              className="btn btn-primary" 
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                              disabled={submittingEdit}
                            >
                              Save
                            </button>
                            <button 
                              onClick={() => setEditingCommentId(null)} 
                              className="btn btn-secondary" 
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Text display */
                        <>
                          <p className="comment-text">{comment.text}</p>
                          
                          {/* Owner controls */}
                          {user && user.email === comment.userEmail && (
                            <div className="comment-actions">
                              <button 
                                onClick={() => startEditComment(comment)} 
                                className="comment-action-btn"
                                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <Edit3 size={12} />
                                <span>Edit</span>
                              </button>
                              <button 
                                onClick={() => handleDeleteComment(comment._id)} 
                                className="comment-action-btn error"
                                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <Trash2 size={12} />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Spec Sidebar */}
        <div className="details-sidebar">
          {/* Sizing panel */}
          <div className="glass-panel" style={{ padding: '30px', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>Launch Specifications</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Budget */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>
                  <DollarSign size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Estimated Operating Budget</div>
                  <div style={{ fontSize: '18px', fontWeight: 700 }}>${idea.estimatedBudget?.toLocaleString() || 'N/A'}</div>
                </div>
              </div>

              {/* Target Audience */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>
                  <Target size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Primary Target Audience</div>
                  <div style={{ fontSize: '15px', fontWeight: 600 }}>{idea.targetAudience}</div>
                </div>
              </div>

              {/* Date */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Submission Date</div>
                  <div style={{ fontSize: '15px', fontWeight: 600 }}>{new Date(idea.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Author Bio Panel */}
          <div className="glass-panel" style={{ padding: '30px', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Pitch Author</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img 
                src={idea.userPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                alt={idea.userName} 
                style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-full)', objectFit: 'cover', border: '2px solid var(--accent-color)' }}
              />
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700 }}>{idea.userName || 'Unknown Innovator'}</h4>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Verified Creator</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              This startup deck is self-certified. Validate the idea by adding comments, constructive warnings, and market sizing recommendations.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default IdeaDetails;
