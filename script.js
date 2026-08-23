const glow = document.createElement('div');
glow.className = 'cursor-glow';
document.body.appendChild(glow);

window.addEventListener('pointermove', (event) => {
  const { clientX, clientY } = event;
  document.body.style.setProperty('--mouse-x', `${clientX}px`);
  document.body.style.setProperty('--mouse-y', `${clientY}px`);
  glow.style.left = `${clientX}px`;
  glow.style.top = `${clientY}px`;
});

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((element) => {
  revealObserver.observe(element);
});

const counters = document.querySelectorAll('.stat-number');

const animateCounter = (counter) => {
  const target = Number(counter.dataset.target || 0);
  const duration = 1200;
  const startTime = performance.now();

  const updateCount = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(target * eased);
    counter.textContent = `${value}${target >= 25 && target <= 40 ? '+' : ''}`;

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      counter.textContent = `${target}${target >= 25 && target <= 40 ? '+' : ''}`;
    }
  };

  requestAnimationFrame(updateCount);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const brand = document.querySelector('.brand');
const brandButton = document.querySelector('.brand-mark-button');
const brandImage = document.getElementById('brandImage');
const brandPopoverImage = document.getElementById('brandPopoverImage');

const applyProfileImage = (src) => {
  if (!src) {
    return;
  }

  if (brandImage) {
    brandImage.src = src;
    brandImage.style.opacity = '1';
  }

  if (brandPopoverImage) {
    brandPopoverImage.src = src;
    brandPopoverImage.style.opacity = '1';
  }

  localStorage.setItem('profileImage', src);
};

const savedProfileImage = localStorage.getItem('profileImage');

if (savedProfileImage) {
  applyProfileImage(savedProfileImage);
}

window.setProfileImage = applyProfileImage;

if (brand && brandButton) {
  const setOpenState = (isOpen) => {
    brand.classList.toggle('is-open', isOpen);
    brandButton.classList.toggle('is-active', isOpen);
    brandButton.setAttribute('aria-expanded', String(isOpen));
  };

  brandButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const isOpen = !brand.classList.contains('is-open');
    setOpenState(isOpen);
  });

  document.addEventListener('click', (event) => {
    if (!brand.contains(event.target)) {
      setOpenState(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && brand.classList.contains('is-open')) {
      setOpenState(false);
    }
  });
}

const yearElement = document.getElementById('year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const originalText = submitButton ? submitButton.textContent : 'Send Message';

  const setStatusMessage = (type, message) => {
    let statusElement = contactForm.querySelector('.form-status');

    if (!statusElement) {
      statusElement = document.createElement('div');
      statusElement.className = 'form-status';
      contactForm.appendChild(statusElement);
    }

    statusElement.classList.remove('success', 'error');
    statusElement.textContent = message || '';

    if (!message) {
      statusElement.style.display = 'none';
      return;
    }

    statusElement.style.display = 'block';
    statusElement.classList.add(type);
  };

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
      setStatusMessage('error', 'Please complete all fields before sending your message.');
      return;
    }

    if (name.length < 2) {
      setStatusMessage('error', 'Please enter a valid name.');
      return;
    }

    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailPattern.test(email)) {
      setStatusMessage('error', 'Please enter a valid email address.');
      return;
    }

    if (message.length < 10) {
      setStatusMessage('error', 'Your message is too short. Please add a bit more detail.');
      return;
    }

    if (!submitButton) {
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    setStatusMessage('success', '');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, message })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to send your message right now.');
      }

      setStatusMessage('success', 'Your message has been sent successfully.');
      contactForm.reset();
    } catch (error) {
      setStatusMessage('error', error.message || 'Something went wrong while sending your message.');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
}
