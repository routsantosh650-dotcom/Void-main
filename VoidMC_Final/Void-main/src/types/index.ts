export type Currency = 'INR' | 'USD';
export type Language = 'en' | 'hi' | 'hinglish';

export interface UserAccount {
  uid: string;
  username: string;
  email?: string;
  role: 'player' | 'staff' | 'admin';
  rank: string;
  coins: number;
  avatarUrl: string;
  createdAt: string;
}

export interface StoreItem {
  id: string;
  name: string;
  category: 'rank' | 'crate_key' | 'coins' | 'rank_coins' | 'key_coins';
  priceINR: number;
  priceUSD: number;
  priceCoins?: number;
  coinsReward?: number;
  tagline?: string;
  badge?: string;
  iconType: string;
  features: string[];
  duration?: string;
  stock?: number;
}

export interface CartItem {
  item: StoreItem;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  active: boolean;
  minSpendINR: number;
  usageCount: number;
  description: string;
}

export interface Order {
  id: string;
  invoiceNumber: string;
  minecraftUsername: string;
  playerEmail?: string;
  items: {
    id: string;
    name: string;
    category: string;
    quantity: number;
    unitPrice: number;
    currency: Currency;
  }[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  total: number;
  currency: Currency;
  paymentMethod: 'UPI_QR' | 'CARD_STRIPE' | 'PAYPAL';
  status: 'PENDING_VERIFICATION' | 'COMPLETED' | 'CANCELLED';
  utrTransactionId?: string;
  createdAt: string;
  discordShared: boolean;
}

export interface LeaderboardPlayer {
  rank: number;
  username: string;
  kills: number;
  deaths: number;
  kd: number;
  playtimeHours: number;
  balanceCoins: number;
  cratesOpened: number;
  pvpElo: number;
  tier: string;
  serverRank: string;
  isOnline: boolean;
}

export interface ChatMessage {
  id: string;
  timestamp: string;
  player: string;
  rank: string;
  message: string;
  channel: 'global' | 'pvp' | 'trade' | 'staff';
  flagged?: boolean;
}

export interface BanRecord {
  id: string;
  player: string;
  reason: string;
  bannedBy: string;
  bannedAt: string;
  expiresAt: string;
  active: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  staffName: string;
  action: string;
  details: string;
  category: 'server' | 'store' | 'ban' | 'chat';
}

export interface ServerConfig {
  serverName: string;
  ip: string;
  port: number;
  bedrockPort: number;
  motd: string;
  maintenanceMode: boolean;
  whitelistEnabled: boolean;
  maxPlayers: number;
  onlinePlayers?: number;
  pvpEnabled: boolean;
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  announcementBanner: string;
  nodeLocation: string;
  ramTotalGB: number;
}
