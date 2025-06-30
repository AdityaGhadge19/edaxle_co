import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, Hash, Users, Lock, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CreateCommunityPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [communityData, setCommunityData] = useState({
    name: '',
    description: '',
    category: '',
    privacy: 'public',
    image: null as File | null,
    imagePreview: null as string | null,
    rules: [''],
    channels: [
      { name: 'general', type: 'text', description: 'General discussion' },
      { name: 'announcements', type: 'announcement', description: 'Important updates' }
    ]
  });

  const categories = [
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCommunityData({ ...communityData, image: file });
      
      const reader = new FileReader();
      reader.onload = () => {
        setCommunityData(prev => ({ ...prev, imagePreview: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addRule = () => {
    setCommunityData({
      ...communityData,
      rules: [...communityData.rules, '']
    });
  };

  const updateRule = (index: number, value: string) => {
    const newRules = [...communityData.rules];
    newRules[index] = value;
    setCommunityData({ ...communityData, rules: newRules });
  };

  const removeRule = (index: number) => {
    setCommunityData({
      ...communityData,
      rules: communityData.rules.filter((_, i) => i !== index)
    });
  };

  const addChannel = () => {
    setCommunityData({
      ...communityData,
      channels: [...communityData.channels, { name: '', type: 'text', description: '' }]
    });
  };

  const updateChannel = (index: number, field: string, value: string) => {
    const newChannels = [...communityData.channels];
    newChannels[index] = { ...newChannels[index], [field]: value };
    setCommunityData({ ...communityData, channels: newChannels });
  };

  const removeChannel = (index: number) => {
    setCommunityData({
      ...communityData,
      channels: communityData.channels.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async () => {
    // In a real app, you would send this data to your API
    console.log('Creating community:', communityData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Community created successfully!');
    navigate('/communities');
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  if (user?.role !== 'teacher') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">Only teachers can create communities.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Create Community</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Build a learning community for your students
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              {stepNumber}
            </div>
            {stepNumber < 3 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  step > stepNumber ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-card-bg rounded-lg shadow-md p-6">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-6">Basic Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Community Name *</label>
                <input
                  type="text"
                  value={communityData.name}
                  onChange={(e) => setCommunityData({ ...communityData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter community name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  value={communityData.description}
                  onChange={(e) => setCommunityData({ ...communityData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe your community and its purpose"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  value={communityData.category}
                  onChange={(e) => setCommunityData({ ...communityData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Community Image</label>
                {communityData.imagePreview ? (
                  <div className="relative">
                    <img
                      src={communityData.imagePreview}
                      alt="Community preview"
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      onClick={() => setCommunityData({ ...communityData, image: null, imagePreview: null })}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border-color rounded-md p-6 text-center">
                    <input
                      type="file"
                      id="image"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="image" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-gray-400 mb-2 mx-auto" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Click to upload community image
                      </p>
                    </label>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Privacy Setting</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 p-3 border border-border-color rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <input
                      type="radio"
                      name="privacy"
                      value="public"
                      checked={communityData.privacy === 'public'}
                      onChange={(e) => setCommunityData({ ...communityData, privacy: e.target.value })}
                    />
                    <Globe size={20} />
                    <div>
                      <div className="font-medium">Public</div>
                      <div className="text-sm text-gray-500">Anyone can find and join this community</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border border-border-color rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <input
                      type="radio"
                      name="privacy"
                      value="private"
                      checked={communityData.privacy === 'private'}
                      onChange={(e) => setCommunityData({ ...communityData, privacy: e.target.value })}
                    />
                    <Lock size={20} />
                    <div>
                      <div className="font-medium">Private</div>
                      <div className="text-sm text-gray-500">Only invited members can join</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Channels */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-6">Setup Channels</h2>
            
            <div className="space-y-4">
              {communityData.channels.map((channel, index) => (
                <div key={index} className="border border-border-color rounded-md p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium">Channel {index + 1}</h3>
                    {index > 1 && (
                      <button
                        onClick={() => removeChannel(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Channel Name</label>
                      <input
                        type="text"
                        value={channel.name}
                        onChange={(e) => updateChannel(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="channel-name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Type</label>
                      <select
                        value={channel.type}
                        onChange={(e) => updateChannel(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="text">Text Channel</option>
                        <option value="announcement">Announcement</option>
                        <option value="voice">Voice Channel</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <input
                      type="text"
                      value={channel.description}
                      onChange={(e) => updateChannel(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Channel description"
                    />
                  </div>
                </div>
              ))}
              
              <button
                onClick={addChannel}
                className="w-full py-2 px-4 border-2 border-dashed border-border-color rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Channel</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Rules */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-6">Community Rules</h2>
            
            <div className="space-y-4">
              {communityData.rules.map((rule, index) => (
                <div key={index} className="flex space-x-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => updateRule(index, e.target.value)}
                      className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={`Rule ${index + 1}`}
                    />
                  </div>
                  {communityData.rules.length > 1 && (
                    <button
                      onClick={() => removeRule(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                onClick={addRule}
                className="w-full py-2 px-4 border-2 border-dashed border-border-color rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Rule</span>
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <h3 className="font-medium mb-2">Preview</h3>
              <div className="space-y-2">
                {communityData.rules.filter(rule => rule.trim()).map((rule, index) => (
                  <div key={index} className="text-sm">
                    {index + 1}. {rule}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="py-2 px-4 border border-border-color rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {step < 3 ? (
            <button
              onClick={nextStep}
              disabled={
                (step === 1 && (!communityData.name || !communityData.description || !communityData.category)) ||
                (step === 2 && communityData.channels.some(c => !c.name))
              }
              className="py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition"
            >
              Create Community
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCommunityPage;