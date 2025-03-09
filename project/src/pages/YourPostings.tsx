import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Briefcase, Layout, BookOpen, Award, FolderGit2, Clock, CheckCircle, XCircle, User, ChevronDown, Trash } from 'lucide-react';
import { useCompletePosting } from '../components/BlockchainPosting';

interface Request {
  id: string;
  userId: string;
  userName: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message: string;
  createdAt: Date;
}

interface Posting {
  id: string;
  type: 'jobs' | 'internships' | 'courses' | 'scholarships' | 'projects';
  title: string;
  organization: string;
  status: 'active' | 'closed' | 'draft' | 'completed';
  requests: Request[];
  createdAt: Date;
}

export function YourPostings() {
  const [activeTab, setActiveTab] = useState<'all' | 'jobs' | 'internships' | 'courses' | 'scholarships' | 'projects'>('all');
  const [selectedPosting, setSelectedPosting] = useState<string | null>(null);
  const { completePosting, isLoading, error } = useCompletePosting();
  const [completingPosting, setCompletingPosting] = useState<string | null>(null);
  const [postings, setPostings] = useState<Posting[]>([
    {
      id: '1',
      type: 'jobs',
      title: 'Senior Blockchain Developer',
      organization: 'VeriLearn',
      status: 'active',
      createdAt: new Date(),
      requests: [
        {
          id: '1',
          userId: 'user1',
          userName: 'John Doe',
          status: 'pending',
          message: 'I am interested in this position and have 5 years of experience in blockchain development.',
          createdAt: new Date(),
        },
      ],
    },
  ]);

  const handleAcceptRequest = (postingId: string, requestId: string) => {
    setPostings(prevPostings => 
      prevPostings.map(posting => {
        if (posting.id === postingId) {
          return {
            ...posting,
            requests: posting.requests.map(request => {
              if (request.id === requestId) {
                return { ...request, status: 'accepted' };
              }
              return request;
            }),
          };
        }
        return posting;
      })
    );
  };

  const handleCompleteRequest = (postingId: string, requestId: string) => {
    setPostings(prevPostings => 
      prevPostings.map(posting => {
        if (posting.id === postingId) {
          return {
            ...posting,
            requests: posting.requests.map(request => {
              if (request.id === requestId) {
                return { ...request, status: 'completed' };
              }
              return request;
            }),
          };
        }
        return posting;
      })
    );
  };

  const handleRemoveUser = (postingId: string, requestId: string) => {
    setPostings(prevPostings => 
      prevPostings.map(posting => {
        if (posting.id === postingId) {
          return {
            ...posting,
            requests: posting.requests.filter(request => request.id !== requestId),
          };
        }
        return posting;
      })
    );
  };

  const handleCompletePosting = async (postingId: string) => {
    try {
      setCompletingPosting(postingId);
      await completePosting(postingId);
      
      setPostings(prevPostings => 
        prevPostings.map(posting => {
          if (posting.id === postingId) {
            return {
              ...posting,
              status: 'completed',
            };
          }
          return posting;
        })
      );
    } catch (err) {
      console.error('Failed to complete posting:', err);
    } finally {
      setCompletingPosting(null);
    }
  };

  const handleRemoveProject = (postingId: string) => {
    setPostings(prevPostings => 
      prevPostings.filter(posting => posting.id !== postingId)
    );
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'closed': return 'text-red-400';
      case 'draft': return 'text-yellow-400';
      case 'completed': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getRequestStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'accepted': return CheckCircle;
      case 'rejected': return XCircle;
      case 'completed': return CheckCircle;
      default: return Clock;
    }
  };

  const filteredPostings = activeTab === 'all' 
    ? postings 
    : postings.filter(posting => posting.type === activeTab);

  const tabs = [
    { id: 'all', name: 'All Postings', icon: Briefcase },
    { id: 'jobs', name: 'Jobs', icon: Briefcase },
    { id: 'internships', name: 'Internships', icon: Layout },
    { id: 'courses', name: 'Courses', icon: BookOpen },
    { id: 'scholarships', name: 'Scholarships', icon: Award },
    { id: 'projects', name: 'Projects', icon: FolderGit2 },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      {error && (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg">
          Error: {error.message}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Your Postings</h1>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          {filteredPostings.map((posting) => (
            <div key={posting.id} className="bg-gray-800 rounded-lg border border-gray-700">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gray-700 p-2 rounded-lg">
                      {(() => {
                        const Icon = getIcon(posting.type);
                        return <Icon className="h-6 w-6 text-indigo-400" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{posting.title}</h3>
                      <p className="text-gray-400">{posting.organization}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`flex items-center ${getStatusColor(posting.status)}`}>
                      <Clock className="h-4 w-4 mr-1" />
                      {posting.status.charAt(0).toUpperCase() + posting.status.slice(1)}
                    </span>
                    <button
                      onClick={() => setSelectedPosting(selectedPosting === posting.id ? null : posting.id)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <ChevronDown className={`h-5 w-5 transform transition-transform ${
                        selectedPosting === posting.id ? 'rotate-180' : ''
                      }`} />
                    </button>
                  </div>
                </div>

                {selectedPosting === posting.id && (
                  <div className="mt-6 border-t border-gray-700 pt-6">
                    <h4 className="text-lg font-medium text-white mb-4">Requests ({posting.requests.length})</h4>
                    <div className="space-y-4">
                      {posting.requests.map((request) => (
                        <div key={request.id} className="bg-gray-700 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center">
                              <User className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-white font-medium">{request.userName}</span>
                            </div>
                            {(() => {
                              const StatusIcon = getRequestStatusIcon(request.status);
                              return (
                                <span className={`flex items-center ${
                                  request.status === 'accepted' ? 'text-green-400' :
                                  request.status === 'rejected' ? 'text-red-400' :
                                  request.status === 'completed' ? 'text-blue-400' :
                                  'text-yellow-400'
                                }`}>
                                  <StatusIcon className="h-4 w-4 mr-1" />
                                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </span>
                              );
                            })()}
                          </div>
                          <p className="text-gray-300">{request.message}</p>
                          <div className="flex space-x-2 mt-4">
                            {request.status === 'pending' && (
                              <button 
                                onClick={() => handleAcceptRequest(posting.id, request.id)}
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                              >
                                Accept
                              </button>
                            )}
                            {request.status === 'accepted' && (
                              <>
                                <button 
                                  onClick={() => handleCompleteRequest(posting.id, request.id)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                  Complete Project
                                </button>
                                <button 
                                  onClick={() => handleRemoveUser(posting.id, request.id)}
                                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                >
                                  Remove User
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                      {posting.requests.length === 0 && (
                        <p className="text-gray-400 text-center py-4">No requests yet</p>
                      )}
                    </div>
                    <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-700">
                      <button
                        onClick={() => handleCompletePosting(posting.id)}
                        disabled={isLoading || completingPosting === posting.id}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center ${
                          (isLoading || completingPosting === posting.id) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <CheckCircle className="h-5 w-5 mr-2" />
                        {completingPosting === posting.id ? 'Completing...' : 'Complete Project'}
                      </button>
                      <button
                        onClick={() => handleRemoveProject(posting.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                      >
                        <Trash className="h-5 w-5 mr-2" />
                        Remove Project
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredPostings.length === 0 && (
            <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-gray-400">No postings found for this category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}