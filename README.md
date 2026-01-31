# ExamMaker `v0.1.0-beta`  
> **https://hyunjaegit.github.io/ExamMaker/  
> 핵심 학습 기능을 담은 MVP 배포 버전입니다.**

ExamMaker는 사용자가 직접 객관식 4지선다 문제를 생성하고,  
선택한 문제로 모의시험을 구성하며,  
과목별 결과와 오답 노트를 통해 반복 학습할 수 있는 웹 기반 학습 플랫폼입니다.

---  
## 사용 대상  
- 국가기술자격 시험 수험생  
- 객관식 시험 기반 학습이 필요한 사용자

## 주요 기능

- **문제 창고**
    - 과목 / 난이도 기반 문제 생성 및 수정
    - 4지선다 객관식 구조 지원
    - JSON 파일 내보내기 / 불러오기

- **시험 설정**
    - 출제할 문제 선택
    - 문항 수 지정
    - 문제 및 보기 랜덤 섞기

- **시험 진행**
    - 문항 패널 기반 빠른 이동
    - 타이머 제공
    - 실전형 UI

- **결과 분석**
    - 과목별 정답률 확인
    - 시험 기록 관리
    - 오답 횟수 누적

- **오답 노트**
    - 틀린 문제 자동 분류
    - 재시험 기반 반복 학습

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | React 18, TypeScript |
| Build Tool | Vite |
| Routing | React Router (HashRouter) |
| Styling | CSS (Custom Design System) |
| Deployment | GitHub Pages |

---

## 프로젝트 구조
ExamMaker/ </br>
├─ src/ </br>
│ ├─ assets/ # 이미지 및 정적 리소스 </br>
│ ├─ components/ # 재사용 UI 컴포넌트 </br>
│ ├─ lib/ # 유틸리티 (파일 IO, 랜덤, ID 생성) </br>
│ ├─ pages/ # 라우트 단위 페이지    </br>
│ ├─ types/ # 타입 정의 </br>
│ └─ main.tsx  
├─ public/  
├─ package.json  
└─ vite.config.ts  
