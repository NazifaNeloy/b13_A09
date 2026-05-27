import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { User, Mail, Image, Lock, UserPlus, Check, X, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  useEffect(() => {
    document.title = "IdeaVault | Register";
  }, []);

  // Validation states
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  const handleRegister = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return toast.error('Please fill in all required fields.');
    }

    if (!isPasswordValid) {
      return toast.error('Password does not meet validation rules.');
    }

    setLoadingSubmit(true);
    createUser(email, password)
      .then((res) => {
        // Update user profile name and photo
        updateUserProfile(name, photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80')
          .then(() => {
            toast.success(`Account created successfully! Welcome, ${name}!`);
            navigate(redirectPath, { replace: true });
          })
          .catch((profileErr) => {
            console.error(profileErr);
            toast.success('Registration successful (but profile picture could not load).');
            navigate(redirectPath, { replace: true });
          });
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.message.replace('Firebase:', '').trim());
        setLoadingSubmit(false);
      });
  };

  return (
    <div className="container main-content animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 120px)', marginTop: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '40px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span className="gradient-text" style={{ fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Create Account</span>
          <h2 style={{ fontSize: '28px', marginTop: '6px' }}>Join the Innovation Hive</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>Share ideas and get community validation.</p>
        </div>

        <form onSubmit={handleRegister}>
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

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                placeholder="ada@lovelace.org" 
                className="form-control"
                style={{ paddingLeft: '48px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Photo URL */}
          <div className="form-group">
            <label className="form-label">Photo URL (Optional)</label>
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

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Create a strong password" 
                className="form-control"
                style={{ paddingLeft: '48px', paddingRight: '48px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Validation Requirements Checkers */}
            <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', fontSize: '13px' }}>
              <div style={{ fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>Security Milestones:</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasMinLength ? 'var(--success)' : 'var(--text-muted)' }}>
                  {hasMinLength ? <Check size={14} /> : <X size={14} />}
                  <span>At least 6 characters</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasUppercase ? 'var(--success)' : 'var(--text-muted)' }}>
                  {hasUppercase ? <Check size={14} /> : <X size={14} />}
                  <span>Must include uppercase letter (A-Z)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasLowercase ? 'var(--success)' : 'var(--text-muted)' }}>
                  {hasLowercase ? <Check size={14} /> : <X size={14} />}
                  <span>Must include lowercase letter (a-z)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '12px', marginTop: '10px' }}
            disabled={loadingSubmit}
          >
            <UserPlus size={16} />
            <span>{loadingSubmit ? 'Creating Account...' : 'Register'}</span>
          </button>
        </form>

        {/* Login Link */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" className="gradient-text" style={{ fontWeight: 600 }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
