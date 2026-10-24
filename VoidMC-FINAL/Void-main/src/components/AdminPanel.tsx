import React, { useEffect, useRef, useState } from 'react';
import { Shield, Settings, MessageSquare, Ban, Tag, ShoppingBag, FileText, Check, AlertTriangle, Plus, Trash2, Edit3, RefreshCw, Trophy, UserPlus, Percent, Crown, ImagePlus, Link2, Upload } from 'lucide-react';
import { ServerConfig, ChatMessage, BanRecord, StoreItem, Coupon, Order, AuditLog, LeaderboardPlayer, SiteContent, ShowcaseImage } from '../types/index.ts';
import { filterChatLogs, formatCurrency } from '../utils/pureRules.ts';
import { compressImageFile } from '../utils/imageUpload.ts';
import { DEFAULT_LINKS } from '../data/defaults.ts';

interface AdminPanelProps {
  config: ServerConfig;
  onUpdateConfig: (newConfig: ServerConfig) => void;
  chatLogs: ChatMessage[];
  bans: BanRecord[];
  onAddBan: (ban: BanRecord) => void;
  onRemoveBan: (id: string) => void;
  storeItems: StoreItem[];
  onUpdateStoreItems: (items: StoreItem[]) => void;
  coupons: Coupon[];
  onUpdateCoupons: (coupons: Coupon[]) => void;
  orders: Order[];
  onApproveOrder: (orderId: string) => void;
  onViewInvoice: (order: Order) => void;
  auditLogs: AuditLog[];
  onRecordAudit: (action: string, details: string, category: AuditLog['category']) => void;
  leaderboardPlayers: LeaderboardPlayer[];
  onUpdateLeaderboard: (players: LeaderboardPlayer[]) => void;
  siteContent: SiteContent;
  onUpdateSiteContent: (content: SiteContent) => void;
  showcasePhotos: ShowcaseImage[];
  onAddShowcasePhoto: (photo: ShowcaseImage) => void;
  onRemoveShowcasePhoto: (id: string) => void;
  onRenameShowcasePhoto: (id: string, caption: string) => void;
  staffName: string;
  onLogout: () => void;
}

const PRODUCT_CATEGORIES: StoreItem['category'][] = [
  'rank',
  'crate_key',
  'coins',
  'rank_coins',
  'key_coins',
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  config,
  onUpdateConfig,
  chatLogs,
  bans,
  onAddBan,
  onRemoveBan,
  storeItems,
  onUpdateStoreItems,
  coupons,
  onUpdateCoupons,
  orders,
  onApproveOrder,
  onViewInvoice,
  auditLogs,
  onRecordAudit,
  leaderboardPlayers,
  onUpdateLeaderboard,
  siteContent,
  onUpdateSiteContent,
  showcasePhotos,
  onAddShowcasePhoto,
  onRemoveShowcasePhoto,
  onRenameShowcasePhoto,
  staffName,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'chat' | 'bans' | 'store' | 'products' | 'showcase' | 'links' | 'orders' | 'audit' | 'leaderboard'>('config');
  const log = (action: string, details: string, category: AuditLog['category']) =>
    onRecordAudit(action, details, category);

  // Config local state
  const [motd, setMotd] = useState(config.motd);
  const [announcement, setAnnouncement] = useState(config.announcementBanner);
  const [maxPlayers, setMaxPlayers] = useState(config.maxPlayers);
  const [maintenance, setMaintenance] = useState(config.maintenanceMode);
  const [whitelist, setWhitelist] = useState(config.whitelistEnabled);
  const [pvp, setPvp] = useState(config.pvpEnabled);
  const [difficulty, setDifficulty] = useState(config.difficulty);
  const [configSaved, setConfigSaved] = useState(false);

  // Chat viewer filters
  const [chatSearch, setChatSearch] = useState('');
  const [flaggedOnly, setFlaggedOnly] = useState(false);

  // Ban management inputs
  const [banPlayer, setBanPlayer] = useState('');
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState('7 Days');

  // New Coupon inputs
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(20);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Leaderboard management
  const [newPlayerUsername, setNewPlayerUsername] = useState('');
  const [newPlayerKills, setNewPlayerKills] = useState(0);
  const [newPlayerDeaths, setNewPlayerDeaths] = useState(0);
  const [newPlayerPlaytime, setNewPlayerPlaytime] = useState(0);
  const [newPlayerBalance, setNewPlayerBalance] = useState(0);
  const [newPlayerCrates, setNewPlayerCrates] = useState(0);
  const [newPlayerElo, setNewPlayerElo] = useState(1000);
  const [newPlayerTier, setNewPlayerTier] = useState('Default');
  const [newPlayerRank, setNewPlayerRank] = useState('DEFAULT');
  const [newPlayerOnline, setNewPlayerOnline] = useState(false);

  // Save server configurations
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ServerConfig = {
      ...config,
      motd,
      announcementBanner: announcement,
      maxPlayers: Number(maxPlayers),
      maintenanceMode: maintenance,
      whitelistEnabled: whitelist,
      pvpEnabled: pvp,
      difficulty,
    };
    onUpdateConfig(updated);
    log(
      'SERVER_CONFIG_UPDATE',
      `Updated MOTD, MaxPlayers=${maxPlayers}, Maintenance=${maintenance}`,
      'server'
    );
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2500);
  };

  // Add ban
  const handleCreateBan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!banPlayer.trim() || !banReason.trim()) return;

    const newBan: BanRecord = {
      id: `ban_${Date.now()}`,
      player: banPlayer.trim(),
      reason: banReason.trim(),
      bannedBy: 'Santosh_rout (Supervisor)',
      bannedAt: new Date().toLocaleDateString(),
      expiresAt: banDuration,
      active: true,
    };
    onAddBan(newBan);
    log('PLAYER_BANNED', `Banned ${banPlayer.trim()} for: "${banReason.trim()}" (${banDuration})`, 'ban');
    setBanPlayer('');
    setBanReason('');
  };

  const handleLiftBan = (ban: BanRecord) => {
    onRemoveBan(ban.id);
    log('PLAYER_UNBANNED', `Lifted the ${ban.expiresAt} ban on ${ban.player}`, 'ban');
  };

  // Create coupon
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const newCoupon: Coupon = {
      code: newCouponCode.trim().toUpperCase(),
      discountPercent: Number(newCouponDiscount),
      active: true,
      minSpendINR: 50,
      usageCount: 0,
      description: newCouponDesc.trim() || `${newCouponDiscount}% Discount Voucher`,
    };
    onUpdateCoupons([newCoupon, ...coupons]);
    log('COUPON_CREATED', `Created promo code ${newCoupon.code} (${newCoupon.discountPercent}% OFF)`, 'store');
    setNewCouponCode('');
    setNewCouponDesc('');
  };

  // ---- PRODUCT CATALOG MANAGEMENT (prices, discounts, Most Popular, add/delete) ----
  const patchItem = (itemId: string, patch: Partial<StoreItem>, auditDetails?: string) => {
    const updated = storeItems.map((item) => (item.id === itemId ? { ...item, ...patch } : item));
    onUpdateStoreItems(updated);
    if (auditDetails) log('STORE_PRODUCT_EDIT', auditDetails, 'store');
  };

  const handleUpdateItemPrice = (itemId: string, newINR: number) => {
    if (!Number.isFinite(newINR) || newINR <= 0) return;
    const item = storeItems.find((i) => i.id === itemId);
    if (!item || item.priceINR === newINR) return;
    patchItem(
      itemId,
      {
        priceINR: newINR,
        priceUSD: Number((newINR / 80).toFixed(2)),
        priceCoins: Math.round(newINR * 11.4),
      },
      `Updated price of "${item?.name ?? itemId}" to ₹${newINR}`
    );
  };

  const handleUpdateItemDiscount = (itemId: string, raw: string) => {
    const value = raw.trim();
    const parsed = Number(value);
    const patch: Partial<StoreItem> =
      value === '' || !Number.isFinite(parsed) || parsed <= 0
        ? { discountINR: undefined, discountUSD: undefined }
        : { discountINR: parsed, discountUSD: Number((parsed / 80).toFixed(2)) };
    const item = storeItems.find((i) => i.id === itemId);
    patchItem(
      itemId,
      patch,
      value === ''
        ? `Cleared discounted price for "${item?.name ?? itemId}"`
        : `Set discounted price of "${item?.name ?? itemId}" to ₹${parsed}`
    );
  };

  const handleTogglePopular = (itemId: string, next: boolean) => {
    const item = storeItems.find((i) => i.id === itemId);
    patchItem(itemId, { popular: next }, `Marked "${item?.name ?? itemId}" Most Popular = ${next}`);
  };

  const handleDeleteItem = (itemId: string) => {
    const item = storeItems.find((i) => i.id === itemId);
    onUpdateStoreItems(storeItems.filter((i) => i.id !== itemId));
    log('STORE_PRODUCT_DELETED', `Deleted product "${item?.name ?? itemId}" (${item?.category ?? 'unknown'})`, 'store');
  };

  const [draft, setDraft] = useState<Partial<StoreItem>>({ category: 'rank' });
  const [draftFeatures, setDraftFeatures] = useState('');

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const name = (draft.name || '').trim();
    const priceINR = Number(draft.priceINR);
    if (!name || !Number.isFinite(priceINR) || priceINR <= 0) return;

    const id = (name.toLowerCase().replace(/[^a-z0-9]+/g, '_') + '_' + Date.now().toString(36).slice(-4));
    const newItem: StoreItem = {
      id,
      name,
      category: (draft.category as StoreItem['category']) || 'rank',
      priceINR,
      priceUSD: Number((priceINR / 80).toFixed(2)),
      priceCoins: draft.priceCoins ? Number(draft.priceCoins) : Math.round(priceINR * 11.4),
      coinsReward: draft.coinsReward ? Number(draft.coinsReward) : undefined,
      duration: draft.duration?.trim() || undefined,
      badge: draft.badge?.trim() || undefined,
      tagline: draft.tagline?.trim() || undefined,
      iconType: draft.iconType?.trim() || 'sparkle',
      features: draftFeatures
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean),
      popular: !!draft.popular,
    };
    onUpdateStoreItems([...storeItems, newItem]);
    log('STORE_PRODUCT_ADDED', `Added new product "${name}" (${newItem.category}) at ₹${priceINR}`, 'store');
    setDraft({ category: 'rank' });
    setDraftFeatures('');
  };

  // ---- DISCOUNT SYSTEM ----
  const [bannerTitle, setBannerTitle] = useState(siteContent.discountBannerTitle);
  const [bannerSub, setBannerSub] = useState(siteContent.discountBannerSub);
  const [bannerSaved, setBannerSaved] = useState(false);

  const handleToggleDiscount = (next: boolean) => {
    onUpdateSiteContent({ ...siteContent, discountEnabled: next });
    log('STORE_DISCOUNT_TOGGLE', `Store-wide discount banner turned ${next ? 'ON' : 'OFF'}`, 'store');
  };

  const handleSaveDiscountBanner = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteContent({
      ...siteContent,
      discountBannerTitle: bannerTitle.trim() || siteContent.discountBannerTitle,
      discountBannerSub: bannerSub.trim(),
    });
    log('STORE_DISCOUNT_BANNER', 'Updated discount banner text', 'store');
    setBannerSaved(true);
    setTimeout(() => setBannerSaved(false), 2500);
  };

  // ---- SHOWCASE GALLERY ----
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleUploadPhotos = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadBusy(true);
    setUploadError('');
    let uploaded = 0;
    for (const file of Array.from(files)) {
      try {
        const dataUrl = await compressImageFile(file);
        onAddShowcasePhoto({
          id: `shot_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          dataUrl,
          caption: file.name.replace(/\.[^.]+$/, ''),
          createdAt: Date.now(),
        });
        uploaded += 1;
      } catch {
        setUploadError(`${file.name} could not be processed. Pick a JPG, PNG or WEBP file.`);
      }
    }
    if (uploaded > 0) {
      log('SHOWCASE_UPLOADED', `Uploaded ${uploaded} showcase photo(s) to the website gallery`, 'server');
    }
    setUploadBusy(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveShot = (id: string) => {
    const shot = showcasePhotos.find((s) => s.id === id);
    onRemoveShowcasePhoto(id);
    log('SHOWCASE_DELETED', `Deleted showcase photo "${shot?.caption || id}"`, 'server');
  };

  // ---- PLATFORM LINKS ----
  const [linksDraft, setLinksDraft] = useState({ ...DEFAULT_LINKS, ...siteContent.links });
  const [linksSaved, setLinksSaved] = useState(false);

  // Pull in saved values only when the stored content actually changes, so that
  // unrelated writes don't wipe half-typed input.
  const syncedKey = useRef('');
  useEffect(() => {
    const key = JSON.stringify({
      title: siteContent.discountBannerTitle,
      sub: siteContent.discountBannerSub,
      links: siteContent.links,
    });
    if (key === syncedKey.current) return;
    syncedKey.current = key;
    setBannerTitle(siteContent.discountBannerTitle);
    setBannerSub(siteContent.discountBannerSub);
    setLinksDraft({ ...DEFAULT_LINKS, ...siteContent.links });
  }, [siteContent.discountBannerTitle, siteContent.discountBannerSub, siteContent.links]);

  const handleSaveLinks = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteContent({ ...siteContent, links: linksDraft });
    log('PLATFORM_LINKS_UPDATE', 'Updated website platform links (Discord, YouTube, Instagram, store, WhatsApp)', 'server');
    setLinksSaved(true);
    setTimeout(() => setLinksSaved(false), 2500);
  };

  const filteredLogs = filterChatLogs(chatLogs, chatSearch, flaggedOnly);

  const navCls = (tab: typeof activeTab) =>
    `flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
      activeTab === tab
        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
        : 'bg-[#150D24] text-slate-400 hover:text-white border border-purple-900/40'
    }`;
  const fieldCls =
    'w-full px-3 py-2 rounded-xl bg-[#160D26] border border-purple-800/60 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-purple-400';
  const labelCls = 'block text-xs font-mono uppercase text-slate-300 font-bold mb-1';

  // Add new player to leaderboard
  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerUsername.trim()) return;

    const newPlayer: LeaderboardPlayer = {
      rank: leaderboardPlayers.length + 1,
      username: newPlayerUsername.trim(),
      kills: Number(newPlayerKills),
      deaths: Number(newPlayerDeaths),
      kd: newPlayerDeaths > 0 ? Number((newPlayerKills / newPlayerDeaths).toFixed(1)) : newPlayerKills,
      playtimeHours: Number(newPlayerPlaytime),
      balanceCoins: Number(newPlayerBalance),
      cratesOpened: Number(newPlayerCrates),
      pvpElo: Number(newPlayerElo),
      tier: newPlayerTier,
      serverRank: newPlayerRank,
      isOnline: newPlayerOnline,
    };
    onUpdateLeaderboard([...leaderboardPlayers, newPlayer]);
    log('LEADERBOARD_ADD', `Added player ${newPlayer.username} to leaderboard`, 'server');
    setNewPlayerUsername('');
    setNewPlayerKills(0);
    setNewPlayerDeaths(0);
    setNewPlayerPlaytime(0);
    setNewPlayerBalance(0);
    setNewPlayerCrates(0);
    setNewPlayerElo(1000);
    setNewPlayerTier('Default');
    setNewPlayerRank('DEFAULT');
    setNewPlayerOnline(false);
  };

  // Remove player from leaderboard
  const handleRemovePlayer = (username: string) => {
    onUpdateLeaderboard(leaderboardPlayers.filter((p) => p.username !== username));
    log('LEADERBOARD_REMOVE', `Removed player ${username} from leaderboard`, 'server');
  };

  // Clear all leaderboard data
  const handleClearLeaderboard = () => {
    onUpdateLeaderboard([]);
    log('LEADERBOARD_CLEAR', 'Cleared all leaderboard data', 'server');
  };

  return (
    <div className="py-12 bg-[#0B0713]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="bg-[#130C22] border border-purple-800/60 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white font-heading">
                  VOIDMC MODERATOR & ADMIN PANEL
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
                  STAFF MODE ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Singapore Node Control • Logged in as {staffName || 'Admin Staff'} • all changes save to the live database
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 text-red-200 text-xs font-mono font-bold transition-colors"
          >
            Exit Staff Panel
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'config'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-[#150D24] text-slate-400 hover:text-white border border-purple-900/40'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Server Config</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'orders'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-[#150D24] text-slate-400 hover:text-white border border-purple-900/40'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders & Billing ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'chat'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-[#150D24] text-slate-400 hover:text-white border border-purple-900/40'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat Log Viewer</span>
          </button>

          <button
            onClick={() => setActiveTab('bans')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'bans'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-[#150D24] text-slate-400 hover:text-white border border-purple-900/40'
            }`}
          >
            <Ban className="w-4 h-4" />
            <span>Ban Management ({bans.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'store'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-[#150D24] text-slate-400 hover:text-white border border-purple-900/40'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Store & Discounts</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={navCls('products')}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Products ({storeItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('showcase')}
            className={navCls('showcase')}
          >
            <ImagePlus className="w-4 h-4" />
            <span>Showcase Photos ({showcasePhotos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('links')}
            className={navCls('links')}
          >
            <Link2 className="w-4 h-4" />
            <span>Platform Links</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'audit'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-[#150D24] text-slate-400 hover:text-white border border-purple-900/40'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Audit Logs ({auditLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'leaderboard'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-[#150D24] text-slate-400 hover:text-white border border-purple-900/40'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Leaderboard ({leaderboardPlayers.length})</span>
          </button>
        </div>

        {/* TAB 1: SERVER CONFIG */}
        {activeTab === 'config' && (
          <form onSubmit={handleSaveConfig} className="bg-[#110A1F] border border-purple-900/40 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white font-heading">CORE SERVER PARAMETERS</h2>

            {configSaved && (
              <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 font-mono">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Configuration changes successfully deployed to node!</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase text-purple-300 font-bold mb-1.5">
                  Server MOTD (Message of the Day)
                </label>
                <input
                  type="text"
                  value={motd}
                  onChange={(e) => setMotd(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#160D26] border border-purple-800/60 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-purple-300 font-bold mb-1.5">
                  Live Announcement Banner
                </label>
                <input
                  type="text"
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#160D26] border border-purple-800/60 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-purple-300 font-bold mb-1.5">
                  Max Player Slots (Current: {maxPlayers})
                </label>
                <input
                  type="number"
                  min="50"
                  max="1000"
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#160D26] border border-purple-800/60 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-purple-300 font-bold mb-1.5">
                  Server Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'EASY' | 'NORMAL' | 'HARD')}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#160D26] border border-purple-800/60 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-purple-400 cursor-pointer"
                >
                  <option value="EASY">EASY</option>
                  <option value="NORMAL">NORMAL</option>
                  <option value="HARD">HARD (Default Void Season 5)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-purple-900/40 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="p-4 rounded-xl bg-[#160D26] border border-purple-900/30 flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white font-mono">Maintenance Mode</div>
                  <div className="text-[11px] text-slate-400">Lock non-staff players</div>
                </div>
                <input
                  type="checkbox"
                  checked={maintenance}
                  onChange={(e) => setMaintenance(e.target.checked)}
                  className="accent-purple-600 w-5 h-5 rounded cursor-pointer"
                />
              </label>

              <label className="p-4 rounded-xl bg-[#160D26] border border-purple-900/30 flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white font-mono">Whitelist Protection</div>
                  <div className="text-[11px] text-slate-400">Strict member access</div>
                </div>
                <input
                  type="checkbox"
                  checked={whitelist}
                  onChange={(e) => setWhitelist(e.target.checked)}
                  className="accent-purple-600 w-5 h-5 rounded cursor-pointer"
                />
              </label>

              <label className="p-4 rounded-xl bg-[#160D26] border border-purple-900/30 flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white font-mono">Global PvP Mode</div>
                  <div className="text-[11px] text-slate-400">Player damage enabled</div>
                </div>
                <input
                  type="checkbox"
                  checked={pvp}
                  onChange={(e) => setPvp(e.target.checked)}
                  className="accent-purple-600 w-5 h-5 rounded cursor-pointer"
                />
              </label>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-purple-600/30"
              >
                Save & Deploy Configurations
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: ORDERS & BILLING */}
        {activeTab === 'orders' && (
          <div className="bg-[#110A1F] border border-purple-900/40 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white font-heading">STORE ORDERS & INVOICES</h2>
                <p className="text-xs text-slate-400">Review UPI QR payments, verify transaction IDs & dispatch perks</p>
              </div>
              <span className="text-xs font-mono text-purple-300 font-bold">{orders.length} Total Orders</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#160D26] text-slate-400 uppercase text-[10px] border-b border-purple-900/40">
                  <tr>
                    <th className="p-3">Invoice #</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Player IGN</th>
                    <th className="p-3">Method / UTR</th>
                    <th className="p-3 text-right">Amount</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-950/60">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-purple-950/20 transition-colors">
                      <td className="p-3 font-bold text-purple-300">{ord.invoiceNumber}</td>
                      <td className="p-3 text-slate-400">{new Date(ord.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://mc-heads.net/avatar/${ord.minecraftUsername}/24`}
                            alt={ord.minecraftUsername}
                            className="w-5 h-5 rounded"
                          />
                          <span className="text-white font-bold">{ord.minecraftUsername}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-slate-300">{ord.paymentMethod}</div>
                        {ord.utrTransactionId && (
                          <div className="text-[10px] text-purple-400">UTR: {ord.utrTransactionId}</div>
                        )}
                      </td>
                      <td className="p-3 text-right text-white font-bold tabular-nums">
                        {formatCurrency(ord.total, ord.currency)}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ord.status === 'COMPLETED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => onViewInvoice(ord)}
                          className="px-2.5 py-1 rounded bg-[#1F1336] hover:bg-[#2A1A4A] text-purple-200 text-[10px] font-bold uppercase transition-colors"
                        >
                          View Receipt
                        </button>
                        {ord.status === 'PENDING_VERIFICATION' && (
                          <button
                            onClick={() => onApproveOrder(ord.id)}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase transition-colors"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CHAT LOG VIEWER */}
        {activeTab === 'chat' && (
          <div className="bg-[#110A1F] border border-purple-900/40 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white font-heading">REAL-TIME CHAT LOG MONITOR</h2>
                <p className="text-xs text-slate-400">Inspect messages, monitor swearing/toxicity, and take moderation actions</p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={chatSearch}
                  onChange={(e) => setChatSearch(e.target.value)}
                  placeholder="Filter player or message..."
                  className="px-3 py-1.5 rounded-lg bg-[#160D26] border border-purple-800/60 text-white text-xs font-mono focus:outline-none"
                />

                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer font-mono">
                  <input
                    type="checkbox"
                    checked={flaggedOnly}
                    onChange={(e) => setFlaggedOnly(e.target.checked)}
                    className="accent-purple-600"
                  />
                  <span>Flagged Only</span>
                </label>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1 font-mono text-xs">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    log.flagged
                      ? 'bg-red-950/40 border-red-500/50 text-red-200'
                      : 'bg-[#160D26] border-purple-900/30 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-500 text-[11px]">{log.timestamp}</span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px] font-bold">
                      {log.rank}
                    </span>
                    <span className="font-bold text-white">{log.player}:</span>
                    <span className="text-slate-300">{log.message}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {log.flagged && (
                      <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold">
                        TOXIC FLAG
                      </span>
                    )}
                    <button
                      onClick={() => alert(`Warning dispatched to player ${log.player}`)}
                      className="px-2 py-1 rounded bg-[#201438] hover:bg-amber-600/30 text-amber-300 text-[10px] font-bold transition-colors"
                    >
                      Warn
                    </button>
                    <button
                      onClick={() => alert(`Player ${log.player} has been muted for 1 hour.`)}
                      className="px-2 py-1 rounded bg-[#201438] hover:bg-red-600/30 text-red-300 text-[10px] font-bold transition-colors"
                    >
                      Mute
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: BAN MANAGEMENT */}
        {activeTab === 'bans' && (
          <div className="space-y-8">
            {/* Create Ban Form */}
            <form onSubmit={handleCreateBan} className="bg-[#110A1F] border border-purple-900/40 rounded-3xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                <Ban className="w-5 h-5 text-red-400" />
                <span>DISPATCH NEW PLAYER BAN</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                    Player In-Game Name
                  </label>
                  <input
                    type="text"
                    required
                    value={banPlayer}
                    onChange={(e) => setBanPlayer(e.target.value)}
                    placeholder="e.g. Cheater99"
                    className="w-full px-3 py-2 rounded-xl bg-[#160D26] border border-purple-800/60 text-white text-xs font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                    Ban Reason
                  </label>
                  <input
                    type="text"
                    required
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    placeholder="e.g. Unfair Advantage / Reach 4.2"
                    className="w-full px-3 py-2 rounded-xl bg-[#160D26] border border-purple-800/60 text-white text-xs font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                    Duration
                  </label>
                  <select
                    value={banDuration}
                    onChange={(e) => setBanDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#160D26] border border-purple-800/60 text-white text-xs font-mono focus:outline-none cursor-pointer"
                  >
                    <option value="1 Day">1 Day</option>
                    <option value="7 Days">7 Days</option>
                    <option value="30 Days">30 Days</option>
                    <option value="Permanent">Permanent</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
                >
                  Enforce Ban
                </button>
              </div>
            </form>

            {/* Active Bans Table */}
            <div className="bg-[#110A1F] border border-purple-900/40 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-white font-heading">ACTIVE SERVER BANS</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#160D26] text-slate-400 uppercase text-[10px] border-b border-purple-900/40">
                    <tr>
                      <th className="p-3">Player</th>
                      <th className="p-3">Reason</th>
                      <th className="p-3">Staff Issuer</th>
                      <th className="p-3">Duration / Expiry</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-950/60">
                    {bans.map((b) => (
                      <tr key={b.id} className="hover:bg-purple-950/20">
                        <td className="p-3 font-bold text-red-300">{b.player}</td>
                        <td className="p-3 text-slate-300">{b.reason}</td>
                        <td className="p-3 text-purple-300">{b.bannedBy}</td>
                        <td className="p-3 text-slate-400">{b.expiresAt}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleLiftBan(b)}
                            className="px-3 py-1 rounded bg-purple-900/40 hover:bg-emerald-600/40 text-emerald-300 text-[10px] font-bold uppercase transition-colors"
                          >
                            Unban
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: STORE & DISCOUNTS */}
        {activeTab === 'store' && (
          <div className="space-y-8">
            {/* Create Coupon Voucher */}
            <form onSubmit={handleCreateCoupon} className="bg-[#110A1F] border border-purple-900/40 rounded-3xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                <Tag className="w-5 h-5 text-purple-400" />
                <span>CREATE PROMO COUPON VOUCHER</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                    Coupon Code (e.g. DIWALI50)
                  </label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    placeholder="CODE"
                    className="w-full px-3 py-2 rounded-xl bg-[#160D26] border border-purple-800/60 text-white text-xs font-mono uppercase focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="90"
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#160D26] border border-purple-800/60 text-white text-xs font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newCouponDesc}
                    onChange={(e) => setNewCouponDesc(e.target.value)}
                    placeholder="Short description"
                    className="w-full px-3 py-2 rounded-xl bg-[#160D26] border border-purple-800/60 text-white text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
                >
                  Create & Activate Coupon
                </button>
              </div>
            </form>

            {/* Store-wide Discount System */}
            <div className="bg-[#110A1F] border border-purple-900/40 rounded-3xl p-6 sm:p-8 space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                    <Percent className="w-5 h-5 text-purple-400" />
                    <span>STORE-WIDE DISCOUNT SWITCH</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    ON shows the banner and crossed-out deal prices everywhere. OFF hides every trace of them.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleDiscount(!siteContent.discountEnabled)}
                  className={`px-5 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors border ${
                    siteContent.discountEnabled
                      ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white'
                      : 'bg-[#160D26] hover:bg-[#201438] border-purple-800/60 text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${siteContent.discountEnabled ? 'bg-white animate-pulse' : 'bg-slate-500'}`} />
                    <span>Discounts are {siteContent.discountEnabled ? 'ON' : 'OFF'}</span>
                  </span>
                </button>
              </div>

              <form
                onSubmit={handleSaveDiscountBanner}
                className="pt-5 border-t border-purple-900/40 grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div>
                  <label className={labelCls}>Banner Headline</label>
                  <input
                    type="text"
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                    placeholder="e.g. 🔥 LIMITED TIME — 20% OFF ACROSS THE STORE"
                    className={fieldCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Banner Sub-line</label>
                  <input
                    type="text"
                    value={bannerSub}
                    onChange={(e) => setBannerSub(e.target.value)}
                    placeholder="Small note under the headline"
                    className={fieldCls}
                  />
                </div>

                <div className="sm:col-span-2 flex items-center justify-between gap-3">
                  <span className="text-[11px] font-mono text-slate-400">
                    {storeItems.filter((i) => (i.discountINR ?? 0) > 0).length} product(s) have a deal price set
                  </span>
                  <div className="flex items-center gap-3">
                    {bannerSaved && (
                      <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Banner text saved</span>
                      </span>
                    )}
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      Save Banner Text
                    </button>
                  </div>
                </div>
              </form>

              <div className="p-4 rounded-xl bg-[#160D26] border border-purple-900/40 text-[11px] font-mono text-slate-400 space-y-1">
                <div className="text-purple-300 font-bold mb-1">HOW TO RUN A SALE</div>
                <p>1. Open the Products tab and type a deal price on the products you want discounted.</p>
                <p>2. Flip the switch above to ON — the banner and crossed-out prices appear on the live store instantly.</p>
                <p>3. Buyers are charged the deal price in the cart, checkout and invoice. Switch OFF to hide everything again.</p>
              </div>
            </div>

            {/* Active Coupons */}
            <div className="bg-[#110A1F] border border-purple-900/40 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white font-heading">ACTIVE COUPON VOUCHERS</h3>
                <span className="text-xs font-mono text-purple-300 font-bold">{coupons.length} Codes</span>
              </div>

              {coupons.length === 0 ? (
                <p className="text-xs text-slate-500 font-mono">No coupons created yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#160D26] text-slate-400 uppercase text-[10px] border-b border-purple-900/40">
                      <tr>
                        <th className="p-3">Code</th>
                        <th className="p-3">Discount</th>
                        <th className="p-3">Description</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-950/60">
                      {coupons.map((c) => (
                        <tr key={c.code} className="hover:bg-purple-950/20">
                          <td className="p-3 font-bold text-white">{c.code}</td>
                          <td className="p-3 text-purple-300">{c.discountPercent}% OFF</td>
                          <td className="p-3 text-slate-400">{c.description}</td>
                          <td className="p-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                c.active
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-slate-500/10 text-slate-400 border border-slate-500/30'
                              }`}
                            >
                              {c.active ? 'ACTIVE' : 'PAUSED'}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => {
                                onUpdateCoupons(
                                  coupons.map((x) => (x.code === c.code ? { ...x, active: !x.active } : x))
                                );
                                log('COUPON_TOGGLED', `${c.active ? 'Deactivated' : 'Activated'} promo code ${c.code}`, 'store');
                              }}
                              className="px-2.5 py-1 rounded bg-[#1F1336] hover:bg-[#2A1A4A] text-purple-200 text-[10px] font-bold uppercase transition-colors"
                            >
                              {c.active ? 'Pause' : 'Activate'}
                            </button>
                            <button
                              onClick={() => {
                                onUpdateCoupons(coupons.filter((x) => x.code !== c.code));
                                log('COUPON_DELETED', `Deleted promo code ${c.code}`, 'store');
                              }}
                              className="px-2.5 py-1 rounded bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 text-red-200 text-[10px] font-bold uppercase transition-colors"
                            >
                              <Trash2 className="w-3 h-3 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5B: PRODUCT CATALOG MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="bg-[#110A1F] border border-purple-900/40 rounded-3xl p-6 sm:p-8 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white font-heading">PRODUCT PRICE &amp; TAG MANAGER</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Edit the normal price, set a deal price, flag "Most Popular" or delete a product. Every change saves to the database instantly.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#160D26] text-slate-400 uppercase text-[10px] border-b border-purple-900/40">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Normal Price (₹)</th>
                      <th className="p-3">USD (auto)</th>
                      <th className="p-3">Deal Price (₹)</th>
                      <th className="p-3 text-center">Most Popular</th>
                      <th className="p-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-950/60">
                    {storeItems.map((item) => (
                      <tr key={item.id} className="hover:bg-purple-950/20 transition-colors align-middle">
                        <td className="p-3">
                          <div className="font-bold text-white">{item.name}</div>
                          {item.badge && <div className="text-[10px] text-purple-400">{item.badge}</div>}
                        </td>
                        <td className="p-3">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950/70 text-purple-300 border border-purple-800/40 uppercase">
                            {item.category.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            min="1"
                            defaultValue={item.priceINR}
                            key={`price-${item.id}-${item.priceINR}`}
                            onBlur={(e) => handleUpdateItemPrice(item.id, Number(e.target.value))}
                            className="w-24 px-2 py-1 rounded bg-[#160D26] border border-purple-800/60 text-white font-bold focus:outline-none focus:ring-1 focus:ring-purple-400"
                          />
                        </td>
                        <td className="p-3 text-slate-400">${(item.priceUSD ?? 0).toFixed(2)}</td>
                        <td className="p-3">
                          <input
                            type="number"
                            min="0"
                            placeholder="none"
                            defaultValue={item.discountINR ?? ''}
                            key={`deal-${item.id}-${item.discountINR ?? ''}`}
                            onBlur={(e) => handleUpdateItemDiscount(item.id, e.target.value)}
                            className="w-24 px-2 py-1 rounded bg-[#160D26] border border-amber-700/50 text-amber-300 font-bold focus:outline-none focus:ring-1 focus:ring-amber-400 placeholder:text-slate-600"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleTogglePopular(item.id, !item.popular)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors border ${
                              item.popular
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                                : 'bg-[#160D26] text-slate-500 border-purple-900/40 hover:text-white'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <Crown className="w-3 h-3" />
                              <span>{item.popular ? 'Shown' : 'Hidden'}</span>
                            </span>
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="px-2.5 py-1 rounded bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 text-red-200 text-[10px] font-bold uppercase transition-colors"
                          >
                            <Trash2 className="w-3 h-3 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add new product */}
            <form onSubmit={handleAddProduct} className="bg-[#110A1F] border border-purple-900/40 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-400" />
                <span>ADD A NEW PRODUCT</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Product Name *</label>
                  <input
                    type="text"
                    required
                    value={draft.name || ''}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    placeholder="e.g. VOID SEASON 6 BUNDLE"
                    className={fieldCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Category *</label>
                  <select
                    value={draft.category || 'rank'}
                    onChange={(e) => setDraft({ ...draft, category: e.target.value as StoreItem['category'] })}
                    className={`${fieldCls} cursor-pointer`}
                  >
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.replace('_', ' ').toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Normal Price (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={draft.priceINR ?? ''}
                    onChange={(e) => setDraft({ ...draft, priceINR: Number(e.target.value) })}
                    placeholder="e.g. 499"
                    className={fieldCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Badge / Label</label>
                  <input
                    type="text"
                    value={draft.badge || ''}
                    onChange={(e) => setDraft({ ...draft, badge: e.target.value })}
                    placeholder="e.g. TIER 3"
                    className={fieldCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Duration / Unit</label>
                  <input
                    type="text"
                    value={draft.duration || ''}
                    onChange={(e) => setDraft({ ...draft, duration: e.target.value })}
                    placeholder="e.g. Monthly • 30 Days • Permanent"
                    className={fieldCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Tagline</label>
                  <input
                    type="text"
                    value={draft.tagline || ''}
                    onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
                    placeholder="Short line under the name"
                    className={fieldCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Coins Value (optional)</label>
                  <input
                    type="number"
                    min="0"
                    value={draft.priceCoins ?? ''}
                    onChange={(e) => setDraft({ ...draft, priceCoins: Number(e.target.value) })}
                    placeholder="auto-calculated if empty"
                    className={fieldCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Coins Reward (optional)</label>
                  <input
                    type="number"
                    min="0"
                    value={draft.coinsReward ?? ''}
                    onChange={(e) => setDraft({ ...draft, coinsReward: Number(e.target.value) })}
                    placeholder="coins given with this product"
                    className={fieldCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Deal Price (₹, optional)</label>
                  <input
                    type="number"
                    min="0"
                    value={draft.discountINR ?? ''}
                    onChange={(e) => setDraft({ ...draft, discountINR: Number(e.target.value) })}
                    placeholder="only used when discounts are ON"
                    className={fieldCls}
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className={labelCls}>Features (one per line)</label>
                  <textarea
                    rows={4}
                    value={draftFeatures}
                    onChange={(e) => setDraftFeatures(e.target.value)}
                    placeholder={'Fly / Gamemode in creative worlds\n3 crate keys every week\nColored chat prefix'}
                    className={`${fieldCls} resize-y`}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer font-mono">
                  <input
                    type="checkbox"
                    checked={!!draft.popular}
                    onChange={(e) => setDraft({ ...draft, popular: e.target.checked })}
                    className="accent-purple-600"
                  />
                  <span>Show "Most Popular" tag</span>
                </label>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
                >
                  Publish Product to Store
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 5C: SHOWCASE GALLERY */}
        {activeTab === 'showcase' && (
          <div className="bg-[#110A1F] border border-purple-900/40 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                  <ImagePlus className="w-5 h-5 text-purple-400" />
                  <span>SHOWCASE PHOTO MANAGER</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Upload build screenshots and event posters. They appear in the Season 6 Showcase gallery on the website.
                </p>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadBusy}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>{uploadBusy ? 'Compressing…' : 'Upload Photos'}</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                className="hidden"
                onChange={(e) => handleUploadPhotos(e.target.files)}
              />
            </div>

            {uploadError && (
              <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 font-mono">
                <AlertTriangle className="w-4 h-4" />
                <span>{uploadError}</span>
              </div>
            )}

            {showcasePhotos.length === 0 ? (
              <div className="text-center py-14 text-slate-500 font-mono text-sm">
                <ImagePlus className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No uploaded photos yet.</p>
                <p className="text-xs mt-1">Photos you upload are stored in the database and shown on the site.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {showcasePhotos.map((shot) => (
                  <div key={shot.id} className="rounded-2xl bg-[#160D26] border border-purple-900/40 overflow-hidden">
                    <img src={shot.dataUrl} alt={shot.caption} className="w-full h-40 object-cover" />
                    <div className="p-3 space-y-2">
                      <input
                        type="text"
                        value={shot.caption}
                        onChange={(e) => onRenameShowcasePhoto(shot.id, e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#110A1F] border border-purple-800/60 text-white text-[11px] font-mono focus:outline-none"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-mono">Shown on site</span>
                        <button
                          onClick={() => handleRemoveShot(shot.id)}
                          className="px-2.5 py-1 rounded bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 text-red-200 text-[10px] font-bold uppercase transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-[11px] font-mono text-slate-500">
              Tip: large photos are automatically resized and compressed so they fit inside the database document limit.
            </p>
          </div>
        )}

        {/* TAB 5D: PLATFORM LINKS */}
        {activeTab === 'links' && (
          <form onSubmit={handleSaveLinks} className="bg-[#110A1F] border border-purple-900/40 rounded-3xl p-6 sm:p-8 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                <Link2 className="w-5 h-5 text-purple-400" />
                <span>PLATFORM LINK MANAGER</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Update the Discord, YouTube, Instagram, store and WhatsApp links used across the website — no code edits needed.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(
                [
                  { key: 'discord', label: 'Discord Invite Link', hint: 'Footer, social cards, context menu, invoice share button' },
                  { key: 'youtube', label: 'YouTube Channel Link', hint: 'Social cards and footer' },
                  { key: 'instagram', label: 'Instagram Link', hint: 'Social cards and footer' },
                  { key: 'whatsapp', label: 'WhatsApp Link (leave empty to hide)', hint: 'Footer / community button' },
                  { key: 'store', label: 'Store / Website Link', hint: 'Used by share and external links' },
                ] as const
              ).map((field) => (
                <div key={field.key}>
                  <label className={labelCls}>{field.label}</label>
                  <input
                    type="url"
                    value={(linksDraft as Record<string, string>)[field.key]}
                    onChange={(e) => setLinksDraft({ ...linksDraft, [field.key]: e.target.value })}
                    placeholder="https://…"
                    className={fieldCls}
                  />
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">{field.hint}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-purple-900/40">
              <span className="text-[11px] font-mono text-slate-500">
                Empty links are hidden on the website instead of breaking.
              </span>
              <div className="flex items-center gap-3">
                {linksSaved && (
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Links saved &amp; live</span>
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLinksDraft({ ...DEFAULT_LINKS })}
                    className="px-4 py-2.5 rounded-xl bg-[#160D26] hover:bg-[#201438] border border-purple-800/60 text-slate-300 text-xs font-mono font-bold transition-colors"
                  >
                    Reset to defaults
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
                  >
                    Save Links
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* TAB 6: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="bg-[#110A1F] border border-purple-900/40 rounded-3xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-white font-heading">SECURITY &amp; ACTION AUDIT TRAIL</h2>
            <p className="text-xs text-slate-400 -mt-1">
              Every entry below is a real action performed by staff on this site, stored permanently in the database with the account that ran it.
            </p>

            {auditLogs.length === 0 ? (
              <div className="text-center py-14 text-slate-500 font-mono text-sm">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No actions recorded yet.</p>
                <p className="text-xs mt-1">Logs appear here automatically as you approve orders, edit products, ban players or change settings.</p>
              </div>
            ) : (
            <div className="space-y-2 font-mono text-xs">
              {auditLogs.map((entry) => (
                <div key={entry.id} className="p-3 rounded-xl bg-[#160D26] border border-purple-900/30 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-slate-500 text-[10px]">{entry.timestamp}</span>
                      <span className="font-bold text-purple-300">{entry.staffName}</span>
                      <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-400 text-[10px] font-bold">
                        {entry.action}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-[#110A1F] text-slate-400 text-[10px] uppercase border border-purple-900/40">
                        {entry.category}
                      </span>
                    </div>
                    <p className="text-slate-300 mt-1">{entry.details}</p>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {/* TAB 7: LEADERBOARD MANAGEMENT */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-8">
            {/* Add Player Form */}
            <form onSubmit={handleAddPlayer} className="bg-[#110A1F] border border-purple-900/40 rounded-3xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-400" />
                <span>ADD PLAYER TO LEADERBOARD</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                    Username (IGN)
                  </label>
                  <input
                    type="text"
                    required
                    value={newPlayerUsername}
                    onChange={(e) => setNewPlayerUsername(e.target.value)}
                    placeholder="e.g. elite_ansh"
                    className="w-full px-3 py-2 rounded-xl bg-[#160D26] border border-purple-800/60 text-white text-xs font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                    Kills
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newPlayerKills}
                    onChange={(e) => setNewPlayerKills(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#160D26] border border-purple-800/60 text-white text-xs font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                    Deaths
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newPlayerDeaths}
                    onChange={(e) => setNewPlayerDeaths(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#160D26] border border-purple-800/60 text-white text-xs font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                    Playtime (Hours)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newPlayerPlaytime}
                    onChange={(e) => setNewPlayerPlaytime(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#160D26] border border-purple-800/60 text-white text-xs font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                    Balance (Coins)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newPlayerBalance}
                    onChange={(e) => setNewPlayerBalance(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#160D26] border border-purple-800/60 text-white text-xs font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                    Crates Opened
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newPlayerCrates}
                    onChange={(e) => setNewPlayerCrates(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#160D26] border border-purple-800/60 text-white text-xs font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                    PvP Elo
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newPlayerElo}
                    onChange={(e) => setNewPlayerElo(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#160D26] border border-purple-800/60 text-white text-xs font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                    Tier
                  </label>
                  <input
                    type="text"
                    value={newPlayerTier}
                    onChange={(e) => setNewPlayerTier(e.target.value)}
                    placeholder="e.g. Void Sovereign"
                    className="w-full px-3 py-2 rounded-xl bg-[#160D26] border border-purple-800/60 text-white text-xs font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                    Server Rank
                  </label>
                  <select
                    value={newPlayerRank}
                    onChange={(e) => setNewPlayerRank(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#160D26] border border-purple-800/60 text-white text-xs font-mono focus:outline-none cursor-pointer"
                  >
                    <option value="DEFAULT">DEFAULT</option>
                    <option value="ABYSS">ABYSS</option>
                    <option value="ELITE">ELITE</option>
                    <option value="VIP">VIP</option>
                    <option value="VOID">VOID</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="SUPERVISOR">SUPERVISOR</option>
                    <option value="CO-OWNER">CO-OWNER</option>
                    <option value="OWNER">OWNER</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer font-mono">
                  <input
                    type="checkbox"
                    checked={newPlayerOnline}
                    onChange={(e) => setNewPlayerOnline(e.target.checked)}
                    className="accent-purple-600"
                  />
                  <span>Currently Online</span>
                </label>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
                >
                  Add Player
                </button>
              </div>
            </form>

            {/* Current Leaderboard Table */}
            <div className="bg-[#110A1F] border border-purple-900/40 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white font-heading">CURRENT LEADERBOARD PLAYERS</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-purple-300 font-bold">{leaderboardPlayers.length} Players</span>
                  {leaderboardPlayers.length > 0 && (
                    <button
                      onClick={handleClearLeaderboard}
                      className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 text-red-200 text-[10px] font-mono font-bold transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {leaderboardPlayers.length === 0 ? (
                <div className="text-center py-12 text-slate-500 font-mono text-sm">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No players in leaderboard yet.</p>
                  <p className="text-xs mt-1">Add players using the form above.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#160D26] text-slate-400 uppercase text-[10px] border-b border-purple-900/40">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">Player</th>
                        <th className="p-3">Rank</th>
                        <th className="p-3 text-right">Kills</th>
                        <th className="p-3 text-right">K/D</th>
                        <th className="p-3 text-right">Elo</th>
                        <th className="p-3 text-right">Playtime</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-950/60">
                      {leaderboardPlayers.map((player, idx) => (
                        <tr key={player.username} className="hover:bg-purple-950/20 transition-colors">
                          <td className="p-3 font-bold text-purple-300">#{idx + 1}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <img
                                src={`https://mc-heads.net/avatar/${player.username}/24`}
                                alt={player.username}
                                className="w-5 h-5 rounded"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://mc-heads.net/avatar/Steve/24';
                                }}
                              />
                              <span className="text-white font-bold">{player.username}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-purple-300 text-[10px] px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-800/40">
                              {player.serverRank}
                            </span>
                          </td>
                          <td className="p-3 text-right text-white font-bold tabular-nums">{player.kills.toLocaleString()}</td>
                          <td className="p-3 text-right text-slate-300 tabular-nums">{player.kd}</td>
                          <td className="p-3 text-right text-purple-300 font-bold tabular-nums">{player.pvpElo.toLocaleString()}</td>
                          <td className="p-3 text-right text-slate-300 tabular-nums">{player.playtimeHours}h</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              player.isOnline
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-500/10 text-slate-400 border border-slate-500/30'
                            }`}>
                              {player.isOnline ? 'Online' : 'Offline'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleRemovePlayer(player.username)}
                              className="px-2.5 py-1 rounded bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 text-red-200 text-[10px] font-bold uppercase transition-colors"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
