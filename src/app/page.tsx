import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryEntry } from "@/components/category-entry";
import { PageShell } from "@/components/page-shell";
import { getSiteContent, photosFor, publicPhotos } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getSiteContent();
  const photos = publicPhotos(content);
  const hero = photos.find((photo) => photo.hero) || photos[0];
  const events = photosFor(content, "Events")[0] || hero;
  const portraits = photosFor(content, "Portraits")[0] || hero;
  const personal = photosFor(content, "Personal Projects")[0] || hero;

  return (
    <PageShell>
      <section className="hero">
        <div className="hero-image">
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            sizes="100vw"
            priority
            loading="eager"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="hero-copy">
          <p>Gibson Chu</p>
          <h1>{content.homeIntro}</h1>
        </div>
      </section>

      <section className="section intro-band">
        <p>
          Available for events, portraits, and documentary commissions.
        </p>
        <Link href="/contact" className="button-link">
          Inquire <ArrowRight size={16} aria-hidden />
        </Link>
      </section>

      <section className="section" id="work">
        <div className="section-heading">
          <p>Selected Work</p>
          <h2>People, gatherings, cities, and the spaces around them.</h2>
        </div>
        <div className="entry-grid">
          <CategoryEntry title="Events" href="/events" photo={events} />
          <CategoryEntry title="Portraits" href="/portraits" photo={portraits} />
          <CategoryEntry
            title="Personal Projects"
            href="/personal"
            photo={personal}
          />
        </div>
      </section>
    </PageShell>
  );
}
