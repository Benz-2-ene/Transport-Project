export type RideCategory = 'economy' | 'comfort' | 'premium' | 'xl';
const RULES: Record<RideCategory, { base: number; perKm: number; perMinute: number; minimum: number }> = {
  economy: { base: 700, perKm: 190, perMinute: 45, minimum: 1200 },
  comfort: { base: 1050, perKm: 275, perMinute: 65, minimum: 1900 },
  premium: { base: 1600, perKm: 390, perMinute: 90, minimum: 2800 },
  xl: { base: 1450, perKm: 340, perMinute: 80, minimum: 2500 },
};

export function quoteFare(input: { distanceKm: number; durationMinutes: number; category: RideCategory; surgeMultiplier: number }) {
  const rule = RULES[input.category];
  const subtotal = rule.base + rule.perKm * input.distanceKm + rule.perMinute * input.durationMinutes;
  const fare = Math.max(rule.minimum, Math.round(subtotal * Math.max(1, input.surgeMultiplier)));
  return { currency: 'NGN', category: input.category, estimatedFare: fare, bookingFee: 0, surgeMultiplier: input.surgeMultiplier, pricingVersion: '2026-09-18' };
}

/** Commission is inclusive of tax by default: do not add VAT on top of this amount. */
export function settlementFor(fare: number, commissionRate = 0.1) {
  const commission = Math.round(fare * commissionRate);
  return { grossFare: fare, platformCommission: commission, driverSettlement: fare - commission, commissionTaxTreatment: 'inclusive' as const };
}
