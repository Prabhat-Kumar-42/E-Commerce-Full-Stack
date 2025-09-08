import { createContext } from "react";
import type { User } from "../../types/user.type";
import { useContext } from "react";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}


// src/context/AuthContext/AuthContext.ts
export const AuthContext = createContext<AuthContextType | undefined>(undefined);


// src/context/AuthContext/hook.ts
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
