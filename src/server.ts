import { PORT } from './config/env';
import { createApp } from './app';
import { appDataSource } from './database/dbConnection';

async function startServer() {
  try {
    await appDataSource.initialize();
    console.log('[OK] Database connection established successfully.');

    const app = createApp();

    app.listen(PORT, () => {
      console.log(`[OK] Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('[ERROR] Error during server startup:', error);
    process.exit(1);
  }
}

void startServer();
