import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(name, email, password, role);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center">Create Your Account</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter your full name"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Create a password"
            required
            minLength={6}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Confirm your password"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            I want to join as a
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`border ${
                role === 'student'
                  ? 'border-primary bg-primary/10'
                  : 'border-border-color'
              } rounded-md p-3 cursor-pointer`}
              onClick={() => setRole('student')}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  id="student"
                  name="role"
                  checked={role === 'student'}
                  onChange={() => setRole('student')}
                  className="mr-2"
                />
                <label htmlFor="student" className="cursor-pointer">
                  Student
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                I want to learn and access educational content
              </p>
            </div>
            
            <div
              className={`border ${
                role === 'teacher'
                  ? 'border-primary bg-primary/10'
                  : 'border-border-color'
              } rounded-md p-3 cursor-pointer`}
              onClick={() => setRole('teacher')}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  id="teacher"
                  name="role"
                  checked={role === 'teacher'}
                  onChange={() => setRole('teacher')}
                  className="mr-2"
                />
                <label htmlFor="teacher" className="cursor-pointer">
                  Teacher
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                I want to create and share educational content
              </p>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-md transition"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
      
      <div className="mt-6 text-center text-xs text-gray-500">
        By creating an account, you agree to our{' '}
        <Link to="/terms" className="text-primary hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;