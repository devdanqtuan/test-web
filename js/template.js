/**
 * ==========================================================================
 * Arcix - Template Library Script
 * Interactive download and toast notifications
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const downloadButtons = document.querySelectorAll('.template-card .download-button');
  const downloadAllBtn = document.getElementById('btn-download-all');
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  const templateCards = document.querySelectorAll('.template-card');
  let toastTimer = null;

  /**
   * Helper to trigger a browser file download via Blob
   * @param {string} filename 
   * @param {string} content 
   */
  function triggerMockDownload(filename, content) {
    const blob = new Blob([content], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Display toast notification
   * @param {string} message 
   */
  function showToast(message) {
    if (!toast || !toastText) return;

    toastText.textContent = message;
    toast.classList.add('show');

    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3600);
  }

  // Handle individual download button click
  downloadButtons.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const href = btn.getAttribute('href');
      // Cho phép chuyển hướng tự nhiên nếu người dùng gắn link URL thực tế (không phải anchor #)
      if (href && href !== '#' && !href.startsWith('#')) {
        return;
      }
      event.preventDefault();
      const card = btn.closest('.template-card');
      const templateName = btn.dataset.templateName || card.querySelector('.template-name')?.textContent || 'Template';
      const fileName = btn.dataset.filename || `${templateName.replace(/\s+/g, '_')}.skp`;
      const labelSpan = btn.querySelector('.btn-label');
      const originalText = labelSpan ? labelSpan.textContent : 'Download';

      // Visual feedback
      btn.classList.add('is-downloading');
      if (labelSpan) {
        labelSpan.textContent = 'Downloading...';
      }

      showToast(`Đang tải về: ${templateName} (${fileName})`);

      // Trigger actual download (mock sample file)
      setTimeout(() => {
        triggerMockDownload(
          fileName,
          `Arcix Official Architectural Template: ${templateName}\nVersion: 2026.1\nCreated for Arcix SketchUp Workflow Automation.`
        );
      }, 500);

      setTimeout(() => {
        if (labelSpan) {
          labelSpan.textContent = 'Downloaded ✓';
        }
        setTimeout(() => {
          if (labelSpan) labelSpan.textContent = originalText;
          btn.classList.remove('is-downloading');
        }, 1200);
      }, 1600);
    });
  });

  // Handle Download All button click
  if (downloadAllBtn) {
    downloadAllBtn.addEventListener('click', (event) => {
      const href = downloadAllBtn.getAttribute('href');
      // Cho phép chuyển hướng tự nhiên nếu người dùng gắn link URL thực tế
      if (href && href !== '#' && !href.startsWith('#')) {
        return;
      }
      event.preventDefault();
      const labelSpan = downloadAllBtn.querySelector('.btn-label');
      const originalText = labelSpan ? labelSpan.textContent : 'Download All';

      downloadAllBtn.classList.add('is-downloading');
      if (labelSpan) {
        labelSpan.textContent = 'Preparing Package...';
      }

      showToast('Đang đóng gói và tải về toàn bộ 7 Templates (.zip)...');

      // Sequential wave animation across all 7 template cards
      templateCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('pulse-download');
          setTimeout(() => {
            card.classList.remove('pulse-download');
          }, 900);
        }, index * 100);
      });

      // Trigger batch zip download simulation
      setTimeout(() => {
        triggerMockDownload(
          'Arcix_All_7_Templates_Package.zip',
          'Arcix Complete Architecture & Engineering Template Suite (7 Packages)\n- 01 Architecture Standard\n- 02 Interior Design Pro\n- 03 Landscape & Site\n- 04 Structural & Framing\n- 05 MEP Systems\n- 06 Construction Docs\n- 07 Concept & Visuals'
        );
      }, 900);

      setTimeout(() => {
        if (labelSpan) {
          labelSpan.textContent = 'Ready ✓';
        }
        setTimeout(() => {
          if (labelSpan) labelSpan.textContent = originalText;
          downloadAllBtn.classList.remove('is-downloading');
        }, 1500);
      }, 2000);
    });
  }
});
