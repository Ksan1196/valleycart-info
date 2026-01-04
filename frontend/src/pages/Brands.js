import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import axios from 'axios';
import { Award, Heart, Shield } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Brands = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get(`${API}/content/brands`);
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

  const valueIcons = [Heart, Award, Shield];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const intro = getSection('intro');

  return (
    <div className="min-h-screen" data-testid="brands-page">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-12 bg-surface" data-testid="brands-hero">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-semibold mb-6 text-primary" data-testid="brands-title">
              {intro?.title || 'Our Brand – The Pahadi Bro'}
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed" data-testid="brands-intro">
              {intro?.content}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Brand Identity */}
      <section className="py-20 px-6 lg:px-12" data-testid="brand-identity-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-primary to-primary-dark p-16 rounded-2xl shadow-xl text-center">
                <h2 className="text-5xl font-playfair font-bold text-white mb-4">The Pahadi Bro</h2>
                <p className="text-white/90 text-lg">Authentic Himalayan Products</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.pexels.com/photos/29215990/pexels-photo-29215990.jpeg"
                alt="Medicinal Mushrooms"
                className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
              />
            </motion.div>
          </div>

          {/* Brand Values */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-playfair font-semibold text-center mb-16 text-primary"
          >
            What We Stand For
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {['value1', 'value2', 'value3'].map((valueId, index) => {
              const value = getSection(valueId);
              if (!value) return null;
              const Icon = valueIcons[index];

              return (
                <motion.div
                  key={valueId}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white border border-surface p-8 rounded-2xl hover:border-secondary transition-all duration-300 hover:shadow-lg text-center"
                  data-testid={`brand-value-${index + 1}`}
                >
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-primary font-playfair" data-testid={`value-title-${index + 1}`}>
                    {value.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed" data-testid={`value-content-${index + 1}`}>
                    {value.content}
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

export default Brands;
