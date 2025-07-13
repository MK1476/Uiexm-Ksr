import { apiRequest } from "./queryClient";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AdminUser {
  id: number;
  username: string;
}

export const login = async (credentials: LoginCredentials): Promise<AdminUser> => {
  const response = await apiRequest("POST", "/api/auth/login", credentials);
  const data = await response.json();
  
  if (data.admin) {
    localStorage.setItem("admin", JSON.stringify(data.admin));
  }
  
  return data.admin;
};

export const logout = (): void => {
  localStorage.removeItem("admin");
};

export const getStoredAdmin = (): AdminUser | null => {
  const stored = localStorage.getItem("admin");
  return stored ? JSON.parse(stored) : null;
};

export const isAuthenticated = (): boolean => {
  return getStoredAdmin() !== null;
};
