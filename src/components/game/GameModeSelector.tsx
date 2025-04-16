
import React from 'react';
import { Link } from 'react-router-dom';
import { constructionGames, managementGames } from '@/data/gameData';

const GameModeSelector: React.FC = () => {
  return (
    <div className="min-h-screen bg-cyber-background cyber-grid p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-cyber-primary cyber-text-glow mb-8">
          SELECT MISSION TYPE
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Software Construction Mode */}
          <div className="cyber-container p-6 border-cyber-primary h-full flex flex-col">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-cyber-terminal-blue cyber-text-glow mb-2">
                CAMPAIGN MODE
              </h2>
              <div className="border-b-2 border-cyber-border mb-4"></div>
              <div className="cyber-terminal text-cyber-terminal-green text-sm mb-4">
                {'> UNIT-4: SOFTWARE CONSTRUCTION'}
              </div>
              <p className="text-gray-300 mb-6">
                Master the foundations of software engineering through a series of missions covering coding standards, 
                code reviews, testing strategies, and debugging techniques.
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 rounded-full bg-cyber-terminal-green mr-2"></div>
                  <span className="text-gray-200">Coding Standards</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 rounded-full bg-cyber-terminal-green mr-2"></div>
                  <span className="text-gray-200">Code Reviews</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 rounded-full bg-cyber-terminal-green mr-2"></div>
                  <span className="text-gray-200">Testing Strategies</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 rounded-full bg-cyber-terminal-green mr-2"></div>
                  <span className="text-gray-200">Debugging</span>
                </div>
              </div>
            </div>
            
            <div className="mt-auto flex flex-col space-y-4">
              <div className="cyber-badge bg-cyber-muted self-start">
                <span className="text-cyber-terminal-purple">{constructionGames.length} Missions</span>
              </div>
              
              <Link 
                to="/campaign"
                className="cyber-button-primary text-center py-3"
              >
                START CAMPAIGN
              </Link>
            </div>
          </div>
          
          {/* Product Management Mode */}
          <div className="cyber-container p-6 border-cyber-secondary h-full flex flex-col">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-cyber-terminal-blue cyber-text-glow mb-2">
                BOSS BATTLE MODE
              </h2>
              <div className="border-b-2 border-cyber-border mb-4"></div>
              <div className="cyber-terminal text-cyber-terminal-yellow text-sm mb-4">
                {'> UNIT-5: PRODUCT MANAGEMENT'}
              </div>
              <p className="text-gray-300 mb-6">
                Face advanced challenges in product management, tackling risk scenarios, creating management plans, 
                and simulating product releases in high-pressure environments.
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 rounded-full bg-cyber-terminal-yellow mr-2"></div>
                  <span className="text-gray-200">Risk Management</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 rounded-full bg-cyber-terminal-yellow mr-2"></div>
                  <span className="text-gray-200">Risk Projection & Refinement</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 rounded-full bg-cyber-terminal-yellow mr-2"></div>
                  <span className="text-gray-200">RMMM Plan</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 rounded-full bg-cyber-terminal-yellow mr-2"></div>
                  <span className="text-gray-200">Product Release & Maintenance</span>
                </div>
              </div>
            </div>
            
            <div className="mt-auto flex flex-col space-y-4">
              <div className="cyber-badge bg-cyber-muted self-start">
                <span className="text-cyber-terminal-yellow">{managementGames.length} Boss Battles</span>
              </div>
              
              <Link 
                to="/boss-battle"
                className="cyber-button-secondary text-center py-3"
              >
                ENGAGE BOSS BATTLES
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center">
          <Link 
            to="/mini-games"
            className="cyber-button-accent py-3 px-8"
          >
            ACCESS MINI-GAMES
          </Link>
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            to="/"
            className="text-cyber-terminal-blue hover:underline cyber-terminal"
          >
            {'< RETURN TO MAIN SCREEN'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameModeSelector;
