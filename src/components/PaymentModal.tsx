import React from 'react';
import { X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react'; // Change the import to use named import
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
  amount = "5" // Default amount in paise
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  // Replace these with your actual UPI details
  const upiDetails = {
    upiId: "9353789909suco@ybl", // You'll provide this
    name: "Kalyana Belaku",
    currency: "INR"
  };

  const upiLink = `upi://pay?pa=${upiDetails.upiId}&pn=${encodeURIComponent(upiDetails.name)}&am=${amount}&cu=${upiDetails.currency}`;

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

      // Open UPI payment
      window.location.href = upiLink;

      // Show instructions
      toast.success('After payment, please proceed to registration', {
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
            <p className="text-lg font-semibold mb-2">Amount: ₹{parseInt(amount)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Scan QR code or click the button below to pay
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center bg-white p-4 rounded-lg">
            <QRCodeSVG 
              value={upiLink}
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
            Pay Now with UPI Apps
          </button>

          {/* Payment Instructions */}
          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
            <p>1. Scan the QR code with any UPI app</p>
            <p>2. Or click the button above to open your UPI app</p>
            <p>3. Complete the payment in your UPI app</p>
            <p>4. Take a screenshot of the payment success</p>
            <p>5. Send the screenshot to: <span className="font-semibold">78291 46919</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 