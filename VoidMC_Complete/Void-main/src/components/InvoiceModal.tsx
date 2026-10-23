import React, { useState } from 'react';
import { X, Printer, Share2, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { Order } from '../types/index.ts';
import { formatCurrency } from '../utils/pureRules.ts';

interface InvoiceModalProps {
  order: Order | null;
  onClose: () => void;
  onMarkDiscordShared: (orderId: string) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  order,
  onClose,
  onMarkDiscordShared,
}) => {
  if (!order) return null;

  const [copiedTicketText, setCopiedTicketText] = useState(false);

  const ticketPayload = `[VOIDMC ORDER VERIFICATION TICKET]
• Invoice #: ${order.invoiceNumber}
• Minecraft IGN: ${order.minecraftUsername}
• Total Paid: ${formatCurrency(order.total, order.currency)}
• Payment Method: ${order.paymentMethod}
• UTR / Transaction ID: ${order.utrTransactionId || 'N/A (Card/Gateway)'}
• Items: ${order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
• Date: ${new Date(order.createdAt).toLocaleString()}
Please verify and activate my in-game rank/keys!`;

  const handleShareDiscord = () => {
    navigator.clipboard.writeText(ticketPayload);
    setCopiedTicketText(true);
    onMarkDiscordShared(order.id);
    window.open('https://discord.gg/J64n9aEsW', '_blank', 'noopener,noreferrer');
    setTimeout(() => setCopiedTicketText(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#0E071A] border border-purple-600/60 rounded-3xl shadow-[0_0_60px_rgba(168,85,247,0.35)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Controls Bar */}
        <div className="p-4 bg-[#160D26] border-b border-purple-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-200">
              OFFICIAL BILLING RECEIPT
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-[#22133D] hover:bg-[#2C194E] text-purple-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
              title="Print or Save PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-purple-900/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="p-6 sm:p-8 space-y-6 text-slate-200">
          {/* Brand & Invoice Header */}
          <div className="flex items-start justify-between gap-4 pb-6 border-b border-purple-900/40">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/voidopppp_5e12ad16.png"
                alt="VOID Logo"
                className="w-12 h-12 rounded-xl object-cover border border-purple-500 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-black text-2xl text-white tracking-wider">VOIDMC</span>
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-mono text-[10px] border border-purple-800/40">
                    SEASON 5
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  play.voidmc.fun:25674 • Singapore Node
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  Support: discord.gg/J64n9aEsW
                </p>
              </div>
            </div>

            <div className="text-right font-mono">
              <div className="text-xs text-slate-400 uppercase">INVOICE NUMBER</div>
              <div className="text-lg font-black text-purple-300">{order.invoiceNumber}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Player & Payment Info Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#140B24] border border-purple-900/40">
            <div className="flex items-center gap-3">
              <img
                src={`https://mc-heads.net/avatar/${order.minecraftUsername}/48`}
                alt={order.minecraftUsername}
                className="w-12 h-12 rounded-xl border border-purple-600/40 bg-purple-950/60 shadow"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://mc-heads.net/avatar/Steve/48';
                }}
              />
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400">Billed Player IGN</div>
                <div className="text-base font-bold font-mono text-white">{order.minecraftUsername}</div>
                {order.playerEmail && (
                  <div className="text-xs text-slate-400 font-mono truncate">{order.playerEmail}</div>
                )}
              </div>
            </div>

            <div className="font-mono text-xs space-y-1 sm:text-right">
              <div className="text-[10px] uppercase text-slate-400">Payment Status</div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span>{order.status === 'COMPLETED' ? 'VERIFIED & DELIVERED' : 'AWAITING DISCORD TICKET'}</span>
              </div>
              <div className="text-slate-400 text-[11px]">
                Method: <span className="text-white font-bold">{order.paymentMethod}</span>
              </div>
              {order.utrTransactionId && (
                <div className="text-purple-300 text-[11px]">
                  UTR: <span className="font-bold">{order.utrTransactionId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-purple-900/40 rounded-xl overflow-hidden font-mono text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#180E2B] text-slate-400 uppercase text-[10px] border-b border-purple-900/40">
                <tr>
                  <th className="p-3">Item Description</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-950/60">
                {order.items.map((it, idx) => (
                  <tr key={idx} className="bg-[#110A1F]/60">
                    <td className="p-3 text-white font-bold">{it.name}</td>
                    <td className="p-3 text-center text-slate-300">{it.quantity}</td>
                    <td className="p-3 text-right text-slate-300">{formatCurrency(it.unitPrice, order.currency)}</td>
                    <td className="p-3 text-right text-purple-300 font-bold">
                      {formatCurrency(it.unitPrice * it.quantity, order.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations Breakdown */}
          <div className="flex justify-end font-mono text-xs">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span>{formatCurrency(order.subtotal, order.currency)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({order.couponCode || 'SALE'}):</span>
                  <span>-{formatCurrency(order.discountAmount, order.currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-purple-900/40">
                <span>Total Amount:</span>
                <span className="text-purple-300 font-black">{formatCurrency(order.total, order.currency)}</span>
              </div>
            </div>
          </div>

          {/* Discord Verification Callout Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#5865F2]/15 via-purple-950/40 to-[#5865F2]/15 border border-[#5865F2]/40 text-xs">
            <div className="flex items-center gap-2 text-[#8ea1e1] font-bold uppercase tracking-wider mb-2 font-mono">
              <span>DISCORD ORDER VERIFICATION INSTRUCTIONS</span>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4">
              To activate your purchased rank or keys, click below to copy your ticket details and open the official VOIDMC Discord server. Create a ticket in the <span className="text-purple-300 font-bold">#billing-support</span> channel!
            </p>

            <button
              type="button"
              onClick={handleShareDiscord}
              className="w-full py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-[#5865F2]/30 flex items-center justify-center gap-2 hover:scale-101 active:scale-98"
            >
              {copiedTicketText ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Ticket Details Copied! Opening Discord...</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Copy Ticket & Share on Discord</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
