import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateMinecraftUsername,
  calculateCartTotals,
  calculatePvPWheelWinner,
  calculateLeaderboardRanking,
  filterChatLogs,
  generateInvoiceNumber,
  formatCurrency,
} from './pureRules.ts';
import { CartItem, Coupon, LeaderboardPlayer, ChatMessage } from '../types/index.ts';

test('validateMinecraftUsername works accurately', () => {
  assert.equal(validateMinecraftUsername('Notch').valid, true);
  assert.equal(validateMinecraftUsername('elite_ansh').valid, true);
  assert.equal(validateMinecraftUsername('DMM_VOID').valid, true);
  assert.equal(validateMinecraftUsername('').valid, false);
  assert.equal(validateMinecraftUsername('ab').valid, false);
  assert.equal(validateMinecraftUsername('this_name_is_way_too_long_for_minecraft').valid, false);
});

test('calculateCartTotals calculates discounts and currency properly', () => {
  const sampleItems: CartItem[] = [
    {
      item: {
        id: 'rank_void',
        name: 'VOID Rank',
        category: 'rank',
        priceINR: 359,
        priceUSD: 4.49,
        priceCoins: 4100,
        iconType: 'void',
        features: ['1 Void Key every week'],
      },
      quantity: 2,
    },
    {
      item: {
        id: 'key_void',
        name: 'Void Key',
        category: 'crate_key',
        priceINR: 120,
        priceUSD: 1.49,
        priceCoins: 750,
        iconType: 'key',
        features: ['2x Void Keys'],
      },
      quantity: 1,
    },
  ];

  const totalsINR = calculateCartTotals(sampleItems, null, 'INR');
  assert.equal(totalsINR.subtotal, 838);
  assert.equal(totalsINR.discount, 0);
  assert.equal(totalsINR.finalTotal, 838);

  const coupon50: Coupon = {
    code: 'VOID50',
    discountPercent: 50,
    active: true,
    minSpendINR: 100,
    usageCount: 12,
    description: '50% off',
  };
  const totalsWithCoupon = calculateCartTotals(sampleItems, coupon50, 'INR');
  assert.equal(totalsWithCoupon.subtotal, 838);
  assert.equal(totalsWithCoupon.discount, 419);
  assert.equal(totalsWithCoupon.finalTotal, 419);

  assert.equal(formatCurrency(359, 'INR'), '₹359');
  assert.equal(formatCurrency(4.49, 'USD'), '$4.49');
});

test('calculatePvPWheelWinner selects valid segments', () => {
  const modes = ['SWORD', 'AXE', 'CRYSTAL', 'UHC', 'BOXING', 'SUMO', 'COMBO', 'NODERUFF', 'MACE', 'SPEAR'];
  const atZero = calculatePvPWheelWinner(0, modes);
  assert.equal(typeof atZero.index, 'number');
  assert.equal(modes.includes(atZero.mode), true);
});

test('generateInvoiceNumber formats correctly', () => {
  const inv = generateInvoiceNumber();
  assert.match(inv, /^VOID-2026-[A-Z0-9]{4}$/);
});
