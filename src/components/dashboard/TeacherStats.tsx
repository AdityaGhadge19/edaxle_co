import { BarChart2, Upload, Users, Eye } from 'lucide-react';

const TeacherStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-card-bg rounded-lg shadow-md p-6 transition-transform hover:translate-y-[-4px]">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
            <Upload className="text-primary h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Videos</p>
            <h3 className="text-2xl font-bold">24</h3>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">This month</p>
            <p className="text-xs text-green-500 font-medium">+4 (20%)</p>
          </div>
        </div>
      </div>

      <div className="bg-card-bg rounded-lg shadow-md p-6 transition-transform hover:translate-y-[-4px]">
        <div className="flex items-center space-x-4">
          <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
            <Eye className="text-green-600 dark:text-green-400 h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Views</p>
            <h3 className="text-2xl font-bold">142.5K</h3>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">This month</p>
            <p className="text-xs text-green-500 font-medium">+22.3K (18%)</p>
          </div>
        </div>
      </div>

      <div className="bg-card-bg rounded-lg shadow-md p-6 transition-transform hover:translate-y-[-4px]">
        <div className="flex items-center space-x-4">
          <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
            <Users className="text-purple-600 dark:text-purple-400 h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Students</p>
            <h3 className="text-2xl font-bold">1,256</h3>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">This month</p>
            <p className="text-xs text-green-500 font-medium">+124 (11%)</p>
          </div>
        </div>
      </div>

      <div className="bg-card-bg rounded-lg shadow-md p-6 transition-transform hover:translate-y-[-4px]">
        <div className="flex items-center space-x-4">
          <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full">
            <BarChart2 className="text-orange-600 dark:text-orange-400 h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Engagement</p>
            <h3 className="text-2xl font-bold">78%</h3>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">Last month</p>
            <p className="text-xs text-green-500 font-medium">+5%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherStats;