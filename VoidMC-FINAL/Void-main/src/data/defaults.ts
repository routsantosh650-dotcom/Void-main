import { PlatformLinks, SiteContent } from '../types/index.ts';

export const DEFAULT_LINKS: PlatformLinks = {
  discord: 'https://discord.gg/J64n9aEsW',
  youtube: 'https://www.youtube.com/@voidsmp-r7i',
  instagram: 'https://www.instagram.com/play.voidmc.fun',
  store: 'https://void-main.routsantosh650-dotcom.workers.dev/#store',
  whatsapp: '',
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  discountEnabled: false,
  discountBannerTitle: '🔥 LIMITED TIME — 20% OFF ACROSS THE STORE',
  discountBannerSub: 'Discounted prices are auto-applied at checkout. No coupon code needed.',
  links: DEFAULT_LINKS,
};

export function mergeSiteContent(partial?: Partial<SiteContent> | null): SiteContent {
  return {
    ...DEFAULT_SITE_CONTENT,
    ...(partial || {}),
    links: { ...DEFAULT_LINKS, ...(partial?.links || {}) },
  };
}
