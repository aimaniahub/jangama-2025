import React from 'react';
import { X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethod: string;
  amount: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  paymentMethod,
  amount = "5" // Updated amount to 500
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  // Payment details
  const paymentDetails = {
    upiId: "9353789909suco@ybl",
    name: "Kalyana Belaku",
    currency: "INR",
    message: "Marriage Registration Fee"
  };

  // Generate payment links for different apps
  const getPaymentLink = () => {
    const baseUpiUrl = `upi://pay?pa=${paymentDetails.upiId}&pn=${encodeURIComponent(paymentDetails.name)}&am=${amount}&cu=${paymentDetails.currency}&tn=${encodeURIComponent(paymentDetails.message)}`;
    
    switch(paymentMethod) {
      case 'GPay':
        return `upi://pay?pa=${paymentDetails.upiId}&pn=${encodeURIComponent(paymentDetails.name)}&am=${amount}&cu=${paymentDetails.currency}&tn=${encodeURIComponent(paymentDetails.message)}`;
      case 'PhonePe':
        return `upi://pay?pa=${paymentDetails.upiId}&pn=${encodeURIComponent(paymentDetails.name)}&am=${amount}&cu=${paymentDetails.currency}&tn=${encodeURIComponent(paymentDetails.message)}`;
      case 'Bank':
        return baseUpiUrl;
      default:
        return baseUpiUrl;
    }
  };

  const handleDirectPayment = async () => {
    if (!auth.currentUser) {
      toast.error('Please login first');
      return;
    }

    try {
      // Record payment initiation in Firestore
      await setDoc(doc(db, 'payments', auth.currentUser.uid), {
        userId: auth.currentUser.uid,
        amount: amount,
        status: 'initiated',
        method: paymentMethod,
        timestamp: new Date().toISOString()
      }, { merge: true });

      // Open payment app
      const paymentUrl = getPaymentLink();
      window.location.href = paymentUrl;

      // Show instructions
      toast.success('After payment, please send the screenshot to proceed', {
        duration: 5000
      });

      // Close modal and redirect to registration
      onClose();
      navigate('/registration-form');
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Failed to initiate payment. Please try again.');
    }
  };

  // Fallback for desktop or if app doesn't open
  const handleFallbackPayment = () => {
    const fallbackUrl = `upi://pay?pa=${paymentDetails.upiId}&pn=${encodeURIComponent(paymentDetails.name)}&am=${amount}&cu=${paymentDetails.currency}`;
    window.location.href = fallbackUrl;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Pay with {paymentMethod}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2 dark:text-white">Amount: ₹{parseInt(amount)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Scan QR code or click the button below to pay
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center bg-white p-4 rounded-lg">
            <QRCodeSVG 
              value={getPaymentLink()}
              size={200}
              level="H"
              includeMargin={true}
              className="rounded-lg"
            />
          </div>

          {/* Direct Payment Button */}
          <button
            onClick={handleDirectPayment}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Pay ₹{amount} with {paymentMethod}
          </button>

          {/* Fallback Button */}
          <button
            onClick={handleFallbackPayment}
            className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg font-medium transition-colors mt-2"
          >
            Pay using any UPI App
          </button>

          {/* Payment Instructions */}
          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
            <p>1. Scan the QR code with any UPI app</p>
            <p>2. Or click the button above to open {paymentMethod}</p>
            <p>3. Complete the payment in your UPI app</p>
            <p>4. Take a screenshot of the payment success</p>
            <p>5. Send the screenshot to: <span className="font-semibold">78291 46919</span></p>
          </div>

          {/* UPI ID Display */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            <p>UPI ID: <span className="font-mono font-medium">{paymentDetails.upiId}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 
