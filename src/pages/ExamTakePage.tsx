import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { AppData, ExamAttempt, ExamResult } from "../types/appData";
import type { Question } from "../types/question";

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

export default function ExamTakePage({ app, setApp }: Props) {
  const { attemptId } = useParams();
  const nav = useNavigate();

  const attempt = useMemo(
    () => app.attempts.find((a) => a.id === attemptId) ?? null,
    [app.attempts, attemptId]
  );

  const qMap = useMemo(() => {
    const m = new Map<string, Question>();
    for (const q of app.questions) m.set(q.id, q);
    return m;
  }, [app.questions]);

  const [idx, setIdx] = useState(0);
  const [nowMs, setNowMs] = useState(Date.now());
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!attempt) {
    return <div className="card">시험을 찾을 수 없음</div>;
  }

  const started = attempt.startedAt
    ? new Date(attempt.startedAt).getTime()
    : Date.now();
  const elapsedSec = (nowMs - started) / 1000;

  const questionIds = attempt.questionIds;
  const currentQid = questionIds[idx];
  const current = qMap.get(currentQid);

  if (!current) return <div className="card">문제 데이터가 없음</div>;

  const order = attempt.choiceOrder[current.id] ?? [0, 1, 2, 3];
  const selectedOriginal = attempt.answers[current.id];

  const answeredCount = Object.values(attempt.answers).filter(
    (v) => v !== null
  ).length;

  function setAnswer(originalIndex: 0 | 1 | 2 | 3) {
    const nextAttempts = app.attempts.map((a) => {
      if (a.id !== attempt.id) return a;
      return {
        ...a,
        answers: { ...a.answers, [current.id]: originalIndex },
      };
    });
    setApp({ ...app, attempts: nextAttempts });
  }

  function submit() {
    if (attempt.status === "SUBMITTED") return;

    const submittedAt = new Date().toISOString();
    const startedAt = attempt.startedAt ?? submittedAt;

    let correct = 0;
    const bySubjectRaw: Record<string, { correct: number; total: number }> = {};
    const wrongIds: string[] = [];

    for (const qid of attempt.questionIds) {
      const q = qMap.get(qid);
      if (!q) continue;

      const subj = q.subject || "미분류";
      bySubjectRaw[subj] ??= { correct: 0, total: 0 };
      bySubjectRaw[subj].total += 1;

      const ans = attempt.answers[qid];
      const ok = ans !== null && ans === q.answerIndex;
      if (ok) {
        correct += 1;
        bySubjectRaw[subj].correct += 1;
      } else {
        wrongIds.push(qid);
      }
    }

    const total = attempt.questionIds.length;
    const bySubject: ExamResult["bySubject"] = {};
    for (const [subj, v] of Object.entries(bySubjectRaw)) {
      const pct = v.total === 0 ? 0 : Math.round((v.correct / v.total) * 100);
      bySubject[subj] = {
        correct: v.correct,
        total: v.total,
        scorePercent: pct,
      };
    }

    const durationSec = Math.max(
      0,
      Math.floor(
        (new Date(submittedAt).getTime() -
          new Date(startedAt).getTime()) /
          1000
      )
    );

    const result: ExamResult = {
      attemptId: attempt.id,
      durationSec,
      total: {
        correct,
        total,
        scorePercent:
          total === 0 ? 0 : Math.round((correct / total) * 100),
      },
      bySubject,
      wrongQuestionIds: wrongIds,
    };

    const nextQuestions = app.questions.map((q) => {
      if (!wrongIds.includes(q.id)) return q;
      return {
        ...q,
        stats: {
          ...q.stats,
          wrongCount: (q.stats?.wrongCount ?? 0) + 1,
        },
        updatedAt: new Date().toISOString(),
      };
    });

    const nextAttempts = app.attempts.map((a) => {
      if (a.id !== attempt.id) return a;
      return {
        ...a,
        status: "SUBMITTED",
        startedAt,
        submittedAt,
      };
    });

    const nextResults = [
      result,
      ...app.results.filter((r) => r.attemptId !== attempt.id),
    ];

    setApp({
      ...app,
      questions: nextQuestions,
      attempts: nextAttempts,
      results: nextResults,
    });

    nav(`/result/${attempt.id}`);
  }

  return (
    <div className="stackLg">
      {/* 상단 고정 정보 바 */}
      <div className="card rowBetween">
        <div className="stack">
          <h2 className="cardTitle">{attempt.title}</h2>
          <div className="muted">
            진행 {answeredCount}/{questionIds.length}
          </div>
        </div>

        <div className="stack" style={{ textAlign: "right" }}>
          <div className="muted">타이머</div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>
            {formatSec(elapsedSec)}
          </div>
        </div>
      </div>

      <div className="grid2">
        {/* 문항 네비게이션 */}
        <div className="card">
          <div className="cardTitle">문항</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
              gap: 8,
              marginTop: 8,
            }}
          >
            {questionIds.map((qid, i) => {
              const answered = attempt.answers[qid] !== null;
              const active = i === idx;
              return (
                <button
                  key={qid}
                  className={`btn ${active ? "btnPrimary" : ""}`}
                  style={{
                    padding: 6,
                    background: answered
                      ? "rgba(122,167,255,0.25)"
                      : undefined,
                  }}
                  onClick={() => setIdx(i)}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* 문제 영역 */}
        <div className="card">
          <div className="muted" style={{ fontSize: 12 }}>
            {idx + 1} / {questionIds.length} · {current.subject} ·
            난이도 {current.difficulty}
          </div>

          <div style={{ marginTop: 10, fontWeight: 700 }}>
            {current.prompt}
          </div>

          <div className="stack" style={{ marginTop: 12 }}>
            {[0, 1, 2, 3].map((displayIdx) => {
              const originalIdx = order[displayIdx];
              const text = current.choices[originalIdx];
              const checked = selectedOriginal === originalIdx;

              return (
                <label
                  key={displayIdx}
                  className="row"
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: 12,
                    padding: 10,
                    cursor: "pointer",
                    background: checked
                      ? "rgba(122,167,255,0.15)"
                      : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    name={`q_${current.id}`}
                    checked={checked}
                    onChange={() =>
                      setAnswer(originalIdx as 0 | 1 | 2 | 3)
                    }
                  />
                  <div>{text}</div>
                </label>
              );
            })}
          </div>

          <div className="rowBetween" style={{ marginTop: 14 }}>
            <div className="row">
              <button
                className="btn"
                onClick={() => setIdx((v) => Math.max(0, v - 1))}
                disabled={idx === 0}
              >
                이전
              </button>
              <button
                className="btn"
                onClick={() =>
                  setIdx((v) =>
                    Math.min(questionIds.length - 1, v + 1)
                  )
                }
                disabled={idx === questionIds.length - 1}
              >
                다음
              </button>
            </div>

            <button
              className="btn btnPrimary"
              onClick={() => setConfirmSubmit(true)}
            >
              제출
            </button>
          </div>
        </div>
      </div>

      {/* 제출 확인 */}
      {confirmSubmit && (
        <div className="card">
          <div className="stack">
            <div className="cardTitle">시험 제출</div>
            <p className="muted">
              {answeredCount}/{questionIds.length} 문항을 풂. 제출하면 수정할 수
              없음.
            </p>
            <div className="row">
              <button className="btn" onClick={() => setConfirmSubmit(false)}>
                취소
              </button>
              <button className="btn btnPrimary" onClick={submit}>
                제출 확정
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
