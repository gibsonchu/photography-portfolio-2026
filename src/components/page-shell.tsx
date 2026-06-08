import type { ReactNode } from "react";
import { Footer } from "./footer";
import { Nav } from "./nav";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}
