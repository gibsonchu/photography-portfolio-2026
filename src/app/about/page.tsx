import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { getSiteContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getSiteContent();
  const portrait = content.aboutPortrait;

  return (
    <PageShell>
      <section className="about-layout">
        <div className="about-image">
          <Image
            src={portrait.src}
            alt={portrait.alt}
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
