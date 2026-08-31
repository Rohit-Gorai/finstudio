import { allTopics } from "./masterCurriculum";

const STORAGE_KEY = "finstudio.completedTopics.v1";

export function readCompletedTopics(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const values = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(values) ? values.filter((x): x is string => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}

export function markTopicComplete(slug: string): void {
  if (typeof window === "undefined" || !slug) return;
  const completed = readCompletedTopics();
  completed.add(slug);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
  window.dispatchEvent(new CustomEvent("finstudio:progress", { detail: { slug } }));
}

export function topicIsComplete(slug: string): boolean {
  return readCompletedTopics().has(slug);
}

export function progressForTopics(slugs: string[]) {
  const completed = readCompletedTopics();
  const done = slugs.filter(slug => completed.has(slug)).length;
  return { done, total: slugs.length, remaining: Math.max(0, slugs.length - done), percent: slugs.length ? Math.round((done / slugs.length) * 100) : 0 };
}

export function moduleProgress(level: number, module: string) {
  return progressForTopics(allTopics.filter(x => x.level === level && x.module === module).map(x => x.slug));
}

export function levelProgress(level: number) {
  return progressForTopics(allTopics.filter(x => x.level === level).map(x => x.slug));
}

export function curriculumProgress() {
  return progressForTopics(allTopics.map(x => x.slug));
}
