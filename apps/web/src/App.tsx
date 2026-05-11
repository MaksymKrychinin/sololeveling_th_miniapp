import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TelegramProvider } from '@solo-leveling/telegram-sdk';
import { ToastProvider } from '@solo-leveling/ui';

// Pages
import Home from './pages/Home';
import Profile from './pages/Profile';
import Quests from './pages/Quests';
import Achievements from './pages/Achievements';
import Leaderboard from './pages/Leaderboard';

// Layout
import AppLayout from './components/layout/AppLayout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <TelegramProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <Router>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/quests" element={<Quests />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
              </Routes>
            </AppLayout>
          </Router>
        </ToastProvider>
      </QueryClientProvider>
    </TelegramProvider>
  );
}

export default App;
