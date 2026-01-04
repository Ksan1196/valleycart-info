import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import axios from 'axios';
import { CheckCircle2, Sprout, Users, Award, Leaf, TrendingUp } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Home = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get(`${API}/content/home`);
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

  const featureIcons = {
    feature1: <Leaf className="w-8 h-8" />,
    feature2: <Sprout className="w-8 h-8" />,
    feature3: <Users className="w-8 h-8" />,
    feature4: <CheckCircle2 className="w-8 h-8" />,
    feature5: <TrendingUp className="w-8 h-8" />,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  const hero = getSection('hero');
  const intro = getSection('intro');

  return (
    <div className="min-h-screen" data-testid="home-page">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1625826712082-da15ddbde286?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfHxoaW1hbGF5YW4lMjBtb3VudGFpbnMlMjBsYW5kc2NhcGV8ZW58MHx8fHwxNzY3NDM2NzgzfDA&ixlib=rb-4.1.0&q=85"
            alt="Himalayan Mountains"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay"></div>
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-semibold mb-6 leading-tight"
            data-testid="hero-title"
          >
            {hero?.title || 'Valleycart Organics Private Limited'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl mb-8 text-white/90"
            data-testid="hero-subtitle"
          >
            {hero?.content || 'Organic Medicinal Mushrooms & Himalayan Natural Products'}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a
              href="#why-valleycart"
              className="inline-block bg-white text-primary px-8 py-4 rounded-full font-medium hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              data-testid="hero-cta-button"
            >
              Learn More
            </a>
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto" data-testid="intro-section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl font-playfair font-semibold mb-6 text-primary" data-testid="intro-title">
            {intro?.title || 'About Our Company'}
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed" data-testid="intro-content">
            {intro?.content || 'Valleycart Organics Private Limited is an Indian organic agribusiness company specializing in medicinal mushroom cultivation, Himalayan organic produce, and sustainable farming solutions.'}
          </p>
        </motion.div>
      </section>

      {/* Why Valleycart Section */}
      <section id="why-valleycart" className="py-20 px-6 lg:px-12 bg-surface" data-testid="why-valleycart-section">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-playfair font-semibold text-center mb-16 text-primary"
            data-testid="why-valleycart-title"
          >
            Why Valleycart Organics?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {['feature1', 'feature2', 'feature3', 'feature4', 'feature5'].map((featureId, index) => {
              const feature = getSection(featureId);
              if (!feature) return null;

              return (
                <motion.div
                  key={featureId}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white border border-surface p-8 rounded-2xl hover:border-secondary transition-all duration-300 hover:shadow-lg"
                  data-testid={`feature-card-${index + 1}`}
                >
                  <div className="text-primary mb-4">{featureIcons[featureId]}</div>
                  <h3 className="text-xl font-semibold mb-3 text-primary font-playfair" data-testid={`feature-title-${index + 1}`}>
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed" data-testid={`feature-content-${index + 1}`}>
                    {feature.content}
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

export default Home;
