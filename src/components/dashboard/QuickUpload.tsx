import { useState } from 'react';
import { Upload, Video, FileText, X } from 'lucide-react';

const QuickUpload = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'video' | 'notes'>('video');
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    file: null as File | null,
    category: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadData({ ...uploadData, file: e.target.files[0] });
    }
  };

  const handleQuickUpload = async () => {
    if (!uploadData.title.trim() || !uploadData.file) {
      alert('Please provide a title and select a file');
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert(`${uploadType === 'video' ? 'Video' : 'Notes'} uploaded successfully!`);
    
    setUploadData({ title: '', description: '', file: null, category: '' });
    setShowUploadModal(false);
    setIsUploading(false);
  };

  return (
    <>
      <div className="bg-card-bg rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Quick Upload</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              setUploadType('video');
              setShowUploadModal(true);
            }}
            className="flex items-center justify-center space-x-3 p-6 border-2 border-dashed border-primary rounded-lg hover:bg-primary/5 transition"
          >
            <Video className="text-primary" size={32} />
            <div className="text-left">
              <h3 className="font-medium">Upload Video</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Share educational content
              </p>
            </div>
          </button>
          
          <button
            onClick={() => {
              setUploadType('notes');
              setShowUploadModal(true);
            }}
            className="flex items-center justify-center space-x-3 p-6 border-2 border-dashed border-green-500 rounded-lg hover:bg-green-500/5 transition"
          >
            <FileText className="text-green-500" size={32} />
            <div className="text-left">
              <h3 className="font-medium">Upload Notes</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Share lecture materials
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  Quick {uploadType === 'video' ? 'Video' : 'Notes'} Upload
                </h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={uploadData.title}
                    onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={`Enter ${uploadType} title`}
                  />
                </div>
                
                {uploadType === 'video' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      value={uploadData.category}
                      onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
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
                      <option value="geography">Geography</option>
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={uploadData.description}
                    onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={`Describe your ${uploadType}`}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">File</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept={uploadType === 'video' ? 'video/*' : '.pdf,.doc,.docx,.txt'}
                    className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {uploadData.file && (
                    <p className="text-sm text-gray-600 mt-1">
                      Selected: {uploadData.file.name}
                    </p>
                  )}
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="py-2 px-4 border border-border-color rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    disabled={isUploading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleQuickUpload}
                    className="py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition disabled:opacity-50"
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickUpload;