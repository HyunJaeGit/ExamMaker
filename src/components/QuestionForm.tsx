import { useEffect, useMemo, useState } from "react";
import type { Question } from "../types/question";
import { newId } from "../lib/id";

type Props = {
  mode: "create" | "edit";
  initial?: Question;
  onCancel?: () => void;
  onSubmit: (q: Question) => void;
};

type FormState = {
  subject: string;
  difficulty: number;
  prompt: string;
  c0: string;
  c1: string;
  c2: string;
  c3: string;
  answerIndex: 0 | 1 | 2 | 3;
  explanation: string;
};

function toForm(q?: Question): FormState {
  return {
    subject: q?.subject ?? "",
    difficulty: q?.difficulty ?? 3,
    prompt: q?.prompt ?? "",
    c0: q?.choices?.[0] ?? "",
    c1: q?.choices?.[1] ?? "",
    c2: q?.choices?.[2] ?? "",
    c3: q?.choices?.[3] ?? "",
    answerIndex: (q?.answerIndex ?? 0) as 0 | 1 | 2 | 3,
    explanation: q?.explanation ?? "",
  };
}

export default function QuestionForm({ mode, initial, onCancel, onSubmit }: Props) {
  const [f, setF] = useState<FormState>(() => toForm(initial));

  useEffect(() => {
    setF(toForm(initial));
  }, [initial?.id]);

  const canSubmit = useMemo(() => {
    const choices = [f.c0, f.c1, f.c2, f.c3];
    return (
      f.subject.trim().length > 0 &&
      f.prompt.trim().length > 0 &&
      choices.every((c) => c.trim().length > 0) &&
      f.difficulty >= 1 &&
      f.difficulty <= 5
    );
  }, [f]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setF((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit() {
    if (!canSubmit) return;

    const now = new Date().toISOString();

    const q: Question =
      mode === "edit" && initial
        ? {
            ...initial,
            subject: f.subject.trim(),
            difficulty: f.difficulty,
            prompt: f.prompt.trim(),
            choices: [f.c0.trim(), f.c1.trim(), f.c2.trim(), f.c3.trim()],
            answerIndex: f.answerIndex,
            explanation: f.explanation.trim() || undefined,
            updatedAt: now,
          }
        : {
            id: newId(),
            subject: f.subject.trim(),
            difficulty: f.difficulty,
            prompt: f.prompt.trim(),
            choices: [f.c0.trim(), f.c1.trim(), f.c2.trim(), f.c3.trim()],
            answerIndex: f.answerIndex,
            explanation: f.explanation.trim() || undefined,
            stats: { wrongCount: 0 },
            createdAt: now,
            updatedAt: now,
          };

    onSubmit(q);

    if (mode === "create") setF(toForm(undefined));
  }

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
      <h3 style={{ marginTop: 0 }}>{mode === "create" ? "문제 추가" : "문제 수정"}</h3>

      <div style={{ display: "grid", gap: 8 }}>
        <label>
          과목
          <input
            value={f.subject}
            onChange={(e) => set("subject", e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
            placeholder="예: 네트워크"
          />
        </label>

        <label>
          난이도 (1~5)
          <input
            type="number"
            min={1}
            max={5}
            value={f.difficulty}
            onChange={(e) => set("difficulty", Number(e.target.value))}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>

        <label>
          문제
          <textarea
            value={f.prompt}
            onChange={(e) => set("prompt", e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4, minHeight: 80 }}
            placeholder="문제 내용을 입력"
          />
        </label>

        <div style={{ display: "grid", gap: 8 }}>
          <label>
            보기 1
            <input
              value={f.c0}
              onChange={(e) => set("c0", e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
          <label>
            보기 2
            <input
              value={f.c1}
              onChange={(e) => set("c1", e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
          <label>
            보기 3
            <input
              value={f.c2}
              onChange={(e) => set("c2", e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
          <label>
            보기 4
            <input
              value={f.c3}
              onChange={(e) => set("c3", e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
        </div>

        <label>
          정답
          <select
            value={f.answerIndex}
            onChange={(e) => set("answerIndex", Number(e.target.value) as 0 | 1 | 2 | 3)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          >
            <option value={0}>보기 1</option>
            <option value={1}>보기 2</option>
            <option value={2}>보기 3</option>
            <option value={3}>보기 4</option>
          </select>
        </label>

        <label>
          해설(선택)
          <textarea
            value={f.explanation}
            onChange={(e) => set("explanation", e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4, minHeight: 60 }}
            placeholder="해설이 있으면 입력"
          />
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleSubmit} disabled={!canSubmit} style={{ padding: "10px 12px" }}>
            {mode === "create" ? "추가" : "저장"}
          </button>

          {mode === "edit" && onCancel && (
            <button onClick={onCancel} style={{ padding: "10px 12px" }}>
              취소
            </button>
          )}
        </div>

        {!canSubmit && (
          <small style={{ color: "#666" }}>
            과목/문제/보기 4개를 모두 입력하고 난이도(1~5)를 맞춰야 저장 가능
          </small>
        )}
      </div>
    </div>
  );
}
