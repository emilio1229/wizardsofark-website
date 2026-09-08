/**
 * Site feature toggles.
 *
 * Defaults are off until the feature is ready.
 * Override at build time with matching `VITE_*` env vars set to `"true"`.
 */
export const features = {
  /** In-site EOS catalogue. When false, /shop uses Discord ticket flow. */
  eosShop: import.meta.env.VITE_EOS_SHOP === 'true',
  /** Header search control. */
  search: import.meta.env.VITE_FEATURE_SEARCH === 'true',
  /** Header theme toggle. */
  themeToggle: import.meta.env.VITE_FEATURE_THEME === 'true',
  /** Header account avatar / auth entry. */
  account: import.meta.env.VITE_FEATURE_ACCOUNT === 'true',
} as const;
