(() => {
  'use strict';
  const config = window.AUTISPARK_CONFIG || {};
  const price = Number.isFinite(config.priceUsd) && config.priceUsd > 0 ? config.priceUsd : 15;
  const priceText = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 2, minimumFractionDigits: 0}).format(price);
  document.querySelectorAll('[data-price]').forEach(node => { node.textContent = priceText; });
  document.getElementById('year').textContent = new Date().getFullYear();

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const dialogs = [...document.querySelectorAll('dialog')];
  function openDialog(id) {
    const dialog = document.getElementById(id);
    if (!dialog || typeof dialog.showModal !== 'function') return false;
    dialogs.filter(item => item.open && item !== dialog).forEach(item => item.close());
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('modal-open');
    dialog.scrollTop = 0;
    return true;
  }
  dialogs.forEach(dialog => {
    dialog.querySelector('[data-close-dialog]')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => document.body.classList.toggle('modal-open', dialogs.some(item => item.open)));
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
  });

  const pages = [
    {src: 'assets/sample-03.webp', alt: 'Sample page 3: Understand the whole picture'},
    {src: 'assets/sample-04.webp', alt: 'Sample page 4: Small moments of connection, ages 12–36 months'},
    {src: 'assets/sample-20.webp', alt: 'Sample page 20: Record one ordinary moment, observation worksheet'}
  ];
  const previewTabs = [...document.querySelectorAll('[data-preview]')];
  function setPreview(index) {
    const page = pages[index] || pages[0];
    const selected = previewTabs[index] || previewTabs[0];
    const image = document.getElementById('sample-image');
    image.src = page.src;
    image.alt = page.alt;
    previewTabs.forEach(tab => {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    document.getElementById('sample-panel').setAttribute('aria-labelledby', selected.id);
  }
  function showPreview(index = 0) {
    setPreview(index);
    return openDialog('preview-dialog');
  }
  previewTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setPreview(index));
    tab.addEventListener('keydown', event => {
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % previewTabs.length;
      else if (event.key === 'ArrowLeft') next = (index + previewTabs.length - 1) % previewTabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = previewTabs.length - 1;
      else return;
      event.preventDefault();
      previewTabs[next].focus();
      setPreview(next);
    });
  });
  document.querySelectorAll('[data-open-preview]').forEach(link => link.addEventListener('click', event => {
    if (showPreview(Number(link.dataset.openPreview) || 0)) event.preventDefault();
  }));
  document.querySelectorAll('[data-open-sources]').forEach(button => button.addEventListener('click', () => openDialog('sources-dialog')));

  // A genuine Hotmart checkout is required before the purchase state is enabled.
  let checkout = '';
  try {
    const url = new URL(config.hotmartUrl);
    const host = url.hostname.toLowerCase();
    if (url.protocol === 'https:' && !url.username && !url.password && (host === 'hotmart.com' || host.endsWith('.hotmart.com'))) checkout = url.href;
  } catch { /* An empty or invalid URL keeps the preview state. */ }
  document.querySelectorAll('[data-purchase]').forEach(link => {
    if (checkout) {
      link.href = checkout;
      link.rel = 'noopener';
      link.querySelector('[data-action-label]').textContent = 'Get the Guide — ' + priceText;
    } else {
      link.href = '#preview';
      link.querySelector('[data-action-label]').textContent = 'Preview the Guide';
      link.addEventListener('click', event => { if (showPreview(0)) event.preventDefault(); });
    }
  });
  if (!checkout) {
    document.querySelectorAll('[data-availability]').forEach(node => { node.hidden = false; });
    document.querySelector('[data-access-note]').textContent = 'Preview the pages now. Purchasing will open here when the guide launches.';
    document.querySelector('[data-sticky-status]').textContent = '30-page PDF · Coming soon';
    document.querySelector('[data-delivery-answer]').textContent = 'Purchasing is not open yet. You can preview sample pages now. Delivery details will be provided with the purchase offer when it launches.';
    document.querySelector('[data-refund-answer]').textContent = 'Check the applicable refund terms before paying when purchasing opens.';
  }
  if (checkout) {
    document.querySelectorAll('[data-availability]').forEach(node => { node.hidden = true; });
    document.querySelector('[data-access-note]').textContent = 'Continue to Hotmart to review the purchase and delivery details before paying.';
    document.querySelector('[data-sticky-status]').textContent = '30-page PDF · One-time purchase';
    document.querySelector('[data-delivery-answer]').textContent = typeof config.deliveryText === 'string' && config.deliveryText.trim() ? config.deliveryText : 'Use a purchase button to continue to Hotmart. Review the delivery details in the purchase offer before paying.';
    document.querySelector('[data-refund-answer]').textContent = typeof config.refundText === 'string' && config.refundText.trim() ? config.refundText : 'Review the applicable refund terms in the Hotmart purchase offer before paying. No additional refund guarantee is stated on this page.';
    const closing = document.querySelector('.closing-block > p:not(.eyebrow)');
    if (closing) closing.textContent = 'Get the illustrated guide and keep your observations and next questions together.';
    document.querySelectorAll('meta[name="description"], meta[property="og:description"]').forEach(meta => {
      meta.content = meta.content.replace('Planned price: ', 'Price: ').replace(/Coming soon[. ·]*/g, '').replace(/· $15 USD\./, '$15 USD.').trim();
    });
  }

  // Animate each block once, without hiding content before JavaScript runs.
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (!reducedMotion.matches) entry.target.classList.add('is-entering');
      revealObserver.unobserve(entry.target);
    }), {threshold: 0.08});
    document.querySelectorAll('[data-reveal]').forEach((node, index) => {
      node.style.setProperty('--reveal-delay', String((index % 3) * 45) + 'ms');
      revealObserver.observe(node);
      node.addEventListener('animationend', event => { if (event.target === node) node.classList.remove('is-entering'); }, {once: true});
    });
  }

  const phone = document.querySelector('[data-scroll-phone]');
  const phoneStage = document.querySelector('[data-phone-stage]');
  const progress = document.querySelector('.reading-progress > span');
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  let framePending = false;
  let phoneVisible = true;
  function updateScroll() {
    framePending = false;
    const viewport = window.innerHeight;
    const range = document.documentElement.scrollHeight - viewport;
    if (progress) progress.style.transform = 'scaleX(' + (range > 0 ? clamp(window.scrollY / range, 0, 1) : 0) + ')';
    if (!phone || !phoneStage) return;
    if (reducedMotion.matches) {
      phone.style.setProperty('--phone-y', '0deg');
      phone.style.setProperty('--phone-x', '0deg');
      phone.style.setProperty('--phone-z', '0deg');
      phone.style.setProperty('--phone-rise', '0px');
      phone.style.setProperty('--edge-step', '0px');
      return;
    }
    if (!phoneVisible) return;
    const bounds = phoneStage.getBoundingClientRect();
    const position = clamp((viewport - bounds.top) / (viewport + bounds.height), 0, 1);
    const turn = (position - 0.5) * 2;
    const yaw = clamp(turn * 44 - 9, -42, 35);
    phone.style.setProperty('--phone-y', yaw.toFixed(2) + 'deg');
    phone.style.setProperty('--phone-x', (2 - turn * 7).toFixed(2) + 'deg');
    phone.style.setProperty('--phone-z', (turn * 3).toFixed(2) + 'deg');
    phone.style.setProperty('--phone-rise', (-turn * 12).toFixed(2) + 'px');
    phone.style.setProperty('--edge-step', (-Math.sin(yaw * Math.PI / 180) * 1.7).toFixed(3) + 'px');
    phone.style.setProperty('--glass-shift', (turn * 24).toFixed(1) + '%');
  }
  function scheduleScroll() {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(updateScroll);
  }
  if ('IntersectionObserver' in window && phoneStage) {
    new IntersectionObserver(entries => {
      phoneVisible = entries[0].isIntersecting;
      if (phoneVisible) scheduleScroll();
    }, {rootMargin: '100px'}).observe(phoneStage);
  }
  addEventListener('scroll', scheduleScroll, {passive: true});
  addEventListener('resize', scheduleScroll, {passive: true});
  addEventListener('load', scheduleScroll, {once: true});
  reducedMotion.addEventListener('change', scheduleScroll);
  scheduleScroll();

  // Pause decorative loops outside the viewport and when the tab is hidden.
  const motionItems = [...document.querySelectorAll('.neon, .page-badge, .stage-note, .empathy-art img')];
  const visibility = new WeakMap();
  const syncMotion = node => node.style.setProperty('--motion-state', document.hidden || visibility.get(node) === false ? 'paused' : 'running');
  if ('IntersectionObserver' in window) {
    const motionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      visibility.set(entry.target, entry.isIntersecting);
      syncMotion(entry.target);
    }));
    motionItems.forEach(node => motionObserver.observe(node));
  }
  document.addEventListener('visibilitychange', () => motionItems.forEach(syncMotion));
})();
