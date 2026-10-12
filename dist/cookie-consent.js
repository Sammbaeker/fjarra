// Cookie consent banner + settings modal. Shared by index.html and integritetspolicy.html.
(function() {
  const banner = document.getElementById('cookie-banner');
  const modal = document.getElementById('cookie-modal');
  const acceptAllBtn = document.getElementById('cookie-accept-all');
  const necessaryOnlyBtn = document.getElementById('cookie-necessary-only');
  const manageBtn = document.getElementById('cookie-manage');
  const saveSettingsBtn = document.getElementById('cookie-save-settings');
  const modalCloseBtn = document.getElementById('cookie-modal-close');
  const analyticsToggle = document.getElementById('cookie-analytics-toggle');
  const footerCookieBtn = document.getElementById('footer-cookie-settings');

  const STORAGE_KEY = 'fjarra_cookie_consent';

  function getConsent() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  }

  function setConsent(analytics) {
    const consent = {
      necessary: true,
      analytics: analytics,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    hideBanner();
    hideModal();
    if (analytics) initAnalytics();
  }

  function showBanner() {
    banner.classList.add('cookie-banner--visible');
  }

  function hideBanner() {
    banner.classList.remove('cookie-banner--visible');
  }

  function showModal() {
    modal.classList.add('cookie-modal--visible');
    modal.removeAttribute('inert');
    modal.setAttribute('aria-hidden', 'false');
  }

  function hideModal() {
    modal.classList.remove('cookie-modal--visible');
    modal.setAttribute('inert', '');
    modal.setAttribute('aria-hidden', 'true');
  }

  function initAnalytics() {
    // Load Firebase Analytics only after consent
    if (window.__fjarraAnalyticsLoaded) return;
    window.__fjarraAnalyticsLoaded = true;

    const config = {
      apiKey: "AIzaSyCo02ixkiSEKwwrvH-ofeYFzch521SE5Rg",
      authDomain: "fjarra-4033f.firebaseapp.com",
      projectId: "fjarra-4033f",
      storageBucket: "fjarra-4033f.firebasestorage.app",
      messagingSenderId: "870818589801",
      appId: "1:870818589801:web:320e5804b1b53c945386f8",
      measurementId: "G-WDSNCW1F6S"
    };

    // Dynamically load Firebase scripts
    const appScript = document.createElement('script');
    appScript.type = 'module';
    appScript.textContent = `
      import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js';
      import { getAnalytics } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js';
      const app = initializeApp(${JSON.stringify(config)});
      getAnalytics(app);
    `;
    document.head.appendChild(appScript);
  }

  // Check existing consent
  const existing = getConsent();
  if (existing) {
    if (existing.analytics) initAnalytics();
    // Don't show banner
  } else {
    // Show banner after short delay
    setTimeout(showBanner, 1000);
  }

  // Event listeners
  acceptAllBtn.addEventListener('click', () => setConsent(true));
  necessaryOnlyBtn.addEventListener('click', () => setConsent(false));
  manageBtn.addEventListener('click', () => {
    hideBanner();
    const existing = getConsent();
    if (existing) analyticsToggle.checked = existing.analytics;
    showModal();
  });
  saveSettingsBtn.addEventListener('click', () => setConsent(analyticsToggle.checked));
  modalCloseBtn.addEventListener('click', hideModal);

  // Footer cookie settings
  footerCookieBtn.addEventListener('click', () => {
    const existing = getConsent();
    if (existing) analyticsToggle.checked = existing.analytics;
    showModal();
  });

  // Close modal on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) hideModal();
  });
})();
