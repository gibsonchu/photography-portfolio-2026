import Link from "next/link";
import { Camera } from "lucide-react";

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
        <Camera size={18} aria-hidden />
        <span>Gibson Chu</span>
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
