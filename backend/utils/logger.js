const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// Syarat Format: [WAKTU] LEVEL: PESAN
const customFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level}: ${message}`;
});

/**
 * Konfigurasi Winston Logger untuk EXVAN.
 * Menyimpan log error di file terpisah, dan semua log di gabungan.
 */
const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat
    ),
    transports: [
        // Simpan log error secara spesifik ke file ini
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        // Simpan semua log (info, warning, error) ke file ini
        new transports.File({ filename: 'logs/combined.log' })
    ],
});

// Jika tidak di production, tampilkan juga log di Terminal/Console dengan warna agar cantik
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: combine(
            colorize(), // Memberi warna pada level (merah untuk error, hijau untuk info)
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            customFormat
        )
    }));
}

module.exports = logger;


