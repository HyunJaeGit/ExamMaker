import type { Question } from "../types/question";

type Props = {
  items: Question[];
  onEdit: (q: Question) => void;
};

// 과목 문자열 정규화 (표시용)
function normSubject(s?: string) {
  const t = (s ?? "").trim();
  return t.length ? t : "미분류";
}

export default function QuestionList({ items, onEdit }: Props) {
  return (
    <div className="qListWrap">
      <div className="qListHeader">
        <div className="qListTitle">저장된 문제</div>
        <div className="qListMeta">총 {items.length}문항</div>
      </div>

      <div className="qList">
        {items.map((q) => (
          <div key={q.id} className="qItem">
            <div className="qItemLeft">
              <div className="qBadgeSubj">{normSubject(q.subject)}</div>
              <div className="qBadgeDiff">난이도 {q.difficulty}</div>
            </div>

            <div className="qItemMain">
              <div className="qPrompt" title={q.prompt}>
                {q.prompt}
              </div>

              <div className="qSubline">
                <span>보기 {(q.choices?.length ?? 0)}개</span>
                <span>
                  정답{" "}
                  {typeof q.answerIndex === "number"
                    ? q.answerIndex + 1
                    : "-"}
                  번
                </span>
                <span>오답 {(q.stats?.wrongCount ?? 0)}회</span>
              </div>
            </div>

            <div className="qItemRight">
              <button className="qBtn" onClick={() => onEdit(q)}>
                수정
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="qEmpty">아직 저장된 문제가 없음</div>
        )}
      </div>
    </div>
  );
}
