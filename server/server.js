import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';

import corsOptions from './config/corsOptions.js';
import { logger } from './middleware/logEvents.js';
import errorHandler from './middleware/errorHandler.js';
import verifyJWT from './middleware/verifyJWT.js';
import credentials from './middleware/credentials.js';

// your DB file must export default or named exports
import db from './models/index.js';

const app = express();
const PORT = process.env.PORT || 8080;




// ⬇️ FIX __dirname for ES Modules (this was missing)
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ⬆️ REQUIRED for express.static and sendFile()
// -----------------------------

// custom middleware logger
app.use(logger);

db.sequelize
    .sync()
    .then(() => console.log("Synced db."))
    .catch(err => console.log("Failed to sync db: " + err.message));

// Handle options credentials check
app.use(credentials);

// CORS
app.use(cors(corsOptions));

// URL encoded + JSON parsing
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// cookies
app.use(cookieParser());

// static files
app.use('/', express.static(path.join(__dirname, '/public')));

// Health route
app.get('/health', (req, res) => {
    res.json({
        ok: true,
        msg: 'API is running',
    });
});


// routes
import rootRoutes from './routes/root.js';
app.use('/', rootRoutes);

import registerRoutes from './routes/register.js';
app.use('/register', registerRoutes);

import authRoutes from './routes/auth.js';
app.use('/auth', authRoutes);

import refreshRoutes from './routes/refresh.js';
app.use('/refresh', refreshRoutes);


import logoutRoutes from './routes/logout.js';
app.use('/logout', logoutRoutes);


app.use(verifyJWT);
import userRoutes from './routes/api/users.js';
app.use('/users', userRoutes);


app.all(/.*/, (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});


// error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


