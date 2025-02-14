import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { Chrome } from 'lucide-react';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isKannada: boolean;
}

export function AuthModal({ isOpen, onClose, isKannada }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error(isKannada ? 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.' : 'Please fill in all fields.');
      return;
    }

    try {
      if (isLogin) {
        const result = await signInWithEmailAndPassword(auth, email, password);
        handleLoginSuccess(result.user);
      } else {
        if (!fullName || !mobile) {
          toast.error(isKannada ? 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.' : 'Please fill in all fields.');
          return;
        }
        const result = await createUserWithEmailAndPassword(auth, email, password);
        handleLoginSuccess(result.user);
      }
      toast.success(isLogin 
        ? (isKannada ? 'ಯಶಸ್ವಿಯಾಗಿ ಲಾಗಿನ್ ಆಗಿದೆ!' : 'Successfully logged in!')
        : (isKannada ? 'ಖಾತೆ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ!' : 'Account created successfully!'));
    } catch (error: any) {
      const errorMessage = error.message.includes('auth')
        ? (isKannada ? 'ದೃಢೀಕರಣ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.' : 'Authentication failed. Please try again.')
        : (isKannada ? 'ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.' : 'Something went wrong. Please try again.');
      toast.error(errorMessage);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      handleLoginSuccess(result.user);
      toast.success(isKannada ? 'Google ನೊಂದಿಗೆ ಯಶಸ್ವಿಯಾಗಿ ಲಾಗಿನ್ ಆಗಿದೆ!' : 'Successfully logged in with Google!');
    } catch (error) {
      toast.error(isKannada ? 'Google ಸೈನ್-ಇನ್ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.' : 'Google sign-in failed. Please try again.');
    }
  };

  const handleLoginSuccess = (user: any) => {
    onClose();
    // Navigate to dashboard with user info
    navigate('/dashboard', { 
      state: { 
        userEmail: user.email,
        userName: user.displayName || user.email.split('@')[0]
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLogin 
              ? (isKannada ? 'ಸೈನ್ ಇನ್' : 'Sign In')
              : (isKannada ? 'ಖಾತೆ ರಚಿಸಿ' : 'Create Account')}
          </h2>
        </div>

        {/* Google Sign-in Button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-6"
        >
          <Chrome className="w-5 h-5" />
          <span>{isKannada ? 'Google ನೊಂದಿಗೆ ಮುಂದುವರಿಸಿ' : 'Continue with Google'}</span>
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
              {isKannada ? 'ಅಥವಾ' : 'or'}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  {isKannada ? 'ಪೂರ್ಣ ಹೆಸರು' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  required={!isLogin}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  {isKannada ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : 'Mobile Number'}
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  required={!isLogin}
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {isKannada ? 'ಇಮೇಲ್' : 'Email'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {isKannada ? 'ಪಾಸ್‌ವರ್ಡ್' : 'Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-medium transition-colors"
          >
            {isLogin 
              ? (isKannada ? 'ಸೈನ್ ಇನ್' : 'Sign In')
              : (isKannada ? 'ಖಾತೆ ರಚಿಸಿ' : 'Create Account')}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          {isLogin 
            ? (isKannada ? 'ಖಾತೆ ಇಲ್ಲವೇ?' : "Don't have an account?")
            : (isKannada ? 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?' : 'Already have an account?')}
          {' '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            {isLogin 
              ? (isKannada ? 'ಸೈನ್ ಅಪ್' : 'Sign up')
              : (isKannada ? 'ಸೈನ್ ಇನ್' : 'Sign in')}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthModal;

