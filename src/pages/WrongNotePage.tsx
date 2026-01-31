import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AppData, ExamAttempt, ExamBlueprint } from "../types/appData";
import { newId } from "../lib/id";
import { choiceOrder4, sample, shuffle } from "../lib/random";

type Props = {
  app: AppData;
  setApp: (next: AppData) => void;
};

export default function WrongNotePage({ app, setApp }: Props) {
  const nav = useNavigate();
  const [count, setCount] = useState(20);

  const wrongQuestions = useMemo(() => {
    return app.questions
      .filter((q) => (q.stats?.wrongCount ?? 0) > 0)
      .sort((a, b) => (b.stats.wrongCount ?? 0) - (a.stats.wrongCount ?? 0));
  }, [app.questions]);

  const ids = wrongQuestions.map((q) => q.id);

  function startWrongExam() {
    if (ids.length === 0) {
      alert("오답 노트가 비어있음");
      return;
    }
    const questionCount = Math.min(Math.max(1, count), ids.length);

    const now = new Date().toISOString();
    const blueprint: ExamBlueprint = {
      id: newId("bp"),
      title: "오답노트 재시험",
      selectedQuestionIds: ids,
      questionCount,
      shuffleQuestions: true,
      shuffleChoices: true,
      createdAt: now,
    };

    const picked = sample(ids, blueprint.questionCount);
    const questionIds = shuffle(picked);

    const choiceOrder: ExamAttempt["choiceOrder"] = {};
    for (const qid of questionIds) choiceOrder[qid] = choiceOrder4();

    const answers: ExamAttempt["answers"] = {};
    for (const qid of questionIds) answers[qid] = null;

    const attempt: ExamAttempt = {
      id: newId("at"),
      blueprintId: blueprint.id,
      title: blueprint.title,
      status: "IN_PROGRESS",
      questionIds,
      answers,
      startedAt: now,
      choiceOrder,
    };

    setApp({
      ...app,
      blueprints: [blueprint, ...app.blueprints],
      attempts: [attempt, ...app.attempts],
    });

    nav(`/exam/take/${attempt.id}`);
  }

  return (
    <div className="stackLg">
      <div className="card rowBetween">
        <div className="stack">
          <h2 className="cardTitle">오답 노트</h2>
          <p className="muted">
            틀린 문제만 모아 다시 시험을 볼 수 있습니다
          </p>
        </div>

        <div className="row">
          <label>
            문항 수
            <input
              className="input"
              type="number"
              min={1}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              style={{ width: 120 }}
            />
          </label>

          <button className="btn btnPrimary" onClick={startWrongExam}>
            오답 재시험
          </button>

          <span className="kbd">
            오답 {wrongQuestions.length}
          </span>
        </div>
      </div>

      <div className="grid2">
        {wrongQuestions.map((q) => (
          <div key={q.id} className="card">
            <div className="rowBetween">
              <div className="muted" style={{ fontSize: 12 }}>
                {q.subject} · 난이도 {q.difficulty}
              </div>
              <span className="kbd">
                wrong {q.stats.wrongCount}
              </span>
            </div>
            <div style={{ marginTop: 8 }}>{q.prompt}</div>
          </div>
        ))}

        {wrongQuestions.length === 0 && (
          <div className="card">
            <p className="muted">오답 노트 비어있음</p>
          </div>
        )}
      </div>
    </div>
  );
}
