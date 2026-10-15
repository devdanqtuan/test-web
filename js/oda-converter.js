/**
 * ==========================================================================
 * Arcix - ODA File Converter Script
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const downloadButtons = document.querySelectorAll('.download-button');
  const toast = document.getElementById('toast');
  let toastTimer = null;

  /**
   * Hiển thị thông báo Toast tương tác mượt mà
   * @param {string} message Nội dung thông báo
   */
  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // Xử lý sự kiện khi người dùng bấm nút tải về
  downloadButtons.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const osName = btn.dataset.os || 'ứng dụng';
      const originalText = btn.querySelector('span')?.textContent || 'Tải về';
      const labelSpan = btn.querySelector('span');

      // Phản hồi giao diện người dùng tức thì
      showToast(`Đang chuyển hướng tải về ODA File Converter (${osName})...`);

      if (labelSpan) {
        labelSpan.textContent = 'Đang tải...';
        btn.style.pointerEvents = 'none';

        setTimeout(() => {
          labelSpan.textContent = originalText;
          btn.style.pointerEvents = '';
        }, 2000);
      }
    });
  });
});
