import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  User, Bell, Shield, Globe, Palette, Monitor, 
  Moon, Sun, Save, Eye, EyeOff, Camera, Mail,
  Phone, MapPin, Calendar, Edit3, Check, X
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';

const SettingsPage = () => {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Passionate educator dedicated to making learning accessible and engaging for all students.',
    location: 'New York, USA',
    phone: '+1 (555) 123-4567',
    website: 'https://myteachingsite.com',
    birthDate: '1985-06-15',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    courseUpdates: true,
    newMessages: true,
    communityActivity: false,
    marketingEmails: false,
    weeklyDigest: true,
    mobileNotifications: true
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    showOnlineStatus: true,
    dataCollection: true,
    analyticsTracking: false
  });

  const handleProfileSave = () => {
    // In a real app, you would send this data to your API
    console.log('Saving profile data:', profileData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleNotificationSave = () => {
    console.log('Saving notification settings:', notifications);
    alert('Notification settings saved!');
  };

  const handlePrivacySave = () => {
    console.log('Saving privacy settings:', privacy);
    alert('Privacy settings saved!');
  };

  const handlePasswordChange = () => {
    if (profileData.newPassword !== profileData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (profileData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    console.log('Changing password');
    alert('Password changed successfully!');
    setProfileData({
      ...profileData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User size={16} />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell size={16} />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center space-x-2">
            <Shield size={16} />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center space-x-2">
            <Palette size={16} />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <div className="bg-card-bg rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Profile Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 py-2 px-4 border border-border-color rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                {isEditing ? <X size={16} /> : <Edit3 size={16} />}
                <span>{isEditing ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={user?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 p-1 bg-primary text-white rounded-full hover:bg-primary-dark">
                      <Camera size={14} />
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{user?.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{user?.role}</p>
                  {isEditing && (
                    <button className="text-sm text-primary hover:underline mt-1">
                      Change photo
                    </button>
                  )}
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Website</label>
                  <input
                    type="url"
                    value={profileData.website}
                    onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Birth Date</label>
                  <input
                    type="date"
                    value={profileData.birthDate}
                    onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="py-2 px-4 border border-border-color rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProfileSave}
                    className="flex items-center space-x-2 py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition"
                  >
                    <Save size={16} />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>

            {/* Password Change Section */}
            <div className="mt-8 pt-6 border-t border-border-color">
              <h3 className="text-lg font-medium mb-4">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={profileData.currentPassword}
                      onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <input
                    type="password"
                    value={profileData.newPassword}
                    onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={profileData.confirmPassword}
                    onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <button
                onClick={handlePasswordChange}
                className="mt-4 py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition"
              >
                Change Password
              </button>
            </div>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <div className="bg-card-bg rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Notification Preferences</h2>
              <button
                onClick={handleNotificationSave}
                className="flex items-center space-x-2 py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition"
              >
                <Save size={16} />
                <span>Save</span>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-4 flex items-center">
                  <Mail size={16} className="mr-2" />
                  Email Notifications
                </h3>
                <div className="space-y-3 ml-6">
                  {[
                    { key: 'emailNotifications', label: 'Enable email notifications', desc: 'Receive notifications via email' },
                    { key: 'courseUpdates', label: 'Course updates', desc: 'Get notified about course changes and new content' },
                    { key: 'newMessages', label: 'New messages', desc: 'Receive emails for new direct messages' },
                    { key: 'communityActivity', label: 'Community activity', desc: 'Updates from communities you\'ve joined' },
                    { key: 'marketingEmails', label: 'Marketing emails', desc: 'Promotional content and feature updates' },
                    { key: 'weeklyDigest', label: 'Weekly digest', desc: 'Summary of your weekly activity' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[item.key as keyof typeof notifications]}
                          onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4 flex items-center">
                  <Phone size={16} className="mr-2" />
                  Push Notifications
                </h3>
                <div className="space-y-3 ml-6">
                  {[
                    { key: 'pushNotifications', label: 'Enable push notifications', desc: 'Receive notifications on your device' },
                    { key: 'mobileNotifications', label: 'Mobile notifications', desc: 'Get notifications on mobile app' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[item.key as keyof typeof notifications]}
                          onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy">
          <div className="bg-card-bg rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Privacy & Security</h2>
              <button
                onClick={handlePrivacySave}
                className="flex items-center space-x-2 py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition"
              >
                <Save size={16} />
                <span>Save</span>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Profile Visibility</h3>
                <div className="space-y-2">
                  {[
                    { value: 'public', label: 'Public', desc: 'Anyone can view your profile' },
                    { value: 'students', label: 'Students Only', desc: 'Only your students can view your profile' },
                    { value: 'private', label: 'Private', desc: 'Only you can view your profile' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center space-x-3 p-3 border border-border-color rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value={option.value}
                        checked={privacy.profileVisibility === option.value}
                        onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                        className="text-primary focus:ring-primary"
                      />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {[
                    { key: 'showEmail', label: 'Show email address', desc: 'Display your email on your public profile' },
                    { key: 'showPhone', label: 'Show phone number', desc: 'Display your phone number on your public profile' },
                    { key: 'allowMessages', label: 'Allow direct messages', desc: 'Let other users send you direct messages' },
                    { key: 'showOnlineStatus', label: 'Show online status', desc: 'Display when you\'re online or offline' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy[item.key as keyof typeof privacy]}
                          onChange={(e) => setPrivacy({ ...privacy, [item.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Data & Analytics</h3>
                <div className="space-y-3">
                  {[
                    { key: 'dataCollection', label: 'Data collection', desc: 'Allow us to collect usage data to improve the platform' },
                    { key: 'analyticsTracking', label: 'Analytics tracking', desc: 'Enable detailed analytics tracking for your content' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy[item.key as keyof typeof privacy]}
                          onChange={(e) => setPrivacy({ ...privacy, [item.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <div className="bg-card-bg rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Appearance</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-4 flex items-center">
                  <Palette size={16} className="mr-2" />
                  Theme
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => !isDarkMode && toggleTheme()}
                    className={`p-4 border-2 rounded-lg text-left transition ${
                      !isDarkMode ? 'border-primary bg-primary/10' : 'border-border-color hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Sun size={20} />
                      <span className="font-medium">Light</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Clean and bright interface
                    </p>
                  </button>

                  <button
                    onClick={() => isDarkMode && toggleTheme()}
                    className={`p-4 border-2 rounded-lg text-left transition ${
                      isDarkMode ? 'border-primary bg-primary/10' : 'border-border-color hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Moon size={20} />
                      <span className="font-medium">Dark</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Easy on the eyes in low light
                    </p>
                  </button>

                  <button
                    className="p-4 border-2 border-border-color rounded-lg text-left transition hover:border-primary/50 opacity-50 cursor-not-allowed"
                    disabled
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Monitor size={20} />
                      <span className="font-medium">System</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Follow system preference (Coming soon)
                    </p>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Language & Region</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Language</label>
                    <select className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="zh">中文</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Time Zone</label>
                    <select className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="UTC-5">Eastern Time (UTC-5)</option>
                      <option value="UTC-6">Central Time (UTC-6)</option>
                      <option value="UTC-7">Mountain Time (UTC-7)</option>
                      <option value="UTC-8">Pacific Time (UTC-8)</option>
                      <option value="UTC+0">UTC</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Display Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Compact mode</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Show more content in less space</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Reduced motion</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Minimize animations and transitions</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;