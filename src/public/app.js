/**
 * securityincident.net - Interactive Client Script
 * Powers:
 * - Security Incidents & Threat Telemetry Feed (index.html)
 * - Incident Stream Tabs (Trending, Emerging, Confirmed, All)
 * - Expandable Telemetry & Granular Filters Drawer
 * - 1-Click Client-Side JSON & CSV Telemetry Export
 * - Pipeline Health Status Monitoring (status.html)
 * - 1-Click Link Sharing with Toast Notifications
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
  const streamTabs = document.querySelectorAll('.stream-tab');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const sortSelect = document.getElementById('sort-select') || document.getElementById('drawer-sort-select');
  const pageSizeSelect = document.getElementById('page-size-select');
  const sectorSelect = document.getElementById('sector-select') || document.getElementById('drawer-sector-select');
  const typeSelect = document.getElementById('type-select');
  const dataTypeSelect = document.getElementById('data-type-select') || document.getElementById('drawer-data-select');
  const filingSelect = document.getElementById('filing-select');
  const scopeSelect = document.getElementById('scope-select');
  const btnExportJson = document.getElementById('btn-export-json');
  const btnExportCsv = document.getElementById('btn-export-csv');
  const exportCountBadge = document.getElementById('export-count-badge');
  const btnHighImpact = document.getElementById('btn-high-impact') || document.getElementById('drawer-btn-high-impact');
  const feedContainer = document.getElementById('incidents-feed');
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
  const topicChips = document.querySelectorAll('.qt-chip');
  const btnToggleDrawer = document.getElementById('btn-toggle-drawer');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');
  const telemetryDrawer = document.getElementById('telemetry-drawer');
  const drawerActiveCount = document.getElementById('drawer-active-count');
  const toastNotify = document.getElementById('toast-notify');
  const toastMessage = document.getElementById('toast-message');

  // State
  let currentStream = 'trending'; // 'trending' | 'emerging' | 'confirmed' | 'all'
  let currentFilter = 'ALL';      // Status filter
  let currentMonth = 'ALL';       // Month filter from velocity chart
  let currentSector = 'ALL';      // Sector filter from sector/source charts
  let currentIndustry = 'ALL';    // Industry dropdown filter
  let currentType = 'ALL';        // Incident classification type filter
  let currentDataType = 'ALL';    // Compromised data class filter
  let currentFiling = 'ALL';      // Statutory regulatory filing filter
  let currentScope = 'ALL';       // Affected records scope filter
  let highImpactOnly = false;     // >100K affected records toggle
  let currentSort = 'recent';
  let searchQuery = '';
  let currentPage = 1;
  let itemsPerPage = feedContainer ? 20 : (pageSizeSelect ? parseInt(pageSizeSelect.value, 10) || 50 : 20);
  let currentView = localStorage.getItem('view_mode') || 'table';

  // 1. Toast Notification Helper
  function showToast(msg) {
    if (!toastNotify) return;
    if (toastMessage) toastMessage.textContent = msg;
    toastNotify.style.display = 'flex';
    toastNotify.classList.add('toast-show');
    setTimeout(() => {
      toastNotify.classList.remove('toast-show');
      setTimeout(() => {
        toastNotify.style.display = 'none';
      }, 300);
    }, 2500);
  }

  // 2. Stream Tabs Switching (Trending, Emerging, Confirmed, All)
  if (streamTabs && streamTabs.length > 0) {
    streamTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        streamTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentStream = tab.getAttribute('data-stream') || 'all';

        if (currentStream === 'emerging') {
          currentFilter = 'EMERGING';
          currentSort = 'recent';
        } else if (currentStream === 'confirmed') {
          currentFilter = 'CONFIRMED';
          currentSort = 'recent';
        } else if (currentStream === 'trending') {
          currentFilter = 'ALL';
          currentSort = 'trending';
        } else {
          currentFilter = 'ALL';
          currentSort = 'recent';
        }

        // Synchronize filter buttons if present
        filterButtons.forEach(b => {
          if (b.getAttribute('data-filter') === currentFilter) b.classList.add('active');
          else b.classList.remove('active');
        });

        currentPage = 1;
        sortItems();
        updateDrawerBadge();
        updateActiveFilterUI();
        applyFiltersAndPaginate();
      });
    });
  }

  // 3. Telemetry Drawer Expand/Collapse
  if (btnToggleDrawer && telemetryDrawer) {
    btnToggleDrawer.addEventListener('click', () => {
      const isExpanded = telemetryDrawer.style.display === 'block';
      telemetryDrawer.style.display = isExpanded ? 'none' : 'block';
      btnToggleDrawer.setAttribute('aria-expanded', !isExpanded);
      btnToggleDrawer.classList.toggle('active', !isExpanded);
    });
  }

  if (btnCloseDrawer && telemetryDrawer) {
    btnCloseDrawer.addEventListener('click', () => {
      telemetryDrawer.style.display = 'none';
      if (btnToggleDrawer) {
        btnToggleDrawer.setAttribute('aria-expanded', 'false');
        btnToggleDrawer.classList.remove('active');
      }
    });
  }

  function updateDrawerBadge() {
    let count = 0;
    if (currentFilter !== 'ALL' && currentStream === 'all') count++;
    if (currentIndustry !== 'ALL') count++;
    if (currentType !== 'ALL') count++;
    if (currentDataType !== 'ALL') count++;
    if (currentFiling !== 'ALL') count++;
    if (currentScope !== 'ALL') count++;
    if (highImpactOnly) count++;
    if (currentSort !== 'recent' && currentSort !== 'trending') count++;

    if (drawerActiveCount) {
      if (count > 0) {
        drawerActiveCount.style.display = 'inline-block';
        drawerActiveCount.textContent = count;
      } else {
        drawerActiveCount.style.display = 'none';
      }
    }
  }

  // 4. Quick Topic Chips (#Ransomware, #SEC-8K, etc.)
  topicChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const topic = chip.getAttribute('data-topic');
      if (topic === 'high-impact') {
        highImpactOnly = !highImpactOnly;
        chip.classList.toggle('active', highImpactOnly);
        if (btnHighImpact) btnHighImpact.classList.toggle('active', highImpactOnly);
      } else if (topic === 'healthcare') {
        currentIndustry = currentIndustry === 'Healthcare' ? 'ALL' : 'Healthcare';
        if (sectorSelect) sectorSelect.value = currentIndustry;
        chip.classList.toggle('active', currentIndustry === 'Healthcare');
      } else if (topic === 'financial') {
        currentIndustry = currentIndustry === 'Financial' ? 'ALL' : 'Financial';
        if (sectorSelect) sectorSelect.value = currentIndustry;
        chip.classList.toggle('active', currentIndustry === 'Financial');
      } else {
        if (searchInput) {
          if (searchQuery.includes(topic)) {
            searchInput.value = '';
            searchQuery = '';
            chip.classList.remove('active');
          } else {
            searchInput.value = topic;
            searchQuery = topic.toLowerCase();
            topicChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
          }
        }
      }
      currentPage = 1;
      updateDrawerBadge();
      updateActiveFilterUI();
      applyFiltersAndPaginate();
    });
  });

  // 5. 1-Click Share Button (Copy permalink to clipboard)
  document.addEventListener('click', (e) => {
    const shareBtn = e.target.closest('.btn-action-share');
    if (shareBtn) {
      const id = shareBtn.getAttribute('data-id');
      const url = `https://securityincident.net/incidents/${id}.html`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          showToast(`Dossier link copied to clipboard!`);
        }).catch(() => {
          showToast(`Copied: ${url}`);
        });
      } else {
        showToast(`Copied: ${url}`);
      }
    }
  });

  // 6. View Mode Toggle (Cards vs Dense Table on Telemetry Page)
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
  if (tableWrap || gridContainer) {
    setViewMode(currentView);
  }

  // 7. Keyboard Shortcut: '/' to focus search, Esc to clear and close drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    } else if (e.key === 'Escape') {
      if (document.activeElement === searchInput) {
        searchInput.value = '';
        searchQuery = '';
        currentPage = 1;
        updateActiveFilterUI();
        applyFiltersAndPaginate();
        searchInput.blur();
      }
      if (telemetryDrawer && telemetryDrawer.style.display === 'block') {
        telemetryDrawer.style.display = 'none';
        if (btnToggleDrawer) {
          btnToggleDrawer.setAttribute('aria-expanded', 'false');
          btnToggleDrawer.classList.remove('active');
        }
      }
    }
  });

  // 8. Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      currentPage = 1;
      updateActiveFilterUI();
      applyFiltersAndPaginate();
    });
  }

  // 9. Status Filter Buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter') || 'ALL';
      currentPage = 1;

      // Update stream tab selection if status changed
      if (streamTabs && streamTabs.length > 0) {
        streamTabs.forEach(t => t.classList.remove('active'));
        if (currentFilter === 'EMERGING') {
          const emergingTab = document.querySelector('.stream-tab[data-stream="emerging"]');
          if (emergingTab) emergingTab.classList.add('active');
        } else if (currentFilter === 'CONFIRMED') {
          const confirmedTab = document.querySelector('.stream-tab[data-stream="confirmed"]');
          if (confirmedTab) confirmedTab.classList.add('active');
        } else {
          const allTab = document.querySelector('.stream-tab[data-stream="all"]');
          if (allTab) allTab.classList.add('active');
        }
      }

      syncChartHighlights();
      updateDrawerBadge();
      updateActiveFilterUI();
      applyFiltersAndPaginate();
    });
  });

  // 10. Interactive Chart Clicks (on Telemetry Page)
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
      updateDrawerBadge();
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

  // 11. Active Filter Bar & Reset
  function updateActiveFilterUI() {
    const filters = [];
    if (currentFilter !== 'ALL') filters.push(`Status: ${currentFilter}`);
    if (currentMonth !== 'ALL') filters.push(`Month: ${currentMonth}`);
    if (currentSector !== 'ALL') filters.push(`Sector: ${currentSector}`);
    if (currentIndustry !== 'ALL') filters.push(`Industry: ${currentIndustry}`);
    if (currentType !== 'ALL') filters.push(`Type: ${currentType}`);
    if (currentDataType !== 'ALL') filters.push(`Data: ${currentDataType}`);
    if (currentFiling !== 'ALL') filters.push(`Filing: ${currentFiling}`);
    if (currentScope !== 'ALL') filters.push(`Scope: ${currentScope}`);
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
      currentType = 'ALL';
      currentDataType = 'ALL';
      currentFiling = 'ALL';
      currentScope = 'ALL';
      highImpactOnly = false;
      searchQuery = '';
      currentPage = 1;

      if (searchInput) searchInput.value = '';
      if (sectorSelect) sectorSelect.value = 'ALL';
      if (typeSelect) typeSelect.value = 'ALL';
      if (dataTypeSelect) dataTypeSelect.value = 'ALL';
      if (filingSelect) filingSelect.value = 'ALL';
      if (scopeSelect) scopeSelect.value = 'ALL';
      if (btnHighImpact) btnHighImpact.classList.remove('active');

      filterButtons.forEach(b => {
        if (b.getAttribute('data-filter') === 'ALL') b.classList.add('active');
        else b.classList.remove('active');
      });

      if (streamTabs && streamTabs.length > 0) {
        streamTabs.forEach(t => t.classList.remove('active'));
        const allTab = document.querySelector('.stream-tab[data-stream="all"]');
        if (allTab) allTab.classList.add('active');
      }

      topicChips.forEach(c => c.classList.remove('active'));

      syncChartHighlights();
      updateDrawerBadge();
      updateActiveFilterUI();
      applyFiltersAndPaginate();
    });
  }

  // Forensic Filter Controls
  if (sectorSelect) {
    sectorSelect.addEventListener('change', (e) => {
      currentIndustry = e.target.value;
      currentPage = 1;
      updateDrawerBadge();
      updateActiveFilterUI();
      applyFiltersAndPaginate();
    });
  }

  if (typeSelect) {
    typeSelect.addEventListener('change', (e) => {
      currentType = e.target.value;
      currentPage = 1;
      updateDrawerBadge();
      updateActiveFilterUI();
      applyFiltersAndPaginate();
    });
  }

  if (dataTypeSelect) {
    dataTypeSelect.addEventListener('change', (e) => {
      currentDataType = e.target.value;
      currentPage = 1;
      updateDrawerBadge();
      updateActiveFilterUI();
      applyFiltersAndPaginate();
    });
  }

  if (filingSelect) {
    filingSelect.addEventListener('change', (e) => {
      currentFiling = e.target.value;
      currentPage = 1;
      updateDrawerBadge();
      updateActiveFilterUI();
      applyFiltersAndPaginate();
    });
  }

  if (scopeSelect) {
    scopeSelect.addEventListener('change', (e) => {
      currentScope = e.target.value;
      currentPage = 1;
      updateDrawerBadge();
      updateActiveFilterUI();
      applyFiltersAndPaginate();
    });
  }

  if (btnHighImpact) {
    btnHighImpact.addEventListener('click', () => {
      highImpactOnly = !highImpactOnly;
      btnHighImpact.classList.toggle('active', highImpactOnly);
      currentPage = 1;
      updateDrawerBadge();
      updateActiveFilterUI();
      applyFiltersAndPaginate();
    });
  }

  // 12. Sort Dropdown
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      sortItems();
      updateDrawerBadge();
      applyFiltersAndPaginate();
    });
  }

  // 13. Page Size Dropdown
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
      if (currentSort === 'trending') {
        const affA = parseInt(a.getAttribute('data-affected') || '0', 10);
        const affB = parseInt(b.getAttribute('data-affected') || '0', 10);
        const mA = parseInt(a.getAttribute('data-milestones') || '0', 10);
        const mB = parseInt(b.getAttribute('data-milestones') || '0', 10);
        const scoreA = (affA > 0 ? Math.log10(affA) : 0) + (mA * 2);
        const scoreB = (affB > 0 ? Math.log10(affB) : 0) + (mB * 2);
        if (Math.abs(scoreB - scoreA) > 1.5) return scoreB - scoreA;
        return (b.getAttribute('data-updated') || '').localeCompare(a.getAttribute('data-updated') || '');
      }
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

    if (feedContainer) {
      const feedCards = Array.from(feedContainer.querySelectorAll('.feed-card'));
      feedCards.sort(sortFn);
      feedCards.forEach(c => feedContainer.appendChild(c));
    }

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

  // 14. Forensic Matching Engine
  function matchesFilter(el) {
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

    let matchType = true;
    if (currentType !== 'ALL') {
      matchType = type.toLowerCase().includes(currentType.toLowerCase());
    }

    let matchDataType = true;
    if (currentDataType !== 'ALL') {
      matchDataType = compromised.toLowerCase().includes(currentDataType.toLowerCase());
    }

    let matchFiling = true;
    if (currentFiling !== 'ALL') {
      matchFiling = filings.toLowerCase().includes(currentFiling.toLowerCase());
    }

    let matchScope = true;
    if (currentScope === 'DISCLOSED') {
      matchScope = affected > 0;
    } else if (currentScope === '10K') {
      matchScope = affected >= 10000;
    } else if (currentScope === '100K') {
      matchScope = affected >= 100000;
    } else if (currentScope === '1M') {
      matchScope = affected >= 1000000;
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

    return matchStatus && matchMonth && matchSector && matchIndustry && matchType && matchDataType && matchFiling && matchScope && matchImpact && matchSearch;
  }

  // 15. Filtering and Pagination Engine
  function applyFiltersAndPaginate() {
    const feedCards = feedContainer ? Array.from(feedContainer.querySelectorAll('.feed-card')) : [];
    const cards = gridContainer ? Array.from(gridContainer.querySelectorAll('.incident-card')) : [];
    const rows = tableBody ? Array.from(tableBody.querySelectorAll('.telemetry-row')) : [];

    const activeList = feedCards.length > 0 ? feedCards : (cards.length > 0 ? cards : rows);

    const matchingItems = activeList.filter(matchesFilter);
    const totalMatching = matchingItems.length;

    // Update Export Counter Badge
    if (exportCountBadge) {
      exportCountBadge.textContent = `${totalMatching} record${totalMatching === 1 ? '' : 's'} matching`;
    }

    // Handle Empty State
    if (emptyState) {
      emptyState.style.display = totalMatching === 0 ? 'block' : 'none';
    }

    // Pagination Calculations
    const totalPages = itemsPerPage === Infinity ? 1 : Math.max(1, Math.ceil(totalMatching / itemsPerPage));
    if (currentPage > totalPages) currentPage = totalPages;

    const startIdx = itemsPerPage === Infinity ? 0 : (currentPage - 1) * itemsPerPage;
    const endIdx = itemsPerPage === Infinity ? totalMatching : Math.min(startIdx + itemsPerPage, totalMatching);

    // Apply visibility to Feed Cards (Home Page Stream)
    if (feedCards.length > 0) {
      feedCards.forEach(card => {
        if (matchesFilter(card)) {
          const indexInMatching = matchingItems.indexOf(card);
          if (indexInMatching >= startIdx && indexInMatching < endIdx) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        } else {
          card.style.display = 'none';
        }
      });
    }

    // Apply visibility to Grid Cards (Telemetry Page)
    if (cards.length > 0) {
      cards.forEach(card => {
        if (matchesFilter(card)) {
          const indexInMatching = matchingItems.indexOf(card);
          if (indexInMatching >= startIdx && indexInMatching < endIdx) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        } else {
          card.style.display = 'none';
        }
      });
    }

    // Apply visibility to Table Rows (Telemetry Page)
    if (rows.length > 0) {
      rows.forEach(row => {
        if (matchesFilter(row)) {
          const indexInMatching = matchingItems.indexOf(row);
          if (indexInMatching >= startIdx && indexInMatching < endIdx) {
            row.style.display = 'table-row';
          } else {
            row.style.display = 'none';
          }
        } else {
          row.style.display = 'none';
        }
      });
    }

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
        scrollToTop();
      }
    });
    paginationNav.appendChild(prevBtn);

    // Page Numbers
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
        scrollToTop();
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
          scrollToTop();
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

    function scrollToTop() {
      const target = document.querySelector('.feed-controls-panel') || document.getElementById('incidents-anchor');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // 16. Export Data to JSON and CSV
  function getExportRecords() {
    const feedCards = feedContainer ? Array.from(feedContainer.querySelectorAll('.feed-card')) : [];
    const cards = gridContainer ? Array.from(gridContainer.querySelectorAll('.incident-card')) : [];
    const rows = tableBody ? Array.from(tableBody.querySelectorAll('.telemetry-row')) : [];

    const activeList = rows.length > 0 ? rows : (cards.length > 0 ? cards : feedCards);
    const matching = activeList.filter(matchesFilter);

    return matching.map(el => {
      const id = el.getAttribute('data-id') || '';
      const target = el.getAttribute('data-target') || '';
      const domain = el.getAttribute('data-domain') || '';
      const status = el.getAttribute('data-status') || '';
      const industry = el.getAttribute('data-industry') || '';
      const incident_type = el.getAttribute('data-type') || '';
      const affected_raw = el.getAttribute('data-affected');
      const affected_records = (affected_raw && affected_raw !== '0') ? parseInt(affected_raw, 10) : null;
      const compromised_data = (el.getAttribute('data-compromised') || '').split(/\s+/).filter(Boolean);
      const regulatory_filings = (el.getAttribute('data-filings') || '').split(/\s+/).filter(Boolean);
      const confidence = parseInt(el.getAttribute('data-confidence') || '0', 10);
      const actor_raw = el.getAttribute('data-actor');
      const threat_actor = (actor_raw && actor_raw !== 'Unknown' && actor_raw !== 'Unattributed') ? actor_raw : null;
      const first_seen = el.getAttribute('data-first-seen') || '';
      const last_updated = el.getAttribute('data-updated') || '';
      const summary = el.getAttribute('data-summary') || '';
      const tags = (el.getAttribute('data-tags') || '').split(/\s+/).filter(Boolean);
      const dossier_url = id ? `https://securityincident.net/incidents/${id}.html` : '';

      return {
        id,
        target,
        domain,
        status,
        industry,
        incident_type,
        affected_records,
        compromised_data,
        regulatory_filings,
        confidence_score_percent: confidence,
        threat_actor,
        first_seen,
        last_updated,
        summary,
        tags,
        dossier_url
      };
    });
  }

  function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  function escapeCsvCell(val) {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  if (btnExportJson) {
    btnExportJson.addEventListener('click', () => {
      const records = getExportRecords();
      if (records.length === 0) {
        showToast('No records match current filters to export.');
        return;
      }
      const dateStr = new Date().toISOString().slice(0, 10);
      const exportPayload = {
        metadata: {
          source: 'securityincident.net Telemetry Deck',
          exported_at: new Date().toISOString(),
          record_count: records.length,
          filters: {
            status: currentFilter,
            sector: currentIndustry,
            type: currentType,
            data_class: currentDataType,
            statutory_filing: currentFiling,
            scope: currentScope,
            query: searchQuery || null
          }
        },
        incidents: records
      };
      const jsonContent = JSON.stringify(exportPayload, null, 2);
      downloadFile(jsonContent, `securityincident-telemetry-${dateStr}.json`, 'application/json');
      showToast(`Exported ${records.length} record${records.length === 1 ? '' : 's'} to JSON`);
    });
  }

  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', () => {
      const records = getExportRecords();
      if (records.length === 0) {
        showToast('No records match current filters to export.');
        return;
      }
      const dateStr = new Date().toISOString().slice(0, 10);
      const headers = [
        'ID',
        'Target',
        'Domain',
        'Status',
        'Industry',
        'Incident Type',
        'Affected Records',
        'Compromised Data',
        'Regulatory Filings',
        'Confidence Score (%)',
        'Threat Actor',
        'First Seen',
        'Last Updated',
        'Summary',
        'Tags',
        'Dossier URL'
      ];

      const csvLines = [headers.join(',')];
      records.forEach(r => {
        const row = [
          escapeCsvCell(r.id),
          escapeCsvCell(r.target),
          escapeCsvCell(r.domain),
          escapeCsvCell(r.status),
          escapeCsvCell(r.industry),
          escapeCsvCell(r.incident_type),
          escapeCsvCell(r.affected_records !== null ? r.affected_records : ''),
          escapeCsvCell(r.compromised_data.join('; ')),
          escapeCsvCell(r.regulatory_filings.join('; ')),
          escapeCsvCell(r.confidence_score_percent),
          escapeCsvCell(r.threat_actor || ''),
          escapeCsvCell(r.first_seen),
          escapeCsvCell(r.last_updated),
          escapeCsvCell(r.summary),
          escapeCsvCell(r.tags.join('; ')),
          escapeCsvCell(r.dossier_url)
        ];
        csvLines.push(row.join(','));
      });

      const csvContent = csvLines.join('\r\n');
      downloadFile(csvContent, `securityincident-telemetry-${dateStr}.csv`, 'text/csv;charset=utf-8;');
      showToast(`Exported ${records.length} record${records.length === 1 ? '' : 's'} to CSV`);
    });
  }

  // Initial Run
  sortItems();
  applyFiltersAndPaginate();
});
