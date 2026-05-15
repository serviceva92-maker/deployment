import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { normalizeWaitlistPayload, validateWaitlistPayload } from "./waitlistService";

const happyPathBody = {
  name: "  Jane Smith  ",
  email: "JANE@EXAMPLE.COM",
  phone: "416-555-0100",
  territory: "Toronto, ON",
  opportunity: "retail",
  investment: "100-250",
  trade: "Pool service operator",
  vision: "Open a premium service-focused retail location.",
};

describe("waitlistService", () => {
  it("normalizes a complete waitlist payload", () => {
    const payload = normalizeWaitlistPayload(happyPathBody);

    assert.deepEqual(payload, {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "416-555-0100",
      territory: "Toronto, ON",
      opportunity: "retail",
      investment: "100-250",
      trade: "Pool service operator",
      vision: "Open a premium service-focused retail location.",
    });
  });

  it("validates a complete waitlist payload", () => {
    const payload = normalizeWaitlistPayload(happyPathBody);
    const validation = validateWaitlistPayload(payload);

    assert.deepEqual(validation, {
      isValid: true,
      errorMessage: "",
    });
  });
});

