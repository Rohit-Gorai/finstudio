import { createHashRouter, Navigate } from "react-router-dom";
import { RootLayout } from "@/app/RootLayout";
import { HomePage } from "@/app/routes/HomePage";
import { CurriculumPage } from "@/app/routes/CurriculumPage";
import { FormulasPage } from "@/app/routes/FormulasPage";
import { GlossaryPage } from "@/app/routes/GlossaryPage";
import { StyleGuidePage } from "@/app/routes/StyleGuidePage";
import { NotFoundPage } from "@/app/routes/NotFoundPage";
import { LessonPage } from "@/app/routes/LessonPage";
import { TopicRedirect } from "@/app/routes/TopicRedirect";
import { ModulePage } from "@/app/routes/ModulePage";
import { LevelLandingPage } from "@/app/routes/LevelLandingPage";

/**
 * Hash routing is retained deliberately: GitHub Pages has no server-side
 * rewrite, and a hash URL is resolved entirely in the browser, so a direct
 * visit and a refresh behave identically. See public/404.html for the rescue
 * that converts a path-style URL into its hash equivalent.
 */
export const router = createHashRouter([
  {
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "curriculum", element: <CurriculumPage /> },
      { path: "curriculum/matrix", element: <CurriculumPage /> },
      { path: "level/:levelId", element: <LevelLandingPage /> },
      { path: "module/:moduleId", element: <ModulePage /> },

      // Canonical lesson route.
      { path: "lesson/:lessonId", element: <LessonPage /> },

      // Legacy shapes, all redirected to the canonical route.
      { path: "topic/:topicSlug", element: <TopicRedirect /> },
      { path: "lab/topic/:topicSlug", element: <TopicRedirect /> },
      { path: "cases/:topicSlug", element: <TopicRedirect /> },

      { path: "formulas", element: <FormulasPage /> },
      { path: "ref/formulas", element: <Navigate to="/formulas" replace /> },
      { path: "glossary", element: <GlossaryPage /> },
      { path: "style-guide", element: <StyleGuidePage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
