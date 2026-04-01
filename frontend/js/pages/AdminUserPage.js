import ApiService from '../services/apiService.js';
import { Dialog } from '../utils/dialog.js';

const AdminUserPage = {
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
                            <button class="nav-tab" data-path="/admin/apps">Aplikasi</button>
                            <button class="nav-tab active" data-path="/admin/users">Pengguna</button>
                        </div>
                        <div class="user-controls">
                            <span class="greeting-text">Halo, <strong>${userData.username}</strong></span>
                            <button id="logoutBtn" class="btn-logout-premium" style="margin-left:10px;">Akhiri Sesi</button>
                        </div>
                    </nav>
                    <main class="dashboard-content">
                        <header class="content-header" style="display:flex; justify-content:space-between; align-items:center;">
                            <div><h1 class="content-title">Manajemen Pengguna</h1><p class="content-subtitle">Atur hak akses staf untuk portal LEGS.</p></div>
                            <button id="openUserModalBtn" class="btn-glow login-btn" style="width:auto; padding:12px 24px; margin-top:0;">+ Akun Baru</button>
                        </header>
                        <div class="table-container">
                            <table class="premium-table">
                                <thead><tr><th>Username</th><th>Role</th><th>Status</th><th style="text-align:right;">Aksi</th></tr></thead>
                                <tbody id="userTableBody"><tr><td colspan="4" style="text-align:center;">Memuat data...</td></tr></tbody>
                            </table>
                        </div>
                    </main>
                </div>

                <div id="userModal" class="modal-overlay hidden">
                    <div class="modal-card premium-light-card" style="max-width: 450px; padding: 35px;">
                        <div class="modal-header" style="margin-bottom: 25px; display:flex; justify-content:space-between;">
                            <h2 class="content-title" style="font-size: 22px;">Buat Akun Staf</h2>
                            <button id="closeUserModalBtn" class="btn-icon" style="position:static;">✖</button>
                        </div>
                        <form id="userForm" class="login-form">
                            <div class="form-group neuromorphic-input-group"><label>Username</label><input type="text" id="newUsername" required autocomplete="off"></div>
                            <div class="form-group neuromorphic-input-group"><label>Password</label><input type="password" id="newPassword" required></div>
                            <div class="form-group neuromorphic-input-group">
                                <label>Hak Akses (Role)</label>
                                <select id="newRole" class="premium-select"><option value="user">User Biasa</option><option value="admin">Administrator</option></select>
                            </div>
                            <div id="userModalAlert" class="alert hidden"></div>
                            <button type="submit" id="saveUserBtn" class="btn-glow login-btn">Buat Akun</button>
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

        const loadTable = async () => {
            const tbody = document.getElementById('userTableBody');
            try {
                const res = await ApiService.get('/users');
                tbody.innerHTML = res.data.map(user => `
                    <tr>
                        <td style="font-weight:700; color:var(--ut-deep-blue);">${user.username}</td>
                        <td style="text-transform: capitalize; color:#64748b;">${user.role}</td>
                        <td><span class="status-badge ${user.is_active ? 'active' : 'inactive'}">${user.is_active ? 'Aktif' : 'Terblokir'}</span></td>
                        <td style="text-align:right;">
                            <button class="btn-action reset-btn" data-id="${user.id}" style="color:var(--ut-gold);">Reset Sandi</button>
                            <button class="btn-action delete-btn" data-id="${user.id}" data-name="${user.username}">Hapus</button>
                        </td>
                    </tr>`).join('');

                // Action: Reset Password
                document.querySelectorAll('.reset-btn').forEach(btn => btn.addEventListener('click', (e) => {
                    Dialog.confirm('Reset Kata Sandi', 'Sandi staf ini akan direset menjadi "UTLibrary2026!". Lanjutkan?', async () => {
                        try {
                            const res = await ApiService.put(`/users/${e.target.getAttribute('data-id')}/reset-password`);
                            Dialog.alert('Berhasil', res.message);
                        } catch (err) { Dialog.alert('Error', err.message); }
                    });
                }));

                // Action: Delete User
                document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', (e) => {
                    const name = e.target.getAttribute('data-name');
                    if(name === JSON.parse(localStorage.getItem('user_data')).username) return Dialog.alert('Ditolak', 'Anda tidak bisa menghapus akun Anda sendiri saat sedang login.');
                    
                    Dialog.confirm('Hapus Akun', `Akun staf "${name}" akan dihapus permanen. Lanjutkan?`, async () => {
                        try { await ApiService.delete(`/users/${e.target.getAttribute('data-id')}`); loadTable(); } 
                        catch (err) { Dialog.alert('Error', err.message); }
                    });
                }));
            } catch (err) { tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:red;">${err.message}</td></tr>`; }
        };

        const modal = document.getElementById('userModal');
        document.getElementById('openUserModalBtn').addEventListener('click', () => { document.getElementById('userForm').reset(); modal.classList.remove('hidden'); });
        document.getElementById('closeUserModalBtn').addEventListener('click', () => modal.classList.add('hidden'));

        document.getElementById('userForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                await ApiService.post('/users', { username: document.getElementById('newUsername').value, password: document.getElementById('newPassword').value, role: document.getElementById('newRole').value });
                modal.classList.add('hidden'); loadTable(); Dialog.alert('Berhasil', 'Akun staf baru telah dibuat.');
            } catch (err) { const alert = document.getElementById('userModalAlert'); alert.textContent = err.message; alert.className = 'alert error'; }
        });
        loadTable();
    }
};
export default AdminUserPage;