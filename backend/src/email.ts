import nodemailer from 'nodemailer';
import { config } from './config';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

export async function verifyEmailTransport(): Promise<void> {
  await transporter.verify();
}

export async function sendRecoveryCode(email: string, code: string): Promise<void> {
  if (!config.email.user || !config.email.password) {
    throw new Error('E-mail não configurado no servidor.');
  }

  await transporter.sendMail({
    from: config.email.from,
    to: email,
    subject: 'Código de recuperação - Nexus Finance',
    text: `Seu código de recuperação é ${code}. Ele expira em 15 minutos.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px;">
        <h2 style="margin-bottom: 16px;">Nexus Finance</h2>
        <p>Você solicitou a recuperação da sua senha.</p>
        <p>Use o código abaixo para continuar:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 24px 0;">
          ${code}
        </div>
        <p>Este código expira em 15 minutos.</p>
        <p>Se você não solicitou esta recuperação, ignore este e-mail.</p>
      </div>
    `,
  });
}
