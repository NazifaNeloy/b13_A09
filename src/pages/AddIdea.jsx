import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAxiosSecure } from '../hooks/useAxiosSecure';
import { PlusCircle, Info, Target, DollarSign, Tag, Image, Lightbulb, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const categories = ["Tech", "Health", "AI", "Education", "Fintech", "Retail", "Other"];

const AddIdea = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [category, setCategory] = useState('Tech');
  const [tagsInput, setTagsInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [proposedSolution, setProposedSolution] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    document.title = "IdeaVault | Share a Startup Idea";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !shortDescription || !detailedDescription || !category || !targetAudience || !problemStatement || !proposedSolution) {
      return toast.error('Please fill in all required fields.');
    }

    setLoadingSubmit(true);

    // Split tags by comma
    const tags = tagsInput
      ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [];

    const ideaPayload = {
      title,
      shortDescription,
      detailedDescription,
      category,
      tags,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80',
      estimatedBudget: parseFloat(estimatedBudget) || 0,
      targetAudience,
      problemStatement,
      proposedSolution
    };

    try {
      const response = await axiosSecure.post('/ideas', ideaPayload);
      if (response.data.success) {
        // Trigger a nice success confetti blast
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });

        toast.success('Startup Idea submitted successfully!');
        navigate('/my-ideas');
      } else {
        toast.error('Failed to submit startup idea.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="container main-content animate-fade-in" style={{ marginTop: '40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="gradient-text" style={{ fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Launchpad</span>
        <h1 style={{ fontSize: '36px', marginTop: '6px' }}>Pitch Your Startup Vision</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Describe your product logic, market sizing, and problem validation factors.</p>
      </div>

      <div className="glass-panel" style={{ padding: '40px', borderRadius: 'var(--radius-lg)', maxWidth: '900px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          {/* Section: Basic details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {/* Title */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Idea Title <span className="error">*</span></label>
              <div style={{ position: 'relative' }}>
                <Lightbulb size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="e.g. Robinhood for Carbon Credits" 
                  className="form-control"
                  style={{ paddingLeft: '48px' }}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Sector Category <span className="error">*</span></label>
              <select 
                className="form-control form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Estimated budget */}
            <div className="form-group">
              <label className="form-label">Estimated Operating Budget ($)</label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="number" 
                  placeholder="e.g. 50000" 
                  className="form-control"
                  style={{ paddingLeft: '48px' }}
                  value={estimatedBudget}
                  onChange={(e) => setEstimatedBudget(e.target.value)}
                />
              </div>
            </div>

            {/* Image URL */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Banner Image URL</label>
              <div style={{ position: 'relative' }}>
                <Image size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="url" 
                  placeholder="https://images.unsplash.com/photo-... (Leaves empty for high-quality placeholder)" 
                  className="form-control"
                  style={{ paddingLeft: '48px' }}
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
            </div>

            {/* Target Audience */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Target Audience <span className="error">*</span></label>
              <div style={{ position: 'relative' }}>
                <Target size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="e.g. Gen-Z retail investors interested in sustainability" 
                  className="form-control"
                  style={{ paddingLeft: '48px' }}
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Tags */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Tags (Comma separated)</label>
              <div style={{ position: 'relative' }}>
                <Tag size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="e.g. carbon, fintech, sustain, web3" 
                  className="form-control"
                  style={{ paddingLeft: '48px' }}
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section: Text Descriptions */}
          <div className="form-group">
            <label className="form-label">Elevator Pitch (Short Description) <span className="error">*</span></label>
            <textarea 
              rows="2" 
              placeholder="Provide a 1-2 sentence hook explaining what your startup does." 
              className="form-control"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Problem Statement <span className="error">*</span></label>
            <textarea 
              rows="3" 
              placeholder="What core friction or customer pain point does your business validate?" 
              className="form-control"
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Proposed Solution <span className="error">*</span></label>
            <textarea 
              rows="3" 
              placeholder="Detail your product offering. How does it resolve the pain point elegantly?" 
              className="form-control"
              value={proposedSolution}
              onChange={(e) => setProposedSolution(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Product Strategy & Architecture <span className="error">*</span></label>
            <textarea 
              rows="6" 
              placeholder="Explain the technical workflows, distribution channels, and revenue models." 
              className="form-control"
              value={detailedDescription}
              onChange={(e) => setDetailedDescription(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Guidelines info box */}
          <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-color)', marginBottom: '30px', fontSize: '13px', display: 'flex', gap: '10px' }}>
            <Info size={20} style={{ color: 'var(--accent-color)', flexShrink: 0 }} />
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Integrity Guideline:</strong>
              <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>By submitting, you agree that your startup pitch deck will be visible publicly, enabling collective review, community validation comments, and analytics dashboard aggregation.</p>
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '14px', display: 'flex', gap: '8px', fontSize: '16px' }}
            disabled={loadingSubmit}
          >
            <PlusCircle size={18} />
            <span>{loadingSubmit ? 'Saving to Vault...' : 'Save Startup Idea'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddIdea;
