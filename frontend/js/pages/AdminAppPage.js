import ApiService from '../services/apiService.js';
import { Dialog } from '../utils/dialog.js';
import { APP_CATEGORIES } from '../constants.js';

const AdminAppPage = {
    render: async () => {
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        if (userData.role !== 'admin') return `<div>Akses Ditolak</div>`;
        const catOptions = APP_CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('');

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
                            <button class="nav-tab active" data-path="/admin/apps">Aplikasi</button>
                            <button class="nav-tab" data-path="/admin/users">Pengguna</button>
                        </div>
                        <div class="user-controls">
                            <span class="greeting-text">Admin: <strong>${userData.username}</strong></span>
                            <button id="logoutBtn" class="btn-logout-icon" title="Akhiri Sesi"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg></button>
                        </div>
                    </nav>
                    <main class="dashboard-content">
                        <header class="content-header">
                            <div><h1 class="content-title">Manajemen Aplikasi</h1><p class="content-subtitle">Atur modul dan engine yang tampil di portal.</p></div>
                            <button id="openModalBtn" class="btn-glow" style="width:auto; padding:12px 24px; margin-top:0;">+ Tambah Aplikasi</button>
                        </header>
                        
                        <div class="table-container">
                            <div class="table-controls">
                                <input type="text" id="dtSearch" class="premium-search" placeholder="Cari nama atau URL..." style="width:250px;">
                            </div>
                            <table class="premium-table">
                                <thead>
                                    <tr>
                                        <th style="width: 50px;">No</th>
                                        <th data-sort="app_name">Nama Aplikasi ↕</th>
                                        <th data-sort="category">Kategori ↕</th>
                                        <th data-sort="target_url">URL Tujuan ↕</th>
                                        <th style="text-align:center;">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody id="tableBody"><tr><td colspan="5" style="text-align:center;">Memuat data...</td></tr></tbody>
                            </table>
                            <div class="pagination">
                                <span class="page-info" id="pageInfo">Menampilkan 0 data</span>
                                <button class="page-btn" id="prevPage" title="Sebelumnya"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
                                <button class="page-btn" id="nextPage" title="Selanjutnya"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
                            </div>
                        </div>
                    </main>
                </div>
                
                <div id="appModal" class="modal-overlay hidden">
                    <div class="modal-card">
                        <div class="modal-header" style="margin-bottom: 25px; display:flex; justify-content:space-between;">
                            <h2 id="modalTitle" class="content-title" style="font-size: 22px;">Form Aplikasi</h2>
                            <button id="closeModalBtn" class="btn-icon" style="position:static;">✖</button>
                        </div>
                        <form id="appForm" class="login-form">
                            <input type="hidden" id="appId" value="">
                            <div class="form-group neuromorphic-input-group"><label>Nama Aplikasi</label><input type="text" id="appName" required autocomplete="off"></div>
                            <div style="display:flex; gap:15px; margin-bottom:22px;">
                                <div style="flex:1;"><label style="font-size:13px; color:var(--ut-deep-blue); font-weight:700; margin-bottom:8px; display:block;">Kategori</label><select id="appCategory" class="premium-select">${catOptions}</select></div>
                                <div style="flex:1;"><label style="font-size:13px; color:var(--ut-deep-blue); font-weight:700; margin-bottom:8px; display:block;">Status</label><select id="isActive" class="premium-select"><option value="1">Aktif</option><option value="0">Non-aktif</option></select></div>
                            </div>
                            <div class="form-group neuromorphic-input-group"><label>URL Tujuan</label><input type="text" id="targetUrl" required autocomplete="off"></div>
                            <div class="form-group neuromorphic-input-group"><label>Deskripsi</label><input type="text" id="description" autocomplete="off"></div>
                            
                            <label class="checkbox-group">
                                <input type="checkbox" id="isSso"> Jadikan LEGS sebagai Gerbang Login (SSO)
                            </label>

                            <div id="modalAlert" class="alert hidden"></div>
                            <button type="submit" id="saveAppBtn" class="btn-glow">Simpan Data</button>
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
            const tbody = document.getElementById('tableBody');
            const start = (currentPage - 1) * rowsPerPage; const end = start + rowsPerPage;
            const paginatedData = filteredData.slice(start, end);

            document.getElementById('pageInfo').textContent = `Menampilkan ${start + 1}-${Math.min(end, filteredData.length)} dari ${filteredData.length} data`;
            document.getElementById('prevPage').disabled = currentPage === 1;
            document.getElementById('nextPage').disabled = end >= filteredData.length;

            if(paginatedData.length === 0) return tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Data tidak ditemukan.</td></tr>`;

            tbody.innerHTML = paginatedData.map((app, index) => `
                <tr>
                    <td>${start + index + 1}</td>
                    <td style="font-weight:700; color:var(--ut-deep-blue);">${app.app_name} <br><span class="status-badge ${app.is_active ? 'active' : 'inactive'}" style="font-size:10px; padding:2px 6px;">${app.is_active ? 'Aktif' : 'Non-aktif'}</span> ${app.is_login_from_legs ? '🛡️' : ''}</td>
                    <td>${app.category || 'Web App'}</td>
                    <td style="color:#64748b;">${app.target_url}</td>
                    <td style="text-align:center;">
                        <button class="btn-action-icon edit-btn" data-app='${JSON.stringify(app)}' title="Edit">
                            <svg pointer-events="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="btn-action-icon delete-btn" data-id="${app.id}" title="Hapus">
                            <svg pointer-events="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </td>
                </tr>`).join('');

            document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', (e) => openModal(JSON.parse(e.currentTarget.getAttribute('data-app')))));
            document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', (e) => {
                Dialog.confirm('Hapus Aplikasi', 'Aplikasi ini akan diarsipkan (Soft Delete). Lanjutkan?', async () => {
                    await ApiService.post(`/applications/${e.currentTarget.getAttribute('data-id')}/delete`); loadTableData();
                });
            }));
        };

        const loadTableData = async () => {
            try {
                const res = await ApiService.get('/applications/all');
                allData = res.data; filteredData = [...allData]; renderTable();
            } catch (err) { document.getElementById('tableBody').innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">${err.message}</td></tr>`; }
        };

        document.getElementById('dtSearch').addEventListener('input', (e) => {
            const kw = e.target.value.toLowerCase();
            filteredData = allData.filter(a => a.app_name.toLowerCase().includes(kw) || a.target_url.toLowerCase().includes(kw));
            currentPage = 1; renderTable();
        });
        document.getElementById('prevPage').addEventListener('click', () => { if(currentPage > 1) { currentPage--; renderTable(); } });
        document.getElementById('nextPage').addEventListener('click', () => { if(currentPage * rowsPerPage < filteredData.length) { currentPage++; renderTable(); } });
        document.querySelectorAll('th[data-sort]').forEach(th => th.addEventListener('click', (e) => {
            const col = e.target.getAttribute('data-sort');
            sortAsc = sortCol === col ? !sortAsc : true; sortCol = col;
            filteredData.sort((a,b) => (a[col] > b[col] ? 1 : -1) * (sortAsc ? 1 : -1)); renderTable();
        }));

        const modal = document.getElementById('appModal');
        const openModal = (app = null) => {
            document.getElementById('modalAlert').className = 'alert hidden';
            if(app) {
                document.getElementById('appId').value = app.id; document.getElementById('appName').value = app.app_name;
                document.getElementById('appCategory').value = app.category || 'Web App';
                document.getElementById('targetUrl').value = app.target_url; document.getElementById('description').value = app.description || '';
                document.getElementById('isActive').value = app.is_active;
                document.getElementById('isSso').checked = app.is_login_from_legs ? true : false;
            } else { document.getElementById('appForm').reset(); document.getElementById('appId').value = ''; }
            modal.classList.remove('hidden');
        };

        document.getElementById('openModalBtn').addEventListener('click', () => openModal());
        document.getElementById('closeModalBtn').addEventListener('click', () => modal.classList.add('hidden'));
        document.getElementById('appForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = { 
                app_name: document.getElementById('appName').value, category: document.getElementById('appCategory').value,
                target_url: document.getElementById('targetUrl').value, description: document.getElementById('description').value, 
                is_active: parseInt(document.getElementById('isActive').value), is_login_from_legs: document.getElementById('isSso').checked 
            };
            try {
                const id = document.getElementById('appId').value;
                if (id) await ApiService.post(`/applications/${id}/update`, payload); else await ApiService.post('/applications', payload);
                modal.classList.add('hidden'); loadTableData(); 
            } catch (err) { const alert = document.getElementById('modalAlert'); alert.textContent = err.message; alert.className = 'alert error'; }
        });
        
        loadTableData();
    }
};
export default AdminAppPage;