import { Link, NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function Layout() {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "navLink active" : "navLink";

  const year = new Date().getFullYear();

  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme | null) ?? null;
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initial: Theme = saved ?? (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }

  return (
    <div>
      <header className="header">
        <div className="headerInner">
          {/* ✅ 클릭하면 홈으로 */}
          <Link to="/" className="brand" style={{ textDecoration: "none" }}>
            ExamMaker
          </Link>

          {/* ✅ 우측 정렬 영역 */}
          <div className="headerRight">
            <nav className="nav">
              <NavLink to="/" className={navClass} end>
                홈
              </NavLink>
              <NavLink to="/bank" className={navClass}>
                문제 창고
              </NavLink>
              <NavLink to="/exam/setup" className={navClass}>
                시험 설정
              </NavLink>
              <NavLink to="/wrong-note" className={navClass}>
                오답 노트
              </NavLink>
              <NavLink to="/guide" className={navClass}>
                설명서
              </NavLink>
              <NavLink to="/samples" className={navClass}>
                예제 문항 다운로드
              </NavLink>
            </nav>

            <button
              className="themeToggle"
              onClick={toggleTheme}
              aria-label="테마 전환"
              title="테마 전환"
            >
              {theme === "dark" ? "다크" : "라이트"}
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footerInner">
          <div className="footerRow">
            <div>© {year} 팻킹(데브케이). All rights reserved.</div>
            <div>
              문의/피드백:{" "}
              <a href="mailto:fatking25@kakao.com">fatking25@kakao.com</a>
            </div>
          </div>

          <div>
            사용은 자유. 단, 코드 수정 및 2차 창작/배포 금지. 모든 권리는 개인 개발자 팻킹(데브케이)에게 있음.
          </div>
        </div>
      </footer>
    </div>
  );
}
