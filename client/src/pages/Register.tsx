import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { authApi } from "../api/auth";

function extractErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const detail = err.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail[0]?.msg) {
      return "입력값을 확인해주세요: " + detail.map((d) => d.msg).join(", ");
    }
    if (!err.response) return "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.";
  }
  return "회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.";
}

export function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ user_id: "", password: "", email: "", nickname: "" });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await authApi.register(form);
      navigate("/login");
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto mt-6 max-w-sm rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-stone-800">회원가입</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          value={form.user_id}
          onChange={(e) => setForm({ ...form, user_id: e.target.value })}
          placeholder="아이디 (5-20자, 소문자/숫자/-_)"
          className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
        <input
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          type="password"
          placeholder="비밀번호 (8-16자)"
          className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          type="email"
          placeholder="이메일"
          className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
        <input
          value={form.nickname}
          onChange={(e) => setForm({ ...form, nickname: e.target.value })}
          placeholder="닉네임"
          className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="rounded-full bg-violet-700 py-2.5 font-medium text-white hover:bg-violet-800"
        >
          가입하기
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-stone-500">
        이미 계정이 있으신가요?{" "}
        <Link to="/login" className="font-medium text-violet-700 hover:underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
