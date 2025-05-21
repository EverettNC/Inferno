import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";

export default function PrivacyConsent() {
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  
  useEffect(() => {
    // Check if user has already accepted privacy terms
    const checkConsent = () => {
      const privacyAccepted = localStorage.getItem("privacyAccepted");
      if (!privacyAccepted) {
        setShowPrivacyDialog(true);
      }
    };
    
    // Small delay to ensure storage is checked after mount
    const timer = setTimeout(() => {
      checkConsent();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleAcceptPrivacy = () => {
    localStorage.setItem("privacyAccepted", "true");
    setShowPrivacyDialog(false);
  };
  
  const handleShowDetails = () => {
    // Implement privacy details page navigation
    window.open("/privacy-policy", "_blank");
  };
  
  return (
    <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-neutral-800">Your Privacy Matters</DialogTitle>
          <DialogDescription className="text-neutral-700">
            Inferno AI is designed with your privacy and safety as top priorities. Here's how we handle your data:
          </DialogDescription>
        </DialogHeader>
        
        <ul className="space-y-3 my-4">
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-neutral-700 text-sm">
              <strong>Your data stays local</strong> - Most of your personal information is stored only on your device.
            </div>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-neutral-700 text-sm">
              <strong>Anonymous usage</strong> - We collect anonymous usage data to improve the app, but this never includes your personal content.
            </div>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-neutral-700 text-sm">
              <strong>No medical data stored</strong> - Inferno AI is not a medical device and doesn't store sensitive medical information.
            </div>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-neutral-700 text-sm">
              <strong>Crisis support</strong> - For your safety, we may connect you with crisis resources, but only with your consent.
            </div>
          </li>
        </ul>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-3">
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
