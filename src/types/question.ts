export type Question = {
  id: string;
  subject: string;
  difficulty: number; // 1~5
  prompt: string;
  choices: [string, string, string, string];
  answerIndex: 0 | 1 | 2 | 3;
  explanation?: string;
  stats: {
    wrongCount: number; // 다음 단계용
  };
  createdAt: string;
  updatedAt: string;
};
