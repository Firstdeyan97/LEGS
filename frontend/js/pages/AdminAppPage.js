import ApiService from '../services/apiService.js';
import { Dialog } from '../utils/dialog.js';

const AdminAppPage = {
    render: async () => {
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        if (userData.role !== 'admin') return `<div>Akses Ditolak</div>`;

        return `
            <div class="app-unified-wrapper">
                <div class="glow-orb orb-primary"></div><div class="glow-orb orb-accent"></div>
                <div class="dashboard-panel premium-light-card">
                    <nav class="dashboard-nav">
                        <div class="nav-brand">
                            <div class="logo-placeholder-small"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg></div>
                            <span class="brand-text-dark">LEGS Panel</span>
                        </div>
                        <div class="nav-menu-center">
                            <button class="nav-tab" data-path="/">Portal Utama</button>
                            <button class="nav-tab active" data-path="/admin/apps">Aplikasi</button>
                            <button class="nav-tab" data-path="/admin/users">Pengguna</button>
                        </div>
                        <div class="user-controls">
                            <span class="greeting-text">Halo, <strong>${userData.username}</strong></span>
                            <button id="logoutBtn" class="btn-logout-premium" style="margin-left:10px;">Akhiri Sesi</button>
                        </div>
                    </nav>
                    <main class="dashboard-content">
                        <header class="content-header" style="display:flex; justify-content:space-between; align-items:center;">
                            <div><h1 class="content-title">Manajemen Aplikasi</h1><p class="content-subtitle">Atur modul dan engine yang tampil di portal.</p></div>
                            <button id="openModalBtn" class="btn-glow login-btn" style="width:auto; padding:12px 24px; margin-top:0;">+ Tambah Aplikasi</button>
                        </header>
                        <div class="table-container">
                            <table class="premium-table">
                                <thead><tr><th>Nama Aplikasi</th><th>URL Tujuan</th><th>Status</th><th style="text-align:right;">Aksi</th></tr></thead>
                                <tbody id="tableBody"><tr><td colspan="4" style="text-align:center;">Memuat data...</td></tr></tbody>
                            </table>
                        </div>
                    </main>
                </div>
                <div id="appModal" class="modal-overlay hidden">
                    <div class="modal-card premium-light-card" style="max-width: 500px; padding: 35px;">
                        <div class="modal-header" style="margin-bottom: 25px; display:flex; justify-content:space-between;">
                            <h2 id="modalTitle" class="content-title" style="font-size: 22px;">Form Aplikasi</h2>
                            <button id="closeModalBtn" class="btn-icon" style="position:static;">✖</button>
                        </div>
                        <form id="appForm" class="login-form">
                            <input type="hidden" id="appId" value="">
                            <div class="form-group neuromorphic-input-group"><label>Nama Aplikasi</label><input type="text" id="appName" required autocomplete="off"></div>
                            <div class="form-group neuromorphic-input-group"><label>URL Tujuan</label><input type="text" id="targetUrl" required autocomplete="off"></div>
                            <div class="form-group neuromorphic-input-group"><label>Deskripsi</label><input type="text" id="description" autocomplete="off"></div>
                            <div class="form-group neuromorphic-input-group">
                                <label>Status</label>
                                <select id="isActive" class="premium-select"><option value="1">Aktif</option><option value="0">Non-aktif</option></select>
                            </div>
                            <div id="modalAlert" class="alert hidden"></div>
                            <button type="submit" id="saveAppBtn" class="btn-glow login-btn">Simpan Data</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    },
    afterRender: async () => {
        // Navigasi Tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                window.history.pushState({}, "", e.target.getAttribute('data-path'));
                window.dispatchEvent(new Event('popstate'));
            });
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            Dialog.confirm('Akhiri Sesi', 'Yakin ingin keluar dari portal?', () => {
                localStorage.removeItem('jwt_token'); localStorage.removeItem('user_data');
                window.history.pushState({}, "", "/login"); window.dispatchEvent(new Event('popstate'));
            });
        });

        const modal = document.getElementById('appModal');
        const loadTable = async () => {
            const tbody = document.getElementById('tableBody');
            try {
                const res = await ApiService.get('/applications/all');
                tbody.innerHTML = res.data.map(app => `
                    <tr>
                        <td style="font-weight:700; color:var(--ut-deep-blue);">${app.app_name}</td>
                        <td style="color:#64748b;">${app.target_url}</td>
                        <td><span class="status-badge ${app.is_active ? 'active' : 'inactive'}">${app.is_active ? 'Aktif' : 'Non-aktif'}</span></td>
                        <td style="text-align:right;">
                            <button class="btn-action edit-btn" data-app='${JSON.stringify(app)}'>Edit</button>
                            <button class="btn-action delete-btn" data-id="${app.id}">Hapus</button>
                        </td>
                    </tr>`).join('');

                document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', (e) => openModal(JSON.parse(e.target.getAttribute('data-app')))));
                document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', (e) => {
                    Dialog.confirm('Hapus Aplikasi', 'Aplikasi ini akan dihapus permanen. Lanjutkan?', async () => {
                        await ApiService.delete(`/applications/${e.target.getAttribute('data-id')}`); loadTable();
                    });
                }));
            } catch (err) { tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:red;">${err.message}</td></tr>`; }
        };

        const openModal = (app = null) => {
            document.getElementById('modalAlert').className = 'alert hidden';
            if(app) {
                document.getElementById('appId').value = app.id; document.getElementById('appName').value = app.app_name;
                document.getElementById('targetUrl').value = app.target_url; document.getElementById('description').value = app.description || '';
                document.getElementById('isActive').value = app.is_active;
            } else { document.getElementById('appForm').reset(); document.getElementById('appId').value = ''; }
            modal.classList.remove('hidden');
        };

        document.getElementById('openModalBtn').addEventListener('click', () => openModal());
        document.getElementById('closeModalBtn').addEventListener('click', () => modal.classList.add('hidden'));
        document.getElementById('appForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = { app_name: document.getElementById('appName').value, target_url: document.getElementById('targetUrl').value, description: document.getElementById('description').value, is_active: parseInt(document.getElementById('isActive').value) };
            try {
                const id = document.getElementById('appId').value;
                if (id) await ApiService.put(`/applications/${id}`, payload); else await ApiService.post('/applications', payload);
                modal.classList.add('hidden'); loadTable(); 
            } catch (err) { const alert = document.getElementById('modalAlert'); alert.textContent = err.message; alert.className = 'alert error'; }
        });
        loadTable();
    }
};
export default AdminAppPage;