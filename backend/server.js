require('dotenv').config();
require('./db/connection');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorHandler');
const httpLogger = require('./middlewares/httpLogger');
const logger = require('./utils/logger');               
const { success } = require('./utils/response');

const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

const PORT = process.env.PORT || 1000;


const allowedOrigins = [
    'http://localhost:3000',     
    'http://localhost:1001',    
    'http://172.30.14.94:1001'   
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Akses CORS ditolak oleh LEGS SSO.'));
        }
    },
    credentials: true 
})); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(httpLogger);

app.get('/api/health', (req, res) => {
    return success(res, "EXVAN Backend is running smoothly", { uptime: process.uptime() });
});

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`🚀 Server is running elegantly on port ${PORT}`);
});