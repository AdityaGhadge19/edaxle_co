import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
  avatar?: string;
  password?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'teacher' | 'student') => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial mock users
const initialMockUsers = [
  {
    id: '1',
    name: 'Teacher Demo',
    email: 'teacher@learnone.com',
    password: 'password',
    role: 'teacher' as const,
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
  },
  {
    id: '2',
    name: 'Student Demo',
    email: 'student@learnone.com',
    password: 'password',
    role: 'student' as const,
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mockUsers, setMockUsers] = useState<User[]>(initialMockUsers);

  const checkAuth = useCallback(() => {
    setIsLoading(true);
    const storedUser = localStorage.getItem('learnone_user');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('learnone_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const user = mockUsers.find(
        (user) => user.email === email && user.password === password
      );

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const { password: _, ...userWithoutPassword } = user;
      setUser(userWithoutPassword);
      localStorage.setItem('learnone_user', JSON.stringify(userWithoutPassword));
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'teacher' | 'student') => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (mockUsers.some((user) => user.email === email)) {
        throw new Error('User already exists');
      }

      // Create new user
      const newUser: User = {
        id: String(mockUsers.length + 1),
        name,
        email,
        password,
        role,
        avatar: `https://randomuser.me/api/portraits/${role === 'teacher' ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
      };
      
      // Add new user to mock users list
      setMockUsers(prevUsers => [...prevUsers, newUser]);
      
      // Log in the new user (without password)
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('learnone_user', JSON.stringify(userWithoutPassword));
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('learnone_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};