import { useState } from "react";

export default function GuidePage() {
  const sampleJson = `{
  "schemaVersion": 2,
  "questions": [
    {
      "id": "q_001",
      "subject": "데이터베이스 구축",
      "difficulty": 3,
      "prompt": "UNION 연산자의 특징으로 옳은 것은?",
      "choices": [
        "중복된 행을 제거하고 결과를 반환한다",
        "중복된 행을 모두 유지한다",
        "테이블을 수직으로 결합한다",
        "조인 연산을 수행한다"
      ],
      "answerIndex": 0,
      "explanation": "UNION은 기본적으로 중복 행을 제거한다",
      "stats": { "wrongCount": 0 },
      "createdAt": "2026-01-31T00:00:00.000Z",
      "updatedAt": "2026-01-31T00:00:00.000Z"
    }
  ],
  "blueprints": [],
  "attempts": [],
  "results": []
}`;

  const aiPrompt = `정보처리기사 필기 문제 생성을 위해 아래의 조건을 지켜야 함,
아래 조건을 만족하는 "4지선다 객관식" 문제를 생성해.

[목표]
- ExamMaker 앱에서 불러올 수 있는 JSON만 출력
- 출력은 반드시 JSON만, 설명/코드블록/여분 텍스트 금지

[출제 범위]
- 1과목 소프트웨어 설계: 요구사항 분석(유형/명세/추적성), UML(구조/행위, 유스케이스/클래스/시퀀스/상태/액티비티), 설계 원칙(정보은닉/추상화/모듈화/단계적분해/SOLID), 인터페이스 설계(명세서 구성/요구사항 검증/오류 처리)
- 2과목 소프트웨어 개발: 시간/공간 복잡도, 탐색(순차/이진), 재귀 개념/반복 비교, 테스트 케이스/테스트 오라클
- 3과목 DB 구축: 트랜잭션 ACID, SQL(서브쿼리/집합연산자/NULL), 병행제어(로킹/타임스탬프/낙관적), 뷰 목적/장단점
- 4과목 프로그래밍 언어 활용: OS(스케줄링 지표/시스템콜/인터럽트), C(call by value/ref, struct/union), Java(접근제어자/예외/throws/final), Python(리스트 컴프리헨션/얕은복사/깊은복사)
- 5과목 정보시스템 구축관리: 비용/일정/위험/인력, 방법론(폭포수/애자일/XP/테일러링), 형상관리(항목/통제/기록/감사), 품질(ISO/IEC 9126, 25010, Verification vs Validation), 보안(인증/인가/접근통제/암호화/백업/복구)

[문항 생성 규칙]
- 총 30문항 생성
- subject는 아래 5개 중 하나로만 작성
  - "소프트웨어 설계"
  - "소프트웨어 개발"
  - "데이터베이스 구축"
  - "프로그래밍 언어 활용"
  - "정보시스템 구축 관리"
- difficulty는 1~5 정수
- choices는 정확히 4개, 한국어 문장형 보기
- answerIndex는 0~3 중 정답의 인덱스
- explanation은 1~2문장으로 핵심 근거만
- 금지: 실제 기출을 그대로 복사한 문장, 특정 출처 문구 인용, 저작권 있는 원문 재현

[출력 포맷]
{
  "schemaVersion": 2,
  "questions": [
    {
      "id": "q_001",
      "subject": "...",
      "difficulty": 3,
      "prompt": "...",
      "choices": ["...", "...", "...", "..."],
      "answerIndex": 0,
      "explanation": "...",
      "stats": {"wrongCount": 0},
      "createdAt": "2026-01-31T00:00:00.000Z",
      "updatedAt": "2026-01-31T00:00:00.000Z"
    }
  ],
  "blueprints": [],
  "attempts": [],
  "results": []
}

반드시 위 형식을 지켜서 JSON만 출력.`;

  function CodeBlock({
    title,
    text,
    defaultOpen = false,
  }: {
    title: string;
    text: string;
    defaultOpen?: boolean;
  }) {
    const [open, setOpen] = useState(defaultOpen);
    const [copied, setCopied] = useState(false);

    async function copy() {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
      } catch {
        // clipboard 권한 실패 시 fallback
        try {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.left = "-9999px";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1200);
        } catch {
          alert("복사 실패");
        }
      }
    }

    return (
      <div className="stack">
        <div className="rowBetween">
          <div className="cardTitle" style={{ margin: 0 }}>
            {title}
          </div>
          <div className="row">
            <button className="btn" onClick={copy}>
              {copied ? "복사됨" : "복사"}
            </button>
            <button className="btn" onClick={() => setOpen((v) => !v)}>
              {open ? "접기" : "펼치기"}
            </button>
          </div>
        </div>

        {open && (
          <pre
            style={{
              margin: 0,
              padding: 12,
              borderRadius: 12,
              border: "1px solid var(--line)",
              background: "rgba(255,255,255,0.03)",
              overflow: "auto",
              fontSize: 12,
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
            }}
          >
            {text}
          </pre>
        )}
      </div>
    );
  }

  return (
    <div className="stackLg">
      <div className="card">
        <h2 className="cardTitle">설명서</h2>
        <p className="muted">
          ExamMaker 사용 방법, JSON 파일 형식, AI로 문항을 쉽게 만드는 방법 설명합니다
        </p>
      </div>

      <div className="card">
        <div className="cardTitle">기본 사용 흐름</div>
        <ol className="list">
          <li>[문제 창고]에서 문제를 추가하거나 예제 문항을 불러온다</li>
          <li>[시험 설정]에서 과목/검색/출제 대상을 선택하고 문항 수를 지정한다</li>
          <li>[시험 시작] 후 타이머를 보며 풀이하고 제출한다</li>
          <li>[결과]에서 과목별 성적과 오답을 확인하고 오답 노트로 반복한다</li>
          <li>중요!!! : 생성된 문항은 자동 저장 불가, JSON 내보내기를 사용해야 함</li>
        </ol>
      </div>

      <div className="card">
        <div className="cardTitle">JSON 파일 양식 명세</div>
        <div className="stack">
          <div className="muted">ExamMaker는 아래 구조의 JSON 양식을 따름</div>

          <ul className="list">
            <li>
              <b>schemaVersion</b>: 현재 2 고정
            </li>
            <li>
              <b>questions</b>: 문제 배열
            </li>
            <li>
              <b>blueprints / attempts / results</b>: 시험 기록용(예제는 빈 배열로 둬도 됨)
            </li>
          </ul>

          <div className="cardTitle">Question 객체 필드</div>
          <ul className="list">
            <li>
              <b>id</b>: 고유 문자열 (예: q_001)
            </li>
            <li>
              <b>subject</b>: 과목명 문자열
            </li>
            <li>
              <b>difficulty</b>: 1~5 정수
            </li>
            <li>
              <b>prompt</b>: 문제 지문
            </li>
            <li>
              <b>choices</b>: 보기 4개 문자열 배열
            </li>
            <li>
              <b>answerIndex</b>: 정답 보기 인덱스(0~3)
            </li>
            <li>
              <b>explanation</b>: 짧은 해설(1~2문장)
            </li>
            <li>
              <b>stats.wrongCount</b>: 오답 누적 횟수
            </li>
            <li>
              <b>createdAt / updatedAt</b>: ISO 문자열(없어도 앱이 크게 깨지진 않지만 예제는 넣는 것을 권장)
            </li>
          </ul>

          <CodeBlock title="예시 JSON" text={sampleJson} defaultOpen={false} />
        </div>
      </div>

      <div className="card">
        <div className="cardTitle">AI로 정처기 문항 생성하기</div>
        <p className="muted">
          아래 프롬프트를 AI에 그대로 붙여넣으면 ExamMaker에서 불러올 수 있는 JSON을 출력하도록 유도할 수 있음
        </p>

        <CodeBlock title="예시 프롬프트" text={aiPrompt} defaultOpen={false} />

        <div className="cardTitle" style={{ marginTop: 12 }}>
          주의
        </div>
        <ul className="list">
          <li>실제 기출 문장을 그대로 복사하지 않도록 조건을 넣는 게 안전함</li>
          <li>AI가 JSON 외 텍스트를 섞어 출력하면 불러오기에 실패할 수 있음</li>
          <li>불러오기 실패 시: JSON 문법 오류(쉼표/따옴표/대괄호)를 먼저 확인</li>
        </ul>
      </div>
    </div>
  );
}
