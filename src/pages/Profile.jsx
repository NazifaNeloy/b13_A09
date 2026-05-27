import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { User, Image, Save, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [name, setName] = useState(user?.displayName || '');
  const [photoUrl, setPhotoUrl] = useState(user?.photoURL || '');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    document.title = "IdeaVault | Manage Profile";
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return toast.error('Full Name is required.');
    }

    setUpdating(true);
    updateUserProfile(name, photoUrl)
      .then(() => {
        toast.success('Profile updated successfully!');
        setUpdating(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to update profile: ' + err.message);
        setUpdating(false);
      });
  };

  return (
    <div className="container main-content animate-fade-in" style={{ marginTop: '40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="gradient-text" style={{ fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User Settings</span>
        <h1 style={{ fontSize: '36px', marginTop: '6px' }}>Manage Profile</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Update your developer credentials and profile visuals displayed globally.</p>
      </div>

      <div className="glass-panel profile-card">
        {/* Current Avatar display */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
          <img 
            src={user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
            alt="User Avatar" 
            style={{ width: '120px', height: '120px', borderRadius: 'var(--radius-full)', objectFit: 'cover', border: '4px solid var(--accent-color)', boxShadow: 'var(--shadow-md)', marginBottom: '16px' }}
          />
          <h3 style={{ fontSize: '20px' }}>{user?.displayName || 'Innovator'}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{user?.email}</p>
        </div>

        <form onSubmit={handleUpdate}>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Ada Lovelace" 
                className="form-control"
                style={{ paddingLeft: '48px' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Photo URL */}
          <div className="form-group">
            <label className="form-label">Avatar Photo URL</label>
            <div style={{ position: 'relative' }}>
              <Image size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="url" 
                placeholder="https://example.com/avatar.jpg" 
                className="form-control"
                style={{ paddingLeft: '48px' }}
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Security details (Read-only Info) */}
          <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--warning)', marginBottom: '24px', fontSize: '13px', display: 'flex', gap: '10px' }}>
            <ShieldAlert size={20} style={{ color: 'var(--warning)', flexShrink: 0 }} />
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>OAuth Protection Enabled:</strong>
              <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Your authentication is secure. To update your password, sign out and use the forget password procedure.</p>
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '12px' }}
            disabled={updating}
          >
            <Save size={16} />
            <span>{updating ? 'Saving Profile...' : 'Update Settings'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
