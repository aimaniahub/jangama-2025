import { useState } from 'react';
import { Heart, Users, Scroll, UserPlus } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import { Routes, Route } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';

function App() {
  const [isKannada, setIsKannada] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Toggle between Kannada and English
  const toggleLanguage = () => setIsKannada(!isKannada);
  
  // Toggle between Dark and Light themes
  const toggleTheme = () => setIsDark(!isDark);

  // Home page content component
  const HomePage = () => (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1604196557506-ee7469cbf44d?auto=format&fit=crop&q=80"
            alt="Background"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              {isKannada ? 'ಜಂಗಮ ವಿವಾಹ ವೇದಿಕೆ' : 'Jangama Marriage Bureau'}
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              {isKannada 
                ? 'ನಿಮ್ಮ ಜೀವನ ಸಂಗಾತಿಯನ್ನು ಹುಡುಕುವ ವಿಶ್ವಾಸಾರ್ಹ ವೇದಿಕೆ'
                : 'Your trusted platform for finding life partners'}
            </p>
            <p className="mt-3 max-w-md mx-auto text-sm text-gray-500 dark:text-gray-400 md:mt-5 md:text-base md:max-w-3xl">
              {isKannada
                ? 'ಜಂಗಮ ಸಮುದಾಯದ ಸದಸ್ಯರಿಗಾಗಿ ವಿಶೇಷವಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ಮದುವೆ ವೇದಿಕೆ'
                : 'A marriage platform specially designed for members of the Jangama community'}
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 md:py-4 md:text-lg md:px-10"
                >
                  {isKannada ? 'ಈಗ ಪ್ರಾರಂಭಿಸಿ' : 'Get Started'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isKannada ? 'ನಮ್ಮ ಸೇವೆಗಳು' : 'Our Services'}
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
              {isKannada
                ? 'ನಿಮ್ಮ ಜೀವನ ಸಂಗಾತಿಯನ್ನು ಹುಡುಕುವ ಪ್ರಯಾಣದಲ್ಲಿ ನಾವು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇವೆ'
                : 'We help you in your journey to find your life partner'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-orange-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                {isKannada ? 'ವಿಶಾಲ ಸಮುದಾಯ' : 'Large Community'}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {isKannada
                  ? 'ಜಂಗಮ ಸಮುದಾಯದ ದೊಡ್ಡ ಸದಸ್ಯತ್ವ ಆಧಾರ'
                  : 'Large membership base from Jangama community'}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-lg transition-shadow">
              <Heart className="h-12 w-12 text-orange-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                {isKannada ? 'ಯಶಸ್ವಿ ಜೋಡಿಗಳು' : 'Success Stories'}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {isKannada
                  ? 'ಅನೇಕ ಯಶಸ್ವಿ ವಿವಾಹಗಳನ್ನು ಸಾಧಿಸಿದ ಅನುಭವ'
                  : 'Track record of successful marriages'}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-lg transition-shadow">
              <Scroll className="h-12 w-12 text-orange-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                {isKannada ? 'ಸುಲಭ ನೋಂದಣಿ' : 'Easy Registration'}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {isKannada
                  ? 'ಸರಳ ಮತ್ತು ನೇರ ನೋಂದಣಿ ಪ್ರಕ್ರಿಯೆ'
                  : 'Simple and straightforward registration process'}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-lg transition-shadow">
              <UserPlus className="h-12 w-12 text-orange-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                {isKannada ? 'ವೈಯಕ್ತಿಕ ಸೇವೆ' : 'Personal Service'}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {isKannada
                  ? 'ವೈಯಕ್ತಿಕ ಗಮನ ಮತ್ತು ಮಾರ್ಗದರ್ಶನ'
                  : 'Personal attention and guidance'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-orange-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              {isKannada ? 'ನಮ್ಮ ಬಗ್ಗೆ' : 'About Us'}
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
              {isKannada
                ? 'ಜಂಗಮ ಸಮುದಾಯದ ಸದಸ್ಯರಿಗೆ ವಿಶ್ವಾಸಾರ್ಹ ಮತ್ತು ನಂಬಲಹ್ಯವಾದ ವಿವಾಹ ಸೇವೆಯನ್ನು ಒದಗಿಸುವುದು ನಮ್ಮ ಗುರಿ.'
                : 'Our mission is to provide reliable and trustworthy matrimonial services to members of the Jangama community.'}
            </p>
            <p className="mt-4 max-w-2xl text-gray-500 dark:text-gray-400 lg:mx-auto">
              {isKannada
                ? 'ನಾವು ಸಾಂಪ್ರದಾಯಿಕ ಮೌಲ್ಯಗಳನ್ನು ಗೌರವಿಸುತ್ತೇವೆ ಮತ್ತು ಆಧುನಿಕ ತಂತ್ರಜ್ಞಾನದ ಸೌಲಭ್ಯಗಳನ್ನು ಒದಗಿಸುತ್ತೇವೆ.'
                : 'We respect traditional values while providing modern technological conveniences.'}
            </p>
          </div>
        </div>
      </section>
    </main>
  );

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Toaster position="top-center" />
        <Header 
          toggleLanguage={toggleLanguage}
          isKannada={isKannada}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          isKannada={isKannada}
        />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/registration-form" element={<RegistrationForm isKannada={isKannada} />} />
        </Routes>

        <Footer isKannada={isKannada} />
      </div>
    </div>
  );
}

export default App;
