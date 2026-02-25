export type ProjectMedia = {
  type: 'video' | 'image';
  url: string;
  caption?: string;
};

export type ProjectCredit = {
  role: string;
  name: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  platform: string;
  format: string;
  logline: string;
  synopsis: string;
  heroImageUrl: string;
  thumbnailUrl: string;
  releaseYear: number;
  featured: boolean;
  media: ProjectMedia[];
  credits: ProjectCredit[];
};

export type Founder = {
  id: string;
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
};
