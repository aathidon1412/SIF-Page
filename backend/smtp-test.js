import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { appendFile, mkdir } from 'fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOG_PATH = `${__dirname}/logs/smtp-test.log`;

const mask = (s) => {
  if (!s) return null;
  if (s.length <= 4) return '****';
  return s.slice(0, 2) + '****' + s.slice(-2);
};

const run = async () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  const log = { ts: new Date().toISOString(), host, port, secure, user: mask(user) };

  try {
    // ensure logs dir exists
    await mkdir(`${__dirname}/logs`, { recursive: true });
    
    if (!host || !user) {
      log.ok = false;
      log.message = 'SMTP_HOST or SMTP_USER missing in environment';
      await appendFile(LOG_PATH, JSON.stringify(log) + '\n');
      console.error('SMTP test failed - missing configuration. See logs/smtp-test.log');
      return process.exit(1);
    }

    const transporter = nodemailer.createTransport({ host, port, secure, auth: user && pass ? { user, pass } : undefined });

    // verify connection
    await transporter.verify();
    log.ok = true;
    log.message = 'SMTP connection verified';
    await appendFile(LOG_PATH, JSON.stringify(log) + '\n');
    console.log('SMTP verified successfully. Attempting test email...');

    // send a lightweight test email to admin or user
    const to = process.env.ADMIN_EMAIL || user;
    const from = process.env.SMTP_FROM || user || `no-reply@${host}`;

    const info = await transporter.sendMail({
      from,
      to,
      subject: `SMTP Test Message - ${new Date().toISOString()}`,
      html: `<p>This is a test message confirming SMTP connectivity at ${new Date().toISOString()}.</p>`
    });

    const sentLog = { ts: new Date().toISOString(), to, messageId: info.messageId || null, accepted: info.accepted || [], rejected: info.rejected || [] };
    await appendFile(LOG_PATH, JSON.stringify({ type: 'send', ...sentLog }) + '\n');
    console.log('Test email sent, check inbox (or logs).');
    process.exit(0);
  } catch (err) {
    log.ok = false;
    log.error = err && err.message ? err.message : String(err);
    log.stack = err && err.stack ? err.stack.split('\n').slice(0,5) : undefined;
    await appendFile(LOG_PATH, JSON.stringify(log) + '\n');
    console.error('SMTP test failed, details written to logs/smtp-test.log');
    console.error(err);
    process.exit(2);
  }
};

run();
