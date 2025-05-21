import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { UserProvider } from "@/contexts/UserContext";
import { VoiceProvider } from "@/contexts/VoiceContext";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <UserProvider>
      <VoiceProvider>
        <App />
      </VoiceProvider>
    </UserProvider>
  </ThemeProvider>
);
