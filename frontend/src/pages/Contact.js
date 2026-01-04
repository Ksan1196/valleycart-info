import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import axios from 'axios';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(`${API}/contact`, formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Failed to submit form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen" data-testid="contact-page">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-12 bg-surface" data-testid="contact-hero">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-semibold mb-6 text-primary" data-testid="contact-title">
              Contact Valleycart Organics
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed">
              For partnerships, sourcing, research collaboration, or business inquiries, get in touch with us.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 lg:px-12" data-testid="contact-form-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-playfair font-semibold mb-8 text-primary">Get In Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4" data-testid="contact-email-info">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <a href="mailto:work.manishkunwar@gmail.com" className="text-text-secondary hover:text-primary transition-colors">
                      work.manishkunwar@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4" data-testid="contact-phone-info">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Phone</h3>
                    <a href="tel:+918077494941" className="text-text-secondary hover:text-primary transition-colors">
                      +91-8077494941
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <img
                  src="https://images.pexels.com/photos/6827592/pexels-photo-6827592.jpeg"
                  alt="Medicinal mushrooms"
                  className="w-full h-64 object-cover rounded-2xl shadow-lg"
                />
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-surface">
                <h2 className="text-2xl font-playfair font-semibold mb-6 text-primary">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} data-testid="contact-form" className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-text-primary">
                      Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      data-testid="contact-name-input"
                      className="w-full"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-text-primary">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      data-testid="contact-email-input"
                      className="w-full"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2 text-text-primary">
                      Phone
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      data-testid="contact-phone-input"
                      className="w-full"
                      placeholder="+91-XXXXXXXXXX"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2 text-text-primary">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      data-testid="contact-message-input"
                      className="w-full"
                      placeholder="Your message..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary hover:bg-primary-dark text-white py-6 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    data-testid="contact-submit-button"
                  >
                    {submitting ? 'Sending...' : (
                      <span className="flex items-center justify-center space-x-2">
                        <span>Send Message</span>
                        <Send className="w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
