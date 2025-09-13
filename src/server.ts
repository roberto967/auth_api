import { PORT as port } from './config/env';
import { createApp } from './app';

const app = createApp();

app.listen(port);

console.log(`Server running on port ${port}`);
