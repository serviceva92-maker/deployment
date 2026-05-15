export type WaitlistPayload = {
  name: string;
  email: string;
  phone: string;
  territory: string;
  opportunity: string;
  investment: string;
  trade: string;
  vision: string;
};

export type WaitlistRequestBody = Partial<WaitlistPayload> & {
  [fieldName: string]: string | number | boolean | null | undefined;
};

export type WaitlistValidationResult = {
  isValid: boolean;
  errorMessage: string;
};

export type WaitlistEmailConfig = {
  resendApiKey: string;
  resendFromEmail: string;
  adminEmail: string;
  autoResponseBccEmails: string[];
};

export type WaitlistEmailOptions = {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  bcc?: string[];
};

export type WaitlistEmailSendResult = {
  error?: {
    message: string;
  } | null;
};

export type WaitlistEmailClient = {
  emails: {
    send: (options: WaitlistEmailOptions) => Promise<WaitlistEmailSendResult>;
  };
};
