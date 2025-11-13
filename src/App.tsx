import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Quiz from "./pages/Quiz";
import TicTacToe from "./pages/TicTacToe";
import Memory from "./pages/Memory";
import Trivia from "./pages/Trivia";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/quiz/:type" element={<Quiz />} />
          <Route path="/tictactoe" element={<TicTacToe />} />
          <Route path="/memory" element={<Memory />} />
          <Route path="/trivia" element={<Trivia />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
