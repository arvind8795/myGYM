/**
 * APEXFit Club - Interactive Application Script
 * Vanilla JavaScript (ES6+)
 * Zero external dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================
  // 1. Navigation & Sticky Header
  // ==========================================================
  const header = document.querySelector('.header');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.querySelector('.back-to-top');

  // Handle header background on scroll
  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;

    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile Hamburger Menu
  const toggleMobileMenu = () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleMobileMenu);

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // Close mobile menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      toggleMobileMenu();
    }
  });

  // Back to Top button
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Active link highlight on scroll using IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => navObserver.observe(section));

  // ==========================================================
  // 2. Scroll Reveal Animations
  // ==========================================================
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================================
  // 3. Pricing Toggle (Monthly vs Yearly)
  // ==========================================================
  const pricingSwitch = document.getElementById('pricingSwitch');
  const monthlyLabel = document.getElementById('monthlyLabel');
  const yearlyLabel = document.getElementById('yearlyLabel');
  const pricingCards = document.querySelectorAll('.pricing-card');

  const pricingData = {
    monthly: [
      { id: 'basic', price: '999', period: '/month', billed: 'Billed monthly' },
      { id: 'premium', price: '1,499', period: '/month', billed: 'Billed monthly' },
      { id: 'pro', price: '1,999', period: '/month', billed: 'Billed monthly' }
    ],
    yearly: [
      { id: 'basic', price: '799', period: '/month', billed: '₹9,588 billed annually (Save 20%)' },
      { id: 'premium', price: '1,199', period: '/month', billed: '₹14,388 billed annually (Save 20%)' },
      { id: 'pro', price: '1,599', period: '/month', billed: '₹19,188 billed annually (Save 20%)' }
    ]
  };

  let isYearly = false;

  const updatePricing = () => {
    const mode = isYearly ? 'yearly' : 'monthly';
    const items = pricingData[mode];

    items.forEach(item => {
      const card = document.querySelector(`.pricing-card[data-plan="${item.id}"]`);
      if (card) {
        const amountEl = card.querySelector('.pricing-amount');
        const periodEl = card.querySelector('.pricing-period');
        const billedEl = card.querySelector('.pricing-billed-note');

        if (amountEl) amountEl.textContent = item.price;
        if (periodEl) periodEl.textContent = item.period;
        if (billedEl) billedEl.textContent = item.billed;
      }
    });

    if (isYearly) {
      pricingSwitch.classList.add('active');
      yearlyLabel.classList.add('active');
      monthlyLabel.classList.remove('active');
    } else {
      pricingSwitch.classList.remove('active');
      monthlyLabel.classList.add('active');
      yearlyLabel.classList.remove('active');
    }
  };

  if (pricingSwitch) {
    pricingSwitch.addEventListener('click', () => {
      isYearly = !isYearly;
      updatePricing();
    });

    monthlyLabel.addEventListener('click', () => {
      isYearly = false;
      updatePricing();
    });

    yearlyLabel.addEventListener('click', () => {
      isYearly = true;
      updatePricing();
    });
  }

  // Choose plan button handler - preselects plan in contact form
  const planButtons = document.querySelectorAll('.btn-choose-plan');
  planButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const planName = e.currentTarget.getAttribute('data-plan-name');
      const programSelect = document.getElementById('contactProgram');
      if (programSelect) {
        programSelect.value = planName;
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ==========================================================
  // 4. Interactive BMI Calculator
  // ==========================================================
  const bmiForm = document.getElementById('bmiForm');
  const bmiHeightInput = document.getElementById('bmiHeight');
  const bmiWeightInput = document.getElementById('bmiWeight');
  const bmiScoreEl = document.getElementById('bmiScore');
  const bmiCategoryEl = document.getElementById('bmiCategory');
  const bmiAdviceEl = document.getElementById('bmiAdvice');
  const bmiPointer = document.getElementById('bmiPointer');
  const bmiResetBtn = document.getElementById('bmiResetBtn');

  const calculateBMI = () => {
    const heightCm = parseFloat(bmiHeightInput.value);
    const weightKg = parseFloat(bmiWeightInput.value);

    if (!heightCm || !weightKg || heightCm < 50 || heightCm > 260 || weightKg < 20 || weightKg > 350) {
      alert('Please enter valid measurements:\nHeight: 50 – 260 cm\nWeight: 20 – 350 kg');
      return;
    }

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    const roundedBMI = bmi.toFixed(1);

    bmiScoreEl.textContent = roundedBMI;

    let category = '';
    let advice = '';
    let pointerPercent = 50;

    if (bmi < 18.5) {
      category = 'Underweight';
      advice = 'You are in the underweight zone. Focus on strength training and a structured calorie surplus rich in protein and micronutrients.';
      pointerPercent = Math.max(5, (bmi / 18.5) * 25);
      bmiCategoryEl.style.color = '#38bdf8';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      category = 'Normal / Fit';
      advice = 'Awesome! Your BMI is in the healthy optimal range. Maintain your active lifestyle with balanced progressive strength and cardio sessions.';
      pointerPercent = 25 + ((bmi - 18.5) / (24.9 - 18.5)) * 35;
      bmiCategoryEl.style.color = '#4ade80';
    } else if (bmi >= 25 && bmi <= 29.9) {
      category = 'Overweight';
      advice = 'You are in the overweight range. Our high-energy HIIT, boxing, and strength training classes will accelerate metabolic fat burn efficiently.';
      pointerPercent = 60 + ((bmi - 25) / (29.9 - 25)) * 25;
      bmiCategoryEl.style.color = '#facc15';
    } else {
      category = 'Obese';
      advice = 'Your BMI is in the obese range. We strongly recommend personalized 1-on-1 coaching with coach Arvind and team for a guided body transformation.';
      pointerPercent = Math.min(96, 85 + ((bmi - 30) / 10) * 12);
      bmiCategoryEl.style.color = '#f87171';
    }

    bmiCategoryEl.textContent = category;
    bmiAdviceEl.textContent = advice;
    bmiPointer.style.left = `${pointerPercent}%`;
  };

  if (bmiForm) {
    bmiForm.addEventListener('submit', (e) => {
      e.preventDefault();
      calculateBMI();
    });
  }

  if (bmiResetBtn) {
    bmiResetBtn.addEventListener('click', () => {
      bmiHeightInput.value = '';
      bmiWeightInput.value = '';
      bmiScoreEl.textContent = '22.4';
      bmiCategoryEl.textContent = 'Normal / Fit';
      bmiCategoryEl.style.color = 'var(--primary-yellow)';
      bmiAdviceEl.textContent = 'Enter your height and weight to calculate your exact Body Mass Index and customized fitness trajectory.';
      bmiPointer.style.left = '45%';
    });
  }

  // ==========================================================
  // 5. Gym Gallery & Lightbox
  // ==========================================================
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGalleryIndex = 0;
  const visibleGalleryItems = [];

  // Filter gallery items
  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCat === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox functions
  const openLightbox = (index) => {
    currentGalleryIndex = index;
    const item = galleryItems[index];
    const img = item.querySelector('.gallery-img');
    const title = item.querySelector('.gallery-title').textContent;
    const cat = item.querySelector('.gallery-category').textContent;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxTitle.textContent = title;
    lightboxCategory.textContent = cat;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  const showNextImage = () => {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
    openLightbox(currentGalleryIndex);
  };

  const showPrevImage = () => {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(currentGalleryIndex);
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

  // Close when clicking outside image
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  // ==========================================================
  // 6. Testimonial Slider
  // ==========================================================
  const track = document.getElementById('testimonialTrack');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  const dotsContainer = document.getElementById('sliderDots');

  let currentSlide = 0;
  const totalSlides = slides.length;
  let autoplayTimer = null;

  // Create dot indicators
  if (dotsContainer && totalSlides > 0) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });
  }

  const updateDots = () => {
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });
  };

  const goToSlide = (idx) => {
    currentSlide = idx;
    if (track) {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    updateDots();
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    goToSlide(currentSlide);
  };

  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(currentSlide);
  };

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // Autoplay
  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, 5000);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) clearInterval(autoplayTimer);
  };

  if (track) {
    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);
    startAutoplay();
  }

  // Touch Swipe for Testimonial Slider
  let touchStartX = 0;
  let touchEndX = 0;

  if (track) {
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoplay();
    }, { passive: true });
  }

  const handleSwipe = () => {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  // ==========================================================
  // 7. FAQ Accordion
  // ==========================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all others
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherBtn = otherItem.querySelector('.faq-question-btn');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        otherBtn.setAttribute('aria-expanded', 'false');
        otherAnswer.style.maxHeight = null;
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      }
    });
  });

  // Open first FAQ item by default
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    const firstBtn = firstItem.querySelector('.faq-question-btn');
    const firstAnswer = firstItem.querySelector('.faq-answer');
    firstItem.classList.add('active');
    firstBtn.setAttribute('aria-expanded', 'true');
    firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
  }

  // ==========================================================
  // 8. Contact Form & Demo Modal Confirmation
  // ==========================================================
  const contactForm = document.getElementById('contactForm');
  const demoModal = document.getElementById('demoModal');
  const demoModalClose = document.getElementById('demoModalClose');
  const demoModalDetails = document.getElementById('demoModalDetails');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    // Allows 10-14 digits, optional + prefix, spaces, dashes
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone.trim());
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const nameInput = document.getElementById('contactName');
      const phoneInput = document.getElementById('contactPhone');
      const emailInput = document.getElementById('contactEmail');
      const programInput = document.getElementById('contactProgram');
      const messageInput = document.getElementById('contactMessage');

      // Reset errors
      document.querySelectorAll('.form-group').forEach(grp => grp.classList.remove('has-error'));

      // Validate Name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        nameInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      // Validate Phone
      if (!phoneInput.value.trim() || !validatePhone(phoneInput.value)) {
        phoneInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      // Validate Email
      if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
        emailInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      // Validate Program
      if (!programInput.value) {
        programInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      if (!isValid) return;

      // Populate demo modal details
      if (demoModalDetails) {
        demoModalDetails.innerHTML = `
          <strong>Applicant:</strong> ${nameInput.value.trim()}<br>
          <strong>Phone:</strong> ${phoneInput.value.trim()}<br>
          <strong>Email:</strong> ${emailInput.value.trim()}<br>
          <strong>Program / Plan:</strong> ${programInput.value}<br>
          <strong>Assigned Location:</strong> Gorakhpur, Uttar Pradesh, India
        `;
      }

      // Show Demo Modal Confirmation
      demoModal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Reset form fields
      contactForm.reset();
    });
  }

  if (demoModalClose) {
    demoModalClose.addEventListener('click', () => {
      demoModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (demoModal) {
    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) {
        demoModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
});
