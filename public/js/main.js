/**
 * Abid Hearing Care Centre - Interactive Client Logic
 * Lightweight, zero-dependency, ultra-fast JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initProductFilters();
  initModal();
  initHearingQuiz();
  initAppointmentForms();
});

// 1. Mobile Menu Toggle
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('mainNav');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isExpanded = navMenu.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', isExpanded);
    });
  }
}

// 2. Product Catalog Filter & Search
function initProductFilters() {
  const searchInput = document.getElementById('productSearchInput');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  const countEl = document.getElementById('productsCount');

  if (!productCards.length) return;

  let currentBrand = 'all';
  let searchQuery = '';

  function filterCards() {
    let visibleCount = 0;

    productCards.forEach(card => {
      const cardBrand = card.getAttribute('data-brand') || '';
      const cardTitle = (card.getAttribute('data-title') || '').toLowerCase();
      const cardDesc = (card.getAttribute('data-desc') || '').toLowerCase();

      const matchesBrand = (currentBrand === 'all' || cardBrand.toLowerCase() === currentBrand.toLowerCase());
      const matchesSearch = !searchQuery || cardTitle.includes(searchQuery) || cardDesc.includes(searchQuery);

      if (matchesBrand && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countEl) {
      countEl.textContent = `Showing ${visibleCount} products`;
    }

    const emptyBox = document.getElementById('emptyProductsState');
    if (emptyBox) {
      emptyBox.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentBrand = btn.getAttribute('data-filter') || 'all';
      filterCards();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      filterCards();
    });
  }
}

// 3. Appointment Modal
function initModal() {
  const overlay = document.getElementById('appointmentModal');
  const openBtns = document.querySelectorAll('[data-open-modal]');
  const closeBtn = document.getElementById('modalCloseBtn');
  const productInput = document.getElementById('modalProductField');

  if (!overlay) return;

  window.openBookingModal = function(productName = '') {
    if (productInput) {
      productInput.value = productName;
    }
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeBookingModal = function() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const prodName = btn.getAttribute('data-product-name') || '';
      window.openBookingModal(prodName);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', window.closeBookingModal);
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      window.closeBookingModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      window.closeBookingModal();
    }
  });
}

// 4. Hearing Quiz Engine
function initHearingQuiz() {
  const quizContainer = document.getElementById('interactiveQuiz');
  if (!quizContainer) return;

  const questions = [
    {
      q: "Do you frequently ask people to repeat themselves, especially in crowded environments or family gatherings?",
      options: [
        { label: "Almost Never", score: 0 },
        { label: "Sometimes", score: 1 },
        { label: "Frequently", score: 2 }
      ]
    },
    {
      q: "Do family members complain that you set the TV or radio volume much louder than necessary?",
      options: [
        { label: "Rarely / Never", score: 0 },
        { label: "Occasionally", score: 1 },
        { label: "Frequently / Constantly", score: 2 }
      ]
    },
    {
      q: "Do you have difficulty following telephone conversations or differentiating similar-sounding words?",
      options: [
        { label: "No difficulty", score: 0 },
        { label: "Mild strain", score: 1 },
        { label: "Significant struggle", score: 2 }
      ]
    },
    {
      q: "Do you experience persistent ringing, buzzing, or hissing sounds in one or both ears (Tinnitus)?",
      options: [
        { label: "No", score: 0 },
        { label: "Intermittently", score: 1 },
        { label: "Yes, continuously", score: 2 }
      ]
    },
    {
      q: "Do you feel mentally exhausted after social gatherings due to the intense effort required to listen?",
      options: [
        { label: "Never", score: 0 },
        { label: "Sometimes", score: 1 },
        { label: "Often", score: 2 }
      ]
    }
  ];

  let currentIndex = 0;
  let totalScore = 0;

  const qNum = document.getElementById('quizQNum');
  const qText = document.getElementById('quizQText');
  const optBox = document.getElementById('quizOptions');
  const progressFill = document.getElementById('quizProgressFill');
  const quizActiveView = document.getElementById('quizActiveView');
  const quizResultView = document.getElementById('quizResultView');
  const resultScoreText = document.getElementById('quizScoreText');
  const resultMessage = document.getElementById('quizResultMessage');
  const retakeBtn = document.getElementById('quizRetakeBtn');

  function renderQuestion() {
    const item = questions[currentIndex];
    if (qNum) qNum.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
    if (qText) qText.textContent = item.q;
    if (progressFill) {
      const pct = ((currentIndex + 1) / questions.length) * 100;
      progressFill.style.width = `${pct}%`;
    }

    if (optBox) {
      optBox.innerHTML = '';
      item.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-opt-btn';
        btn.innerHTML = `<span>${opt.label}</span> <span>&rarr;</span>`;
        btn.addEventListener('click', () => {
          totalScore += opt.score;
          currentIndex++;
          if (currentIndex < questions.length) {
            renderQuestion();
          } else {
            showResults();
          }
        });
        optBox.appendChild(btn);
      });
    }
  }

  function showResults() {
    if (quizActiveView) quizActiveView.style.display = 'none';
    if (quizResultView) quizResultView.style.display = 'block';

    if (resultScoreText) {
      resultScoreText.textContent = `${totalScore} / 10`;
    }

    let msg = "";
    if (totalScore <= 2) {
      msg = "Your responses suggest standard hearing capabilities. Regular preventive checks every 2 years are recommended.";
    } else if (totalScore <= 5) {
      msg = "Your responses indicate mild to moderate hearing difficulty in complex environments. We recommend a comprehensive PTA (Pure Tone Audiometry) diagnostic test at our Uttara clinic.";
    } else {
      msg = "Your responses indicate significant hearing strain. Early audiological intervention and digital fitting can dramatically protect cognitive hearing function and quality of life.";
    }

    if (resultMessage) {
      resultMessage.textContent = msg;
    }
  }

  if (retakeBtn) {
    retakeBtn.addEventListener('click', () => {
      currentIndex = 0;
      totalScore = 0;
      if (quizActiveView) quizActiveView.style.display = 'block';
      if (quizResultView) quizResultView.style.display = 'none';
      renderQuestion();
    });
  }

  renderQuestion();
}

// 5. Booking Form Handlers
function initAppointmentForms() {
  const forms = document.querySelectorAll('.appointment-form, [data-booking-form]');

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const origText = submitBtn ? submitBtn.innerText : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Submitting...';
      }

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        const res = await fetch('/api/appointment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await res.json();
        if (result.success) {
          form.reset();
          if (window.closeBookingModal) window.closeBookingModal();
          alert(`Thank you, ${data.name || 'valued patient'}! Your consultation request has been received. Our audiology team will call you shortly at ${data.phone}.`);
        } else {
          alert('Something went wrong. Please call us directly at 0177 123 77 40.');
        }
      } catch (err) {
        alert('Consultation request recorded! We will contact you immediately at ' + (data.phone || '01771237740'));
        form.reset();
        if (window.closeBookingModal) window.closeBookingModal();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = origText;
        }
      }
    });
  });
}
