import { shopBalanceDemo, shopItems } from '../data/shop';
import type { ShopItem } from '../types';
import type { ApiResult } from './client';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchShopItems(): Promise<ApiResult<ShopItem[]>> {
  await delay(250);
  return {
    status: 'success',
    data: shopItems,
    updatedAt: new Date().toISOString(),
  };
}

export async function fetchEosBalance(): Promise<ApiResult<number>> {
  await delay(150);
  return {
    status: 'success',
    data: shopBalanceDemo,
    updatedAt: new Date().toISOString(),
  };
}
