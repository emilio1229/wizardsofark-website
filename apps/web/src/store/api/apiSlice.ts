import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type {
  ApiEnvelope,
  ArkMapDto,
  CouncilMemberDto,
  LiveServer,
  ServersNetworkResponse,
} from '@woa/shared';
import type { ServerDetail } from '../../types';
import type { CouncilMember } from '../../types/council';
import { serverEnrichmentByMapId } from '../../data/serverEnrichment';
import { fetchShopItems, fetchEosBalance } from '../../api/shop';
import {
  fetchCommunityActivity,
  fetchCommunityCategories,
  fetchCommunityMedia,
} from '../../api/community';
import { fetchRules } from '../../api/rules';

function toCouncilMember(dto: CouncilMemberDto): CouncilMember {
  return {
    id: dto.id,
    name: dto.name,
    title: dto.title,
    role: dto.role,
    tagline: dto.tagline ?? '',
    avatar: dto.avatar ?? '',
    portrait: dto.portrait ?? '',
    energyColor: dto.energyColor ?? '#9B5CFF',
    bio: dto.bio ?? '',
    responsibilities: dto.responsibilities ?? [],
    accessLevel: dto.accessLevel ?? undefined,
    status: (dto.status as CouncilMember['status']) ?? undefined,
    quote: dto.quote ?? undefined,
    angle: dto.angle ?? undefined,
  };
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || '/api/v1',
});

/** Unwrap Nest `{ data, meta }` envelopes. */
const baseQueryWithEnvelope: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error) {
    return result;
  }
  const body = result.data as ApiEnvelope<unknown> | unknown;
  if (body && typeof body === 'object' && 'data' in body) {
    return { data: (body as ApiEnvelope<unknown>).data, meta: result.meta };
  }
  return result;
};

function toServerDetail(live: LiveServer): ServerDetail {
  const enrichment = serverEnrichmentByMapId[live.mapId];
  return {
    id: live.id,
    name: live.name,
    mapId: live.mapId,
    mapName: live.map,
    status: live.status,
    players: live.players ?? 0,
    maxPlayers: live.maxPlayers ?? 0,
    playerUtilization: live.playerUtilization,
    gameMode: live.isPve === null ? 'Unknown' : live.isPve ? 'PvE' : 'PvP',
    type: 'Unofficial',
    ip: live.ip,
    port: live.gamePort,
    gamePort: live.gamePort,
    queryPort: live.queryPort,
    version: live.version ?? 'Unavailable',
    firstSeen: live.firstSeen,
    lastSeen: live.lastSeen,
    lastChecked: live.lastChecked,
    missingSince: live.missingSince,
    description:
      enrichment?.description ??
      `${live.map} — live status from the public ASA unofficial server list.`,
    mods: enrichment?.mods ?? [],
    settings: enrichment?.settings ?? [],
    rules: enrichment?.rules ?? ['Follow General and Building rules'],
    recentPlayers: [],
    statusExplanation: live.statusExplanation ?? null,
    statusHistory: live.statusHistory,
  };
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithEnvelope,
  tagTypes: ['Servers', 'Server', 'Maps', 'Council', 'Shop', 'Community', 'Rules'],
  endpoints: (builder) => ({
    getServersNetwork: builder.query<ServersNetworkResponse, void>({
      query: () => '/servers',
      providesTags: ['Servers'],
    }),
    getServerById: builder.query<ServerDetail | null, string>({
      query: (id) => `/servers/${encodeURIComponent(id)}`,
      transformResponse: (live: LiveServer) => toServerDetail(live),
      providesTags: (_result, _error, id) => [{ type: 'Server', id }],
    }),
    getMaps: builder.query<ArkMapDto[], void>({
      query: () => '/maps',
      providesTags: ['Maps'],
    }),
    getCouncil: builder.query<CouncilMember[], void>({
      query: () => '/council',
      transformResponse: (rows: CouncilMemberDto[]) => rows.map(toCouncilMember),
      providesTags: ['Council'],
    }),
    getShopItems: builder.query({
      async queryFn() {
        const result = await fetchShopItems();
        if (result.status === 'error') {
          return { error: { status: 500, data: result.error } as FetchBaseQueryError };
        }
        return { data: result.data };
      },
      providesTags: ['Shop'],
    }),
    getEosBalance: builder.query({
      async queryFn() {
        const result = await fetchEosBalance();
        if (result.status === 'error') {
          return { error: { status: 500, data: result.error } as FetchBaseQueryError };
        }
        return { data: result.data };
      },
      providesTags: ['Shop'],
    }),
    getCommunityCategories: builder.query({
      async queryFn() {
        const result = await fetchCommunityCategories();
        if (result.status === 'error') {
          return { error: { status: 500, data: result.error } as FetchBaseQueryError };
        }
        return { data: result.data };
      },
      providesTags: ['Community'],
    }),
    getCommunityActivity: builder.query({
      async queryFn() {
        const result = await fetchCommunityActivity();
        if (result.status === 'error') {
          return { error: { status: 500, data: result.error } as FetchBaseQueryError };
        }
        return { data: result.data };
      },
      providesTags: ['Community'],
    }),
    getCommunityMedia: builder.query({
      async queryFn() {
        const result = await fetchCommunityMedia();
        if (result.status === 'error') {
          return { error: { status: 500, data: result.error } as FetchBaseQueryError };
        }
        return { data: result.data };
      },
      providesTags: ['Community'],
    }),
    getRules: builder.query({
      async queryFn() {
        const result = await fetchRules();
        if (result.status === 'error') {
          return { error: { status: 500, data: result.error } as FetchBaseQueryError };
        }
        return { data: result.data };
      },
      providesTags: ['Rules'],
    }),
  }),
});

export const {
  useGetServersNetworkQuery,
  useGetServerByIdQuery,
  useGetMapsQuery,
  useGetCouncilQuery,
  useGetShopItemsQuery,
  useGetEosBalanceQuery,
  useGetCommunityCategoriesQuery,
  useGetCommunityActivityQuery,
  useGetCommunityMediaQuery,
  useGetRulesQuery,
} = apiSlice;
