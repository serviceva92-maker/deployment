import { NextResponse } from "next/server";

const FORMSPREE_ENDPOINT =
  process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ?? "https://formspree.io/f/xnjowvew";

type WaitlistPayload = {
  name: string;
  email: string;
  phone: string;
  territory: string;
  opportunity: string;
  investment: string;
  trade: string;
  vision: string;
};

const MAX_LENGTHS = {
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
 * Normalizes raw input values to safe, bounded strings.
 */
function normalizeValue(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

/**
 * Maps unknown request input into the expected waitlist payload shape.
 */
function normalizePayload(raw: unknown): WaitlistPayload {
  const body = (raw ?? {}) as Record<string, unknown>;
  return {
    name: normalizeValue(body.name, MAX_LENGTHS.name),
    email: normalizeValue(body.email, MAX_LENGTHS.email).toLowerCase(),
    phone: normalizeValue(body.phone, MAX_LENGTHS.phone),
    territory: normalizeValue(body.territory, MAX_LENGTHS.territory),
    opportunity: normalizeValue(body.opportunity, MAX_LENGTHS.opportunity),
    investment: normalizeValue(body.investment, MAX_LENGTHS.investment),
    trade: normalizeValue(body.trade, MAX_LENGTHS.trade),
    vision: normalizeValue(body.vision, MAX_LENGTHS.vision),
  };
}

/**
 * Basic email format validation.
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Forwards waitlist submissions to Formspree for backward compatibility.
 */
export async function POST(request: Request) {
  const payload = normalizePayload(await request.json().catch(() => null));
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

  if (requiredValues.some((field) => !field)) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  if (!isValidEmail(payload.email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const providerPayload = (await response.json().catch(() => null)) as
        | { error?: string; errors?: { message?: string }[] }
        | null;
      const providerError = providerPayload?.errors?.[0]?.message ?? providerPayload?.error;
      return NextResponse.json(
        { error: providerError ?? "Unable to submit right now. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Your application could not be sent. Please try again." },
      { status: 502 }
    );
  }
}
