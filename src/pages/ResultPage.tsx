import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { AppData } from "../types/appData";

type Props = {
  app: AppData;
};

function formatSec(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function ResultPage({ app }: Props) {
  const { attemptId } = useParams();
  const nav = useNavigate();

  const attempt = useMemo(
    () => app.attempts.find((a) => a.id === attemptId) ?? null,
    [app.attempts, attemptId]
  );

  const result = useMemo(
    () => app.results.find((r) => r.attemptId === attemptId) ?? null,
    [app.results, attemptId]
  );

  if (!attempt || !result) {
    return <div className="card">결과를 찾을 수 없음</div>;
  }

  const rows = Object.entries(result.bySubject).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  return (
    <div className="stackLg">
      <div className="card rowBetween">
        <div className="stack">
          <h2 className="cardTitle">시험 결과</h2>
          <div className="muted">{attempt.title}</div>
        </div>

        <div className="row">
          <button
            className="btn"
            onClick={() => nav("/exam/setup")}
          >
            새 시험
          </button>
          <button
            className="btn btnPrimary"
            onClick={() => nav("/wrong-note")}
          >
            오답 노트
          </button>
        </div>
      </div>

      <div className="statGrid">
        <div className="statCard">
          <div className="statLabel">총점</div>
          <div className="statValue">
            {result.total.scorePercent}%
          </div>
          <div className="statHint">
            {result.total.correct}/{result.total.total}
          </div>
        </div>

        <div className="statCard">
          <div className="statLabel">소요시간</div>
          <div className="statValue">
            {formatSec(result.durationSec)}
          </div>
        </div>

        <div className="statCard">
          <div className="statLabel">오답 문항</div>
          <div className="statValue">
            {result.wrongQuestionIds.length}
          </div>
        </div>

        <div className="statCard">
          <div className="statLabel">과목 수</div>
          <div className="statValue">
            {rows.length}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="cardTitle">과목별 결과</div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 8,
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: 8,
                  borderBottom: "1px solid var(--line)",
                }}
              >
                과목
              </th>
              <th
                style={{
                  padding: 8,
                  borderBottom: "1px solid var(--line)",
                }}
              >
                정답
              </th>
              <th
                style={{
                  padding: 8,
                  borderBottom: "1px solid var(--line)",
                }}
              >
                문항
              </th>
              <th
                style={{
                  padding: 8,
                  borderBottom: "1px solid var(--line)",
                }}
              >
                정답률
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([subject, v]) => (
              <tr key={subject}>
                <td style={{ padding: 8 }}>
                  {subject}
                </td>
                <td style={{ padding: 8 }}>
                  {v.correct}
                </td>
                <td style={{ padding: 8 }}>
                  {v.total}
                </td>
                <td style={{ padding: 8 }}>
                  {v.scorePercent}%
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  style={{ padding: 8, color: "var(--muted)" }}
                >
                  데이터 없음
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
