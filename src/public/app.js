/**
 * securityincident.net - Interactive Telemetry Deck, Charts, Client-side Filtering,
 * Sorting, Dense Table View & High-Density Pagination
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

  // Elements
  const searchInput = document.getElementById('search-input');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const sortSelect = document.getElementById('sort-select');
  const pageSizeSelect = document.getElementById('page-size-select');
  const sectorSelect = document.getElementById('sector-select');
  const dataTypeSelect = document.getElementById('data-type-select');
  const btnHighImpact = document.getElementById('btn-high-impact');
  const gridContainer = document.getElementById('incidents-grid');
  const tableWrap = document.getElementById('incidents-table-wrap');
  const tableBody = document.getElementById('telemetry-tbody');
  const btnViewCards = document.getElementById('btn-view-cards');
  const btnViewTable = document.getElementById('btn-view-table');
  const emptyState = document.getElementById('empty-state');
  const activeFilterBar = document.getElementById('active-filter-bar');
  const activeFilterPill = document.getElementById('active-filter-pill');
  const btnClearFilter = document.getElementById('btn-clear-filter');
  const paginationBar = document.getElementById('pagination-bar');
  const paginationInfo = document.getElementById('pagination-info');
  const paginationNav = document.getElementById('pagination-nav');
  const chartClickElements = document.querySelectorAll('.chart-click-filter');

  // State
  let currentFilter = 'ALL';      // Status filter
  let currentMonth = 'ALL';       // Month filter from velocity chart
  let currentSector = 'ALL';      // Sector filter from sector/source charts
  let currentIndustry = 'ALL';    // Industry dropdown filter
  let currentDataType = 'ALL';    // Compromised data class filter
  let highImpactOnly = false;     // >100K affected records toggle
  let currentSort = 'recent';
  let searchQuery = '';
  let currentPage = 1;
  let itemsPerPage = 20;
  let currentView = localStorage.getItem('view_mode') || 'cards';

  // 1. Initialize View Mode (Cards vs Dense Table)
  function setViewMode(mode) {
    currentView = mode;
    localStorage.setItem('view_mode', mode);
    if (mode === 'table') {
      if (gridContainer) gridContainer.style.display = 'none';
      if (tableWrap) tableWrap.style.display = 'block';
      if (btnViewCards) btnViewCards.classList.remove('active');
      if (btnViewTable) btnViewTable.classList.add('active');
    } else {
      if (gridContainer) gridContainer.style.display = 'grid';
      if (tableWrap) tableWrap.style.display = 'none';
      if (btnViewCards) btnViewCards.classList.add('active');
      if (btnViewTable) btnViewTable.classList.remove('active');
    }
  }

  if (btnViewCards) btnViewCards.addEventListener('click', () => setViewMode('cards'));
  if (btnViewTable) btnViewTable.addEventListener('click', () => setViewMode('table'));
  setViewMode(currentView);

  // 2. Keyboard shortcut: '/' to focus search, Esc to clear
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    } else if (e.key === 'Escape' && document.activeElement === searchInput) {
      searchInput.value = '';
      searchQuery = '';
      currentPage = 1;
      applyFiltersAndPaginate();
      searchInput.blur();
    }
  });

  // 3. Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      currentPage = 1;
      updateActiveFilterUI();
      applyFiltersAndPaginate();
    });
  }

  // 4. Status Filter Buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter') || 'ALL';
      currentPage = 1;
      syncChartHighlights();
      updateActiveFilterUI();
      applyFiltersAndPaginate();
    });
  });

  // 5. Interactive Chart Clicks
  chartClickElements.forEach(el => {
    el.addEventListener('click', () => {
      const chartType = el.getAttribute('data-chart-type');
      const chartVal = el.getAttribute('data-chart-val');

      if (chartType === 'status') {
        currentFilter = chartVal;
        filterButtons.forEach(b => {
          if (b.getAttribute('data-filter') === chartVal) b.classList.add('active');
          else b.classList.remove('active');
        });
      } else if (chartType === 'month') {
        currentMonth = (currentMonth === chartVal) ? 'ALL' : chartVal;
      } else if (chartType === 'sector' || chartType === 'source') {
        currentSector = (currentSector === chartVal) ? 'ALL' : chartVal;
      }

      currentPage = 1;
      syncChartHighlights();
      updateActiveFilterUI();
      applyFiltersAndPaginate();

      const anchor = document.getElementById('incidents-anchor');
      if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  function syncChartHighlights() {
    chartClickElements.forEach(el => {
      const chartType = el.getAttribute('data-chart-type');
      const chartVal = el.getAttribute('data-chart-val');
      let isActive = false;

      if (chartType === 'status' && currentFilter === chartVal) isActive = true;
      if (chartType === 'month' && currentMonth === chartVal) isActive = true;
      if ((chartType === 'sector' || chartType === 'source') && currentSector === chartVal) isActive = true;

      if (isActive) el.classList.add('active');
      else el.classList.remove('active');
    });
  }

  // 6. Active Filter Bar & Reset
  function updateActiveFilterUI() {
    const filters = [];
    if (currentFilter !== 'ALL') filters.push(`Status: ${currentFilter}`);
    if (currentMonth !== 'ALL') filters.push(`Month: ${currentMonth}`);
    if (currentSector !== 'ALL') filters.push(`Sector: ${currentSector}`);
    if (currentIndustry !== 'ALL') filters.push(`Industry: ${currentIndustry}`);
    if (currentDataType !== 'ALL') filters.push(`Data: ${currentDataType}`);
    if (highImpactOnly) filters.push(`Impact: >100K Records`);
    if (searchQuery) filters.push(`"${searchQuery}"`);

    if (activeFilterBar && activeFilterPill) {
      if (filters.length > 0) {
        activeFilterBar.style.display = 'flex';
        activeFilterPill.textContent = filters.join(' • ');
      } else {
        activeFilterBar.style.display = 'none';
      }
    }
  }

  if (btnClearFilter) {
    btnClearFilter.addEventListener('click', () => {
      currentFilter = 'ALL';
      currentMonth = 'ALL';
      currentSector = 'ALL';
      currentIndustry = 'ALL';
      currentDataType = 'ALL';
      highImpactOnly = false;
      searchQuery = '';
      currentPage = 1;

      if (searchInput) searchInput.value = '';
      if (sectorSelect) sectorSelect.value = 'ALL';
      if (dataTypeSelect) dataTypeSelect.value = 'ALL';
      if (btnHighImpact) btnHighImpact.classList.remove('active');

      filterButtons.forEach(b => {
        if (b.getAttribute('data-filter') === 'ALL') b.classList.add('active');
        else b.classList.remove('active');
      });

      syncChartHighlights();
      updateActiveFilterUI();
      applyFiltersAndPaginate();
    });
  }

  // Forensic Filter Controls
  if (sectorSelect) {
    sectorSelect.addEventListener('change', (e) => {
      currentIndustry = e.target.value;
      currentPage = 1;
      updateActiveFilterUI();
      applyFiltersAndPaginate();
    });
  }

  if (dataTypeSelect) {
    dataTypeSelect.addEventListener('change', (e) => {
      currentDataType = e.target.value;
      currentPage = 1;
      updateActiveFilterUI();
      applyFiltersAndPaginate();
    });
  }

  if (btnHighImpact) {
    btnHighImpact.addEventListener('click', () => {
      highImpactOnly = !highImpactOnly;
      btnHighImpact.classList.toggle('active', highImpactOnly);
      currentPage = 1;
      updateActiveFilterUI();
      applyFiltersAndPaginate();
    });
  }

  // 7. Sort Dropdown
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      sortItems();
      applyFiltersAndPaginate();
    });
  }

  // 8. Page Size Dropdown
  if (pageSizeSelect) {
    pageSizeSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      itemsPerPage = val === 'all' ? Infinity : parseInt(val, 10);
      currentPage = 1;
      applyFiltersAndPaginate();
    });
  }

  function sortItems() {
    const sortFn = (a, b) => {
      if (currentSort === 'affected') {
        const affA = parseInt(a.getAttribute('data-affected') || '0', 10);
        const affB = parseInt(b.getAttribute('data-affected') || '0', 10);
        if (affB !== affA) return affB - affA;
        return (b.getAttribute('data-updated') || '').localeCompare(a.getAttribute('data-updated') || '');
      }
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
        const mA = parseInt(a.getAttribute('data-milestones') || '0', 10);
        const mB = parseInt(b.getAttribute('data-milestones') || '0', 10);
        if (mB !== mA) return mB - mA;
        return (b.getAttribute('data-updated') || '').localeCompare(a.getAttribute('data-updated') || '');
      }
      // Default: 'recent'
      return (b.getAttribute('data-updated') || '').localeCompare(a.getAttribute('data-updated') || '');
    };

    if (gridContainer) {
      const cards = Array.from(gridContainer.querySelectorAll('.incident-card'));
      cards.sort(sortFn);
      cards.forEach(c => gridContainer.appendChild(c));
    }

    if (tableBody) {
      const rows = Array.from(tableBody.querySelectorAll('.telemetry-row'));
      rows.sort(sortFn);
      rows.forEach(r => tableBody.appendChild(r));
    }
  }

  // 9. Filtering and Pagination Engine
  function applyFiltersAndPaginate() {
    const cards = gridContainer ? Array.from(gridContainer.querySelectorAll('.incident-card')) : [];
    const rows = tableBody ? Array.from(tableBody.querySelectorAll('.telemetry-row')) : [];

    const matchesFilter = (el) => {
      const status = el.getAttribute('data-status') || '';
      const target = el.getAttribute('data-target') || '';
      const domain = el.getAttribute('data-domain') || '';
      const industry = el.getAttribute('data-industry') || '';
      const type = el.getAttribute('data-type') || '';
      const affected = parseInt(el.getAttribute('data-affected') || '0', 10);
      const compromised = el.getAttribute('data-compromised') || '';
      const filings = el.getAttribute('data-filings') || '';
      const summary = el.getAttribute('data-summary') || '';
      const actor = el.getAttribute('data-actor') || '';
      const tags = (el.getAttribute('data-tags') || '').toLowerCase();
      const month = el.getAttribute('data-month') || '';
      const confidence = el.getAttribute('data-confidence') || '';

      const matchStatus = (currentFilter === 'ALL' || status === currentFilter);
      const matchMonth = (currentMonth === 'ALL' || month === currentMonth);

      let matchSector = true;
      if (currentSector !== 'ALL') {
        const secLower = currentSector.toLowerCase();
        matchSector = tags.includes(secLower) || industry.toLowerCase().includes(secLower);
      }

      let matchIndustry = true;
      if (currentIndustry !== 'ALL') {
        const indLower = currentIndustry.toLowerCase();
        matchIndustry = industry.toLowerCase().includes(indLower) || tags.includes(indLower);
      }

      let matchDataType = true;
      if (currentDataType !== 'ALL') {
        matchDataType = compromised.toLowerCase().includes(currentDataType.toLowerCase());
      }

      let matchImpact = true;
      if (highImpactOnly) {
        matchImpact = affected >= 100000;
      }

      let matchSearch = true;
      if (searchQuery) {
        const haystack = `${target} ${domain} ${industry} ${type} ${summary} ${actor} ${tags} ${compromised} ${filings} ${confidence}% ${status}`.toLowerCase();
        matchSearch = haystack.includes(searchQuery);
      }

      return matchStatus && matchMonth && matchSector && matchIndustry && matchDataType && matchImpact && matchSearch;
    };

    const matchingCards = cards.filter(matchesFilter);
    const totalMatching = matchingCards.length;

    // Handle Empty State
    if (emptyState) {
      emptyState.style.display = totalMatching === 0 ? 'block' : 'none';
    }

    // Pagination Calculations
    const totalPages = itemsPerPage === Infinity ? 1 : Math.max(1, Math.ceil(totalMatching / itemsPerPage));
    if (currentPage > totalPages) currentPage = totalPages;

    const startIdx = itemsPerPage === Infinity ? 0 : (currentPage - 1) * itemsPerPage;
    const endIdx = itemsPerPage === Infinity ? totalMatching : Math.min(startIdx + itemsPerPage, totalMatching);

    // Apply visibility to Cards
    cards.forEach(card => {
      if (matchesFilter(card)) {
        const indexInMatching = matchingCards.indexOf(card);
        if (indexInMatching >= startIdx && indexInMatching < endIdx) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      } else {
        card.style.display = 'none';
      }
    });

    // Apply visibility to Table Rows identically
    const matchingRows = rows.filter(matchesFilter);
    rows.forEach(row => {
      if (matchesFilter(row)) {
        const indexInMatching = matchingRows.indexOf(row);
        if (indexInMatching >= startIdx && indexInMatching < endIdx) {
          row.style.display = 'table-row';
        } else {
          row.style.display = 'none';
        }
      } else {
        row.style.display = 'none';
      }
    });

    // Render Pagination Controls
    renderPaginationUI(totalMatching, totalPages, startIdx, endIdx);
  }

  function renderPaginationUI(totalMatching, totalPages, startIdx, endIdx) {
    if (!paginationBar) return;

    if (totalMatching === 0) {
      paginationBar.style.display = 'none';
      return;
    }

    paginationBar.style.display = 'flex';

    if (paginationInfo) {
      const displayStart = totalMatching > 0 ? startIdx + 1 : 0;
      paginationInfo.textContent = `Showing ${displayStart}–${endIdx} of ${totalMatching} incident${totalMatching === 1 ? '' : 's'}`;
    }

    if (!paginationNav) return;
    paginationNav.innerHTML = '';

    if (totalPages <= 1) return;

    // Previous Button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.title = 'Previous page';
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        applyFiltersAndPaginate();
        scrollToIncidents();
      }
    });
    paginationNav.appendChild(prevBtn);

    // Page Number Buttons
    const maxVisiblePages = 7;
    let startPage = Math.max(1, currentPage - 3);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      addPageBtn(1);
      if (startPage > 2) addEllipsis();
    }

    for (let p = startPage; p <= endPage; p++) {
      addPageBtn(p);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) addEllipsis();
      addPageBtn(totalPages);
    }

    // Next Button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.title = 'Next page';
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        applyFiltersAndPaginate();
        scrollToIncidents();
      }
    });
    paginationNav.appendChild(nextBtn);

    function addPageBtn(pageNum) {
      const pBtn = document.createElement('button');
      pBtn.className = `page-btn ${pageNum === currentPage ? 'active' : ''}`;
      pBtn.textContent = pageNum;
      pBtn.addEventListener('click', () => {
        if (currentPage !== pageNum) {
          currentPage = pageNum;
          applyFiltersAndPaginate();
          scrollToIncidents();
        }
      });
      paginationNav.appendChild(pBtn);
    }

    function addEllipsis() {
      const span = document.createElement('span');
      span.style.padding = '0 0.35rem';
      span.style.color = 'var(--text-muted)';
      span.textContent = '…';
      paginationNav.appendChild(span);
    }

    function scrollToIncidents() {
      const anchor = document.getElementById('incidents-anchor');
      if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // 10. 1-Click Clipboard Copy Buttons
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

  // Initial Run
  applyFiltersAndPaginate();
});
