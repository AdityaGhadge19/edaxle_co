import { useState, useEffect } from 'react';
import { 
  HardDrive, Plus, Search, Download, Upload, Trash2, 
  FileText, Image, Video, File, Folder, FolderOpen,
  Star, Clock, Tag, Filter, Grid, List, Eye, Edit3, X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type FileItem = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  fileType?: 'text' | 'image' | 'video' | 'pdf' | 'other';
  size: number;
  createdAt: string;
  modifiedAt: string;
  content?: string;
  tags: string[];
  isStarred: boolean;
  parentId?: string;
};

const LearnVaultPage = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name');
  const [filterBy, setFilterBy] = useState<'all' | 'starred' | 'recent'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' });
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageLimit] = useState(15 * 1024 * 1024 * 1024); // 15GB in bytes

  // Mock data for demonstration
  useEffect(() => {
    const mockFiles: FileItem[] = [
      {
        id: '1',
        name: 'Mathematics Notes',
        type: 'folder',
        size: 0,
        createdAt: '2025-01-10T10:00:00Z',
        modifiedAt: '2025-01-15T14:30:00Z',
        tags: ['mathematics', 'calculus'],
        isStarred: true
      },
      {
        id: '2',
        name: 'Physics Formulas',
        type: 'file',
        fileType: 'text',
        size: 2048,
        createdAt: '2025-01-12T09:15:00Z',
        modifiedAt: '2025-01-12T09:15:00Z',
        content: 'Newton\'s Laws:\n1. F = ma\n2. Every action has an equal and opposite reaction\n3. An object at rest stays at rest...',
        tags: ['physics', 'formulas', 'newton'],
        isStarred: false
      },
      {
        id: '3',
        name: 'Chemistry Lab Report',
        type: 'file',
        fileType: 'pdf',
        size: 1024000,
        createdAt: '2025-01-08T16:20:00Z',
        modifiedAt: '2025-01-08T16:20:00Z',
        tags: ['chemistry', 'lab', 'report'],
        isStarred: true
      },
      {
        id: '4',
        name: 'Study Schedule',
        type: 'file',
        fileType: 'text',
        size: 512,
        createdAt: '2025-01-05T08:00:00Z',
        modifiedAt: '2025-01-14T20:00:00Z',
        content: 'Weekly Study Schedule:\nMonday: Mathematics (2 hours)\nTuesday: Physics (2 hours)\nWednesday: Chemistry (2 hours)...',
        tags: ['schedule', 'planning', 'study'],
        isStarred: false
      },
      {
        id: '5',
        name: 'Calculus Derivatives',
        type: 'file',
        fileType: 'text',
        size: 3072,
        createdAt: '2025-01-11T11:30:00Z',
        modifiedAt: '2025-01-11T11:30:00Z',
        content: 'Derivative Rules:\n1. Power Rule: d/dx(x^n) = nx^(n-1)\n2. Product Rule: d/dx(uv) = u\'v + uv\'...',
        tags: ['calculus', 'derivatives', 'mathematics'],
        isStarred: true,
        parentId: '1'
      }
    ];
    
    setFiles(mockFiles);
    
    // Calculate storage used
    const totalSize = mockFiles.reduce((sum, file) => sum + file.size, 0);
    setStorageUsed(totalSize);
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return currentFolder === file.id ? <FolderOpen size={20} /> : <Folder size={20} />;
    }
    
    switch (file.fileType) {
      case 'text':
        return <FileText size={20} />;
      case 'image':
        return <Image size={20} />;
      case 'video':
        return <Video size={20} />;
      case 'pdf':
        return <File size={20} className="text-red-500" />;
      default:
        return <File size={20} />;
    }
  };

  const filteredFiles = files
    .filter(file => {
      // Filter by current folder
      if (currentFolder) {
        return file.parentId === currentFolder;
      } else {
        return !file.parentId;
      }
    })
    .filter(file => {
      // Filter by search query
      if (searchQuery) {
        return file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      return true;
    })
    .filter(file => {
      // Filter by type
      switch (filterBy) {
        case 'starred':
          return file.isStarred;
        case 'recent':
          const threeDaysAgo = new Date();
          threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
          return new Date(file.modifiedAt) > threeDaysAgo;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime();
        case 'size':
          return b.size - a.size;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: FileItem = {
        id: Date.now().toString(),
        name: newFolderName,
        type: 'folder',
        size: 0,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
        tags: [],
        isStarred: false,
        parentId: currentFolder || undefined
      };
      
      setFiles([...files, newFolder]);
      setNewFolderName('');
      setShowCreateFolder(false);
    }
  };

  const handleCreateNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const noteFile: FileItem = {
        id: Date.now().toString(),
        name: newNote.title,
        type: 'file',
        fileType: 'text',
        size: new Blob([newNote.content]).size,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
        content: newNote.content,
        tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        isStarred: false,
        parentId: currentFolder || undefined
      };
      
      setFiles([...files, noteFile]);
      setStorageUsed(prev => prev + noteFile.size);
      setNewNote({ title: '', content: '', tags: '' });
      setShowNoteEditor(false);
    }
  };

  const handleToggleStar = (fileId: string) => {
    setFiles(files.map(file => 
      file.id === fileId ? { ...file, isStarred: !file.isStarred } : file
    ));
  };

  const handleDeleteFile = (fileId: string) => {
    const fileToDelete = files.find(f => f.id === fileId);
    if (fileToDelete && window.confirm(`Are you sure you want to delete "${fileToDelete.name}"?`)) {
      setFiles(files.filter(file => file.id !== fileId && file.parentId !== fileId));
      setStorageUsed(prev => prev - fileToDelete.size);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || []);
    
    uploadedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const newFile: FileItem = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: 'file',
          fileType: file.type.startsWith('image/') ? 'image' : 
                   file.type.startsWith('video/') ? 'video' :
                   file.type === 'application/pdf' ? 'pdf' : 'other',
          size: file.size,
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
          content: file.type.startsWith('text/') ? reader.result as string : undefined,
          tags: [],
          isStarred: false,
          parentId: currentFolder || undefined
        };
        
        setFiles(prev => [...prev, newFile]);
        setStorageUsed(prev => prev + file.size);
      };
      
      if (file.type.startsWith('text/')) {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });
    
    setShowUploadModal(false);
  };

  const storagePercentage = (storageUsed / storageLimit) * 100;

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <HardDrive className="mr-3" size={32} />
            Learn Vault
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Your personal storage for notes and study materials (15GB free)
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowCreateFolder(true)}
            className="flex items-center space-x-2 py-2 px-4 border border-border-color rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Folder size={16} />
            <span>New Folder</span>
          </button>
          
          <button
            onClick={() => setShowNoteEditor(true)}
            className="flex items-center space-x-2 py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition"
          >
            <Plus size={16} />
            <span>New Note</span>
          </button>
          
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center space-x-2 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            <Upload size={16} />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Storage Usage */}
      <div className="bg-card-bg rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Storage Used</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {formatFileSize(storageUsed)} / {formatFileSize(storageLimit)}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              storagePercentage > 90 ? 'bg-red-500' : 
              storagePercentage > 70 ? 'bg-yellow-500' : 'bg-primary'
            }`}
            style={{ width: `${Math.min(storagePercentage, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {storagePercentage.toFixed(1)}% used
        </p>
      </div>

      {/* Navigation and Controls */}
      <div className="bg-card-bg rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 flex-1">
            <button
              onClick={() => setCurrentFolder(null)}
              className={`text-sm ${!currentFolder ? 'text-primary font-medium' : 'text-gray-600 hover:text-primary'}`}
            >
              Home
            </button>
            {currentFolder && (
              <>
                <span className="text-gray-400">/</span>
                <span className="text-sm text-primary font-medium">
                  {files.find(f => f.id === currentFolder)?.name}
                </span>
              </>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 px-4 py-2 pl-10 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="px-3 py-2 border border-border-color rounded-md bg-card-bg text-sm"
            >
              <option value="all">All Files</option>
              <option value="starred">Starred</option>
              <option value="recent">Recent</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-border-color rounded-md bg-card-bg text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
              <option value="size">Sort by Size</option>
            </select>

            <div className="flex border border-border-color rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Files and Folders */}
      <div className="bg-card-bg rounded-lg shadow-md p-6">
        {filteredFiles.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="border border-border-color rounded-lg p-4 hover:shadow-md transition cursor-pointer group"
                  onClick={() => {
                    if (file.type === 'folder') {
                      setCurrentFolder(file.id);
                    } else {
                      setSelectedFile(file);
                    }
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-gray-600 dark:text-gray-400">
                      {getFileIcon(file)}
                    </div>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStar(file.id);
                        }}
                        className={`p-1 rounded ${file.isStarred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                      >
                        <Star size={14} fill={file.isStarred ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFile(file.id);
                        }}
                        className="p-1 rounded text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">{file.name}</h3>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>{formatFileSize(file.size)}</div>
                    <div>{formatDate(file.modifiedAt)}</div>
                  </div>
                  
                  {file.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {file.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-1 py-0.5 bg-primary/10 text-primary text-xs rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                      {file.tags.length > 2 && (
                        <span className="text-xs text-gray-400">+{file.tags.length - 2}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center space-x-4 p-3 border border-border-color rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer group"
                  onClick={() => {
                    if (file.type === 'folder') {
                      setCurrentFolder(file.id);
                    } else {
                      setSelectedFile(file);
                    }
                  }}
                >
                  <div className="text-gray-600 dark:text-gray-400">
                    {getFileIcon(file)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{file.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{formatDate(file.modifiedAt)}</span>
                      {file.tags.length > 0 && (
                        <div className="flex space-x-1">
                          {file.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="text-primary">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStar(file.id);
                      }}
                      className={`p-2 rounded ${file.isStarred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                    >
                      <Star size={16} fill={file.isStarred ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(file.id);
                      }}
                      className="p-2 rounded text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <HardDrive size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No files found matching your search' : 'No files in this folder'}
            </p>
          </div>
        )}
      </div>

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Create New Folder</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateFolder(false)}
                className="py-2 px-4 border border-border-color rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                className="py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Note Editor Modal */}
      {showNoteEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Create New Note</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                placeholder="Note title"
                className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                placeholder="Write your note here..."
                rows={10}
                className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                value={newNote.tags}
                onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                placeholder="Tags (comma separated)"
                className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowNoteEditor(false)}
                className="py-2 px-4 border border-border-color rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNote}
                className="py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Upload Files</h3>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="w-full px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="py-2 px-4 border border-border-color rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Viewer Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{selectedFile.name}</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {formatFileSize(selectedFile.size)} • {formatDate(selectedFile.modifiedAt)}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              {selectedFile.content && (
                <div className="bg-background border border-border-color rounded-lg p-4 mb-4">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {selectedFile.content}
                  </pre>
                </div>
              )}
              
              {selectedFile.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedFile.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleToggleStar(selectedFile.id)}
                  className={`flex items-center space-x-2 py-2 px-4 border border-border-color rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                    selectedFile.isStarred ? 'text-yellow-500' : ''
                  }`}
                >
                  <Star size={16} fill={selectedFile.isStarred ? 'currentColor' : 'none'} />
                  <span>{selectedFile.isStarred ? 'Unstar' : 'Star'}</span>
                </button>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnVaultPage;