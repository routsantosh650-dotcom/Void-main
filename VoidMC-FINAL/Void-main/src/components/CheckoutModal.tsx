import React, { useState } from 'react';
import { X, Trash2, Check, QrCode, CreditCard, ArrowRight, AlertCircle, Copy } from 'lucide-react';
import { CartItem, Coupon, Currency, Order } from '../types/index.ts';
import { calculateCartTotals, validateMinecraftUsername, generateInvoiceNumber, formatCurrency } from '../utils/pureRules.ts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  currency: Currency;
  coupons: Coupon[];
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currency,
  coupons,
  onOrderCompleted,
}) => {
  if (!isOpen) return null;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(coupons.find(c => c.code === 'VOID50') || null);
  const [couponError, setCouponError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI_QR' | 'CARD_STRIPE'>('UPI_QR');
  const [utrNumber, setUtrNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const { subtotal, discount, finalTotal } = calculateCartTotals(cartItems, appliedCoupon, currency);
  const userValidation = validateMinecraftUsername(username);

  const handleApplyCoupon = () => {
    setCouponError('');
    const found = coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (!found) {
      setCouponError('Invalid coupon code. Try VOID50 or SUMMER25!');
      return;
    }
    if (!found.active) {
      setCouponError('This coupon has expired.');
      return;
    }
    setAppliedCoupon(found);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!userValidation.valid) {
      setFormError(userValidation.error || 'Please provide a valid Minecraft IGN.');
      return;
    }

    if (cartItems.length === 0) {
      setFormError('Your cart is empty. Please add items to checkout.');
      return;
    }

    if (paymentMethod === 'UPI_QR' && !utrNumber.trim()) {
      setFormError('Please enter the 12-digit UPI UTR Transaction Reference ID from Google Pay / PhonePe.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder: Order = {
        id: `ord_${Date.now()}`,
        invoiceNumber: generateInvoiceNumber(),
        minecraftUsername: username.trim(),
        playerEmail: email.trim() || undefined,
        items: cartItems.map(ci => ({
          id: ci.item.id,
          name: ci.item.name,
          category: ci.item.category,
          quantity: ci.quantity,
          unitPrice: currency === 'USD' ? ci.item.priceUSD : ci.item.priceINR,
          currency,
        })),
        subtotal,
        discountAmount: discount,
        couponCode: appliedCoupon?.code,
        total: finalTotal,
        currency,
        paymentMethod,
        status: paymentMethod === 'UPI_QR' ? 'PENDING_VERIFICATION' : 'COMPLETED',
        utrTransactionId: utrNumber.trim() || undefined,
        createdAt: new Date().toISOString(),
        discordShared: false,
      };

      setIsSubmitting(false);
      onOrderCompleted(newOrder);
      onClearCart();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-start justify-center p-4 py-8">
      <div className="relative w-full max-w-3xl bg-[#110A1F] border border-purple-800/60 rounded-3xl shadow-[0_0_60px_rgba(168,85,247,0.35)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-purple-900/40 flex items-center justify-between bg-[#160D26]">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/aistudio/voidopppp_5e12ad16.png"
              alt="VOID Logo"
              className="w-7 h-7 rounded-lg object-cover border border-purple-500/50"
            />
            <h2 className="text-lg font-black text-white font-heading tracking-wide">
              COMPLETE YOUR VOIDMC ORDER
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Checkout"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-purple-900/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="p-6 space-y-6 overflow-y-auto flex-1">
          {formError && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Cart Items List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
                ITEMS IN CART ({cartItems.length})
              </h3>
              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-[11px] font-mono text-slate-400 hover:text-red-400 transition-colors"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#160D26]/60 border border-purple-900/30 text-slate-400 text-sm">
                Your cart is empty. Add ranks or keys from the store!
              </div>
            ) : (
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {cartItems.map((ci) => (
                  <div
                    key={ci.item.id}
                    className="p-3 rounded-xl bg-[#160D26] border border-purple-900/30 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-white font-mono">{ci.item.name}</div>
                      <div className="text-purple-300 font-mono">
                        {formatCurrency(currency === 'USD' ? ci.item.priceUSD : ci.item.priceINR, currency)}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-purple-800/60 rounded-lg overflow-hidden bg-[#110A1F]">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(ci.item.id, -1)}
                          className="px-2 py-1 text-purple-300 hover:bg-purple-900/40"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-1 text-white font-mono font-bold">{ci.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(ci.item.id, 1)}
                          className="px-2 py-1 text-purple-300 hover:bg-purple-900/40"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(ci.item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Minecraft Username & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-bold mb-1.5">
                Minecraft Username (IGN) <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. elite_ansh"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#160D26] border border-purple-800/60 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
                />
                {username.trim().length >= 3 && (
                  <img
                    src={`https://mc-heads.net/avatar/${username.trim()}/44`}
                    alt="Skin preview"
                    className="w-11 h-11 rounded-xl border border-purple-500 shrink-0 bg-purple-950 shadow-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://mc-heads.net/avatar/Steve/44';
                    }}
                  />
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">In-game ranks will be automatically credited to this player.</p>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-bold mb-1.5">
                Discord Tag / Email (Optional)
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. ansh#0001 or email@voidmc.fun"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#160D26] border border-purple-800/60 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
              <p className="text-[11px] text-slate-400 mt-1">Used for syncing your Discord role and sending invoice PDF.</p>
            </div>
          </div>

          {/* Coupon Code Input */}
          <div className="p-3.5 rounded-xl bg-[#160D26]/70 border border-purple-900/40">
            <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1.5">
              Have a Coupon Code? (Active: <span className="text-purple-400">VOID50</span> for 50% OFF)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="ENTER COUPON CODE"
                className="w-full px-3 py-2 rounded-lg bg-[#110A1F] border border-purple-800/60 text-white font-mono text-xs uppercase focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
              >
                Apply
              </button>
            </div>
            {appliedCoupon && (
              <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1 font-mono">
                <Check className="w-3.5 h-3.5" />
                <span>Coupon applied: {appliedCoupon.code} ({appliedCoupon.discountPercent}% OFF)</span>
              </div>
            )}
            {couponError && <div className="mt-1 text-xs text-red-400 font-mono">{couponError}</div>}
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-bold mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI_QR')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  paymentMethod === 'UPI_QR'
                    ? 'bg-purple-950/70 border-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                    : 'bg-[#160D26] border-purple-900/40 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs font-mono mb-1">
                  <QrCode className="w-4 h-4 text-purple-400" />
                  <span>GOOGLE PAY / UPI PAYMENT QR</span>
                </div>
                <div className="text-[11px] text-slate-400">Scan QR Code, Enter UTR & Share in Discord</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CARD_STRIPE')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  paymentMethod === 'CARD_STRIPE'
                    ? 'bg-purple-950/70 border-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                    : 'bg-[#160D26] border-purple-900/40 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs font-mono mb-1">
                  <CreditCard className="w-4 h-4 text-purple-400" />
                  <span>CREDIT / DEBIT CARD / STRIPE</span>
                </div>
                <div className="text-[11px] text-slate-400">Instant Automated International Gateway</div>
              </button>
            </div>
          </div>

          {/* Real User-Provided UPI Payment QR Code Section: /public/assets/aistudio/voidpay_67d7af6d.png */}
          {paymentMethod === 'UPI_QR' && (
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#180E2C] to-[#110A1F] border-2 border-purple-600/60 shadow-[0_0_35px_rgba(168,85,247,0.25)]">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Official Scanned Payment QR Code from /public/assets/aistudio/voidpay_67d7af6d.png */}
                <div className="bg-white p-2.5 rounded-2xl shadow-2xl shrink-0 flex flex-col items-center border-2 border-purple-400">
                  <img
                    src="/assets/aistudio/voidpay_67d7af6d.png"
                    alt="VOIDMC Official Google Pay UPI Payment QR"
                    className="w-44 h-52 object-contain rounded-xl select-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] font-mono font-bold text-slate-900">
                    <span>Google Pay / BHIM / PhonePe</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs flex-1">
                  <div className="font-bold text-purple-300 font-mono text-base">
                    Total Amount: {formatCurrency(finalTotal, currency)}
                  </div>
                  <div className="p-3 rounded-xl bg-[#0F081C] border border-purple-800/40 space-y-1.5 text-slate-300 text-[11px] font-mono">
                    <p className="text-white font-bold">1. Scan the QR code above with any UPI app.</p>
                    <p>2. Complete the payment of {formatCurrency(finalTotal, currency)}.</p>
                    <p>3. Copy the 12-digit UTR / Reference Number from your payment receipt and paste below.</p>
                    <p className="text-purple-300">4. Submit to generate official invoice, then click "Share on Discord Ticket"!</p>
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-mono text-purple-300 font-bold mb-1">
                      12-Digit UPI Transaction ID / UTR <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="e.g. 429810928371 (from PhonePe / GPay)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E071A] border border-purple-600/70 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Breakdown */}
          <div className="p-4 rounded-2xl bg-[#160D26] border border-purple-900/40 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal, currency)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount ({appliedCoupon?.code}):</span>
                <span>-{formatCurrency(discount, currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-white pt-2 border-t border-purple-900/40">
              <span>Total Due:</span>
              <span className="text-purple-300 font-black">{formatCurrency(finalTotal, currency)}</span>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting || cartItems.length === 0}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(147,51,234,0.45)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-101 active:scale-98"
          >
            {isSubmitting ? (
              <span>GENERATING INVOICE...</span>
            ) : (
              <>
                <span>CONFIRM ORDER & GENERATE INVOICE</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
