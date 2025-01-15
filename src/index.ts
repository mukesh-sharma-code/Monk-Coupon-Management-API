import App from './app';

const PORT = process.env.PORT || 3100;
const app = new App();
app.start(PORT);