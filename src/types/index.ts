export type ServerStatus =
  | 'online'
  | 'offline'
  | 'restarting'
  | 'possibly_updating'
  | 'maintenance';

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
  mapName?: string;
  status: ServerStatus;
  players: number;
  maxPlayers: number;
  playerUtilization?: number | null;
  gameMode?: string;
  type?: string;
  ip?: string;
  gamePort?: number;
  queryPort?: number | null;
  version?: string | null;
  lastSeen?: string | null;
  lastChecked?: string;
};

export type ServerDetail = ServerSummary & {
  ip: string;
  port: number;
  gamePort?: number;
  queryPort?: number | null;
  uptimeSeconds?: number;
  version: string;
  lastRestart?: string;
  nextRestart?: string;
  firstSeen?: string;
  lastSeen?: string | null;
  lastChecked?: string;
  missingSince?: string | null;
  description: string;
  mods: string[];
  settings: Array<{ label: string; value: string }>;
  rules: string[];
  recentPlayers: PlayerSummary[];
  statusExplanation?: string | null;
  statusHistory?: Array<{
    fromStatus: ServerStatus | null;
    toStatus: ServerStatus;
    observedAt: string;
    note: string | null;
  }>;
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
