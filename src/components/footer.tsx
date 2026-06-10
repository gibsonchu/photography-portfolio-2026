import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <p>Gibson Chu / New York-based documentary photography.</p>
      <div>
        <Link href="/contact">Inquire</Link>
        <Link href="/admin">Admin</Link>
      </div>
    </footer>
  );
}
