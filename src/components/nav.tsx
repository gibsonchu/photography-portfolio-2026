import Link from "next/link";

const links = [
  ["Work", "/#work"],
  ["Events", "/events"],
  ["Portraits", "/portraits"],
  ["Personal", "/personal"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

export function Nav() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Gibson Chu home">
        <span className="brand-mark">GC</span>
        <span>Gibson Chu</span>
        <small>NYC / Photo</small>
      </Link>
      <nav aria-label="Main navigation">
        {links.map(([label, href]) => (
          <Link href={href} key={href}>
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
