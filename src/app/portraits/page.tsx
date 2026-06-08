import { LightboxGrid } from "@/components/lightbox-grid";
import { PageShell } from "@/components/page-shell";
import { getSiteContent, photosFor } from "@/lib/data";

export default async function PortraitsPage() {
  const content = await getSiteContent();

  return (
    <PageShell>
      <section className="page-title">
        <p>Portraits</p>
        <h1>
          Portrait sessions are relaxed, natural, and shaped around the person,
          place, and mood of the shoot.
        </h1>
      </section>
      <section className="section">
        <LightboxGrid photos={photosFor(content, "Portraits")} />
      </section>
    </PageShell>
  );
}
