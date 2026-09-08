/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EOS_SHOP?: string;
  readonly VITE_FEATURE_SEARCH?: string;
  readonly VITE_FEATURE_THEME?: string;
  readonly VITE_FEATURE_ACCOUNT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
