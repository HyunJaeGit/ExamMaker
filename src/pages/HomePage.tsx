import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import type { AppData } from "../types/appData";
import { downloadAppDataAsJson, readAppDataFromFile } from "../lib/fileIO";
import examPreview from "../assets/home-exam-preview.png";

type Props = {
  app: AppData;
  setApp: (next: AppData) => void;
};

function formatSec(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function HomePage({ app, setApp }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const stats = useMemo(() => {
    const questionCount = app.questions.length;
    const subjectSet = new Set(app.questions.map((q) => q.subject).filter(Boolean));
    const subjectCount = subjectSet.size;
    const wrongCount = app.questions.filter((q) => (q.stats?.wrongCount ?? 0) > 0).length;

    const latestResult = app.results[0] ?? null;

    return {
      questionCount,
      subjectCount,
      wrongCount,
      latestResult,
    };
  }, [app.questions, app.results]);

  const canStartExam = stats.questionCount > 0;

  return (
    <div className="stackLg">
            {/* HERO */}
            <section className="hero">
              <div className="grid2" style={{ alignItems: "center" }}>
                {/* LEFT */}
                <div className="stack">
                  <h1 className="heroTitle">ExamMaker</h1>
                  <p className="heroSub">
                    국가 기술 자격시험 CBT 모의 시험 앱
                  </p>
                  <p className="heroSub">
                    직접 AI로 모의 시험을 만들고, 오답 노트 기능 까지
                  </p>

                  <div className="badges">
                    <span className="badge">4지선다 전용</span>
                    <span className="badge">선택 출제 + 랜덤 섞기</span>
                    <span className="badge">과목별 결과</span>
                    <span className="badge">오답 횟수 누적</span>
                  </div>

                  <div className="row" style={{ marginTop: 14 }}>
                    <Link to="/bank">
                      <button className="btn btnPrimary">문제 만들기</button>
                    </Link>
                    <Link to="/exam/setup">
                      <button className="btn" disabled={!canStartExam}>
                        시험 시작
                      </button>
                    </Link>
                    <Link to="/wrong-note">
                      <button className="btn">오답 노트</button>
                    </Link>
                    <Link to="/guide">
                      <button className="btn">설명서</button>
                    </Link>

                    {!canStartExam && (
                      <span className="kbd">
                        먼저 문제를 1개 이상 만들어야 시험 가능
                      </span>
                    )}
                  </div>
                </div>

                {/* RIGHT - MINI PREVIEW */}
                <div className="card cardFlat" style={{ padding: 10 }}>
                  <div className="stack" style={{ gap: 6 }}>
                    <div className="rowBetween">
                      <span className="badge">시험 화면 미리보기</span>
                      <span className="muted" style={{ fontSize: 12 }}>
                        [예시]
                      </span>
                    </div>

                    <img
                      src={examPreview}
                      alt="ExamMaker 시험 화면 미리보기"
                      style={{
                        width: "100%",
                        borderRadius: 10,
                        border: "1px solid var(--line)",
                        boxShadow: "var(--shadow)",
                      }}
                    />

                    <p className="muted" style={{ fontSize: 12, margin: 0 }}>
                      타이머와 실제 CBT 시험 화면 형식으로 실전 감각 테스트
                    </p>
                  </div>
                </div>
              </div>
            </section>

      {/* STAT DASHBOARD */}
      <section className="statGrid">
        <div className="statCard">
          <div className="statLabel">총 문제</div>
          <div className="statValue">{stats.questionCount}</div>
          <div className="statHint">문제 창고에서 추가/수정</div>
        </div>

        <div className="statCard">
          <div className="statLabel">과목 수</div>
          <div className="statValue">{stats.subjectCount}</div>
          <div className="statHint">과목 기반 결과/필터</div>
        </div>

        <div className="statCard">
          <div className="statLabel">오답 노트</div>
          <div className="statValue">{stats.wrongCount}</div>
          <div className="statHint">모의 시험 오답 노트 자동 생성</div>
        </div>

        <div className="statCard">
          <div className="statLabel">최근 시험</div>
          <div className="statValue">
            {stats.latestResult ? `${stats.latestResult.total.scorePercent}%` : "-"}
          </div>
          <div className="statHint">
            {stats.latestResult ? `소요 ${formatSec(stats.latestResult.durationSec)}` : "아직 기록 없음"}
          </div>
        </div>
      </section>

      {/* 3-STEP FLOW */}
      <section className="grid3">
        <div className="card">
          <h3 className="cardTitle">1) 문제 창고</h3>
          <p className="muted">
            4지선다 문제를 직접 만들기
          </p>
          <div className="row" style={{ marginTop: 10 }}>
            <Link to="/bank">
              <button className="btn btnPrimary">문제 추가/수정</button>
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 className="cardTitle">2) 시험 설정</h3>
          <p className="muted">
            문제를 랜덤으로 선별해 시험지 생성
          </p>
          <div className="row" style={{ marginTop: 10 }}>
            <Link to="/exam/setup">
              <button className="btn btnPrimary" disabled={!canStartExam}>
                시험 만들기
              </button>
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 className="cardTitle">3) 시험 결과 분석 &amp; 오답노트</h3>
          <p className="muted">
            과목별 정답률로 약점을 확인하고
            틀린 문제는 오답노트로 다시 풀어봄
          </p>
          <div className="row" style={{ marginTop: 10 }}>
            <Link to="/wrong-note">
              <button className="btn">오답노트 보기</button>
            </Link>
          </div>
        </div>
      </section>

            {/* DATA SAVE NOTICE (short) */}
            <section className="card">
              <div className="rowBetween">
                <p className="muted" style={{ margin: 0 }}>
                  이미 시험 문항을 만드셨다면?
                </p>
                <div className="row">
                  <button className="btn" onClick={() => downloadAppDataAsJson(app)}>
                    내보내기
                  </button>
                  <button className="btn" onClick={() => fileRef.current?.click()}>
                    불러오기
                  </button>
                  <Link to="/guide">
                    <button className="btn">자세히</button>
                  </Link>
                </div>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="application/json"
                style={{ display: "none" }}
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  try {
                    const loaded = await readAppDataFromFile(f);
                    setApp(loaded);
                  } catch {
                    alert("불러오기 실패: 파일 형식을 확인해줘");
                  } finally {
                    e.currentTarget.value = "";
                  }
                }}
              />
            </section>

      {/* MINI FAQ */}
      <section className="grid2">
        <div className="card">
          <h3 className="cardTitle">FAQ</h3>
          <ul className="list">
            <li>새로고침하면 데이터가 사라짐 → 내보내기(JSON)로 "저장"해야 함</li>
            <li>오답노트는 시험 결과 기반으로 자동 생성됨</li>
          </ul>
        </div>

        <div className="card">
          <h3 className="cardTitle">추천 사용 루틴</h3>
          <ul className="list">
            <li>1) 문제 30~50개 만든 뒤 과목별로 나눠두기</li>
            <li>2) 과목별 문항 수 20으로 랜덤 시험 진행</li>
            <li>3) 오답노트로 재시험</li>
            <li>4) 반복 학습으로 개념 익히기</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
