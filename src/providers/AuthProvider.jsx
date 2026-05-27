import React, { createContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  updateProfile, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider, isMockAuth } from '../firebase/firebase.config';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up
  const createUser = (email, password) => {
    setLoading(true);
    if (isMockAuth) {
      return new Promise((resolve) => {
        setTimeout(async () => {
          const mockUser = {
            uid: 'mock-' + Date.now(),
            email: email,
            displayName: email.split('@')[0],
            photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
          };
          localStorage.setItem('mock_user', JSON.stringify(mockUser));
          setUser(mockUser);
          
          try {
            const response = await axios.post('http://localhost:5001/jwt', { email });
            if (response.data?.token) {
              localStorage.setItem('token', response.data.token);
            }
          } catch (jwtErr) {
            console.error('Mock Auth JWT exchange failed:', jwtErr);
          }
          
          setLoading(false);
          resolve({ user: mockUser });
        }, 600);
      });
    }
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Sign in
  const signInUser = (email, password) => {
    setLoading(true);
    if (isMockAuth) {
      return new Promise((resolve) => {
        setTimeout(async () => {
          const mockUser = {
            uid: 'mock-' + Date.now(),
            email: email,
            displayName: email.split('@')[0],
            photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
          };
          localStorage.setItem('mock_user', JSON.stringify(mockUser));
          setUser(mockUser);
          
          try {
            const response = await axios.post('http://localhost:5001/jwt', { email });
            if (response.data?.token) {
              localStorage.setItem('token', response.data.token);
            }
          } catch (jwtErr) {
            console.error('Mock Auth JWT exchange failed:', jwtErr);
          }
          
          setLoading(false);
          resolve({ user: mockUser });
        }, 600);
      });
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google sign in
  const signInWithGoogle = () => {
    setLoading(true);
    if (isMockAuth) {
      return new Promise((resolve) => {
        setTimeout(async () => {
          const mockUser = {
            uid: 'mock-google-' + Date.now(),
            email: 'tester@ideavault.com',
            displayName: 'Ada Reviewer',
            photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
          };
          localStorage.setItem('mock_user', JSON.stringify(mockUser));
          setUser(mockUser);
          
          try {
            const response = await axios.post('http://localhost:5001/jwt', { email: 'tester@ideavault.com' });
            if (response.data?.token) {
              localStorage.setItem('token', response.data.token);
            }
          } catch (jwtErr) {
            console.error('Mock Auth JWT exchange failed:', jwtErr);
          }
          
          setLoading(false);
          resolve({ user: mockUser });
        }, 600);
      });
    }
    return signInWithPopup(auth, googleProvider);
  };

  // Sign out
  const logOut = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5001/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout API failed:', err);
    }
    localStorage.removeItem('token');
    
    if (isMockAuth) {
      localStorage.removeItem('mock_user');
      setUser(null);
      setLoading(false);
      return Promise.resolve();
    }
    
    return signOut(auth);
  };

  // Update profile
  const updateUserProfile = (name, photo) => {
    if (isMockAuth) {
      return new Promise((resolve) => {
        const cachedUser = JSON.parse(localStorage.getItem('mock_user')) || {};
        const updatedUser = { ...cachedUser, displayName: name, photoURL: photo };
        localStorage.setItem('mock_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        resolve();
      });
    }
    
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo
    }).then(() => {
      setUser({ ...auth.currentUser });
    });
  };

  // Auth observer
  useEffect(() => {
    if (isMockAuth) {
      const initMockAuth = async () => {
        const cachedUser = localStorage.getItem('mock_user');
        if (cachedUser) {
          const parsedUser = JSON.parse(cachedUser);
          setUser(parsedUser);
          // Refresh JWT token on boot
          try {
            const response = await axios.post('http://localhost:5001/jwt', {
              email: parsedUser.email
            });
            if (response.data?.token) {
              localStorage.setItem('token', response.data.token);
            }
          } catch (err) {
            console.error('Failed to refresh mock JWT token:', err);
          }
        }
        setLoading(false);
      };
      initMockAuth();
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser && currentUser.email) {
        try {
          const response = await axios.post('http://localhost:5001/jwt', {
            email: currentUser.email
          });
          if (response.data?.token) {
            localStorage.setItem('token', response.data.token);
          }
        } catch (err) {
          console.error('Failed to retrieve JWT token:', err);
        }
      } else {
        localStorage.removeItem('token');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,
    createUser,
    signInUser,
    signInWithGoogle,
    logOut,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};
