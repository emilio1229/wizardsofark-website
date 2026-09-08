export type CouncilMemberStatus = 'online' | 'offline' | 'away';

export type CouncilMember = {
  id: string;
  name: string;
  /** Short role label shown in the profile panel (e.g. Systems & Development) */
  role: string;
  /** Council title shown under the orb (e.g. Arcane Technomancer) */
  title: string;
  tagline: string;
  avatar: string;
  portrait: string;
  energyColor: string;
  bio: string;
  responsibilities: string[];
  accessLevel?: string;
  status?: CouncilMemberStatus;
  quote?: string;
  /** Optional preferred angle in degrees (0 = right, -90 = top). */
  angle?: number;
};
