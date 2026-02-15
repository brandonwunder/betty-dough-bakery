document.addEventListener('DOMContentLoaded', () => {

  // ===== PRODUCT DATA =====
  const PRODUCTS = {
    sourdough: {
      id: 'sourdough',
      name: 'Artisan Sourdough',
      category: 'breads',
      image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=400&h=400&fit=crop&q=75',
      sizes: [
        { label: 'Mini Loaf', price: 5.00 },
        { label: 'Medium Loaf', price: 10.00 },
        { label: 'Large Loaf', price: 20.00 }
      ],
      flavors: [
        'Plain', 'Cheddar Jalape\u00f1o', 'Garlic Parmesan',
        'Brown Sugar Cinnamon', 'Everything Bagel', 'Orange Cranberry',
        'Rosemary', 'Garlic & Herb', 'Italian Parmesan Red Pepper',
        'Croissant', 'Mango Habanero', 'Pepperoni Mozzarella'
      ],
      hasSeasonal: true,
      displayPrice: 'from $5',
      displayWeight: 'Mini / Medium / Large'
    },
    bagels: {
      id: 'bagels',
      name: 'Sourdough Bagels',
      category: 'bagels',
      image: 'https://images.unsplash.com/photo-1585535065945-5cf2e8078156?w=400&h=400&fit=crop&q=75',
      sizes: null,
      price: 15.00,
      unit: '6 pack',
      flavors: [
        'Plain', 'Cheddar Jalape\u00f1o', 'Garlic & Herb',
        'Everything', 'Cinnamon Raisin', 'Onion'
      ],
      hasSeasonal: false,
      displayPrice: '$15.00',
      displayWeight: '6 pack'
    },
    muffins: {
      id: 'muffins',
      name: 'English Muffins',
      category: 'muffins',
      image: 'https://images.unsplash.com/photo-1592569459500-4e9d5e833bb0?w=400&h=400&fit=crop&q=75',
      sizes: null,
      price: 10.00,
      unit: '6 pack',
      flavors: null,
      hasSeasonal: false,
      displayPrice: '$10.00',
      displayWeight: '6 pack'
    },
    breadbowls: {
      id: 'breadbowls',
      name: 'Bread Bowls',
      category: 'breads',
      image: 'https://images.unsplash.com/photo-1587241321027-8a116b630a74?w=400&h=400&fit=crop&q=75',
      sizes: null,
      price: 20.00,
      unit: '4 pack',
      flavors: null,
      hasSeasonal: false,
      displayPrice: '$20.00',
      displayWeight: '4 pack'
    },
    cinnamonrolls: {
      id: 'cinnamonrolls',
      name: 'Cinnamon Rolls',
      category: 'speciality',
      image: 'https://images.unsplash.com/photo-1509365390695-33aee754301f?w=400&h=400&fit=crop&q=75',
      sizes: null,
      price: 20.00,
      unit: '6 pack',
      flavors: null,
      hasSeasonal: false,
      badge: 'Fri Only',
      displayPrice: '$20.00',
      displayWeight: '6 pack'
    },
    crackers: {
      id: 'crackers',
      name: 'Artisan Crackers',
      category: 'speciality',
      image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop&q=75',
      sizes: null,
      price: null,
      flavors: [
        'Plain', 'Everything Bagel', 'Parmesan Red Pepper',
        'Sour Cream & Onion', 'Parmesan & Herb',
        'Cheddar Jalape\u00f1o', 'Rosemary'
      ],
      hasSeasonal: false,
      displayPrice: 'Ask',
      displayWeight: 'Assorted'
    }
  };

  // ===== CART =====
  const cart = [];
  const cartBadge = document.getElementById('cartBadge');

  function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    cartBadge.classList.remove('bump');
    void cartBadge.offsetWidth;
    cartBadge.classList.add('bump');
  }

  // ===== MODAL STATE =====
  const modalState = {
    productId: null,
    selectedSizeIndex: 0,
    selectedFlavor: null,
    quantity: 1
  };

  // ===== MODAL ELEMENTS =====
  const modalOverlay = document.getElementById('productModal');
  const modalContent = modalOverlay.querySelector('.modal-content');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalSizeSection = document.getElementById('modalSizeSection');
  const modalSizeOptions = document.getElementById('modalSizeOptions');
  const modalFlavorSection = document.getElementById('modalFlavorSection');
  const modalFlavorOptions = document.getElementById('modalFlavorOptions');
  const modalQtyValue = document.getElementById('qtyValue');
  const modalPrice = document.getElementById('modalPrice');
  const modalAddBtn = document.getElementById('modalAddToCart');

  // ===== OPEN MODAL =====
  function openModal(productId) {
    const product = PRODUCTS[productId];
    if (!product) return;

    modalState.productId = productId;
    modalState.selectedSizeIndex = 0;
    modalState.selectedFlavor = product.flavors ? product.flavors[0] : null;
    modalState.quantity = 1;

    populateModal(product);

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    stopLenis();

    // Focus close button
    document.getElementById('modalClose').focus();
  }

  // ===== CLOSE MODAL =====
  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    startLenis();

    // Return focus to the trigger button
    const triggerBtn = document.querySelector(
      `.btn-add[data-product-id="${modalState.productId}"]`
    );
    if (triggerBtn) triggerBtn.focus();
  }

  // ===== POPULATE MODAL =====
  function populateModal(product) {
    // Title
    modalTitle.textContent = product.name;

    // Subtitle
    if (product.sizes && product.flavors) {
      modalSubtitle.textContent = 'Select your size and flavor';
    } else if (product.flavors) {
      modalSubtitle.textContent = 'Select your flavor';
    } else if (product.sizes) {
      modalSubtitle.textContent = 'Select your size';
    } else if (product.badge) {
      modalSubtitle.textContent = `${product.unit} \u2014 Available ${product.badge}`;
    } else {
      modalSubtitle.textContent = product.unit ? `${product.unit} \u2014 $${product.price.toFixed(2)}` : 'Add to your order';
    }

    // Size section
    if (product.sizes) {
      modalSizeSection.style.display = '';
      modalSizeOptions.innerHTML = '';
      product.sizes.forEach((size, i) => {
        const btn = document.createElement('button');
        btn.className = 'size-option' + (i === 0 ? ' active' : '');
        btn.dataset.sizeIndex = i;
        btn.innerHTML = `
          <span class="size-option-label">${size.label}</span>
          <span class="size-option-price">$${size.price.toFixed(2)}</span>
        `;
        btn.addEventListener('click', () => selectSize(i));
        modalSizeOptions.appendChild(btn);
      });
    } else {
      modalSizeSection.style.display = 'none';
    }

    // Flavor section
    if (product.flavors) {
      modalFlavorSection.style.display = '';
      modalFlavorOptions.innerHTML = '';
      product.flavors.forEach((flavor, i) => {
        const btn = document.createElement('button');
        btn.className = 'flavor-tag flavor-tag-selectable' + (i === 0 ? ' active' : '');
        btn.dataset.flavor = flavor;
        btn.textContent = flavor;
        btn.addEventListener('click', () => selectFlavor(flavor));
        modalFlavorOptions.appendChild(btn);
      });
      if (product.hasSeasonal) {
        const seasonal = document.createElement('span');
        seasonal.className = 'flavor-tag flavor-tag-seasonal';
        seasonal.textContent = '+ Seasonal Varieties';
        modalFlavorOptions.appendChild(seasonal);
      }
    } else {
      modalFlavorSection.style.display = 'none';
    }

    // Quantity reset
    modalQtyValue.textContent = '1';

    // Update add button text
    if (product.price === null && !product.sizes) {
      modalAddBtn.textContent = 'Add to Inquiry';
    } else {
      modalAddBtn.textContent = 'Add to Cart';
    }

    updateModalPrice();
  }

  // ===== SIZE SELECTION =====
  function selectSize(index) {
    modalState.selectedSizeIndex = index;
    modalSizeOptions.querySelectorAll('.size-option').forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
    updateModalPrice();
  }

  // ===== FLAVOR SELECTION =====
  function selectFlavor(flavor) {
    modalState.selectedFlavor = flavor;
    modalFlavorOptions.querySelectorAll('.flavor-tag-selectable').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.flavor === flavor);
    });
  }

  // ===== UPDATE PRICE DISPLAY =====
  function updateModalPrice() {
    const product = PRODUCTS[modalState.productId];
    let unitPrice;

    if (product.sizes) {
      unitPrice = product.sizes[modalState.selectedSizeIndex].price;
    } else if (product.price !== null) {
      unitPrice = product.price;
    } else {
      modalPrice.textContent = 'Ask for pricing';
      return;
    }

    const total = unitPrice * modalState.quantity;
    modalPrice.textContent = '$' + total.toFixed(2);
  }

  // ===== QUANTITY CONTROLS =====
  document.getElementById('qtyPlus').addEventListener('click', () => {
    modalState.quantity++;
    modalQtyValue.textContent = modalState.quantity;
    updateModalPrice();
  });

  document.getElementById('qtyMinus').addEventListener('click', () => {
    if (modalState.quantity > 1) {
      modalState.quantity--;
      modalQtyValue.textContent = modalState.quantity;
      updateModalPrice();
    }
  });

  // ===== ADD TO CART FROM MODAL =====
  modalAddBtn.addEventListener('click', () => {
    const product = PRODUCTS[modalState.productId];

    const item = {
      productId: modalState.productId,
      name: product.name,
      quantity: modalState.quantity
    };

    if (product.sizes) {
      const size = product.sizes[modalState.selectedSizeIndex];
      item.size = size.label;
      item.unitPrice = size.price;
      item.displayName = product.name + ' - ' + size.label;
    } else {
      item.unitPrice = product.price;
      item.displayName = product.name;
    }

    if (product.flavors && modalState.selectedFlavor) {
      item.flavor = modalState.selectedFlavor;
      item.displayName += ' (' + modalState.selectedFlavor + ')';
    }

    if (product.unit) {
      item.unit = product.unit;
    }

    cart.push(item);
    updateCartBadge();
    closeModal();
  });

  // ===== MODAL CLOSE HANDLERS =====
  document.getElementById('modalClose').addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // ===== FOCUS TRAP =====
  modalContent.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    const focusable = [...modalContent.querySelectorAll(
      'button:not([style*="display: none"]), [href], input, select, textarea'
    )].filter(el => {
      // Exclude elements inside hidden sections
      const parent = el.closest('.modal-section');
      if (parent && parent.style.display === 'none') return false;
      return true;
    });

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // ===== MOBILE MENU =====
  const menuToggle = document.getElementById('menuToggle');
  const menuClose = document.getElementById('menuClose');
  const overlay = document.getElementById('mobileMenuOverlay');

  function openMenu() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeMenu();
  });

  document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ===== PRODUCT CARDS =====
  const productCards = document.querySelectorAll('.product-card');

  // ===== ADD BUTTON -> OPEN MODAL =====
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = btn.dataset.productId;
      if (productId) openModal(productId);
    });
  });

  // ===== VIEW TOGGLE =====
  const viewBtns = document.querySelectorAll('.view-btn');
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ===== LENIS SMOOTH SCROLL =====
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate with GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.lagSmoothing(0);
    }
  }

  // Stop Lenis during modals/drawers
  function stopLenis() { if (lenis) lenis.stop(); }
  function startLenis() { if (lenis) lenis.start(); }

  // ===== GSAP SCROLL ANIMATIONS =====
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // --- Hero Entrance Animation ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      const heroTl = gsap.timeline({ delay: 0.4 });

      // 1. Background image fade + scale (cinematic opening)
      heroTl.from('.hero-bg', {
        scale: 1.2,
        opacity: 0,
        duration: 2,
        ease: 'power2.out'
      }, 0);

      // 2. Ambient blobs materialize
      heroTl.from('.hero-blob', {
        opacity: 0,
        scale: 0.5,
        duration: 2,
        stagger: 0.3,
        ease: 'power2.out'
      }, 0.3);

      // 3. Accent lines grow in
      heroTl.from('.hero-accent-line', {
        scaleY: 0,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        transformOrigin: 'center center'
      }, 0.5);

      // 4. Glass panel appears
      heroTl.from('.hero-text-group', {
        opacity: 0,
        scale: 0.97,
        duration: 0.8,
        ease: 'power2.out'
      }, 0.6);

      // 5. Logo fade up with enhanced depth
      heroTl.from('.hero-logo', {
        y: 50,
        opacity: 0,
        scale: 0.8,
        duration: 1.2,
        ease: 'power3.out'
      }, 0.5);

      // 6. CAPS title with letter-spacing expansion
      heroTl.from('.hero-title .title-caps', {
        y: 20,
        opacity: 0,
        letterSpacing: '0.1em',
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.5');

      // 7. Script title — SplitText character reveal
      const heroScript = document.querySelector('.hero-title .title-script');
      if (typeof SplitText !== 'undefined' && heroScript) {
        const heroSplit = new SplitText(heroScript, { type: 'chars' });
        heroTl.from(heroSplit.chars, {
          y: 80,
          opacity: 0,
          rotateX: -90,
          scale: 0.5,
          stagger: 0.04,
          duration: 0.7,
          ease: 'back.out(1.7)',
          onComplete: function() {
            // Revert SplitText (merge spans back to plain text)
            // so shimmer background-clip works on the parent element
            heroSplit.revert();
            gsap.delayedCall(0.5, function() {
              heroScript.classList.add('shimmer-active');
            });
          }
        }, '-=0.3');
      } else if (heroScript) {
        heroTl.from(heroScript, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: function() {
            heroScript.classList.add('shimmer-active');
          }
        }, '-=0.3');
      }

      // 8. Description — word-by-word SplitText fade
      const heroDesc = document.querySelector('.hero-description');
      if (typeof SplitText !== 'undefined' && heroDesc) {
        const descSplit = new SplitText(heroDesc, { type: 'words' });
        heroTl.from(descSplit.words, {
          opacity: 0,
          y: 15,
          stagger: 0.015,
          duration: 0.4,
          ease: 'power2.out'
        }, '-=0.3');
      } else {
        heroTl.from('.hero-description', {
          y: 20,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out'
        }, '-=0.3');
      }

      // 9. CTA Button scale-up
      heroTl.from('.hero-cta', {
        scale: 0.85,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(2.5)'
      }, '-=0.2');

      // 10. Meta items + divider + scroll hint
      heroTl.from('.hero-meta-item, .hero-divider', {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.2');

      heroTl.from('.hero-scroll-hint', {
        opacity: 0,
        y: 10,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.2');

      // --- Hero Scroll Parallax ---
      gsap.to('.hero-bg', {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      gsap.to('.hero-content', {
        y: -40,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      gsap.to('.hero-accent-line', {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: '60% top',
          end: 'bottom top',
          scrub: true
        }
      });

    } else {
      // Reduced motion: make everything visible instantly
      gsap.set([
        '.hero-bg', '.hero-blob', '.hero-accent-line',
        '.hero-text-group', '.hero-logo',
        '.hero-title .title-caps', '.hero-title .title-script',
        '.hero-description', '.hero-cta',
        '.hero-meta-item', '.hero-divider', '.hero-scroll-hint'
      ], { opacity: 1, y: 0, scale: 1, rotateX: 0 });
    }

    // --- Hero Mouse-Follow Glow (desktop only) ---
    (function() {
      var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (isTouchDevice) return;

      var hero = document.querySelector('.hero');
      if (!hero) return;

      var rafId = null;
      hero.addEventListener('mousemove', function(e) {
        if (rafId) return;
        rafId = requestAnimationFrame(function() {
          var rect = hero.getBoundingClientRect();
          var x = ((e.clientX - rect.left) / rect.width) * 100;
          var y = ((e.clientY - rect.top) / rect.height) * 100;
          hero.style.setProperty('--mouse-x', x + '%');
          hero.style.setProperty('--mouse-y', y + '%');
          rafId = null;
        });
      });

      hero.addEventListener('mouseleave', function() {
        hero.style.setProperty('--mouse-x', '50%');
        hero.style.setProperty('--mouse-y', '50%');
      });
    })();

    // --- Schedule Section: Premium Entrance ---
    if (!prefersReducedMotion) {
      var schedTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.schedule-section',
          start: 'top 78%',
        }
      });

      // Phase 1: Header cascade
      schedTl.from('.schedule-label', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
      });

      schedTl.from('.schedule-section .section-title .title-caps', {
        y: 15,
        opacity: 0,
        letterSpacing: '0.1em',
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.2');

      // SplitText char reveal for "Schedule" (rotateY flip — distinct from hero's rotateX)
      var scheduleScript = document.querySelector('.schedule-section .section-title .title-script');
      if (typeof SplitText !== 'undefined' && scheduleScript) {
        var schedSplit = new SplitText(scheduleScript, { type: 'chars' });
        schedTl.from(schedSplit.chars, {
          opacity: 0,
          y: 40,
          rotateY: -90,
          stagger: 0.04,
          duration: 0.6,
          ease: 'back.out(1.5)',
          onComplete: function() {
            schedSplit.revert();
            gsap.delayedCall(0.8, function() {
              scheduleScript.classList.add('shimmer-active');
            });
          }
        }, '-=0.3');
      }

      // Phase 1b: Schedule picture slides in from right with bounce
      schedTl.from('.schedule-picture-wrapper', {
        x: 100,
        opacity: 0,
        rotation: 15,
        duration: 1,
        ease: 'back.out(1.5)'
      }, '-=0.3');

      // Phase 2: Intro text word reveal
      var schedIntro = document.querySelector('.schedule-intro');
      if (typeof SplitText !== 'undefined' && schedIntro) {
        var introSplit = new SplitText(schedIntro, { type: 'words' });
        schedTl.from(introSplit.words, {
          opacity: 0,
          y: 12,
          stagger: 0.015,
          duration: 0.35,
          ease: 'power2.out'
        }, '-=0.2');
      } else {
        schedTl.from('.schedule-intro', {
          y: 20,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out'
        }, '-=0.2');
      }

      // Phase 3: Divider grows from center
      schedTl.from('.schedule-divider', {
        scaleX: 0,
        duration: 0.6,
        ease: 'power3.out',
        transformOrigin: 'center center'
      }, '-=0.1');

      // Phase 4: Regular cards bounce in with playful rotation
      var regularCards = document.querySelectorAll('.schedule-card:not(.schedule-card-featured)');
      schedTl.from(regularCards, {
        y: 80,
        opacity: 0,
        scale: 0.9,
        rotation: -3,
        filter: 'blur(6px)',
        duration: 1.2,
        stagger: 0.15,
        ease: 'elastic.out(1, 0.6)'
      }, '-=0.2');

      // Phase 4a: Day badges animate in sequentially (wave effect)
      var dayBadges = document.querySelectorAll('.schedule-card .schedule-day');
      schedTl.from(dayBadges, {
        scale: 0,
        opacity: 0,
        rotation: 180,
        duration: 0.6,
        stagger: 0.05,
        ease: 'back.out(2)'
      }, '-=0.3');

      // Phase 5: Featured card enters from right with more flair
      schedTl.from('.schedule-card-featured', {
        x: 80,
        opacity: 0,
        scale: 0.9,
        filter: 'blur(8px)',
        duration: 1,
        ease: 'power3.out'
      }, '-=0.5');

      // Phase 5a: Featured card gets continuous subtle pulse after entrance
      schedTl.to('.schedule-card-featured', {
        scale: 1.02,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      }, '-=0.5');

      // Phase 6: Badge pops in
      schedTl.from('.schedule-badge', {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'back.out(3)'
      }, '-=0.3');

      // Phase 6b: Availability text fades in
      schedTl.from('.schedule-availability', {
        y: 10,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
      }, '-=0.4');

      // Phase 7: Ambient blobs fade in
      schedTl.from('.schedule-blob', {
        opacity: 0,
        scale: 0.5,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power2.out'
      }, '-=0.8');

    } else {
      // Reduced motion: make schedule elements visible
      gsap.set([
        '.schedule-label', '.schedule-section .section-title',
        '.schedule-intro', '.schedule-divider',
        '.schedule-card', '.schedule-card-featured',
        '.schedule-badge', '.schedule-blob'
      ], { opacity: 1, y: 0, x: 0, scale: 1, filter: 'blur(0px)' });
    }

    // --- Product Cards Stagger ---
    gsap.from('.product-card', {
      y: 50,
      opacity: 0,
      filter: 'blur(4px)',
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.product-grid',
        start: 'top 82%',
      }
    });

    // (Schedule header animation now part of schedTl timeline above)

    // --- Shop Header ---
    gsap.from('.shop-header', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.shop',
        start: 'top 80%',
      }
    });

    // --- Info Banner ---
    gsap.from('.info-banner', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.info-banner',
        start: 'top 85%',
      }
    });

    // --- About Section ---
    gsap.from('.about-content .section-title', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top 75%',
      }
    });

    // Owner photo clip-path reveal
    gsap.from('.about-owner-photo', {
      clipPath: 'inset(0 100% 0 0)',
      duration: 1.2,
      ease: 'power3.inOut',
      scrollTrigger: {
        trigger: '.about-owner',
        start: 'top 75%',
      }
    });

    // About text paragraphs stagger
    gsap.from('.about-text', {
      y: 25,
      opacity: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about-owner-text',
        start: 'top 80%',
      }
    });

    // --- Footer Columns Stagger ---
    gsap.from('.footer-grid > *', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.site-footer',
        start: 'top 88%',
      }
    });

    // --- Section Title Script Character Reveals ---
    if (typeof SplitText !== 'undefined') {
      document.querySelectorAll('.section-title .title-script').forEach(el => {
        // Skip hero and schedule (they have custom animations)
        if (el.closest('.hero')) return;
        if (el.closest('.schedule-section')) return;

        const split = new SplitText(el, { type: 'chars' });
        gsap.from(split.chars, {
          y: 30,
          opacity: 0,
          stagger: 0.03,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el.closest('.section-title'),
            start: 'top 85%',
          },
          onComplete: function() {
            split.revert();
            gsap.delayedCall(0.5, function() {
              el.classList.add('shimmer-active');
            });
          }
        });
      });
    }
  }

  // ===== VANILLA TILT =====
  if (typeof VanillaTilt !== 'undefined') {
    // Product cards — 3D tilt with glare
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) {
      VanillaTilt.init(document.querySelectorAll('.product-card'), {
        max: 8,
        speed: 400,
        glare: true,
        'max-glare': 0.15,
        scale: 1.02,
      });

      // Schedule cards — enhanced tilt with scale
      VanillaTilt.init(document.querySelectorAll('.schedule-card'), {
        max: 6,
        speed: 400,
        glare: true,
        'max-glare': 0.12,
        scale: 1.02,
      });
    }
  }

  // ===== CART DRAWER =====
  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  const cartDrawerItems = document.getElementById('cartDrawerItems');
  const cartDrawerFooter = document.getElementById('cartDrawerFooter');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartSubtotal = document.getElementById('cartSubtotal');

  function openCartDrawer() {
    renderCartDrawer();
    cartDrawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    stopLenis();
    document.getElementById('cartDrawerClose').focus();
  }

  function closeCartDrawer() {
    cartDrawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
    startLenis();
  }

  function renderCartDrawer() {
    // Remove old item elements (keep empty state div)
    cartDrawerItems.querySelectorAll('.cart-item').forEach(el => el.remove());

    if (cart.length === 0) {
      cartEmpty.style.display = '';
      cartDrawerFooter.style.display = 'none';
      return;
    }

    cartEmpty.style.display = 'none';
    cartDrawerFooter.style.display = '';

    let subtotal = 0;

    cart.forEach((item, index) => {
      const lineTotal = (item.unitPrice || 0) * item.quantity;
      subtotal += lineTotal;

      const div = document.createElement('div');
      div.className = 'cart-item';

      let details = [];
      if (item.flavor) details.push(item.flavor);
      if (item.size) details.push(item.size);
      if (item.unit) details.push(item.unit);

      div.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          ${details.length ? `<div class="cart-item-details">${details.join(' \u2022 ')}</div>` : ''}
          <div class="cart-item-controls">
            <button class="cart-item-qty-btn" data-action="decrease" data-index="${index}" aria-label="Decrease quantity">&minus;</button>
            <span class="cart-item-qty">${item.quantity}</span>
            <button class="cart-item-qty-btn" data-action="increase" data-index="${index}" aria-label="Increase quantity">+</button>
            <button class="cart-item-remove" data-index="${index}">Remove</button>
          </div>
        </div>
        <div class="cart-item-price">
          ${item.unitPrice ? `<div class="cart-item-unit-price">$${item.unitPrice.toFixed(2)} ea</div>` : ''}
          <div class="cart-item-line-total">${item.unitPrice ? '$' + lineTotal.toFixed(2) : 'TBD'}</div>
        </div>
      `;

      cartDrawerItems.appendChild(div);
    });

    cartSubtotal.textContent = '$' + subtotal.toFixed(2);
  }

  // Event delegation for cart item actions
  cartDrawerItems.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action], .cart-item-remove');
    if (!btn) return;

    const index = parseInt(btn.dataset.index, 10);
    if (isNaN(index)) return;

    if (btn.classList.contains('cart-item-remove')) {
      cart.splice(index, 1);
    } else if (btn.dataset.action === 'increase') {
      cart[index].quantity++;
    } else if (btn.dataset.action === 'decrease') {
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
      } else {
        cart.splice(index, 1);
      }
    }

    updateCartBadge();
    renderCartDrawer();
  });

  // Open cart drawer on cart icon click
  document.getElementById('cartBtnNav').addEventListener('click', openCartDrawer);

  // Close cart drawer
  document.getElementById('cartDrawerClose').addEventListener('click', closeCartDrawer);
  cartDrawerOverlay.addEventListener('click', (e) => {
    if (e.target === cartDrawerOverlay) closeCartDrawer();
  });

  // Continue Shopping button
  document.getElementById('cartContinueBtn').addEventListener('click', closeCartDrawer);

  // View Menu button in empty state
  document.getElementById('cartEmptyShopBtn').addEventListener('click', () => {
    closeCartDrawer();
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
  });

  // Escape closes cart drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartDrawerOverlay.classList.contains('active')) {
      closeCartDrawer();
    }
  });

  // ===== CHECKOUT =====
  const checkoutOverlay = document.getElementById('checkoutOverlay');
  const checkoutSummaryItems = document.getElementById('checkoutSummaryItems');
  const checkoutSubtotalEl = document.getElementById('checkoutSubtotal');
  const checkoutTotalEl = document.getElementById('checkoutTotal');
  const checkoutDeliveryFeeEl = document.getElementById('checkoutDeliveryFee');
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  const deliveryAddressFields = document.getElementById('deliveryAddressFields');

  function openCheckout() {
    closeCartDrawer();
    renderCheckoutSummary();
    checkoutOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    stopLenis();
  }

  function closeCheckout() {
    checkoutOverlay.classList.remove('active');
    document.body.style.overflow = '';
    startLenis();
  }

  function renderCheckoutSummary() {
    checkoutSummaryItems.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
      const lineTotal = (item.unitPrice || 0) * item.quantity;
      subtotal += lineTotal;

      const div = document.createElement('div');
      div.className = 'checkout-summary-item';
      div.innerHTML = `
        <div>
          <div class="checkout-summary-item-name">${item.displayName || item.name}</div>
          <div class="checkout-summary-item-qty">Qty: ${item.quantity}${item.unit ? ' (' + item.unit + ')' : ''}</div>
        </div>
        <span class="checkout-summary-item-price">${item.unitPrice ? '$' + lineTotal.toFixed(2) : 'TBD'}</span>
      `;
      checkoutSummaryItems.appendChild(div);
    });

    checkoutSubtotalEl.textContent = '$' + subtotal.toFixed(2);
    checkoutTotalEl.textContent = '$' + subtotal.toFixed(2);
  }

  // Fulfillment toggle (pickup / delivery)
  document.querySelectorAll('input[name="fulfillment"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'delivery') {
        deliveryAddressFields.style.display = '';
        checkoutDeliveryFeeEl.textContent = 'TBD';
      } else {
        deliveryAddressFields.style.display = 'none';
        checkoutDeliveryFeeEl.textContent = 'Free';
      }
    });
  });

  // Form validation
  function validateCheckoutForm() {
    const name = document.getElementById('checkoutName').value.trim();
    const email = document.getElementById('checkoutEmail').value.trim();
    const phone = document.getElementById('checkoutPhone').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let valid = true;

    // Clear previous errors
    document.querySelectorAll('.form-input').forEach(input => input.classList.remove('invalid'));
    document.querySelectorAll('.form-error').forEach(err => err.classList.remove('visible'));

    if (!name) { markInvalid('checkoutName', 'Name is required'); valid = false; }
    if (!email || !emailRegex.test(email)) { markInvalid('checkoutEmail', 'Valid email is required'); valid = false; }
    if (!phone) { markInvalid('checkoutPhone', 'Phone number is required'); valid = false; }

    // If delivery, validate address
    const isDelivery = document.querySelector('input[name="fulfillment"]:checked').value === 'delivery';
    if (isDelivery) {
      if (!document.getElementById('checkoutAddress').value.trim()) { markInvalid('checkoutAddress', 'Address is required'); valid = false; }
      if (!document.getElementById('checkoutCity').value.trim()) { markInvalid('checkoutCity', 'City is required'); valid = false; }
      if (!document.getElementById('checkoutZip').value.trim()) { markInvalid('checkoutZip', 'ZIP is required'); valid = false; }
    }

    return valid;
  }

  function markInvalid(inputId, message) {
    const input = document.getElementById(inputId);
    input.classList.add('invalid');
    let errorEl = input.parentElement.querySelector('.form-error');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'form-error';
      input.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }

  // Enable/disable Place Order based on required fields
  document.querySelectorAll('#checkoutName, #checkoutEmail, #checkoutPhone').forEach(input => {
    input.addEventListener('input', () => {
      const name = document.getElementById('checkoutName').value.trim();
      const email = document.getElementById('checkoutEmail').value.trim();
      const phone = document.getElementById('checkoutPhone').value.trim();
      placeOrderBtn.disabled = !(name && email && phone);
    });
  });

  // Place Order
  placeOrderBtn.addEventListener('click', () => {
    if (!validateCheckoutForm()) return;

    // Stripe not connected yet
    alert('Thank you for your order! Stripe payment integration coming soon. We will contact you to confirm your order.');

    // Clear cart
    cart.length = 0;
    updateCartBadge();
    closeCheckout();

    // Reset form
    document.getElementById('checkoutName').value = '';
    document.getElementById('checkoutEmail').value = '';
    document.getElementById('checkoutPhone').value = '';
    deliveryAddressFields.style.display = 'none';
    document.querySelector('input[name="fulfillment"][value="pickup"]').checked = true;
    placeOrderBtn.disabled = true;
  });

  // Checkout navigation
  document.getElementById('cartCheckoutBtn').addEventListener('click', () => {
    if (cart.length === 0) return;
    openCheckout();
  });

  document.getElementById('checkoutBack').addEventListener('click', () => {
    closeCheckout();
    setTimeout(() => openCartDrawer(), 150);
  });

  // Escape closes checkout
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && checkoutOverlay.classList.contains('active')) {
      closeCheckout();
    }
  });

});
