// Sample data for MongoDB seeding
export const sampleUsers = [
  {
    name: 'Dr. Sarah Mathematics',
    email: 'sarah.math@learnone.com',
    password: 'password123',
    role: 'teacher',
    avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Mathematics professor with 15+ years of experience. Specializing in calculus, linear algebra, and advanced mathematics.',
    subjects: ['Mathematics', 'Calculus', 'Linear Algebra', 'Statistics'],
    isVerified: true,
    location: 'MIT, Boston',
    website: 'https://sarahmath.edu'
  },
  {
    name: 'Prof. Michael Physics',
    email: 'michael.physics@learnone.com',
    password: 'password123',
    role: 'teacher',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Quantum physics researcher and educator. Making complex physics concepts accessible to everyone.',
    subjects: ['Physics', 'Quantum Mechanics', 'Thermodynamics', 'Electromagnetism'],
    isVerified: true,
    location: 'Stanford University',
    website: 'https://michaelphysics.edu'
  },
  {
    name: 'Dr. Emily Chemistry',
    email: 'emily.chem@learnone.com',
    password: 'password123',
    role: 'teacher',
    avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Organic chemistry specialist with a passion for laboratory experiments and molecular structures.',
    subjects: ['Chemistry', 'Organic Chemistry', 'Biochemistry', 'Laboratory Techniques'],
    isVerified: true,
    location: 'Harvard University',
    website: 'https://emilychem.edu'
  },
  {
    name: 'Alex Student',
    email: 'alex@student.com',
    password: 'password123',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Computer science student passionate about learning new technologies.',
    subjects: [],
    isVerified: false
  },
  {
    name: 'Maria Rodriguez',
    email: 'maria@student.com',
    password: 'password123',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Pre-med student focusing on biology and chemistry.',
    subjects: [],
    isVerified: false
  }
];

export const sampleVideos = [
  {
    title: 'Introduction to Calculus - Limits and Derivatives',
    description: 'Learn the fundamental concepts of calculus including limits, derivatives, and their real-world applications. Perfect for beginners starting their calculus journey.',
    thumbnailUrl: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 1800, // 30 minutes
    views: 45000,
    category: 'mathematics',
    tags: ['calculus', 'limits', 'derivatives', 'mathematics', 'beginner'],
    isPublished: true
  },
  {
    title: 'Quantum Mechanics Fundamentals',
    description: 'Explore the fascinating world of quantum mechanics. Understanding wave-particle duality, uncertainty principle, and quantum states.',
    thumbnailUrl: 'https://images.pexels.com/photos/2085832/pexels-photo-2085832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: 2400, // 40 minutes
    views: 32000,
    category: 'physics',
    tags: ['quantum mechanics', 'physics', 'wave-particle duality', 'advanced'],
    isPublished: true
  },
  {
    title: 'Organic Chemistry: Molecular Structures',
    description: 'Deep dive into organic chemistry focusing on molecular structures, bonding patterns, and chemical reactions.',
    thumbnailUrl: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: 2100, // 35 minutes
    views: 28000,
    category: 'chemistry',
    tags: ['organic chemistry', 'molecular structures', 'chemical bonds', 'intermediate'],
    isPublished: true
  },
  {
    title: 'Linear Algebra: Matrices and Vectors',
    description: 'Master linear algebra concepts including matrix operations, vector spaces, and eigenvalues. Essential for data science and engineering.',
    thumbnailUrl: 'https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: 2700, // 45 minutes
    views: 38000,
    category: 'mathematics',
    tags: ['linear algebra', 'matrices', 'vectors', 'eigenvalues', 'intermediate'],
    isPublished: true
  },
  {
    title: 'Cell Biology and Genetics',
    description: 'Comprehensive overview of cell biology, DNA structure, protein synthesis, and genetic inheritance patterns.',
    thumbnailUrl: 'https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    duration: 3000, // 50 minutes
    views: 42000,
    category: 'biology',
    tags: ['cell biology', 'genetics', 'DNA', 'protein synthesis', 'beginner'],
    isPublished: true
  },
  {
    title: 'Python Programming for Data Science',
    description: 'Learn Python programming specifically for data science applications. Covers pandas, numpy, and matplotlib.',
    thumbnailUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    duration: 3600, // 60 minutes
    views: 65000,
    category: 'computer_science',
    tags: ['python', 'data science', 'pandas', 'numpy', 'programming', 'intermediate'],
    isPublished: true
  },
  {
    title: 'World War II: Turning Points',
    description: 'Analysis of the major turning points in World War II and their impact on global history.',
    thumbnailUrl: 'https://images.pexels.com/photos/159275/macro-focus-cogwheel-gear-159275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    duration: 2200, // 37 minutes
    views: 29000,
    category: 'history',
    tags: ['world war 2', 'history', 'turning points', 'global impact', 'intermediate'],
    isPublished: true
  },
  {
    title: 'Shakespeare: Hamlet Analysis',
    description: 'In-depth literary analysis of Shakespeare\'s Hamlet, exploring themes, characters, and historical context.',
    thumbnailUrl: 'https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    duration: 2500, // 42 minutes
    views: 18000,
    category: 'literature',
    tags: ['shakespeare', 'hamlet', 'literature', 'analysis', 'advanced'],
    isPublished: true
  }
];

export const sampleCommunities = [
  {
    name: 'Advanced Mathematics Hub',
    description: 'A community for advanced mathematics students and enthusiasts. Discuss calculus, linear algebra, and complex mathematical concepts.',
    imageUrl: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'mathematics',
    privacy: 'public',
    channels: [
      { name: 'general', type: 'text', description: 'General mathematics discussion' },
      { name: 'announcements', type: 'announcement', description: 'Important updates' },
      { name: 'calculus', type: 'text', description: 'Calculus problems and solutions' },
      { name: 'linear-algebra', type: 'text', description: 'Linear algebra discussions' }
    ],
    rules: [
      'Be respectful to all members',
      'Stay on topic - mathematics only',
      'No spam or self-promotion',
      'Help others learn and grow'
    ],
    tags: ['calculus', 'algebra', 'geometry', 'advanced'],
    isVerified: true
  },
  {
    name: 'Physics Research Lab',
    description: 'Connect with physics researchers and students. Share discoveries, discuss theories, and collaborate on projects.',
    imageUrl: 'https://images.pexels.com/photos/2085832/pexels-photo-2085832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'physics',
    privacy: 'public',
    channels: [
      { name: 'general', type: 'text', description: 'General physics discussion' },
      { name: 'quantum', type: 'text', description: 'Quantum mechanics' },
      { name: 'research', type: 'text', description: 'Research papers and findings' }
    ],
    rules: [
      'Scientific discussions only',
      'Cite your sources',
      'Be constructive in criticism',
      'Share knowledge freely'
    ],
    tags: ['quantum', 'research', 'experiments', 'theory'],
    isVerified: true
  },
  {
    name: 'Chemistry Lab Community',
    description: 'For chemistry students and professionals. Share experiments, discuss reactions, and learn together.',
    imageUrl: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'chemistry',
    privacy: 'public',
    channels: [
      { name: 'general', type: 'text', description: 'General chemistry discussion' },
      { name: 'organic', type: 'text', description: 'Organic chemistry' },
      { name: 'lab-safety', type: 'text', description: 'Laboratory safety discussions' }
    ],
    rules: [
      'Safety first in all discussions',
      'No dangerous experiments',
      'Share knowledge responsibly',
      'Help beginners learn'
    ],
    tags: ['organic', 'inorganic', 'experiments', 'safety'],
    isVerified: true
  }
];

export const sampleQuizzes = [
  {
    title: 'Calculus Fundamentals Quiz',
    description: 'Test your understanding of basic calculus concepts including limits and derivatives.',
    category: 'mathematics',
    difficulty: 'intermediate',
    timeLimit: 30, // minutes
    questions: [
      {
        question: 'What is the derivative of x²?',
        type: 'multiple-choice',
        options: ['2x', 'x', '2', 'x²'],
        correctAnswer: 0,
        explanation: 'Using the power rule: d/dx(x²) = 2x¹ = 2x'
      },
      {
        question: 'What is the limit of (x² - 1)/(x - 1) as x approaches 1?',
        type: 'multiple-choice',
        options: ['0', '1', '2', 'undefined'],
        correctAnswer: 2,
        explanation: 'Factor the numerator: (x-1)(x+1)/(x-1) = x+1, so limit is 1+1 = 2'
      },
      {
        question: 'The derivative represents the _____ of a function.',
        type: 'fill-in-blank',
        correctAnswer: 'slope',
        explanation: 'The derivative gives the instantaneous rate of change or slope of the tangent line.'
      }
    ],
    tags: ['calculus', 'derivatives', 'limits'],
    attempts: 1250,
    averageScore: 78
  },
  {
    title: 'Quantum Physics Basics',
    description: 'Challenge yourself with fundamental quantum mechanics concepts.',
    category: 'physics',
    difficulty: 'advanced',
    timeLimit: 45,
    questions: [
      {
        question: 'What is the uncertainty principle?',
        type: 'multiple-choice',
        options: [
          'Energy and time cannot be measured simultaneously',
          'Position and momentum cannot be precisely known simultaneously',
          'Wave and particle nature cannot coexist',
          'Quantum states are always uncertain'
        ],
        correctAnswer: 1,
        explanation: 'Heisenberg\'s uncertainty principle states that position and momentum cannot both be precisely determined.'
      },
      {
        question: 'What does wave-particle duality mean?',
        type: 'essay',
        correctAnswer: 'Wave-particle duality means that quantum objects exhibit both wave-like and particle-like properties depending on how they are observed.',
        explanation: 'This fundamental concept shows that matter and energy have characteristics of both waves and particles.'
      }
    ],
    tags: ['quantum', 'uncertainty', 'wave-particle'],
    attempts: 890,
    averageScore: 65
  },
  {
    title: 'Organic Chemistry Structures',
    description: 'Test your knowledge of organic molecular structures and naming conventions.',
    category: 'chemistry',
    difficulty: 'intermediate',
    timeLimit: 25,
    questions: [
      {
        question: 'What is the molecular formula for benzene?',
        type: 'multiple-choice',
        options: ['C6H6', 'C6H12', 'C5H5', 'C7H8'],
        correctAnswer: 0,
        explanation: 'Benzene has 6 carbon atoms and 6 hydrogen atoms: C6H6'
      },
      {
        question: 'Name the functional group -OH',
        type: 'fill-in-blank',
        correctAnswer: 'hydroxyl',
        explanation: 'The -OH group is called a hydroxyl group, characteristic of alcohols.'
      }
    ],
    tags: ['organic', 'structures', 'functional groups'],
    attempts: 670,
    averageScore: 72
  }
];