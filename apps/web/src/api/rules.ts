import { ruleCategories } from '../data/rules';
import type { RuleCategory } from '../types';
import type { ApiResult } from './client';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchRules(): Promise<ApiResult<RuleCategory[]>> {
  await delay(180);
  return {
    status: 'success',
    data: ruleCategories,
    updatedAt: new Date().toISOString(),
  };
}
