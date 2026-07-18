/* ==========================================================
   layout.js — shared header/nav + footer, injected on every page.
   Each HTML page just needs:
     <div id="site-header"></div>  ... page content ...  <div id="site-footer"></div>
   and a call to mountLayout('this-page.html') on load.
   ========================================================== */
const CPL_NAV = [
  ['index.html', 'Home'],
  ['league-a.html', 'League A'],
  ['league-b.html', 'League B'],
  ['players.html', 'Players'],
  ['referees.html', 'Referees'],
  ['officials.html', 'Officials'],
  ['news.html', 'News'],
  ['gallery.html', 'Gallery'],
  ['equipment.html', 'Equipment'],
  ['transfers.html', 'Transfers'],
  ['register.html', 'Register'],
  ['enquiries.html', 'Enquiries'],
  ['about.html', 'About'],
  ['login.html', 'Login']
];
function renderHeader(active) {
  const links = CPL_NAV.map(([href, label]) => {
    const current = href === active ? ' aria-current="page"' : '';
    return `<a href="${href}"${current}>${label}</a>`;
  }).join('');
  return `
    <header class="site">
      <a href="index.html" class="logo-link" aria-label="Chuka Premier League home">
        <img class="logo" src="${CPL_CONFIG.LOGO_URL}" alt="CPL logo" onerror="this.closest('.logo-link').style.display='none'">
      </a>
      <div class="brand">
        <strong>Chuka Premier League</strong>
        <span>Season ${CPL_CONFIG.SEASON}</span>
      </div>
      <nav>${links}</nav>
    </header>`;
}
function renderFooter() {
  return `<footer>&copy; ${new Date().getFullYear()} Chuka Premier League &middot; data managed via Google Sheets</footer>`;
}
function mountLayout(active) {
  const headerEl = document.getElementById('site-header');
  const footerEl = document.getElementById('site-footer');
  if (headerEl) headerEl.outerHTML = renderHeader(active);
  if (footerEl) footerEl.outerHTML = renderFooter();
}
