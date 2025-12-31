import express from 'express';
import cors from 'cors';
import router from './routes';
import { corsOptions } from './config/cors.config';

const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS must be applied BEFORE any route
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handle preflight requests

// Routes
app.use(router);

export { app };
