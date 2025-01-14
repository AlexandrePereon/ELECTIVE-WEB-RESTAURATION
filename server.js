import './config/config.js';
import express from 'express';
import path, { dirname } from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import connect from './db/index.js';
import routes from './routes/index.js';
import prometheusRouter from './routes/prometheusRoutes.js';
import logger from './utils/logger/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// connection from db here

connect(app);

app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//  adding routes
app.use(process.env.BASE_ENDPOINT, routes);
app.use(prometheusRouter);

app.on('ready', () => {
  app.listen(process.env.PORT, () => {
    logger.log('info', `Server is up on port : ${process.env.PORT}`);
  });
});

export default app;
