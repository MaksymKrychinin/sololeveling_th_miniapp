import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, useToast } from '@solo-leveling/ui';
import { useUserStore } from '../store/userStore';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400 mb-2"
          >
            Solo Leveling
          </motion.h1>
          <p className="text-gray-400">Rise from E-Rank to Shadow Monarch</p>
        </div>

        {/* Login Card */}
        <Card variant="glow" padding="lg">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Dev Login</h2>
              <p className="text-sm text-gray-400 mb-4">
                For local testing only
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                disabled={isLoading}
                autoFocus
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              className="h-12 text-lg"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="mt-6 p-4 bg-dark-700/50 rounded-lg border border-dark-600">
              <p className="text-xs font-semibold text-primary-400 mb-2">Test Credentials:</p>
              <div className="text-xs text-gray-400 space-y-1 font-mono">
                <p>• dev / dev123</p>
                <p>• hunter / hunter123</p>
                <p>• test / test123</p>
              </div>
            </div>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>⚠️ Development mode only</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
