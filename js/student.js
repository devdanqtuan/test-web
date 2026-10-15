/**
 * ==========================================================================
 * Arcix - Student Verification Email Composer Script
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('btn-toggle-email');
  const composer = document.getElementById('email-composer');
  const copyButtons = document.querySelectorAll('.btn-copy');
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  let toastTimer = null;

  /**
   * Hiển thị toast thông báo
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
    }, 2500);
  }

  // Toggle email composer box
  if (toggleBtn && composer) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isHidden = composer.classList.contains('hidden');

      if (isHidden) {
        composer.classList.remove('hidden');
        composer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        composer.classList.add('hidden');
      }
    });
  }

  // Handle copy buttons
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const targetId = btn.dataset.target;
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      const textToCopy = targetEl.value || targetEl.innerText || targetEl.textContent;
      const labelEl = btn.querySelector('.copy-label');
      const originalText = labelEl ? labelEl.textContent : 'Copy';

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(textToCopy.trim());
        } else {
          // Fallback for older browsers
          const textarea = document.createElement('textarea');
          textarea.value = textToCopy.trim();
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        btn.classList.add('copied');
        if (labelEl) labelEl.textContent = 'Copied! ✓';
        showToast('Copied to clipboard!');

        setTimeout(() => {
          btn.classList.remove('copied');
          if (labelEl) labelEl.textContent = originalText;
        }, 2000);
      } catch (err) {
        console.error('Copy failed:', err);
        showToast('Unable to copy automatically. Please copy manually.');
      }
    });
  });
});
