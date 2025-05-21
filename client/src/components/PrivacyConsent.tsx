import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function PrivacyConsent() {
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  
  useEffect(() => {
    // Check if user has already accepted privacy terms
    const privacyAccepted = localStorage.getItem("privacyAccepted");
    if (!privacyAccepted) {
      setShowPrivacyDialog(true);
    }
  }, []);
  
  const handleAcceptPrivacy = () => {
    localStorage.setItem("privacyAccepted", "true");
    setShowPrivacyDialog(false);
  };
  
  const handleShowDetails = () => {
    // Implement privacy details page navigation
    window.open("/privacy-policy", "_blank");
  };
  
  if (!showPrivacyDialog) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white rounded-t-xl sm:rounded-xl max-w-lg w-full mx-4 p-5 sm:p-6 shadow-lg">
        <h2 className="font-display text-xl font-bold text-neutral-800 mb-3">Your Privacy Matters</h2>
        
        <p className="text-neutral-700 mb-4">
          Inferno AI is designed with your privacy and safety as top priorities. Here's how we handle your data:
        </p>
        
        <ul className="space-y-3 mb-5">
          <li className="flex">
            <i className="fas fa-check-circle text-success-600 mt-1 mr-2"></i>
            <div className="text-neutral-700 text-sm">
              <strong>Your data stays local</strong> - Most of your personal information is stored only on your device.
            </div>
          </li>
          <li className="flex">
            <i className="fas fa-check-circle text-success-600 mt-1 mr-2"></i>
            <div className="text-neutral-700 text-sm">
              <strong>Anonymous usage</strong> - We collect anonymous usage data to improve the app, but this never includes your personal content.
            </div>
          </li>
          <li className="flex">
            <i className="fas fa-check-circle text-success-600 mt-1 mr-2"></i>
            <div className="text-neutral-700 text-sm">
              <strong>No medical data stored</strong> - Inferno AI is not a medical device and doesn't store sensitive medical information.
            </div>
          </li>
          <li className="flex">
            <i className="fas fa-check-circle text-success-600 mt-1 mr-2"></i>
            <div className="text-neutral-700 text-sm">
              <strong>Crisis support</strong> - For your safety, we may connect you with crisis resources, but only with your consent.
            </div>
          </li>
        </ul>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            className="px-5 py-3 bg-primary-600 text-white font-medium hover:bg-primary-700 transition flex-1"
            onClick={handleAcceptPrivacy}>
            I Understand & Accept
          </Button>
          <Button 
            variant="outline"
            className="px-5 py-3 border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-100 transition"
            onClick={handleShowDetails}>
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
