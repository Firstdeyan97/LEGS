import ApiService from '../services/apiService.js';
import { Dialog } from '../utils/dialog.js';

const AdminUserPage = {
    render: async () => {
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        if (userData.role !== 'admin') return `<div>Akses Ditolak</div>`;

        return `
            <div class="app-unified-wrapper">
                <div class="glow-orb orb-primary"></div><div class="glow-orb orb-accent"></div>
                <div class="dashboard-panel">
                    <nav class="dashboard-nav">
                        <div class="nav-brand">
                            <div class="logo-placeholder-small"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg></div>
                            <span class="brand-text-dark">LEGS</span>
                        </div>
                        <div class="nav-menu-center">
                            <button class="nav-tab" data-path="/">Portal Utama</button>
                            <button class="nav-tab" data-path="/admin/apps">Aplikasi</button>
                            <button class="nav-tab active" data-path="/admin/users">Pengguna</button>
                        </div>
                        <div class="user-controls">
                            <span class="greeting-text">Admin: <strong>${userData.username}</strong></span>
                            <button id="logoutBtn" class="btn-logout-icon" title="Akhiri Sesi"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg></button>
                        </div>
                    </nav>
                    <main class="dashboard-content">
                        <header class="content-header">
                            <div><h1 class="content-title">Manajemen Pengguna</h1><p class="content-subtitle">Atur hak akses staf untuk portal LEGS.</p></div>
                            <button id="openUserModalBtn" class="btn-glow" style="width:auto; padding:12px 24px; margin-top:0;">+ Akun Baru</button>
                        </header>
                        
                        <div class="table-container">
                            <div class="table-controls">
                                <input type="text" id="dtSearch" class="premium-search" placeholder="Cari username..." style="width:250px;">
                            </div>
                            <table class="premium-table">
                                <thead><tr><th style="width: 50px;">No</th><th data-sort="username">Username ↕</th><th data-sort="role">Role ↕</th><th>Status</th><th style="text-align:center;">Aksi</th></tr></thead>
                                <tbody id="userTableBody"><tr><td colspan="5" style="text-align:center;">Memuat data...</td></tr></tbody>
                            </table>
                            <div class="pagination">
                                <span class="page-info" id="pageInfo">Menampilkan 0 data</span>
                                <button class="page-btn" id="prevPage" title="Sebelumnya"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
                                <button class="page-btn" id="nextPage" title="Selanjutnya"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
                            </div>
                        </div>
                    </main>
                </div>

                <div id="userModal" class="modal-overlay hidden">
                    <div class="modal-card">
                        <div class="modal-header" style="margin-bottom: 25px; display:flex; justify-content:space-between;">
                            <h2 id="modalUserTitle" class="content-title" style="font-size: 22px;">Buat Akun Staf</h2>
                            <button id="closeUserModalBtn" class="btn-icon" style="position:static;">✖</button>
                        </div>
                        <form id="userForm" class="login-form">
                            <input type="hidden" id="userId" value="">
                            <div class="form-group neuromorphic-input-group"><label>Username</label><input type="text" id="newUsername" required autocomplete="off"></div>
                            <div class="form-group neuromorphic-input-group" id="passGroup"><label>Password</label><input type="password" id="newPassword" required></div>
                            <div style="display:flex; gap:15px; margin-bottom:22px;">
                                <div style="flex:1;"><label style="font-size:13px; color:var(--ut-deep-blue); font-weight:700; margin-bottom:8px; display:block;">Hak Akses</label><select id="newRole" class="premium-select"><option value="user">User Biasa</option><option value="admin">Administrator</option></select></div>
                                <div style="flex:1;" id="statusGroup"><label style="font-size:13px; color:var(--ut-deep-blue); font-weight:700; margin-bottom:8px; display:block;">Status</label><select id="newStatus" class="premium-select"><option value="1">Aktif</option><option value="0">Diblokir</option></select></div>
                            </div>
                            <div id="userModalAlert" class="alert hidden"></div>
                            <button type="submit" id="saveUserBtn" class="btn-glow">Simpan Akun</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    },
    afterRender: async () => {
        document.querySelectorAll('.nav-tab').forEach(t => t.addEventListener('click', (e) => {
            window.history.pushState({}, "", e.target.getAttribute('data-path')); window.dispatchEvent(new Event('popstate'));
        }));
        document.getElementById('logoutBtn').addEventListener('click', () => {
            Dialog.confirm('Akhiri Sesi', 'Yakin ingin keluar dari portal?', async () => {
                await ApiService.post('/auth/logout', {}); localStorage.removeItem('user_data');
                window.history.pushState({}, "", "/login"); window.dispatchEvent(new Event('popstate'));
            });
        });

        let allData = []; let filteredData = []; let currentPage = 1; const rowsPerPage = 5; let sortCol = ''; let sortAsc = true;

        const renderTable = () => {
            const tbody = document.getElementById('userTableBody');
            const start = (currentPage - 1) * rowsPerPage; const end = start + rowsPerPage;
            const paginatedData = filteredData.slice(start, end);

            document.getElementById('pageInfo').textContent = `Menampilkan ${start + 1}-${Math.min(end, filteredData.length)} dari ${filteredData.length} data`;
            document.getElementById('prevPage').disabled = currentPage === 1; document.getElementById('nextPage').disabled = end >= filteredData.length;

            if(paginatedData.length === 0) return tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Data tidak ditemukan.</td></tr>`;

            tbody.innerHTML = paginatedData.map((user, idx) => `
                <tr>
                    <td>${start + idx + 1}</td>
                    <td style="font-weight:700; color:var(--ut-deep-blue);">${user.username}</td>
                    <td style="text-transform: capitalize; color:#64748b;">${user.role}</td>
                    <td><span class="status-badge ${user.is_active ? 'active' : 'inactive'}">${user.is_active ? 'Aktif' : 'Terblokir'}</span></td>
                    <td style="text-align:center;">
                        <button class="btn-action-icon edit-btn" data-user='${JSON.stringify(user)}' title="Edit User"><svg pointer-events="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                        <button class="btn-action-icon reset-btn" data-id="${user.id}" title="Reset Sandi"><svg pointer-events="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></button>
                        <button class="btn-action-icon delete-btn" data-id="${user.id}" data-name="${user.username}" title="Hapus"><svg pointer-events="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                    </td>
                </tr>`).join('');

            document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', (e) => openModal(JSON.parse(e.currentTarget.getAttribute('data-user')))));
            document.querySelectorAll('.reset-btn').forEach(btn => btn.addEventListener('click', (e) => {
                Dialog.confirm('Reset Kata Sandi', 'Sandi staf ini akan direset menjadi "UTLibrary2026!". Lanjutkan?', async () => {
                    try { const res = await ApiService.post(`/users/${e.currentTarget.getAttribute('data-id')}/reset-password`); Dialog.alert('Berhasil', res.message); } catch (err) { Dialog.alert('Error', err.message); }
                });
            }));
            document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', (e) => {
                const name = e.currentTarget.getAttribute('data-name');
                if(name === JSON.parse(localStorage.getItem('user_data')).username) return Dialog.alert('Ditolak', 'Tidak bisa menghapus akun sendiri.');
                Dialog.confirm('Arsipkan Akun', `Akun staf "${name}" akan diarsipkan (Soft Delete). Lanjutkan?`, async () => {
                    await ApiService.post(`/users/${e.currentTarget.getAttribute('data-id')}/delete`); loadTableData();
                });
            }));
        };

        const loadTableData = async () => {
            try { const res = await ApiService.get('/users'); allData = res.data; filteredData = [...allData]; renderTable(); } 
            catch (err) { document.getElementById('userTableBody').innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">${err.message}</td></tr>`; }
        };

        document.getElementById('dtSearch').addEventListener('input', (e) => {
            const kw = e.target.value.toLowerCase(); filteredData = allData.filter(u => u.username.toLowerCase().includes(kw));
            currentPage = 1; renderTable();
        });
        document.getElementById('prevPage').addEventListener('click', () => { if(currentPage > 1) { currentPage--; renderTable(); } });
        document.getElementById('nextPage').addEventListener('click', () => { if(currentPage * rowsPerPage < filteredData.length) { currentPage++; renderTable(); } });
        document.querySelectorAll('th[data-sort]').forEach(th => th.addEventListener('click', (e) => {
            const col = e.target.getAttribute('data-sort'); sortAsc = sortCol === col ? !sortAsc : true; sortCol = col;
            filteredData.sort((a,b) => (a[col] > b[col] ? 1 : -1) * (sortAsc ? 1 : -1)); renderTable();
        }));

        const modal = document.getElementById('userModal');
        const openModal = (user = null) => {
            document.getElementById('userModalAlert').className = 'alert hidden';
            const passGrp = document.getElementById('passGroup'); const statGrp = document.getElementById('statusGroup');
            if(user) {
                document.getElementById('modalUserTitle').textContent = 'Edit Akses Pengguna';
                document.getElementById('userId').value = user.id;
                document.getElementById('newUsername').value = user.username;
                document.getElementById('newUsername').disabled = true; // Kunci Username
                document.getElementById('newRole').value = user.role;
                document.getElementById('newStatus').value = user.is_active;
                document.getElementById('newPassword').required = false;
                passGrp.style.display = 'none'; statGrp.style.display = 'block';
            } else {
                document.getElementById('modalUserTitle').textContent = 'Buat Akun Staf';
                document.getElementById('userForm').reset();
                document.getElementById('userId').value = '';
                document.getElementById('newUsername').disabled = false;
                document.getElementById('newPassword').required = true;
                passGrp.style.display = 'flex'; statGrp.style.display = 'none';
            }
            modal.classList.remove('hidden');
        };

        document.getElementById('openUserModalBtn').addEventListener('click', () => openModal());
        document.getElementById('closeUserModalBtn').addEventListener('click', () => modal.classList.add('hidden'));

        document.getElementById('userForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('userId').value;
            try {
                if(id) {
                    await ApiService.post(`/users/${id}/update`, { role: document.getElementById('newRole').value, is_active: parseInt(document.getElementById('newStatus').value) });
                } else {
                    await ApiService.post('/users', { username: document.getElementById('newUsername').value, password: document.getElementById('newPassword').value, role: document.getElementById('newRole').value });
                }
                modal.classList.add('hidden'); loadTableData(); 
            } catch (err) { const alert = document.getElementById('userModalAlert'); alert.textContent = err.message; alert.className = 'alert error'; }
        });
        loadTableData();
    }
};
export default AdminUserPage;