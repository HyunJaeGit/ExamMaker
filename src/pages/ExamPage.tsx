import type { Question } from "../types/question";

type Props = {
  questions: Question[];
};

export default function ExamPage({ questions }: Props) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h2 style={{ margin: 0 }}>시험 보기</h2>

      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
        현재 문제 수: {questions.length}
      </div>

      <div style={{ color: "#666" }}>
        다음 단계에서 여기서 랜덤 출제 / 보기 섞기 / 오답 횟수 기록 구현하면 됨
      </div>
    </div>
  );
}
