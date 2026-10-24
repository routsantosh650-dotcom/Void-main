import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { SocialCards } from './components/SocialCards.tsx';
import { HomeTeasers } from './components/HomeTeasers.tsx';
import { StoreSection } from './components/StoreSection.tsx';
import { SpinTheVoid } from './components/SpinTheVoid.tsx';
import { LeaderboardSection } from './components/LeaderboardSection.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ServerStatusDashboard } from './components/ServerStatusDashboard.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { InvoiceModal } from './components/InvoiceModal.tsx';
import { ContextMenu } from './components/ContextMenu.tsx';
import { NotificationToast, NotificationItem } from './components/NotificationToast.tsx';
import { Footer } from './components/Footer.tsx';
import { ShowcaseSection } from './components/ShowcaseSection.tsx';
import { ReviewsSection } from './components/ReviewsSection.tsx';
import { VoidParticles } from './components/VoidParticles.tsx';
import { VoidCursorTrail } from './components/VoidCursorTrail.tsx';
import { CherryBlossomPetals } from './components/CherryBlossomPetals.tsx';
import { CustomCursor } from './components/CustomCursor.tsx';
import { Shield, Lock, ArrowRight, Sparkles } from 'lucide-react';

import {
  saveOrderToFirestore,
  updateOrderStatusInFirestore,
  subscribeToOrders,
  saveUserToFirestore,
  saveServerConfigToFirestore,
  subscribeToServerConfig,
  saveAuditLogToFirestore,
  subscribeToAuditLogs,
  saveSiteContentToFirestore,
  subscribeToSiteContent,
  saveStoreItemsToFirestore,
  subscribeToStoreItems,
  saveListToFirestore,
  subscribeToCoupons,
  subscribeToBans,
  subscribeToLeaderboard,
  saveShowcasePhotoToFirestore,
  updateShowcaseCaptionInFirestore,
  deleteShowcasePhotoFromFirestore,
  subscribeToShowcasePhotos,
} from './services/firebaseService.ts';

import {
  Currency,
  Language,
  StoreItem,
  CartItem,
  Order,
  Coupon,
  ServerConfig,
  ChatMessage,
  BanRecord,
  AuditLog,
  UserAccount,
  LeaderboardPlayer,
  SiteContent,
  ShowcaseImage,
} from './types/index.ts';

import { DEFAULT_SITE_CONTENT, mergeSiteContent } from './data/defaults.ts';

import {
  INITIAL_SERVER_CONFIG,
  INITIAL_STORE_ITEMS,
  INITIAL_COUPONS,
  INITIAL_LEADERBOARD,
  INITIAL_CHAT_LOGS,
  INITIAL_BANS,
  INITIAL_ORDERS,
} from './data/initialData.ts';

export default function App() {
  // Navigation & Preferences
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currency, setCurrency] = useState<Currency>('INR');
  const language: Language = 'en';

  // Copy IP Feedback State
  const [copiedIp, setCopiedIp] = useState(false);

  // Persistent Domain States (Local Storage with fallbacks)
  const [serverConfig, setServerConfig] = useState<ServerConfig>(() => {
    try {
      const saved = localStorage.getItem('voidmc_config');
      return saved ? JSON.parse(saved) : INITIAL_SERVER_CONFIG;
    } catch {
      return INITIAL_SERVER_CONFIG;
    }
  });

  const [storeItems, setStoreItems] = useState<StoreItem[]>(() => {
    try {
      const saved = localStorage.getItem('voidmc_store_items');
      return saved ? JSON.parse(saved) : INITIAL_STORE_ITEMS;
    } catch {
      return INITIAL_STORE_ITEMS;
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('voidmc_coupons');
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('voidmc_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [chatLogs, setChatLogs] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('voidmc_chat');
      return saved ? JSON.parse(saved) : INITIAL_CHAT_LOGS;
    } catch {
      return INITIAL_CHAT_LOGS;
    }
  });

  const [bans, setBans] = useState<BanRecord[]>(() => {
    try {
      const saved = localStorage.getItem('voidmc_bans');
      return saved ? JSON.parse(saved) : INITIAL_BANS;
    } catch {
      return INITIAL_BANS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem('voidmc_site_content');
      return saved ? mergeSiteContent(JSON.parse(saved)) : DEFAULT_SITE_CONTENT;
    } catch {
      return DEFAULT_SITE_CONTENT;
    }
  });

  const [showcasePhotos, setShowcasePhotos] = useState<ShowcaseImage[]>(() => {
    try {
      const saved: ShowcaseImage[] = JSON.parse(localStorage.getItem('voidmc_showcase') || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const [leaderboardPlayers, setLeaderboardPlayers] = useState<LeaderboardPlayer[]>(() => {
    try {
      const saved = localStorage.getItem('voidmc_leaderboard');
      return saved ? JSON.parse(saved) : INITIAL_LEADERBOARD;
    } catch {
      return INITIAL_LEADERBOARD;
    }
  });

  // Cart & Modals
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<Order | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loggedInStaff, setLoggedInStaff] = useState('');
  const [staffUsername, setStaffUsername] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffPasscodeError, setStaffPasscodeError] = useState('');

  const ADMIN_CREDENTIALS = [
    { username: 'Ansh', password: 'Anshrajvoid7151' },
    { username: 'routsantosh650', password: 'santosh276' },
  ];

  // Push Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Check URL on mount & popstate for /voidogsite route
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const search = window.location.search;
      if (path.includes('voidogsite') || hash.includes('voidogsite') || search.includes('voidogsite')) {
        setActiveTab('admin');
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, []);

  // Update browser history when active tab changes
  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'admin') {
      window.history.pushState(null, '', '/voidogsite');
    } else if (window.location.pathname.includes('voidogsite')) {
      window.history.pushState(null, '', '/');
    }
  };

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('voidmc_config', JSON.stringify(serverConfig));
    } catch {}
  }, [serverConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('voidmc_store_items', JSON.stringify(storeItems));
    } catch {}
  }, [storeItems]);

  useEffect(() => {
    try {
      localStorage.setItem('voidmc_coupons', JSON.stringify(coupons));
    } catch {}
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem('voidmc_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('voidmc_chat', JSON.stringify(chatLogs));
    } catch {}
  }, [chatLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('voidmc_bans', JSON.stringify(bans));
    } catch {}
  }, [bans]);

  useEffect(() => {
    try {
      localStorage.setItem('voidmc_leaderboard', JSON.stringify(leaderboardPlayers));
    } catch {}
  }, [leaderboardPlayers]);

  useEffect(() => {
    try {
      localStorage.setItem('voidmc_site_content', JSON.stringify(siteContent));
    } catch {}
  }, [siteContent]);

  useEffect(() => {
    try {
      localStorage.setItem('voidmc_showcase', JSON.stringify(showcasePhotos));
    } catch {}
  }, [showcasePhotos]);

  // Admin writes go straight to Firestore (see the AdminPanel props below). Pushing from an
  // effect would let every visitor's first render overwrite the saved catalog with defaults.

  // ---- Admin edits: update this tab instantly and persist to Firestore in the same step ----
  const persistStoreItems = (items: StoreItem[]) => {
    setStoreItems(items);
    saveStoreItemsToFirestore(items);
  };

  const persistSiteContent = (content: SiteContent) => {
    setSiteContent(content);
    saveSiteContentToFirestore(content);
  };

  const persistCoupons = (rows: Coupon[]) => {
    setCoupons(rows);
    saveListToFirestore('coupons', rows);
  };

  const persistLeaderboard = (rows: LeaderboardPlayer[]) => {
    setLeaderboardPlayers(rows);
    saveListToFirestore('leaderboard', rows);
  };

  const persistBans = (next: BanRecord[]) => {
    setBans(next);
    saveListToFirestore('bans', next);
  };

  const addShowcasePhoto = (photo: ShowcaseImage) => {
    setShowcasePhotos((prev) => [...prev, photo]);
    saveShowcasePhotoToFirestore(photo);
  };

  const removeShowcasePhoto = (id: string) => {
    setShowcasePhotos((prev) => prev.filter((p) => p.id !== id));
    deleteShowcasePhotoFromFirestore(id);
  };

  const renameShowcasePhoto = (id: string, caption: string) => {
    setShowcasePhotos((prev) => prev.map((p) => (p.id === id ? { ...p, caption } : p)));
    updateShowcaseCaptionInFirestore(id, caption);
  };

  // Audit trail writer: every entry here is produced by a real action in this session
  const recordAudit = (
    action: string,
    details: string,
    category: AuditLog['category'],
    staffName = 'Admin Staff'
  ) => {
    const audit: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toLocaleString(),
      staffName,
      action,
      details,
      category,
    };
    setAuditLogs((prev) => [audit, ...prev]);
    saveAuditLogToFirestore(audit);
  };

  // Push Notification Dispatcher
  const addNotification = (title: string, message: string, type: 'order' | 'info' | 'success' = 'info') => {
    const id = `notif_${Date.now()}_${Math.random()}`;
    setNotifications((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5500);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Copy IP action
  const handleCopyIp = () => {
    const ipAddress = `${serverConfig.ip}:${serverConfig.port}`;
    navigator.clipboard.writeText(ipAddress);
    setCopiedIp(true);
    addNotification('Server IP Copied!', `play.voidmc.fun:25674 is ready to paste in Minecraft.`, 'success');
    setTimeout(() => setCopiedIp(false), 3000);
  };

  // Cart operations
  // When the store-wide discount is ON, the discounted price becomes the chargeable price.
  const applyDiscount = (item: StoreItem): StoreItem => {
    if (!siteContent.discountEnabled) return item;
    const hasINR = typeof item.discountINR === 'number' && item.discountINR > 0;
    const hasUSD = typeof item.discountUSD === 'number' && item.discountUSD > 0;
    if (!hasINR && !hasUSD) return item;
    return {
      ...item,
      baseINR: item.priceINR,
      baseUSD: item.priceUSD,
      priceINR: hasINR ? (item.discountINR as number) : item.priceINR,
      priceUSD: hasUSD ? (item.discountUSD as number) : item.priceUSD,
      discountINR: undefined,
      discountUSD: undefined,
    };
  };

  const handleAddToCart = (item: StoreItem) => {
    const priced = applyDiscount(item);
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.item.id === priced.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === priced.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { item: priced, quantity: 1 }];
    });
    addNotification('Added to Cart', `${priced.name} has been added.`, 'info');
  };

  const handleBuyNow = (item: StoreItem) => {
    const priced = applyDiscount(item);
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.item.id === priced.id);
      if (existing) return prev;
      return [...prev, { item: priced, quantity: 1 }];
    });
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((ci) => {
          if (ci.item.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Connect Firestore Realtime Subscriptions
  useEffect(() => {
    const unsubOrders = subscribeToOrders((liveOrders) => {
      if (liveOrders && liveOrders.length > 0) {
        setOrders(liveOrders);
      }
    });
    const unsubConfig = subscribeToServerConfig((liveConfig) => {
      if (liveConfig) {
        setServerConfig(liveConfig);
      }
    });
    const unsubSite = subscribeToSiteContent((live) => setSiteContent(live));
    const unsubStore = subscribeToStoreItems((live) => setStoreItems(live));
    const unsubCoupons = subscribeToCoupons((live) => setCoupons(live));
    const unsubBans = subscribeToBans((live) => setBans(live));
    const unsubLeaderboard = subscribeToLeaderboard((live) => setLeaderboardPlayers(live));
    const unsubAudit = subscribeToAuditLogs((live) => setAuditLogs(live));
    const unsubPhotos = subscribeToShowcasePhotos((live) => setShowcasePhotos(live));
    return () => {
      unsubOrders();
      unsubConfig();
      unsubSite();
      unsubStore();
      unsubCoupons();
      unsubBans();
      unsubLeaderboard();
      unsubAudit();
      unsubPhotos();
    };
  }, []);

  // Order Flow Completed
  const handleOrderCompleted = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setIsCheckoutOpen(false);
    setActiveInvoice(newOrder);

    // Save to Firestore
    saveOrderToFirestore(newOrder);

    addNotification(
      'Order Placed Successfully!',
      `Invoice #${newOrder.invoiceNumber} created. Share on Discord ticket to complete activation.`,
      'order'
    );

    // Audit log
    recordAudit(
      'ORDER_SUBMITTED',
      `Order #${newOrder.invoiceNumber} for player "${newOrder.minecraftUsername}" (${newOrder.total} ${newOrder.currency})`,
      'store',
      'Automated Billing System'
    );
  };

  // Admin approves pending UPI order
  const handleApproveOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'COMPLETED' } : o))
    );
    updateOrderStatusInFirestore(orderId, 'COMPLETED');
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      addNotification(
        'Order Approved & Delivered!',
        `Player "${targetOrder.minecraftUsername}" has been granted perks for Invoice #${targetOrder.invoiceNumber}`,
        'success'
      );
      recordAudit(
        'ORDER_APPROVED',
        `Approved & delivered perks for order #${targetOrder.invoiceNumber}`,
        'store',
        loggedInStaff || 'Admin Staff'
      );
    }
  };

  // Staff Gate Unlock Handler for /voidogsite
  const handleStaffGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const username = staffUsername.trim();
    const password = staffPassword.trim();

    const isValid = ADMIN_CREDENTIALS.some(
      (cred) => cred.username === username && cred.password === password
    );

    if (isValid) {
      setIsAdminLoggedIn(true);
      setLoggedInStaff(username);
      setStaffUsername('');
      setStaffPassword('');
      setStaffPasscodeError('');
      addNotification('Admin Access Granted', `Welcome, ${username}.`, 'success');
    } else {
      setStaffPasscodeError('Invalid username or password.');
    }
  };

  const totalCartCount = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0B0713] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white relative overflow-x-hidden">
      {/* Background Interactive Cosmic Void Particles */}
      <VoidParticles />

      {/* Cherry Blossom Falling Petals */}
      <CherryBlossomPetals />

      {/* Professional Animated Cursor */}
      <CustomCursor />

      {/* Interactive Cursor Trails & Spark Burst Engine */}
      <VoidCursorTrail />

      {/* Custom Right-Click Context Menu */}
      <ContextMenu onNavigate={handleNavigate} onCopyIp={handleCopyIp} copied={copiedIp} links={siteContent.links} />

      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        currency={currency}
        setCurrency={setCurrency}
        cartCount={totalCartCount}
        openCart={() => setIsCheckoutOpen(true)}
        onCopyIp={handleCopyIp}
        copied={copiedIp}
      />

      {/* Main View Router */}
      <main className="flex-1 relative z-10">
        {activeTab === 'home' && (
          <>
            <HeroSection
              onlineCount={serverConfig.onlinePlayers ?? 80}
              maxPlayers={serverConfig.maxPlayers ?? 100}
              copied={copiedIp}
              onCopyIp={handleCopyIp}
              onNavigate={handleNavigate}
              announcement={serverConfig.announcementBanner}
            />
            <SocialCards language={language} links={siteContent.links} />
            <HomeTeasers
              featuredItems={storeItems}
              currency={currency}
              discountEnabled={siteContent.discountEnabled}
              onNavigate={handleNavigate}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </>
        )}

        {activeTab === 'showcase' && (
          <ShowcaseSection images={showcasePhotos} />
        )}

        {activeTab === 'store' && (
          <StoreSection
            items={storeItems}
            currency={currency}
            discount={siteContent}
            links={siteContent.links}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            activeCoupons={coupons.filter((c) => c.active)}
            onApplyCouponCode={(code) => {
              addNotification('Coupon Applied', `Code ${code} active in checkout!`, 'info');
            }}
          />
        )}

        {activeTab === 'events' && (
          <>
            <div className="pt-8">
              <SpinTheVoid />
            </div>
            <div className="max-w-5xl mx-auto px-4 pb-20">
              <div className="bg-[#110A1F] border border-purple-900/40 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-purple-400 font-bold">
                    SEASON 5 WEEKLY CALENDAR
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-heading mt-1 mb-6">
                  UPCOMING VOID TOURNAMENTS & EVENTS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-5 rounded-2xl bg-[#160D26] border border-purple-900/40 hover:border-purple-500/50 transition-all">
                    <div className="flex items-center justify-between text-purple-300 font-bold mb-2">
                      <span className="text-sm text-white">ORBITAL CANNON CLASH</span>
                      <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">SATURDAY 8 PM IST</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Custom arena battle featuring the orbital strike beam weapon. 50,000 Coins prize pool for the top 3 surviving factions!
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#160D26] border border-purple-900/40 hover:border-purple-500/50 transition-all">
                    <div className="flex items-center justify-between text-purple-300 font-bold mb-2">
                      <span className="text-sm text-white">CRYSTAL PVP CHAMPIONSHIP</span>
                      <span className="text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/30">SUNDAY 6 PM IST</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      1v1 double elimination bracket. Winner claims exclusive Void Sovereign tag, custom kill aura, & 3x Void Mythic Keys.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardSection players={leaderboardPlayers} />
        )}

        {activeTab === 'about' && (
          <AboutSection language={language} onEnterVoid={handleCopyIp} links={siteContent.links} />
        )}

        {activeTab === 'status' && (
          <ServerStatusDashboard
            config={serverConfig}
            onlinePlayers={leaderboardPlayers}
            onCopyIp={handleCopyIp}
            copied={copiedIp}
          />
        )}

        {activeTab === 'admin' && (
          <>
            {isAdminLoggedIn ? (
              <AdminPanel
                config={serverConfig}
                onUpdateConfig={(newConfig) => {
                  setServerConfig(newConfig);
                  saveServerConfigToFirestore(newConfig);
                }}
                chatLogs={chatLogs}
                bans={bans}
                onAddBan={(b) => persistBans([b, ...bans])}
                onRemoveBan={(id) => persistBans(bans.filter((x) => x.id !== id))}
                storeItems={storeItems}
                onUpdateStoreItems={persistStoreItems}
                coupons={coupons}
                onUpdateCoupons={persistCoupons}
                orders={orders}
                onApproveOrder={handleApproveOrder}
                onViewInvoice={(ord) => setActiveInvoice(ord)}
                auditLogs={auditLogs}
                onRecordAudit={(action, details, category) =>
                  recordAudit(action, details, category, loggedInStaff || 'Admin Staff')
                }
                leaderboardPlayers={leaderboardPlayers}
                onUpdateLeaderboard={persistLeaderboard}
                siteContent={siteContent}
                onUpdateSiteContent={persistSiteContent}
                showcasePhotos={showcasePhotos}
                onAddShowcasePhoto={addShowcasePhoto}
                onRemoveShowcasePhoto={removeShowcasePhoto}
                onRenameShowcasePhoto={renameShowcasePhoto}
                staffName={loggedInStaff}
                onLogout={() => {
                  setIsAdminLoggedIn(false);
                  setLoggedInStaff('');
                  handleNavigate('home');
                }}
              />
            ) : (
              <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-md bg-[#120822] border border-purple-600/50 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(168,85,247,0.3)]">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-900/40 border border-purple-500/60 flex items-center justify-center text-purple-400 mb-6 shadow-lg shadow-purple-950">
                    <Shield className="w-8 h-8 text-purple-300" />
                  </div>

                  <div className="text-center mb-6">
                    <span className="text-[10px] font-mono tracking-widest text-purple-400 uppercase bg-purple-950/60 border border-purple-700/50 px-3 py-1 rounded-full">
                      SECRET ROUTE: /voidogsite
                    </span>
                    <h2 className="text-2xl font-black text-white font-heading mt-3">
                      VOIDMC ADMIN PANEL
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Staff username & password required for access
                    </p>
                  </div>

                  <form onSubmit={handleStaffGateSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                        Staff Username
                      </label>
                      <div className="relative">
                        <Shield className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                        <input
                          type="text"
                          value={staffUsername}
                          onChange={(e) => {
                            setStaffUsername(e.target.value);
                            setStaffPasscodeError('');
                          }}
                          placeholder="Enter staff username..."
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1A0E30] border border-purple-700/60 focus:border-purple-400 text-white placeholder-slate-500 text-sm font-mono focus:outline-none transition-all"
                          autoFocus
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                        <input
                          type="password"
                          value={staffPassword}
                          onChange={(e) => {
                            setStaffPassword(e.target.value);
                            setStaffPasscodeError('');
                          }}
                          placeholder="Enter admin password..."
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1A0E30] border border-purple-700/60 focus:border-purple-400 text-white placeholder-slate-500 text-sm font-mono focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {staffPasscodeError && (
                      <p className="text-xs text-red-400 font-mono flex items-center gap-1">
                        <span>⚠️</span> {staffPasscodeError}
                      </p>
                    )}

                    <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-900/40 text-[11px] font-mono text-slate-400">
                      🔐 Only authorized staff can access this panel
                    </div>

                    <button
                      type="submit"
                      className="btn-press w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-600/40 transition-all"
                    >
                      <span>Access Admin Panel</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Global Footer */}
      <ReviewsSection />
      <Footer onCopyIp={handleCopyIp} copied={copiedIp} onNavigate={handleNavigate} links={siteContent.links} />

      {/* Checkout Modal with Official UPI QR Code */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        currency={currency}
        coupons={coupons}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Invoice Modal with Official VOIDMC Branding */}
      <InvoiceModal
        order={activeInvoice}
        discordLink={siteContent.links.discord}
        onClose={() => setActiveInvoice(null)}
        onMarkDiscordShared={(orderId) => {
          setOrders((prev) =>
            prev.map((o) => (o.id === orderId ? { ...o, discordShared: true } : o))
          );
        }}
      />

      {/* Push Notification Toast Container */}
      <NotificationToast
        notifications={notifications}
        onDismiss={dismissNotification}
      />
    </div>
  );
}
