import { LightboxGrid } from "@/components/lightbox-grid";
import { PageShell } from "@/components/page-shell";
import { getSiteContent, photosFor } from "@/lib/data";

export const dynamic = "force-dynamic";

const groups = ["Events", "Portraits", "Personal Projects"] as const;

export default async function PortfolioPage() {
  const content = await getSiteContent();

  return (
    <PageShell>
      <section className="page-title">
        <p>Portfolio</p>
        <h1>Commissioned and personal photographs with a documentary pulse.</h1>
      </section>
      {groups.map((group) => (
        <section className="section" key={group}>
          <div className="section-heading">
            <p>{group}</p>
          </div>
          <LightboxGrid
            photos={photosFor(content, group)}
            showFilm={group === "Personal Projects"}
          />
        </section>
      ))}
    </PageShell>
  );
}
