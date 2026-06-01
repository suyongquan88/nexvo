import { deriveSearchKeyword } from "@/lib/recommendation/normalize";

/**
 * Marketplace configuration (static defaults).
 *
 * Future admin management: replace `getMarketplaces()` implementation to load
 * overrides from PostgreSQL / admin API while keeping this type and helpers stable.
 */

export type Marketplace = {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
  searchUrlTemplate: string;
};

/** Bump when default catalog changes (admin sync / cache invalidation). */
export const MARKETPLACE_CONFIG_VERSION = 1;

const KEYWORD_PLACEHOLDER = "{keyword}";

export const DEFAULT_MARKETPLACES: Marketplace[] = [
  {
    id: "shopee",
    name: "Shopee",
    enabled: true,
    priority: 1,
    searchUrlTemplate: "https://shopee.sg/search?keyword={keyword}",
  },
  {
    id: "lazada",
    name: "Lazada",
    enabled: true,
    priority: 2,
    searchUrlTemplate: "https://www.lazada.sg/catalog/?q={keyword}",
  },
  {
    id: "tiktok_shop",
    name: "TikTok Shop",
    enabled: true,
    priority: 3,
    searchUrlTemplate: "https://www.tiktok.com/search?q={keyword}",
  },
];

export function generateMarketplaceLink(
  marketplace: Marketplace,
  searchKeyword: string
): string {
  const keyword = encodeURIComponent(deriveSearchKeyword(searchKeyword));
  return marketplace.searchUrlTemplate.replace(KEYWORD_PLACEHOLDER, keyword);
}

/**
 * Source of truth for runtime marketplace list.
 * Admin v1: fetch merged config from API and fall back to defaults.
 */
export function getMarketplaces(): Marketplace[] {
  return DEFAULT_MARKETPLACES.map((marketplace) => ({ ...marketplace }));
}

export function getEnabledMarketplaces(): Marketplace[] {
  return getMarketplaces()
    .filter((marketplace) => marketplace.enabled)
    .sort((a, b) => a.priority - b.priority);
}

export type MarketplaceLink = {
  marketplace: Marketplace;
  url: string;
};

export function getMarketplaceLinksForProduct(
  searchKeyword: string
): MarketplaceLink[] {
  const keyword = deriveSearchKeyword(searchKeyword);
  if (!keyword) return [];

  return getEnabledMarketplaces().map((marketplace) => ({
    marketplace,
    url: generateMarketplaceLink(marketplace, keyword),
  }));
}
