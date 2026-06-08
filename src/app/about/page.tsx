import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { getSiteContent, publicPhotos } from "@/lib/data";

export default async function AboutPage() {
  const content = await getSiteContent();
  const portrait =
    publicPhotos(content).find((photo) => photo.categories.includes("Portraits")) ||
    publicPhotos(content)[0];

  return (
    <PageShell>
      <section className="about-layout">
        <div className="about-image">
          <Image
            src={portrait.src}
            alt="Portrait placeholder for Gibson Chu"
            width={portrait.width}
            height={portrait.height}
            sizes="(max-width: 900px) 100vw, 42vw"
          />
        </div>
        <div>
          <p className="eyebrow">About</p>
          <h1>Documentary sensibility for commissioned and personal work.</h1>
          <p>{content.aboutText}</p>
        </div>
      </section>
    </PageShell>
  );
}
