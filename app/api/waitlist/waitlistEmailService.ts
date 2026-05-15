import { Resend } from "resend";

import type {
  WaitlistEmailClient,
  WaitlistEmailConfig,
  WaitlistEmailOptions,
  WaitlistPayload,
} from "./waitlistModel";

/**
 * Reads a required server-side environment variable for Resend email delivery.
 * @param key Environment variable name to read.
 */
function getRequiredEnvValue(key: string): string {
  const value = process.env[key]?.trim();

  if (!value) {
    throw new Error(`${key} is required for waitlist email delivery.`);
  }

  return value;
}

/**
 * Reads a comma-separated email list from an optional environment variable.
 * @param key Environment variable name to read.
 */
function getOptionalEmailList(key: string): string[] {
  const value = process.env[key]?.trim();

  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((email) => email.trim())
    .filter((email) => email.length > 0);
}

/**
 * Builds the Resend configuration from server-only environment variables.
 */
function getWaitlistEmailConfig(): WaitlistEmailConfig {
  // Resend is configured server-side only; RESEND_API_KEY is never exposed to the browser.
  return {
    resendApiKey: getRequiredEnvValue("RESEND_API_KEY"),
    resendFromEmail: getRequiredEnvValue("RESEND_FROM_EMAIL"),
    adminEmail: getRequiredEnvValue("ADMIN_EMAIL"),
    autoResponseBccEmails: getOptionalEmailList("AUTO_RESPONSE_BCC_EMAILS"),
  };
}

/**
 * Escapes user-submitted values before rendering them in HTML email bodies.
 * @param value User-submitted value to render.
 */
function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/**
 * Renders one labeled field row in the admin notification HTML email.
 * @param label Human-readable field label.
 * @param value User-submitted field value.
 */
function renderAdminEmailRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding: 10px 12px; border: 1px solid #d8dee4; font-weight: 700; width: 190px;">
        ${escapeHtml(label)}
      </td>
      <td style="padding: 10px 12px; border: 1px solid #d8dee4;">${escapeHtml(value)}</td>
    </tr>
  `;
}

/**
 * Renders the HTML body for the internal admin notification email.
 * @param payload Normalized waitlist payload.
 */
export function renderAdminNotificationHtml(payload: WaitlistPayload): string {
  return `
    <div style="font-family: Arial, sans-serif; color: #17212b; line-height: 1.5;">
      <h1 style="font-size: 22px; margin: 0 0 16px;">New Franchise Waiting List Submission</h1>
      <table style="border-collapse: collapse; width: 100%; max-width: 760px;">
        <tbody>
          ${renderAdminEmailRow("Name", payload.name)}
          ${renderAdminEmailRow("Email", payload.email)}
          ${renderAdminEmailRow("Phone", payload.phone)}
          ${renderAdminEmailRow("Location", payload.territory)}
          ${renderAdminEmailRow("Opportunity Type", payload.opportunity)}
          ${renderAdminEmailRow("Expected Investment", payload.investment)}
          ${renderAdminEmailRow("Current Trade / Experience", payload.trade)}
          ${renderAdminEmailRow("Message / Business Vision", payload.vision)}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * Renders the plain text body for the internal admin notification email.
 * @param payload Normalized waitlist payload.
 */
export function renderAdminNotificationText(payload: WaitlistPayload): string {
  return [
    "New Franchise Waiting List Submission",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone}`,
    `Location: ${payload.territory}`,
    `Opportunity Type: ${payload.opportunity}`,
    `Expected Investment: ${payload.investment}`,
    `Current Trade / Experience: ${payload.trade}`,
    `Message / Business Vision: ${payload.vision}`,
  ].join("\n");
}

/**
 * Renders the HTML body for the applicant auto-response email.
 * @param payload Normalized waitlist payload.
 */
export function renderAutoResponseHtml(payload: WaitlistPayload): string {
  return `
    <div style="font-family: Arial, sans-serif; color: #17212b; line-height: 1.6;">
      <p>Hi ${escapeHtml(payload.name)},</p>
      <p>
        We&apos;ve received your application and have included you in our initial review group.
      </p>
      <p>
        We are currently preparing for the launch of our first franchise areas this September, a
        meaningful step in expanding the Betz platform across new markets. This is not a broad
        rollout. Our focus is on building a small group of strong operators who can establish and
        lead their Designated Service Area with the level of service and professionalism the Betz
        brand has been known for since 1945.
      </p>
      <p>
        The opportunity is structured around a fully integrated model, combining retail, weekly
        service, and supply, designed to create long-term, recurring revenue within each area. As
        markets develop, the goal is to build density, strengthen customer relationships, and create
        a scalable local business supported by centralized systems.
      </p>
      <p>
        We are reviewing all applications carefully and in sequence as we move toward our first
        allocations.
      </p>
      <p>
        We will be in touch shortly with next steps.
      </p>
      <p>
        Best regards,<br />
        Betz Pools Franchise Team
      </p>
    </div>
  `;
}

/**
 * Renders the plain text body for the applicant auto-response email.
 * @param payload Normalized waitlist payload.
 */
export function renderAutoResponseText(payload: WaitlistPayload): string {
  return [
    `Hi ${payload.name},`,
    "",
    "We've received your application and have included you in our initial review group.",
    "",
    "We are currently preparing for the launch of our first franchise areas this September, a meaningful step in expanding the Betz platform across new markets. This is not a broad rollout. Our focus is on building a small group of strong operators who can establish and lead their Designated Service Area with the level of service and professionalism the Betz brand has been known for since 1945.",
    "",
    "The opportunity is structured around a fully integrated model, combining retail, weekly service, and supply, designed to create long-term, recurring revenue within each area. As markets develop, the goal is to build density, strengthen customer relationships, and create a scalable local business supported by centralized systems.",
    "",
    "We are reviewing all applications carefully and in sequence as we move toward our first allocations.",
    "",
    "We will be in touch shortly with next steps.",
    "",
    "Best regards,",
    "Betz Pools Franchise Team",
  ].join("\n");
}

/**
 * Builds Resend email options for the internal admin notification.
 * @param payload Normalized waitlist payload.
 * @param config Server-side Resend email configuration.
 */
export function createAdminNotificationEmailOptions(
  payload: WaitlistPayload,
  config: WaitlistEmailConfig
): WaitlistEmailOptions {
  return {
    from: config.resendFromEmail,
    to: config.adminEmail,
    subject: "New Franchise Waiting List Submission",
    html: renderAdminNotificationHtml(payload),
    text: renderAdminNotificationText(payload),
    replyTo: payload.email,
  };
}

/**
 * Builds Resend email options for the applicant auto-response.
 * @param payload Normalized waitlist payload.
 * @param config Server-side Resend email configuration.
 */
export function createAutoResponseEmailOptions(
  payload: WaitlistPayload,
  config: WaitlistEmailConfig
): WaitlistEmailOptions {
  const emailOptions: WaitlistEmailOptions = {
    from: config.resendFromEmail,
    to: payload.email,
    subject: "Thank you for your interest in owning a Betz Pools Designated Service Area.",
    html: renderAutoResponseHtml(payload),
    text: renderAutoResponseText(payload),
  };

  if (config.autoResponseBccEmails.length > 0) {
    emailOptions.bcc = config.autoResponseBccEmails;
  }

  return emailOptions;
}

/**
 * Sends one prepared email through a Resend-compatible client.
 * @param emailClient Resend-compatible email client.
 * @param emailOptions Complete email options to send.
 */
async function sendEmail(emailClient: WaitlistEmailClient, emailOptions: WaitlistEmailOptions): Promise<void> {
  const response = await emailClient.emails.send(emailOptions);

  if (response.error) {
    throw new Error(response.error.message);
  }
}

/**
 * Sends admin notification and applicant auto-response emails for a waitlist submission.
 * @param payload Normalized and validated waitlist payload.
 * @param emailClient Optional email client override for tests.
 * @param emailConfig Optional email configuration override for tests.
 */
export async function sendWaitlistEmails(
  payload: WaitlistPayload,
  emailClient?: WaitlistEmailClient,
  emailConfig?: WaitlistEmailConfig
): Promise<void> {
  const config = emailConfig ?? getWaitlistEmailConfig();
  const client = emailClient ?? new Resend(config.resendApiKey);

  await sendEmail(client, createAdminNotificationEmailOptions(payload, config));
  await sendEmail(client, createAutoResponseEmailOptions(payload, config));
}
