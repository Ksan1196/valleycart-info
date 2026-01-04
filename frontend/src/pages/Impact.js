import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import axios from 'axios';
import { Users, GraduationCap, Handshake, Briefcase, CheckCircle2 } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Impact = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get(`${API}/content/impact`);
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

  const initiativeIcons = [GraduationCap, Handshake, Briefcase, CheckCircle2];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const intro = getSection('intro');
  const collaboration = getSection('collaboration');

  return (
    <div className="min-h-screen" data-testid="impact-page">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-12 bg-surface" data-testid="impact-hero">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-semibold mb-6 text-primary" data-testid="impact-title">
              {intro?.title || 'Women Empowerment & Rural Impact'}
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed" data-testid="impact-intro">
              {intro?.content}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Collaboration Section */}
      <section className="py-20 px-6 lg:px-12" data-testid="collaboration-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-secondary" />
              </div>
              <h2 className="text-3xl font-playfair font-semibold mb-6 text-primary" data-testid="collaboration-title">
                {collaboration?.title || 'SHG Collaboration'}
              </h2>
              <p className="text-lg text-text-secondary leading-relaxed" data-testid="collaboration-content">
                {collaboration?.content}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.pexels.com/photos/20344354/pexels-photo-20344354.jpeg"
                alt="Women farmers working"
                className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Initiatives */}
      <section className="py-20 px-6 lg:px-12 bg-surface" data-testid="initiatives-section">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-playfair font-semibold text-center mb-16 text-primary"
          >
            Our Impact Initiatives
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {['initiative1', 'initiative2', 'initiative3', 'initiative4'].map((initiativeId, index) => {
              const initiative = getSection(initiativeId);
              if (!initiative) return null;
              const Icon = initiativeIcons[index];

              return (
                <motion.div
                  key={initiativeId}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-2xl hover:shadow-lg transition-all duration-300"
                  data-testid={`initiative-${index + 1}`}
                >
                  <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-primary font-playfair" data-testid={`initiative-title-${index + 1}`}>
                    {initiative.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed" data-testid={`initiative-content-${index + 1}`}>
                    {initiative.content}
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

export default Impact;
