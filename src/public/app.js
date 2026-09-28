/**
 * securityincident.net - Client-side Filtering, Instant Search & Theme Toggling
 */

// Initialize Theme from localStorage or system preference
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // Listen to OS theme changes if user hasn't explicitly set a preference
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        const osTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', osTheme);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();

  const searchInput = document.getElementById('search-input');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const incidentCards = document.querySelectorAll('.incident-card');
  const emptyState = document.getElementById('empty-state');
  const resultsCount = document.getElementById('results-count');

  let currentFilter = 'ALL';
  let searchQuery = '';

  // Quick keyboard shortcut: '/' to focus search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    } else if (e.key === 'Escape' && document.activeElement === searchInput) {
      searchInput.value = '';
      searchQuery = '';
      applyFilters();
      searchInput.blur();
    }
  });

  // Handle Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }

  // Handle Filter Buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter') || 'ALL';
      applyFilters();
    });
  });

  function applyFilters() {
    let visibleCount = 0;

    incidentCards.forEach(card => {
      const status = card.getAttribute('data-status') || '';
      const target = card.getAttribute('data-target') || '';
      const domain = card.getAttribute('data-domain') || '';
      const summary = card.getAttribute('data-summary') || '';
      const actor = card.getAttribute('data-actor') || '';
      const tags = card.getAttribute('data-tags') || '';

      const matchesStatus = (currentFilter === 'ALL' || status === currentFilter);
      
      const searchHaystack = `${target} ${domain} ${summary} ${actor} ${tags}`.toLowerCase();
      const matchesSearch = !searchQuery || searchHaystack.includes(searchQuery);

      if (matchesStatus && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    if (resultsCount) {
      resultsCount.textContent = `${visibleCount} incident${visibleCount === 1 ? '' : 's'}`;
    }
  }
});
