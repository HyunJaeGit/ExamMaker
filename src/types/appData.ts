import type { Question } from "./question";

export type ExamAttemptStatus = "READY" | "IN_PROGRESS" | "SUBMITTED";

export type ExamBlueprint = {
  id: string;
  title: string;
  selectedQuestionIds: string[];
  questionCount: number;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  createdAt: string;
};

export type ExamAttempt = {
  id: string;
  blueprintId: string;
  title: string;

  status: ExamAttemptStatus;

  questionIds: string[];
  answers: Record<string, (0 | 1 | 2 | 3) | null>;

  startedAt?: string;
  submittedAt?: string;

  // questionId -> display order of original indices
  choiceOrder: Record<string, [0, 1, 2, 3]>;
};

export type ExamResult = {
  attemptId: string;

  durationSec: number;

  total: {
    correct: number;
    total: number;
    scorePercent: number;
  };

  bySubject: Record<
    string,
    {
      correct: number;
      total: number;
      scorePercent: number;
    }
  >;

  wrongQuestionIds: string[];
};

export type AppData = {
  schemaVersion: 2;
  questions: Question[];
  blueprints: ExamBlueprint[];
  attempts: ExamAttempt[];
  results: ExamResult[];
};
