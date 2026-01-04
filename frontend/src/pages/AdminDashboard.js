import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { LogOut, Save, Edit, Mail, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminDashboard = () => {
  const { user, token, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [pages, setPages] = useState({});
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPage, setEditingPage] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
    } else if (user) {
      fetchData();
    }
  }, [user, authLoading, navigate]);

  const fetchData = async () => {
    try {
      const [contentRes, contactsRes] = await Promise.all([
        axios.get(`${API}/content`),
        axios.get(`${API}/contact`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const pagesObj = {};
      contentRes.data.forEach(page => {
        pagesObj[page.page_name] = page;
      });
      setPages(pagesObj);
      setContacts(contactsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePage = async (pageName) => {
    setSaving(true);
    try {
      await axios.put(
        `${API}/content/${pageName}`,
        { sections: pages[pageName].sections },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`${pageName} page updated successfully!`);
      setEditingPage(null);
    } catch (error) {
      console.error('Failed to save page:', error);
      toast.error('Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  const handleSectionChange = (pageName, sectionId, field, value) => {
    setPages(prev => ({
      ...prev,
      [pageName]: {
        ...prev[pageName],
        sections: prev[pageName].sections.map(section =>
          section.section_id === sectionId
            ? { ...section, [field]: value }
            : section
        )
      }
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface" data-testid="admin-dashboard">
      {/* Header */}
      <header className="bg-white border-b border-surface sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <div>
                <h1 className="text-xl font-playfair font-semibold text-primary" data-testid="dashboard-title">
                  Valleycart Organics CMS
                </h1>
                <p className="text-sm text-text-muted">Welcome, {user?.name}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center space-x-2"
              data-testid="logout-button"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger value="home" data-testid="tab-home">Home</TabsTrigger>
            <TabsTrigger value="about" data-testid="tab-about">About</TabsTrigger>
            <TabsTrigger value="research" data-testid="tab-research">Research</TabsTrigger>
            <TabsTrigger value="impact" data-testid="tab-impact">Impact</TabsTrigger>
            <TabsTrigger value="sustainability" data-testid="tab-sustainability">Sustainability</TabsTrigger>
            <TabsTrigger value="brands" data-testid="tab-brands">Brands</TabsTrigger>
            <TabsTrigger value="contacts" data-testid="tab-contacts">Contacts</TabsTrigger>
          </TabsList>

          {/* Page Content Editors */}
          {Object.keys(pages).map(pageName => (
            <TabsContent key={pageName} value={pageName} data-testid={`tab-content-${pageName}`}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-playfair capitalize">{pageName} Page</CardTitle>
                      <CardDescription>Edit content for the {pageName} page</CardDescription>
                    </div>
                    <Button
                      onClick={() => handleSavePage(pageName)}
                      disabled={saving}
                      className="bg-primary hover:bg-primary-dark"
                      data-testid={`save-${pageName}-button`}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {pages[pageName]?.sections.map((section, index) => (
                      <div key={section.section_id} className="border border-surface p-6 rounded-lg bg-white" data-testid={`section-${section.section_id}`}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-lg text-primary">
                            Section: {section.section_id}
                          </h3>
                          <Edit className="w-5 h-5 text-text-muted" />
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Title</label>
                            <Input
                              value={section.title}
                              onChange={(e) => handleSectionChange(pageName, section.section_id, 'title', e.target.value)}
                              data-testid={`${section.section_id}-title-input`}
                              className="w-full"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">Content</label>
                            <Textarea
                              value={section.content}
                              onChange={(e) => handleSectionChange(pageName, section.section_id, 'content', e.target.value)}
                              data-testid={`${section.section_id}-content-input`}
                              rows={4}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}

          {/* Contacts Tab */}
          <TabsContent value="contacts" data-testid="tab-content-contacts">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-playfair">Contact Submissions</CardTitle>
                <CardDescription>View all contact form submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {contacts.length === 0 ? (
                  <div className="text-center py-12 text-text-muted">
                    <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No contact submissions yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contacts.map((contact) => (
                      <div key={contact.id} className="border border-surface p-6 rounded-lg bg-white" data-testid={`contact-${contact.id}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg text-primary">{contact.name}</h3>
                            <p className="text-sm text-text-muted">
                              {new Date(contact.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Email:</span> {contact.email}</p>
                          {contact.phone && <p><span className="font-medium">Phone:</span> {contact.phone}</p>}
                          <p className="pt-2"><span className="font-medium">Message:</span></p>
                          <p className="text-text-secondary">{contact.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
