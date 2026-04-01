require('dotenv').config();
require('./db/connection');
const express = require('express');
const cors = require('cors'); // [WAJIB] Import CORS
const errorHandler = require('./middlewares/errorHandler');
const httpLogger = require('./middlewares/httpLogger');
const logger = require('./utils/logger');               
const { success } = require('./utils/response');
const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const userRoutes = require('./routes/userRoutes')

const app = express();
const PORT = process.env.PORT || 4000;

// 1. Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1.5. Pasang HTTP Logger
app.use(httpLogger);

app.get('/api/health', (req, res) => {
    logger.info("Endpoint health check berhasil diakses.");
    return success(res, "EXVAN Backend is running smoothly", { uptime: process.uptime() });
});

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);


app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`🚀 Server is running elegantly on http://localhost:${PORT}`);
});