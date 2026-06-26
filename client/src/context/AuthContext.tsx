import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useState, type ReactNode } from "react";
import { tokenStorage } from "../api/client";
import { authApi } from "../api/auth";
import type { Member, TokenPair } from "../api/types";

interface AuthContextValue {
  member: Member | undefined;
  isLoading: boolean;
  isLoggedIn: boolean;
  applyTokens: (tokens: TokenPair) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [hasToken, setHasToken] = useState(Boolean(tokenStorage.getAccessToken()));

  const { data: member, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => authApi.me().then((res) => res.data),
    enabled: hasToken,
    retry: false,
  });

  const applyTokens = async (tokens: TokenPair) => {
    tokenStorage.setTokens(tokens);
    setHasToken(true);
    // 로그인 직후 헤더가 즉시 로그인 상태로 보이도록, 화면 전환 전에 내 정보를 먼저 받아온다.
    const me = await authApi.me().then((res) => res.data);
    queryClient.setQueryData(["me"], me);
  };

  const logout = () => {
    tokenStorage.clearTokens();
    setHasToken(false);
    queryClient.setQueryData(["me"], undefined);
  };

  return (
    <AuthContext.Provider value={{ member, isLoading, isLoggedIn: Boolean(member), applyTokens, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.");
  return ctx;
}
