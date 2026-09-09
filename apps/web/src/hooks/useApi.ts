import {
  useGetServersNetworkQuery,
  useGetServerByIdQuery,
  useGetCouncilQuery,
  useGetShopItemsQuery,
  useGetEosBalanceQuery,
  useGetCommunityCategoriesQuery,
  useGetCommunityActivityQuery,
  useGetCommunityMediaQuery,
  useGetRulesQuery,
} from '../store/api/apiSlice';
import type { ApiResult } from '../api/client';

type QueryLike<T> = {
  data?: T;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  fulfilledTimeStamp?: number;
  refetch: () => unknown;
};

function wrapQueryResult<T>(
  query: QueryLike<T>,
  fallbackError: string,
): {
  data: ApiResult<T> | undefined;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  dataUpdatedAt: number;
  refetch: () => unknown;
} {
  let data: ApiResult<T> | undefined;
  if (query.data !== undefined) {
    data = {
      status: 'success',
      data: query.data,
      updatedAt: new Date(query.fulfilledTimeStamp ?? Date.now()).toISOString(),
    };
  } else if (query.isError) {
    data = {
      status: 'error',
      error: new Error(fallbackError),
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching,
    dataUpdatedAt: query.fulfilledTimeStamp ?? 0,
    refetch: query.refetch,
  };
}

/** RTK Query adapter — preserves prior hook names used across pages. */
export function useServersNetwork() {
  const query = useGetServersNetworkQuery(undefined, {
    pollingInterval: 60_000,
    refetchOnMountOrArgChange: true,
  });
  return wrapQueryResult(query, 'Failed to load servers');
}

/** @deprecated Prefer useServersNetwork */
export function useServers() {
  return useServersNetwork();
}

export function useServer(serverId: string) {
  const query = useGetServerByIdQuery(serverId, {
    skip: !serverId,
    pollingInterval: 60_000,
  });
  return wrapQueryResult(query, 'Failed to load server');
}

export function useCouncil() {
  const query = useGetCouncilQuery(undefined);
  return wrapQueryResult(query, 'Failed to load council');
}

export function useShopItems() {
  const query = useGetShopItemsQuery(undefined);
  return wrapQueryResult(query, 'Failed to load shop');
}

export function useEosBalance() {
  const query = useGetEosBalanceQuery(undefined);
  return wrapQueryResult(query, 'Failed to load balance');
}

export function useCommunity() {
  const categories = useGetCommunityCategoriesQuery(undefined);
  const activity = useGetCommunityActivityQuery(undefined);

  return {
    categories: wrapQueryResult(categories, 'Failed to load community categories'),
    activity: wrapQueryResult(activity, 'Failed to load community activity'),
  };
}

export function useCommunityMedia() {
  const query = useGetCommunityMediaQuery(undefined);
  return wrapQueryResult(query, 'Failed to load media');
}

export function useRules() {
  const query = useGetRulesQuery(undefined);
  return wrapQueryResult(query, 'Failed to load rules');
}
