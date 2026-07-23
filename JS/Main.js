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
    shib_main:      'https://youtu.be/KvSFp6aR-ZA?si=Z0H7U8ac-DGwGT_6',
    shib_mp:        'https://youtu.be/Yx8EbiGAu6g?si=GUKoYQJ7N6YPTnBz',
    shib_tech:      'YOUR_URL_HERE',
    anarchy_main:   'https://youtu.be/0ALok0CKi3c?si=h-4THiuBFmIbLgBr',
    anarchy_vehicle:'https://youtu.be/EXCEWKXKC6g?si=qTkRo_Q7nFCUlUyX',
    anarchy_inv:    'YOUR_URL_HERE',
    heroes_main:    'https://youtu.be/xcVwEr_Vqxg?si=Q14PPCGE2sdiK890',
    //heroes_weapon:  'YOUR_URL_HERE',
    //heroes_shader:  'YOUR_URL_HERE',
    kingdom_main:   'https://youtu.be/S_wVbn_JBJE?si=tKjX5iJsoqUBa5KC',
    kingdom_ai:     'https://youtu.be/50QPxlqgMQY?si=nHicSTEfSG0Ebtfh',
    kingdom_cards:  'https://youtu.be/9aLW5MyzLRc?si=Ss-UcueAnDni-Bs5',
  };

  // Photo URLs
  // Paths are relative to index.html — e.g. 'assets/Shib/1.png'
  // (NOT absolute local paths like E:\... — browsers can't read those)
  const photoUrls = {
    shib:    ['assets/Shib/5.png', 'assets/Shib/4.png', 'assets/Shib/3.png', 'assets/Shib/2.png', 'assets/Shib/1.png'],
    anarchy: ['assets/Anarchy/1.png', 'assets/Anarchy/2.png', 'assets/Anarchy/3.png', 'assets/Anarchy/4.png', 'assets/Anarchy/5.png', 'assets/Anarchy/7.png'],
    heroes:  ['assets/Heroes/1.png', 'assets/Heroes/2.png', 'assets/Heroes/3.png'],
    kingdom: ['assets/Kingdom/1.png', 'assets/Kingdom/2.png', 'assets/Kingdom/3.png', 'assets/Kingdom/4.png', 'assets/Kingdom/5.png', 'assets/Kingdom/6.png', 'assets/Kingdom/7.png'],
  };

  // ── Extracts a YouTube video ID from watch/share/embed style URLs ──
  function getYouTubeId(url) {
    const patterns = [
      /(?:youtu\.be\/)([\w-]{11})/,
      /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
      /(?:youtube\.com\/embed\/)([\w-]{11})/,
      /(?:youtube\.com\/shorts\/)([\w-]{11})/,
    ];
    for (const re of patterns) {
      const m = url.match(re);
      if (m) return m[1];
    }
    return null;
  }

  // ── Auto-fill thumbnail images for every video box on the page ──
  // Any element with data-key="videoUrlsKey" gets YouTube's auto-generated
  // thumbnail as its background, so you don't need to upload separate images.
  function initVideoThumbnails() {
    document.querySelectorAll('[data-key]').forEach(el => {
      const key = el.dataset.key;
      const url = videoUrls[key];
      if (!url || url === 'YOUR_URL_HERE') return;
      const id = getYouTubeId(url);
      if (!id) return;
      el.style.backgroundImage =
        `linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.55)), url('https://img.youtube.com/vi/${id}/hqdefault.jpg')`;
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
    });
  }
  initVideoThumbnails();

  // ── Auto-fill thumbnail images for every photo card ──
  // Requires data-game="shib" data-idx="0" on each .media-card.photo element
  function initPhotoThumbnails() {
    document.querySelectorAll('.media-card.photo[data-game]').forEach(el => {
      const game = el.dataset.game;
      const idx = parseInt(el.dataset.idx, 10);
      const url = photoUrls[game] && photoUrls[game][idx];
      if (!url) return;
      el.style.backgroundImage =
        `linear-gradient(180deg, rgba(0,0,0,.1), rgba(0,0,0,.4)), url('${url}')`;
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
    });
  }
  initPhotoThumbnails();

  // Plays the video in the SECTION'S MAIN viewer — no matter which box
  // (main viewer or a small rail thumbnail) was actually clicked.
  window.openVideo = function openVideo(key, el) {
    const url = videoUrls[key];
    if (!url || url === 'YOUR_URL_HERE') { alert('Add your video URL in the script -> videoUrls.' + key); return; }

    const clicked = el || (window.event && window.event.currentTarget);
    if (!clicked) { console.error('openVideo: no target element passed for key', key); return; }

    const viewerWrap = clicked.closest('.media-viewer') || clicked.parentElement;
    const mainBox = clicked.classList.contains('media-main')
      ? clicked
      : (viewerWrap ? viewerWrap.querySelector('.media-main') : clicked);

    if (!mainBox) { console.error('openVideo: could not find .media-main for key', key); return; }

    const id = getYouTubeId(url);
    if (!id) { window.open(url, '_blank'); return; } // fallback for non-YouTube links

    mainBox.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1"
        style="width:100%;height:100%;border:0;display:block;"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen
      ></iframe>
    `;
    mainBox.style.backgroundImage = 'none';
    mainBox.style.cursor = 'default';
    mainBox.onclick = null;

    if (viewerWrap) {
      viewerWrap.querySelectorAll('.media-card').forEach(c => c.classList.remove('active'));
      if (clicked.classList.contains('media-card')) clicked.classList.add('active');
    }
  };

  // Shows the screenshot in the SECTION'S MAIN viewer, same box the video uses.
  window.openPhoto = function openPhoto(game, idx, el) {
    const url = photoUrls[game] && photoUrls[game][idx];
    if (!url) { alert('Add your screenshot path in the script -> photoUrls.' + game + '[' + idx + ']'); return; }

    const clicked = el || (window.event && window.event.currentTarget);
    if (!clicked) { console.error('openPhoto: no target element passed for', game, idx); return; }

    const viewerWrap = clicked.closest('.media-viewer') || clicked.parentElement;
    const mainBox = clicked.classList.contains('media-main')
      ? clicked
      : (viewerWrap ? viewerWrap.querySelector('.media-main') : clicked);

    if (!mainBox) { console.error('openPhoto: could not find .media-main for', game, idx); return; }

    mainBox.innerHTML = `<img src="${url}" alt="${game} screenshot ${idx + 1}" style="width:100%;height:100%;object-fit:cover;display:block;">`;
    mainBox.style.backgroundImage = 'none';
    mainBox.style.cursor = 'default';
    mainBox.onclick = null;

    if (viewerWrap) {
      viewerWrap.querySelectorAll('.media-card').forEach(c => c.classList.remove('active'));
      if (clicked.classList.contains('media-card')) clicked.classList.add('active');
    }
  };

  // Scrolls the thumbnail rail left/right — called by the ‹ › nav buttons
  window.scrollMedia = function scrollMedia(btn, dir) {
    const shell = btn.closest('.media-rail-shell');
    const rail = shell && shell.querySelector('.media-rail');
    if (!rail) return;
    rail.scrollBy({ left: dir * 160, behavior: 'smooth' });
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
