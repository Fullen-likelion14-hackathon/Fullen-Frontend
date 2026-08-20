const ASSET_CACHE_VERSION = "2";

export const withAssetCacheVersion = (url: string) => {
  if (!url) return url;

  const separator = url.includes("?") ? "&" : "?";

  return `${url}${separator}v=${ASSET_CACHE_VERSION}`;
};
