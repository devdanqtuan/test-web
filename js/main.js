/**
 * ==========================================================================
 * Scribblit - Main Application Script
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
      const targetId = link.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        event.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ==========================================================================
// 8. ARCHITECTURAL BLUEPRINT CALLOUTS & SCROLL ANIMATION
// ==========================================================================

/**
 * Hiệu ứng cuộn chuột kiến trúc:
 * - Ảnh hero gốc (hero-mono) giữ nguyên kích thước toàn cảnh (không thu nhỏ)
 * - Khi cuộn xuống, chữ hero ở giữa mờ dần và biến mất
 * - Xuất hiện các chấm tròn (hotspots) tại các vị trí kết cấu trên ảnh gốc
 * - Nối các chấm tròn tới 5 bản vẽ kiến trúc chi tiết bằng các đường nét đứt (dashed lines)
 * - 5 góc nhìn:
 *   1. arc3-top: Mặt bằng mái (Top Plan)
 *   2. arc5-scection-left: Mặt cắt bên trái (Section Left)
 *   3. arc2-back: Mặt sau (Back Elevation)
 *   4. arc8-view-finish-to-ceiling: Góc nhìn từ sàn lên trần (Finish to Ceiling)
 *   5. arc1-front: Mặt đứng chính diện (Front Elevation)
 */
function initHeroScrollAnimation() {
  const hero = document.querySelector('.hero');
  const stage = document.getElementById('hero-stage');
  const heroContent = document.getElementById('hero-content');
  const heroOverlay = document.getElementById('hero-overlay');

  if (!hero || !stage || !heroContent || !heroOverlay) return;

  const cards = document.querySelectorAll('.callout-card');

  let currentProgress = 0;
  let targetProgress = 0;
  let isRunning = false;

  function calculateTargetProgress() {
    const rect = hero.getBoundingClientRect();
    const scrollDistance = window.innerHeight * 1.8;
    if (scrollDistance <= 0) return 0;
    return Math.max(0, Math.min(1, -rect.top / scrollDistance));
  }

  function render(p) {
    // 1. Ẩn chữ hero khi bắt đầu cuộn
    const textOpacity = Math.max(0, 1 - p * 4);
    heroContent.style.opacity = textOpacity.toFixed(3);
    heroContent.style.transform = `translateY(${(-40 * Math.min(1, p * 3)).toFixed(1)}px)`;
    heroContent.style.pointerEvents = textOpacity < 0.1 ? 'none' : 'auto';

    // 2. Lớp phủ đen mờ dần để lộ rõ ảnh công trình kiến trúc
    heroOverlay.style.opacity = (0.55 * textOpacity + 0.15).toFixed(3);

    // 3. Tiến trình xuất hiện các thẻ bản vẽ chi tiết
    const calloutP = Math.max(0, Math.min(1, (p - 0.12) / 0.72));

    // Hiển thị các thẻ bản vẽ chi tiết với hiệu ứng trượt nhẹ
    cards.forEach((card, index) => {
      const cardP = Math.max(0, Math.min(1, (calloutP - index * 0.05) / 0.75));
      card.style.opacity = cardP.toFixed(3);
      card.style.pointerEvents = cardP > 0.3 ? 'auto' : 'none';

      // Trượt nhẹ từ phía ngoài vào vị trí
      const isLeft = card.classList.contains('callout-card-section-left') || card.classList.contains('callout-card-back') || card.classList.contains('callout-card-top');
      const shiftX = isLeft ? -25 * (1 - cardP) : 25 * (1 - cardP);
      card.style.transform = `translate3d(${shiftX.toFixed(1)}px, 0, 0)`;
    });
  }

  function tick() {
    const diff = targetProgress - currentProgress;
    if (Math.abs(diff) > 0.0005) {
      currentProgress += diff * 0.12; // Damping lerp mượt mà
      render(currentProgress);
      requestAnimationFrame(tick);
    } else {
      currentProgress = targetProgress;
      render(currentProgress);
      isRunning = false;
    }
  }

  function update() {
    targetProgress = calculateTargetProgress();
    if (!isRunning) {
      isRunning = true;
      requestAnimationFrame(tick);
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });

  // Khởi tạo ban đầu
  targetProgress = calculateTargetProgress();
  currentProgress = targetProgress;
  render(currentProgress);
}

// ==========================================================================
// 9. LIGHTBOX PREVIEW CHO BẢN VẼ KIẾN TRÚC
// ==========================================================================

function initDrawingModal() {
  const modal = document.getElementById('drawing-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');
  const closeBtn = document.querySelector('.drawing-modal-close');
  const backdrop = document.querySelector('.drawing-modal-backdrop');
  const cards = document.querySelectorAll('.callout-card');

  if (!modal || !modalImg || !modalCaption) return;

  function openModal(src, caption) {
    modalImg.src = src;
    modalCaption.textContent = caption;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.querySelector('h4');
      const code = card.querySelector('.callout-code');
      if (img && title) {
        const caption = `${code ? code.textContent + ' — ' : ''}${title.textContent}`;
        openModal(img.src, caption);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// ==========================================================================
// 10. FEATURES SCROLL SHOWCASE ANIMATION
// ==========================================================================

/**
 * Điều khiển xuất hiện các khung chữ tính năng đè lên ảnh feature.jpg khi cuộn chuột
 */
function initFeaturesScrollAnimation() {
  const section = document.getElementById('features');
  const overlay = document.getElementById('features-tags-overlay');
  if (!section || !overlay) return;

  const tags = overlay.querySelectorAll('.feature-tag-box');
  if (!tags.length) return;

  function updateFeatures() {
    const rect = section.getBoundingClientRect();
    const scrollDistance = section.offsetHeight - window.innerHeight;
    if (scrollDistance <= 0) {
      tags.forEach((tag) => tag.classList.add('active'));
      return;
    }

    // Tiến trình cuộn qua khối features từ 0 (bắt đầu) đến 1 (kết thúc)
    const progress = Math.max(0, Math.min(1, -rect.top / scrollDistance));
    const total = tags.length;

    tags.forEach((tag, idx) => {
      // Phân bổ đều các mốc cuộn chuột để từng khung chữ hiện lên lần lượt
      const threshold = 0.08 + (idx / total) * 0.72;
      if (progress >= threshold) {
        tag.classList.add('active');
      } else {
        tag.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateFeatures, { passive: true });
  window.addEventListener('resize', updateFeatures, { passive: true });
  updateFeatures();
}

// ==========================================================================
// 11. KHỞI CHẠY ỨNG DỤNG (INITIALIZATION)
// ==========================================================================
function init() {
  initStylePicker();
  initToolbarActions();
  initHeroScrollAnimation();
  initFeaturesScrollAnimation();
  initDrawingModal();
  initScrollReveal();
  initSmoothScroll();
  applyStyle();
}

// Chạy script sau khi DOM sẵn sàng
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

