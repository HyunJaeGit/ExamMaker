import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AppData, ExamAttempt, ExamBlueprint } from "../types/appData";
import { newId } from "../lib/id";
import { choiceOrder4, sample, shuffle } from "../lib/random";

type Props = {
  app: AppData;
  setApp: (next: AppData) => void;
};

// 과목 문자열 정규화 (공백/빈값 방어)
function normSubject(s?: string) {
  const t = (s ?? "").trim();
  return t.length ? t : "미분류";
}

export default function ExamSetupPage({ app, setApp }: Props) {
  const nav = useNavigate();

  const [title, setTitle] = useState("랜덤 모의고사");
  const [questionCount, setQuestionCount] = useState(20);
  const [subjectFilter, setSubjectFilter] = useState<string>("ALL");
  const [qFilter, setQFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 드롭다운/칩 옵션도 정규화된 과목으로 생성
  const subjects = useMemo(() => {
    const set = new Set<string>();
    for (const q of app.questions) set.add(normSubject(q.subject));
    return ["ALL", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [app.questions]);

  // 필터링도 정규화된 과목으로 비교
  const filtered = useMemo(() => {
    const kw = qFilter.trim().toLowerCase();

    return app.questions.filter((q) => {
      const subj = normSubject(q.subject);

      if (subjectFilter !== "ALL" && subj !== subjectFilter) return false;

      if (kw) {
        const hay = `${subj} ${q.prompt} ${q.explanation ?? ""}`.toLowerCase();
        if (!hay.includes(kw)) return false;
      }

      return true;
    });
  }, [app.questions, subjectFilter, qFilter]);

  const selectedCount = selectedIds.size;

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAllFiltered() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const q of filtered) next.add(q.id);
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function startExam() {
    if (selectedCount === 0) {
      alert("출제할 문제를 선택해줘");
      return;
    }
    if (questionCount <= 0) {
      alert("문항 수는 1 이상");
      return;
    }
    if (questionCount > selectedCount) {
      alert("선택한 문제 수가 문항 수보다 적음");
      return;
    }

    const now = new Date().toISOString();

    const blueprint: ExamBlueprint = {
      id: newId("bp"),
      title: title.trim() || "랜덤 모의고사",
      selectedQuestionIds: Array.from(selectedIds),
      questionCount,
      shuffleQuestions: true,
      shuffleChoices: true,
      createdAt: now,
    };

    const picked = sample(blueprint.selectedQuestionIds, blueprint.questionCount);
    const questionIds = shuffle(picked);

    const choiceOrder: ExamAttempt["choiceOrder"] = {};
    for (const qid of questionIds) {
      choiceOrder[qid] = choiceOrder4();
    }

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
      <div className="card">
        <h2 className="cardTitle">시험 설정</h2>

        <div className="grid2" style={{ marginTop: 10 }}>
          <label className="stack">
            시험 제목
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label className="stack">
            문항 수
            <input
              className="input"
              type="number"
              min={1}
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
            />
          </label>
        </div>

        <div className="row" style={{ marginTop: 10 }}>
          <label>
            과목
            <select
              className="select"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s === "ALL" ? "전체" : s}
                </option>
              ))}
            </select>
          </label>

          <label style={{ flex: 1 }}>
            검색
            <input
              className="input"
              value={qFilter}
              onChange={(e) => setQFilter(e.target.value)}
              placeholder="키워드"
            />
          </label>

          <span className="kbd">
            선택 {selectedCount} / 필터 {filtered.length} / 전체 {app.questions.length}
          </span>
        </div>

        {/* 과목 버튼(칩): 드롭다운과 동일 state 공유 */}
        <div className="chipRow" style={{ marginTop: 10 }}>
          {subjects.map((s) => {
            const active = subjectFilter === s;
            const label = s === "ALL" ? "전체" : s;

            return (
              <button
                key={s}
                type="button"
                className={`chip ${active ? "chipActive" : ""}`}
                onClick={() => setSubjectFilter(s)}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="row" style={{ marginTop: 10 }}>
          <button className="btn" onClick={selectAllFiltered}>
            필터 전체선택
          </button>
          <button className="btn" onClick={clearSelection}>
            선택 해제
          </button>
          <button className="btn btnPrimary" onClick={startExam}>
            시험 시작
          </button>
        </div>
      </div>

      <div className="card">
        <div className="stack">
          <div className="cardTitle">출제 대상 선택</div>

          <div style={{ maxHeight: 420, overflow: "auto" }} className="stack">
            {filtered.map((q) => (
              <label key={q.id} className="row">
                <input
                  type="checkbox"
                  checked={selectedIds.has(q.id)}
                  onChange={() => toggle(q.id)}
                />
                <div>
                  <div className="muted" style={{ fontSize: 12 }}>
                    {normSubject(q.subject)} · 난이도 {q.difficulty}
                  </div>
                  <div>{q.prompt}</div>
                </div>
              </label>
            ))}

            {filtered.length === 0 && (
              <div className="muted">조건에 맞는 문제가 없음</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
