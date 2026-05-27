import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { Mail, Lock, LogIn, Chrome, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { signInUser, signInWithGoogle } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  useEffect(() => {
    document.title = "IdeaVault | Login";
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please fill in all credentials.');
    }
    setLoadingSubmit(true);
    signInUser(email, password)
      .then((res) => {
        toast.success(`Welcome back, ${res.user.displayName || 'Innovator'}!`);
        navigate(redirectPath, { replace: true });
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.message.replace('Firebase:', '').trim());
        setLoadingSubmit(false);
      });
  };

  const handleGoogleLogin = () => {
    setLoadingSubmit(true);
    signInWithGoogle()
      .then((res) => {
        toast.success(`Signed in as ${res.user.displayName}!`);
        navigate(redirectPath, { replace: true });
      })
      .catch((err) => {
        console.error(err);
        toast.error('Google Sign In failed: ' + err.message);
        setLoadingSubmit(false);
      });
  };

  const handleForgetPasswordUI = () => {
    toast.success('Password reset link sent! (Mock implementation)', {
      icon: '✉️'
    });
  };

  return (
    <div className="container main-content animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 150px)', marginTop: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '40px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span className="gradient-text" style={{ fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Access Portal</span>
          <h2 style={{ fontSize: '28px', marginTop: '6px' }}>Sign in to IdeaVault</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>Explore, share, and validate innovative business ideas.</p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                placeholder="you@domain.com" 
                className="form-control"
                style={{ paddingLeft: '48px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="form-label" style={{ margin: 0 }}>Password</label>
              <button 
                type="button" 
                onClick={handleForgetPasswordUI}
                className="comment-action-btn"
                style={{ fontSize: '13px' }}
              >
                Forgot Password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
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
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '12px', marginTop: '10px' }}
            disabled={loadingSubmit}
          >
            <LogIn size={16} />
            <span>{loadingSubmit ? 'Signing In...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '24px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
          <span>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
        </div>

        {/* Google Sign In */}
        <button 
          onClick={handleGoogleLogin} 
          className="btn btn-outline" 
          style={{ width: '100%', display: 'flex', gap: '8px', padding: '12px' }}
          disabled={loadingSubmit}
        >
          <Chrome size={16} className="gradient-text" />
          <span>Continue with Google</span>
        </button>

        {/* Register Link */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" className="gradient-text" style={{ fontWeight: 600 }}>
            Create one free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
