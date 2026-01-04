import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Research from '@/pages/Research';
import Impact from '@/pages/Impact';
import Sustainability from '@/pages/Sustainability';
import Brands from '@/pages/Brands';
import Contact from '@/pages/Contact';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import { AuthProvider } from '@/contexts/AuthContext';
import '@/App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/research" element={<Research />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
