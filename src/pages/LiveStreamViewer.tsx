import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Users, MessageCircle, Send, HelpCircle, Eye, 
  ThumbsUp, Share2, Bookmark, Volume2, VolumeX,
  Maximize, Settings
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
};

const LiveStreamViewer = () => {
  const { streamId } = useParams<{ streamId: string }>();
  const { user } = useAuth();
  const [viewerCount, setViewerCount] = useState(0);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [doubtMode, setDoubtMode] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock stream data
  const streamData = {
    title: 'Advanced Calculus: Integration Techniques',
    teacher: {
      name: 'Math Masters',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      subscribers: 15420
    },
    category: 'Mathematics',
    startTime: new Date(Date.now() - 1800000).toISOString(), // Started 30 minutes ago
    description: 'In this live session, we\'ll explore advanced integration techniques including integration by parts, partial fractions, and trigonometric substitution.'
  };

  useEffect(() => {
    // Mock initial messages
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        user: {
          name: 'Sarah Johnson',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          role: 'student'
        },
        message: 'Hello everyone! Excited for this session!',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        type: 'message'
      },
      {
        id: '2',
        user: {
          name: 'Math Masters',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          role: 'teacher'
        },
        message: 'Welcome everyone! We\'ll start with integration by parts.',
        timestamp: new Date(Date.now() - 240000).toISOString(),
        type: 'message'
      },
      {
        id: '3',
        user: {
          name: 'Michael Chen',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          role: 'student'
        },
        message: 'Can you explain when to use integration by parts vs substitution?',
        timestamp: new Date(Date.now() - 180000).toISOString(),
        type: 'doubt'
      }
    ];

    setChatMessages(mockMessages);
    setViewerCount(Math.floor(Math.random() * 200) + 50);

    // Simulate viewer count changes
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 10) - 5;
        return Math.max(0, prev + change);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !user) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: {
        name: user.name,
        avatar: user.avatar || 'https://randomuser.me/api/portraits/men/1.jpg',
        role: user.role
      },
      message: chatMessage,
      timestamp: new Date().toISOString(),
      type: doubtMode ? 'doubt' : 'message'
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatMessage('');
    setDoubtMode(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: streamData.title,
        text: `Watch this live stream: ${streamData.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Stream link copied to clipboard!');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStreamDuration = () => {
    const start = new Date(streamData.startTime);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:00`;
    }
    return `${minutes}:00`;
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Stream Area */}
        <div className="lg:col-span-3">
          {/* Live Stream Video */}
          <div className="bg-black rounded-lg aspect-video mb-4 relative overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-xl font-bold mb-2">{streamData.title}</div>
                <div className="text-gray-300">Live Stream</div>
              </div>
            </div>
            
            {/* Live Badge */}
            <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">LIVE</span>
            </div>
            
            {/* Stream Info Overlay */}
            <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded">
              <div className="text-sm">{getStreamDuration()}</div>
            </div>
            
            {/* Stream Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <div className="flex items-center space-x-2 text-white">
                <Eye size={16} />
                <span className="text-sm">{viewerCount} watching</span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                
                <button className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition">
                  <Settings size={20} />
                </button>
                
                <button className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition">
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Stream Info */}
          <div className="bg-card-bg rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-xl md:text-2xl font-bold mb-3">{streamData.title}</h1>
            
            <div className="flex flex-wrap justify-between items-start mb-4">
              <div className="flex items-center space-x-4 mb-2">
                <img
                  src={streamData.teacher.avatar}
                  alt={streamData.teacher.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium">{streamData.teacher.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {streamData.teacher.subscribers.toLocaleString()} subscribers
                  </p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition">
                  Subscribe
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition ${
                    isLiked ? 'text-primary bg-primary/10' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <ThumbsUp size={20} />
                  <span>Like</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <Share2 size={20} />
                  <span>Share</span>
                </button>
                
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition ${
                    isSaved ? 'text-primary bg-primary/10' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Bookmark size={20} />
                  <span>Save</span>
                </button>
              </div>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Started {formatTime(streamData.startTime)}</span>
                <span>•</span>
                <span>{streamData.category}</span>
                <span>•</span>
                <span>{viewerCount} watching</span>
              </div>
              <p>{streamData.description}</p>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card-bg rounded-lg shadow-md h-[600px] flex flex-col">
            <div className="p-4 border-b border-border-color">
              <div className="flex items-center justify-between">
                <h3 className="font-medium flex items-center">
                  <MessageCircle size={16} className="mr-2" />
                  Live Chat
                </h3>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Users size={14} />
                  <span>{viewerCount}</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="flex space-x-2">
                  <img
                    src={msg.user.avatar}
                    alt={msg.user.name}
                    className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium ${
                        msg.user.role === 'teacher' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {msg.user.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(msg.timestamp)}
                      </span>
                      {msg.type === 'doubt' && (
                        <HelpCircle size={10} className="text-orange-500" />
                      )}
                    </div>
                    <p className="text-xs mt-1">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {user && (
              <form onSubmit={handleSendMessage} className="p-4 border-t border-border-color">
                <div className="space-y-2">
                  {user.role === 'student' && (
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setDoubtMode(!doubtMode)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs transition ${
                          doubtMode 
                            ? 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400' 
                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <HelpCircle size={12} />
                        <span>Doubt Mode</span>
                      </button>
                      {doubtMode && (
                        <span className="text-xs text-orange-600 dark:text-orange-400">
                          Ask your doubt
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="flex-1 px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder={doubtMode ? "Ask your doubt..." : "Type a message..."}
                    />
                    <button
                      type="submit"
                      className={`p-2 rounded-md transition ${
                        doubtMode 
                          ? 'bg-orange-600 text-white hover:bg-orange-700' 
                          : 'bg-primary text-white hover:bg-primary-dark'
                      }`}
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamViewer;