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
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import VoiceFeedback from "@/components/VoiceFeedback";
import PrivacyConsent from "@/components/PrivacyConsent";
import { useVoiceContext } from "@/contexts/VoiceContext";

function Router() {
  const [location] = useLocation();

  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/grounding" component={GroundingExercise} />
      <Route path="/breathing" component={BreathingExercise} />
      <Route path="/mindfulness" component={MindfulnessExercise} />
      <Route path="/resources" component={ResourcesPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { isListening } = useVoiceContext();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow pb-20">
            <Router />
          </main>
          <Navigation />
          {isListening && <VoiceFeedback />}
          <PrivacyConsent />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
