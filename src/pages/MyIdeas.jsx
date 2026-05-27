import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAxiosSecure } from '../hooks/useAxiosSecure';
import { Edit2, Trash2, HelpCircle, Layers, X, Save, AlertTriangle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const categories = ["Tech", "Health", "AI", "Education", "Fintech", "Retail", "Other"];

const MyIdeas = () => {
  const axiosSecure = useAxiosSecure();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editShortDesc, setEditShortDesc] = useState('');
  const [editDetailedDesc, setEditDetailedDesc] = useState('');
  const [editCategory, setEditCategory] = useState('Tech');
  const [editTags, setEditTags] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editBudget, setEditBudget] = useState('');
  const [editAudience, setEditAudience] = useState('');
  const [editProblem, setEditProblem] = useState('');
  const [editSolution, setEditSolution] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingIdeaId, setDeletingIdeaId] = useState(null);
  const [deletingIdeaTitle, setDeletingIdeaTitle] = useState('');
  const [deletingSubmit, setDeletingSubmit] = useState(false);

  useEffect(() => {
    document.title = "IdeaVault | My Ideas";
    fetchMyIdeas();
  }, []);

  const fetchMyIdeas = () => {
    setLoading(true);
    axiosSecure.get('/my-ideas')
      .then(res => {
        setIdeas(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching my ideas:', err);
        toast.error('Failed to load your ideas.');
        setLoading(false);
      });
  };

  // Open Edit Modal
  const openEditModal = (idea) => {
    setEditingIdea(idea);
    setEditTitle(idea.title);
    setEditShortDesc(idea.shortDescription);
    setEditDetailedDesc(idea.detailedDescription);
    setEditCategory(idea.category);
    setEditTags(idea.tags?.join(', ') || '');
    setEditImageUrl(idea.imageUrl);
    setEditBudget(idea.estimatedBudget || '');
    setEditAudience(idea.targetAudience);
    setEditProblem(idea.problemStatement || '');
    setEditSolution(idea.proposedSolution || '');
    setEditModalOpen(true);
  };

  // Save changes
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!editTitle || !editShortDesc || !editDetailedDesc || !editCategory || !editAudience || !editProblem || !editSolution) {
      return toast.error('Please fill in all required fields.');
    }

    setSavingEdit(true);
    const tags = editTags ? editTags.split(',').map(t => t.trim()).filter(t => t.length > 0) : [];

    const updatedPayload = {
      title: editTitle,
      shortDescription: editShortDesc,
      detailedDescription: editDetailedDesc,
      category: editCategory,
      tags,
      imageUrl: editImageUrl,
      estimatedBudget: parseFloat(editBudget) || 0,
      targetAudience: editAudience,
      problemStatement: editProblem,
      proposedSolution: editSolution
    };

    try {
      const res = await axiosSecure.put(`/ideas/${editingIdea._id}`, updatedPayload);
      if (res.data.success) {
        toast.success('Idea updated successfully!');
        setEditModalOpen(false);
        fetchMyIdeas();
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update: ' + (err.response?.data?.message || err.message));
    } finally {
      setSavingEdit(false);
    }
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = (id, title) => {
    setDeletingIdeaId(id);
    setDeletingIdeaTitle(title);
    setDeleteModalOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    setDeletingSubmit(true);
    try {
      const res = await axiosSecure.delete(`/ideas/${deletingIdeaId}`);
      if (res.data.success) {
        toast.success('Startup Idea deleted successfully.');
        setDeleteModalOpen(false);
        setDeletingIdeaId(null);
        fetchMyIdeas();
      }
    } catch (err) {
      console.error(err);
      toast.error('Deletion failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeletingSubmit(false);
    }
  };

  return (
    <div className="container main-content animate-fade-in" style={{ marginTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="gradient-text" style={{ fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dashboard</span>
          <h1 style={{ fontSize: '36px', marginTop: '6px' }}>My Startup Ideas</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage, edit, and consolidate product listings you have posted on IdeaVault.</p>
        </div>
        <Link to="/add-idea" className="btn btn-primary">
          Share New Idea
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : ideas.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          <Layers size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
          <h3>No startup ideas posted yet</h3>
          <p style={{ marginTop: '8px', marginBottom: '24px' }}>Got an innovative spark? Share your pitch to seek validation and feedback.</p>
          <Link to="/add-idea" className="btn btn-primary">Share First Pitch</Link>
        </div>
      ) : (
        /* Ideas Cards */
        <div className="ideas-grid">
          {ideas.map(idea => (
            <div key={idea._id} className="glass-card idea-card animate-fade-in">
              <div className="card-img-wrapper">
                <img src={idea.imageUrl} alt={idea.title} className="card-img" />
                <span className="card-badge">{idea.category}</span>
              </div>
              <div className="card-body">
                <h3 className="card-title">{idea.title}</h3>
                <p className="card-desc">{idea.shortDescription}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <Link to={`/ideas/${idea._id}`} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
                    View Details
                  </Link>

                  {/* Actions (Edit / Delete) */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => openEditModal(idea)} 
                      className="btn btn-secondary" 
                      style={{ padding: '8px', borderRadius: 'var(--radius-sm)' }}
                      title="Edit Idea"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => openDeleteModal(idea._id, idea.title)} 
                      className="btn btn-danger" 
                      style={{ padding: '8px', borderRadius: 'var(--radius-sm)' }}
                      title="Delete Idea"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPDATE MODAL */}
      {editModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px' }}>Edit Startup Idea</h2>
              <button onClick={() => setEditModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveChanges}>
              <div className="form-group">
                <label className="form-label">Idea Title <span className="error">*</span></label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-control form-select"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Estimated Budget ($)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={editBudget}
                    onChange={(e) => setEditBudget(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Banner Image URL</label>
                <input 
                  type="url" 
                  className="form-control" 
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Audience <span className="error">*</span></label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={editAudience}
                  onChange={(e) => setEditAudience(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Description <span className="error">*</span></label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={editShortDesc}
                  onChange={(e) => setEditShortDesc(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Problem Statement <span className="error">*</span></label>
                <textarea 
                  rows="2" 
                  className="form-control" 
                  value={editProblem}
                  onChange={(e) => setEditProblem(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Proposed Solution <span className="error">*</span></label>
                <textarea 
                  rows="2" 
                  className="form-control" 
                  value={editSolution}
                  onChange={(e) => setEditSolution(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Strategy & Architecture <span className="error">*</span></label>
                <textarea 
                  rows="4" 
                  className="form-control" 
                  value={editDetailedDesc}
                  onChange={(e) => setEditDetailedDesc(e.target.value)}
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={savingEdit}>
                  <Save size={16} />
                  <span>{savingEdit ? 'Saving Changes...' : 'Save Changes'}</span>
                </button>
                <button type="button" onClick={() => setEditModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ maxWidth: '400px', backgroundColor: 'var(--bg-secondary)', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: 'var(--error)' }}>
              <AlertCircle size={48} />
            </div>
            <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Confirm Deletion</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5', marginBottom: '24px' }}>
              Are you sure you want to permanently delete your startup pitch <strong>"{deletingIdeaTitle}"</strong>? This action is irreversible and will also purge all comments.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={handleConfirmDelete} 
                className="btn btn-danger" 
                style={{ flex: 1 }}
                disabled={deletingSubmit}
              >
                {deletingSubmit ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button 
                onClick={() => setDeleteModalOpen(false)} 
                className="btn btn-secondary" 
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyIdeas;
