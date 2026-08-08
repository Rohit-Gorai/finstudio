import { Link, Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="sticky top-0 z-30 border-b border-border bg-surface">
        <div className="flex h-14 items-center gap-6 px-4 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-ink no-underline hover:no-underline"
          >
            <span
              aria-hidden="true"
              className="grid h-7 w-7 place-items-center rounded bg-brand text-caption font-bold text-white"
            >
              F
            </span>
            <span className="text-h4">FinSchool</span>
          </Link>
          <p className="hidden text-caption text-ink-2 sm:block">
            The W3Schools of Finance
          </p>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="px-4 py-10 sm:px-6">
        <Outlet />
      </main>

      <footer className="mt-16 border-t border-border bg-surface-2 px-4 py-8 text-center text-caption text-ink-2">
        <p className="measure">
          FinSchool is free and open source. Text and exercises use Indian
          formats (₹, en-IN grouping); the concepts are global. Not investment
          or tax advice.
        </p>
      </footer>
    </>
  );
}
