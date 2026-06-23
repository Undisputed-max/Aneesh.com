async function loadComponents() {
  const slots = document.querySelectorAll('[data-component]');
  await Promise.all(Array.from(slots).map(async slot => {
    const response = await fetch(slot.dataset.component);
    if (!response.ok) {
      throw new Error(`Could not load ${slot.dataset.component}`);
    }
    slot.innerHTML = await response.text();
  }));
}

function initPortfolio() {
  const cursor = document.getElementById('cursor');
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX - 4 + 'px';
    cursor.style.top = e.clientY - 4 + 'px';
  });
  document.querySelectorAll('a,button,.video-main,.video-small,.photo-slot').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.style.transform = 'scale(3)');
    el.addEventListener('mouseleave', () => cursor.style.transform = 'scale(1)');
  });

  // Video URLs
  // Replace 'YOUR_URL_HERE' with actual YouTube or Vimeo links
  const videoUrls = {
    shib_main:      'YOUR_URL_HERE',
    shib_mp:        'YOUR_URL_HERE',
    shib_tech:      'YOUR_URL_HERE',
    anarchy_main:   'YOUR_URL_HERE',
    anarchy_vehicle:'YOUR_URL_HERE',
    anarchy_inv:    'YOUR_URL_HERE',
    heroes_main:    'YOUR_URL_HERE',
    heroes_weapon:  'YOUR_URL_HERE',
    heroes_shader:  'YOUR_URL_HERE',
    kingdom_main:   'YOUR_URL_HERE',
    kingdom_ai:     'YOUR_URL_HERE',
    kingdom_cards:  'YOUR_URL_HERE',
  };
  window.openVideo = function openVideo(key) {
    const url = videoUrls[key];
    if (!url || url === 'YOUR_URL_HERE') { alert('Add your video URL in the script -> videoUrls.' + key); return; }
    window.open(url, '_blank');
  };

  // Photo URLs
  // Replace null with image path strings e.g. 'images/shib_1.jpg' or full URLs
  const photoUrls = {
    shib:    [null, null, null],
    anarchy: [null, null, null],
    heroes:  [null, null, null],
    kingdom: [null, null, null],
  };
  window.openPhoto = function openPhoto(game, idx) {
    const url = photoUrls[game][idx];
    if (!url) { alert('Add your screenshot URL in the script -> photoUrls.' + game + '[' + idx + ']'); return; }
    window.open(url, '_blank');
  };

  // Scroll reveal
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; }
    });
  }, { threshold: 0.07 });
  document.querySelectorAll('.skill-block,.arch-block,.role-box,.game-grid,.video-main').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    obs.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadComponents();
    initPortfolio();
  } catch (error) {
    console.error(error);
  }
});

window.closeContactPopup = function (e) {
  if (e && e.target !== document.getElementById('contactOverlay')) return;

  document.getElementById('contactOverlay').style.display = 'none';
  document.body.style.overflow = '';
};
