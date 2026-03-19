import {
  APP_BASE_URL,
  EMAIL_FROM,
  EMAIL_PROVIDER,
  POSTMARK_SERVER_TOKEN,
  RESEND_API_KEY,
  SENDGRID_API_KEY
} from "../config";

type MailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

function mustEmailConfig() {
  if (!EMAIL_PROVIDER) throw new Error("EMAIL_PROVIDER_NOT_CONFIGURED");
  if (!EMAIL_FROM) throw new Error("EMAIL_FROM_NOT_CONFIGURED");
  if (!APP_BASE_URL) throw new Error("APP_BASE_URL_NOT_CONFIGURED");
}

async function sendWithResend(input: MailInput) {
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY_NOT_CONFIGURED");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text
    })
  });
  if (!res.ok) throw new Error(`RESEND_SEND_FAILED_${res.status}`);
}

async function sendWithSendGrid(input: MailInput) {
  if (!SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY_NOT_CONFIGURED");
  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: { email: EMAIL_FROM },
      personalizations: [{ to: [{ email: input.to }] }],
      subject: input.subject,
      content: [
        { type: "text/plain", value: input.text },
        { type: "text/html", value: input.html }
      ]
    })
  });
  if (!res.ok) throw new Error(`SENDGRID_SEND_FAILED_${res.status}`);
}

async function sendWithPostmark(input: MailInput) {
  if (!POSTMARK_SERVER_TOKEN) throw new Error("POSTMARK_SERVER_TOKEN_NOT_CONFIGURED");
  const res = await fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: {
      "X-Postmark-Server-Token": POSTMARK_SERVER_TOKEN,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      From: EMAIL_FROM,
      To: input.to,
      Subject: input.subject,
      HtmlBody: input.html,
      TextBody: input.text
    })
  });
  if (!res.ok) throw new Error(`POSTMARK_SEND_FAILED_${res.status}`);
}

async function sendMail(input: MailInput) {
  mustEmailConfig();
  const provider = EMAIL_PROVIDER.toLowerCase();
  if (provider === "resend") return sendWithResend(input);
  if (provider === "sendgrid") return sendWithSendGrid(input);
  if (provider === "postmark") return sendWithPostmark(input);
  throw new Error("EMAIL_PROVIDER_UNSUPPORTED");
}

export async function sendVerificationEmail(input: { to: string; token: string }) {
  const verifyUrl = `${APP_BASE_URL.replace(/\/$/, "")}/verify-email?token=${encodeURIComponent(input.token)}`;
  const subject = "Verify your Kinetix account";
  const text = `Welcome to Kinetix. Verify your email using this link: ${verifyUrl}`;
  const html = `<p>Welcome to Kinetix.</p><p>Verify your email: <a href="${verifyUrl}">${verifyUrl}</a></p>`;
  await sendMail({
    to: input.to,
    subject,
    text,
    html
  });
}

export async function sendPasswordResetEmail(input: { to: string; token: string }) {
  const resetUrl = `${APP_BASE_URL.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(input.token)}`;
  const subject = "Reset your Kinetix password";
  const text = `Reset your password using this link: ${resetUrl}`;
  const html = `<p>Reset your password.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`;
  await sendMail({
    to: input.to,
    subject,
    text,
    html
  });
}
