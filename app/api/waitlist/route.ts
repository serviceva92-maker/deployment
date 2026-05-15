import { NextResponse } from "next/server";

import { sendWaitlistEmails } from "./waitlistEmailService";
import type { WaitlistRequestBody } from "./waitlistModel";
import { normalizeWaitlistPayload, validateWaitlistPayload } from "./waitlistService";

export const runtime = "nodejs";

/**
 * Handles waitlist submissions and sends both Resend emails from the server.
 * @param request Incoming POST request containing the waitlist JSON payload.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch((): WaitlistRequestBody => {
    return {};
  })) as WaitlistRequestBody;
  const payload = normalizeWaitlistPayload(body);
  const validation = validateWaitlistPayload(payload);

  if (!validation.isValid) {
    return NextResponse.json({ error: validation.errorMessage }, { status: 400 });
  }

  try {
    await sendWaitlistEmails(payload);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Your application could not be sent. Please try again." },
      { status: 502 }
    );
  }
}
