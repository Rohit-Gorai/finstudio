import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/app/RootLayout";
import { HomePage } from "@/app/routes/HomePage";
import { StyleGuidePage } from "@/app/routes/StyleGuidePage";
import { NotFoundPage } from "@/app/routes/NotFoundPage";

// Real paths, not hashes — a prerequisite for per-lesson SEO
// (PROJECT_ANALYSIS.md §3.2). `base` comes from Vite so the router and the
// asset URLs agree on the /finschool/ project-site prefix.
export const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      errorElement: <NotFoundPage />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "style-guide", element: <StyleGuidePage /> },
        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, "") || "/" },
);
