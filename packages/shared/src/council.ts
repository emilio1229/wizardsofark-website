export type CouncilMemberDto = {
  id: string;
  name: string;
  title: string;
  role: string;
  tagline: string | null;
  avatar: string | null;
  portrait: string | null;
  energyColor: string | null;
  bio: string | null;
  responsibilities: string[];
  accessLevel: string | null;
  status: string | null;
  quote: string | null;
  angle: number | null;
  sortOrder: number;
};

export type ArkMapDto = {
  id: string;
  name: string;
  displayName: string;
  imagePath: string | null;
  sortOrder: number;
};
