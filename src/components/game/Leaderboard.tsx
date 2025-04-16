
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePlayer } from '@/context/PlayerContext';
import { Trophy, Medal, Award, Star, Shield, User } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  level: number;
  score: number;
  completedGames: number;
  badges: number;
  isCurrentUser?: boolean;
}

const Leaderboard: React.FC = () => {
  const { player } = usePlayer();
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  
  // Generate leaderboard data when component mounts
  useEffect(() => {
    // Mock leaderboard data with some fixed entries
    const mockEntries: LeaderboardEntry[] = [
      { rank: 1, name: "CyberNinja", level: 8, score: 4250, completedGames: 7, badges: 5 },
      { rank: 2, name: "CodeMaster", level: 7, score: 3800, completedGames: 6, badges: 4 },
      { rank: 3, name: "RiskHunter", level: 6, score: 3450, completedGames: 5, badges: 4 },
      { rank: 4, name: "DebugWhiz", level: 5, score: 3100, completedGames: 6, badges: 3 },
      { rank: 5, name: "TestGuru", level: 5, score: 2950, completedGames: 5, badges: 3 },
      { rank: 6, name: "ReviewPro", level: 4, score: 2700, completedGames: 4, badges: 2 },
      { rank: 7, name: "BugCrusher", level: 4, score: 2500, completedGames: 4, badges: 2 },
    ];
    
    // Add the current player
    const currentPlayer: LeaderboardEntry = {
      rank: 0, // Will be adjusted below
      name: player.name,
      level: player.level,
      score: player.xp * 10, // Convert XP to score for display
      completedGames: player.completedGames.length,
      badges: player.badges.filter(b => b.unlocked).length,
      isCurrentUser: true
    };
    
    // Insert player into leaderboard based on score
    let inserted = false;
    for (let i = 0; i < mockEntries.length; i++) {
      if (currentPlayer.score > mockEntries[i].score) {
        mockEntries.splice(i, 0, currentPlayer);
        inserted = true;
        break;
      }
    }
    
    // If player score is lower than all entries, add at the end
    if (!inserted) {
      mockEntries.push(currentPlayer);
    }
    
    // Rerank the leaderboard
    const rankedEntries = mockEntries.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
    
    setLeaderboardEntries(rankedEntries);
  }, [player]);

  return (
    <div className="min-h-screen bg-cyber-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-cyber-primary cyber-text-glow">
            GLOBAL LEADERBOARD
          </h1>
          
          <Link to="/" className="cyber-button text-sm py-2">
            RETURN TO MAIN
          </Link>
        </div>
        
        <div className="cyber-container p-6">
          <div className="cyber-terminal text-cyber-terminal-green text-sm mb-6">
            {'> DISPLAYING TOP AGENTS BY PERFORMANCE'}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyber-border">
                  <th className="py-3 px-4 text-left text-cyber-terminal-blue">RANK</th>
                  <th className="py-3 px-4 text-left text-cyber-terminal-blue">AGENT</th>
                  <th className="py-3 px-4 text-center text-cyber-terminal-blue">LEVEL</th>
                  <th className="py-3 px-4 text-center text-cyber-terminal-blue">SCORE</th>
                  <th className="py-3 px-4 text-center text-cyber-terminal-blue">COMPLETED</th>
                  <th className="py-3 px-4 text-center text-cyber-terminal-blue">BADGES</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardEntries.map((entry) => (
                  <tr 
                    key={entry.rank}
                    className={`border-b border-cyber-border ${
                      entry.isCurrentUser ? 'bg-cyber-primary bg-opacity-10' : ''
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center
                        ${entry.rank <= 3 
                          ? 'bg-cyber-secondary bg-opacity-20 text-cyber-secondary' 
                          : 'bg-cyber-muted text-gray-400'
                        }
                      `}>
                        {entry.rank}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold">
                      {entry.name}
                      {entry.isCurrentUser && 
                        <span className="ml-2 text-xs text-cyber-primary">(You)</span>
                      }
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="cyber-badge bg-cyber-muted text-cyan-400">
                        {entry.level}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-mono font-bold">
                      {entry.score}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {entry.completedGames}/8
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center items-center space-x-1">
                        {Array(Math.min(entry.badges, 3)).fill(0).map((_, i) => (
                          <div key={i} className="text-cyber-primary">★</div>
                        ))}
                        {entry.badges > 3 && (
                          <span className="text-xs text-gray-400">+{entry.badges - 3}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm mb-4">
              Complete missions, earn badges, and increase your score to climb the ranks!
            </p>
            <div className="cyber-badge bg-cyber-muted text-cyber-terminal-green inline-block">
              Leaderboard updates daily
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Link 
            to="/profile"
            className="cyber-button text-cyber-terminal-blue"
          >
            VIEW YOUR PROFILE
          </Link>
          <Link 
            to="/game-modes"
            className="cyber-button-primary"
          >
            BEGIN MISSIONS
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
