import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6" data-testid="admin-login-page">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-10 rounded-2xl shadow-lg max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">V</span>
          </div>
          <h1 className="text-3xl font-playfair font-semibold text-primary mb-2" data-testid="admin-login-title">
            Admin Login
          </h1>
          <p className="text-text-secondary">Valleycart Organics CMS</p>
        </div>

        <form onSubmit={handleSubmit} data-testid="admin-login-form" className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-text-primary">
              Email
            </label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="admin-email-input"
              placeholder="admin@valleycart.com"
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2 text-text-primary">
              Password
            </label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="admin-password-input"
              placeholder="••••••••"
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white py-6 rounded-full font-medium transition-all duration-300"
            data-testid="admin-login-button"
          >
            {loading ? 'Logging in...' : (
              <span className="flex items-center justify-center space-x-2">
                <span>Login</span>
                <LogIn className="w-5 h-5" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-text-muted">
          <p>Default credentials: admin@valleycart.com / admin123</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
