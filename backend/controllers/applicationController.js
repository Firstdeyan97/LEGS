const Application = require('../models/application');
const { success } = require('../utils/response');

// Untuk Landing Page User
const getAllActive = async (req, res, next) => {
    try {
        const apps = await Application.findAllActive();
        return success(res, 'Data aplikasi publik berhasil dimuat.', apps);
    } catch (error) {
        next(error);
    }
};

// --- KHUSUS ADMIN ---

// Ambil semua data untuk tabel manajemen
const getAllForAdmin = async (req, res, next) => {
    try {
        const apps = await Application.findAll();
        return success(res, 'Seluruh data aplikasi berhasil dimuat.', apps);
    } catch (error) {
        next(error);
    }
};

// Tambah aplikasi baru
const createApp = async (req, res, next) => {
    try {
        const { app_name, target_url } = req.body;
        if (!app_name || !target_url) {
            throw { statusCode: 400, message: 'Nama Aplikasi dan URL Tujuan wajib diisi.' };
        }
        
        const insertId = await Application.create(req.body);
        return success(res, 'Aplikasi baru berhasil didaftarkan.', { id: insertId }, 201);
    } catch (error) {
        next(error);
    }
};

// Update aplikasi
const updateApp = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { app_name, target_url } = req.body;
        if (!app_name || !target_url) {
            throw { statusCode: 400, message: 'Nama Aplikasi dan URL Tujuan tidak boleh kosong.' };
        }

        const affectedRows = await Application.update(id, req.body);
        if (affectedRows === 0) throw { statusCode: 404, message: 'Aplikasi tidak ditemukan.' };

        return success(res, 'Data aplikasi berhasil diperbarui.');
    } catch (error) {
        next(error);
    }
};

// Hapus aplikasi
const deleteApp = async (req, res, next) => {
    try {
        const id = req.params.id;
        const affectedRows = await Application.delete(id);
        if (affectedRows === 0) throw { statusCode: 404, message: 'Aplikasi tidak ditemukan.' };

        return success(res, 'Aplikasi berhasil dihapus secara permanen.');
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllActive, getAllForAdmin, createApp, updateApp, deleteApp };