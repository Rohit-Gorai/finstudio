import { createHashRouter } from "react-router-dom";

/** Generate hash-route URLs for GitHub Pages project sites. */
export const hashHref = (path: string) => `#${path.startsWith("/") ? path : `/${path}`}`;

/** Normalize links that may have been authored as BrowserRouter paths. */
export const toHashPath = (path: string) => {
  if (path.startsWith("#/")) return path;
  if (path.startsWith("/")) return `#${path}`;
  return `#/${path}`;
};

export const router = createHashRouter;
