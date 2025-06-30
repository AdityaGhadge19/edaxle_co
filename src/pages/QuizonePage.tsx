import { useState, useEffect } from 'react';
import { 
  Brain, Search, Filter, Clock, Users, Star, 
  Play, Trophy, Target, BookOpen, Award, ChevronRight,
  CheckCircle, XCircle, Timer, RotateCcw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Quiz = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // in minutes
  questionCount: number;
  attempts: number;
  averageScore: number;
  tags: string[];
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  isCompleted?: boolean;
  userScore?: number;
};

type Question = {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'fill-in-blank';
  options?: string[];
  correctAnswer: number | string;
  explanation: string;
  userAnswer?: number | string;
  isCorrect?: boolean;
};

type QuizAttempt = {
  quizId: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  completedAt: string;
};

const QuizonePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'browse' | 'my-quizzes' | 'results'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | string)[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizResults, setQuizResults] = useState<QuizAttempt[]>([]);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'biology', name: 'Biology' },
    { id: 'computer_science', name: 'Computer Science' },
    { id: 'history', name: 'History' },
    { id: 'literature', name: 'Literature' },
    { id: 'languages', name: 'Languages' }
  ];

  // Mock quiz data
  useEffect(() => {
    const mockQuizzes: Quiz[] = [
      {
        id: '1',
        title: 'Calculus Fundamentals',
        description: 'Test your understanding of basic calculus concepts including limits and derivatives.',
        category: 'mathematics',
        difficulty: 'medium',
        timeLimit: 30,
        questionCount: 15,
        attempts: 1250,
        averageScore: 78,
        tags: ['calculus', 'derivatives', 'limits'],
        author: {
          id: '1',
          name: 'Dr. Sarah Mathematics',
          avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        createdAt: '2025-01-10T10:00:00Z'
      },
      {
        id: '2',
        title: 'Quantum Physics Basics',
        description: 'Challenge yourself with fundamental quantum mechanics concepts.',
        category: 'physics',
        difficulty: 'hard',
        timeLimit: 45,
        questionCount: 20,
        attempts: 890,
        averageScore: 65,
        tags: ['quantum', 'uncertainty', 'wave-particle'],
        author: {
          id: '2',
          name: 'Prof. Michael Physics',
          avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        createdAt: '2025-01-08T14:30:00Z'
      },
      {
        id: '3',
        title: 'Organic Chemistry Structures',
        description: 'Test your knowledge of organic molecular structures and naming conventions.',
        category: 'chemistry',
        difficulty: 'medium',
        timeLimit: 25,
        questionCount: 12,
        attempts: 670,
        averageScore: 72,
        tags: ['organic', 'structures', 'functional groups'],
        author: {
          id: '3',
          name: 'Dr. Emily Chemistry',
          avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        createdAt: '2025-01-12T09:15:00Z'
      },
      {
        id: '4',
        title: 'Python Programming Basics',
        description: 'Fundamental Python concepts for beginners.',
        category: 'computer_science',
        difficulty: 'easy',
        timeLimit: 20,
        questionCount: 10,
        attempts: 2100,
        averageScore: 85,
        tags: ['python', 'programming', 'basics'],
        author: {
          id: '4',
          name: 'Code Master',
          avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        createdAt: '2025-01-14T16:45:00Z'
      },
      {
        id: '5',
        title: 'World War II History',
        description: 'Test your knowledge of major WWII events and figures.',
        category: 'history',
        difficulty: 'medium',
        timeLimit: 35,
        questionCount: 18,
        attempts: 1450,
        averageScore: 76,
        tags: ['world war 2', 'history', 'events'],
        author: {
          id: '5',
          name: 'History Prof',
          avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        createdAt: '2025-01-06T11:20:00Z'
      }
    ];

    setQuizzes(mockQuizzes);

    // Mock user quiz results
    const mockResults: QuizAttempt[] = [
      {
        quizId: '1',
        score: 12,
        totalQuestions: 15,
        timeSpent: 25,
        completedAt: '2025-01-15T14:30:00Z'
      },
      {
        quizId: '4',
        score: 9,
        totalQuestions: 10,
        timeSpent: 15,
        completedAt: '2025-01-14T10:15:00Z'
      }
    ];

    setQuizResults(mockResults);
  }, []);

  // Mock questions for a quiz
  const mockQuestions: Question[] = [
    {
      id: '1',
      question: 'What is the derivative of x²?',
      type: 'multiple-choice',
      options: ['2x', 'x', '2', 'x²'],
      correctAnswer: 0,
      explanation: 'Using the power rule: d/dx(x²) = 2x¹ = 2x'
    },
    {
      id: '2',
      question: 'What is the limit of (x² - 1)/(x - 1) as x approaches 1?',
      type: 'multiple-choice',
      options: ['0', '1', '2', 'undefined'],
      correctAnswer: 2,
      explanation: 'Factor the numerator: (x-1)(x+1)/(x-1) = x+1, so limit is 1+1 = 2'
    },
    {
      id: '3',
      question: 'The derivative represents the _____ of a function.',
      type: 'fill-in-blank',
      correctAnswer: 'slope',
      explanation: 'The derivative gives the instantaneous rate of change or slope of the tangent line.'
    }
  ];

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (quizStarted && timeRemaining > 0 && !quizCompleted) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [quizStarted, timeRemaining, quizCompleted]);

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || quiz.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || quiz.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestions(mockQuestions); // In real app, fetch questions for this quiz
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTimeRemaining(quiz.timeLimit * 60);
    setQuizStarted(true);
    setQuizCompleted(false);
  };

  const handleAnswerSelect = (answer: number | string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    if (!currentQuiz) return;

    // Calculate score
    let correctAnswers = 0;
    currentQuestions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const newResult: QuizAttempt = {
      quizId: currentQuiz.id,
      score: correctAnswers,
      totalQuestions: currentQuestions.length,
      timeSpent: (currentQuiz.timeLimit * 60) - timeRemaining,
      completedAt: new Date().toISOString()
    };

    setQuizResults([newResult, ...quizResults]);
    setQuizCompleted(true);
    setQuizStarted(false);
  };

  const handleRetakeQuiz = () => {
    if (currentQuiz) {
      handleStartQuiz(currentQuiz);
    }
  };

  const handleExitQuiz = () => {
    setCurrentQuiz(null);
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
  };

  if (quizStarted && currentQuiz) {
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;

    return (
      <div className="max-w-4xl mx-auto">
        {/* Quiz Header */}
        <div className="bg-card-bg rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{currentQuiz.title}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-red-600">
                <Timer size={20} />
                <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
              </div>
              <button
                onClick={handleExitQuiz}
                className="py-2 px-4 border border-border-color rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Exit Quiz
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Question {currentQuestionIndex + 1} of {currentQuestions.length}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-card-bg rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-medium mb-6">{currentQuestion.question}</h2>
          
          {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 border-2 rounded-lg transition ${
                    userAnswers[currentQuestionIndex] === index
                      ? 'border-primary bg-primary/10'
                      : 'border-border-color hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      userAnswers[currentQuestionIndex] === index
                        ? 'border-primary bg-primary'
                        : 'border-gray-300'
                    }`}>
                      {userAnswers[currentQuestionIndex] === index && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {currentQuestion.type === 'fill-in-blank' && (
            <input
              type="text"
              value={userAnswers[currentQuestionIndex] || ''}
              onChange={(e) => handleAnswerSelect(e.target.value)}
              className="w-full px-4 py-3 border-2 border-border-color rounded-lg focus:outline-none focus:border-primary"
              placeholder="Type your answer here..."
            />
          )}
          
          {currentQuestion.type === 'true-false' && (
            <div className="space-y-3">
              {['True', 'False'].map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 border-2 rounded-lg transition ${
                    userAnswers[currentQuestionIndex] === index
                      ? 'border-primary bg-primary/10'
                      : 'border-border-color hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      userAnswers[currentQuestionIndex] === index
                        ? 'border-primary bg-primary'
                        : 'border-gray-300'
                    }`}>
                      {userAnswers[currentQuestionIndex] === index && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="py-2 px-4 border border-border-color rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex space-x-2">
            {currentQuestionIndex === currentQuestions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                className="py-2 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted && currentQuiz) {
    const result = quizResults[0];
    const percentage = Math.round((result.score / result.totalQuestions) * 100);
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-card-bg rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            {percentage >= 80 ? (
              <Trophy size={64} className="mx-auto text-yellow-500 mb-4" />
            ) : percentage >= 60 ? (
              <Award size={64} className="mx-auto text-blue-500 mb-4" />
            ) : (
              <Target size={64} className="mx-auto text-gray-500 mb-4" />
            )}
            
            <h1 className="text-3xl font-bold mb-2">Quiz Completed!</h1>
            <h2 className="text-xl text-gray-600 dark:text-gray-400">{currentQuiz.title}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-background rounded-lg p-4">
              <div className="text-3xl font-bold text-primary">{percentage}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
            </div>
            <div className="bg-background rounded-lg p-4">
              <div className="text-3xl font-bold text-green-600">{result.score}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Correct Answers</div>
            </div>
            <div className="bg-background rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-600">{formatTime(result.timeSpent)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Time Spent</div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleRetakeQuiz}
              className="flex items-center space-x-2 py-2 px-6 bg-primary text-white rounded-md hover:bg-primary-dark transition"
            >
              <RotateCcw size={16} />
              <span>Retake Quiz</span>
            </button>
            <button
              onClick={handleExitQuiz}
              className="py-2 px-6 border border-border-color rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <Brain className="mr-3" size={32} />
            Quizone
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Test your knowledge with interactive quizzes
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('browse')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
            activeTab === 'browse'
              ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-primary'
          }`}
        >
          Browse Quizzes
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
            activeTab === 'results'
              ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-primary'
          }`}
        >
          My Results ({quizResults.length})
        </button>
      </div>

      {activeTab === 'browse' && (
        <>
          {/* Search and Filters */}
          <div className="bg-card-bg rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search quizzes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
              
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-border-color rounded-md bg-card-bg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Quiz Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <div key={quiz.id} className="bg-card-bg rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                        {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                      </span>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Clock size={14} />
                        <span>{quiz.timeLimit}m</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Star size={14} />
                      <span>{quiz.averageScore}%</span>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2">{quiz.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {quiz.description}
                  </p>
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src={quiz.author.avatar}
                      alt={quiz.author.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-sm font-medium">{quiz.author.name}</div>
                      <div className="text-xs text-gray-500">{quiz.questionCount} questions</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {quiz.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2  py-1 bg-primary/10 text-primary rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Users size={14} />
                      <span>{quiz.attempts.toLocaleString()} attempts</span>
                    </div>
                    
                    <button
                      onClick={() => handleStartQuiz(quiz)}
                      className="flex items-center space-x-2 py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition"
                    >
                      <Play size={16} />
                      <span>Start Quiz</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredQuizzes.length === 0 && (
            <div className="text-center py-12">
              <Brain size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No quizzes found matching your criteria</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'results' && (
        <div className="bg-card-bg rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Quiz Results</h2>
          
          {quizResults.length > 0 ? (
            <div className="space-y-4">
              {quizResults.map((result, index) => {
                const quiz = quizzes.find(q => q.id === result.quizId);
                const percentage = Math.round((result.score / result.totalQuestions) * 100);
                
                return (
                  <div key={index} className="border border-border-color rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">{quiz?.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span>Completed: {new Date(result.completedAt).toLocaleDateString()}</span>
                          <span>Time: {formatTime(result.timeSpent)}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          percentage >= 80 ? 'text-green-600' :
                          percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {percentage}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {result.score}/{result.totalQuestions} correct
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-4">
                        <div
                          className={`h-2 rounded-full ${
                            percentage >= 80 ? 'bg-green-500' :
                            percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      
                      <button
                        onClick={() => quiz && handleStartQuiz(quiz)}
                        className="flex items-center space-x-1 text-primary hover:text-primary-dark transition"
                      >
                        <RotateCcw size={14} />
                        <span>Retake</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">No quiz results yet</p>
              <button
                onClick={() => setActiveTab('browse')}
                className="py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition"
              >
                Take Your First Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizonePage;