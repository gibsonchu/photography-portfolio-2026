import { LightboxGrid } from "@/components/lightbox-grid";
import { PageShell } from "@/components/page-shell";
import { getSiteContent, photosFor } from "@/lib/data";

const subcategories = ["New York", "Travel", "Film Diaries"] as const;

export default async function PersonalPage() {
  const content = await getSiteContent();

  return (
    <PageShell>
      <section className="page-title">
        <p>Personal Projects</p>
        <h1>
          My personal work is rooted in walking, observing, and photographing
          everyday life on film. That same attention to light, place, and gesture
          carries into my commissioned work.
        </h1>
      </section>
      {subcategories.map((category) => (
        <section className="section" key={category}>
          <div className="section-heading">
            <p>{category}</p>
          </div>
          <LightboxGrid photos={photosFor(content, category)} showFilm />
        </section>
      ))}
    </PageShell>
  );
}
