import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import axios from 'axios';
import { Target, Eye } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const About = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get(`${API}/content/about`);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const intro = getSection('intro');
  const story = getSection('story');
  const mission = getSection('mission');
  const vision = getSection('vision');

  return (
    <div className="min-h-screen" data-testid="about-page">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-12 bg-surface" data-testid="about-hero">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-semibold mb-6 text-primary" data-testid="about-title">
              {intro?.title || 'About Valleycart Organics'}
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed" data-testid="about-intro">
              {intro?.content}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6 lg:px-12" data-testid="story-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.pexels.com/photos/20344354/pexels-photo-20344354.jpeg"
                alt="Women farmers"
                className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-playfair font-semibold mb-6 text-primary" data-testid="story-title">
                {story?.title || 'Our Story'}
              </h2>
              <p className="text-lg text-text-secondary leading-relaxed" data-testid="story-content">
                {story?.content}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-6 lg:px-12 bg-surface" data-testid="mission-vision-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-2xl shadow-sm"
              data-testid="mission-card"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-playfair font-semibold mb-4 text-primary" data-testid="mission-title">
                {mission?.title || 'Mission'}
              </h3>
              <p className="text-text-secondary leading-relaxed" data-testid="mission-content">
                {mission?.content}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-2xl shadow-sm"
              data-testid="vision-card"
            >
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-playfair font-semibold mb-4 text-primary" data-testid="vision-title">
                {vision?.title || 'Vision'}
              </h3>
              <p className="text-text-secondary leading-relaxed" data-testid="vision-content">
                {vision?.content}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
