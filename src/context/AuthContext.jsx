import React, { createContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("exam_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("exam_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("exam_user");
    }
  }, [user]);

  // Get all registered users from localStorage
  const getUsers = useCallback(() => {
    try {
      const users = localStorage.getItem("exam_users");
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  }, []);

  // Save users to localStorage
  const saveUsers = useCallback((users) => {
    localStorage.setItem("exam_users", JSON.stringify(users));
  }, []);

  // Register new user
  const register = useCallback(async (username, email, password) => {
    setIsLoading(true);
    setError(null);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = getUsers();
    
    // Check if username already exists
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
      setError("Username already exists");
      setIsLoading(false);
      return { success: false, error: "Username already exists" };
    }

    // Check if email already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      setError("Email already registered");
      setIsLoading(false);
      return { success: false, error: "Email already registered" };
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password, // In real app, this would be hashed
      name: username.charAt(0).toUpperCase() + username.slice(1),
      createdAt: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${username}`
    };

    // Save to users list
    users.push(newUser);
    saveUsers(users);

    // Auto login after registration
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsLoading(false);

    return { success: true, user: userWithoutPassword };
  }, [getUsers, saveUsers]);

  // Login user
  const login = useCallback(async (username, password) => {
    setIsLoading(true);
    setError(null);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = getUsers();
    
    // Find user by username or email
    const foundUser = users.find(
      u => (u.username.toLowerCase() === username.toLowerCase() || 
            u.email.toLowerCase() === username.toLowerCase()) && 
           u.password === password
    );

    if (!foundUser) {
      setError("Invalid username or password");
      setIsLoading(false);
      return { success: false, error: "Invalid username or password" };
    }

    // Login successful
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    setIsLoading(false);

    return { success: true, user: userWithoutPassword };
  }, [getUsers]);

  // Logout user
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("exam_user");
    localStorage.removeItem("last_submission");
    localStorage.removeItem("exam_draft");
    localStorage.removeItem("exam_snapshots");
  }, []);

  // Update user profile
  const updateProfile = useCallback((updates) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);

    // Also update in users list
    const users = getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      saveUsers(users);
    }
  }, [user, getUsers, saveUsers]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateProfile,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook for easy access
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
