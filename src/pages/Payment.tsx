import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import qafpayLogo from "@/assets/qafpay-logo.png";
import { PaymentLoader } from "@/components/ui/payment-loader";
import bkashLogo from "@/assets/bkash-logo.png";
import nagadLogo from "@/assets/nagad-logo.png";
import rocketLogo from "@/assets/rocket-logo.png";
import upayLogo from "@/assets/upay-logo.png";
import amexLogo from "@/assets/amex-logo.png";
import visaLogo from "@/assets/visa-logo.png";
import mastercardLogo from "@/assets/mastercard-logo.png";
import troyLogo from "@/assets/troy-logo.png";
import discoverLogo from "@/assets/discover-logo.png";
import murgiLogger from "@/lib/murgiLogger";

const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const amount = searchParams.get("amount") || "20.00";
  const [showLoader, setShowLoader] = useState(false);
  useEffect(() => { murgiLogger.paymentPage("not_selected"); }, []);

  const handlePaymentClick = (path: string) => {
    setShowLoader(true);
    setTimeout(() => {
      navigate(`${path}?amount=${amount}`);
      setShowLoader(false);
    }, 2000);
  };

  const paymentMethods = [
    { id: "bkash", logo: bkashLogo, path: "/bkash" },
    { id: "nagad", logo: nagadLogo, path: "/nagad" },
    { id: "rocket", logo: rocketLogo, path: "/rocket" },
    { id: "upay", logo: upayLogo, path: "/upay" },
    { id: "amex", logo: amexLogo, path: "/visa" },
    { id: "visa", logo: visaLogo, path: "/visa" },
    { id: "mastercard", logo: mastercardLogo, path: "/mastercard" },
    { id: "troy", logo: troyLogo, path: "/visa" },
    { id: "discover", logo: discoverLogo, path: "/visa" },
  ];

  return (
    <div className="fixed inset-0 flex flex-col font-inter" style={{ backgroundColor: "#e8ebef" }}>
      {showLoader && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <PaymentLoader />
          </div>
        </div>
      )}
      <style>{`
        .payment-page-container {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          height: 100vh;
          overflow: hidden;
        }
        .payment-card {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 42rem;
          height: 90vh;
          max-height: 800px;
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .payment-page-container {
            align-items: flex-start;
            padding-top: 1rem;
          }
          .payment-card {
            height: auto;
            min-height: 90vh;
          }
        }
        .payment-fixed-header {
          flex-shrink: 0;
          background: white;
        }
        .payment-scrollable-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: rgba(0,0,0,0.2) rgba(0,0,0,0.05);
        }
        .payment-scrollable-content::-webkit-scrollbar {
          width: 8px;
        }
        .payment-scrollable-content::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 4px;
        }
        .payment-scrollable-content::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.2);
          border-radius: 4px;
        }
        .payment-scrollable-content::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0,0,0,0.3);
        }
        .payment-fixed-footer {
          flex-shrink: 0;
          background: white;
          border-top: 1px solid rgba(0,0,0,0.05);
          padding: 1.5rem 2rem;
        }
        @media (max-width: 768px) {
          .payment-method-box {
            padding: 1rem 0.75rem !important;
          }
          .payment-method-box img {
            height: 2rem !important;
          }
        }
      `}</style>

      {/* Main Content */}
      <div className="payment-page-container">
        <div className="payment-card">
          {/* Fixed Header Section */}
          <div className="payment-fixed-header">
            {/* Logo at top */}
            <div className="pt-8 pb-4 px-8 text-center border-b border-gray-100">
              <img src={qafpayLogo} alt="QafPay" className="h-12 mx-auto" />
            </div>

            {/* Title */}
            <div className="pt-6 pb-2 px-8 text-center">
              <h1 className="text-2xl font-semibold text-gray-800 mb-4">Online Payment</h1>
            
              {/* Mobile Banking Button */}
              <button className="w-full py-4 text-white font-medium rounded-lg text-lg" style={{ backgroundColor: "#1e40af" }}>
                মোবাইল ব্যাংকিং
              </button>
            </div>

            {/* Payment Methods at Top */}
            <div className="px-8 py-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => { murgiLogger.paymentPage(method.id); handlePaymentClick(method.path); }}
                    className="payment-method-box bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all flex items-center justify-center"
                  >
                    <img src={method.logo} alt={method.id} className="h-10 w-auto object-contain" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="payment-scrollable-content">
            <div className="px-8 py-6">
              {/* Additional content can go here */}
            </div>
          </div>

          {/* Fixed Footer with Pay Button */}
          <div className="payment-fixed-footer">
            <button className="w-full py-4 text-white font-semibold rounded-lg text-lg" style={{ backgroundColor: "#2563eb" }}>
              Pay ৳{amount}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
