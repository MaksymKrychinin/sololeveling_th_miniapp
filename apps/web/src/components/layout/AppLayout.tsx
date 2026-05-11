import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/quests', icon: '⚔️', label: 'Quests' },
    { path: '/profile', icon: '👤', label: 'Profile' },
    { path: '/achievements', icon: '🏆', label: 'Achievements' },
    { path: '/leaderboard', icon: '📊', label: 'Leaderboard' },
  ];

  return (
    <div className="flex flex-col h-screen bg-dark-900">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-dark-700">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center justify-center flex-1 h-full relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary-600/10"
                    transition={{ duration: 0.2 }}
                  />
                )}
                <span className="text-2xl mb-1">{tab.icon}</span>
                <span
                  className={`text-xs ${
                    isActive ? 'text-primary-400' : 'text-gray-400'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
