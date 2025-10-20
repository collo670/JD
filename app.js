// ============================================
// JENSAR DISTILLERY - APP.JS
// ============================================

/**
 * Tab Navigation System
 */
function initializeTabNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Get the href attribute
            const href = this.getAttribute('href');
            
            // Only prevent default for hash-based navigation (internal tabs)
            if (href === '#') {
                e.preventDefault();
                
                // Remove active class from all items
                navItems.forEach(navItem => {
                    navItem.classList.remove('active');
                });
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Hide all content sections with fade
                const tabContents = document.querySelectorAll('.tab-content');
                tabContents.forEach(content => {
                    content.style.display = 'none';
                });
                
                // Show corresponding content section
                const tabId = this.getAttribute('data-tab');
                const contentElement = document.getElementById(`${tabId}-content`);
                if (contentElement) {
                    contentElement.style.display = 'block';
                    // Trigger reflow to enable animation
                    contentElement.offsetHeight;
                }
            }
            // For actual file links (suppliers.html, sales.html, etc.), 
            // allow normal navigation to proceed
        });
    });
}

/**
 * Offline Mode Toggle
 */
function initializeOfflineToggle() {
    const offlineBtn = document.getElementById('offline-btn');
    if (!offlineBtn) return;
    
    // Check initial online status
    updateOfflineStatus();
    
    offlineBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        updateOfflineStatus();
    });
    
    // Listen for online/offline events
    window.addEventListener('online', updateOfflineStatus);
    window.addEventListener('offline', updateOfflineStatus);
}

/**
 * Update Offline Status Display
 */
function updateOfflineStatus() {
    const offlineBtn = document.getElementById('offline-btn');
    const isOnline = navigator.onLine;
    const isManualOffline = offlineBtn?.classList.contains('active');
    
    if (isOnline && !isManualOffline) {
        offlineBtn?.classList.remove('active');
        updateStatusIndicator(true);
    } else if (!isOnline || isManualOffline) {
        offlineBtn?.classList.add('active');
        updateStatusIndicator(false);
    }
}

/**
 * Update Status Indicator
 */
function updateStatusIndicator(online) {
    const indicator = document.querySelector('.offline-indicator');
    if (!indicator) return;
    
    if (online) {
        indicator.innerHTML = '<span>Online</span><svg class="offline-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071l3.534-3.534a5 5 0 017.072 0l3.534 3.534M9 9a3 3 0 016 0"></path></svg>';
    } else {
        indicator.innerHTML = '<span>Offline Mode</span><svg class="offline-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>';
    }
}

/**
 * Initialize Service Worker
 */
function initializeServiceWorker() {
    if (!('serviceWorker' in navigator)) {
        console.log('Service Workers not supported');
        return;
    }
    
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration);
                
                // Check for updates periodically
                setInterval(() => {
                    registration.update();
                }, 60000); // Check every minute
                
                // Handle updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New update available
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
    
    // Handle messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'CACHE_UPDATE') {
            console.log('Cache updated:', event.data.message);
        }
    });
}

/**
 * Show Update Notification
 */
function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #8B5CF6, #7C3AED);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(139, 92, 246, 0.2);
        z-index: 9999;
        font-weight: 500;
        animation: slideUp 0.3s ease;
    `;
    notification.textContent = 'New update available! Refresh to get the latest version.';
    notification.addEventListener('click', () => {
        window.location.reload();
    });
    document.body.appendChild(notification);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 8000);
}

/**
 * Initialize Search Functionality
 */
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const tableRows = document.querySelectorAll('tbody tr');
        
        tableRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}

/**
 * Initialize Chart (if Chart.js is available)
 */
function initializeChart() {
    const canvas = document.getElementById('salesChart');
    if (!canvas) return;
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.log('Chart.js not loaded. Loading from CDN...');
        loadChartLibrary();
        return;
    }
    
    createChart();
}

/**
 * Load Chart.js library from CDN
 */
function loadChartLibrary() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';
    script.crossOrigin = 'anonymous';
    script.onload = createChart;
    script.onerror = () => {
        console.error('Failed to load Chart.js');
        // Fallback: Show placeholder
        const canvas = document.getElementById('salesChart');
        if (canvas) {
            canvas.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Chart library unavailable</p>';
        }
    };
    document.head.appendChild(script);
}

/**
 * Create Chart
 */
function createChart() {
    const canvas = document.getElementById('salesChart');
    if (!canvas || typeof Chart === 'undefined') return;
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Sales ($)',
                data: [1200, 1900, 1500, 2400, 2210, 2290, 1800],
                borderColor: '#8B5CF6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#8B5CF6',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    borderColor: '#8B5CF6',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f3f4f6',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        },
                        color: '#6b7280',
                        callback: function(value) {
                            return 'TZS ' + value;
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        },
                        color: '#6b7280'
                    }
                }
            }
        }
    });
}

/**
 * Add Table Row Animation
 */
function initializeTableAnimations() {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
        row.style.animation = `slideUp 0.4s ease ${0.05 * index}s backwards`;
    });
}

/**
 * Initialize Theme Toggle (Optional Enhancement)
 */
function initializeThemeToggle() {
    const themeToggleButton = document.getElementById('theme-toggle');
    if (!themeToggleButton) {
        return;
    }

    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = localStorage.getItem('theme');

    const applyTheme = (theme, { persist = true } = {}) => {
        document.documentElement.setAttribute('data-theme', theme);
        themeToggleButton.setAttribute('aria-pressed', theme === 'dark');
        themeToggleButton.classList.toggle('active', theme === 'dark');

        if (persist) {
            localStorage.setItem('theme', theme);
        } else {
            localStorage.removeItem('theme');
        }
    };

    applyTheme(storedTheme || (prefersDarkScheme.matches ? 'dark' : 'light'), {
        persist: Boolean(storedTheme)
    });

    themeToggleButton.addEventListener('click', () => {
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        applyTheme(isDarkMode ? 'light' : 'dark');
    });

    prefersDarkScheme.addEventListener('change', (event) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(event.matches ? 'dark' : 'light', { persist: false });
        }
    });
}

/**
 * Performance: Lazy load non-critical images
 */
function initializeLazyLoading() {
    if (!('IntersectionObserver' in window)) return;
    
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * Performance: Monitor Core Web Vitals
 */
function initializeWebVitals() {
    if (!('PerformanceObserver' in window)) return;
    
    // Largest Contentful Paint
    try {
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
        console.log('LCP Observer not supported');
    }
    
    // Cumulative Layout Shift
    try {
        const clsObserver = new PerformanceObserver((list) => {
            let clsScore = 0;
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsScore += entry.value;
                    console.log('CLS:', clsScore);
                }
            }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
        console.log('CLS Observer not supported');
    }
}

/**
 * Keyboard Navigation Enhancement
 */
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Skip if modifier keys are pressed
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        
        // Tab navigation with arrow keys
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const navItems = document.querySelectorAll('.nav-item');
            const activeItem = document.querySelector('.nav-item.active');
            const activeIndex = Array.from(navItems).indexOf(activeItem);
            
            let nextIndex;
            if (e.key === 'ArrowLeft') {
                nextIndex = activeIndex > 0 ? activeIndex - 1 : navItems.length - 1;
            } else {
                nextIndex = activeIndex < navItems.length - 1 ? activeIndex + 1 : 0;
            }
            
            navItems[nextIndex].click();
            e.preventDefault();
        }
    });
}

/**
 * Modal Management
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        const form = modal.querySelector('form');
        if (form) form.reset();
        delete modal.dataset.editIndex;
    }
}

/**
 * Sales Management
 */
const salesData = {
    load: function() {
        return JSON.parse(localStorage.getItem('jensar_sales') || '[]');
    },
    save: function(data) {
        localStorage.setItem('jensar_sales', JSON.stringify(data));
    },
    add: function(record) {
        const data = this.load();
        record.id = 'SAL-' + String(data.length + 1).padStart(3, '0');
        data.push(record);
        this.save(data);
        return record;
    },
    delete: function(index) {
        const data = this.load();
        data.splice(index, 1);
        this.save(data);
    },
    update: function(index, record) {
        const data = this.load();
        data[index] = { ...data[index], ...record };
        this.save(data);
    }
};

function initializeSalesModule() {
    const addBtn = document.querySelector('button[aria-label="Record new sale"]');
    const form = document.getElementById('sales-form');
    const modal = document.getElementById('sales-modal');
    
    if (!addBtn || !form || !modal) return;
    
    renderSalesTable();
    
    addBtn.addEventListener('click', () => {
        modal.dataset.editIndex = '';
        form.reset();
        openModal('sales-modal');
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const editIndex = modal.dataset.editIndex;
        const record = {
            product: document.getElementById('sales-product').value,
            customer: document.getElementById('sales-customer').value,
            quantity: document.getElementById('sales-quantity').value,
            amount: parseFloat(document.getElementById('sales-amount').value),
            date: document.getElementById('sales-date').value,
            status: document.getElementById('sales-status').value
        };
        
        if (editIndex !== '') {
            salesData.update(parseInt(editIndex), record);
        } else {
            salesData.add(record);
        }
        
        renderSalesTable();
        closeModal(modal);
    });
    
    modal.querySelector('.close-btn')?.addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });
}

function renderSalesTable() {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;
    
    const data = salesData.load();
    tbody.innerHTML = data.map((record, index) => `
        <tr>
            <td>${record.id || '#SAL-' + String(index + 1).padStart(3, '0')}</td>
            <td>${record.product}</td>
            <td>${record.customer}</td>
            <td>${record.quantity}</td>
            <td>TZS ${parseFloat(record.amount).toLocaleString()}</td>
            <td>${record.date}</td>
            <td><span class="badge badge-${record.status === 'Delivered' ? 'success' : 'warning'}">${record.status}</span></td>
            <td class="table-actions">
                <button onclick="editSalesRecord(${index})">Edit</button>
                <button onclick="deleteSalesRecord(${index})" style="color: #EF4444;">Delete</button>
            </td>
        </tr>
    `).join('');
    
    // Update statistics after table render
    updateAllStatistics();
    console.log('✓ Sales table rendered with updated statistics');
}

function editSalesRecord(index) {
    const data = salesData.load();
    const record = data[index];
    const form = document.getElementById('sales-form');
    const modal = document.getElementById('sales-modal');
    
    if (form && record) {
        document.getElementById('sales-product').value = record.product;
        document.getElementById('sales-customer').value = record.customer;
        document.getElementById('sales-quantity').value = record.quantity;
        document.getElementById('sales-amount').value = record.amount;
        document.getElementById('sales-date').value = record.date;
        document.getElementById('sales-status').value = record.status;
        
        modal.dataset.editIndex = index;
        openModal('sales-modal');
    }
}

function deleteSalesRecord(index) {
    if (confirm('Are you sure you want to delete this sale record?')) {
        salesData.delete(index);
        renderSalesTable();
    }
}

/**
 * Purchase Orders Management
 */
const purchaseData = {
    load: function() {
        return JSON.parse(localStorage.getItem('jensar_purchases') || '[]');
    },
    save: function(data) {
        localStorage.setItem('jensar_purchases', JSON.stringify(data));
    },
    add: function(record) {
        const data = this.load();
        record.id = 'PO-2024-' + String(data.length + 1).padStart(3, '0');
        data.push(record);
        this.save(data);
        return record;
    },
    delete: function(index) {
        const data = this.load();
        data.splice(index, 1);
        this.save(data);
    },
    update: function(index, record) {
        const data = this.load();
        data[index] = { ...data[index], ...record };
        this.save(data);
    }
};

function initializePurchaseModule() {
    const addBtn = document.querySelector('button[aria-label="Create new purchase order"]');
    const form = document.getElementById('purchase-form');
    const modal = document.getElementById('purchase-modal');
    
    if (!addBtn || !form || !modal) return;
    
    renderPurchaseTable();
    
    addBtn.addEventListener('click', () => {
        modal.dataset.editIndex = '';
        form.reset();
        openModal('purchase-modal');
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const editIndex = modal.dataset.editIndex;
        const record = {
            supplier: document.getElementById('purchase-supplier').value,
            item: document.getElementById('purchase-item').value,
            quantity: document.getElementById('purchase-quantity').value,
            amount: parseFloat(document.getElementById('purchase-amount').value),
            date: document.getElementById('purchase-date').value,
            status: document.getElementById('purchase-status').value
        };
        
        if (editIndex !== '') {
            purchaseData.update(parseInt(editIndex), record);
        } else {
            purchaseData.add(record);
        }
        
        renderPurchaseTable();
        closeModal(modal);
    });
    
    modal.querySelector('.close-btn')?.addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });
}

function renderPurchaseTable() {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;
    
    const data = purchaseData.load();
    tbody.innerHTML = data.map((record, index) => `
        <tr>
            <td>${record.id || '#PO-2024-' + String(index + 1).padStart(3, '0')}</td>
            <td>${record.supplier}</td>
            <td>${record.item}</td>
            <td>${record.quantity}</td>
            <td>TZS ${parseFloat(record.amount).toLocaleString()}</td>
            <td>${record.date}</td>
            <td><span class="badge badge-${record.status === 'Delivered' ? 'success' : 'warning'}">${record.status}</span></td>
            <td class="table-actions">
                <button onclick="editPurchaseRecord(${index})">Edit</button>
                <button onclick="deletePurchaseRecord(${index})" style="color: #EF4444;">Delete</button>
            </td>
        </tr>
    `).join('');
    
    // Update statistics after table render
    updateAllStatistics();
    console.log('✓ Purchase table rendered with updated statistics');
}

function editPurchaseRecord(index) {
    const data = purchaseData.load();
    const record = data[index];
    const form = document.getElementById('purchase-form');
    const modal = document.getElementById('purchase-modal');
    
    if (form && record) {
        document.getElementById('purchase-supplier').value = record.supplier;
        document.getElementById('purchase-item').value = record.item;
        document.getElementById('purchase-quantity').value = record.quantity;
        document.getElementById('purchase-amount').value = record.amount;
        document.getElementById('purchase-date').value = record.date;
        document.getElementById('purchase-status').value = record.status;
        
        modal.dataset.editIndex = index;
        openModal('purchase-modal');
    }
}

function deletePurchaseRecord(index) {
    if (confirm('Are you sure you want to delete this purchase order?')) {
        purchaseData.delete(index);
        renderPurchaseTable();
    }
}

/**
 * Production Batches Management
 */
const productionData = {
    load: function() {
        return JSON.parse(localStorage.getItem('jensar_production') || '[]');
    },
    save: function(data) {
        localStorage.setItem('jensar_production', JSON.stringify(data));
    },
    add: function(record) {
        const data = this.load();
        record.id = 'BATCH-' + String(data.length + 1).padStart(3, '0');
        data.push(record);
        this.save(data);
        return record;
    },
    delete: function(index) {
        const data = this.load();
        data.splice(index, 1);
        this.save(data);
    },
    update: function(index, record) {
        const data = this.load();
        data[index] = { ...data[index], ...record };
        this.save(data);
    }
};

function initializeProductionModule() {
    const addBtn = document.querySelector('button[aria-label="Start new production batch"]');
    const form = document.getElementById('production-form');
    const modal = document.getElementById('production-modal');
    
    if (!addBtn || !form || !modal) return;
    
    renderProductionTable();
    
    addBtn.addEventListener('click', () => {
        modal.dataset.editIndex = '';
        form.reset();
        openModal('production-modal');
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const editIndex = modal.dataset.editIndex;
        const record = {
            product: document.getElementById('production-product').value,
            materials: document.getElementById('production-materials').value,
            volume: document.getElementById('production-volume').value,
            date: document.getElementById('production-date').value,
            stage: document.getElementById('production-stage').value,
            status: document.getElementById('production-status').value
        };
        
        if (editIndex !== '') {
            productionData.update(parseInt(editIndex), record);
        } else {
            productionData.add(record);
        }
        
        renderProductionTable();
        closeModal(modal);
    });
    
    modal.querySelector('.close-btn')?.addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });
}

function renderProductionTable() {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;
    
    const data = productionData.load();
    tbody.innerHTML = data.map((record, index) => `
        <tr>
            <td>${record.id || '#BATCH-' + String(index + 1).padStart(3, '0')}</td>
            <td>${record.product}</td>
            <td>${record.materials}</td>
            <td>${record.volume}</td>
            <td>${record.date}</td>
            <td><span class="badge badge-purple">${record.stage}</span></td>
            <td><span class="badge badge-${record.status === 'In Progress' ? 'warning' : 'success'}">${record.status}</span></td>
            <td class="table-actions">
                <button onclick="editProductionRecord(${index})">Edit</button>
                <button onclick="deleteProductionRecord(${index})" style="color: #EF4444;">Delete</button>
            </td>
        </tr>
    `).join('');
    
    // Update statistics after table render
    updateAllStatistics();
    console.log('✓ Production table rendered with updated statistics');
}

function editProductionRecord(index) {
    const data = productionData.load();
    const record = data[index];
    const form = document.getElementById('production-form');
    const modal = document.getElementById('production-modal');
    
    if (form && record) {
        document.getElementById('production-product').value = record.product;
        document.getElementById('production-materials').value = record.materials;
        document.getElementById('production-volume').value = record.volume;
        document.getElementById('production-date').value = record.date;
        document.getElementById('production-stage').value = record.stage;
        document.getElementById('production-status').value = record.status;
        
        modal.dataset.editIndex = index;
        openModal('production-modal');
    }
}

function deleteProductionRecord(index) {
    if (confirm('Are you sure you want to delete this production batch?')) {
        productionData.delete(index);
        renderProductionTable();
    }
}

/**
 * Suppliers Management
 */
const supplierData = {
    load: function() {
        return JSON.parse(localStorage.getItem('jensar_suppliers') || '[]');
    },
    save: function(data) {
        localStorage.setItem('jensar_suppliers', JSON.stringify(data));
    },
    add: function(record) {
        const data = this.load();
        data.push(record);
        this.save(data);
        return record;
    },
    delete: function(index) {
        const data = this.load();
        data.splice(index, 1);
        this.save(data);
    },
    update: function(index, record) {
        const data = this.load();
        data[index] = { ...data[index], ...record };
        this.save(data);
    }
};

function initializeSupplierModule() {
    const addBtn = document.querySelector('button[aria-label="Add new supplier"]');
    const form = document.getElementById('supplier-form');
    const modal = document.getElementById('supplier-modal');
    
    if (!addBtn || !form || !modal) return;
    
    renderSupplierTable();
    
    addBtn.addEventListener('click', () => {
        modal.dataset.editIndex = '';
        form.reset();
        openModal('supplier-modal');
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const editIndex = modal.dataset.editIndex;
        const record = {
            name: document.getElementById('supplier-name').value,
            contact: document.getElementById('supplier-contact').value,
            specialty: document.getElementById('supplier-specialty').value,
            status: document.getElementById('supplier-status').value,
            rating: document.getElementById('supplier-rating').value
        };
        
        if (editIndex !== '') {
            supplierData.update(parseInt(editIndex), record);
        } else {
            supplierData.add(record);
        }
        
        renderSupplierTable();
        closeModal(modal);
    });
    
    modal.querySelector('.close-btn')?.addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });
}

function renderSupplierTable() {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;
    
    const data = supplierData.load();
    tbody.innerHTML = data.map((record, index) => `
        <tr>
            <td>${record.name}</td>
            <td>${record.contact}</td>
            <td><span class="badge badge-purple">${record.specialty}</span></td>
            <td><span class="badge badge-${record.status === 'Active' ? 'success' : 'warning'}">${record.status}</span></td>
            <td>${record.rating}</td>
            <td class="table-actions">
                <button onclick="editSupplierRecord(${index})">Edit</button>
                <button onclick="deleteSupplierRecord(${index})" style="color: #EF4444;">Delete</button>
            </td>
        </tr>
    `).join('');
    
    // Update statistics after table render
    updateAllStatistics();
    console.log('✓ Supplier table rendered with updated statistics');
}

function editSupplierRecord(index) {
    const data = supplierData.load();
    const record = data[index];
    const form = document.getElementById('supplier-form');
    const modal = document.getElementById('supplier-modal');
    
    if (form && record) {
        document.getElementById('supplier-name').value = record.name;
        document.getElementById('supplier-contact').value = record.contact;
        document.getElementById('supplier-specialty').value = record.specialty;
        document.getElementById('supplier-status').value = record.status;
        document.getElementById('supplier-rating').value = record.rating;
        
        modal.dataset.editIndex = index;
        openModal('supplier-modal');
    }
}

function deleteSupplierRecord(index) {
    if (confirm('Are you sure you want to delete this supplier?')) {
        supplierData.delete(index);
        renderSupplierTable();
    }
}

/**
 * Initialize All Features
 */
function initializeApp() {
    console.log('Initializing JENSAR Distillery App');
    
    // Core functionality
    initializeTabNavigation();
    initializeOfflineToggle();
    initializeSearch();
    initializeTableAnimations();
    
    // Module initialization based on page
    const pageModules = {
        'sales-form': initializeSalesModule,
        'purchase-form': initializePurchaseModule,
        'production-form': initializeProductionModule,
        'supplier-form': initializeSupplierModule
    };
    
    for (const [moduleId, initFn] of Object.entries(pageModules)) {
        if (document.getElementById(moduleId)) {
            initFn();
        }
    }
    
    // Progressive enhancements
    initializeChart();
    initializeServiceWorker();
    initializeThemeToggle();
    initializeLazyLoading();
    initializeWebVitals();
    initializeKeyboardNavigation();
    updateAllStatistics();
    
    console.log('JENSAR Distillery App initialized');
}

/**
 * ========================================
 * DYNAMIC STATISTICS CALCULATION SYSTEM
 * ========================================
 */

// Sales Statistics
function calculateTodaysSales() {
    const today = new Date().toISOString().split('T')[0];
    const sales = salesData.load();
    const todaySales = sales.filter(s => s.date === today);
    const total = todaySales.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);
    console.log(`✓ Today's Sales: TZS ${total.toLocaleString()}`);
    return total;
}

function calculateMonthlyRevenue() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const sales = salesData.load();
    
    const monthlySales = sales.filter(s => {
        const date = new Date(s.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    const total = monthlySales.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);
    console.log(`✓ Monthly Revenue: TZS ${total.toLocaleString()}`);
    return total;
}

function calculateTotalTransactions() {
    const sales = salesData.load();
    console.log(`✓ Total Transactions: ${sales.length}`);
    return sales.length;
}

// Purchase Statistics
function calculatePendingOrders() {
    const purchases = purchaseData.load();
    const pending = purchases.filter(p => p.status === 'Pending');
    console.log(`✓ Pending Orders: ${pending.length}`);
    return pending.length;
}

function calculateTotalPurchaseCommitment() {
    const purchases = purchaseData.load();
    const total = purchases.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    console.log(`✓ Total Purchase Commitment: TZS ${total.toLocaleString()}`);
    return total;
}

function calculateCompletedOrders() {
    const purchases = purchaseData.load();
    const completed = purchases.filter(p => p.status === 'Delivered');
    console.log(`✓ Completed Orders: ${completed.length}`);
    return completed.length;
}

// Production Statistics
function calculateActiveBatches() {
    const production = productionData.load();
    const active = production.filter(p => p.status === 'In Progress');
    console.log(`✓ Active Batches: ${active.length}`);
    return active.length;
}

function calculateBottledThisMonth() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const production = productionData.load();
    
    const monthlyProduction = production.filter(p => {
        const date = new Date(p.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear && p.status === 'Completed';
    });
    
    const total = monthlyProduction.reduce((sum, p) => sum + (parseFloat(p.volume) || 0), 0);
    const bottles = Math.round(total * 0.75); // Assume ~0.75 bottles per liter
    console.log(`✓ Bottled This Month: ${bottles} bottles (${total}L produced)`);
    return bottles;
}

function calculateAgingInventory() {
    const production = productionData.load();
    const aging = production.filter(p => 
        (p.stage === 'Aging' || p.stage === 'Aging') && p.status === 'In Progress'
    );
    
    const total = aging.reduce((sum, p) => sum + (parseFloat(p.volume) || 0), 0);
    const bottles = Math.round(total * 0.75); // Assume ~0.75 bottles per liter
    console.log(`✓ Aging Inventory: ${bottles} bottles`);
    return bottles;
}

// Reports Statistics
function calculateMonthlyRevenueForReports() {
    return calculateMonthlyRevenue();
}

function calculateTotalInventoryValue() {
    const production = productionData.load();
    const purchases = purchaseData.load();
    
    // Estimate value based on production volume and purchase costs
    const productionValue = production.reduce((sum, p) => {
        return sum + ((parseFloat(p.volume) || 0) * 250); // 250 TZS per liter estimate
    }, 0);
    
    const purchaseValue = purchases.reduce((sum, p) => {
        return sum + (parseFloat(p.amount) || 0);
    }, 0);
    
    const total = productionValue + purchaseValue;
    console.log(`✓ Total Inventory Value: TZS ${total.toLocaleString()}`);
    return total;
}

function calculateProductionEfficiency() {
    const production = productionData.load();
    if (production.length === 0) return 85.0;
    
    const completed = production.filter(p => p.status === 'Completed').length;
    const efficiency = (completed / production.length) * 100;
    const result = Math.min(efficiency, 99.9); // Cap at 99.9%
    
    console.log(`✓ Production Efficiency: ${result.toFixed(1)}%`);
    return result;
}

// Supplier Statistics
function calculateActiveSuppliers() {
    const suppliers = supplierData.load();
    const active = suppliers.filter(s => s.status === 'Active');
    console.log(`✓ Active Suppliers: ${active.length}`);
    return active.length;
}

// Dashboard Statistics
function calculateDashboardTotalInventory() {
    const production = productionData.load();
    const totalVolume = production.reduce((sum, p) => sum + (parseFloat(p.volume) || 0), 0);
    const totalItems = Math.round(totalVolume * 0.75); // Estimate items from liters
    console.log(`✓ Dashboard Total Inventory: ${totalItems} items`);
    return totalItems;
}

function calculateDashboardLowStock() {
    const production = productionData.load();
    // Define low stock threshold (less than 50 liters or less than 37 bottles)
    const lowStockThreshold = 50;
    const lowStockItems = production.filter(p => parseFloat(p.volume) < lowStockThreshold);
    console.log(`✓ Dashboard Low Stock Items: ${lowStockItems.length} items`);
    return lowStockItems.length;
}

function calculateDashboardTodaysSales() {
    const sales = salesData.load();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysSales = sales.filter(s => {
        const saleDate = new Date(s.date);
        saleDate.setHours(0, 0, 0, 0);
        return saleDate.getTime() === today.getTime();
    });
    
    const total = todaysSales.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);
    console.log(`✓ Dashboard Today's Sales: TZS ${total.toLocaleString()}`);
    return total;
}

function calculateDashboardActiveSuppliers() {
    return calculateActiveSuppliers();
}

// Update all statistics on page
function updateAllStatistics() {
    // Dashboard stats
    updateStatElement('dashboardTotalInventory', () => `${calculateDashboardTotalInventory().toLocaleString()} items`);
    updateStatElement('dashboardLowStock', () => `${calculateDashboardLowStock()} items`);
    updateStatElement('dashboardTodaysSales', () => `TZS ${calculateDashboardTodaysSales().toLocaleString()}`);
    updateStatElement('dashboardActiveSuppliers', () => `${calculateDashboardActiveSuppliers()} suppliers`);
    
    // Sales page stats
    updateStatElement('todaysSales', () => `TZS ${calculateTodaysSales().toLocaleString()}`);
    updateStatElement('monthlyRevenue', () => `TZS ${calculateMonthlyRevenue().toLocaleString()}`);
    updateStatElement('totalTransactions', () => calculateTotalTransactions());
    
    // Purchase page stats
    updateStatElement('pendingOrders', () => calculatePendingOrders());
    updateStatElement('totalCommitment', () => `TZS ${calculateTotalPurchaseCommitment().toLocaleString()}`);
    updateStatElement('completedOrders', () => calculateCompletedOrders());
    
    // Production page stats
    updateStatElement('activeBatches', () => calculateActiveBatches());
    updateStatElement('bottledThisMonth', () => `${calculateBottledThisMonth()} bottles`);
    updateStatElement('agingInventory', () => `${calculateAgingInventory()} bottles`);
    
    // Reports page stats
    updateStatElement('reportsMonthlyRevenue', () => `TZS ${calculateMonthlyRevenueForReports().toLocaleString()}`);
    updateStatElement('inventoryValue', () => `TZS ${calculateTotalInventoryValue().toLocaleString()}`);
    updateStatElement('productionEfficiency', () => `${calculateProductionEfficiency().toFixed(1)}%`);
}

// Helper function to update stat elements
function updateStatElement(elementId, valueFunction) {
    try {
        const elements = document.querySelectorAll(`[data-stat="${elementId}"]`);
        if (elements.length > 0) {
            const value = valueFunction();
            elements.forEach(el => {
                el.textContent = value;
            });
            console.log(`Updated ${elementId}: ${value}`);
        }
    } catch (error) {
        console.error(`Error updating stat ${elementId}:`, error);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Export functions for external use
window.JensarApp = {
    initializeChart,
    loadChartLibrary,
    updateOfflineStatus,
    showUpdateNotification,
    openModal,
    closeModal,
    salesData,
    purchaseData,
    productionData,
    supplierData,
    editSalesRecord,
    deleteSalesRecord,
    editPurchaseRecord,
    deletePurchaseRecord,
    editProductionRecord,
    deleteProductionRecord,
    editSupplierRecord,
    deleteSupplierRecord,
    renderSalesTable,
    renderPurchaseTable,
    renderProductionTable,
    renderSupplierTable,
    // Statistics Functions
    calculateTodaysSales,
    calculateMonthlyRevenue,
    calculateTotalTransactions,
    calculatePendingOrders,
    calculateTotalPurchaseCommitment,
    calculateCompletedOrders,
    calculateActiveBatches,
    calculateBottledThisMonth,
    calculateAgingInventory,
    calculateMonthlyRevenueForReports,
    calculateTotalInventoryValue,
    calculateProductionEfficiency,
    calculateActiveSuppliers,
    // Dashboard Statistics
    calculateDashboardTotalInventory,
    calculateDashboardLowStock,
    calculateDashboardTodaysSales,
    calculateDashboardActiveSuppliers,
    updateAllStatistics
};