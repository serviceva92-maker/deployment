import type { WaitlistPayload, WaitlistRequestBody, WaitlistValidationResult } from "./waitlistModel";

const waitlist_max_lengths = {
  name: 100,
  email: 255,
  phone: 20,
  territory: 100,
  opportunity: 40,
  investment: 40,
  trade: 200,
  vision: 1000,
} as const;

/**
 * Normalizes a request value into a trimmed string capped at a safe length.
 * @param value Raw submitted form value.
 * @param maxLength Maximum number of characters to keep.
 */
function normalizeValue(value: string | number | boolean | null | undefined, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

/**
 * Maps raw waitlist request fields into the server-side payload model.
 * @param body Parsed JSON body submitted by the waitlist form.
 */
export function normalizeWaitlistPayload(body: WaitlistRequestBody): WaitlistPayload {
  return {
    name: normalizeValue(body.name, waitlist_max_lengths.name),
    email: normalizeValue(body.email, waitlist_max_lengths.email).toLowerCase(),
    phone: normalizeValue(body.phone, waitlist_max_lengths.phone),
    territory: normalizeValue(body.territory, waitlist_max_lengths.territory),
    opportunity: normalizeValue(body.opportunity, waitlist_max_lengths.opportunity),
    investment: normalizeValue(body.investment, waitlist_max_lengths.investment),
    trade: normalizeValue(body.trade, waitlist_max_lengths.trade),
    vision: normalizeValue(body.vision, waitlist_max_lengths.vision),
  };
}

/**
 * Checks whether an email address has the basic shape required for delivery.
 * @param email Email address submitted by the user.
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates all required waitlist fields before email delivery.
 * @param payload Normalized waitlist payload.
 */
export function validateWaitlistPayload(payload: WaitlistPayload): WaitlistValidationResult {
  const requiredValues = [
    payload.name,
    payload.email,
    payload.phone,
    payload.territory,
    payload.opportunity,
    payload.investment,
    payload.trade,
    payload.vision,
  ];

  if (requiredValues.some((fieldValue) => !fieldValue)) {
    return { isValid: false, errorMessage: "Please fill in all required fields." };
  }

  if (!isValidEmail(payload.email)) {
    return { isValid: false, errorMessage: "Please provide a valid email address." };
  }

  return { isValid: true, errorMessage: "" };
}

