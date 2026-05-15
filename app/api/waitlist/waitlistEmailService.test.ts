import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type {
  WaitlistEmailClient,
  WaitlistEmailConfig,
  WaitlistEmailOptions,
  WaitlistPayload,
} from "./waitlistModel";
import {
  createAdminNotificationEmailOptions,
  createAutoResponseEmailOptions,
  renderAdminNotificationHtml,
  renderAdminNotificationText,
  renderAutoResponseHtml,
  renderAutoResponseText,
  sendWaitlistEmails,
} from "./waitlistEmailService";

const payload: WaitlistPayload = {
  name: "Jane Smith",
  email: "jane@example.com",
  phone: "416-555-0100",
  territory: "Toronto, ON",
  opportunity: "retail",
  investment: "100-250",
  trade: "Pool service operator",
  vision: "Open a premium service-focused retail location.",
};

const config: WaitlistEmailConfig = {
  resendApiKey: "re_test",
  resendFromEmail: "Betz Pools Franchise <noreply@betzpoolsfranchise.com>",
  adminEmail: "admin@example.com",
  autoResponseBccEmails: [
    "thomas@example.com",
    "marc@example.com",
    "heather@example.com",
    "arnold@example.com",
  ],
};

describe("waitlistEmailService", () => {
  it("renders the admin notification HTML email body", () => {
    const html = renderAdminNotificationHtml(payload);

    assert.match(html, /New Franchise Waiting List Submission/);
    assert.match(html, /Message \/ Business Vision/);
    assert.match(html, /jane@example.com/);
  });

  it("renders the admin notification plain text email body", () => {
    const text = renderAdminNotificationText(payload);

    assert.match(text, /Location: Toronto, ON/);
    assert.match(text, /Expected Investment: 100-250/);
  });

  it("renders the applicant auto-response HTML email body", () => {
    const html = renderAutoResponseHtml(payload);

    assert.match(html, /Hi Jane Smith/);
    assert.match(html, /first franchise areas this September/);
  });

  it("renders the applicant auto-response plain text email body", () => {
    const text = renderAutoResponseText(payload);

    assert.match(text, /Hi Jane Smith/);
    assert.match(text, /Best regards,\nBetz Pools Franchise Team/);
  });

  it("builds Resend options for the admin notification email", () => {
    const options = createAdminNotificationEmailOptions(payload, config);

    assert.equal(options.from, config.resendFromEmail);
    assert.equal(options.to, config.adminEmail);
    assert.equal(options.replyTo, payload.email);
    assert.equal(options.subject, "New Franchise Waiting List Submission");
  });

  it("builds Resend options for the applicant auto-response email", () => {
    const options = createAutoResponseEmailOptions(payload, config);

    assert.equal(options.from, config.resendFromEmail);
    assert.equal(options.to, payload.email);
    assert.equal(
      options.subject,
      "Thank you for your interest in owning a Betz Pools Designated Service Area."
    );
    assert.deepEqual(options.bcc, config.autoResponseBccEmails);
  });

  it("sends admin and applicant emails through the provided email client", async () => {
    const sentOptions: WaitlistEmailOptions[] = [];
    const emailClient: WaitlistEmailClient = {
      emails: {
        send: async (options: WaitlistEmailOptions) => {
          sentOptions.push(options);
          return { error: null };
        },
      },
    };

    await sendWaitlistEmails(payload, emailClient, config);

    assert.equal(sentOptions.length, 2);
    assert.equal(sentOptions[0]?.to, config.adminEmail);
    assert.equal(sentOptions[1]?.to, payload.email);
  });
});
