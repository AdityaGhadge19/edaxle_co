import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Users, MessageCircle, Hash, Send, Smile, Paperclip, 
  Settings, UserPlus, Bell, BellOff, Share2, Search,
  Pin, Calendar, Video, FileText, Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Channel = {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'announcement';
  description?: string;
  memberCount?: number;
};

type Message = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file' | 'video';
  attachments?: string[];
  reactions?: { emoji: string; count: number; users: string[] }[];
};

type Member = {
  id: string;
  name: string;
  avatar: string;
  role: 'teacher' | 'moderator' | 'student';
  status: 'online' | 'away' | 'offline';
  joinedAt: string;
};

const CommunityDetailPage = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const { user } = useAuth();
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [message, setMessage] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  // Mock community data
  const community = {
    id: communityId,
    name: 'Advanced Mathematics Hub',
    description: 'A community for advanced mathematics students and enthusiasts. Discuss calculus, linear algebra, and more complex topics.',
    memberCount: 2847,
    imageUrl: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    teacherName: 'Math Masters',
    teacherAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    category: 'mathematics',
    isVerified: true,
    createdAt: '2023-01-15',
    rules: [
      'Be respectful to all members',
      'Stay on topic - keep discussions related to mathematics',
      'No spam or self-promotion without permission',
      'Use appropriate channels for different types of content',
      'Help others learn and grow'
    ]
  };

  const channels: Channel[] = [
    { id: 'announcements', name: 'announcements', type: 'announcement', description: 'Important updates and news' },
    { id: 'general', name: 'general', type: 'text', description: 'General mathematics discussion' },
    { id: 'calculus', name: 'calculus', type: 'text', description: 'Calculus problems and solutions' },
    { id: 'algebra', name: 'linear-algebra', type: 'text', description: 'Linear algebra discussions' },
    { id: 'homework-help', name: 'homework-help', type: 'text', description: 'Get help with your assignments' },
    { id: 'resources', name: 'resources', type: 'text', description: 'Share useful learning materials' },
    { id: 'study-group', name: 'study-group', type: 'voice', description: 'Voice chat for study sessions' }
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Math Masters',
      userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      content: 'Welcome to the Advanced Mathematics Hub! Feel free to ask questions and share your knowledge.',
      timestamp: '2025-01-15T10:00:00Z',
      type: 'text'
    },
    {
      id: '2',
      userId: '2',
      userName: 'Sarah Johnson',
      userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      content: 'Can someone help me understand the concept of eigenvalues in linear algebra?',
      timestamp: '2025-01-15T10:30:00Z',
      type: 'text',
      reactions: [{ emoji: '👍', count: 3, users: ['3', '4', '5'] }]
    },
    {
      id: '3',
      userId: '3',
      userName: 'Michael Chen',
      userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      content: 'I found this great resource for calculus problems. Check it out!',
      timestamp: '2025-01-15T11:00:00Z',
      type: 'text',
      attachments: ['calculus-problems.pdf']
    }
  ]);

  const members: Member[] = [
    {
      id: '1',
      name: 'Math Masters',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      role: 'teacher',
      status: 'online',
      joinedAt: '2023-01-15'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      role: 'student',
      status: 'online',
      joinedAt: '2023-02-20'
    },
    {
      id: '3',
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      role: 'moderator',
      status: 'away',
      joinedAt: '2023-01-25'
    },
    {
      id: '4',
      name: 'Emma Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      role: 'student',
      status: 'offline',
      joinedAt: '2023-03-10'
    }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar || '',
      content: message,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const handleJoinCommunity = () => {
    setIsJoined(!isJoined);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher': return 'text-purple-600 bg-purple-100';
      case 'moderator': return 'text-blue-600 bg-blue-100';
      case 'student': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Sidebar - Channels */}
      <div className="w-60 bg-sidebar-bg border-r border-border-color flex flex-col">
        {/* Community Header */}
        <div className="p-4 border-b border-border-color">
          <div className="flex items-center space-x-3">
            <img
              src={community.imageUrl}
              alt={community.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-lg truncate">{community.name}</h2>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Users size={14} />
                <span>{community.memberCount.toLocaleString()} members</span>
              </div>
            </div>
          </div>
          
          {!isJoined ? (
            <button
              onClick={handleJoinCommunity}
              className="w-full mt-3 py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition"
            >
              Join Community
            </button>
          ) : (
            <div className="flex space-x-2 mt-3">
              <button className="flex-1 py-2 px-3 bg-green-100 text-green-600 rounded-md text-sm">
                Joined
              </button>
              <button className="p-2 border border-border-color rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                <Bell size={16} />
              </button>
              <button className="p-2 border border-border-color rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                <Share2 size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-2 mb-2">
              Text Channels
            </h3>
            {channels.filter(c => c.type === 'text' || c.type === 'announcement').map((channel) => (
              <button
                key={channel.id}
                onClick={() => setSelectedChannel(channel.id)}
                className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded text-sm transition ${
                  selectedChannel === channel.id
                    ? 'bg-primary/20 text-primary'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {channel.type === 'announcement' ? (
                  <Pin size={16} />
                ) : (
                  <Hash size={16} />
                )}
                <span>{channel.name}</span>
              </button>
            ))}
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-2 mb-2">
              Voice Channels
            </h3>
            {channels.filter(c => c.type === 'voice').map((channel) => (
              <button
                key={channel.id}
                className="w-full flex items-center space-x-2 px-2 py-1.5 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <Video size={16} />
                <span>{channel.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        <div className="h-16 border-b border-border-color flex items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <Hash size={20} />
            <div>
              <h3 className="font-semibold">
                {channels.find(c => c.id === selectedChannel)?.name}
              </h3>
              <p className="text-sm text-gray-500">
                {channels.find(c => c.id === selectedChannel)?.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              <Search size={18} />
            </button>
            <button 
              onClick={() => setShowMembers(!showMembers)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <Users size={18} />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="flex space-x-3">
              <img
                src={msg.userAvatar}
                alt={msg.userName}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold">{msg.userName}</span>
                  <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                </div>
                <p className="text-sm">{msg.content}</p>
                
                {msg.attachments && (
                  <div className="mt-2">
                    {msg.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                        <FileText size={16} />
                        <span className="text-sm">{attachment}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {msg.reactions && (
                  <div className="flex space-x-1 mt-2">
                    {msg.reactions.map((reaction, index) => (
                      <button
                        key={index}
                        className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <span>{reaction.emoji}</span>
                        <span>{reaction.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        {isJoined && (
          <div className="p-4 border-t border-border-color">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <button
                type="button"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              >
                <Paperclip size={18} />
              </button>
              
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Message #${channels.find(c => c.id === selectedChannel)?.name}`}
                  className="w-full px-4 py-2 pr-10 border border-border-color rounded-full bg-card-bg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded p-1"
                >
                  <Smile size={16} />
                </button>
              </div>
              
              <button
                type="submit"
                disabled={!message.trim()}
                className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Members Sidebar */}
      {showMembers && (
        <div className="w-60 bg-sidebar-bg border-l border-border-color">
          <div className="p-4 border-b border-border-color">
            <h3 className="font-semibold">Members ({members.length})</h3>
          </div>
          
          <div className="p-2 space-y-1">
            {members.map((member) => (
              <div key={member.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                <div className="relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium truncate">{member.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${getRoleColor(member.role)}`}>
                      {member.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityDetailPage;