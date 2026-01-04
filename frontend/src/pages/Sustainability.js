import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import axios from 'axios';
import { Leaf, Droplet, Trees, Recycle, MapPin } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Sustainability = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get(`${API}/content/sustainability`);
      setContent(response.data);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSection = (sectionId) => {
    return content?.sections?.find(s => s.section_id === sectionId);
  };

  const principleIcons = [Leaf, Droplet, Trees, Recycle, MapPin];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const intro = getSection('intro');

  return (
    <div className="min-h-screen" data-testid="sustainability-page">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-12 overflow-hidden" data-testid="sustainability-hero">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1686632800715-b705ba1b0eb6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlY28lMjBmcmllbmRseSUyMHN1c3RhaW5hYmxlJTIwcGFja2FnaW5nJTIwYm94fGVufDB8fHx8MTc2NzQzNjgwM3ww&ixlib=rb-4.1.0&q=85"
            alt="Eco friendly packaging"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-semibold mb-6 text-primary" data-testid="sustainability-title">
              {intro?.title || 'Sustainable Himalayan Organic Farming'}
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed" data-testid="sustainability-intro">
              {intro?.content}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="py-20 px-6 lg:px-12" data-testid="principles-section">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-playfair font-semibold text-center mb-16 text-primary"
          >
            Our Sustainability Principles
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {['principle1', 'principle2', 'principle3', 'principle4', 'principle5'].map((principleId, index) => {
              const principle = getSection(principleId);
              if (!principle) return null;
              const Icon = principleIcons[index];

              return (
                <motion.div
                  key={principleId}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white border border-surface p-8 rounded-2xl hover:border-primary transition-all duration-300 hover:shadow-lg"
                  data-testid={`principle-${index + 1}`}
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-primary font-playfair" data-testid={`principle-title-${index + 1}`}>
                    {principle.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed" data-testid={`principle-content-${index + 1}`}>
                    {principle.content}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sustainability;
