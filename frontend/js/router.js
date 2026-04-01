class Router {
    constructor(routes) {
        this.routes = routes;
        this.rootElement = document.getElementById('app'); 
        window.addEventListener('popstate', () => this.loadRoute());
    }

    navigate(path) {
        window.history.pushState({}, "", path);
        this.loadRoute();
    }

    async loadRoute() {
        const currentPath = window.location.pathname;
        let route = this.routes.find(r => r.path === currentPath) || this.routes.find(r => r.path === '/404');
        
        // --- LOGIKA SATPAM (ROUTE GUARD) ---
        const isAuthenticated = !!localStorage.getItem('jwt_token');

        // Jika belum login tapi mencoba akses halaman selain login -> tendang ke /login
        if (!isAuthenticated && currentPath !== '/login') {
            this.navigate('/login');
            return;
        }

        // Jika sudah login tapi mencoba buka halaman login -> tendang ke Dashboard (/)
        if (isAuthenticated && currentPath === '/login') {
            this.navigate('/');
            return;
        }

        if (!route) {
            this.rootElement.innerHTML = `<h1 style="color:white; text-align:center; margin-top:50px;">404 - Halaman Tidak Ditemukan</h1>`;
            return;
        }

        try {
            const pageHTML = await route.component.render();
            this.rootElement.innerHTML = pageHTML;
            if (route.component.afterRender) {
                await route.component.afterRender();
            }
        } catch (error) {
            console.error(error);
        }
    }
}
export default Router;