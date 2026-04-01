export const Dialog = {
    createOverlay: function() {
        let overlay = document.getElementById('legs-dialog-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'legs-dialog-overlay';
            overlay.className = 'modal-overlay hidden';
            overlay.style.zIndex = '9999'; // Pastikan paling atas
            overlay.innerHTML = `
                <div class="modal-card premium-light-card" style="max-width: 400px; padding: 35px; text-align: center;">
                    <h3 id="legs-dialog-title" class="content-title" style="font-size: 22px; margin-bottom: 12px;"></h3>
                    <p id="legs-dialog-message" style="color: #475569; margin-bottom: 28px; font-size: 14.5px; line-height: 1.6;"></p>
                    <div style="display: flex; gap: 16px; justify-content: center;">
                        <button id="legs-dialog-cancel" class="btn-logout-premium" style="display: none; padding: 12px 24px;">Batal</button>
                        <button id="legs-dialog-confirm" class="btn-glow login-btn" style="margin-top: 0; padding: 12px 24px; width: auto;">OK</button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
        }
        return overlay;
    },

    alert: function(title, message) {
        const overlay = this.createOverlay();
        document.getElementById('legs-dialog-title').textContent = title;
        document.getElementById('legs-dialog-message').textContent = message;
        document.getElementById('legs-dialog-cancel').style.display = 'none';

        const confirmBtn = document.getElementById('legs-dialog-confirm');
        confirmBtn.textContent = 'Mengerti';
        
        overlay.classList.remove('hidden');
        confirmBtn.onclick = () => { overlay.classList.add('hidden'); };
    },

    confirm: function(title, message, onConfirm) {
        const overlay = this.createOverlay();
        document.getElementById('legs-dialog-title').textContent = title;
        document.getElementById('legs-dialog-message').textContent = message;
        
        const cancelBtn = document.getElementById('legs-dialog-cancel');
        const confirmBtn = document.getElementById('legs-dialog-confirm');
        
        cancelBtn.style.display = 'block';
        confirmBtn.textContent = 'Ya, Lanjutkan';
        
        overlay.classList.remove('hidden');

        cancelBtn.onclick = () => { overlay.classList.add('hidden'); };
        confirmBtn.onclick = () => { 
            overlay.classList.add('hidden'); 
            onConfirm(); 
        };
    }
};