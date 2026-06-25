import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { applyTokens } = useAuth();

  useEffect(() => {
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    if (accessToken && refreshToken) {
      applyTokens({ access_token: accessToken, refresh_token: refreshToken, token_type: "bearer" });
    }
    navigate("/", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <p className="text-stone-500">로그인 처리 중...</p>;
}
