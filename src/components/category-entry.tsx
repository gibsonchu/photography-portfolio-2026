import Image from "next/image";
import Link from "next/link";
import type { Photo } from "@/lib/types";

type Props = {
  title: string;
  href: string;
  photo: Photo;
};

export function CategoryEntry({ title, href, photo }: Props) {
  return (
    <Link href={href} className="entry-tile">
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes="(max-width: 760px) 100vw, 33vw"
      />
      <span>{title}</span>
    </Link>
  );
}
