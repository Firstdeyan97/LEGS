import ApiService from '../services/apiService.js';
import { Dialog } from '../utils/dialog.js';

const LandingPage = {
    render: async () => {
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        const adminNavHTML = userData.role === 'admin' ? `
            <div class="nav-menu-center">
                <button class="nav-tab active" data-path="/">Portal Utama</button>
                <button class="nav-tab" data-path="/admin/apps">Aplikasi</button>
                <button class="nav-tab" data-path="/admin/users">Pengguna</button>
            </div>` : '';

        return `
            <div class="app-unified-wrapper">
                <div class="glow-orb orb-primary"></div><div class="glow-orb orb-accent"></div>
                <div class="dashboard-panel">
                    <nav class="dashboard-nav">
                        <div class="nav-brand">
                            <div class="logo-placeholder-small">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
                            </div>
                            <span class="brand-text-dark">LEGS</span>
                        </div>
                        ${adminNavHTML}
                        <div class="user-controls">
                            <span class="greeting-text">Halo, <strong>${userData.username || 'Staf'}</strong></span>
                            <button id="logoutBtn" class="btn-logout-icon" title="Akhiri Sesi">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            </button>
                        </div>
                    </nav>
                    <main class="dashboard-content">
                        <header class="content-header">
                            <div>
                                <h1 class="content-title">Library Engine Generate System</h1>
                                <p class="content-subtitle">Portal gerbang tunggal yang aman untuk mengakses seluruh ekosistem aplikasi, modul, dan sistem otomasi perpustakaan secara terintegrasi (SSO).</p>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 15px; align-items: flex-end;">
                                <input type="text" id="searchPortal" class="premium-search" placeholder="Cari nama aplikasi..." autocomplete="off">
                                <div class="filter-group" id="categoryFilter">
                                    <button class="btn-filter active" data-filter="All">Semua</button>
                                    <button class="btn-filter" data-filter="Web App">Web App</button>
                                    <button class="btn-filter" data-filter="Engine">Engine</button>
                                </div>
                            </div>
                        </header>
                        <div id="appGrid" class="app-grid"><div class="loading-state"><span class="spinner-dark"></span> Memuat aplikasi...</div></div>
                    </main>
                </div>
            </div>
        `;
    },

    afterRender: async () => {
        let allApps = [];
        let currentFilter = 'All';
        let currentSearch = '';

        document.querySelectorAll('.nav-tab').forEach(t => t.addEventListener('click', (e) => {
            window.history.pushState({}, "", e.target.getAttribute('data-path')); window.dispatchEvent(new Event('popstate'));
        }));

        document.getElementById('logoutBtn').addEventListener('click', () => {
            Dialog.confirm('Akhiri Sesi', 'Apakah Anda yakin ingin keluar dari portal?', async () => {
                await ApiService.post('/auth/logout', {}); 
                localStorage.removeItem('user_data');
                window.history.pushState({}, "", "/login"); window.dispatchEvent(new Event('popstate'));
            });
        });

        const appGrid = document.getElementById('appGrid');
        
        const applyFilters = () => {
            let filtered = allApps;
            if (currentFilter !== 'All') {
                filtered = filtered.filter(a => a.category === currentFilter);
            }
            if (currentSearch !== '') {
                filtered = filtered.filter(a => a.app_name.toLowerCase().includes(currentSearch) || (a.description && a.description.toLowerCase().includes(currentSearch)));
            }
            renderGrid(filtered);
        };

        const renderGrid = (data) => {
            if (data.length === 0) return appGrid.innerHTML = `<div class="empty-state-premium"><h3>Aplikasi tidak ditemukan</h3></div>`;
            appGrid.innerHTML = data.map(app => {
                // [FIX BUG] Perbaikan posisi Badge dan Warna
                const catClass = app.category === 'Engine' ? 'badge-engine' : 'badge-webapp';
                return `
                <a href="${app.target_url}" target="_blank" class="app-card-premium">
                    <div>
                        <div class="badge-container">
                            ${app.is_login_from_legs ? `<div class="app-sso-badge"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> SSO</div>` : ''}
                            <span class="app-category-badge ${catClass}">${app.category || 'Web App'}</span>
                        </div>
                        <h2 class="app-card-title">${app.app_name}</h2>
                        <p class="app-card-desc">${app.description || ''}</p>
                    </div>
                    <div class="app-card-footer"><span>Buka Aplikasi</span><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></div>
                </a>`;
            }).join('');
        };

        document.getElementById('searchPortal').addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase();
            applyFilters();
        });

        // Filter Clicks
        document.querySelectorAll('.btn-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                currentFilter = e.target.getAttribute('data-filter');
                applyFilters();
            });
        });

        try {
            const res = await ApiService.get('/applications');
            allApps = res.data.sort((a, b) => a.app_name.localeCompare(b.app_name));
            applyFilters();
        } catch (error) { appGrid.innerHTML = `<div class="alert error">${error.message}</div>`; }
    }
};
export default LandingPage;