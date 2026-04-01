import Router from './router.js';
import LoginPage from './pages/LoginPage.js';
import LandingPage from './pages/LandingPage.js';
import AdminAppPage from './pages/AdminAppPage.js';
import AdminUserPage from './pages/AdminUserPage.js'; // [TAMBAHKAN INI]

const routes = [
    { path: '/login', component: LoginPage },
    { path: '/', component: LandingPage },
    { path: '/admin/apps', component: AdminAppPage },
    { path: '/admin/users', component: AdminUserPage } // [TAMBAHKAN INI]
];

const appRouter = new Router(routes);

document.addEventListener('DOMContentLoaded', () => {
    appRouter.loadRoute();
});