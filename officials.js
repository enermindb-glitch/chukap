/* ==========================================================
   officials.js — /officials.html
   ========================================================== */

let CPL_ALL_OFFICIALS = [];

async function initOfficialsPage() {
  const root = document.getElementById('officials-table');
  root.innerHTML = '<p class="loading">Loading officials…</p>';
  try {
    const rows = await CPL.get('Officials');
    // Hide anyone still awaiting admin activation. Rows with no Status at
    // all (older entries, added before this column existed) stay visible.
    CPL_ALL_OFFICIALS = rows.filter(r => (r.Status || '').trim().toLowerCase() !== 'pending');
    renderOfficialsTable(CPL_ALL_OFFICIALS);
    document.getElementById('officials-search').addEventListener('input', (e) => {
      const term = e.target.value.trim().toLowerCase();
      renderOfficialsTable(CPL_ALL_OFFICIALS.filter(r => (r.Name || '').toLowerCase().includes(term)));
    });
  } catch (err) {
    console.error(err);
    root.innerHTML = `<p class="empty">Could not load officials. ${cplEscape(err.message)}</p>`;
  }
}

function renderOfficialsTable(rows) {
  const root = document.getElementById('officials-table');
  if (!rows.length) {
    root.innerHTML = '<p class="empty">No officials found.</p>';
    return;
  }
  root.innerHTML = `
    <table class="data">
      <thead><tr><th>Name</th><th>Role</th><th>Contact</th></tr></thead>
      <tbody>
        ${rows.map(r => `<tr><td>${cplEscape(r.Name)}</td><td>${cplEscape(r.Role || '')}</td><td>${cplEscape(r.Contact)}</td></tr>`).join('')}
      </tbody>
    </table>`;
}
