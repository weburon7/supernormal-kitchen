document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  const active = page === 'index' ? 'index.html' : `${page}.html`;
  document.querySelectorAll('[data-nav]').forEach(link => {
    if (link.getAttribute('data-nav') === active) link.setAttribute('aria-current', 'page');
  });

  if (page === 'offers') document.querySelector('.offers-nav-button')?.setAttribute('aria-current', 'page');

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('is-open', open);
    });
    nav.addEventListener('click', event => {
      if (event.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        nav.classList.remove('is-open');
      }
    });
  }

  const roomToggle = document.getElementById('room-more-toggle');
  const roomNav = document.getElementById('room-more-nav');
  if (roomToggle && roomNav) {
    const setRoomMenu = open => {
      roomToggle.setAttribute('aria-expanded', String(open));
      roomNav.hidden = !open;
    };
    roomToggle.addEventListener('click', () => setRoomMenu(roomToggle.getAttribute('aria-expanded') !== 'true'));
    roomNav.addEventListener('click', event => { if (event.target.closest('a')) setRoomMenu(false); });
    document.addEventListener('click', event => {
      if (!event.target.closest('.room-header-actions')) setRoomMenu(false);
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') setRoomMenu(false); });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    reveals.forEach(element => observer.observe(element));
  } else {
    reveals.forEach(element => element.classList.add('is-visible'));
  }

  // Pointer-based 3D depth for image cards; touch devices and reduced motion use the flat layout.
  if (!reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1100px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateZ(6px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }
  const menuSearch = document.getElementById('menu-search');
  if (menuSearch) {
    const cards = [...document.querySelectorAll('[data-item]')];
    const sections = [...document.querySelectorAll('[data-category]')];
    const resultText = document.getElementById('menu-results');
    const empty = document.getElementById('menu-empty');
    const updateMenu = () => {
      const query = menuSearch.value.trim().toLocaleLowerCase();
      let visible = 0;
      cards.forEach(card => {
        const match = card.dataset.search.includes(query);
        card.hidden = !match;
        if (match) visible += 1;
      });
      sections.forEach(section => {
        section.hidden = !section.querySelector('[data-item]:not([hidden])');
      });
      resultText.textContent = query ? `${visible} ${visible === 1 ? 'item' : 'items'} found` : `Showing all ${visible} items`;
      empty.hidden = visible !== 0;
    };
    menuSearch.addEventListener('input', updateMenu);
    updateMenu();
    const categoryLinks = document.querySelectorAll('.catalog-nav a');
    categoryLinks.forEach(link => link.addEventListener('click', () => {
      if (menuSearch.value) {
        menuSearch.value = '';
        updateMenu();
      }
      categoryLinks.forEach(item => item.classList.remove('is-active'));
      link.classList.add('is-active');
    }));
  }

});

document.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  document.querySelectorAll('input[type="date"]').forEach(input => { input.min = localDate; });

  const openWhatsApp = message => {
    window.open(`https://wa.me/919501132883?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };
  const clean = value => value.trim().replace(/\s+/g, ' ');

  const preorder = document.getElementById('preorder-form');
  const requestedItem = new URLSearchParams(location.search).get('item');
  if (preorder && requestedItem) {
    const select = preorder.elements.namedItem('item');
    if ([...select.options].some(option => option.value === requestedItem)) select.value = requestedItem;
  }
  if (preorder) preorder.addEventListener('submit', event => {
    event.preventDefault();
    if (!preorder.reportValidity()) return;
    const item = preorder.elements.namedItem('item').value;
    const quantity = preorder.elements.namedItem('quantity').value;
    const date = preorder.elements.namedItem('date').value;
    const method = preorder.elements.namedItem('method').value;
    const time = preorder.elements.namedItem('time').value;
    const notes = clean(preorder.elements.namedItem('notes').value);
    openWhatsApp(`Hi Supernormal Kitchen! I'd like to preorder ${quantity} × ${item} for ${date} at ${time} (${method}).${notes ? ` Notes: ${notes}.` : ''} Please confirm availability, total price and timing.`);
  });

  const subscription = document.getElementById('subscription-form');
  if (subscription) subscription.addEventListener('submit', event => {
    event.preventDefault();
    const days = [...subscription.querySelectorAll('input[name="day"]:checked')].map(input => input.value);
    const error = document.getElementById('day-error');
    error.hidden = days.length > 0;
    if (!days.length) return;
    if (!subscription.reportValidity()) return;
    const bowl = subscription.elements.namedItem('bowl').value;
    const start = subscription.elements.namedItem('start').value;
    const method = subscription.elements.namedItem('method').value;
    const servings = subscription.elements.namedItem('servings').value;
    const notes = clean(subscription.elements.namedItem('notes').value);
    openWhatsApp(`Hi Supernormal Kitchen! I'd like to enquire about a recurring breakfast bowl plan. Bowl: ${bowl}. Preferred days: ${days.join(', ')}. ${servings} bowl(s) per day. Preferred start: ${start}. ${method}.${notes ? ` Preferences: ${notes}.` : ''} Please confirm availability, schedule, pricing and payment details.`);
  });
});
