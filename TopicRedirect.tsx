import { Navigate, useParams } from "react-router-dom";
import { findLesson } from "@/data/lessons/registry";
import { LessonNotFound } from "./LessonNotFound";

/**
 * Every URL shape the site has ever published for a lesson resolves here and
 * is redirected to the canonical /lesson/<id> route. `replace` keeps the browser
 * back button working normally instead of trapping the user in a redirect loop.
 */
export function TopicRedirect() {
  const { topicSlug } = useParams();
  const lesson = findLesson(topicSlug);
  if (!lesson) return <LessonNotFound requested={topicSlug} />;
  return <Navigate to={`/lesson/${lesson.id}`} replace />;
}
