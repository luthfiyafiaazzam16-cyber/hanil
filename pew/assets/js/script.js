// Interaksi tambahan website LPK Hanil.
document.addEventListener('DOMContentLoaded', () => {
  // Filter galeri berdasarkan kategori.
  const galleryGrid = document.querySelector('#galleryGrid');
  if (galleryGrid) {
    const filterButtons = document.querySelectorAll('[data-gallery-filter]');
    const galleryItems = galleryGrid.querySelectorAll('.gallery-item');
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const selected = button.dataset.galleryFilter;
        filterButtons.forEach(item => {
          const active = item === button;
          item.classList.toggle('active', active);
          item.setAttribute('aria-pressed', String(active));
        });
        galleryItems.forEach(item => {
          item.hidden = selected !== 'all' && item.dataset.category !== selected;
        });
      });
    });
  }

  // Testimoni dapat digeser dengan tombol, trackpad, atau swipe.
  const testimonialTrack = document.querySelector('#testimonialTrack');
  if (testimonialTrack) {
    document.querySelectorAll('[data-testimonial-scroll]').forEach(button => {
      button.addEventListener('click', () => {
        const direction = Number(button.dataset.testimonialScroll);
        const slide = testimonialTrack.querySelector('.testimonial-slide');
        const distance = slide ? slide.getBoundingClientRect().width + 20 : testimonialTrack.clientWidth;
        testimonialTrack.scrollBy({ left: direction * distance, behavior: 'smooth' });
      });
    });
  }

  // Popup gambar dan keterangan untuk Galeri serta Program Jepang/Korea.
  const popupImages = document.querySelectorAll(
    '.gallery-card img, .program-card > img'
  );
  if (popupImages.length) {
    const modal = document.createElement('div');
    modal.className = 'image-popup';
    modal.id = 'imagePopup';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-label', 'Pratinjau gambar');
    modal.innerHTML = `
      <div class="image-popup-panel">
        <button class="image-popup-close" type="button" aria-label="Tutup popup">
          <i class="bi bi-x-lg" aria-hidden="true"></i>
        </button>
        <img class="image-popup-photo" src="" alt="">
        <div class="image-popup-caption">
          <h2 class="image-popup-title"></h2>
          <p class="image-popup-description"></p>
        </div>
      </div>`;
    document.body.appendChild(modal);

    const popupPhoto = modal.querySelector('.image-popup-photo');
    const popupTitle = modal.querySelector('.image-popup-title');
    const popupDescription = modal.querySelector('.image-popup-description');
    const closeButton = modal.querySelector('.image-popup-close');
    let previouslyFocused = null;

    const closePopup = () => {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('popup-open');
      if (previouslyFocused) previouslyFocused.focus();
    };

    popupImages.forEach(img => {
      img.classList.add('popup-image-trigger');
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.setAttribute('aria-haspopup', 'dialog');
      img.setAttribute('aria-label', `Perbesar gambar: ${img.alt}`);

      const openPopup = () => {
        const card = img.closest('.gallery-card, .program-card');
        const isGalleryImage = img.closest('.gallery-card') !== null;
        const title = card?.querySelector('figcaption, h3')?.textContent.trim()
          || img.alt || 'Dokumentasi LPK Hanil';
        const description = card?.querySelector('.program-card-body p')?.textContent.trim()
          || card?.querySelector('figcaption small')?.textContent.trim()
          || `Dokumentasi ${title} di LPK Hanil Japanese Korean Center.`;
        popupPhoto.src = img.currentSrc || img.src;
        popupPhoto.alt = img.alt || title;
        modal.querySelector('.image-popup-caption').hidden = isGalleryImage;
        popupTitle.textContent = isGalleryImage ? '' : title;
        popupDescription.textContent = isGalleryImage ? '' : description;
        previouslyFocused = img;
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('popup-open');
        closeButton.focus();
      };

      img.addEventListener('click', openPopup);
      img.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openPopup();
        }
      });
    });

    closeButton.addEventListener('click', closePopup);
    modal.addEventListener('click', event => {
      if (event.target === modal) closePopup();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && modal.classList.contains('show')) closePopup();
    });
  }

});
