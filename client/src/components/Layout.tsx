import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Footer } from "./Footer";
import { ScrollToTopButton } from "./ScrollToTopButton";

const NAV_LINKS = [
  { to: "/", label: "홈" },
  { to: "/ranking", label: "도서 순위" },
  { to: "/bestseller", label: "베스트셀러" },
  { to: "/recommend", label: "추천" },
];

export function Layout() {
  const { isLoggedIn, member, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const state = location.state as { loginSuccess?: boolean } | null;
    if (state?.loginSuccess) {
      setToast(`${member?.nickname ?? ""}님, 환영합니다!`);
      navigate(location.pathname, { replace: true, state: null });
      const timer = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [location, member, navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      {toast && (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
      <header className="flex items-center justify-between gap-6 border-b border-stone-200 bg-white px-6 py-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-violet-700">
            woody-book
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    isActive ? "bg-violet-50 text-violet-700" : "text-stone-600 hover:bg-stone-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          {isLoggedIn ? (
            <>
              <span className="text-stone-600">{member?.nickname}님</span>
              <button onClick={logout} className="text-stone-500 hover:text-stone-800">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-stone-600 hover:text-stone-900">
                로그인
              </Link>
              <Link to="/register" className="text-stone-600 hover:text-stone-900">
                회원가입
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
