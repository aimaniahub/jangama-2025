import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, CreditCard } from 'lucide-react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import PaymentModal from './PaymentModal';
import toast from 'react-hot-toast';

interface DashboardProps {
  userEmail?: string;
  userName?: string;
}

const Dashboard: React.FC<DashboardProps> = () => {
  const location = useLocation();
  const userData = location.state || {};
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [profileData, setProfileData] = useState({
    fullName: '',
    age: '',
    city: '',
    email: userData.userEmail || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/', { replace: true });
        toast.error('Please login to access the dashboard');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Fetch existing profile data when component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!auth.currentUser) return;

      try {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData(prevData => ({
            ...prevData,
            ...data,
            email: userData.userEmail || data.email,
          }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      }
    };

    fetchProfileData();
  }, [userData.userEmail]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error('Please login to save profile');
      return;
    }

    setIsLoading(true);
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      
      const dataToSave = {
        ...profileData,
        updatedAt: new Date().toISOString(),
        userId: auth.currentUser.uid,
      };

      await setDoc(userRef, dataToSave, { merge: true });
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      if (error.code === 'permission-denied') {
        toast.error('Permission denied. Please try logging in again.');
      } else if (error.code === 'unauthenticated') {
        toast.error('You must be logged in to save your profile.');
      } else {
        toast.error('Failed to save profile data. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentClick = (method: string) => {
    setSelectedPaymentMethod(method);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-orange-600 dark:text-orange-400 font-kannada">
              ಕಲ್ಯಾಣ ಬೆಳಕು, ಜಂಗಮ ಮತ್ತು ಲಿಂಗಾಯಿತ ವಧು ವರರ ವೇದಿಕೆ
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 font-kannada">
              📞-7829146919 🙏
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Welcome Message</h2>
            <div className="space-y-6 text-xl text-center font-kannada">
              <p className="text-gray-700 dark:text-gray-300">
                🙏🏻 ಆತ್ಮೀಯ ಜಂಗಮ ಮತ್ತು ಲಿಂಗಾಯತ ಬಂಧುಗಳೇ ಹೊಸದಾಗಿ ಸೇರಿರುವ ಸರ್ವ ಫಲಾನುಭವಿ ಹಾಗೂ ಭಾಗಿದಾರರೇ ನಮ್ಮ ಗ್ರೂಪ್ ಗೆ ಹಾರ್ಧಿಕ ಸ್ವಾಗತ. 🙏
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                🙏🏻 ಆತ್ಮೀಯರೇ, ಈ ಗ್ರೂಪ್ ಜಂಗಮರಿಗೆ ಮತ್ತು ಲಿಂಗಾಯತರಿಗೆ ಅನುಕೂಲವಾಗುವಂತೆ ಕೈಗೊಂಡ ಸಣ್ಣ ಸೇವೆ.🙏🏻
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                ವಧು ಅಥವಾ ವರ ಮನಸ್ಸಿಗೆ ಬಂದರೆ ನೇರವಾಗಿ ಅವರಿಗೆ ಸಂಪರ್ಕ ಮಾಡಬೇಕು, ಇಲ್ಲಿ ನಮ್ಮದು ಯಾವುದೇ ಮದ್ಯಸ್ತಿಕೆ ಇರುವುದಿಲ್ಲ.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Registration Rules</h2>
            <div className="space-y-2 text-xl">
              <p>ಹೆಸರನ್ನು ನೊಂದಾಯಿಸಲು ಬಯಸುವವರು ಕೆಳಗಿರುವ ನಂಬರ್ಗೆ, Rs 500,</p>
              <p>3 ತಿಂಗಳ ಕಾಲವದಿ,</p>
              <p>ಗೂಗಲ್ ಪೇ - Google Pay</p>
              <p>ಫೋನ್ ಪೇ - Phone Pay</p>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 text-center">Payment Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handlePaymentClick('GPay')}
              className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-lg font-medium transition-colors"
            >
              <span>Google Pay</span>
            </button>
            <button
              onClick={() => handlePaymentClick('PhonePe')}
              className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-6 rounded-lg font-medium transition-colors"
            >
              <span>Phone Pe</span>
            </button>
            <button
              onClick={() => handlePaymentClick('Bank')}
              className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg font-medium transition-colors"
            >
              <span>Bank Transfer</span>
            </button>
          </div>
          
          <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
            <p>After payment, please send a screenshot to:</p>
            <p className="text-lg font-semibold mt-2">78291 46919</p>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        paymentMethod={selectedPaymentMethod}
        amount="5"
      />
    </div>
  );
};

export default Dashboard; 