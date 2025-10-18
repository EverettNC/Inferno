import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import GroundingExercise from "@/pages/GroundingExercise";
import BreathingExercise from "@/pages/BreathingExercise";
import MindfulnessExercise from "@/pages/MindfulnessExercise";
import ResourcesPage from "@/pages/ResourcesPage";
import ChatPage from "@/pages/ChatPage";
import LandingPage from "@/pages/LandingPage";
import SignInPage from "@/pages/SignInPage";
import { VoiceModePage } from "@/pages/VoiceModePage";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import VoiceFeedback from "@/components/VoiceFeedback";
import PrivacyConsent from "@/components/PrivacyConsent";
import { useVoiceContext } from "@/contexts/VoiceContext";
import { useUserContext } from "@/contexts/UserContext";

function Router() {
  const [location] = useLocation();
  const { user } = useUserContext();
  
  // BYPASS MODE: Allow access to all modules without authentication
  return (
    <Switch>
      <Route path="/signin" component={SignInPage} />
      <Route path="/" component={HomePage} />
      <Route path="/grounding" component={GroundingExercise} />
      <Route path="/breathing" component={BreathingExercise} />
      <Route path="/mindfulness" component={MindfulnessExercise} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/voice" component={VoiceModePage} />
      <Route path="/resources" component={ResourcesPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { isListening } = useVoiceContext();
  const { user } = useUserContext();
  const [location] = useLocation();

  // Hide header/nav on sign-in page
  const isSignInPage = location === '/signin';

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          {/* Show header and navigation except on sign-in page */}
          {!isSignInPage && <Header />}
          <main className={`flex-grow ${!isSignInPage ? 'pb-20' : ''}`}>
            <Router />
          </main>
          {!isSignInPage && <Navigation />}
          {isListening && <VoiceFeedback />}
          <PrivacyConsent />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
