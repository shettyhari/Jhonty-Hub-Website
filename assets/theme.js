/**
 * Haute Maison Luxury Engine
 * Ambient Cursor Follower, 3D Tilt, Mega Menu, and Velvet Vault Drawer
 */
window.ApexTheme = window.ApexTheme || {};

ApexTheme.openVault = function() {
  document.getElementById('VaultDrawerOverlay')?.classList.add('is-open');
  document.getElementById('VaultDrawer')?.classList.add('is-open');
  ApexTheme.refreshVault();
};

ApexTheme.closeVault = function() {
  document.getElementById('VaultDrawerOverlay')?.classList.remove('is-open');
  document.getElementById('VaultDrawer')?.classList.remove('is-open');
};

ApexTheme.refreshVault = function() {
  const body = document.getElementById('VaultDrawerItems');
  const subtotalEl = document.getElementById('VaultDrawerSubtotal');
  const countEl = document.getElementById('HeaderBagCount');
  if (!body) return;

  fetch('/cart.js')
    .then(res => res.json())
    .then(cart => {
      if (countEl) countEl.textContent = cart.item_count;

      if (cart.items.length === 0) {
        body.innerHTML = `
          <div style="text-align: center; padding: 60px 20px; color: #64748b;">
            <div style="font-size: 2.5rem; margin-bottom: 12px; opacity: 0.6;">✧</div>
            <h4 style="font-family: 'Cinzel', serif; font-size: 0.95rem; font-weight: 700; color: #fff; letter-spacing: 0.1em; text-transform: uppercase;">Your Vault is Empty</h4>
            <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 6px;">Reserve an exclusive fashion or lifestyle piece from our current capsule.</p>
          </div>
        `;
        if (subtotalEl) subtotalEl.textContent = '₹0';
        return;
      }

      let html = '';
      cart.items.forEach(item => {
        html += `
          <div style="display: flex; gap: 16px; padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.06); align-items: center;">
            <div style="width: 70px; height: 90px; border-radius: 8px; overflow: hidden; background: #000; border: 1px solid rgba(255,255,255,0.1); flex-shrink: 0;">
              <img src="${item.featured_image ? item.featured_image.url : ''}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="flex-grow: 1;">
              <div style="font-family: 'Cinzel', serif; font-size: 0.88rem; font-weight: 700; color: #fff;">${item.product_title}</div>
              <div style="font-size: 0.72rem; color: #d4af37; text-transform: uppercase; letter-spacing: 0.12em; margin-top: 2px;">Size: ${item.variant_title || 'M'}</div>
              <div style="margin-top: 6px; font-weight: 800; color: #fff; font-size: 0.95rem;">
                ₹${(item.final_price / 100).toFixed(0)} &times; ${item.quantity}
              </div>
            </div>
          </div>
        `;
      });
      body.innerHTML = html;
      if (subtotalEl) subtotalEl.textContent = '₹' + (cart.total_price / 100).toFixed(0);
    })
    .catch(err => console.error('Vault fetch failed:', err));
};

ApexTheme.addToVault = function(variantId, buttonEl) {
  if (buttonEl) {
    buttonEl.textContent = 'RESERVING...';
    buttonEl.disabled = true;
  }

  fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }] })
  })
    .then(res => res.json())
    .then(() => {
      ApexTheme.openVault();
    })
    .catch(err => console.error('Add failed:', err))
    .finally(() => {
      if (buttonEl) {
        buttonEl.textContent = 'ADD TO VAULT';
        buttonEl.disabled = false;
      }
    });
};

// 3D Tilt Effect on Cards
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card-3d-tilt');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // Initialize Dark / Light Theme
  ApexTheme.initTheme();
});

ApexTheme.initTheme = function() {
  const saved = localStorage.getItem('jh_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  ApexTheme.updateThemeUI(saved);
};

ApexTheme.toggleTheme = function() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('jh_theme', next);
  ApexTheme.updateThemeUI(next);
};

ApexTheme.updateThemeUI = function(theme) {
  const moonIcon = document.getElementById('themeMoonIcon');
  const sunIcon = document.getElementById('themeSunIcon');
  const label = document.getElementById('themeLabel');
  if (theme === 'light') {
    if (moonIcon) moonIcon.style.display = 'none';
    if (sunIcon) sunIcon.style.display = 'block';
    if (label) label.textContent = 'Light';
  } else {
    if (moonIcon) moonIcon.style.display = 'block';
    if (sunIcon) sunIcon.style.display = 'none';
    if (label) label.textContent = 'Dark';
  }
};
