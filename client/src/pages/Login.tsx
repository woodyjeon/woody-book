import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const { applyTokens } = useAuth();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const { data } = await authApi.login({ user_id: userId, password });
      applyTokens(data);
      navigate("/");
    } catch {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="mx-auto mt-6 max-w-sm rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-stone-800">로그인</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="아이디"
          className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="비밀번호"
          className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="rounded-full bg-violet-700 py-2.5 font-medium text-white hover:bg-violet-800"
        >
          로그인
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-stone-500">
        계정이 없으신가요?{" "}
        <Link to="/register" className="font-medium text-violet-700 hover:underline">
          회원가입
        </Link>
      </p>
      <div className="mt-4 rounded-xl bg-violet-50 px-4 py-3 text-center text-xs text-violet-700">
        테스트 계정 — 아이디: <span className="font-semibold">test01</span> / 비밀번호:{" "}
        <span className="font-semibold">test01</span>
      </div>
    </div>
  );
}
