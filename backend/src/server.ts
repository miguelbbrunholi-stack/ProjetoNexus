import { generateRecurrences } from './recurrences';
import { app } from './app';
import { config } from './config';
import { database } from './database';
import { verifyEmailTransport } from './email';

async function start(): Promise<void> {
  await database.query('SELECT 1');

  try {
    await verifyEmailTransport();
    console.log('SMTP configurado e autenticado com sucesso.');
  } catch (error) {
    console.error('Falha na configuração SMTP:', error);
    console.error(
      'Configure EMAIL_USER e EMAIL_PASSWORD no arquivo backend/.env usando uma senha de app.',
    );
  }

  await generateRecurrences();
  let running = false;
  setInterval(
    async () => {
      if (running) return;
      running = true;
      try {
        await generateRecurrences();
      } catch (error) {
        console.error('Falha ao gerar recorrências:', error);
      } finally {
        running = false;
      }
    },
    60 * 60 * 1000,
  ).unref();
  app.listen(config.port, () => {
    console.log(`API Nexus Finance rodando em http://localhost:${config.port}`);
  });
}

start().catch((error) => {
  console.error('Não foi possível iniciar o backend:', error);
  process.exit(1);
});
