import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GameModeSelector from "@/components/game/GameModeSelector";
import CampaignMode from "@/components/game/CampaignMode";
import BossBattleMode from "@/components/game/BossBattleMode";
import MiniGameList from "@/components/game/MiniGameList";
import ProfilePage from "@/components/game/ProfilePage";
import Leaderboard from "@/components/game/Leaderboard";
import CodeStandardsGame from "./pages/games/CodeStandardsGame";
import RiskAdventureGame from "./pages/games/RiskAdventureGame";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/game-modes" element={<GameModeSelector />} />
          <Route path="/campaign" element={<CampaignMode />} />
          <Route path="/boss-battle" element={<BossBattleMode />} />
          <Route path="/mini-games" element={<MiniGameList />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          
          {/* Game-specific routes */}
          <Route path="/game/coding-standards" element={<CodeStandardsGame />} />
          <Route path="/game/risk-adventure" element={<RiskAdventureGame />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
