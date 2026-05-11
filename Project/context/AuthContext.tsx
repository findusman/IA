"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useConnectorStore } from "@/lib/store/connectorStore";
import { useActionStore } from "@/lib/store/actionStore";

export interface User {
  id: string;
  email: string;
  name: string;
  provider: "google" | "facebook" | "email";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { clearAllConnectors } = useConnectorStore();
  const { clearActions } = useActionStore();

  useEffect(() => {
    // Initialize from localStorage on mount
    try {
      const token = localStorage.getItem("profectia_auth_token");
      const storedUser = localStorage.getItem("profectia_user");
      if (token && storedUser) {
        const userData = JSON.parse(storedUser);
        const newUser: User = {
          id: userData.email?.split("@")[0] + "_" + Date.now(),
          email: userData.email,
          name: userData.name || userData.email?.split("@")[0],
          provider: "email",
        };
        setUser(newUser);
        // Store email for connector store to use
        localStorage.setItem("profectia_user_email", userData.email);
      }
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      localStorage.removeItem("profectia_auth_token");
      localStorage.removeItem("profectia_user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simple validation for now (no backend)
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Create a mock user with a simple ID based on email
    const newUser: User = {
      id: email.split("@")[0] + "_" + Date.now(),
      email,
      name: email.split("@")[0],
      provider: "email",
    };

    setUser(newUser);
    // Store email for connector store to use
    localStorage.setItem("profectia_user_email", email);
    localStorage.setItem("user", JSON.stringify(newUser));
    // Clear connectors and actions for previous user
    clearAllConnectors();
    clearActions();
  };

  const loginWithGoogle = async () => {
    // Simulate Google login
    const email = "user@gmail.com";
    const newUser: User = {
      id: "google_" + Date.now(),
      email,
      name: "Google User",
      provider: "google",
      avatar: "https://via.placeholder.com/150",
    };

    setUser(newUser);
    // Store email for connector store to use
    localStorage.setItem("profectia_user_email", email);
    localStorage.setItem("user", JSON.stringify(newUser));
    // Clear connectors and actions for previous user
    clearAllConnectors();
    clearActions();
  };

  const loginWithFacebook = async () => {
    // Simulate Facebook login
    const email = "user@facebook.com";
    const newUser: User = {
      id: "facebook_" + Date.now(),
      email,
      name: "Facebook User",
      provider: "facebook",
      avatar: "https://via.placeholder.com/150",
    };

    setUser(newUser);
    // Store email for connector store to use
    localStorage.setItem("profectia_user_email", email);
    localStorage.setItem("user", JSON.stringify(newUser));
    // Clear connectors and actions for previous user
    clearAllConnectors();
    clearActions();
  };

  const logout = () => {
    setUser(null);
    // Clear all connectors and actions for logged out user
    clearAllConnectors();
    clearActions();
    localStorage.removeItem("profectia_auth_token");
    localStorage.removeItem("profectia_user");
    localStorage.removeItem("profectia_user_email");
    // Keep old key for backward compatibility
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginWithGoogle,
        loginWithFacebook,
        logout,
        isAuthenticated: !!user,
      }}
    >
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
