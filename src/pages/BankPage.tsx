import { useRef, useState } from "react";
import type { Question } from "../types/question";
import type { AppData } from "../types/appData";
import QuestionForm from "../components/QuestionForm";
import QuestionList from "../components/QuestionList";
import Modal from "../components/Modal";
import { downloadAppDataAsJson, readAppDataFromFile } from "../lib/fileIO";

type Props = {
  app: AppData;
  setApp: (next: AppData) => void;
};

export default function BankPage({ app, setApp }: Props) {
  const [editing, setEditing] = useState<Question | null>(null);
  const [open, setOpen] = useState(false); // ✅ 모달
  const fileRef = useRef<HTMLInputElement | null>(null);

  const questions = app.questions;

  function addQuestion(q: Question) {
    setApp({ ...app, questions: [q, ...questions] });
    setOpen(false);
  }

  function updateQuestion(q: Question) {
    setApp({ ...app, questions: questions.map((it) => (it.id === q.id ? q : it)) });
    setEditing(null);
    setOpen(false);
  }

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(q: Question) {
    setEditing(q);
    setOpen(true);
  }

  function closeModal() {
    setEditing(null);
    setOpen(false);
  }

  return (
    <div className="stackLg">
      <div className="rowBetween card">
        <div className="stack">
          <h2 className="cardTitle">문제 창고</h2>
          <p className="muted">문제를 추가/수정하고 JSON 파일로 내보내기/불러오기</p>
        </div>

        <div className="row">
          <button className="btn btnPrimary" onClick={openCreate}>
            문제 추가
          </button>

          <button className="btn" onClick={() => downloadAppDataAsJson(app)}>
            내보내기(JSON)
          </button>

          <button className="btn" onClick={() => fileRef.current?.click()}>
            불러오기(JSON)
          </button>

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
                setEditing(null);
                setOpen(false);
              } catch {
                alert("불러오기 실패: 파일 형식을 확인");
              } finally {
                e.currentTarget.value = "";
              }
            }}
          />

          <span className="kbd">총 {questions.length}문항</span>
        </div>
      </div>

      {/* ✅ 리스트만 풀폭으로 */}
      <div className="card">
        <QuestionList items={questions} onEdit={openEdit} />
      </div>

      <div className="card">
        <p className="muted">
          중요!!! 자동 저장 불가. 변경 사항을 유지하려면 JSON 내보내기를 실행해야 합니다.
        </p>
      </div>

      {/* ✅ 모달 */}
      {open && (
        <Modal title={editing ? "문제 수정" : "문제 추가"} onClose={closeModal}>
          {editing ? (
            <QuestionForm
              mode="edit"
              initial={editing}
              onCancel={closeModal}
              onSubmit={updateQuestion}
            />
          ) : (
            <QuestionForm mode="create" onCancel={closeModal} onSubmit={addQuestion} />
          )}
        </Modal>
      )}
    </div>
  );
}
