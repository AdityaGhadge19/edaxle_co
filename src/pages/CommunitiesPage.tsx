import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, MessageCircle, Plus, Settings, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Community = {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  imageUrl: string;
  teacherName: string;
  teacherAvatar: string;
  category: string;
  isJoined: boolean;
  isVerified: boolean;
  tags: string[];
  lastActivity: string;
  role?: 'creator' | 'moderator' | 'member';
};

const CommunitiesPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('joined');

  // Mock joined/created communities
  const [joinedCommunities, setJoinedCommunities] = useState<Community[]>([
    {
      id: '1',
      name: 'Advanced Mathematics Hub',
      description: 'A community for advanced mathematics students and enthusiasts.',
      memberCount: 2847,
      imageUrl: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      teacherName: 'Math Masters',
      teacherAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      category: 'mathematics',
      isJoined: true,
      isVerified: true,
      tags: ['calculus', 'algebra', 'geometry'],
      lastActivity: '2 hours ago',
      role: user?.role === 'teacher' ? 'creator' : 'member'
    },
    {
      id: '2',
      name: 'Programming Bootcamp',
      description: 'Learn programming from scratch or advance your skills.',
      memberCount: 3521,
      imageUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      teacherName: 'Code Masters',
      teacherAvatar: 'https://randomuser.me/api/portraits/women/42.jpg',
      category: 'computer_science',
      isJoined: true,
      isVerified: true,
      tags: ['python', 'javascript', 'web-dev'],
      lastActivity: '30 minutes ago',
      role: 'member'
    },
    {
      id: '3',
      name: 'Physics Research Lab',
      description: 'Connect with physics researchers and students.',
      memberCount: 1923,
      imageUrl: 'https://images.pexels.com/photos/2085832/pexels-photo-2085832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      teacherName: 'Physics Academy',
      teacherAvatar: 'https://randomuser.me/api/portraits/men/72.jpg',
      category: 'physics',
      isJoined: true,
      isVerified: true,
      tags: ['quantum', 'mechanics', 'astrophysics'],
      lastActivity: '1 hour ago',
      role: 'member'
    },
    {
      id: '4',
      name: 'Chemistry Lab Community',
      description: 'For chemistry students and professionals.',
      memberCount: 1456,
      imageUrl: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      teacherName: 'Chemistry Lab',
      teacherAvatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      category: 'chemistry',
      isJoined: true,
      isVerified: true,
      tags: ['organic', 'inorganic', 'experiments'],
      lastActivity: '3 hours ago',
      role: 'member'
    },
    {
      id: '5',
      name: 'Biology Study Group',
      description: 'Explore the wonders of life sciences together.',
      memberCount: 892,
      imageUrl: 'https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      teacherName: 'Bio Expert',
      teacherAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      category: 'biology',
      isJoined: true,
      isVerified: false,
      tags: ['genetics', 'ecology', 'molecular'],
      lastActivity: '5 hours ago',
      role: 'member'
    },
    {
      id: '6',
      name: 'History Enthusiasts',
      description: 'Discuss historical events and their impact.',
      memberCount: 1234,
      imageUrl: 'https://images.pexels.com/photos/159275/macro-focus-cogwheel-gear-159275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      teacherName: 'History Prof',
      teacherAvatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      category: 'history',
      isJoined: true,
      isVerified: true,
      tags: ['ancient', 'modern', 'wars'],
      lastActivity: '1 day ago',
      role: 'member'
    }
  ]);

  // Mock search communities
  const [searchCommunities, setSearchCommunities] = useState<Community[]>([
    {
      id: '7',
      name: 'Literature Circle',
      description: 'Analyze and discuss classic and contemporary literature.',
      memberCount: 756,
      imageUrl: 'https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      teacherName: 'Literature Guild',
      teacherAvatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      category: 'literature',
      isJoined: false,
      isVerified: true,
      tags: ['shakespeare', 'poetry', 'novels'],
      lastActivity: '2 hours ago'
    },
    {
      id: '8',
      name: 'Language Learning Hub',
      description: 'Practice and learn new languages together.',
      memberCount: 2156,
      imageUrl: 'https://images.pexels.com/photos/5676744/pexels-photo-5676744.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      teacherName: 'Language Academy',
      teacherAvatar: 'https://randomuser.me/api/portraits/women/52.jpg',
      category: 'languages',
      isJoined: false,
      isVerified: true,
      tags: ['spanish', 'french', 'mandarin'],
      lastActivity: '4 hours ago'
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'biology', name: 'Biology' },
    { id: 'computer_science', name: 'Computer Science' },
    { id: 'history', name: 'History' },
    { id: 'literature', name: 'Literature' },
    { id: 'languages', name: 'Languages' },
    { id: 'geography', name: 'Geography' }
  ];

  const handleJoinCommunity = (communityId: string) => {
    setSearchCommunities(communities => 
      communities.map(community => 
        community.id === communityId 
          ? { 
              ...community, 
              isJoined: !community.isJoined,
              memberCount: community.isJoined ? community.memberCount - 1 : community.memberCount + 1
            }
          : community
      )
    );
  };

  const filteredSearchCommunities = searchCommunities.filter(community => 
    (selectedCategory === 'all' || community.category === selectedCategory) &&
    (community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
     community.teacherName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'creator':
        return <Crown size={12} className="text-yellow-500" />;
      case 'moderator':
        return <Settings size={12} className="text-blue-500" />;
      default:
        return <Users size={12} className="text-gray-500" />;
    }
  };

  const getRoleText = (role?: string) => {
    switch (role) {
      case 'creator':
        return 'Creator';
      case 'moderator':
        return 'Moderator';
      default:
        return 'Member';
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Communities</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Connect with fellow learners and educators
          </p>
        </div>
        
        {user?.role === 'teacher' && (
          <Link
            to="/teacher/communities/create"
            className="flex items-center space-x-2 py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition"
          >
            <Plus size={16} />
            <span>Create Community</span>
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('joined')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
            activeTab === 'joined'
              ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-primary'
          }`}
        >
          My Communities ({joinedCommunities.length})
        </button>
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
            activeTab === 'discover'
              ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-primary'
          }`}
        >
          Discover Communities
        </button>
      </div>

      {activeTab === 'joined' ? (
        /* Joined Communities - Compact Layout */
        <div>
          {joinedCommunities.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {joinedCommunities.map((community) => (
                <Link
                  key={community.id}
                  to={`/community/${community.id}`}
                  className="bg-card-bg rounded-lg shadow-md overflow-hidden hover:shadow-lg transition block group"
                >
                  <div className="relative">
                    <img
                      src={community.imageUrl}
                      alt={community.name}
                      className="w-full h-20 object-cover"
                    />
                    <div className="absolute top-1 right-1 flex space-x-1">
                      {community.isVerified && (
                        <div className="bg-blue-500 text-white rounded-full p-0.5">
                          <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-1 left-1">
                      <div className="flex items-center space-x-1 bg-black bg-opacity-70 text-white px-1 py-0.5 rounded text-xs">
                        {getRoleIcon(community.role)}
                        <span className="text-xs">{getRoleText(community.role)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <h3 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-primary transition">
                      {community.name}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users size={10} />
                        <span>{community.memberCount > 1000 ? `${(community.memberCount/1000).toFixed(1)}k` : community.memberCount}</span>
                      </div>
                      <div className="bg-green-100 text-green-600 px-1 py-0.5 rounded text-xs font-medium">
                        Joined
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't joined any communities yet</p>
              <button
                onClick={() => setActiveTab('discover')}
                className="py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition"
              >
                Discover Communities
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Discover Communities */
        <div>
          {/* Search and Filters */}
          <div className="bg-card-bg rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search communities..."
                    className="w-full px-4 py-2 pl-10 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-border-color rounded-md bg-card-bg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Results */}
          <div>
            <h2 className="text-xl font-bold mb-4">Discover New Communities ({filteredSearchCommunities.length})</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSearchCommunities.map((community) => (
                <div
                  key={community.id}
                  className="bg-card-bg rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <div className="relative">
                    <img
                      src={community.imageUrl}
                      alt={community.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {community.isVerified && (
                        <div className="bg-blue-500 text-white rounded-full p-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{community.name}</h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {community.description}
                    </p>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <img
                        src={community.teacherAvatar}
                        alt={community.teacherName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium">{community.teacherName}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {community.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users size={14} />
                          <span>{community.memberCount.toLocaleString()}</span>
                        </div>
                        <span>{community.lastActivity}</span>
                      </div>
                      
                      <button
                        onClick={() => handleJoinCommunity(community.id)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                          community.isJoined
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-primary text-white hover:bg-primary-dark'
                        }`}
                      >
                        {community.isJoined ? 'Joined' : 'Join'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredSearchCommunities.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No communities found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunitiesPage;