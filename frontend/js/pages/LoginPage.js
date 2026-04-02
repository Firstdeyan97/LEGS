import ApiService from '../services/apiService.js';

const LoginPage = {
    render: async () => {
        return `
            <div class="login-wrapper">
                <div class="glow-orb orb-primary"></div>
                <div class="glow-orb orb-accent"></div>

                <div class="login-card premium-light-card">
                    <div class="login-header">
                        <div class="brand-logo-container">
                            <div class="logo-placeholder">
                                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="logo-icon"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
                            </div>
                        </div>
                        <h1 class="brand-title">LEGS</h1>
                        <p class="friendly-text">Library Engine Generate System<br>Silakan masuk ke ruang kerja Anda.</p>
                    </div>
                    
                    <form id="loginForm" class="login-form">
                        <div class="form-group neuromorphic-input-group">
                            <label for="username">Username Akses</label>
                            <input type="text" id="username" placeholder="Ketik username di sini..." required autocomplete="off" />
                        </div>
                        
                        <div class="form-group neuromorphic-input-group">
                            <label for="password">Kata Sandi</label>
                            <div class="password-wrapper">
                                <input type="password" id="password" placeholder="Ketik sandi rahasia..." required />
                                <button type="button" id="togglePassword" class="btn-icon" aria-label="Lihat Password">
                                    <svg style="pointer-events: none;" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                </button>
                            </div>
                        </div>
                        
                        <div id="loginAlert" class="alert hidden"></div>
                        
                        <button type="submit" id="loginBtn" class="btn-glow login-btn">
                            Masuk
                        </button>
                    </form>
                </div>
            </div>
        `;
    },

    afterRender: async () => {
        const loginForm = document.getElementById('loginForm');
        const loginAlert = document.getElementById('loginAlert');
        const loginBtn = document.getElementById('loginBtn');
        const togglePasswordBtn = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        const usernameInput = document.getElementById('username');

        // Fitur Mata Visibilitas Password (Smooth Fix)
        togglePasswordBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePasswordBtn.style.color = type === 'text' ? 'var(--ut-deep-blue)' : '#94a3b8';
        });

        // Submit Logic
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            const originalBtnText = loginBtn.innerHTML;
            loginBtn.innerHTML = '<span class="spinner"></span> Mengamankan Sesi...';
            loginBtn.disabled = true;
            loginAlert.className = 'alert hidden';

            try {
                const response = await ApiService.post('/auth/login', { username, password });
                
                localStorage.setItem('user_data', JSON.stringify(response.data.user));

                loginAlert.textContent = 'Akses Diberikan. Selamat Bekerja!';
                loginAlert.className = 'alert success';
                
                const urlParams = new URLSearchParams(window.location.search);
                const redirectUrl = urlParams.get('redirect');

                setTimeout(() => {
                    if (redirectUrl) {
                        window.location.href = redirectUrl;
                    } else {
                        window.history.pushState({}, "", "/");
                        window.dispatchEvent(new Event('popstate'));
                    }
                }, 1000);

            } catch (error) {
                let friendlyMsg = error.message;
                if (friendlyMsg.includes('Failed to fetch') || friendlyMsg.includes('NetworkError')) {
                    friendlyMsg = 'Ups! Gagal terhubung ke server utama. Pastikan koneksi jaringan Anda stabil.';
                }

                loginAlert.textContent = friendlyMsg;
                loginAlert.className = 'alert error';
                loginBtn.innerHTML = originalBtnText;
                loginBtn.disabled = false;
                
                loginForm.classList.add('shake');
                setTimeout(() => loginForm.classList.remove('shake'), 400);
            }
        });
    }
};

export default LoginPage;