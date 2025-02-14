import { Phone, Mail, Heart } from 'lucide-react';

interface FooterProps {
  isKannada: boolean;
}

export default function Footer({ isKannada }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-orange-500 dark:bg-orange-700 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">
              {isKannada ? 'ಸಂಪರ್ಕಿಸಿ' : 'Contact Us'}
            </h3>
            <div className="space-y-2">
              <a href="tel:7829146919" className="flex items-center justify-center md:justify-start hover:text-orange-100 transition-colors">
                <Phone className="w-5 h-5 mr-2" />
                <span>7829146919</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">
              {isKannada ? 'ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು' : 'Quick Links'}
            </h3>
            <div className="space-y-2">
              <button className="hover:text-orange-100 transition-colors">
                {isKannada ? 'ನೋಂದಣಿ' : 'Register'}
              </button>
            </div>
          </div>

          {/* Brand */}
          <div className="text-center md:text-right">
            <h2 className="text-2xl font-bold mb-2">
              {isKannada ? 'ಕಲ್ಯಾಣ ಬೆಳಕು' : 'Kalyana Belaku'}
            </h2>
            <p className="text-sm opacity-90">
              {isKannada 
                ? 'ಜಂಗಮ ಮತ್ತು ಲಿಂಗಾಯಿತ ವಧು ವರರ ವೇದಿಕೆ' 
                : 'Jangama and Lingayat Matrimony Platform'}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/20 text-center flex items-center justify-center space-x-2">
          <span>© {currentYear}</span>
          <Heart className="w-4 h-4 text-red-300" />
          <span>
            {isKannada ? 'ಕಲ್ಯಾಣ ಬೆಳಕು' : 'Kalyana Belaku'}
          </span>
        </div>
      </div>
    </footer>
  );
}