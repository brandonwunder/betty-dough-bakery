// ============================================
// ORDER STORAGE MODULE
// Handles all localStorage operations and authentication
// ============================================

const OrderStorage = {
  STORAGE_KEY: 'bettydough_orders',
  AUTH_KEY: 'bettydough_session',

  // ===== ORDER CRUD OPERATIONS =====

  /**
   * Save a new order to localStorage
   * @param {Object} orderData - Customer, fulfillment, items, total
   * @returns {Object} Saved order with orderId and timestamp
   */
  saveOrder(orderData) {
    const orders = this.getAllOrders();
    const order = {
      orderId: 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
      timestamp: Date.now(),
      customer: orderData.customer,
      fulfillment: orderData.fulfillment,
      items: orderData.items,
      total: orderData.total,
      completionDate: null,
      status: 'pending'
    };
    orders.push(order);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
    return order;
  },

  /**
   * Retrieve all orders from localStorage
   * @returns {Array} Array of all orders
   */
  getAllOrders() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  /**
   * Get a specific order by ID
   * @param {String} orderId
   * @returns {Object|null} Order or null if not found
   */
  getOrderById(orderId) {
    return this.getAllOrders().find(o => o.orderId === orderId);
  },

  /**
   * Update an order's fields
   * @param {String} orderId
   * @param {Object} updates - Fields to update
   * @returns {Object|null} Updated order or null if not found
   */
  updateOrder(orderId, updates) {
    const orders = this.getAllOrders();
    const index = orders.findIndex(o => o.orderId === orderId);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
      return orders[index];
    }
    return null;
  },

  /**
   * Delete an order from localStorage
   * @param {String} orderId
   */
  deleteOrder(orderId) {
    const orders = this.getAllOrders().filter(o => o.orderId !== orderId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
  },

  // ===== AUTHENTICATION =====

  /**
   * Authenticate user with hardcoded credentials
   * @param {String} username
   * @param {String} password
   * @returns {Boolean} True if credentials match
   */
  login(username, password) {
    if (username === 'bettydough' && password === 'sourdough2025!') {
      const token = 'session-' + Date.now();
      sessionStorage.setItem(this.AUTH_KEY, token);
      return true;
    }
    return false;
  },

  /**
   * Clear the session token
   */
  logout() {
    sessionStorage.removeItem(this.AUTH_KEY);
  },

  /**
   * Check if user is currently authenticated
   * @returns {Boolean}
   */
  isAuthenticated() {
    return !!sessionStorage.getItem(this.AUTH_KEY);
  }
};
