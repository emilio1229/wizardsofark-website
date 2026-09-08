import { useQuery } from '@tanstack/react-query';
import { fetchServerById, fetchServers } from '../api/servers';
import { fetchCouncil } from '../api/council';
import { fetchShopItems, fetchEosBalance } from '../api/shop';
import { fetchCommunityActivity, fetchCommunityCategories, fetchCommunityMedia } from '../api/community';
import { fetchRules } from '../api/rules';

export function useServers() {
  return useQuery({
    queryKey: ['servers'],
    queryFn: fetchServers,
    refetchInterval: 45_000,
  });
}

export function useServer(serverId: string) {
  return useQuery({
    queryKey: ['servers', serverId],
    queryFn: () => fetchServerById(serverId),
    enabled: Boolean(serverId),
    refetchInterval: 45_000,
  });
}

export function useCouncil() {
  return useQuery({
    queryKey: ['council'],
    queryFn: fetchCouncil,
  });
}

export function useShopItems() {
  return useQuery({
    queryKey: ['shop', 'items'],
    queryFn: fetchShopItems,
  });
}

export function useEosBalance() {
  return useQuery({
    queryKey: ['shop', 'balance'],
    queryFn: fetchEosBalance,
  });
}

export function useCommunity() {
  const categories = useQuery({
    queryKey: ['community', 'categories'],
    queryFn: fetchCommunityCategories,
  });
  const activity = useQuery({
    queryKey: ['community', 'activity'],
    queryFn: fetchCommunityActivity,
  });

  return { categories, activity };
}

export function useCommunityMedia() {
  return useQuery({
    queryKey: ['community', 'media'],
    queryFn: fetchCommunityMedia,
  });
}

export function useRules() {
  return useQuery({
    queryKey: ['rules'],
    queryFn: fetchRules,
  });
}
