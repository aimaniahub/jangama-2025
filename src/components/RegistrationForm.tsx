import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Calendar,
  Star, 
  Users, 
  Heart,
  Phone,
  Save,
  Scroll
} from 'lucide-react';
import toast from 'react-hot-toast';
import { submitToGoogleSheets } from '../googleSheets';
import type { RegistrationFormData } from '../utils/form';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

interface RegistrationFormProps {
  isKannada: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ isKannada }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasValidPayment, setHasValidPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState<RegistrationFormData>({
    birthName: '',
    birthDate: '',
    birthTime: '',
    place: '',
    raashi: '',
    nakshatra: '',
    caste: '',
    subcaste: '',
    peeta: '',
    homegod: '',
    height: '',
    education: '',
    occupation: '',
    maritalStatus: '',
    annualIncome: '',
    otherDetails: '',
    partnerPreference: '',
    gender: '',
    father: '',
    fatherOccupation: '',
    mother: '',
    motherOccupation: '',
    sisters: '',
    brothers: '',
    contact: '',
    email: '',
    address: '',
    name: ''
  });

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!auth.currentUser) {
        navigate('/', { replace: true });
        return;
      }

      try {
        const paymentDoc = await getDoc(doc(db, 'payments', auth.currentUser.uid));
        
        if (paymentDoc.exists()) {
          const paymentData = paymentDoc.data();
          if (paymentData.status === 'completed') {
            setHasValidPayment(true); // Allow form filling
          } else {
            toast.error(isKannada ? 
              'ದಯವಿಟ್ಟು ಮೊದಲು ಪಾವತಿ ಮಾಡಿ' : 
              'Please complete the payment first'
            );
            navigate('/dashboard');
          }
        } else {
          toast.error(isKannada ? 
            'ದಯವಿಟ್ಟು ಮೊದಲು ಪಾವತಿ ಮಾಡಿ' : 
            'Please complete the payment first'
          );
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error checking payment:', error);
        toast.error('Failed to verify payment status');
      } finally {
        setIsLoading(false);
      }
    };

    checkPaymentStatus();
  }, [navigate, isKannada]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {isKannada ? 'ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ...' : 'Please wait...'}
          </p>
        </div>
      </div>
    );
  }

  if (!hasValidPayment) {
    return null; // Component will unmount and redirect via useEffect
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitToGoogleSheets(formData);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(
        isKannada 
          ? 'ನೋಂದಣಿ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.'
          : 'Registration failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-orange-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Traditional Design Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 bg-orange-500 rounded-full flex items-center justify-center">
              <Om className="w-20 h-20 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {isKannada ? 'ವಿವರವಾದ ನೋಂದಣಿ ಫಾರ್ಮ್' : 'Detailed Registration Form'}
          </h1>
          <div className="flex justify-center space-x-2">
            <div className="h-1 w-16 bg-orange-500 rounded"></div>
            <div className="h-1 w-16 bg-orange-500 rounded"></div>
            <div className="h-1 w-16 bg-orange-500 rounded"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
          {/* Personal Information Section */}
          <section className="space-y-6">
            <div className="flex items-center space-x-2 text-xl font-semibold text-gray-900 dark:text-white">
              <User className="w-6 h-6 text-orange-500" />
              <h2>{isKannada ? 'ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ' : 'Personal Information'}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isKannada ? 'ಹೆಸರು' : 'Name'}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isKannada ? 'ಲಿಂಗ' : 'Gender'}
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">{isKannada ? 'ಆಯ್ಕೆ ಮಾಡಿ' : 'Select'}</option>
                  <option value="male">{isKannada ? 'ಪುರುಷ' : 'Male'}</option>
                  <option value="female">{isKannada ? 'ಮಹಿಳೆ' : 'Female'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isKannada ? 'ತಂದೆಯ ಹೆಸರು' : "Father's Name"}
                </label>
                <input
                  type="text"
                  name="father"
                  value={formData.father}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isKannada ? 'ತಂದೆಯ ಉದ್ಯೋಗ' : "Father's Occupation"}
                </label>
                <input
                  type="text"
                  name="fatherOccupation"
                  value={formData.fatherOccupation}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>
          </section>

          {/* Birth Details Section */}
          <section className="space-y-6">
            <div className="flex items-center space-x-2 text-xl font-semibold text-gray-900 dark:text-white">
              <Calendar className="w-6 h-6 text-orange-500" />
              <h2>{isKannada ? 'ಜನ್ಮ ವಿವರಗಳು' : 'Birth Details'}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isKannada ? 'ಜನ್ಮ ಹೆಸರು' : 'Birth Name'}
                </label>
                <input
                  type="text"
                  name="birthName"
                  value={formData.birthName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isKannada ? 'ಜನ್ಮ ದಿನಾಂಕ' : 'Birth Date'}
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isKannada ? 'ಜನ್ಮ ಸಮಯ' : 'Birth Time'}
                </label>
                <input
                  type="time"
                  name="birthTime"
                  value={formData.birthTime}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isKannada ? 'ಜನ್ಮ ಸ್ಥಳ' : 'Birth Place'}
                </label>
                <input
                  type="text"
                  name="place"
                  value={formData.place}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </section>

          {/* Horoscope Details Section */}
          <section className="space-y-6">
            <div className="flex items-center space-x-2 text-xl font-semibold text-gray-900 dark:text-white">
              <Star className="w-6 h-6 text-orange-500" />
              <h2>{isKannada ? 'ಜಾತಕ ವಿವರಗಳು' : 'Horoscope Details'}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isKannada ? 'ರಾಶಿ' : 'Raashi'}
                </label>
                <input
                  type="text"
                  name="raashi"
                  value={formData.raashi}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isKannada ? 'ನಕ್ಷತ್ರ' : 'Nakshatra'}
                </label>
                <input
                  type="text"
                  name="nakshatra"
                  value={formData.nakshatra}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </section>

          {/* Community Details Section */}
          <section className="space-y-6">
            <div className="flex items-center space-x-2 text-xl font-semibold text-gray-900 dark:text-white">
              <Users className="w-6 h-6 text-orange-500" />
              <h2>{isKannada ? 'ಸಮುದಾಯದ ವಿವರಗಳು' : 'Community Details'}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isKannada ? 'ಜಾತಿ' : 'Caste'}
                </label>
                <input
                  type="text"
                  name="caste"
                  value={formData.caste}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isKannada ? 'ಉಪಜಾತಿ' : 'Sub-caste'}
                </label>
                <input
                  type="text"
                  name="subcaste"
                  value={formData.subcaste}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isKannada ? 'ಪೀಠ' : 'Peeta'}
                </label>
                <input
                  type="text"
                  name="peeta"
                  value={formData.peeta}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isKannada ? 'ಮನೆ ದೇವರು' : 'Home God'}
                </label>
                <input
                  type="text"
                  name="homegod"
                  value={formData.homegod}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </section>

          {/* Personal Details Section */}
          <section className="space-y-6">
            <div className="flex items-center space-x-2 text-xl font-semibold text-gray-900 dark:text-white">
              <User className="w-6 h-6 text-orange-500" />
              <h2>{isKannada ? 'ವೈಯಕ್ತಿಕ ವಿವರಗಳು' : 'Personal Details'}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isKannada ? 'ಎತ್ತರ' : 'Height'}
                </label>
                <input
                  type="text"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder={isKannada ? 'ಉದಾ: 5.8 ಅಡಿ' : 'e.g., 5.8 feet'}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isKannada ? 'ವಿದ್ಯಾಭ್ಯಾಸ' : 'Education'}
                </label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isKannada ? 'ಉದ್ಯೋಗ' : 'Occupation'}
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isKannada ? 'ವೈವಾಹಿಕ ಸ್ಥಿತಿ' : 'Marital Status'}
                </label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">{isKannada ? 'ಆಯ್ಕೆ ಮಾಡಿ' : 'Select'}</option>
                  <option value="never_married">{isKannada ? 'ಅವಿವಾಹಿತ' : 'Never Married'}</option>
                  <option value="divorced">{isKannada ? 'ವಿಚ್ಛೇದಿತ' : 'Divorced'}</option>
                  <option value="widowed">{isKannada ? 'ವಿಧವೆ/ವಿಧುರ' : 'Widowed'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isKannada ? 'ವಾರ್ಷಿಕ ಆದಾಯ' : 'Annual Income'}
                </label>
                <input
                  type="text"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>
          </section>

          {/* Add Other Details section before Partner Preferences */}
          <section className="space-y-6">
            <div className="flex items-center space-x-2 text-xl font-semibold text-gray-900 dark:text-white">
              <Scroll className="w-6 h-6 text-orange-500" />
              <h2>{isKannada ? 'ಇತರ ವಿವರಗಳು' : 'Other Details'}</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                {isKannada ? 'ಹೆಚ್ಚುವರಿ ಮಾಹಿತಿ' : 'Additional Information'}
              </label>
              <textarea
                name="otherDetails"
                value={formData.otherDetails}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </section>

          {/* Partner Preferences Section */}
          <section className="space-y-6">
            <div className="flex items-center space-x-2 text-xl font-semibold text-gray-900 dark:text-white">
              <Heart className="w-6 h-6 text-orange-500" />
              <h2>{isKannada ? 'ಜೀವನ ಸಂಗಾತಿ ಆದ್ಯತೆಗಳು' : 'Partner Preferences'}</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                {isKannada ? 'ಆದ್ಯತೆಗಳ ವಿವರಗಳು' : 'Preference Details'}
              </label>
              <textarea
                name="partnerPreference"
                value={formData.partnerPreference}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </section>

          {/* Family Details Section */}
          <section className="space-y-6">
            <div className="flex items-center space-x-2 text-xl font-semibold text-gray-900 dark:text-white">
              <Users className="w-6 h-6 text-orange-500" />
              <h2>{isKannada ? 'ಕುಟುಂಬದ ವಿವರಗಳು' : 'Family Details'}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isKannada ? 'ತಾಯಿಯ ಹೆಸರು' : "Mother's Name"}
                </label>
                <input
                  type="text"
                  name="mother"
                  value={formData.mother}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isKannada ? 'ತಾಯಿಯ ಉದ್ಯೋಗ' : "Mother's Occupation"}
                </label>
                <input
                  type="text"
                  name="motherOccupation"
                  value={formData.motherOccupation}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isKannada ? 'ಸಹೋದರಿಯರ ಸಂಖ್ಯೆ' : 'Number of Sisters'}
                </label>
                <input
                  type="text"
                  name="sisters"
                  value={formData.sisters}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isKannada ? 'ಸಹೋದರರ ಸಂಖ್ಯೆ' : 'Number of Brothers'}
                </label>
                <input
                  type="text"
                  name="brothers"
                  value={formData.brothers}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </section>

          {/* Contact Information Section */}
          <section className="space-y-6">
            <div className="flex items-center space-x-2 text-xl font-semibold text-gray-900 dark:text-white">
              <Phone className="w-6 h-6 text-orange-500" />
              <h2>{isKannada ? 'ಸಂಪರ್ಕ ಮಾಹಿತಿ' : 'Contact Information'}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isKannada ? 'ಸಂಪರ್ಕ ಸಂಖ್ಯೆ' : 'Contact Number'}
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isKannada ? 'ಇಮೇಲ್' : 'Email'}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isKannada ? 'ವಿಳಾಸ' : 'Address'}
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>
          </section>

          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isKannada ? 'ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...' : 'Submitting...'}
                </span>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {isKannada ? 'ನೋಂದಣಿ ಸಲ್ಲಿಸಿ' : 'Submit Registration'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <div className="text-center">
              {/* Success Icon */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <svg className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                {isKannada ? 'ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ!' : 'Registration Successful!'}
              </h3>

              {/* Message */}
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isKannada 
                    ? 'ಹೆಚ್ಚಿನ ವಿವರಗಳಿಗಾಗಿ ದಯವಿಟ್ಟು ಸಂಪರ್ಕಿಸಿ:'
                    : 'For more details, please contact:'}
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
                  +91 7829146919
                </p>
              </div>

              {/* OK Button */}
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate('/');
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:text-sm"
                >
                  {isKannada ? 'ಸರಿ' : 'OK'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Om Symbol Component
function Om({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor">
      <path d="M50,0C22.4,0,0,22.4,0,50s22.4,50,50,50s50-22.4,50-50S77.6,0,50,0z M76.7,45.9c-0.4,4.7-2.4,8.9-5.9,12.3
        c-3.5,3.4-7.8,5.2-12.7,5.2c-4.9,0-9.2-1.8-12.7-5.2c-3.5-3.4-5.5-7.6-5.9-12.3h-8.9c0.4,7.6,3.4,14.1,8.9,19.5
        c5.5,5.4,12.1,8.1,19.8,8.1c7.7,0,14.3-2.7,19.8-8.1c5.5-5.4,8.5-11.9,8.9-19.5H76.7z"/>
    </svg>
  );
}

export default RegistrationForm; 