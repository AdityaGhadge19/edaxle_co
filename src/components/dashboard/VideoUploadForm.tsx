import { useState } from 'react';
import { Upload, X, Plus, CheckSquare } from 'lucide-react';

const VideoUploadForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [contentType, setContentType] = useState<'video' | 'course'>('video');
  const [courseData, setCourseData] = useState({
    courseName: '',
    courseDescription: '',
    price: '',
    duration: '',
    level: 'beginner'
  });

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnail(file);
      
      // Create thumbnail preview
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category || !videoFile) {
      alert('Please fill in all required fields and upload a video');
      return;
    }

    if (contentType === 'course' && (!courseData.courseName || !courseData.courseDescription)) {
      alert('Please fill in course details');
      return;
    }
    
    // Simulate upload process
    setIsUploading(true);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadComplete(true);
            setIsUploading(false);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setTags([]);
    setCurrentTag('');
    setThumbnail(null);
    setThumbnailPreview(null);
    setVideoFile(null);
    setUploadProgress(0);
    setUploadComplete(false);
    setContentType('video');
    setCourseData({
      courseName: '',
      courseDescription: '',
      price: '',
      duration: '',
      level: 'beginner'
    });
  };

  return (
    <div className="bg-card-bg rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">Upload New Content</h2>
      
      {uploadComplete ? (
        <div className="text-center py-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <CheckSquare className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-medium mb-2">Upload Complete!</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your {contentType} has been uploaded successfully and is now being processed.
          </p>
          <button
            onClick={handleReset}
            className="py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-md transition"
          >
            Upload Another {contentType === 'course' ? 'Course' : 'Video'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Content Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Content Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setContentType('video')}
                className={`p-4 border-2 rounded-lg text-left transition ${
                  contentType === 'video'
                    ? 'border-primary bg-primary/10'
                    : 'border-border-color hover:border-primary/50'
                }`}
              >
                <h3 className="font-medium">Standalone Video</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Upload a single educational video
                </p>
              </button>
              
              <button
                type="button"
                onClick={() => setContentType('course')}
                className={`p-4 border-2 rounded-lg text-left transition ${
                  contentType === 'course'
                    ? 'border-primary bg-primary/10'
                    : 'border-border-color hover:border-primary/50'
                }`}
              >
                <h3 className="font-medium">Course Video</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Add video to a structured course
                </p>
              </button>
            </div>
          </div>

          {/* Course Details (if course is selected) */}
          {contentType === 'course' && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-medium mb-4 text-blue-800 dark:text-blue-200">Course Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Course Name *</label>
                  <input
                    type="text"
                    value={courseData.courseName}
                    onChange={(e) => setCourseData({ ...courseData, courseName: e.target.value })}
                    className="w-full px-3 py-2 border border-border-color rounded-md bg-card-bg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter course name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Course Level</label>
                  <select
                    value={courseData.level}
                    onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
                    className="w-full px-3 py-2 border border-border-color rounded-md bg-card-bg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={courseData.price}
                    onChange={(e) => setCourseData({ ...courseData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-border-color rounded-md bg-card-bg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0 for free"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (hours)</label>
                  <input
                    type="number"
                    value={courseData.duration}
                    onChange={(e) => setCourseData({ ...courseData, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-border-color rounded-md bg-card-bg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Total course duration"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Course Description *</label>
                <textarea
                  value={courseData.courseDescription}
                  onChange={(e) => setCourseData({ ...courseData, courseDescription: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-border-color rounded-md bg-card-bg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe what students will learn in this course"
                />
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  {contentType === 'course' ? 'Lesson' : 'Video'} Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  className="w-full px-3 py-2 border border-border-color rounded-md bg-card-bg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={`Enter ${contentType === 'course' ? 'lesson' : 'video'} title`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="w-full px-3 py-2 border border-border-color rounded-md bg-card-bg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={`Describe your ${contentType === 'course' ? 'lesson' : 'video'}`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  className="w-full px-3 py-2 border border-border-color rounded-md bg-card-bg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="biology">Biology</option>
                  <option value="computer_science">Computer Science</option>
                  <option value="history">History</option>
                  <option value="literature">Literature</option>
                  <option value="languages">Languages</option>
                  <option value="geography">Geography</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="tags" className="block text-sm font-medium mb-1">
                  Tags
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="tags"
                    className="flex-1 px-3 py-2 border border-border-color rounded-l-md bg-card-bg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Add tags"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    type="button"
                    className="px-3 py-2 bg-primary text-white rounded-r-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
                    onClick={handleAddTag}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded-full text-sm"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          className="ml-1 focus:outline-none"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Thumbnail
                </label>
                {thumbnailPreview ? (
                  <div className="relative">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full aspect-video object-cover rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                      onClick={() => {
                        setThumbnail(null);
                        setThumbnailPreview(null);
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border-color rounded-md p-6 text-center">
                    <input
                      type="file"
                      id="thumbnail"
                      className="hidden"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                    />
                    <label
                      htmlFor="thumbnail"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Click to upload thumbnail
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        PNG, JPG, GIF up to 2MB
                      </p>
                    </label>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Video File <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-border-color rounded-md p-6 text-center">
                  <input
                    type="file"
                    id="video"
                    className="hidden"
                    accept="video/*"
                    onChange={handleVideoChange}
                  />
                  <label
                    htmlFor="video"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    {videoFile ? (
                      <div>
                        <p className="text-sm font-medium mb-1">
                          {videoFile.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Click to upload video
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          MP4, WebM, AVI up to 2GB
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {isUploading && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-sm">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="py-2 px-4 border border-border-color rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              onClick={handleReset}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : `Upload ${contentType === 'course' ? 'Course Video' : 'Video'}`}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default VideoUploadForm;