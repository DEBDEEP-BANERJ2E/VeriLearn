import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, PenTool as Tool, MessageCircle, Award, BookOpen, Layout, Search, Filter, Briefcase, GraduationCap, FolderGit2, ChevronDown, ListChecks } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { CreateModal } from '../components/Dashboard/CreateModal';
import { usePosts, Post } from '../hooks/usePosts';

const tabs = [
  { id: 'jobs', name: 'Job Matching', icon: Briefcase },
  { id: 'internships', name: 'Internships', icon: Layout },
  { id: 'courses', name: 'Courses', icon: BookOpen },
  { id: 'scholarships', name: 'Scholarships', icon: Award },
  { id: 'projects', name: 'Projects', icon: FolderGit2 },
] as const;

export function Dashboard() {
  const navigate = useNavigate();
  const [showChatbot, setShowChatbot] = useState(false);
  const [activeTab, setActiveTab] = useState<Post['type']>('jobs');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCreateType, setSelectedCreateType] = useState<Post['type']>('jobs');
  const [searchQuery, setSearchQuery] = useState('');

  const { 
    posts, 
    loading, 
    error, 
    createPost 
  } = usePosts(activeTab);

  const handleCreateItem = async (formData: any) => {
    const skills = formData.skills.split(',').map((skill: string) => skill.trim());
    
    const newPost = {
      title: formData.title,
      organization: formData.organization,
      description: formData.description,
      requirements: formData.requirements,
      location: formData.location,
      type: selectedCreateType,
      work_type: formData.type,
      duration: formData.duration,
      compensation: formData.compensation,
      skills,
      status: 'active' as const
    };

    const created = await createPost(newPost);
    if (created) {
      setShowCreateModal(false);
    }
  };

  const handleCreateClick = (type: Post['type']) => {
    setSelectedCreateType(type);
    setShowCreateModal(true);
    setShowCreateDropdown(false);
  };

  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(searchLower) ||
      post.organization.toLowerCase().includes(searchLower) ||
      post.description.toLowerCase().includes(searchLower) ||
      post.skills.some(skill => skill.toLowerCase().includes(searchLower))
    );
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'jobs': return Briefcase;
      case 'internships': return Layout;
      case 'courses': return BookOpen;
      case 'scholarships': return Award;
      case 'projects': return FolderGit2;
      default: return Briefcase;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/your-postings')}
                className="flex items-center px-4 py-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ListChecks className="h-5 w-5 mr-2" />
                Your Postings
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowCreateDropdown(!showCreateDropdown)}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
                {showCreateDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                    <div className="py-2">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => handleCreateClick(tab.id)}
                          className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        >
                          <tab.icon className="h-5 w-5 mr-3" />
                          Create {tab.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button className="flex items-center px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors">
                <Tool className="h-5 w-5 mr-2" />
                Tools
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-8 border-b border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-500'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </header>

        <main className="py-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="relative ml-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 hover:bg-gray-700 transition-colors"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              {showFilters && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
                  <div className="p-4">
                    <h3 className="text-gray-200 font-medium mb-3">Filter By</h3>
                    <div className="space-y-3">
                      <label className="flex items-center text-gray-300">
                        <input type="checkbox" className="form-checkbox text-indigo-500 rounded bg-gray-700 border-gray-600" />
                        <span className="ml-2">Remote Only</span>
                      </label>
                      <label className="flex items-center text-gray-300">
                        <input type="checkbox" className="form-checkbox text-indigo-500 rounded bg-gray-700 border-gray-600" />
                        <span className="ml-2">Full Time</span>
                      </label>
                      <label className="flex items-center text-gray-300">
                        <input type="checkbox" className="form-checkbox text-indigo-500 rounded bg-gray-700 border-gray-600" />
                        <span className="ml-2">Entry Level</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading posts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <div key={post.id} className="bg-gray-800 border border-gray-700 p-6 rounded-lg hover:border-indigo-500 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {post.title}
                        </h3>
                        <p className="text-gray-400">
                          {post.organization}
                          {post.work_type && ` • ${post.work_type}`}
                          {post.duration && ` • ${post.duration}`}
                        </p>
                      </div>
                      <div className="bg-gray-700 p-2 rounded-lg">
                        {(() => {
                          const Icon = getIcon(post.type);
                          return <Icon className="h-5 w-5 text-indigo-400" />;
                        })()}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {post.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-sm rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {post.description}
                      </p>
                      <button
                        onClick={() => {/* Handle application */}}
                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-400">No posts found. Click the Create button to add a new {activeTab.slice(0, -1)}.</p>
                </div>
              )}
            </div>
          )}
        </main>

        <CreateModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          type={selectedCreateType}
          onSubmit={handleCreateItem}
        />

        <button
          onClick={() => setShowChatbot(!showChatbot)}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
        >
          <MessageCircle className="h-6 w-6" />
        </button>

        {showChatbot && (
          <div className="fixed bottom-24 right-6 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">VeriLearn Assistant</h3>
            </div>
            <div className="h-96 p-4 overflow-y-auto">
              <div className="bg-gray-700 p-3 rounded-lg mb-3">
                <p className="text-sm text-gray-200">Hello! How can I help you today?</p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}