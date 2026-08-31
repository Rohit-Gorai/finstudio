import { Link, Outlet, useLocation } from "react-router-dom";

type NavItem = { label: string; href: string };
const nav: NavItem[] = [
  { label: "Learn", href: "/" },
  { label: "Curriculum", href: "/curriculum" },
  { label: "Formulas", href: "/formulas" },
  { label: "Glossary", href: "/glossary" },
];

export function RootLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand" aria-label="FinStudio home"><span className="brand-mark" aria-hidden="true">F</span><span className="brand-name">Fin<em>Studio</em></span></Link>
          <nav className="topnav" aria-label="Primary">{nav.map((item) => <Link key={item.href} to={item.href} className={location.pathname === item.href ? "active" : ""}>{item.label}</Link>)}</nav>
          <div className="topbar-actions"><Link className="search-link" to="/search" aria-label="Search FinStudio">⌕ <span>Search</span></Link><Link className="btn-primary" to="/curriculum">Start learning</Link></div>
        </div>
      </header>
      <main id="main" tabIndex={-1}><Outlet /></main>
      <footer className="site-footer">
        <div className="footer-inner">
          <p className="footer-statement">Every number, <span>built by you.</span></p>
          <div className="footer-cols">
            <div><h3>Learn</h3><Link to="/curriculum">Curriculum</Link><Link to="/formulas">Formula library</Link><Link to="/glossary">Glossary</Link></div>
            <div><h3>Explore</h3><Link to="/paths">Learning paths</Link><Link to="/lab">Modeling Lab</Link><Link to="/search">Search</Link></div>
            <div><h3>About</h3><a href="https://github.com/Rohit-Gorai/finstudio" rel="noreferrer">Source on GitHub</a><a href="https://github.com/Rohit-Gorai/finstudio/issues" rel="noreferrer">Report an error</a></div>
            <div><h3>Notes</h3><span>Educational content only</span><span>Not investment, accounting or tax advice</span><span>₹ / en-IN formats; concepts are global</span></div>
          </div>
          <p className="footer-credit">Designed and developed by <strong>Rohit Gorai</strong> · © {new Date().getFullYear()} Rohit Gorai</p>
        </div>
      </footer>
    </div>
  );
}
