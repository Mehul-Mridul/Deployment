
import React from 'react';
import { allGames } from '@/data/gameData';
import GameCard from './GameCard';

const MiniGameList: React.FC = () => {
  // Group games by type
  const puzzleGames = allGames.filter(game => game.type === 'puzzle');
  const debugGames = allGames.filter(game => game.type === 'debug');
  const reviewGames = allGames.filter(game => game.type === 'review');
  const testingGames = allGames.filter(game => game.type === 'testing');
  const riskGames = allGames.filter(game => game.type === 'risk' || game.type === 'rmmm');
  const releaseGames = allGames.filter(game => game.type === 'release');

  return (
    <div className="min-h-screen bg-cyber-background p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-cyber-primary cyber-text-glow mb-8">
          MINI-GAME SELECTION
        </h1>

        {/* Puzzle Rooms */}
        <section className="mb-12">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold text-cyber-terminal-blue">PUZZLE ROOMS</h2>
            <div className="flex-1 h-px bg-cyber-border ml-4"></div>
          </div>
          <p className="text-gray-300 mb-6">
            Test your code logic skills with drag-and-drop puzzle challenges.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {puzzleGames.map(game => (
              <GameCard
                key={game.id}
                title={game.title}
                description={game.description}
                image={game.imageUrl}
                path={game.path}
                difficulty={game.difficulty}
                xpReward={game.xpReward}
              />
            ))}
          </div>
        </section>

        {/* Debugging Challenges */}
        <section className="mb-12">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold text-cyber-terminal-green">DEBUGGING CHALLENGES</h2>
            <div className="flex-1 h-px bg-cyber-border ml-4"></div>
          </div>
          <p className="text-gray-300 mb-6">
            Find and fix bugs in complex code scenarios.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {debugGames.map(game => (
              <GameCard
                key={game.id}
                title={game.title}
                description={game.description}
                image={game.imageUrl}
                path={game.path}
                difficulty={game.difficulty}
                xpReward={game.xpReward}
              />
            ))}
          </div>
        </section>

        {/* Review Matchup */}
        <section className="mb-12">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold text-cyber-terminal-purple">REVIEW MATCHUP</h2>
            <div className="flex-1 h-px bg-cyber-border ml-4"></div>
          </div>
          <p className="text-gray-300 mb-6">
            Master different code review techniques: Deskcheck, Walkthrough, and Inspection.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviewGames.map(game => (
              <GameCard
                key={game.id}
                title={game.title}
                description={game.description}
                image={game.imageUrl}
                path={game.path}
                difficulty={game.difficulty}
                xpReward={game.xpReward}
              />
            ))}
          </div>
        </section>

        {/* Testing Arena */}
        <section className="mb-12">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold text-cyber-terminal-blue">TESTING ARENA</h2>
            <div className="flex-1 h-px bg-cyber-border ml-4"></div>
          </div>
          <p className="text-gray-300 mb-6">
            Apply different testing strategies in white-box and black-box scenarios.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testingGames.map(game => (
              <GameCard
                key={game.id}
                title={game.title}
                description={game.description}
                image={game.imageUrl}
                path={game.path}
                difficulty={game.difficulty}
                xpReward={game.xpReward}
              />
            ))}
          </div>
        </section>

        {/* Risk Adventure */}
        <section className="mb-12">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold text-cyber-terminal-yellow">RISK ADVENTURE</h2>
            <div className="flex-1 h-px bg-cyber-border ml-4"></div>
          </div>
          <p className="text-gray-300 mb-6">
            Navigate through risks and create management plans to mitigate threats.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {riskGames.map(game => (
              <GameCard
                key={game.id}
                title={game.title}
                description={game.description}
                image={game.imageUrl}
                path={game.path}
                difficulty={game.difficulty}
                xpReward={game.xpReward}
              />
            ))}
          </div>
        </section>

        {/* Product Release */}
        <section className="mb-12">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold text-cyber-terminal-red">PRODUCT RELEASE</h2>
            <div className="flex-1 h-px bg-cyber-border ml-4"></div>
          </div>
          <p className="text-gray-300 mb-6">
            Simulate product releases and maintenance activities with impactful decisions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {releaseGames.map(game => (
              <GameCard
                key={game.id}
                title={game.title}
                description={game.description}
                image={game.imageUrl}
                path={game.path}
                difficulty={game.difficulty}
                xpReward={game.xpReward}
              />
            ))}
          </div>
        </section>
        
        <div className="mt-8 text-center">
          <a 
            href="/game-modes"
            className="text-cyber-terminal-blue hover:underline cyber-terminal"
          >
            {'< RETURN TO MODE SELECTION'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default MiniGameList;
