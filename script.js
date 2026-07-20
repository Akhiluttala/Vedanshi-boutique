document.addEventListener('DOMContentLoaded', function () {

  /* ---------------- Footer year ---------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Sticky header shrink ---------------- */
  var header = document.getElementById('siteHeader');
  function onScrollHeader() {
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------------- Mobile nav toggle ---------------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', function () {
    var isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------- Scroll reveal ---------------- */
  var revealEls = document.querySelectorAll('.reveal, .collection-card');
  revealEls.forEach(function (el) { el.classList.add('reveal'); });

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------------- Gallery: build grid + lightbox ----------------
     Replace these filenames with your own photos in css/images-1/
     (or keep the names and just drop matching files in that folder). */
  var galleryItems = [
    { src: 'css/gallery/bridalblowse.png', alt: 'Bridal blouse with Maggam work' },
    { src: 'css/gallery/details.png', alt: 'Designer blouse detail' },
    { src: 'css/gallery/kurti.png', alt: 'Kurti Dress' },
    { src: 'css/gallery/handemb.png', alt: 'Hand embroidery close-up' },
    { src: 'css/gallery/lehanga.png', alt: 'Festive lehenga stitching' },
    { src: 'css/gallery/dress.png', alt: 'Alteration and fitting session' },
    { src: 'css/gallery/anerkali.png', alt: 'Custom Anarkali dress' },
    { src: 'css/gallery/saree.png', alt: 'sarees' }
  ];

  var galleryGrid = document.getElementById('galleryGrid');
  galleryItems.forEach(function (item, i) {
    var fig = document.createElement('div');
    fig.className = 'gallery-item reveal';
    fig.setAttribute('data-index', i);
    fig.innerHTML =
      '<img src="' + item.src + '" alt="' + item.alt + '" loading="lazy">' +
      '<span class="gi-label">' + item.alt + '</span>';
    galleryGrid.appendChild(fig);
  });

  var newGalleryEls = galleryGrid.querySelectorAll('.reveal');
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io2.unobserve(entry.target); }
      });
    }, { threshold: 0.1 });
    newGalleryEls.forEach(function (el) { io2.observe(el); });
  } else {
    newGalleryEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------------- Lightbox ---------------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');
  var currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    var item = galleryItems[currentIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  function showRelative(delta) {
    currentIndex = (currentIndex + delta + galleryItems.length) % galleryItems.length;
    var item = galleryItems[currentIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
  }

  galleryGrid.addEventListener('click', function (e) {
    var el = e.target.closest('.gallery-item');
    if (!el) return;
    openLightbox(parseInt(el.getAttribute('data-index'), 10));
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', function () { showRelative(-1); });
  lightboxNext.addEventListener('click', function () { showRelative(1); });
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showRelative(-1);
    if (e.key === 'ArrowRight') showRelative(1);
  });

  /* ---------------- Reviews carousel ---------------- */
  var reviewCards = document.querySelectorAll('.review-card');
  var progressFill = document.querySelector('.review-progress-fill');
  var prevBtn = document.querySelector('.review-nav.prev');
  var nextBtn = document.querySelector('.review-nav.next');
  var activeReview = 0;
  var reviewTimer;

  function goToReview(index) {
    reviewCards[activeReview].classList.remove('active');
    activeReview = (index + reviewCards.length) % reviewCards.length;
    reviewCards[activeReview].classList.add('active');
    if (progressFill) progressFill.style.width = ((activeReview + 1) / reviewCards.length * 100) + '%';
  }
  function startReviewAutoplay() {
    clearInterval(reviewTimer);
    if (prefersReducedMotion) return;
    reviewTimer = setInterval(function () { goToReview(activeReview + 1); }, 5500);
  }
  if (prevBtn) prevBtn.addEventListener('click', function () { goToReview(activeReview - 1); startReviewAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goToReview(activeReview + 1); startReviewAutoplay(); });
  goToReview(0);
  startReviewAutoplay();

  /* ---------------- Contact form validation ---------------- */
  var form = document.getElementById('contactForm');
  var toast = document.getElementById('successToast');

  function setError(fieldId, message) {
    var input = document.getElementById(fieldId);
    var errorEl = document.getElementById('err-' + fieldId);
    if (message) {
      input.classList.add('invalid');
      errorEl.textContent = message;
    } else {
      input.classList.remove('invalid');
      errorEl.textContent = '';
    }
  }

  function validateForm() {
    var valid = true;
    var fullName = document.getElementById('fullName').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var email = document.getElementById('email').value.trim();
    var message = document.getElementById('message').value.trim();

    if (fullName.length < 2) { setError('fullName', 'Please enter your full name.'); valid = false; }
    else setError('fullName', '');

    if (!/^[0-9]{10}$/.test(phone.replace(/\D/g, ''))) { setError('phone', 'Enter a valid 10-digit phone number.'); valid = false; }
    else setError('phone', '');

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('email', 'Enter a valid email address.'); valid = false; }
    else setError('email', '');

    if (message.length < 5) { setError('message', 'Tell us a little about what you need.'); valid = false; }
    else setError('message', '');

    return valid;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm()) return;
      form.reset();
      toast.classList.add('is-visible');
      setTimeout(function () { toast.classList.remove('is-visible'); }, 4200);
    });
  }

});