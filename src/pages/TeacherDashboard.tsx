import { useState } from 'react';
import { useVideos } from '../contexts/VideoContext';
import TeacherStats from '../components/dashboard/TeacherStats';
import VideoUploadForm from '../components/dashboard/VideoUploadForm';
import VideoCard from '../components/video/VideoCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';

const TeacherDashboard = () => {
  const { videos } = useVideos();
  const [activeTab, setActiveTab] = useState('overview');

  // Filter videos to show only those from the current teacher
  const teacherVideos = videos.slice(0, 6); // Mock data for demonstration

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Teacher Dashboard</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="videos">My Videos</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <TeacherStats />
          
          <div className="bg-card-bg rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Recent Videos</h2>
              <button 
                onClick={() => setActiveTab('videos')}
                className="text-primary hover:underline"
              >
                View All
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teacherVideos.slice(0, 3).map((video) => (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  thumbnailUrl={video.thumbnailUrl}
                  authorName={video.author.name}
                  authorAvatar={video.author.avatar}
                  views={video.views}
                  createdAt={video.createdAt}
                  duration={video.duration}
                  tags={video.tags}
                />
              ))}
            </div>
          </div>
          
          <div className="bg-card-bg rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-background rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">New video uploaded: "Advanced Calculus Concepts"</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-background rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Video reached 1,000 views: "Introduction to Linear Algebra"</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">5 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-background rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">New community member joined "Mathematics Hub"</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="videos">
          <div className="bg-card-bg rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Your Videos</h2>
              <button 
                onClick={() => setActiveTab('upload')}
                className="py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition"
              >
                Upload New Video
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teacherVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  thumbnailUrl={video.thumbnailUrl}
                  authorName={video.author.name}
                  authorAvatar={video.author.avatar}
                  views={video.views}
                  createdAt={video.createdAt}
                  duration={video.duration}
                  tags={video.tags}
                />
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="upload">
          <VideoUploadForm />
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="bg-card-bg rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Video Performance</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border-color">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Video
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Watch Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Completion Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Engagement
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color">
                  {teacherVideos.slice(0, 5).map((video, index) => (
                    <tr key={video.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="text-sm font-medium truncate max-w-xs">
                            {video.title}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {video.views.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {Math.floor(Math.random() * 100) + 20}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {Math.floor(Math.random() * 30) + 70}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-1">
                          <span className={index % 2 === 0 ? "text-green-500" : "text-yellow-500"}>
                            {index % 2 === 0 ? "High" : "Medium"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherDashboard;