import { LightboxGrid } from "@/components/lightbox-grid";
import { PageShell } from "@/components/page-shell";
import { getSiteContent, photosFor } from "@/lib/data";

export default async function EventsPage() {
  const content = await getSiteContent();

  return (
    <PageShell>
      <section className="page-title">
        <p>Events</p>
        <h1>
          I photograph events with a documentary eye, focusing on natural
          moments, atmosphere, people, and the small details that make a
          gathering feel alive.
        </h1>
      </section>
      <section className="section">
        <LightboxGrid photos={photosFor(content, "Events")} />
      </section>
    </PageShell>
  );
}
