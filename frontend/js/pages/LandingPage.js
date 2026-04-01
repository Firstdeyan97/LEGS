import ApiService from '../services/apiService.js';
import { Dialog } from '../utils/dialog.js';

const LandingPage = {
    render: async () => {
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        
        // Menu Tengah yang Estetik (Hanya untuk Admin)
        const adminNavHTML = userData.role === 'admin' ? `
            <div class="nav-menu-center">
                <button class="nav-tab active" data-path="/">Portal Utama</button>
                <button class="nav-tab" data-path="/admin/apps">Aplikasi</button>
                <button class="nav-tab" data-path="/admin/users">Pengguna</button>
            </div>
        ` : '';

        return `
            <div class="app-unified-wrapper">
                <div class="glow-orb orb-primary"></div><div class="glow-orb orb-accent"></div>
                <div class="dashboard-panel premium-light-card">
                    <nav class="dashboard-nav">
                        <div class="nav-brand">
                            <div class="logo-placeholder-small"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg></div>
                            <span class="brand-text-dark">LEGS</span>
                        </div>
                        ${adminNavHTML}
                        <div class="user-controls">
                            <span class="greeting-text">Halo, <strong>${userData.username || 'Staf'}</strong></span>
                            <button id="logoutBtn" class="btn-logout-premium" style="margin-left: 10px;">Akhiri Sesi</button>
                        </div>
                    </nav>
                    <main class="dashboard-content">
                        <header class="content-header">
                            <h1 class="content-title">Library Engine Generate System</h1>
                            <p class="content-subtitle">Pilih modul atau engine yang ingin Anda akses hari ini.</p>
                        </header>
                        <div id="appGrid" class="app-grid"><div class="loading-state"><span class="spinner-dark"></span> Memuat engine...</div></div>
                    </main>
                </div>
            </div>
        `;
    },

    afterRender: async () => {
        // Logika Navigasi Tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const path = e.target.getAttribute('data-path');
                window.history.pushState({}, "", path);
                window.dispatchEvent(new Event('popstate'));
            });
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            Dialog.confirm('Akhiri Sesi', 'Apakah Anda yakin ingin keluar dari portal?', () => {
                localStorage.removeItem('jwt_token'); localStorage.removeItem('user_data');
                window.history.pushState({}, "", "/login"); window.dispatchEvent(new Event('popstate'));
            });
        });

        const appGrid = document.getElementById('appGrid');
        try {
            const res = await ApiService.get('/applications');
            if (res.data.length === 0) return appGrid.innerHTML = `<div class="empty-state-premium"><h3>Belum ada engine</h3></div>`;
            appGrid.innerHTML = res.data.map(app => `
                <a href="${app.target_url}" target="_blank" class="app-card-premium">
                    <div class="app-card-body"><h2 class="app-card-title">${app.app_name}</h2><p class="app-card-desc">${app.description || ''}</p></div>
                    <div class="app-card-footer"><span>Buka Modul</span><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></div>
                </a>`).join('');
        } catch (error) { appGrid.innerHTML = `<div class="alert error">${error.message}</div>`; }
    }
};
export default LandingPage;