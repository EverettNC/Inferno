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
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import VoiceFeedback from "@/components/VoiceFeedback";
import PrivacyConsent from "@/components/PrivacyConsent";
import { useVoiceContext } from "@/contexts/VoiceContext";
import { useUserContext } from "@/contexts/UserContext";

function Router() {
  const [location] = useLocation();
  const { user } = useUserContext();
  
  // Show sign-in page if user is not authenticated
  if (!user) {
    return (
      <Switch>
        <Route path="/" component={SignInPage} />
        <Route path="/signup" component={SignInPage} /> {/* Reuse SignInPage for now */}
        <Route component={SignInPage} /> {/* Redirect to sign-in page by default */}
      </Switch>
    );
  }

  // Show authenticated routes if user is logged in
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/grounding" component={GroundingExercise} />
      <Route path="/breathing" component={BreathingExercise} />
      <Route path="/mindfulness" component={MindfulnessExercise} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/resources" component={ResourcesPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { isListening } = useVoiceContext();
  const { user } = useUserContext();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          {/* Only show header and navigation for authenticated users */}
          {user && <Header />}
          <main className={`flex-grow ${user ? 'pb-20' : ''}`}>
            <Router />
          </main>
          {user && <Navigation />}
          {isListening && <VoiceFeedback />}
          <PrivacyConsent />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
