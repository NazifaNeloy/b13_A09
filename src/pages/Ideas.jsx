import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, DollarSign, Target, Calendar, ArrowUpDown, HelpCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const categories = ["All", "Tech", "Health", "AI", "Education", "Fintech", "Retail", "Other"];

const Ideas = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'budget-asc' | 'budget-desc' | 'likes'

  // Fetch ideas when search, category, or sorting changes
  useEffect(() => {
    setLoading(true);
    // Fetch from API
    axios.get('http://localhost:5001/ideas', {
      params: {
        search: searchTerm,
        category: selectedCategory
      }
    })
      .then(res => {
        let fetchedIdeas = res.data;
        
        // Client-side sorting for premium interactivity
        if (sortBy === 'newest') {
          fetchedIdeas.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'budget-asc') {
          fetchedIdeas.sort((a, b) => (a.estimatedBudget || 0) - (b.estimatedBudget || 0));
        } else if (sortBy === 'budget-desc') {
          fetchedIdeas.sort((a, b) => (b.estimatedBudget || 0) - (a.estimatedBudget || 0));
        } else if (sortBy === 'likes') {
          fetchedIdeas.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        }

        setIdeas(fetchedIdeas);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading ideas:', err);
        setLoading(false);
      });
  }, [searchTerm, selectedCategory, sortBy]);

  // Set document title
  useEffect(() => {
    document.title = "IdeaVault | Explore Innovations";
  }, []);

  return (
    <div className="container main-content animate-fade-in">
      <div style={{ marginTop: '40px', marginBottom: '10px' }}>
        <span className="gradient-text" style={{ fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pitch Library</span>
        <h1 style={{ fontSize: '36px', marginTop: '6px' }}>Discover Cutting-Edge Ideas</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          Explore startup concepts posted by global builders, filter by domain categories, and vote on feasibility.
        </p>
      </div>

      {/* Search and Filter Panel */}
      <div className="glass-panel search-filter-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
        {/* Search */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by idea title..." 
            className="form-control search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Filter size={16} style={{ color: 'var(--text-muted)' }} />
          <select 
            className="form-control filter-select form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
            ))}
          </select>
        </div>

        {/* Sorting option */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <ArrowUpDown size={16} style={{ color: 'var(--text-muted)' }} />
          <select 
            className="form-control filter-select form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort by: Newest First</option>
            <option value="budget-asc">Sort by: Budget (Low to High)</option>
            <option value="budget-desc">Sort by: Budget (High to Low)</option>
            <option value="likes">Sort by: Most Liked</option>
          </select>
        </div>
      </div>

      {/* Ideas Listing */}
      {loading ? (
        <LoadingSpinner />
      ) : ideas.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          <HelpCircle size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
          <h3>No Matching Ideas Found</h3>
          <p style={{ marginTop: '8px' }}>Try refining your search terms or selecting another category.</p>
        </div>
      ) : (
        <div className="ideas-grid">
          {ideas.map(idea => (
            <div key={idea._id} className="glass-card idea-card animate-fade-in">
              <div className="card-img-wrapper">
                <img 
                  src={idea.imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80'} 
                  alt={idea.title} 
                  className="card-img" 
                />
                <span className="card-badge">{idea.category}</span>
              </div>
              
              <div className="card-body">
                <h3 className="card-title">{idea.title}</h3>
                <p className="card-desc">{idea.shortDescription}</p>

                {/* 3-4 dynamic pieces of info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '15px 0 20px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DollarSign size={15} className="gradient-text" />
                    <span><strong>Operating Budget:</strong> ${idea.estimatedBudget?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Target size={15} className="gradient-text" />
                    <span><strong>Target Audience:</strong> {idea.targetAudience}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={15} className="gradient-text" />
                    <span><strong>Shared:</strong> {new Date(idea.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="card-meta">
                  <div className="card-author">
                    <img 
                      src={idea.userPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=50&q=80'} 
                      alt={idea.userName} 
                      className="card-author-avatar" 
                    />
                    <span>{idea.userName || 'Innovator'}</span>
                  </div>
                  
                  <Link to={`/ideas/${idea._id}`} className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '12px' }}>
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Ideas;
