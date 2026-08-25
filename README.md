# ExamMaker

사용자가 직접 객관식 문제를 등록하고, 선택한 문제로 모의시험을 구성해 CBT 방식으로 학습할 수 있도록 만든 웹 애플리케이션입니다.

서버나 별도 데이터베이스 없이 브라우저에서 동작하는 프론트엔드 중심의 CBT MVP로 구현했습니다.

## Live Demo

[ExamMaker 바로 실행하기](https://hyunjaegit.github.io/ExamMaker/)

---

## 주요 기능

### 문제 관리

* 객관식 4지선다 문제 등록
* 문제 수정
* 과목 / 난이도 관리
* JSON Import / Export

### 모의시험

* 출제할 문제 선택
* 시험 문항 수 설정
* 문제 순서 랜덤 구성
* 보기 순서 랜덤 구성

### CBT

* 시험 타이머
* 문항별 이동
* 응답 여부 확인
* 시험 제출 및 자동 채점

### 결과 및 오답

* 전체 점수 확인
* 과목별 정답률 확인
* 틀린 문제 자동 기록
* 오답 횟수 누적
* 오답 재학습

---

## Service Flow

```text
문제 등록
   ↓
문제 선택
   ↓
모의시험 생성
   ↓
CBT 응시
   ↓
자동 채점
   ↓
오답 저장
   ↓
재학습
```

---

## Tech Stack

| 구분         | 기술                    |
| ---------- | --------------------- |
| Frontend   | React 18              |
| Language   | TypeScript            |
| Build Tool | Vite                  |
| Routing    | React Router          |
| Storage    | Browser Local Storage |
| Deployment | GitHub Pages          |

---

## Project Structure

```text
src/
├─ assets/
├─ components/
├─ lib/
├─ pages/
├─ types/
└─ main.tsx
```

---

## 프로젝트 범위

ExamMaker는 별도 서버 없이 브라우저에서 CBT 학습 흐름을 구현하는 데 초점을 맞춘 프로젝트입니다.

문제 데이터와 시험 기록은 클라이언트 환경에서 관리하며, 회원 인증이나 서버 DB 기반 사용자 데이터 관리 기능은 포함하지 않습니다.

이후 진행한 CBT 학습 서비스에서는 Spring Boot, MySQL, 인증, 서버 기반 시험·오답 데이터 관리까지 범위를 확장했습니다.
