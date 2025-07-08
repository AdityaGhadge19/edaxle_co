import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  MessageSquare,
  Download,
  Flag,
  UserPlus,
} from 'lucide-react';
import { useVideos } from '../contexts/VideoContext';
import { useAuth } from '../contexts/AuthContext';
import VideoPlayer from '../components/video/VideoPlayer';
import VideoCard from '../components/video/VideoCard';
import VideoNotes from '../components/video/VideoNotes';
import { formatDistanceToNow } from '../utils/dateUtils';
import { formatCommentTime } from '../utils/dateUtils';
import { formatViewCount } from '../utils/formatUtils';

const VideoPlayerPage = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const { getVideoById, videos, incrementVideoViews, updateVideoStats } = useVideos();
  const { user } = useAuth();
  const [video, setVideo] = useState(getVideoById(videoId || ''));
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [comment, setComment] = useState('');
  const [showNoteTaker, setShowNoteTaker] = useState(false);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<{ time: number; text: string }[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [hasViewBeenCounted, setHasViewBeenCounted] = useState(false);
  const [hasNotes, setHasNotes] = useState(true);
  const [comments, setComments] = useState<any[]>([]);

  // Initialize comments with mock data
  useEffect(() => {
    // Mock comments - in real app, fetch from API
    const mockComments = [
      {
        id: '1',
        user: {
          name: 'Sarah Johnson',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        },
        content: 'This explanation is so clear! Finally understood this concept. Thank you!',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        likes: 24,
        replies: 3,
        isLiked: false,
        showReplies: false,
      },
      {
        id: '2',
        user: {
          name: 'Michael Chen',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        },
        content: 'Could you make a follow-up video about advanced applications of this topic?',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        likes: 8,
        replies: 1,
        isLiked: false,
        showReplies: false,
      },
      {
        id: '3',
        user: {
          name: 'Emma Wilson',
          avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        },
        content: 'The examples you provided really helped me understand the practical applications. Great work!',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        likes: 15,
        replies: 0,
        isLiked: true,
        showReplies: false,
      },
    ];
    
    // Randomly show 0-3 comments to test empty state
    const randomCommentCount = Math.floor(Math.random() * 4); // 0, 1, 2, or 3
    setComments(mockComments.slice(0, randomCommentCount));
  }, [videoId]);

  // Simulate related videos - more videos for better suggestions
  const relatedVideos = videos
    .filter((v: any) => v.id !== videoId && v.category === video?.category)
    .concat(
      videos.filter(
        (v: any) => v.id !== videoId && v.category !== video?.category
      )
    )
    .slice(0, 20);

  useEffect(() => {
    if (videoId) {
      const foundVideo = getVideoById(videoId);
      if (foundVideo) {
        setVideo(foundVideo);
        
        // Reset all states for new video
        setIsLiked(false);
        setIsDisliked(false);
        setIsSaved(false);
        setIsFollowing(Math.random() > 0.5);
        setNotes([]);
        setCurrentProgress(0);
        setIsTheaterMode(false);
        setHasViewBeenCounted(false);
        
        // Start all counts from zero
        setLikeCount(0);
        setDislikeCount(0);
        setViewCount(0);
        setFollowerCount(0);
        
        // Mock check for notes - in real app, check if video has notes from API
        setHasNotes(Math.random() > 0.3); // 70% chance of having notes
      }
    }
  }, [videoId, getVideoById]);

  // Handle view counting when video starts playing
  const handleVideoPlay = async () => {
    if (!hasViewBeenCounted && video && videoId) {
      try {
        await incrementVideoViews(videoId, user?.id);
        setHasViewBeenCounted(true);
        
        // Increment view count from current state
        setViewCount(1);
        
        // Update the video stats in context
        if (video) {
          updateVideoStats(video.id, { views: 1 });
        }
      } catch (error) {
        console.error('Error counting view:', error);
      }
    }
  };

  const handleLike = () => {
    let newLikeCount;
    
    if (isLiked) {
      // User is unliking the video
      newLikeCount = likeCount - 1;
      setLikeCount(newLikeCount);
      setIsLiked(false);
    } else {
      // User is liking the video
      newLikeCount = likeCount + 1;
      setLikeCount(newLikeCount);
      setIsLiked(true);
      
      // If user was disliking, remove the dislike
      if (isDisliked) {
        setIsDisliked(false);
      }
    }
  };

  const handleDislike = () => {
    if (isDisliked) {
      // User is removing dislike
      setDislikeCount(prev => prev - 1);
      setIsDisliked(false);
    } else {
      // User is disliking the video
      setDislikeCount(prev => prev + 1);
      setIsDisliked(true);
      
      // If user was liking, remove the like
      if (isLiked) {
        setLikeCount(prev => prev - 1);
        setIsLiked(false);
      }
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleFollow = () => {
    if (isFollowing) {
      // Unfollow
      setFollowerCount(prev => prev - 1);
      setIsFollowing(false);
    } else {
      // Follow
      setFollowerCount(prev => prev + 1);
      setIsFollowing(true);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video?.title,
        text: video?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleAddNote = () => {
    if (note.trim()) {
      setNotes([...notes, { time: currentProgress, text: note }]);
      setNote('');
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() && user) {
      const newComment = {
        id: Date.now().toString(),
        user: {
          name: user.name,
          avatar: user.avatar || 'https://randomuser.me/api/portraits/men/1.jpg',
        },
        content: comment,
        timestamp: new Date().toISOString(),
        likes: 0,
        replies: 0,
        isLiked: false,
        showReplies: false,
      };
      
      setComments([newComment, ...comments]);
      setComment('');
      
      // Update comment count in video stats
      if (video) {
        const newCommentCount = comments.length + 1;
        updateVideoStats(video.id, { commentCount: newCommentCount });
      }
    }
  };

  const handleCommentLike = (commentId: string) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
            }
          : comment
      )
    );
  };

  const handleShowReplies = (commentId: string) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === commentId
          ? { ...comment, showReplies: !comment.showReplies }
          : comment
      )
    );
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      setComments(prevComments => 
        prevComments.filter(comment => comment.id !== commentId)
      );
      
      // Update comment count in video stats
      if (video) {
        const newCommentCount = comments.length - 1;
        updateVideoStats(video.id, { commentCount: newCommentCount });
      }
    }
  };

  const handleProgress = (progress: number) => {
    setCurrentProgress(progress);
  };

  const handleTheaterModeToggle = () => {
    setIsTheaterMode(!isTheaterMode);
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Video not found</h2>
          <p className="text-gray-600 dark:text-gray-400">
            The video you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div
        className={`grid gap-8 pt-4 px-2 md:px-6 w-full max-w-[1500px] ${
          isTheaterMode
            ? 'grid-cols-1'
            : 'grid-cols-1 lg:grid-cols-[minmax(0,1fr)_370px]'
        }`}
      >
        {/* Main Content Column */}
        <div
          className="flex flex-col items-center w-full max-w-4xl mx-auto"
          style={{
            marginLeft: '-0.5rem',
            marginTop: '1.5rem',
          }}
        >
          {/* Video Player */}
          <div
            className={`w-full bg-black rounded-lg overflow-hidden ${
              isTheaterMode
                ? '-ml-6 -mt-6 md:-ml-10 md:-mt-10'
                : '-ml-6 -mt-6 md:-ml-10 md:-mt-10 aspect-video'
            }`}
            style={{
              maxWidth: 'calc(100% + 2.5rem)',
              maxHeight: 'calc(100% + 2.5rem)',
            }}
          >
            <VideoPlayer
              videoUrl={video.videoUrl}
              title={video.title}
              onProgress={handleProgress}
              isTheaterMode={isTheaterMode}
              onTheaterModeToggle={handleTheaterModeToggle}
              onPlay={handleVideoPlay}
            />
          </div>

          {/* Video Info Section */}
          <div
            className="pt-4 w-full"
            style={{
              paddingRight: '1.5rem',
              marginLeft: '-1rem',
            }}
          >
            <h1 className="text-xl md:text-2xl font-bold mb-2">
              {video.title}
            </h1>
            <div className="flex flex-wrap justify-between items-center mb-3 gap-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formatViewCount(viewCount)} views •{' '}
                {formatDistanceToNow(video.createdAt)}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  style={{
                    border: '1px solid #1E90FF',
                  }}
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition ${
                    isLiked
                      ? 'text-[#1E90FF] bg-[#1E90FF]/10'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <ThumbsUp size={16} />
                  <span>{formatViewCount(likeCount)}</span>
                </button>
                <button
                  style={{
                    border: '1px solid #1E90FF',
                  }}
                  onClick={handleDislike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition ${
                    isDisliked
                      ? 'text-red-500 bg-red-500/10'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <ThumbsDown size={16} />
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
                <button
                  onClick={handleSave}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition ${
                    isSaved
                      ? 'text-[#1E90FF] bg-[#1E90FF]/10'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Bookmark size={16} />
                  <span>Save</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                  <Download size={16} />
                  <span>Download</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                  <Flag size={16} />
                </button>
              </div>
            </div>
            <hr className="border-border-color my-3" />

            {/* Channel Info */}
            <div
              className="flex items-start justify-between mb-4"
              style={{ marginTop: '1.5rem' }}
            >
              <div className="flex items-start space-x-4">
                <Link
                  to={`/teacher/${video.author.name
                    .replace(/\s+/g, '-')
                    .toLowerCase()}`}
                >
                  <img
                    src={video.author.avatar}
                    alt={video.author.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </Link>
                <div>
                  <Link
                    to={`/teacher/${video.author.name
                      .replace(/\s+/g, '-')
                      .toLowerCase()}`}
                    className="font-medium hover:text-[#1E90FF] transition block"
                  >
                    {video.author.name}
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatViewCount(followerCount)} followers
                  </p>
                </div>
              </div>
              {user && user.name !== video.author.name && (
                <button
                  onClick={handleFollow}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-full font-medium transition ${
                    isFollowing
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      : 'bg-[#1E90FF] text-white hover:bg-[#1E90FF]/90'
                  }`}
                >
                  <UserPlus size={16} />
                  <span>{isFollowing ? 'Following' : 'Follow'}</span>
                </button>
              )}
            </div>

            {/* Description */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <div className={`${showDescription ? '' : 'line-clamp-3'}`}>
                <p className="whitespace-pre-line">{video.description}</p>
              </div>
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="text-[#1E90FF] hover:underline mt-2 text-sm font-medium"
              >
                {showDescription ? 'Show less' : 'Show more'}
              </button>
            </div>

            {/* Note Taker */}
            <button
              onClick={() => setShowNoteTaker(!showNoteTaker)}
              className="py-2 px-4 bg-[#1E90FF] text-white rounded-md hover:bg-[#1E90FF]/90 transition mb-6"
            >
              {showNoteTaker ? 'Hide Note Taker' : 'Take Notes'}
            </button>

            {showNoteTaker && (
              <div className="bg-card-bg border border-border-color rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-2">
                  Notes at {formatDuration(currentProgress)}
                </h3>
                <div className="flex space-x-2 mb-4">
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="flex-1 px-3 py-2 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                    placeholder="Add a note at current timestamp"
                  />
                  <button
                    onClick={handleAddNote}
                    className="py-2 px-4 bg-[#1E90FF] text-white rounded-md hover:bg-[#1E90FF]/90 transition"
                  >
                    Add
                  </button>
                </div>
                {notes.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Your Notes:</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {notes.map((note, index) => (
                        <div
                          key={index}
                          className="bg-background p-2 rounded-md"
                        >
                          <div className="flex justify-between">
                            <span className="text-xs text-[#1E90FF] font-medium">
                              {formatDuration(note.time)}
                            </span>
                            <button
                              onClick={() =>
                                setNotes(notes.filter((_, i) => i !== index))
                              }
                              className="text-xs text-red-500"
                            >
                              Delete
                            </button>
                          </div>
                          <p className="text-sm mt-1">{note.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Teacher Notes Section - Only show if video has notes */}
            {hasNotes && (
              <VideoNotes
                videoId={video.id}
                isTeacher={user?.role === 'teacher'}
              />
            )}

            {/* Comments Section */}
            <div className="mb-6 mt-6">
              <h3 className="font-medium mb-4 flex items-center">
                <MessageSquare size={20} className="mr-2" />
                {comments.length} Comments
              </h3>
              {user && (
                <form onSubmit={handleSubmitComment} className="mb-6">
                  <div className="flex space-x-3">
                    <img
                      src={
                        user.avatar ||
                        'https://randomuser.me/api/portraits/men/1.jpg'
                      }
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-0 py-2 border-0 border-b-2 border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:border-[#1E90FF] placeholder-gray-500"
                        placeholder="Add a comment..."
                      />
                      {comment && (
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            type="button"
                            onClick={() => setComment('')}
                            className="py-1 px-3 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="py-1 px-3 text-sm bg-[#1E90FF] text-white rounded hover:bg-[#1E90FF]/90 transition disabled:opacity-50"
                            disabled={!comment.trim()}
                          >
                            Comment
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              )}
              
              {/* Sort Comments */}
              {comments.length > 0 && (
                <div className="mb-4">
                  <select 
                    className="text-sm bg-transparent border-none focus:outline-none text-gray-600 dark:text-gray-400"
                    onChange={(e) => {
                      const sortType = e.target.value;
                      if (sortType === 'newest') {
                        setComments([...comments].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
                      } else if (sortType === 'top') {
                        setComments([...comments].sort((a, b) => b.likes - a.likes));
                      }
                    }}
                  >
                    <option value="top">Top comments</option>
                    <option value="newest">Newest first</option>
                  </select>
                </div>
              )}

              {/* Comments List */}
              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3 group">
                      <img
                        src={comment.user.avatar}
                        alt={comment.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-sm">
                            {comment.user.name}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {formatCommentTime(comment.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm mb-2">{comment.content}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <button
                            onClick={() => handleCommentLike(comment.id)}
                            className={`flex items-center space-x-1 hover:text-[#1E90FF] transition ${
                              comment.isLiked ? 'text-[#1E90FF]' : ''
                            }`}
                          >
                            <ThumbsUp size={14} />
                            {comment.likes > 0 && <span>{comment.likes}</span>}
                          </button>
                          <button className="flex items-center space-x-1 hover:text-[#1E90FF] transition">
                            <ThumbsDown size={14} />
                          </button>
                          <button className="hover:text-[#1E90FF] transition">
                            Reply
                          </button>
                          {/* Show more options on hover */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="hover:text-[#1E90FF] transition text-xs">
                              ⋮
                            </button>
                          </div>
                          {comment.replies > 0 && (
                            <button className="text-[#1E90FF] hover:underline">
                              ↳ {comment.replies} {comment.replies === 1 ? 'reply' : 'replies'}
                            </button>
                          )}
                        </div>
                        
                        {/* Reply Section (expandable) */}
                        {comment.showReplies && (
                          <div className="mt-3 ml-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                            <div className="space-y-3">
                              {/* Mock replies */}
                              <div className="flex space-x-2">
                                <img
                                  src="https://randomuser.me/api/portraits/women/25.jpg"
                                  alt="Reply user"
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h5 className="font-medium text-xs">Jane Doe</h5>
                                    <span className="text-xs text-gray-500">1 day ago</span>
                                  </div>
                                  <p className="text-xs">Thanks for the explanation!</p>
                                  <div className="flex items-center space-x-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
                                    <button className="flex items-center space-x-1 hover:text-[#1E90FF] transition">
                                      <ThumbsUp size={12} />
                                      <span>2</span>
                                    </button>
                                    <button className="flex items-center space-x-1 hover:text-[#1E90FF] transition">
                                      <ThumbsDown size={12} />
                                    </button>
                                    <button className="hover:text-[#1E90FF] transition">Reply</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Add reply form */}
                            {user && (
                              <div className="mt-3 flex space-x-2">
                                <img
                                  src={user.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
                                  alt={user.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                  <input
                                    type="text"
                                    className="w-full px-0 py-1 border-0 border-b border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:border-[#1E90FF] text-xs placeholder-gray-500"
                                    placeholder="Add a reply..."
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Be the first one to comment!</p>
                  <p className="text-sm">Share your thoughts about this video.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Videos Sidebar - Only show when not in theater mode */}
        {!isTheaterMode && (
          <div
            className="hidden lg:block w-[370px]"
            style={{ marginTop: '-1rem' }}
          >
            <h3 className="font-medium mb-4">Up Next</h3>
            <div className="space-y-3">
              {relatedVideos.slice(0, 10).map((relatedVideo) => (
                <div
                  key={relatedVideo.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition cursor-pointer"
                >
                  <Link to={`/video/${relatedVideo.id}`} className="block">
                    <div className="relative mb-2">
                      <img
                        src={relatedVideo.thumbnailUrl}
                        alt={relatedVideo.title}
                        className="w-full aspect-video object-cover rounded"
                      />
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                        {formatDuration(relatedVideo.duration)}
                      </div>
                    </div>
                    <h4 className="text-sm font-medium line-clamp-2 hover:text-[#1E90FF] transition mb-1">
                      {relatedVideo.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {relatedVideo.author.name}
                    </p>
                    <div className="text-xs text-gray-500">
                      <span>{formatViewCount(relatedVideo.views)} views</span>
                      <span className="mx-1">•</span>
                      <span>{formatDistanceToNow(relatedVideo.createdAt)}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayerPage;