import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Ideas from './pages/Ideas';
import IdeaDetails from './pages/IdeaDetails';
import AddIdea from './pages/AddIdea';
import MyIdeas from './pages/MyIdeas';
import MyInteractions from './pages/MyInteractions';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ideas" element={<Ideas />} />
          <Route path="/ideas/:id" element={
            <PrivateRoute>
              <IdeaDetails />
            </PrivateRoute>
          } />
          <Route path="/add-idea" element={
            <PrivateRoute>
              <AddIdea />
            </PrivateRoute>
          } />
          <Route path="/my-ideas" element={
            <PrivateRoute>
              <MyIdeas />
            </PrivateRoute>
          } />
          <Route path="/my-interactions" element={
            <PrivateRoute>
              <MyInteractions />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <Toaster 
          position="top-center" 
          reverseOrder={false}
          toastOptions={{
            style: {
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              fontFamily: 'var(--font-body)',
              borderRadius: 'var(--radius-md)'
            }
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
