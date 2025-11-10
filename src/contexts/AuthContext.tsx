import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const MOCK_USERS_KEY = "novacart_users";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("novacart_current_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Basic validation
    if (!email || !password || !name) {
      toast.error("All fields are required");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    // Get existing users
    const usersData = localStorage.getItem(MOCK_USERS_KEY);
    const users = usersData ? JSON.parse(usersData) : [];

    // Check if user already exists
    const existingUser = users.find((u: any) => u.email === email);
    if (existingUser) {
      toast.error("User already exists");
      return false;
    }

    // Create new user
    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      email,
      name,
      password, // In real app, this would be hashed
    };

    users.push(newUser);
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));

    // Create session
    const userWithoutPassword: User = { id: newUser.id, email: newUser.email, name: newUser.name };
    setUser(userWithoutPassword);
    localStorage.setItem("novacart_current_user", JSON.stringify(userWithoutPassword));
    localStorage.setItem("novacart_token", `mock_token_${newUser.id}`);

    toast.success("Account created successfully!");
    return true;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Basic validation
    if (!email || !password) {
      toast.error("Email and password are required");
      return false;
    }

    // Get existing users
    const usersData = localStorage.getItem(MOCK_USERS_KEY);
    const users = usersData ? JSON.parse(usersData) : [];

    // Find user
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (!foundUser) {
      toast.error("Invalid email or password");
      return false;
    }

    // Create session
    const userWithoutPassword: User = { 
      id: foundUser.id, 
      email: foundUser.email, 
      name: foundUser.name 
    };
    setUser(userWithoutPassword);
    localStorage.setItem("novacart_current_user", JSON.stringify(userWithoutPassword));
    localStorage.setItem("novacart_token", `mock_token_${foundUser.id}`);

    toast.success("Logged in successfully!");
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("novacart_current_user");
    localStorage.removeItem("novacart_token");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
