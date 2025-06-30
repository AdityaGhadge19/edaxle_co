import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Radio, Users, MessageCircle, Settings, Eye, EyeOff, 
  Mic, MicOff, Video, VideoOff, Share2, Copy, Send,
  HelpCircle, X, Check, Clock, AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type ChatMessage = {
  id: string;
  user: {
    name: string;
    avatar: string;
    role: 'student' | 'teacher';
  };
  message: string;
  timestamp: string;
  type: 'message' | 'doubt';
  isResolved?: boolean;
};

type Doubt = {
  id: string;
  student: {
    name: string;
    avatar: string;
  };
  question: string;
  timestamp: string;
  isResolved: boolean;
};

const LiveStreamDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLive, setIsLive] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'doubts'>('chat');
  const [streamKey] = useState('live_' + Math.random().toString(36).substr(2, 9));

  // Mock data for demonstration
  useEffect(() => {
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        user: {
          name: 'Sarah Johnson',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          role: 'student'
        },
        message: 'Hello! Excited for this live session!',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        type: 'message'
      },
      {
        id: '2',
        user: {
          name: 'Michael Chen',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          role: 'student'
        },
        message: 'Can you explain the concept of derivatives again?',
        timestamp: new Date(Date.now() - 240000).toISOString(),
        type: 'doubt'
      },
      {
        id: '3',
        user: {
          name: 'Emma Wilson',
          avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
          role: 'student'
        },
        message: 'Great explanation! Thank you!',
        timestamp: new Date(Date.now() - 180000).toISOString(),
        type: 'message'
      }
    ];

    const mockDoubts: Doubt[] = [
      {
        id: '1',
        student: {
          name: 'Michael Chen',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        question: 'Can you explain the concept of derivatives again? I\'m having trouble understanding the power rule.',
        timestamp: new Date(Date.now() - 240000).toISOString(),
        isResolved: false
      },
      {
        id: '2',
        student: {
          name: 'Alex Rodriguez',
          avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
        },
        question: 'What\'s the difference between limits and derivatives?',
        timestamp: new Date(Date.now() - 120000).toISOString(),
        isResolved: false
      }
    ];

    setChatMessages(mockMessages);
    setDoubts(mockDoubts);
  }, []);

  // Simulate viewer count changes
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setViewerCount(prev => {
          const change = Math.floor(Math.random() * 10) - 5;
          return Math.max(0, prev + change);
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isLive]);

  const handleStartStream = () => {
    if (!streamTitle.trim()) {
      alert('Please enter a stream title');
      return;
    }
    setIsLive(true);
    setViewerCount(Math.floor(Math.random() * 50) + 10);
  };

  const handleEndStream = () => {
    setIsLive(false);
    setViewerCount(0);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: {
        name: user?.name || 'Teacher',
        avatar: user?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg',
        role: 'teacher'
      },
      message: chatMessage,
      timestamp: new Date().toISOString(),
      type: 'message'
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatMessage('');
  };

  const handleResolveDoubt = (doubtId: string) => {
    setDoubts(prev => prev.map(doubt => 
      doubt.id === doubtId ? { ...doubt, isResolved: true } : doubt
    ));
  };

  const handleShareStream = () => {
    const streamUrl = `${window.location.origin}/live/${streamKey}`;
    if (navigator.share) {
      navigator.share({
        title: streamTitle,
        text: `Join my live stream: ${streamTitle}`,
        url: streamUrl,
      });
    } else {
      navigator.clipboard.writeText(streamUrl);
      alert('Stream link copied to clipboard!');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (user?.role !== 'teacher') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">Only teachers can access the live stream dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <Radio className="mr-3" size={32} />
            Live Stream Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isLive ? 'You are currently live!' : 'Set up your live stream'}
          </p>
        </div>
        
        {isLive && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">LIVE</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
              <Eye size={16} />
              <span>{viewerCount} viewers</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stream Area */}
        <div className="lg:col-span-2">
          {/* Stream Setup */}
          {!isLive && (
            <div className="bg-card-bg rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Stream Setup</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Stream Title *</label>
                  <input
                    type="text"
                    value={streamTitle}
                    onChange={(e) => setStreamTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your stream title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={streamDescription}
                    onChange={(e) => setStreamDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Describe what you'll be teaching"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select category</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="physics">Physics</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="biology">Biology</option>
                    <option value="computer_science">Computer Science</option>
                    <option value="history">History</option>
                    <option value="literature">Literature</option>
                    <option value="languages">Languages</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Video Preview/Stream */}
          <div className="bg-black rounded-lg aspect-video mb-6 relative overflow-hidden">
            {isLive ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <Radio size={64} className="mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-bold mb-2">{streamTitle}</h3>
                  <p className="text-gray-300">Live Stream Active</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Video size={64} className="mx-auto mb-4" />
                  <p>Camera preview will appear here</p>
                </div>
              </div>
            )}
            
            {/* Stream Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  className={`p-2 rounded-full ${
                    isVideoEnabled ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'
                  }`}
                >
                  {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
                </button>
                
                <button
                  onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  className={`p-2 rounded-full ${
                    isAudioEnabled ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'
                  }`}
                >
                  {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                </button>
              </div>
              
              <div className="flex space-x-2">
                {isLive && (
                  <button
                    onClick={handleShareStream}
                    className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition"
                  >
                    <Share2 size={20} />
                  </button>
                )}
                
                <button className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition">
                  <Settings size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Stream Controls */}
          <div className="bg-card-bg rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Stream Controls</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isLive ? 'Stream is live' : 'Ready to go live'}
                </p>
              </div>
              
              <div className="flex space-x-2">
                {!isLive ? (
                  <button
                    onClick={handleStartStream}
                    className="flex items-center space-x-2 py-2 px-6 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    <Radio size={16} />
                    <span>Go Live</span>
                  </button>
                ) : (
                  <button
                    onClick={handleEndStream}
                    className="flex items-center space-x-2 py-2 px-6 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                  >
                    <X size={16} />
                    <span>End Stream</span>
                  </button>
                )}
                
                {isLive && (
                  <button
                    onClick={handleShareStream}
                    className="flex items-center space-x-2 py-2 px-4 border border-border-color rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <Copy size={16} />
                    <span>Share</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chat and Doubts Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card-bg rounded-lg shadow-md h-[600px] flex flex-col">
            {/* Tab Headers */}
            <div className="flex border-b border-border-color">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition ${
                  activeTab === 'chat'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <MessageCircle size={16} />
                  <span>Chat</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('doubts')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition relative ${
                  activeTab === 'doubts'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <HelpCircle size={16} />
                  <span>Doubts</span>
                  {doubts.filter(d => !d.isResolved).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {doubts.filter(d => !d.isResolved).length}
                    </span>
                  )}
                </div>
              </button>
            </div>

            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="flex space-x-2">
                      <img
                        src={msg.user.avatar}
                        alt={msg.user.name}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${
                            msg.user.role === 'teacher' ? 'text-primary' : ''
                          }`}>
                            {msg.user.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTime(msg.timestamp)}
                          </span>
                          {msg.type === 'doubt' && (
                            <HelpCircle size={12} className="text-orange-500" />
                          )}
                        </div>
                        <p className="text-sm mt-1">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <form onSubmit={handleSendMessage} className="p-4 border-t border-border-color">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="flex-1 px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="Type a message..."
                    />
                    <button
                      type="submit"
                      className="p-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Doubts Tab */}
            {activeTab === 'doubts' && (
              <div className="flex-1 overflow-y-auto p-4">
                {doubts.length > 0 ? (
                  <div className="space-y-4">
                    {doubts.map((doubt) => (
                      <div
                        key={doubt.id}
                        className={`border rounded-lg p-3 ${
                          doubt.isResolved
                            ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                            : 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <img
                              src={doubt.student.avatar}
                              alt={doubt.student.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-sm font-medium">{doubt.student.name}</span>
                            <span className="text-xs text-gray-500">
                              {formatTime(doubt.timestamp)}
                            </span>
                          </div>
                          
                          {doubt.isResolved ? (
                            <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                              <Check size={14} />
                              <span className="text-xs">Resolved</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 text-orange-600 dark:text-orange-400">
                              <Clock size={14} />
                              <span className="text-xs">Pending</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm mb-3">{doubt.question}</p>
                        
                        {!doubt.isResolved && (
                          <button
                            onClick={() => handleResolveDoubt(doubt.id)}
                            className="flex items-center space-x-1 text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                          >
                            <Check size={14} />
                            <span>Mark as Resolved</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <HelpCircle size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No doubts yet</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Student doubts will appear here
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamDashboard;