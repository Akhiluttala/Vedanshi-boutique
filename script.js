document.addEventListener('DOMContentLoaded', function () {

  /* ============ Footer year ============ */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============ Sticky header shrink ============ */
  var header = document.getElementById('siteHeader');
  function onScrollHeader() {
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ============ Mobile nav toggle ============ */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  
  function closeNav() {
    mainNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', function () {
    var isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close nav when link clicked
  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  // Close nav on outside click (for mobile)
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-wrap') && mainNav.classList.contains('is-open')) {
      closeNav();
    }
  });

  // Close nav on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
      closeNav();
    }
  });

  /* ============ Scroll reveal ============ */
  var revealEls = document.querySelectorAll('.reveal, .collection-card');
  revealEls.forEach(function (el) { 
    el.classList.add('reveal'); 
  });

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    revealEls.forEach(function (el) { 
      el.classList.add('is-visible'); 
    });
  } else if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.15, 
      rootMargin: '0px 0px -60px 0px' 
    });
    
    revealEls.forEach(function (el) { 
      io.observe(el); 
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    revealEls.forEach(function (el) { 
      el.classList.add('is-visible'); 
    });
  }

  /* ============ Gallery: build grid + lightbox ============ */
  var galleryItems = [
    { src: 'css/gallery/bridalblowse.png', alt: 'Bridal blouse with Maggam work' },
    { src: 'css/gallery/details.png', alt: 'Designer blouse detail' },
    { src: 'css/gallery/kurti.png', alt: 'Kurti dress' },
    { src: 'css/gallery/handemb.png', alt: 'Hand embroidery close-up' },
    { src: 'css/gallery/lehanga.png', alt: 'Festive lehenga stitching' },
    { src: 'css/gallery/dress.png', alt: 'Alteration and fitting session' },
    { src: 'css/gallery/anerkali.png', alt: 'Custom Anarkali dress' },
    { src: 'css/gallery/saree.png', alt: 'Traditional sarees' }
  ];

  var galleryGrid = document.getElementById('galleryGrid');
  
  galleryItems.forEach(function (item, i) {
    var fig = document.createElement('div');
    fig.className = 'gallery-item reveal';
    fig.setAttribute('data-index', i);
    fig.setAttribute('role', 'button');
    fig.setAttribute('tabindex', '0');
    fig.setAttribute('aria-label', 'View ' + item.alt);
    
    fig.innerHTML =
      '<img src="' + item.src + '" alt="' + item.alt + '" loading="lazy">' +
      '<span class="gi-label" aria-hidden="true">' + item.alt + '</span>';
    
    galleryGrid.appendChild(fig);
  });

  var newGalleryEls = galleryGrid.querySelectorAll('.reveal');
  
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { 
          entry.target.classList.add('is-visible'); 
          io2.unobserve(entry.target); 
        }
      });
    }, { threshold: 0.1 });
    
    newGalleryEls.forEach(function (el) { 
      io2.observe(el); 
    });
  } else {
    newGalleryEls.forEach(function (el) { 
      el.classList.add('is-visible'); 
    });
  }

  /* ============ Lightbox ============ */
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

  // Keyboard support for gallery items
  galleryGrid.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      var el = e.target.closest('.gallery-item');
      if (!el) return;
      e.preventDefault();
      openLightbox(parseInt(el.getAttribute('data-index'), 10));
    }
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', function () { showRelative(-1); });
  lightboxNext.addEventListener('click', function () { showRelative(1); });
  
  lightbox.addEventListener('click', function (e) { 
    if (e.target === lightbox) closeLightbox(); 
  });

  // Keyboard navigation in lightbox
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-open')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showRelative(-1);
    if (e.key === 'ArrowRight') showRelative(1);
  });

  // Touch swipe support for lightbox (mobile)
  var touchStartX = 0;
  var touchEndX = 0;

  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, false);

  lightbox.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      showRelative(1); // Swiped left
    } else if (touchEndX - touchStartX > 50) {
      showRelative(-1); // Swiped right
    }
  }, false);

  /* ============ Reviews carousel ============ */
  var reviewCards = document.querySelectorAll('.review-card');
  var progressFill = document.querySelector('.review-progress-fill');
  var prevBtn = document.querySelector('.review-nav.prev');
  var nextBtn = document.querySelector('.review-nav.next');
  var activeReview = 0;
  var reviewTimer;
  var reviewAutoplayEnabled = true;

  function goToReview(index) {
    if (reviewCards.length === 0) return;
    
    reviewCards[activeReview].classList.remove('active');
    activeReview = (index + reviewCards.length) % reviewCards.length;
    reviewCards[activeReview].classList.add('active');
    
    if (progressFill) {
      progressFill.style.width = ((activeReview + 1) / reviewCards.length * 100) + '%';
    }
  }

  function startReviewAutoplay() {
    clearInterval(reviewTimer);
    if (prefersReducedMotion || !reviewAutoplayEnabled) return;
    
    reviewTimer = setInterval(function () { 
      goToReview(activeReview + 1); 
    }, 5500);
  }

  function stopReviewAutoplay() {
    clearInterval(reviewTimer);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () { 
      goToReview(activeReview - 1); 
      stopReviewAutoplay();
      startReviewAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () { 
      goToReview(activeReview + 1); 
      stopReviewAutoplay();
      startReviewAutoplay();
    });
  }

  // Pause autoplay on user interaction
  var reviewDeck = document.querySelector('.review-deck');
  if (reviewDeck) {
    reviewDeck.addEventListener('mouseenter', stopReviewAutoplay);
    reviewDeck.addEventListener('mouseleave', startReviewAutoplay);
  }

  goToReview(0);
  startReviewAutoplay();

  /* ============ Contact form validation ============ */
  var form = document.getElementById('contactForm');
  var toast = document.getElementById('successToast');

  function setError(fieldId, message) {
    var input = document.getElementById(fieldId);
    var errorEl = document.getElementById('err-' + fieldId);
    
    if (message) {
      input.classList.add('invalid');
      if (errorEl) errorEl.textContent = message;
    } else {
      input.classList.remove('invalid');
      if (errorEl) errorEl.textContent = '';
    }
  }

  function clearErrors() {
    var errorEls = document.querySelectorAll('.field-error');
    errorEls.forEach(function (el) {
      el.textContent = '';
    });

    var inputs = document.querySelectorAll('.form-field input, .form-field textarea');
    inputs.forEach(function (input) {
      input.classList.remove('invalid');
    });
  }

  function validateForm() {
    clearErrors();
    var valid = true;

    var fullName = document.getElementById('fullName').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var email = document.getElementById('email').value.trim();
    var message = document.getElementById('message').value.trim();

    // Full Name validation
    if (fullName.length < 2) { 
      setError('fullName', 'Please enter your full name.'); 
      valid = false; 
    } else {
      setError('fullName', '');
    }

    // Phone validation
    if (!/^[0-9]{10}$/.test(phone.replace(/\D/g, ''))) { 
      setError('phone', 'Enter a valid 10-digit phone number.'); 
      valid = false; 
    } else {
      setError('phone', '');
    }

    // Email validation (optional field, but if provided must be valid)
    if (email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { 
      setError('email', 'Enter a valid email address.'); 
      valid = false; 
    } else {
      setError('email', '');
    }

    // Message validation
    if (message.length < 5) { 
      setError('message', 'Tell us a little about what you need (min 5 characters).'); 
      valid = false; 
    } else {
      setError('message', '');
    }

    return valid;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      if (!validateForm()) {
        // Focus on first invalid field
        var firstInvalid = document.querySelector('.form-field input.invalid, .form-field textarea.invalid');
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }

      // Clear form
      form.reset();
      clearErrors();

      // Show success toast
      if (toast) {
        toast.classList.add('is-visible');
        
        setTimeout(function () { 
          toast.classList.remove('is-visible'); 
        }, 4200);
      }

      // Optionally, you can send the form data to a server here
      // Example:
      // sendFormData({
      //   fullName: document.getElementById('fullName').value,
      //   phone: document.getElementById('phone').value,
      //   email: document.getElementById('email').value,
      //   message: document.getElementById('message').value
      // });
    });

    // Real-time validation on blur
    var formInputs = form.querySelectorAll('input, textarea');
    formInputs.forEach(function (input) {
      input.addEventListener('blur', function () {
        var fieldId = this.id;
        var value = this.value.trim();

        if (fieldId === 'fullName') {
          if (value.length < 2) {
            setError('fullName', 'Please enter your full name.');
          } else {
            setError('fullName', '');
          }
        } else if (fieldId === 'phone') {
          if (!/^[0-9]{10}$/.test(value.replace(/\D/g, ''))) {
            setError('phone', 'Enter a valid 10-digit phone number.');
          } else {
            setError('phone', '');
          }
        } else if (fieldId === 'email') {
          if (value.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setError('email', 'Enter a valid email address.');
          } else {
            setError('email', '');
          }
        } else if (fieldId === 'message') {
          if (value.length < 5) {
            setError('message', 'Tell us a little about what you need (min 5 characters).');
          } else {
            setError('message', '');
          }
        }
      });
    });
  }

  /* ============ Prevent default form submission behavior ============ */
  if (form) {
    form.addEventListener('invalid', function (e) {
      e.preventDefault();
    }, true);
  }

});

// Optional: Add a function to send form data to server
function sendFormData(data) {
  // Replace with your actual backend endpoint
  var endpoint = '/api/contact'; // Update this URL

  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Network response was not ok');
  })
  .then(function (data) {
    console.log('Success:', data);
  })
  .catch(function (error) {
    console.error('Error:', error);
  });
}