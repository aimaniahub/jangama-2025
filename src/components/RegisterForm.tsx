import { FC } from 'react';
import { UserPlus } from 'lucide-react';

interface RegisterFormProps {
  isKannada: boolean;
}

export default function RegisterForm({ isKannada }: RegisterFormProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        {isKannada ? 'ನೋಂದಣಿ ಫಾರ್ಮ್' : 'Registration Form'}
      </h2>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {isKannada ? 'ಹೆಸರು' : 'Name'}
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {isKannada ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : 'Mobile Number'}
          </label>
          <input
            type="tel"
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          <span>{isKannada ? 'ನೋಂದಣಿ ಮಾಡಿ' : 'Register Now'}</span>
        </button>
      </form>
    </div>
  );
}