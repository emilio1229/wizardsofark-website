export type ServerStatus = 'online' | 'offline' | 'restarting' | 'maintenance';

export type NavLinkItem = {
  label: string;
  to: string;
};

export type ArkMap = {
  id: string;
  name: string;
  image: string;
  icon?: string;
};

export type ServerSummary = {
  id: string;
  name: string;
  mapId: string;
  status: ServerStatus;
  players: number;
  maxPlayers: number;
  gameMode: string;
  type?: string;
};

export type ServerDetail = ServerSummary & {
  ip: string;
  port: number;
  uptimeSeconds: number;
  version: string;
  lastRestart: string;
  nextRestart: string;
  description: string;
  mods: string[];
  settings: Array<{ label: string; value: string }>;
  rules: string[];
  recentPlayers: PlayerSummary[];
};

export type PlayerSummary = {
  id: string;
  name: string;
  avatar?: string;
  tribe?: string;
};

export type {
  CouncilMember,
  CouncilMemberStatus,
} from './council';

export type FeatureCardData = {
  id: string;
  title: string;
  description: string;
  icon: string;
  to: string;
};

export type CommunityCategory = {
  id: string;
  title: string;
  description: string;
  icon: string;
  to: string;
};

export type CommunityActivity = {
  id: string;
  type: 'event' | 'guide' | 'build' | 'media';
  title: string;
  summary: string;
  actionLabel: string;
  to: string;
  image?: string;
};

export type MediaKind = 'image' | 'video';

export type CommunityMediaItem = {
  id: string;
  kind: MediaKind;
  title: string;
  description: string;
  /** Poster / thumbnail image */
  thumbnail: string;
  /** Full image path for kind=image */
  src?: string;
  /** External or embed URL for kind=video (YouTube, etc.) */
  videoUrl?: string;
  tags?: string[];
  credit?: string;
  createdAt?: string;
};

export type ShopCategory =
  | 'featured'
  | 'structures'
  | 'skins'
  | 'utilities'
  | 'creatures'
  | 'decor';

export type ShopItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ShopCategory;
  image: string;
  featured?: boolean;
};

export type RuleItem = {
  id: string;
  text: string;
};

export type RuleCategory = {
  id: string;
  title: string;
  icon?: string;
  rules: RuleItem[];
};

export type PermissionRole =
  | 'guest'
  | 'member'
  | 'vip'
  | 'moderator'
  | 'council'
  | 'admin'
  | 'realm_master';
