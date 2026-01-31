import { useState } from "react";
import type { AppData } from "../types/appData";

type Props = {
  setApp: (next: AppData) => void;
};

const SAMPLE = {
  id: "ip-001",
  title: "정보처리기사",
  fileName: "정보처리기사-ExamMaker.json",
  description:
    "정처기 모의고사 샘플 문항입니다. 바로 불러오거나 파일로 다운로드 가능",
};

export default function SamplesPage({ setApp }: Props) {
  const [loading, setLoading] = useState(false);

  async function loadSample() {
    setLoading(true);
    try {
      // HashRouter 사용 중이라도 public 리소스는 루트로 접근됨
      const res = await fetch(`${import.meta.env.BASE_URL}${encodeURIComponent(SAMPLE.fileName)}`);
      if (!res.ok) throw new Error("fetch failed");
      const data = (await res.json()) as AppData;
      setApp(data);
      alert("예제 문항 불러오기 성공했습니다. 문제 창고/시험 설정에서 바로 사용 가능");
    } catch {
      alert("불러오기 실패 : 문의(fatking25@kakao.com)");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="stackLg">
      <div className="card">
        <h2 className="cardTitle">예제 파일 불러오기</h2>
        <p className="muted">
          사이트에서 기본 제공되는 예제 문항입니다
        </p>
        <p className="muted">
          다운로드 하거나 앱에 바로 불러올 수 있습니다
        </p>
      </div>

      <div className="card">
        <div className="rowBetween">
          <div className="stack">
            <h3 className="cardTitle">{SAMPLE.title}</h3>
            <p className="muted">{SAMPLE.description}</p>
            <div className="muted" style={{ fontSize: 12 }}>
              파일: {SAMPLE.fileName}
            </div>
          </div>

          <div className="row">
            <a href={`${import.meta.env.BASE_URL}${encodeURIComponent(SAMPLE.fileName)}`} download>
              <button className="btn">다운로드</button>
            </a>

            <button
              className="btn btnPrimary"
              onClick={loadSample}
              disabled={loading}
            >
              {loading ? "불러오는 중..." : "바로 불러오기"}
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="cardTitle">사용 팁</div>
        <ul className="list">
          <li>바로 불러오기 후 문제 창고에서 샘플 문제를 확인할 수 있음</li>
          <li>시험 설정에서 문항 수를 조절해 모의고사를 만듦</li>
          <li>필요하면 내보내기(JSON)로 다운로드</li>
        </ul>
      </div>
    </div>
  );
}
