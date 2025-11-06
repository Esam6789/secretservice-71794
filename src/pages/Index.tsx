import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "@/components/ui/loader";
import Header from "@/components/Header";

const platformLogos = {
  Facebook: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Facebook_icon.svg",
  Instagram: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
  YouTube: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/YouTube_social_red_squircle_%282024%29.svg/250px-YouTube_social_red_squircle_%282024%29.svg.png",
  TikTok: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Tiktok_icon.svg/144px-Tiktok_icon.svg.png?20240827133148",
  FreeFire: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzxd5f6owtc5TnHEQFm04eg1ZMeozaHey9NbeGFW4Ilga6diS49GVi64LkfY0lK8awlObi",
  Subscriptions: "https://cdn-icons-png.flaticon.com/512/2702/2702602.png"
};

const initialServices = {
  Facebook: [
    { id: 2, title: "1K Page Followers", sub: "Facebook Page Followers", price: 20, type: "link" },
    { id: 3, title: "5K Facebook Followers", sub: "Facebook Followers", price: 60, type: "link" },
    { id: 1, title: "60k Minutes watchtime", sub: "Facebook Watch Time", price: 70, type: "link" },
    { id: 1, title: "10K Post Likes", sub: "Facebook Post Likes", price: 20, type: "link" }
  ],
  Instagram: [
    { id: 5, title: "1K Followers", sub: "Instagram Followers", price: 20, type: "link" },
    { id: 6, title: "5K Followers", sub: "Instagram Followers", price: 60, type: "link" },
    { id: 7, title: "10K Posts Likes", sub: "Instagram Likes", price: 50, type: "link" },
    { id: 18, title: "100K Posts Likes", sub: "Instagram Likes", price: 300, type: "link" }
  ],
  YouTube: [
    { id: 8, title: "1K Subscribers", sub: "YouTube Subscribers", price: 20, type: "link" },
    { id: 11, title: "4K Hours Watch Time", sub: "YouTube Watchtime", price: 70, type: "link" },
    { id: 9, title: "100K Video Views", sub: "YouTube Video Views", price: 40, type: "link" },
    { id: 10, title: "10K Likes", sub: "YouTube Likes", price: 30, type: "link" }
  ],
  TikTok: [
    { id: 12, title: "1K Followers", sub: "TikTok Followers", price: 20, type: "link" },
    { id: 13, title: "5K Followers", sub: "TikTok Followers", price: 60, type: "link" },
    { id: 14, title: "10K Likes", sub: "TikTok Likes", price: 40, type: "link" },
    { id: 19, title: "100K Likes", sub: "TikTok Likes", price: 200, type: "link" }
  ],
  FreeFire: [
    { id: 15, title: "100 Diamonds", sub: "Free Fire Top-up", price: 40, type: "uid" },
    { id: 16, title: "500 Diamonds", sub: "Free Fire Top-up", price: 110, type: "uid" },
    { id: 17, title: "1000 Diamonds", sub: "Free Fire Top-up", price: 200, type: "uid" },
    { id: 20, title: "5000 Diamonds", sub: "Free Fire Top-up", price: 800, type: "uid" }
  ],
  Subscriptions: [
    { id: 21, title: "ChatGPT Premium Lifetime", sub: "AI Assistant Premium", price: 120, type: "link", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/512px-ChatGPT_logo.svg.png" },
    { id: 22, title: "YouTube Premium Lifetime", sub: "Ad-free YouTube", price: 80, type: "link", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/YouTube_social_red_squircle_%282024%29.svg/250px-YouTube_social_red_squircle_%282024%29.svg.png" },
    { id: 23, title: "Truecaller Premium Lifetime", sub: "Caller ID Premium", price: 60, type: "link", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Truecaller_Logo.svg/1920px-Truecaller_Logo.svg.png" },
    { id: 24, title: "Facebook Meta Verify 1 Month", sub: "Meta Verification", price: 38, type: "link", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Facebook_icon.svg" },
    { id: 25, title: "Netflix Premium Lifetime", sub: "Streaming Service", price: 100, type: "link", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/512px-Netflix_2015_logo.svg.png" },
    { id: 26, title: "Telegram Premium Lifetime", sub: "Messaging Premium", price: 50, type: "link", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/512px-Telegram_logo.svg.png" }
  ]
};

// Load data from localStorage or use defaults
const loadServicesData = () => {
  const stored = localStorage.getItem('servicesData');
  return stored ? JSON.parse(stored) : initialServices;
};

const loadPlatformLogos = () => {
  const stored = localStorage.getItem('platformLogos');
  return stored ? JSON.parse(stored) : platformLogos;
};

const loadSiteSettings = () => {
  const stored = localStorage.getItem('siteSettings');
  return stored ? JSON.parse(stored) : {
    siteName: "GenZ SMM",
    siteTagline: "Social Media Marketing",
    contactEmail: "support@genzsmm.com",
    contactPhone: "+880 1234-567890",
    promoCode: "ROSE10",
    promoDiscount: 10
  };
};

const PROMO_CODE = "ROSE10";
const PROMO_DISCOUNT = 0.10;

const Index = () => {
  const navigate = useNavigate();
  const [showPreloader, setShowPreloader] = useState(true);
  const [view, setView] = useState<"platforms" | "services">("platforms");
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [inputValue, setInputValue] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoStatus, setPromoStatus] = useState<"default" | "success" | "error">("default");
  const [platformLoading, setPlatformLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem('theme');
    return (saved as "light" | "dark") || "light";
  });
  
  // Load data from localStorage
  const [allServices, setAllServices] = useState(loadServicesData());
  const [logos, setLogos] = useState(loadPlatformLogos());
  const [siteSettings, setSiteSettings] = useState(loadSiteSettings());

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Preloader effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Refresh data when component mounts or becomes visible
  useEffect(() => {
    const refreshData = () => {
      setAllServices(loadServicesData());
      setLogos(loadPlatformLogos());
      setSiteSettings(loadSiteSettings());
    };
    
    refreshData();
    
    // Listen for storage changes
    window.addEventListener('storage', refreshData);
    
    // Also refresh when window gains focus (for same-tab updates)
    window.addEventListener('focus', refreshData);
    
    return () => {
      window.removeEventListener('storage', refreshData);
      window.removeEventListener('focus', refreshData);
    };
  }, []);

  const handlePlatformClick = (platform: string) => {
    setPlatformLoading(true);
    setTimeout(() => {
      setSelectedPlatform(platform);
      setView("services");
      setPlatformLoading(false);
    }, 500);
  };

  const handleServiceClick = (service: any) => {
    setPlatformLoading(true);
    setTimeout(() => {
      setSelectedService(service);
      setShowPopup(true);
      setInputValue("");
      setPromoCode("");
      setPromoStatus("default");
      setPlatformLoading(false);
    }, 500);
  };

  const handlePromoChange = (value: string) => {
    setPromoCode(value);
    const code = value.trim().toUpperCase();
    if (code === "") {
      setPromoStatus("default");
    } else if (code === siteSettings.promoCode) {
      setPromoStatus("success");
    } else {
      setPromoStatus("error");
    }
  };

  const handleOrderNow = () => {
    if (!inputValue.trim()) {
      alert("Please enter required info");
      return;
    }
    if (promoCode.trim().toUpperCase() !== siteSettings.promoCode) {
      alert("Valid promo required!");
      return;
    }

    const finalPrice = Math.round(selectedService.price * (1 - (siteSettings.promoDiscount / 100)));
    
    // Save pending order to localStorage
    const pendingOrder = {
      id: `ORD${Date.now()}`,
      serviceId: selectedService.id.toString(),
      serviceName: selectedService.title,
      platform: selectedPlatform || "",
      amount: finalPrice.toString(),
      target: inputValue,
      promo: siteSettings.promoCode,
      date: new Date().toISOString().split('T')[0]
    };
    
    const existingOrders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
    existingOrders.push(pendingOrder);
    localStorage.setItem('pendingOrders', JSON.stringify(existingOrders));
    
    const params = new URLSearchParams({
      serviceId: selectedService.id.toString(),
      serviceName: selectedService.title,
      platform: selectedPlatform || "",
      amount: finalPrice.toString(),
      target: inputValue,
      promo: siteSettings.promoCode
    });
    navigate(`/payment?${params.toString()}`);
  };

  const getPromoMessage = () => {
    if (promoStatus === "success" && selectedService) {
      const newPrice = Math.round(selectedService.price * (1 - (siteSettings.promoDiscount / 100)));
      return `✅ Promo applied! New price ৳${newPrice}`;
    }
    if (promoStatus === "error") {
      return "সঠিক প্রমো কোড পেতে এডমিন কে মেসেজ দিন।";
    }
    return `Use promo code for ${siteSettings.promoDiscount}% discount`;
  };

  const getInputLabel = () => {
    if (selectedPlatform === "Facebook") return "Enter Facebook Page Link";
    if (selectedPlatform === "Instagram") return "Enter Instagram Profile Link";
    if (selectedPlatform === "YouTube") return "Enter YouTube Channel Link";
    if (selectedPlatform === "TikTok") return "Enter TikTok Profile Link";
    if (selectedPlatform === "FreeFire") return "Enter Free Fire UID";
    if (selectedPlatform === "Subscriptions") return "Enter Your Email";
    return "Enter Link/ID";
  };

  const handleBackToPlatforms = () => {
    setPlatformLoading(true);
    setTimeout(() => {
      setView("platforms");
      setPlatformLoading(false);
    }, 300);
  };

  if (showPreloader) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999
      }}>
        <div style={{
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '24px',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            GenZ SMM
          </div>
          <Loader className="scale-150" />
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
        `}</style>
      </div>
    );
  }

  return (
      <>

      {platformLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(16px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Loader className="text-white scale-150" />
          </div>
        </div>
      )}
      <style>{`
        @keyframes wave {
          0% {
            transform: translateX(0) translateZ(0) scaleY(1);
          }
          50% {
            transform: translateX(-25%) translateZ(0) scaleY(0.8);
          }
          100% {
            transform: translateX(-50%) translateZ(0) scaleY(1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Poppins', 'Inter', sans-serif;
          min-height: 100vh;
          padding: 0;
          margin: 0;
          position: relative;
          overflow-x: hidden;
          background: ${theme === "light" ? "white" : "#0f172a"};
          transition: background 0.3s ease;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .header {
          padding: 16px 20px;
          margin-bottom: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 100;
          width: 100%;
        }
        .header-title {
          font-size: 16px;
          font-weight: 800;
          color: ${theme === "light" ? "#1f2937" : "#f1f5f9"};
          margin: 0;
          letter-spacing: 0.3px;
          transition: color 0.3s ease;
        }
        .theme-toggle {
          background: ${theme === "light" ? "#f3f4f6" : "#1e293b"};
          border: 2px solid ${theme === "light" ? "#e5e7eb" : "#334155"};
          border-radius: 8px;
          cursor: pointer;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          color: ${theme === "light" ? "#1f2937" : "#f1f5f9"};
          margin-right: 8px;
        }
        .theme-toggle:hover {
          background: ${theme === "light" ? "#e5e7eb" : "#334155"};
          transform: scale(1.08) rotate(5deg);
          border-color: ${theme === "light" ? "#d1d5db" : "#475569"};
        }
        .theme-toggle:active {
          transform: scale(0.95);
        }
        .theme-toggle svg {
          width: 20px;
          height: 20px;
          transition: transform 0.3s ease;
        }
        .menu-toggle {
          background: ${theme === "light" ? "#f3f4f6" : "#1e293b"};
          border: 2px solid ${theme === "light" ? "#e5e7eb" : "#334155"};
          border-radius: 8px;
          cursor: pointer;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          color: ${theme === "light" ? "#1f2937" : "#f1f5f9"};
        }
        .menu-toggle:hover {
          background: ${theme === "light" ? "#e5e7eb" : "#334155"};
          border-color: ${theme === "light" ? "#d1d5db" : "#475569"};
          transform: scale(1.08);
        }
        .menu-toggle:active {
          transform: scale(0.95);
        }
        .menu-toggle svg {
          width: 20px;
          height: 20px;
          transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .menu-toggle.open svg {
          transform: rotate(90deg);
        }
        @media (max-width: 768px) {
          .header {
            padding: 12px 16px !important;
            margin-bottom: 24px !important;
          }
          .header-title {
            font-size: 14px !important;
            letter-spacing: 0.2px !important;
          }
          .theme-toggle, .menu-toggle {
            padding: 5px !important;
          }
          .theme-toggle svg, .menu-toggle svg {
            width: 18px !important;
            height: 18px !important;
          }
        }
        .menu-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 32px;
          background: ${theme === "light" ? "rgba(255, 255, 255, 0.98)" : "rgba(30, 41, 59, 0.98)"};
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 12px;
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
          min-width: 220px;
          z-index: 1000;
          border: 1px solid ${theme === "light" ? "rgba(255, 255, 255, 0.3)" : "rgba(71, 85, 105, 0.3)"};
        }
        @media (max-width: 768px) {
          .menu-dropdown {
            right: 16px;
          }
        }
        .menu-item {
          width: 100%;
          background: transparent;
          border: none;
          color: ${theme === "light" ? "#1f2937" : "#f1f5f9"};
          padding: 14px 18px;
          text-align: left;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          border-radius: 10px;
          transition: all 0.2s ease;
          margin-bottom: 4px;
          display: block;
        }
        .menu-item:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: translateX(6px);
        }
        .menu-item:last-child {
          margin-bottom: 0;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }
        .card {
          background: ${theme === "light" ? "white" : "#1e293b"};
          border-radius: 12px;
          padding: 20px 16px;
          box-shadow: 0 2px 8px ${theme === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(0, 0, 0, 0.3)"};
          transition: all 0.3s ease;
          cursor: pointer;
          border: 2px solid ${theme === "light" ? "#e5e7eb" : "#334155"};
          text-align: center;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.15);
          border-color: #667eea;
        }
        .card-logo-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 12px;
          height: 50px;
        }
        .card img {
          max-height: 45px;
          max-width: 45px;
          object-fit: contain;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }
        .card h3 {
          font-size: 14px;
          font-weight: 600;
          color: ${theme === "light" ? "#1f2937" : "#f1f5f9"};
          margin: 8px 0 4px 0;
        }
        .card p {
          font-size: 11px;
          color: ${theme === "light" ? "#6b7280" : "#94a3b8"};
          margin: 0;
        }
        .price {
          font-size: 20px;
          font-weight: 700;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-top: 8px;
        }
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          background: rgba(255, 255, 255, 0.95);
          border: 2px solid #667eea;
          border-radius: 12px;
          color: #667eea;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .back-btn:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        .footer {
          padding: 24px 32px;
          marginTop: 60px;
          textAlign: center;
          width: 100%;
          position: relative;
          zIndex: 1;
        }
        @media (max-width: 768px) {
          .header {
            padding: 12px 16px;
            margin-bottom: 24px;
          }
          .header-title {
            font-size: 14px;
            letter-spacing: 0.2px;
          }
          .theme-toggle {
            padding: 6px;
            margin-right: 6px;
          }
          .theme-toggle svg {
            width: 18px;
            height: 18px;
          }
          .menu-toggle {
            padding: 6px;
          }
          .menu-toggle svg {
            width: 18px;
            height: 18px;
          }
          .grid {
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 12px;
          }
          .card {
            padding: 16px 12px;
          }
          .footer-content {
            grid-template-columns: 1fr;
            text-align: center;
          }
        }
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .popup-box {
          background: white;
          padding: 32px;
          border-radius: 24px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease;
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .popup-logo {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
          height: 80px;
        }
        .popup-logo img {
          max-height: 70px;
          max-width: 70px;
          object-fit: contain;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }
        .popup h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          text-align: center;
        }
        .popup-sub {
          margin: 0 0 24px 0;
          font-size: 15px;
          color: #6b7280;
          text-align: center;
        }
        .popup label {
          display: block;
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }
        .popup input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          border: 2px solid #e5e7eb;
          background: #f9fafb;
          font-size: 15px;
          color: #1f2937;
          margin-bottom: 16px;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s ease;
        }
        .popup input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
        }
        .discount {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 20px;
          padding: 12px;
          border-radius: 10px;
          text-align: center;
        }
        .discount.default {
          background: #f3f4f6;
          color: #6b7280;
        }
        .discount.success {
          background: #d1fae5;
          color: #059669;
        }
        .discount.error {
          background: #fee2e2;
          color: #dc2626;
        }
        .popup button {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 12px;
        }
        .popup button:first-of-type {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        .popup button:first-of-type:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }
        .popup button:last-of-type {
          background: #f3f4f6;
          color: #6b7280;
        }
        .popup button:last-of-type:hover {
          background: #e5e7eb;
        }
        @media (max-width: 768px) {
          .header h1 {
            font-size: 32px;
          }
          .grid {
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 16px;
          }
          .card {
            padding: 24px 16px;
          }
        }
      `}</style>

      <div style={{ 
        minHeight: "100vh", 
        background: theme === "light" 
          ? "white" 
          : "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        padding: "24px"
      }}>
        
        <Header theme={theme} onThemeToggle={toggleTheme} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {view === "platforms" && (
          <div className="grid">
            {Object.keys(allServices).map((platform) => (
              <div key={platform} className="card" onClick={() => handlePlatformClick(platform)}>
                <div className="card-logo-wrapper">
                  <img src={logos[platform as keyof typeof logos] || platformLogos[platform as keyof typeof platformLogos]} alt={platform} />
                </div>
                <h3>{platform}</h3>
                <p>Explore {platform} services</p>
              </div>
            ))}
          </div>
        )}

        {view === "services" && selectedPlatform && (
          <>
            <div className="grid">
              {allServices[selectedPlatform as keyof typeof allServices]?.map((service, idx) => (
                <div key={idx} className="card" onClick={() => handleServiceClick(service)}>
                  <div className="card-logo-wrapper">
                    <img src={service.logo || logos[selectedPlatform as keyof typeof logos] || platformLogos[selectedPlatform as keyof typeof platformLogos]} alt={selectedPlatform} />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.sub}</p>
                  <div className="price">৳{service.price}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <button className="back-btn" onClick={handleBackToPlatforms}>
                ← Back to Platforms
              </button>
            </div>
          </>
        )}

        {/* Stats & Features Section */}
        <div style={{ 
          marginTop: '48px',
          marginBottom: '48px',
          textAlign: 'center',
          padding: '0 20px'
        }}>
          <h2 style={{ 
            fontSize: '24px',
            fontWeight: '700',
            color: theme === "light" ? "#1f2937" : "#f1f5f9",
            marginBottom: '12px'
          }}>
            Ready to Boost Your Presence?
          </h2>
          <p style={{ 
            fontSize: '14px',
            color: theme === "light" ? "#6b7280" : "#94a3b8",
            marginBottom: '32px',
            maxWidth: '600px',
            margin: '0 auto 32px'
          }}>
            Choose your platform and start growing today with our premium services!
          </p>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '20px',
            maxWidth: '800px',
            margin: '0 auto 32px'
          }}>
            <div>
              <div style={{ 
                fontSize: '28px',
                fontWeight: '700',
                color: '#667eea',
                marginBottom: '4px'
              }}>10K+</div>
              <div style={{ 
                fontSize: '12px',
                color: theme === "light" ? "#6b7280" : "#94a3b8",
                fontWeight: '500'
              }}>Happy Clients</div>
            </div>
            <div>
              <div style={{ 
                fontSize: '28px',
                fontWeight: '700',
                color: '#667eea',
                marginBottom: '4px'
              }}>99%</div>
              <div style={{ 
                fontSize: '12px',
                color: theme === "light" ? "#6b7280" : "#94a3b8",
                fontWeight: '500'
              }}>Success Rate</div>
            </div>
            <div>
              <div style={{ 
                fontSize: '28px',
                fontWeight: '700',
                color: '#667eea',
                marginBottom: '4px'
              }}>24/7</div>
              <div style={{ 
                fontSize: '12px',
                color: theme === "light" ? "#6b7280" : "#94a3b8",
                fontWeight: '500'
              }}>Support</div>
            </div>
            <div>
              <div style={{ 
                fontSize: '28px',
                fontWeight: '700',
                color: '#667eea',
                marginBottom: '4px'
              }}>5M+</div>
              <div style={{ 
                fontSize: '12px',
                color: theme === "light" ? "#6b7280" : "#94a3b8",
                fontWeight: '500'
              }}>Orders Delivered</div>
            </div>
          </div>

          {/* Features */}
          <div style={{
            fontSize: '13px',
            color: theme === "light" ? "#374151" : "#cbd5e1",
            fontWeight: '500',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <span>⚡ Lightning Fast Delivery</span>
            <span>•</span>
            <span>💎 Premium Quality</span>
            <span>•</span>
            <span>🔒 100% Secure</span>
            <span>•</span>
            <span>🎯 Real Growth</span>
            <span>•</span>
            <span>🛡️ Money Back Guarantee</span>
          </div>
        </div>
        </div>

        <div className="footer">
          <p style={{
            color: "#6b7280", 
            fontSize: "14px", 
            lineHeight: "1.8",
            margin: 0, 
            fontWeight: "400",
            textAlign: "center"
          }}>
            Genz SMM এ ২৪ ঘন্টাই সার্ভিস চালু থাকে যা অটোমেটিক সিস্টেম দ্বারা পরিচালিত....!!! যেকোনো সমস্যায় আমাদের টেলিগ্রাম এ মেসেজ দিন । ⚠ এটা পরিষ্কার এবং স্বতন্ত্র যে আমরা কোন ধরনের বেআইনি কার্যকলাপ সমর্থন করি না। আমরা সমস্ত গোপনীয়তা নীতি এবং সমস্ত সরকারী আইনকে সম্মান করি। GenZ SMM হচ্ছে Social Media Boost এর একটি নির্ভরযোগ্য প্রতিষ্ঠান, যা আমাদের অটোমেটেড সার্ভিসের আওতাভুক্ত একটি বিশেষ প্রোডাক্ট।
            <br /><br />
            © Copyright 2022. All Rights Reserved.
          </p>
        </div>
      </div>

      {showPopup && selectedService && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-box popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-logo">
              <img src={selectedService.logo || logos[selectedPlatform!] || platformLogos[selectedPlatform!]} alt={selectedPlatform || ""} />
            </div>
            <h2>{selectedService.title}</h2>
            <p className="popup-sub">{selectedService.sub}</p>
            
            <label>{getInputLabel()}</label>
            <input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your link or ID"
            />
            
            <label>Promo Code</label>
            <input 
              value={promoCode}
              onChange={(e) => handlePromoChange(e.target.value)}
              placeholder="Enter promo code"
            />
            
            <div className={`discount ${promoStatus}`}>{getPromoMessage()}</div>
            
            <button onClick={handleOrderNow}>
              Order Now
            </button>
            <button onClick={() => setShowPopup(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
