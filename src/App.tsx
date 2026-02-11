import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CursorGlow from "./components/CursorGlow";
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LoadingScreen />
      <CursorGlow />
      <Navbar />
      <Index />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
