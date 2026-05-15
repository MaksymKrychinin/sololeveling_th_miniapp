import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, useToast } from '@solo-leveling/ui';
import { useUserStore } from '@/store/userStore';
import { motion } from 'framer-motion';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useUserStore();
  const { addToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      addToast({
        message: 'Please enter username and password',
        type: 'warning',
      });
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/v1/auth/dev-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Login failed');
      }

      // Store token and user data
      setToken(data.data.token);
      setUser(data.data.user);

      addToast({
        message: 'Login successful! Welcome, Hunter!',
        type: 'success',
      });

      navigate('/');
    } catch (error: any) {
      addToast({
        message: error.message || 'Login failed',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950" />

      {/* Animated Glow Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-600 rounded-full blur-[120px]"
      />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Logo Section */}
          <div className="text-center mb-10">
            {/* Sword Icon SVG */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                type: "spring",
                stiffness: 200
              }}
              className="mb-6 flex justify-center"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(139, 92, 246, 0.5)',
                      '0 0 40px rgba(139, 92, 246, 0.8)',
                      '0 0 20px rgba(139, 92, 246, 0.5)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="rounded-full p-6 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 backdrop-blur-sm border border-purple-500/30"
                >
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-purple-400"
                  >
                    <path
                      d="M32 4L36 12L32 20L28 12L32 4Z"
                      fill="currentColor"
                      className="opacity-80"
                    />
                    <rect
                      x="30"
                      y="16"
                      width="4"
                      height="40"
                      fill="url(#swordGradient)"
                    />
                    <path
                      d="M26 54H38V58H26V54Z"
                      fill="currentColor"
                    />
                    <path
                      d="M24 58H40V60H24V58Z"
                      fill="currentColor"
                      className="opacity-80"
                    />
                    <defs>
                      <linearGradient id="swordGradient" x1="32" y1="16" x2="32" y2="56" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#8B5CF6"/>
                        <stop offset="1" stopColor="#06B6D4"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h1 className="text-6xl font-bold mb-3 font-display">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-cyan-400 drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                  Solo Leveling
                </span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-slate-400 text-lg font-medium tracking-wide"
              >
                🗡️ Rise from E-Rank to Shadow Monarch ⚔️
              </motion.p>
            </motion.div>
          </div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card variant="glow" padding="lg" className="backdrop-blur-xl bg-slate-900/90 border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20">
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Header */}
                <div className="text-center border-b border-slate-700/50 pb-4">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 mb-3">
                    <span className="text-yellow-400 text-sm font-semibold">⚠️ DEV MODE</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Hunter Login
                  </h2>
                  <p className="text-sm text-slate-400">
                    Enter the system to begin your journey
                  </p>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="group">
                    <Input
                      label="Hunter Username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your hunter name"
                      disabled={isLoading}
                      autoFocus
                      className="transition-all duration-200"
                    />
                  </div>

                  <div className="group">
                    <Input
                      label="Access Code"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your access code"
                      disabled={isLoading}
                      className="transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    isLoading={isLoading}
                    className="h-14 text-lg font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-200"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Awakening...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        ⚡ Awaken as a Hunter
                      </span>
                    )}
                  </Button>
                </motion.div>

                {/* Test Credentials Box */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-5 border border-slate-700/50 backdrop-blur-sm"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />
                  <div className="relative">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-lg">🔐</span>
                      <p className="text-sm font-bold text-purple-300 uppercase tracking-wide">
                        Test Accounts
                      </p>
                    </div>
                    <div className="space-y-2 font-mono text-xs">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:border-purple-500/30 transition-colors">
                        <span className="text-slate-300">👤 dev</span>
                        <span className="text-slate-500">/</span>
                        <span className="text-slate-400">dev123</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:border-purple-500/30 transition-colors">
                        <span className="text-slate-300">⚔️ hunter</span>
                        <span className="text-slate-500">/</span>
                        <span className="text-slate-400">hunter123</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:border-purple-500/30 transition-colors">
                        <span className="text-slate-300">🧪 test</span>
                        <span className="text-slate-500">/</span>
                        <span className="text-slate-400">test123</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </form>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-8"
          >
            <div className="inline-flex items-center space-x-2 text-sm text-slate-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Development environment only</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
