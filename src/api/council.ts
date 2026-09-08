import { councilMembers } from '../data/council';
import type { CouncilMember } from '../types';
import type { ApiResult } from './client';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchCouncil(): Promise<ApiResult<CouncilMember[]>> {
  await delay(200);
  return {
    status: 'success',
    data: councilMembers,
    updatedAt: new Date().toISOString(),
  };
}
