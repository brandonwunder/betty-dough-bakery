// ============================================
// ADMIN DASHBOARD
// Order management and calendar view
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ===== AUTHENTICATION CHECK =====
  if (!OrderStorage.isAuthenticated()) {
    window.location.href = 'index.html';
    return;
  }

  // ===== STATE =====
  let currentView = 'orders';
  let currentFilter = 'all';
  let allOrders = [];
  let calendar = null;

  // ===== INIT =====
  function init() {
    OrderStorage.initMockOrders();
    loadOrders();
    updateStats();
    renderOrders();
    setupEventListeners();
  }

  // ===== LOAD ORDERS =====
  function loadOrders() {
    allOrders = OrderStorage.getAllOrders();
    allOrders.sort((a, b) => b.timestamp - a.timestamp); // Newest first
  }

  // ===== UPDATE STATS =====
  function updateStats() {
    const pending = allOrders.filter(o => o.status === 'pending').length;
    const inProgress = allOrders.filter(o => o.status === 'in-progress').length;
    const completed = allOrders.filter(o => o.status === 'completed').length;

    document.getElementById('statPending').textContent = pending;
    document.getElementById('statInProgress').textContent = inProgress;
    document.getElementById('statCompleted').textContent = completed;
  }

  // ===== RENDER ORDERS =====
  function renderOrders() {
    const ordersGrid = document.getElementById('ordersGrid');
    const ordersEmpty = document.getElementById('ordersEmpty');
    const searchQuery = document.getElementById('searchOrders').value.toLowerCase();

    let filtered = allOrders;

    // Filter by status
    if (currentFilter !== 'all') {
      filtered = filtered.filter(o => o.status === currentFilter);
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(o => {
        return o.orderId.toLowerCase().includes(searchQuery) ||
               o.customer.name.toLowerCase().includes(searchQuery) ||
               o.customer.email.toLowerCase().includes(searchQuery);
      });
    }

    ordersGrid.innerHTML = '';

    if (filtered.length === 0) {
      ordersEmpty.style.display = 'flex';
      return;
    }

    ordersEmpty.style.display = 'none';

    filtered.forEach(order => {
      const card = createOrderCard(order);
      ordersGrid.appendChild(card);
    });
  }

  // ===== CREATE ORDER CARD =====
  function createOrderCard(order) {
    const div = document.createElement('div');
    div.className = 'order-card';
    div.dataset.orderId = order.orderId;

    const date = new Date(order.timestamp);
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit'
    });

    const statusColors = {
      'pending': '#e8922a',
      'in-progress': '#3b82f6',
      'completed': '#10b981',
      'cancelled': '#ef4444'
    };

    const completionDateStr = order.completionDate
      ? new Date(order.completionDate).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        })
      : 'Not set';

    div.innerHTML = `
      <div class="order-card-header">
        <div class="order-id">${order.orderId}</div>
        <span class="order-status" style="background-color: ${statusColors[order.status]}20; color: ${statusColors[order.status]}">
          ${order.status.replace('-', ' ')}
        </span>
      </div>

      <div class="order-customer">
        <div class="order-customer-name">${order.customer.name}</div>
        <div class="order-customer-contact">${order.customer.email}</div>
        <div class="order-customer-contact">${order.customer.phone}</div>
      </div>

      <div class="order-fulfillment">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          ${order.fulfillment.method === 'pickup'
            ? '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>'
            : '<rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle>'}
        </svg>
        <span>${order.fulfillment.method === 'pickup' ? 'Pickup' : 'Delivery'}</span>
      </div>

      <div class="order-items-summary">
        ${order.items.length} item${order.items.length !== 1 ? 's' : ''} • $${order.total.toFixed(2)}
      </div>

      <div class="order-meta">
        <div class="order-date">
          <span class="order-date-label">Ordered:</span>
          <span>${dateStr} at ${timeStr}</span>
        </div>
        <div class="order-completion">
          <span class="order-date-label">Completion:</span>
          <span>${completionDateStr}</span>
        </div>
      </div>

      <div class="order-actions">
        <button class="btn btn-sm btn-secondary view-details-btn" data-order-id="${order.orderId}">
          View Details
        </button>
        <button class="btn btn-sm btn-secondary set-date-btn" data-order-id="${order.orderId}">
          Set Date
        </button>
        <select class="status-select" data-order-id="${order.orderId}">
          <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="in-progress" ${order.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
          <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
          <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </div>
    `;

    return div;
  }

  // ===== INIT CALENDAR =====
  function initCalendar() {
    if (calendar) {
      calendar.destroy();
    }

    const calendarEl = document.getElementById('calendar');

    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek'
      },
      height: 'auto',
      events: getCalendarEvents(),
      eventClick: function(info) {
        const orderId = info.event.id;
        showOrderDetail(orderId);
      }
    });

    calendar.render();
  }

  // ===== GET CALENDAR EVENTS =====
  function getCalendarEvents() {
    return allOrders
      .filter(o => o.completionDate)
      .map(order => ({
        id: order.orderId,
        title: `${order.customer.name} - $${order.total.toFixed(2)}`,
        start: new Date(order.completionDate),
        backgroundColor: getStatusColor(order.status),
        borderColor: getStatusColor(order.status)
      }));
  }

  function getStatusColor(status) {
    const colors = {
      'pending': '#e8922a',
      'in-progress': '#3b82f6',
      'completed': '#10b981',
      'cancelled': '#ef4444'
    };
    return colors[status] || '#777777';
  }

  // ===== SHOW ORDER DETAIL =====
  function showOrderDetail(orderId) {
    const order = allOrders.find(o => o.orderId === orderId);
    if (!order) return;

    const modal = document.getElementById('orderDetailModal');
    const content = document.getElementById('orderDetailContent');

    const date = new Date(order.timestamp);
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit'
    });

    let itemsHTML = order.items.map(item => `
      <div class="detail-item">
        <div>
          <div class="detail-item-name">${item.displayName || item.name}</div>
          ${item.flavor ? `<div class="detail-item-meta">Flavor: ${item.flavor}</div>` : ''}
          ${item.size ? `<div class="detail-item-meta">Size: ${item.size}</div>` : ''}
        </div>
        <div class="detail-item-price">
          <div>Qty: ${item.quantity}</div>
          <div>$${((item.unitPrice || 0) * item.quantity).toFixed(2)}</div>
        </div>
      </div>
    `).join('');

    content.innerHTML = `
      <div class="order-detail-header">
        <h2>${order.orderId}</h2>
        <span class="order-status" style="background-color: ${getStatusColor(order.status)}20; color: ${getStatusColor(order.status)}">
          ${order.status.replace('-', ' ')}
        </span>
      </div>

      <div class="detail-section">
        <h3>Customer</h3>
        <p><strong>${order.customer.name}</strong></p>
        <p>${order.customer.email}</p>
        <p>${order.customer.phone}</p>
      </div>

      <div class="detail-section">
        <h3>Fulfillment</h3>
        <p><strong>${order.fulfillment.method === 'pickup' ? 'Pickup' : 'Delivery'}</strong></p>
        ${order.fulfillment.address ? `
          <p>${order.fulfillment.address.street}</p>
          <p>${order.fulfillment.address.city}, ${order.fulfillment.address.state} ${order.fulfillment.address.zip}</p>
        ` : ''}
      </div>

      <div class="detail-section">
        <h3>Items</h3>
        ${itemsHTML}
      </div>

      <div class="detail-total">
        <span>Total:</span>
        <span>$${order.total.toFixed(2)}</span>
      </div>

      <div class="detail-section">
        <h3>Timeline</h3>
        <p><strong>Ordered:</strong> ${dateStr}</p>
        ${order.completionDate ? `<p><strong>Completion Date:</strong> ${new Date(order.completionDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>` : ''}
      </div>

      <div class="detail-actions">
        <button class="btn btn-primary" id="detailSetDate" data-order-id="${order.orderId}">
          ${order.completionDate ? 'Change' : 'Set'} Completion Date
        </button>
        <button class="btn btn-secondary" id="detailDelete" data-order-id="${order.orderId}">
          Delete Order
        </button>
      </div>
    `;

    modal.classList.add('active');

    // Setup modal-specific event listeners
    document.getElementById('detailSetDate').addEventListener('click', () => {
      setCompletionDate(orderId);
    });

    document.getElementById('detailDelete').addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this order?')) {
        OrderStorage.deleteOrder(orderId);
        loadOrders();
        updateStats();
        renderOrders();
        if (calendar) calendar.refetchEvents();
        closeOrderDetailModal();
      }
    });
  }

  function closeOrderDetailModal() {
    document.getElementById('orderDetailModal').classList.remove('active');
  }

  // ===== SET COMPLETION DATE =====
  function setCompletionDate(orderId) {
    const order = allOrders.find(o => o.orderId === orderId);
    const currentDate = order.completionDate
      ? new Date(order.completionDate).toISOString().split('T')[0]
      : '';

    const dateStr = prompt('Enter completion date (YYYY-MM-DD):', currentDate);
    if (!dateStr) return;

    const date = new Date(dateStr + 'T00:00:00');
    if (isNaN(date.getTime())) {
      alert('Invalid date format. Please use YYYY-MM-DD');
      return;
    }

    OrderStorage.updateOrder(orderId, { completionDate: date.getTime() });
    loadOrders();
    renderOrders();
    if (calendar) {
      calendar.refetchEvents();
    }

    // Refresh modal if open
    const modal = document.getElementById('orderDetailModal');
    if (modal.classList.contains('active')) {
      showOrderDetail(orderId);
    }
  }

  // ===== EVENT LISTENERS =====
  function setupEventListeners() {
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
      OrderStorage.logout();
      window.location.href = 'index.html';
    });

    // View switching
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        switchView(view);
      });
    });

    // Status filter
    document.getElementById('statusFilter').addEventListener('change', (e) => {
      currentFilter = e.target.value;
      renderOrders();
    });

    // Search
    document.getElementById('searchOrders').addEventListener('input', () => {
      renderOrders();
    });

    // Event delegation for order cards
    document.getElementById('ordersGrid').addEventListener('click', (e) => {
      const viewBtn = e.target.closest('.view-details-btn');
      const dateBtn = e.target.closest('.set-date-btn');

      if (viewBtn) {
        const orderId = viewBtn.dataset.orderId;
        showOrderDetail(orderId);
      }

      if (dateBtn) {
        const orderId = dateBtn.dataset.orderId;
        setCompletionDate(orderId);
      }
    });

    // Status change
    document.getElementById('ordersGrid').addEventListener('change', (e) => {
      if (e.target.classList.contains('status-select')) {
        const orderId = e.target.dataset.orderId;
        const newStatus = e.target.value;
        OrderStorage.updateOrder(orderId, { status: newStatus });
        loadOrders();
        updateStats();
        renderOrders();
        if (calendar) calendar.refetchEvents();
      }
    });

    // Close modal
    document.getElementById('orderDetailClose').addEventListener('click', closeOrderDetailModal);
    document.getElementById('orderDetailModal').addEventListener('click', (e) => {
      if (e.target.id === 'orderDetailModal') closeOrderDetailModal();
    });

    // Close modal with Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('orderDetailModal');
        if (modal.classList.contains('active')) {
          closeOrderDetailModal();
        }
      }
    });
  }

  // ===== SWITCH VIEW =====
  function switchView(view) {
    currentView = view;

    // Update nav buttons
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });

    // Update view sections
    document.querySelectorAll('.admin-view').forEach(section => {
      section.classList.remove('active');
    });

    if (view === 'orders') {
      document.getElementById('ordersView').classList.add('active');
    } else if (view === 'calendar') {
      document.getElementById('calendarView').classList.add('active');
      if (!calendar) {
        initCalendar();
      } else {
        calendar.refetchEvents();
      }
    }
  }

  // ===== START =====
  init();

});
