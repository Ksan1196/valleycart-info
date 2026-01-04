import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import axios from 'axios';
import { Microscope, Beaker, TrendingUp, FileText, Users2 } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Research = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get(`${API}/content/research`);
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

  const focusIcons = [Microscope, Beaker, TrendingUp, FileText, Users2];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const intro = getSection('intro');

  return (
    <div className="min-h-screen" data-testid="research-page">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-12 overflow-hidden" data-testid="research-hero">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.pexels.com/photos/8514588/pexels-photo-8514588.jpeg"
            alt="Research lab"
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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-semibold mb-6 text-primary" data-testid="research-title">
              {intro?.title || 'Research & Innovation'}
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed" data-testid="research-intro">
              {intro?.content}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Research Focus Areas */}
      <section className="py-20 px-6 lg:px-12 bg-surface" data-testid="research-focus-section">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-playfair font-semibold text-center mb-16 text-primary"
          >
            Our Research Focus
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {['focus1', 'focus2', 'focus3', 'focus4', 'focus5'].map((focusId, index) => {
              const focus = getSection(focusId);
              if (!focus) return null;
              const Icon = focusIcons[index];

              return (
                <motion.div
                  key={focusId}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-2xl hover:shadow-lg transition-all duration-300"
                  data-testid={`research-focus-${index + 1}`}
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-primary font-playfair" data-testid={`focus-title-${index + 1}`}>
                    {focus.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed" data-testid={`focus-content-${index + 1}`}>
                    {focus.content}
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

export default Research;
