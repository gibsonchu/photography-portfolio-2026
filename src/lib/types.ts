export const categories = [
  "Events",
  "Portraits",
  "Personal Projects",
  "New York",
  "Travel",
  "Film Diaries",
] as const;

export type Category = (typeof categories)[number];

export type Photo = {
  id: string;
  title: string;
  src: string;
  width: number;
  height: number;
  caption?: string;
  location?: string;
  date?: string;
  camera?: string;
  filmStock?: string;
  alt: string;
  categories: Category[];
  featured: boolean;
  hero: boolean;
  visible: boolean;
  order: number;
};

export type Submission = {
  id: string;
  name: string;
  email: string;
  shootType: string;
  shootDate?: string;
  location?: string;
  budget?: string;
  message: string;
  createdAt: string;
};

export type SiteContent = {
  homeIntro: string;
  aboutText: string;
  photos: Photo[];
  submissions: Submission[];
};
