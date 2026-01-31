import { Link, NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "navLink active" : "navLink";

  const year = new Date().getFullYear();

  return (
    <div>
      <header className="header">
        <div className="headerInner">
          {/* ✅ 클릭하면 홈으로 */}
          <Link to="/" className="brand" style={{ textDecoration: "none" }}>
            ExamMaker
          </Link>

          <nav className="nav">
            <NavLink to="/" className={navClass} end>홈</NavLink>
            <NavLink to="/bank" className={navClass}>문제 창고</NavLink>
            <NavLink to="/exam/setup" className={navClass}>시험 설정</NavLink>
            <NavLink to="/wrong-note" className={navClass}>오답 노트</NavLink>
            <NavLink to="/guide" className={navClass}>설명서</NavLink>
            <NavLink to="/samples" className={navClass}>예제 문항 다운로드</NavLink>
          </nav>
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
            사용은 자유. 단, 코드 수정 및 2차 창작/배포 금지.
            모든 권리는 팻킹(데브케이)에게 있음.
          </div>
        </div>
      </footer>
    </div>
  );
}
