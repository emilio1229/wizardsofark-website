import { communityActivity, communityCategories, communityMedia } from '../data/community';
import type { CommunityActivity, CommunityCategory, CommunityMediaItem } from '../types';
import type { ApiResult } from './client';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchCommunityCategories(): Promise<ApiResult<CommunityCategory[]>> {
  await delay(180);
  return {
    status: 'success',
    data: communityCategories,
    updatedAt: new Date().toISOString(),
  };
}

export async function fetchCommunityActivity(): Promise<ApiResult<CommunityActivity[]>> {
  await delay(220);
  return {
    status: 'success',
    data: communityActivity,
    updatedAt: new Date().toISOString(),
  };
}

export async function fetchCommunityMedia(): Promise<ApiResult<CommunityMediaItem[]>> {
  await delay(220);
  return {
    status: 'success',
    data: communityMedia,
    updatedAt: new Date().toISOString(),
  };
}
