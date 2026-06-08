"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";
import type { Photo } from "@/lib/types";

type Props = {
  photos: Photo[];
  showFilm?: boolean;
};

export function LightboxGrid({ photos, showFilm = false }: Props) {
  const [active, setActive] = useState<Photo | null>(null);

  return (
    <>
      <div className="masonry-grid">
        {photos.map((photo) => (
          <button
            key={photo.id}
            className="photo-card"
            type="button"
            onClick={() => setActive(photo)}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 760px) 100vw, 33vw"
            />
            <span>
              <strong>{photo.title}</strong>
              <small>
                {[photo.location, photo.date].filter(Boolean).join(" / ")}
                {showFilm && photo.filmStock ? ` / ${photo.filmStock}` : ""}
              </small>
            </span>
          </button>
        ))}
      </div>

      {active ? (
        <div className="lightbox" role="dialog" aria-modal="true">
          <button
            type="button"
            className="icon-button lightbox-close"
            onClick={() => setActive(null)}
            aria-label="Close image"
          >
            <X size={20} aria-hidden />
          </button>
          <div className="lightbox-image">
            <Image
              src={active.src}
              alt={active.alt}
              width={active.width}
              height={active.height}
              sizes="100vw"
              priority
            />
          </div>
          <aside>
            <p>{active.title}</p>
            {active.caption ? <span>{active.caption}</span> : null}
            <small>
              {[active.location, active.date, active.camera, active.filmStock]
                .filter(Boolean)
                .join(" / ")}
            </small>
          </aside>
        </div>
      ) : null}
    </>
  );
}
