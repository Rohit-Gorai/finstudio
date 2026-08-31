import { createHashRouter } from "react-router-dom";
import { RootLayout } from "@/app/RootLayout";
import { HomePage } from "@/app/routes/HomePage";
import { CurriculumPage } from "@/app/routes/CurriculumPage";
import { FormulasPage } from "@/app/routes/FormulasPage";
import { GlossaryPage } from "@/app/routes/GlossaryPage";
import { StyleGuidePage } from "@/app/routes/StyleGuidePage";
import { NotFoundPage } from "@/app/routes/NotFoundPage";
import { TopicPage } from "@/app/routes/TopicPage";
import { ModulePage } from "@/app/routes/ModulePage";
import { LevelLandingPage } from "@/app/routes/LevelLandingPage";

export const router = createHashRouter([
  { element: <RootLayout />, errorElement: <NotFoundPage />, children: [
    { index: true, element: <HomePage /> },
    { path: "curriculum", element: <CurriculumPage /> },
    { path: "curriculum/matrix", element: <CurriculumPage /> },
    { path: "level/:levelId", element: <LevelLandingPage /> },
    { path: "module/:moduleId", element: <ModulePage /> },
    { path: "topic/:topicSlug", element: <TopicPage /> },
    { path: "formulas", element: <FormulasPage /> },
    { path: "glossary", element: <GlossaryPage /> },
    { path: "style-guide", element: <StyleGuidePage /> },
    { path: "*", element: <NotFoundPage /> },
  ]},
]);
