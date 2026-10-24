import { CartItem, Coupon, Currency, LeaderboardPlayer, ChatMessage } from '../types/index.ts';

/**
 * Validates a standard Minecraft username (3-16 chars, alphanumeric and underscores)
 */
export function validateMinecraftUsername(username: string): { valid: boolean; error?: string } {
  const trimmed = username.trim();
  if (!trimmed) {
    return { valid: false, error: 'Minecraft username cannot be empty.' };
  }
  if (trimmed.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters.' };
  }
  if (trimmed.length > 16) {
    return { valid: false, error: 'Username cannot exceed 16 characters.' };
  }
  const validRegex = /^[a-zA-Z0-9_]+$/;
  if (!validRegex.test(trimmed)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores.' };
  }
  return { valid: true };
}

/**
 * Calculates cart subtotal, discount, and final amount based on items, coupon, and currency (INR/USD)
 */
export function calculateCartTotals(
  items: CartItem[],
  coupon: Coupon | null,
  currency: Currency
): {
  subtotal: number;
  discount: number;
  finalTotal: number;
} {
  const subtotal = items.reduce((sum, cartItem) => {
    const unitPrice = currency === 'USD' ? cartItem.item.priceUSD : cartItem.item.priceINR;
    return sum + unitPrice * cartItem.quantity;
  }, 0);

  let discount = 0;
  if (coupon && coupon.active) {
    const minSpend = currency === 'USD' ? coupon.minSpendINR / 83 : coupon.minSpendINR;
    if (subtotal >= minSpend) {
      if (currency === 'USD') {
        discount = Number(((subtotal * coupon.discountPercent) / 100).toFixed(2));
      } else {
        discount = Math.round((subtotal * coupon.discountPercent) / 100);
      }
    }
  }

  const finalTotal = Math.max(0, currency === 'USD' ? Number((subtotal - discount).toFixed(2)) : subtotal - discount);

  return {
    subtotal,
    discount,
    finalTotal,
  };
}

/**
 * Formats currency display (₹ INR or $ USD)
 */
export function formatCurrency(amount: number, currency: Currency): string {
  if (currency === 'USD') {
    return `$${amount.toFixed(2)}`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Generates unique formatted invoice ID like VOID-2026-X8B2
 */
export function generateInvoiceNumber(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `VOID-2026-${rand}`;
}

/**
 * Sorts and ranks players based on selected leaderboard category
 */
export function calculateLeaderboardRanking(
  players: LeaderboardPlayer[],
  category: 'kills' | 'playtime' | 'balance' | 'crates' | 'elo'
): LeaderboardPlayer[] {
  const sorted = [...players].sort((a, b) => {
    if (category === 'kills') return b.kills - a.kills;
    if (category === 'playtime') return b.playtimeHours - a.playtimeHours;
    if (category === 'balance') return b.balanceCoins - a.balanceCoins;
    if (category === 'crates') return b.cratesOpened - a.cratesOpened;
    if (category === 'elo') return b.pvpElo - a.pvpElo;
    return 0;
  });

  return sorted.map((p, idx) => ({
    ...p,
    rank: idx + 1,
  }));
}

/**
 * Calculates winning segment from wheel rotation in degrees
 */
export function calculatePvPWheelWinner(
  rotationDegrees: number,
  segments: string[]
): { index: number; mode: string } {
  if (segments.length === 0) {
    return { index: 0, mode: '' };
  }
  const sliceSize = 360 / segments.length;
  const normalized = (rotationDegrees % 360 + 360) % 360;
  const pointerAngle = (360 - normalized) % 360;
  const index = Math.floor(pointerAngle / sliceSize) % segments.length;
  return { index, mode: segments[index] };
}

/**
 * Filters chat logs
 */
export function filterChatLogs(
  logs: ChatMessage[],
  searchQuery: string,
  filterFlaggedOnly: boolean
): ChatMessage[] {
  const query = searchQuery.trim().toLowerCase();
  return logs.filter((log) => {
    if (filterFlaggedOnly && !log.flagged) {
      return false;
    }
    if (!query) return true;
    return (
      log.player.toLowerCase().includes(query) ||
      log.message.toLowerCase().includes(query) ||
      log.channel.toLowerCase().includes(query)
    );
  });
}
