/**
 * ==========================================================================
 * Arcix - Main Application Script
 * ==========================================================================
 * Quản lý tương tác giao diện:
 * 1. Style Presets (Thay đổi font & kiểu chữ trực tiếp trên Hero)
 * 2. Toolbar Formatting (Bold, Italic, Underline, Strikethrough, Align, Theme)
 * 3. Scroll Reveal Animation (Hiệu ứng xuất hiện khi cuộn trang)
 * 4. Smooth Scrolling (Cuộn mượt mà khi bấm anchor links)
 * ==========================================================================
 */

// ==========================================================================
// 1. CẤU HÌNH & TRẠNG THÁI (CONFIG & STATE)
// ==========================================================================

/** Danh sách các preset kiểu chữ cho Hero Subtitle */
const PRESETS = [
  { name: 'Style 01', desc: 'Clean Sans', className: 'sans' },
  { name: 'Style 02', desc: 'Display', className: 'display' },
  { name: 'Style 03', desc: 'Monospace', className: 'mono' },
  { name: 'Style 04', desc: 'Serif', className: 'serif' },
  { name: 'Style 05', desc: 'Uppercase', className: 'upper' }
];

/** Lưu trữ trạng thái định dạng văn bản hiện tại */
const state = {
  activePresetIndex: 0,
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  list: false,
  align: false,
  dark: true
};

// ==========================================================================
// 2. DOM ELEMENTS
// ==========================================================================
const DOM = {
  heroSubtitle: document.querySelector('#hero-subtitle'),
  subtitleSpan: document.querySelector('#hero-subtitle span'),
  styleLabel: document.querySelector('#style-label'),
  styleDesc: document.querySelector('#style-description'),
  styleMenu: document.querySelector('#style-menu'),
  styleButton: document.querySelector('#style-button'),
  formatButtons: document.querySelectorAll('[data-format]'),
  revealElements: document.querySelectorAll('.reveal'),
  anchorLinks: document.querySelectorAll('a[href^="#"]')
};

// ==========================================================================
// 3. CORE LOGIC - ÁP DỤNG ĐỊNH DẠNG (APPLY STYLES)
// ==========================================================================

/**
 * Cập nhật giao diện phụ đề hero theo trạng thái hiện tại trong `state`
 */
function applyStyle() {
  if (!DOM.subtitleSpan || !DOM.heroSubtitle) return;

  const currentPreset = PRESETS[state.activePresetIndex];

  // 1. Cập nhật nhãn và mô tả trên nút dropdown
  if (DOM.styleLabel) DOM.styleLabel.textContent = currentPreset.name;
  if (DOM.styleDesc) DOM.styleDesc.textContent = currentPreset.desc;

  // 2. Đổi font preset (class tương ứng: sans, display, mono, serif, upper)
  DOM.subtitleSpan.className = currentPreset.className;

  // 3. Áp dụng các định dạng chữ
  DOM.subtitleSpan.style.fontWeight = state.bold ? '700' : '400';
  DOM.subtitleSpan.style.fontStyle = state.italic ? 'italic' : 'normal';

  const decorations = [];
  if (state.underline) decorations.push('underline');
  if (state.strike) decorations.push('line-through');
  DOM.subtitleSpan.style.textDecoration = decorations.join(' ') || 'none';

  // 4. Áp dụng căn chỉnh lề và kiểu danh sách
  DOM.heroSubtitle.style.textAlign = state.align ? 'left' : 'center';
  DOM.heroSubtitle.style.listStyle = state.list ? 'disc' : 'none';

  // 5. Đồng bộ trạng thái active (highlight) trên các nút toolbar
  DOM.formatButtons.forEach((button) => {
    const key = button.dataset.format;
    if (key === 'theme') {
      button.classList.toggle('active', !state.dark);
    } else if (state[key] !== undefined) {
      button.classList.toggle('active', Boolean(state[key]));
    }
  });
}

// ==========================================================================
// 4. STYLE PICKER DROPDOWN
// ==========================================================================

/**
 * Khởi tạo menu dropdown chọn kiểu chữ (Preset Picker)
 */
function initStylePicker() {
  if (!DOM.styleMenu || !DOM.styleButton) return;

  DOM.styleMenu.innerHTML = '';

  // Tạo các nút chọn preset trong menu
  PRESETS.forEach((preset, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('role', 'option');

    const isSelected = index === state.activePresetIndex;
    button.className = isSelected ? 'selected' : '';
    button.innerHTML = `
      <span>
        <b>${preset.name}</b>
        <small>${preset.desc}</small>
      </span>
      ${isSelected ? '<span>●</span>' : ''}
    `;

    button.addEventListener('click', (event) => {
      event.stopPropagation();
      state.activePresetIndex = index;
      toggleMenu(false);
      initStylePicker(); // Render lại để cập nhật dấu tick '●'
      applyStyle();
    });

    DOM.styleMenu.appendChild(button);
  });

  // Ban đầu ẩn menu
  DOM.styleMenu.hidden = true;
  DOM.styleButton.setAttribute('aria-expanded', 'false');

  // Bật/tắt menu khi click vào nút
  DOM.styleButton.addEventListener('click', (event) => {
    event.stopPropagation();
    const shouldOpen = DOM.styleMenu.hidden;
    toggleMenu(shouldOpen);
  });

  // Đóng dropdown khi click ra ngoài màn hình
  document.addEventListener('click', (event) => {
    if (!DOM.styleMenu.hidden && !DOM.styleMenu.contains(event.target) && !DOM.styleButton.contains(event.target)) {
      toggleMenu(false);
    }
  });
}

/**
 * Đóng hoặc mở menu dropdown
 * @param {boolean} isOpen
 */
function toggleMenu(isOpen) {
  DOM.styleMenu.hidden = !isOpen;
  DOM.styleButton.setAttribute('aria-expanded', String(isOpen));
}

// ==========================================================================
// 5. TOOLBAR FORMATTING ACTIONS
// ==========================================================================

/**
 * Lắng nghe sự kiện click trên các nút định dạng trong Toolbar
 */
function initToolbarActions() {
  DOM.formatButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const formatKey = button.dataset.format;

      if (formatKey === 'theme') {
        // Chuyển đổi Dark / Light Theme
        state.dark = !state.dark;
        document.documentElement.classList.toggle('light', !state.dark);
        const favicon = document.getElementById('favicon');
        if (favicon) {
          favicon.href = state.dark ? 'logo/Logo_Light.png' : 'logo/Logo_Dark.png';
        }
      } else if (state[formatKey] !== undefined) {
        // Chuyển đổi trạng thái định dạng (bold, italic, strike, underline, list, align)
        state[formatKey] = !state[formatKey];
      }

      applyStyle();
    });
  });
}

// ==========================================================================
// 6. SCROLL REVEAL ANIMATIONS
// ==========================================================================

/**
 * Hiệu ứng xuất hiện mượt mà khi người dùng cuộn đến từng phần tử
 */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    // Fallback cho trình duyệt cũ không hỗ trợ IntersectionObserver
    DOM.revealElements.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  DOM.revealElements.forEach((element) => observer.observe(element));
}

// ==========================================================================
// 7. SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================================================

/**
 * Xử lý cuộn trang mượt mà khi nhấp vào liên kết điều hướng nội bộ (#id)
 */
function initSmoothScroll() {
  DOM.anchorLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || !href.startsWith('#')) return;

      const targetId = href.split('?')[0];
      try {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          event.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });

          // Tự động căn giữa gói Pro trên mobile khi bấm BUY NOW hoặc điều hướng tới #pricing
          if (targetId === '#pricing' && window.innerWidth <= 768) {
            setTimeout(() => {
              const pricingGrid = document.querySelector('.pricing-grid');
              const proCard = pricingGrid?.querySelector('.price-card.featured');
              if (pricingGrid && proCard) {
                const targetScroll = proCard.offsetLeft - (pricingGrid.clientWidth - proCard.clientWidth) / 2;
                pricingGrid.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
              }
            }, 350);
          }
        }
      } catch (err) {
        // Fallback gracefully
      }
    });
  });
}

// ==========================================================================
// 8. HỆ THỐNG QUẢN LÝ BẢNG GIÁ & CHUYỂN ĐỔI CHU KỲ (PRICING SYSTEM)
// ==========================================================================

const PRICING_DATA = {
  // 1 THÁNG
  '1': {
    periodText: '/month',
    standard: { price: '$8.99', original: '$12.99' },
    pro: { price: '$17.99', original: '$24.99' },       // Chốt $17.99
    team: {
      '3': { price: '$44.99', original: '$59.99' },     // ~$15.00/người/tháng (Rẻ hơn 3 x $17.99 = $53.97)
      '5': { price: '$69.99', original: '$99.99' },     // ~$14.00/người/tháng
      '10': { price: '$119.99', original: '$179.99' },  // ~$12.00/người/tháng
      'more': { price: 'Custom', original: '' }
    }
  },

  // 12 THÁNG (BEST VALUE)
  '12': {
    periodText: '/year',
    standard: { price: '$59.99', original: '$89.99' },  // Giữ làm decoy nếu muốn
    pro: {
      price: '$119.99',
      original: '$199.99',                             // Neo giá gốc $199.99 để tạo độ hời
    },
    team: {
      '3': { price: '$289.99', original: '$399' },     // ~$96.66/người/năm (Rẻ hơn 3 x $119.99 = $359.97)
      '5': { price: '$429.99', original: '$599' },     // ~$86.00/người/năm
      '10': { price: '$749.99', original: '$1,099' },  // ~$75.00/người/năm
      'more': { price: 'Custom', original: '' }
    }
  }
};

let currentBillingPeriod = '12';
let currentTeamDevices = '3';

/**
 * Cập nhật đồng bộ tất cả giá tiền, giá gạch đỏ và link của cả 3 gói
 */
function updateAllPricing() {
  const periodData = PRICING_DATA[currentBillingPeriod];
  if (!periodData) return;

  const periodText = periodData.periodText;

  // 1. CẬP NHẬT GÓI STANDARD
  const stdPrice = document.getElementById('standard-price-val');
  const stdOrig = document.getElementById('standard-original-val');
  const stdPeriod = document.getElementById('standard-period-val');
  const stdBtn = document.getElementById('standard-action-btn');

  if (stdPrice) {
    stdPrice.classList.remove('price-pop');
    void stdPrice.offsetWidth;
    stdPrice.textContent = periodData.standard.price;
    stdPrice.classList.add('price-pop');
  }
  if (stdOrig) stdOrig.textContent = periodData.standard.original;
  if (stdPeriod) stdPeriod.textContent = periodText;
  if (stdBtn) stdBtn.setAttribute('href', `#cta?plan=standard&period=${currentBillingPeriod}`);

  // 2. CẬP NHẬT GÓI PRO
  const proPrice = document.getElementById('pro-price-val');
  const proOrig = document.getElementById('pro-original-val');
  const proPeriod = document.getElementById('pro-period-val');
  const proBtn = document.getElementById('pro-action-btn');

  if (proPrice) {
    proPrice.classList.remove('price-pop');
    void proPrice.offsetWidth;
    proPrice.textContent = periodData.pro.price;
    proPrice.classList.add('price-pop');
  }
  if (proOrig) proOrig.textContent = periodData.pro.original;
  if (proPeriod) proPeriod.textContent = periodText;
  if (proBtn) proBtn.setAttribute('href', `#cta?plan=pro&period=${currentBillingPeriod}`);

  // 3. CẬP NHẬT GÓI TEAM
  const teamPrice = document.getElementById('ultra-price-val');
  const teamOrig = document.getElementById('ultra-original-val');
  const teamPeriod = document.getElementById('ultra-period-val');
  const teamFeature = document.getElementById('ultra-feature-devices');
  const teamBtn = document.getElementById('ultra-contact-btn');

  const teamData = periodData.team[currentTeamDevices] || periodData.team['3'];
  const isCustom = currentTeamDevices === 'more';

  if (teamPrice) {
    teamPrice.classList.remove('price-pop');
    void teamPrice.offsetWidth;
    teamPrice.textContent = teamData.price;
    teamPrice.classList.add('price-pop');
  }

  if (teamOrig) {
    if (teamData.original && !isCustom) {
      teamOrig.style.display = '';
      teamOrig.classList.remove('price-pop');
      void teamOrig.offsetWidth;
      teamOrig.textContent = teamData.original;
      teamOrig.classList.add('price-pop');
    } else {
      teamOrig.style.display = 'none';
    }
  }

  if (teamPeriod) {
    teamPeriod.style.display = isCustom ? 'none' : '';
    teamPeriod.textContent = periodText;
  }

  const teamLabels = {
    '3': 'Multi-device license (3 PCs)',
    '5': 'Multi-device license (5 PCs)',
    '10': 'Multi-device license (up to 10 PCs)',
    'more': 'Multi-device license (>10 PCs / Custom)'
  };
  if (teamFeature && teamLabels[currentTeamDevices]) {
    teamFeature.textContent = teamLabels[currentTeamDevices];
  }

  if (teamBtn) {
    if (isCustom) {
      teamBtn.innerHTML = 'Contact Sales <b>→</b>';
      teamBtn.setAttribute('href', '#cta?plan=team&devices=custom');
    } else {
      teamBtn.innerHTML = 'Get Started <b>→</b>';
      teamBtn.setAttribute('href', `#cta?plan=team&devices=${currentTeamDevices}&period=${currentBillingPeriod}`);
    }
  }
}

/**
 * Khởi tạo bộ chọn chu kỳ thanh toán và chọn số thiết bị gói Team
 */
function initPricingSystem() {
  const billingButtons = document.querySelectorAll('.billing-btn');
  const deviceSelect = document.getElementById('device-select');

  // Lắng nghe sự kiện click trên các nút chọn tháng (1, 6, 12 tháng)
  billingButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const period = button.dataset.period;
      if (!period || period === currentBillingPeriod) return;

      currentBillingPeriod = period;

      billingButtons.forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-checked', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-checked', 'true');

      updateAllPricing();
    });
  });

  // Lắng nghe sự kiện đổi số thiết bị trên gói Team
  if (deviceSelect) {
    deviceSelect.addEventListener('change', () => {
      currentTeamDevices = deviceSelect.value || '3';
      updateAllPricing();
    });
  }
}

// ==========================================================================
// 9. BỘ CHUYỂN ĐỔI DANH MỤC ECOSYSTEM (PLUGIN / TEMPLATE)
// ==========================================================================
function initEcosystemSwitcher() {
  const buttons = document.querySelectorAll('.ecosystem-btn');
  const pluginView = document.getElementById('ecosystem-plugin-view');
  const templateView = document.getElementById('ecosystem-template-view');

  if (!buttons.length || !pluginView || !templateView) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (!tab) return;

      buttons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      if (tab === 'plugin') {
        templateView.style.display = 'none';
        pluginView.style.display = '';
        pluginView.classList.remove('ecosystem-view');
        void pluginView.offsetWidth;
        pluginView.classList.add('ecosystem-view');
      } else if (tab === 'template') {
        pluginView.style.display = 'none';
        templateView.style.display = '';
        templateView.classList.remove('ecosystem-view');
        void templateView.offsetWidth;
        templateView.classList.add('ecosystem-view');
      }
    });
  });

  // Tương tác tải xuống trực tiếp file template mẫu
  const downloadBtns = templateView.querySelectorAll('.template-download-btn');
  downloadBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const filename = btn.dataset.filename || 'Template.skp';
      const templateName = btn.dataset.templateName || 'Template';

      try {
        const blob = new Blob(
          [`Arcix Official Architectural Template: ${templateName}\nVersion: 2026.1\nCreated for Arcix SketchUp Workflow Automation.`],
          { type: 'application/octet-stream' }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        const oldHtml = btn.innerHTML;
        btn.innerHTML = 'Downloaded ✓';
        setTimeout(() => {
          btn.innerHTML = oldHtml;
        }, 1600);
      } catch (err) {
        // Fallback navigation
        window.location.href = btn.getAttribute('href');
      }
    });
  });
}

// ==========================================================================
// 10. TƯƠNG TÁC XEM CHI TIẾT TÍNH NĂNG (FEATURE PREVIEW LIGHTBOX)
// ==========================================================================
function initFeatureLightbox() {
  const modal = document.getElementById('feature-modal');
  if (!modal) return;

  const modalImg = document.getElementById('feature-modal-img');
  const modalTitle = document.getElementById('feature-modal-title');
  const modalDesc = document.getElementById('feature-modal-desc');
  const closeBtn = document.getElementById('feature-modal-close');
  const cards = document.querySelectorAll('.feature-card');

  function openModal(card) {
    const fullImg = card.dataset.fullImg;
    const title = card.dataset.title;
    const tag = card.dataset.tag;
    const desc = card.dataset.desc;

    if (modalImg) {
      modalImg.src = fullImg;
      modalImg.alt = title;
    }
    if (modalTitle) {
      modalTitle.innerHTML = `${title} <span id="feature-modal-tag" class="feature-tag">${tag}</span>`;
    }
    if (modalDesc) {
      modalDesc.textContent = desc;
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => openModal(card));
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// ==========================================================================
// 11. ĐIỀU HƯỚNG VUỐT BẢNG GIÁ TRÊN MOBILE (MẶC ĐỊNH GÓI PRO)
// ==========================================================================
function initMobilePricingSwipe() {
  const pricingGrid = document.querySelector('.pricing-grid');
  if (!pricingGrid) return;

  const cards = pricingGrid.querySelectorAll('.price-card');
  const proCard = pricingGrid.querySelector('.price-card.featured');
  const dots = document.querySelectorAll('.pricing-dot');

  function centerProCard(instant = false) {
    if (window.innerWidth > 768 || !proCard) return;
    const targetScroll = proCard.offsetLeft - (pricingGrid.clientWidth - proCard.clientWidth) / 2;
    pricingGrid.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: instant ? 'instant' : 'smooth'
    });
    updateActiveDot(1);
  }

  function updateActiveDot(index) {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  // Chuyển card khi click vào dot
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      if (cards[idx]) {
        const targetScroll = cards[idx].offsetLeft - (pricingGrid.clientWidth - cards[idx].clientWidth) / 2;
        pricingGrid.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
        updateActiveDot(idx);
      }
    });
  });

  // Đồng bộ dot khi người dùng vuốt trên màn hình
  let isScrolling;
  pricingGrid.addEventListener('scroll', () => {
    clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
      if (window.innerWidth > 768) return;
      const scrollCenter = pricingGrid.scrollLeft + pricingGrid.clientWidth / 2;
      let closestIndex = 1;
      let minDiff = Infinity;

      cards.forEach((card, idx) => {
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const diff = Math.abs(scrollCenter - cardCenter);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = idx;
        }
      });

      updateActiveDot(closestIndex);
    }, 40);
  }, { passive: true });

  // Mặc định căn giữa gói Pro khi vào trang trên mobile
  if (window.innerWidth <= 768) {
    setTimeout(() => centerProCard(true), 80);
    setTimeout(() => centerProCard(true), 350);
  }

  // Tự động căn lại khi xoay thiết bị
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth <= 768) {
        centerProCard(true);
      }
    }, 150);
  });
}

// ==========================================================================
// 12. HỖ TRỢ KÉO CHUỘT VUỐT FEATURES TRÊN MÀN HÌNH NHỎ (DRAG-TO-SCROLL)
// ==========================================================================
function initFeaturesDragScroll() {
  const grid = document.querySelector('.features-grid');
  if (!grid) return;

  let isDown = false;
  let startX;
  let scrollLeft;
  let hasDragged = false;

  grid.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    if (window.innerWidth > 768) return;
    isDown = true;
    hasDragged = false;
    startX = e.pageX - grid.offsetLeft;
    scrollLeft = grid.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    if (!isDown) return;
    isDown = false;
    setTimeout(() => {
      hasDragged = false;
    }, 50);
  });

  grid.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const x = e.pageX - grid.offsetLeft;
    const walk = (x - startX) * 1.3;
    if (Math.abs(walk) > 6) {
      hasDragged = true;
    }
    grid.scrollLeft = scrollLeft - walk;
  });

  grid.addEventListener(
    'click',
    (e) => {
      if (hasDragged) {
        e.stopPropagation();
        e.preventDefault();
      }
    },
    true
  );
}

// ==========================================================================
// 13. KHỞI CHẠY ỨNG DỤNG (INITIALIZATION)
// ==========================================================================
function init() {
  initStylePicker();
  initToolbarActions();
  initScrollReveal();
  initSmoothScroll();
  initPricingSystem();
  initEcosystemSwitcher();
  initFeatureLightbox();
  initMobilePricingSwipe();
  initFeaturesDragScroll();
  applyStyle();
}

// Chạy script sau khi DOM sẵn sàng
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

