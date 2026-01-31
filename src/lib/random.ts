export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sample<T>(arr: T[], count: number): T[] {
  if (count >= arr.length) return shuffle(arr);
  return shuffle(arr).slice(0, count);
}

export function choiceOrder4(): [0, 1, 2, 3] {
  const o = shuffle([0, 1, 2, 3]) as number[];
  return [o[0], o[1], o[2], o[3]] as [0, 1, 2, 3];
}
