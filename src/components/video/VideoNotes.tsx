import { useState, useEffect } from 'react';
import { FileText, Download, Eye, Upload, X, Plus } from 'lucide-react';

type Note = {
  id: string;
  title: string;
  content: string;
  fileUrl?: string;
  uploadedAt: string;
  teacherName: string;
};

type VideoNotesProps = {
  videoId: string;
  isTeacher?: boolean;
};

const VideoNotes = ({ videoId, isTeacher = false }: VideoNotesProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    file: null as File | null
  });
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Mock notes data - in a real app, this would come from an API
  useEffect(() => {
    const mockNotes: Note[] = [
      {
        id: '1',
        title: 'Lecture Summary - Introduction to Calculus',
        content: 'Key concepts covered:\n\n1. Limits and Continuity\n- Definition of a limit\n- One-sided limits\n- Continuity at a point\n\n2. Derivatives\n- Definition using limits\n- Power rule\n- Product and quotient rules\n\n3. Applications\n- Finding tangent lines\n- Rate of change problems\n\nHomework: Complete exercises 1-15 on page 87',
        fileUrl: 'https://example.com/calculus-notes.pdf',
        uploadedAt: '2025-01-15T10:30:00.000Z',
        teacherName: 'Math Masters'
      },
      {
        id: '2',
        title: 'Additional Resources',
        content: 'Recommended reading:\n\n- "Calculus Made Easy" by Silvanus P. Thompson\n- Khan Academy Calculus Course\n- MIT OpenCourseWare 18.01\n\nPractice problems available at:\n- Paul\'s Online Math Notes\n- Wolfram Alpha Practice Problems',
        uploadedAt: '2025-01-15T14:20:00.000Z',
        teacherName: 'Math Masters'
      }
    ];
    setNotes(mockNotes);
  }, [videoId]);

  const handleUploadNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      fileUrl: newNote.file ? URL.createObjectURL(newNote.file) : undefined,
      uploadedAt: new Date().toISOString(),
      teacherName: 'Current Teacher' // In real app, get from auth context
    };

    setNotes([note, ...notes]);
    setNewNote({ title: '', content: '', file: null });
    setShowUploadForm(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewNote({ ...newNote, file: e.target.files[0] });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card-bg rounded-lg shadow-md p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center">
          <FileText className="mr-2" size={24} />
          Lecture Notes
        </h3>
        
        {isTeacher && (
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="flex items-center space-x-2 py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition"
          >
            <Plus size={16} />
            <span>Add Notes</span>
          </button>
        )}
      </div>

      {showUploadForm && isTeacher && (
        <div className="bg-background border border-border-color rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Upload New Notes</h4>
            <button
              onClick={() => setShowUploadForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="w-full px-3 py-2 border border-border-color rounded-md bg-card-bg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter note title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-border-color rounded-md bg-card-bg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter note content"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Attach File (Optional)</label>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
                className="w-full px-3 py-2 border border-border-color rounded-md bg-card-bg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {newNote.file && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {newNote.file.name}
                </p>
              )}
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowUploadForm(false)}
                className="py-2 px-4 border border-border-color rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadNote}
                className="py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition"
              >
                Upload Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {notes.length > 0 ? (
        <div className="flex w-full gap-4 mb-6">
          {notes.slice(0, 2).map((note) => (
            <div
              key={note.id}
              className="flex items-center justify-between bg-gray-900 text-white rounded-lg px-6 h-[50px] flex-1 shadow min-w-0"
            >
              <span className="font-semibold text-lg truncate">{note.title}</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedNote(note)}
                  className="hover:text-blue-400"
                  title="View"
                >
                  <Eye size={22} />
                </button>
                {note.fileUrl && (
                  <a
                    href={note.fileUrl}
                    download
                    className="hover:text-blue-400"
                    title="Download"
                  >
                    <Download size={22} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No notes available for this video</p>
          {isTeacher && (
            <p className="text-sm text-gray-400 mt-2">Upload notes to help your students learn better</p>
          )}
        </div>
      )}

      {/* Note Detail Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{selectedNote.title}</h3>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                By {selectedNote.teacherName} • {formatDate(selectedNote.uploadedAt)}
              </p>
              
              <div className="prose dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {selectedNote.content}
                </pre>
              </div>
              
              {selectedNote.fileUrl && (
                <div className="mt-6 pt-4 border-t border-border-color">
                  <a
                    href={selectedNote.fileUrl}
                    download
                    className="flex items-center space-x-2 text-primary hover:text-primary-dark transition"
                  >
                    <Download size={16} />
                    <span>Download Attachment</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoNotes;