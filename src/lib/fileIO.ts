import type { Question } from "../types/question";
import type { AppData } from "../types/appData";

type BankFileV1 =
  | Question[]
  | {
      schemaVersion?: number;
      questions: Question[];
    };

function emptyAppData(): AppData {
  return {
    schemaVersion: 2,
    questions: [],
    blueprints: [],
    attempts: [],
    results: [],
  };
}

export function downloadAppDataAsJson(app: AppData) {
  const blob = new Blob([JSON.stringify(app, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "exammaker-data.json";
  a.click();

  URL.revokeObjectURL(url);
}

export async function readAppDataFromFile(file: File): Promise<AppData> {
  const text = await file.text();
  const parsed = JSON.parse(text) as unknown;

  // v2
  if (
    typeof parsed === "object" &&
    parsed !== null &&
    (parsed as any).schemaVersion === 2 &&
    Array.isArray((parsed as any).questions)
  ) {
    const app = parsed as AppData;
    // 최소 방어
    app.blueprints ??= [];
    app.attempts ??= [];
    app.results ??= [];
    return app;
  }

  // v1 (questions만)
  const v1 = parsed as BankFileV1;
  const questions = Array.isArray(v1) ? v1 : (v1 as any)?.questions;

  if (!Array.isArray(questions)) {
    throw new Error("Invalid file format");
  }

  const app = emptyAppData();
  app.questions = questions as Question[];
  return app;
}
