/**
 * securityincident.net - Client-side Filtering, Instant Search, Sorting & Theme Toggling
 * Powered by Open Weights Correlation Engine
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
  const chipButtons = document.querySelectorAll('.chip-btn');
  const barSegments = document.querySelectorAll('.bar-segment');
  const sortSelect = document.getElementById('sort-select');
  const gridContainer = document.getElementById('incidents-grid');
  const emptyState = document.getElementById('empty-state');
  const resultsCount = document.getElementById('results-count');

  let currentFilter = 'ALL';
  let currentChip = 'all';
  let currentSort = 'recent';
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

  // Handle Segmented Bar Click (links to status filter)
  barSegments.forEach(seg => {
    seg.addEventListener('click', () => {
      const targetFilter = seg.getAttribute('data-filter');
      if (targetFilter) {
        const matchingBtn = document.querySelector(`.filter-btn[data-filter="${targetFilter}"]`);
        if (matchingBtn) {
          matchingBtn.click();
          matchingBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  });

  // Handle Sector & Tag Quick-Filter Chips
  chipButtons.forEach(chip => {
    chip.addEventListener('click', () => {
      chipButtons.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentChip = chip.getAttribute('data-chip') || 'all';
      applyFilters();
    });
  });

  // Handle Sort Selection
  if (sortSelect && gridContainer) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      sortAndRenderGrid();
      applyFilters();
    });
  }

  function sortAndRenderGrid() {
    if (!gridContainer) return;
    const cards = Array.from(gridContainer.querySelectorAll('.incident-card'));

    cards.sort((a, b) => {
      if (currentSort === 'confidence') {
        const confA = parseInt(a.getAttribute('data-confidence') || '0', 10);
        const confB = parseInt(b.getAttribute('data-confidence') || '0', 10);
        if (confB !== confA) return confB - confA;
        return (b.getAttribute('data-updated') || '').localeCompare(a.getAttribute('data-updated') || '');
      }

      if (currentSort === 'first_seen') {
        return (b.getAttribute('data-first-seen') || '').localeCompare(a.getAttribute('data-first-seen') || '');
      }

      if (currentSort === 'milestones') {
        const mCountA = parseInt(a.getAttribute('data-milestones') || '0', 10);
        const mCountB = parseInt(b.getAttribute('data-milestones') || '0', 10);
        if (mCountB !== mCountA) return mCountB - mCountA;
        return (b.getAttribute('data-updated') || '').localeCompare(a.getAttribute('data-updated') || '');
      }

      // Default: 'recent' (last_updated descending)
      return (b.getAttribute('data-updated') || '').localeCompare(a.getAttribute('data-updated') || '');
    });

    cards.forEach(card => gridContainer.appendChild(card));
  }

  function applyFilters() {
    if (!gridContainer) return;
    const incidentCards = gridContainer.querySelectorAll('.incident-card');
    let visibleCount = 0;

    incidentCards.forEach(card => {
      const status = card.getAttribute('data-status') || '';
      const target = card.getAttribute('data-target') || '';
      const domain = card.getAttribute('data-domain') || '';
      const summary = card.getAttribute('data-summary') || '';
      const actor = card.getAttribute('data-actor') || '';
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();
      const confidence = card.getAttribute('data-confidence') || '';

      const matchesStatus = (currentFilter === 'ALL' || status === currentFilter);

      let matchesChip = true;
      if (currentChip === 'threat-actor') {
        matchesChip = Boolean(actor && actor.trim());
      } else if (currentChip !== 'all') {
        matchesChip = tags.includes(currentChip.toLowerCase());
      }

      const searchHaystack = `${target} ${domain} ${summary} ${actor} ${tags} ${confidence}% ${status}`.toLowerCase();
      const matchesSearch = !searchQuery || searchHaystack.includes(searchQuery);

      if (matchesStatus && matchesChip && matchesSearch) {
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

  // 1-Click Clipboard Copy Buttons
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      let textToCopy = '';
      const targetId = btn.getAttribute('data-copy-target');
      const directText = btn.getAttribute('data-copy-text');

      if (directText) {
        textToCopy = directText;
      } else if (targetId) {
        const el = document.getElementById(targetId);
        if (el) textToCopy = el.textContent || el.innerText || '';
      }

      if (textToCopy && navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalHtml = btn.innerHTML;
          btn.innerHTML = '<i class="fa-solid fa-check" style="color: var(--status-confirmed);"></i> Copied!';
          setTimeout(() => {
            btn.innerHTML = originalHtml;
          }, 2000);
        }).catch(err => {
          console.warn('Clipboard write failed:', err);
        });
      }
    });
  });
});

