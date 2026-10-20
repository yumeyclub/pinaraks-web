/**
 * PINARAKS HAUTE ATELIER & HARDWARE
 * Çok Dilli (TR / EN / AR) - Sinematik Defile & Podyum Motoru
 * Kusursuz Mobil & Dokunmatik Ergonomi
 * İletişim Hattı: 05436970755 / +90 543 697 07 55
 */

// Çok Dilli Ürün Kataloğu (translations.js içerisinden veya yerel referans)
const HAUTE_EDITIONS = (typeof MULTILINGUAL_PRODUCTS !== 'undefined') ? MULTILINGUAL_PRODUCTS : [];

// Dil Durumu (TR / EN / AR)
let currentLang = localStorage.getItem('pinaraks_lang') || 'tr';
if (!['tr', 'en', 'ar'].includes(currentLang)) currentLang = 'tr';

const PHONE_NUMBER = "905436970755";
const PHONE_DISPLAY = "+90 (543) 697 07 55";

// Çeviri Yardımcı Fonksiyonu
function t(key) {
  if (typeof TRANSLATIONS === 'undefined') return key;
  const langDict = TRANSLATIONS[currentLang] || TRANSLATIONS['tr'];
  return langDict[key] || (TRANSLATIONS['tr'] && TRANSLATIONS['tr'][key]) || key;
}

function getLocalizedField(field) {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[currentLang] || field['tr'] || '';
}

// State
let sampleBag = [];
let audioContext = null;
let soundOsc = null;
let isAudioPlaying = false;
let currentFilter = 'all';

// Haute Collection State
const COLLECTION_ITEMS = (typeof PINARAKS_COLLECTION_DATA !== 'undefined') ? PINARAKS_COLLECTION_DATA : [];
let colCategory = 'all';
let colSearch = '';
let colVisible = 12;
const COL_STEP = 12;
let toastTimer = null;

// Defile Showreel State
let cinemaCurrentIndex = 0;
let cinemaInterval = null;
let isCinemaPlaying = true;
const CINEMA_DURATION = 5000; // 5 saniye
let cinemaStartTime = Date.now();

// DOM Elemanları
const htmlRoot = document.getElementById('htmlRoot') || document.documentElement;
const metaTitle = document.getElementById('metaTitle');
const metaDesc = document.getElementById('metaDesc');

const couturePreloader = document.getElementById('couturePreloader');
const preloaderBar = document.getElementById('preloaderBar');
const preloaderCounter = document.getElementById('preloaderCounter');

const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
const cursorText = document.getElementById('cursorText');

// Defile Elemanları
const cinemaSlides = document.querySelectorAll('.cinema-slide');
const cinemaMetaTag = document.getElementById('cinemaMetaTag');
const cinemaLookTitle = document.getElementById('cinemaLookTitle');
const btnCinemaPrev = document.getElementById('btnCinemaPrev');
const btnCinemaNext = document.getElementById('btnCinemaNext');
const btnCinemaPlayPause = document.getElementById('btnCinemaPlayPause');
const playPauseIcon = document.getElementById('playPauseIcon');
const playPauseText = document.getElementById('playPauseText');
const cinemaProgressFill = document.getElementById('cinemaProgressFill');
const cinemaStepCount = document.getElementById('cinemaStepCount');

// Büyüteç Elemanları
const loupeStage = document.getElementById('loupeStage');
const loupeBaseImg = document.getElementById('loupeBaseImg');
const loupeLens = document.getElementById('loupeLens');

// Haute Collection Elemanları
const collectionGrid = document.getElementById('collectionGrid');
const collectionCategoryTabs = document.querySelectorAll('#collectionCategoryTabs .cat-pill');
const collectionSearchInput = document.getElementById('collectionSearchInput');
const searchClearBtn = document.getElementById('searchClearBtn');
const collectionCountText = document.getElementById('collectionCountText');
const btnCollectionLoadMore = document.getElementById('btnCollectionLoadMore');
const collectionLoadWrap = document.getElementById('collectionLoadWrap');
const loadMoreSubText = document.getElementById('loadMoreSubText');
const coutureToast = document.getElementById('coutureToast');
const toastTitle = document.getElementById('toastTitle');
const toastDesc = document.getElementById('toastDesc');

// Lookbook & Çekmece Elemanları
const runwayRail = document.getElementById('runwayRail');
const runwayRailContainer = document.getElementById('runwayRailContainer');
const runwayTabs = document.querySelectorAll('.runway-tab');
const railPrev = document.getElementById('railPrev');
const railNext = document.getElementById('railNext');

const sampleBagTrigger = document.getElementById('sampleBagTrigger');
const hauteDrawer = document.getElementById('hauteDrawer');
const drawerScrim = document.getElementById('drawerScrim');
const drawerExitBtn = document.getElementById('drawerExitBtn');
const drawerBagItems = document.getElementById('drawerBagItems');
const drawerEmptyState = document.getElementById('drawerEmptyState');
const drawerItemsCount = document.getElementById('drawerItemsCount');
const bagBadge = document.getElementById('bagBadge');
const btnDispatchWa = document.getElementById('btnDispatchWa');
const btnDispatchMail = document.getElementById('btnDispatchMail');

// Modal Elemanları
const coutureModal = document.getElementById('coutureModal');
const modalExitBtn = document.getElementById('modalExitBtn');
const modalTargetImg = document.getElementById('modalTargetImg');
const modalDiscipline = document.getElementById('modalDiscipline');
const modalItemName = document.getElementById('modalItemName');
const modalSku = document.getElementById('modalSku');
const modalEssay = document.getElementById('modalEssay');
const modalField = document.getElementById('modalField');
const modalAddBtn = document.getElementById('modalAddBtn');
const modalWaBtn = document.getElementById('modalWaBtn');

const soundToggle = document.getElementById('soundToggle');
const soundLabel = document.getElementById('soundLabel');
const conciergeForm = document.getElementById('conciergeForm');
const directWaLink = document.getElementById('directWaLink');

// Dil Seçici Elemanları
const langSelectorDropdown = document.getElementById('langSelectorDropdown');
const langCurrentBtn = document.getElementById('langCurrentBtn');
const currentLangFlag = document.getElementById('currentLangFlag');
const currentLangCode = document.getElementById('currentLangCode');
const langOptions = document.querySelectorAll('.lang-option');
const ribbonLangBtns = document.querySelectorAll('.ribbon-lang-btn');

// Mobil Menü & Bar Elemanları
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileNavDrawer = document.getElementById('mobileNavDrawer');
const mobileNavScrim = document.getElementById('mobileNavScrim');
const mobileDrawerClose = document.getElementById('mobileDrawerClose');
const mobileNavLinks = document.querySelectorAll('.mobile-link');
const mobileLangPills = document.querySelectorAll('.mobile-lang-pill');
const mobileQuickBag = document.getElementById('mobileQuickBag');
const mobileQuickBadge = document.getElementById('mobileQuickBadge');
const mobileQuickWa = document.getElementById('mobileQuickWa');
const mobileDrawerWa = document.getElementById('mobileDrawerWa');
const mobileBtnQuote = document.getElementById('mobileBtnQuote');

// Başlatma
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initPreloader();
  initMagneticCursor();
  initHauteCollection();
  initRunwayCinema();
  initMacroLoupe();
  initLookbookRail('all');
  initEventListeners();
  initLanguageSwitcher();
  initMobileNavigation();
});

// ==========================================================================
// 1. Çok Dilli (i18n) Motoru
// ==========================================================================
function initLanguage() {
  applyLanguage(currentLang);
}

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('pinaraks_lang', lang);

  // HTML root & body nitelikleri
  htmlRoot.setAttribute('lang', lang);
  const isRTL = lang === 'ar';
  htmlRoot.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  document.body.classList.toggle('lang-ar', isRTL);

  // Başlık & Meta Açıklama
  if (metaTitle) document.title = t('meta_title');
  if (metaDesc) metaDesc.setAttribute('content', t('meta_desc'));

  // data-i18n etiketli tüm elemanları güncelle
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = t(key);
    if (translation && translation !== key) {
      el.textContent = translation;
    }
  });

  // data-i18n-ph ve data-i18n-placeholder etiketlerini güncelle
  document.querySelectorAll('[data-i18n-ph], [data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph') || el.getAttribute('data-i18n-placeholder');
    const translation = t(key);
    if (translation && translation !== key) {
      el.placeholder = translation;
    }
  });

  // Dil buton göstergelerini güncelle
  const flagMap = { tr: '🇹🇷', en: '🇬🇧', ar: '🇸🇦' };
  const codeMap = { tr: 'TR', en: 'EN', ar: 'AR' };
  if (currentLangFlag) currentLangFlag.textContent = flagMap[lang] || '🇹🇷';
  if (currentLangCode) currentLangCode.textContent = codeMap[lang] || 'TR';

  // Dropdown, ribbon ve mobil pill aktif sınıfları
  langOptions.forEach(opt => {
    opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
  });
  ribbonLangBtns.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
  mobileLangPills.forEach(pill => {
    pill.classList.toggle('active', pill.getAttribute('data-lang') === lang);
  });

  // WhatsApp bağlantı metinleri
  const defaultWaText = encodeURIComponent(
    lang === 'ar'
      ? "مرحباً صالة عرض بيناراكس PINARAKS، أتواصل معكم عبر موقعكم للاستفسار عن العينات والمجموعات."
      : lang === 'en'
      ? "Hello Pınaraks Showroom, I am contacting you via your website to inquire about physical samples and collections."
      : "Merhaba, Pınaraks web sitenizden ulaşıyorum. Numune ve koleksiyonlarınız hakkında görüşmek istiyorum."
  );

  if (directWaLink) directWaLink.href = `https://wa.me/${PHONE_NUMBER}?text=${defaultWaText}`;
  if (mobileQuickWa) mobileQuickWa.href = `https://wa.me/${PHONE_NUMBER}?text=${defaultWaText}`;
  if (mobileDrawerWa) mobileDrawerWa.href = `https://wa.me/${PHONE_NUMBER}?text=${defaultWaText}`;

  // Defile slide başlığı
  updateCinemaCaption();

  // Defile oynat/duraklat butonu
  if (playPauseText) {
    playPauseText.textContent = isCinemaPlaying ? t('cinema_pause') : t('cinema_play');
  }

  // Ses butonu etiketi
  if (soundLabel) {
    soundLabel.textContent = isAudioPlaying ? t('sound_label_on') : t('sound_label_off');
  }

  // Koleksiyon vitrinini güncel dille yeniden çiz
  if (typeof renderHauteCollection === 'function') renderHauteCollection();

  // Branşlar vitrinini güncel dille yeniden çiz
  initLookbookRail(currentFilter);

  // Çanta içeriğini güncelle
  renderBagUI();
}

function initLanguageSwitcher() {
  if (langCurrentBtn && langSelectorDropdown) {
    langCurrentBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = langSelectorDropdown.classList.toggle('open');
      langCurrentBtn.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!langSelectorDropdown.contains(e.target)) {
        langSelectorDropdown.classList.remove('open');
        langCurrentBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  langOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const selected = opt.getAttribute('data-lang');
      applyLanguage(selected);
      if (langSelectorDropdown) {
        langSelectorDropdown.classList.remove('open');
        langCurrentBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  ribbonLangBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.getAttribute('data-lang');
      applyLanguage(selected);
    });
  });

  mobileLangPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const selected = pill.getAttribute('data-lang');
      applyLanguage(selected);
    });
  });
}

// ==========================================================================
// 2. Mobil Menü ve Gezinme Sistemi
// ==========================================================================
function initMobileNavigation() {
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      if (mobileNavDrawer && mobileNavDrawer.classList.contains('active')) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });
  }

  if (mobileDrawerClose) {
    mobileDrawerClose.addEventListener('click', closeMobileDrawer);
  }

  if (mobileNavScrim) {
    mobileNavScrim.addEventListener('click', closeMobileDrawer);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileDrawer();
    });
  });

  if (mobileBtnQuote) {
    mobileBtnQuote.addEventListener('click', closeMobileDrawer);
  }

  if (mobileQuickBag) {
    mobileQuickBag.addEventListener('click', openDrawer);
  }
}

function openMobileDrawer() {
  if (mobileNavDrawer) mobileNavDrawer.classList.add('active');
  if (mobileNavScrim) mobileNavScrim.classList.add('active');
  if (mobileMenuToggle) {
    mobileMenuToggle.classList.add('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
  }
  document.body.style.overflow = 'hidden';
}

function closeMobileDrawer() {
  if (mobileNavDrawer) mobileNavDrawer.classList.remove('active');
  if (mobileNavScrim) mobileNavScrim.classList.remove('active');
  if (mobileMenuToggle) {
    mobileMenuToggle.classList.remove('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
  }
  document.body.style.overflow = '';
}

// ==========================================================================
// 3. Açılış Preloader
// ==========================================================================
function initPreloader() {
  let count = 0;
  const interval = setInterval(() => {
    count += Math.floor(Math.random() * 8) + 4;
    if (count > 100) count = 100;
    
    if (preloaderBar) preloaderBar.style.width = `${count}%`;
    if (preloaderCounter) preloaderCounter.textContent = `${count < 10 ? '0' + count : count}%`;

    if (count === 100) {
      clearInterval(interval);
      setTimeout(() => {
        if (couturePreloader) couturePreloader.classList.add('loaded');
      }, 350);
    }
  }, 35);
}

// ==========================================================================
// 4. Manyetik Lüks İmleç (Yalnızca Masaüstü)
// ==========================================================================
function initMagneticCursor() {
  // Dokunmatik cihazlarda imleç motorunu çalıştırma
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
  if (!cursorDot || !cursorRing || !cursorText) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  bindCursorHoverEvents();
}

function bindCursorHoverEvents() {
  if (!cursorRing || !cursorText) return;
  document.querySelectorAll('.hover-reveal, a, button, .brand-logo-card, .master-pillar-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      let customMsg = el.getAttribute('data-cursor');
      if (customMsg === 'DEFİLE' || customMsg === 'KOLEKSİYON') customMsg = t('cursor_koleksiyon') || t('cursor_defile');
      else if (customMsg === 'KATALOG') customMsg = t('cursor_catalog');
      else if (customMsg === 'BÜYÜT') customMsg = t('cursor_zoom');
      else if (customMsg === 'İNCELE') customMsg = t('cursor_inspect');
      else if (!customMsg) customMsg = t('cursor_inspect');

      cursorText.textContent = customMsg;
      cursorRing.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.classList.remove('active');
      cursorText.textContent = '';
    });
  });
}

// ==========================================================================
// 5. Canlı Defile Podyumu & Video-Vari Geçiş Motoru
// ==========================================================================
function initRunwayCinema() {
  if (!cinemaSlides || cinemaSlides.length === 0) return;
  updateCinemaSlide(0);
  startCinemaTimer();

  if (btnCinemaNext) {
    btnCinemaNext.addEventListener('click', () => {
      nextCinemaSlide();
      resetCinemaTimer();
    });
  }

  if (btnCinemaPrev) {
    btnCinemaPrev.addEventListener('click', () => {
      prevCinemaSlide();
      resetCinemaTimer();
    });
  }

  if (btnCinemaPlayPause) {
    btnCinemaPlayPause.addEventListener('click', toggleCinemaPlayPause);
  }
}

function updateCinemaCaption() {
  if (!cinemaLookTitle || !cinemaMetaTag) return;
  if (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[currentLang]?.cinema_slides?.[cinemaCurrentIndex]) {
    const slideInfo = TRANSLATIONS[currentLang].cinema_slides[cinemaCurrentIndex];
    cinemaLookTitle.textContent = slideInfo.look;
    cinemaMetaTag.textContent = slideInfo.meta;
  }
}

function updateCinemaSlide(index) {
  cinemaSlides.forEach((slide, i) => {
    if (i === index) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });

  cinemaCurrentIndex = index;
  updateCinemaCaption();

  if (cinemaStepCount) {
    cinemaStepCount.innerHTML = `<span class="active-step">0${index + 1}</span> / 04`;
  }
  cinemaStartTime = Date.now();
}

function nextCinemaSlide() {
  const nextIdx = (cinemaCurrentIndex + 1) % (cinemaSlides.length || 4);
  updateCinemaSlide(nextIdx);
}

function prevCinemaSlide() {
  const total = cinemaSlides.length || 4;
  const prevIdx = (cinemaCurrentIndex - 1 + total) % total;
  updateCinemaSlide(prevIdx);
}

function startCinemaTimer() {
  if (cinemaInterval) clearInterval(cinemaInterval);
  cinemaStartTime = Date.now();

  cinemaInterval = setInterval(() => {
    if (!isCinemaPlaying) return;

    const elapsed = Date.now() - cinemaStartTime;
    const progress = Math.min((elapsed / CINEMA_DURATION) * 100, 100);
    if (cinemaProgressFill) cinemaProgressFill.style.width = `${progress}%`;

    if (elapsed >= CINEMA_DURATION) {
      nextCinemaSlide();
    }
  }, 50);
}

function resetCinemaTimer() {
  cinemaStartTime = Date.now();
  if (cinemaProgressFill) cinemaProgressFill.style.width = '0%';
}

function toggleCinemaPlayPause() {
  isCinemaPlaying = !isCinemaPlaying;
  if (isCinemaPlaying) {
    if (playPauseIcon) playPauseIcon.textContent = '⏸';
    if (playPauseText) playPauseText.textContent = t('cinema_pause');
    cinemaStartTime = Date.now();
  } else {
    if (playPauseIcon) playPauseIcon.textContent = '▶';
    if (playPauseText) playPauseText.textContent = t('cinema_play');
  }
}

// ==========================================================================
// 6. 0.1mm Büyüteç (Macro Loupe) - Masaüstü & Dokunmatik Desteği
// ==========================================================================
function initMacroLoupe() {
  if (!loupeStage || !loupeBaseImg || !loupeLens) return;

  const zoomFactor = 2.5;
  loupeLens.style.backgroundImage = `url('${loupeBaseImg.src}')`;

  // Masaüstü Fare Olayları
  loupeStage.addEventListener('mouseenter', () => {
    loupeLens.style.display = 'block';
  });

  loupeStage.addEventListener('mouseleave', () => {
    loupeLens.style.display = 'none';
  });

  loupeStage.addEventListener('mousemove', (e) => {
    const rect = loupeBaseImg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
      loupeLens.style.display = 'none';
      return;
    }

    loupeLens.style.display = 'block';

    const lensRadius = loupeLens.offsetWidth / 2;
    loupeLens.style.left = `${x - lensRadius}px`;
    loupeLens.style.top = `${y - lensRadius}px`;

    const bgX = (x / rect.width) * 100;
    const bgY = (y / rect.height) * 100;

    loupeLens.style.backgroundSize = `${rect.width * zoomFactor}px ${rect.height * zoomFactor}px`;
    loupeLens.style.backgroundPosition = `${bgX}% ${bgY}%`;
  });

  // Mobil Dokunmatik Olayları
  function handleLoupeTouch(e) {
    if (!e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = loupeBaseImg.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
      loupeLens.style.display = 'none';
      return;
    }

    loupeLens.style.display = 'block';

    const lensRadius = loupeLens.offsetWidth / 2;
    // Parmak görüntüyü engellemesin diye büyüteci parmağın hafif yukarısına konumlandır
    loupeLens.style.left = `${x - lensRadius}px`;
    loupeLens.style.top = `${y - lensRadius - 60}px`;

    const bgX = (x / rect.width) * 100;
    const bgY = (y / rect.height) * 100;

    loupeLens.style.backgroundSize = `${rect.width * zoomFactor}px ${rect.height * zoomFactor}px`;
    loupeLens.style.backgroundPosition = `${bgX}% ${bgY}%`;
  }

  loupeStage.addEventListener('touchstart', (e) => {
    loupeLens.style.display = 'block';
    handleLoupeTouch(e);
  }, { passive: true });

  loupeStage.addEventListener('touchmove', (e) => {
    handleLoupeTouch(e);
  }, { passive: true });

  loupeStage.addEventListener('touchend', () => {
    loupeLens.style.display = 'none';
  });
}

// ==========================================================================
// 7. Lookbook & Ürün Vitrini (Çok Dilli)
// ==========================================================================
function initLookbookRail(filter) {
  if (!runwayRail) return;
  currentFilter = filter || 'all';
  runwayRail.innerHTML = '';
  
  const filtered = currentFilter === 'all' 
    ? HAUTE_EDITIONS 
    : HAUTE_EDITIONS.filter(p => p.cat === currentFilter);

  filtered.forEach((item) => {
    const localizedName = getLocalizedField(item.name);
    const localizedTag = getLocalizedField(item.tag);
    const localizedDesc = getLocalizedField(item.desc);

    const card = document.createElement('div');
    card.className = 'runway-card hover-reveal';
    card.setAttribute('data-cursor', 'İNCELE');
    card.innerHTML = `
      <div class="card-visual-chamber" onclick="openCoutureModal('${item.id}')">
        <img src="${item.img}" alt="${localizedName}" loading="lazy">
      </div>
      <div class="card-body">
        <div class="card-meta-line">
          <span class="card-tag">${localizedTag}</span>
          <span class="card-sku">${item.sku}</span>
        </div>
        <h3 class="card-name">${localizedName}</h3>
        <p class="card-lead">${localizedDesc}</p>
        <div class="card-actions">
          <button class="btn-card-sample" onclick="addSampleToBag('${item.id}')">
            <span>${t('btn_add_sample')}</span>
          </button>
          <button class="btn-card-detail" onclick="openCoutureModal('${item.id}')" title="Detayı İncele">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </button>
        </div>
      </div>
    `;
    runwayRail.appendChild(card);
  });

  // İmleç olaylarını bağla
  bindCursorHoverEvents();
}

// ==========================================================================
// 8. Olay Dinleyicileri
// ==========================================================================
function initEventListeners() {
  // Filtre Sekmeleri
  runwayTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      runwayTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      initLookbookRail(tab.dataset.filter);
    });
  });

  // Ray İleri / Geri Butonları
  if (railPrev && runwayRailContainer) {
    railPrev.addEventListener('click', () => {
      const scrollDist = htmlRoot.getAttribute('dir') === 'rtl' ? 360 : -360;
      runwayRailContainer.scrollBy({ left: scrollDist, behavior: 'smooth' });
    });
  }
  if (railNext && runwayRailContainer) {
    railNext.addEventListener('click', () => {
      const scrollDist = htmlRoot.getAttribute('dir') === 'rtl' ? -360 : 360;
      runwayRailContainer.scrollBy({ left: scrollDist, behavior: 'smooth' });
    });
  }

  // Çekmece Aç/Kapa
  if (sampleBagTrigger) sampleBagTrigger.addEventListener('click', openDrawer);
  if (drawerExitBtn) drawerExitBtn.addEventListener('click', closeDrawer);
  if (drawerScrim) drawerScrim.addEventListener('click', closeDrawer);

  // Modal Aç/Kapa
  if (modalExitBtn) modalExitBtn.addEventListener('click', closeModal);
  if (coutureModal) {
    coutureModal.addEventListener('click', (e) => {
      if (e.target === coutureModal) closeModal();
    });
  }

  // WhatsApp & Mail Gönderim
  if (btnDispatchWa) btnDispatchWa.addEventListener('click', dispatchSampleBagViaWhatsApp);
  if (btnDispatchMail) btnDispatchMail.addEventListener('click', dispatchSampleBagViaMail);

  // Defile Müziği
  if (soundToggle) soundToggle.addEventListener('click', toggleAmbientSound);

  // Concierge / Teklif Formu
  if (conciergeForm) {
    conciergeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cName').value;
      const brand = document.getElementById('cBrand').value;
      const phone = document.getElementById('cPhone').value;
      const disc = document.getElementById('cDiscipline').value;
      const note = document.getElementById('cMessage').value;

      alert(`${name} (${brand})\n${t('alert_form_thanks')}`);

      const confirmWA = confirm(t('prompt_wa_speedup'));
      if (confirmWA) {
        const text = t('wa_form_msg')
          .replace('{name}', `${name} (${phone})`)
          .replace('{brand}', brand)
          .replace('{disc}', disc)
          .replace('{note}', note);
        window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
      }
      conciergeForm.reset();
    });
  }
}

// ==========================================================================
// 9. Numune Çantası İşlemleri
// ==========================================================================
window.addSampleToBag = function(id) {
  const item = HAUTE_EDITIONS.find(p => p.id === id);
  if (!item) return;

  if (sampleBag.some(p => p.id === id)) {
    alert(`${item.sku} ${t('alert_already_in_bag')}`);
    openDrawer();
    return;
  }

  sampleBag.push(item);
  renderBagUI();
  openDrawer();
};

window.removeSampleFromBag = function(id) {
  sampleBag = sampleBag.filter(p => p.id !== id);
  renderBagUI();
};

function renderBagUI() {
  if (bagBadge) bagBadge.textContent = sampleBag.length;
  if (mobileQuickBadge) mobileQuickBadge.textContent = sampleBag.length;
  if (drawerItemsCount) drawerItemsCount.textContent = `${sampleBag.length} ${t('drawer_count_unit')}`;

  if (!drawerEmptyState || !drawerBagItems) return;

  if (sampleBag.length === 0) {
    drawerEmptyState.style.display = 'block';
    drawerBagItems.innerHTML = '';
  } else {
    drawerEmptyState.style.display = 'none';
    drawerBagItems.innerHTML = '';

    sampleBag.forEach(p => {
      const localizedName = getLocalizedField(p.name);
      const card = document.createElement('div');
      card.className = 'bag-item-card';
      card.innerHTML = `
        <img src="${p.img}" alt="${localizedName}" class="bag-item-thumb">
        <div class="bag-item-details">
          <span class="bag-item-sku">${p.sku}</span>
          <h4 class="bag-item-title">${localizedName}</h4>
        </div>
        <button class="btn-remove-sample" onclick="removeSampleFromBag('${p.id}')" title="Kaldır">&times;</button>
      `;
      drawerBagItems.appendChild(card);
    });
  }
}

function openDrawer() {
  if (hauteDrawer) hauteDrawer.classList.add('active');
  if (drawerScrim) drawerScrim.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  if (hauteDrawer) hauteDrawer.classList.remove('active');
  if (drawerScrim) drawerScrim.classList.remove('active');
  document.body.style.overflow = '';
}

// ==========================================================================
// 10. Lightbox Modal (Çok Dilli)
// ==========================================================================
window.openCoutureModal = function(id) {
  const item = HAUTE_EDITIONS.find(p => p.id === id);
  if (!item) return;

  const localizedName = getLocalizedField(item.name);
  const localizedTag = getLocalizedField(item.tag);
  const localizedDesc = getLocalizedField(item.desc);
  const localizedApp = getLocalizedField(item.app);

  if (modalTargetImg) modalTargetImg.src = item.img;
  if (modalDiscipline) modalDiscipline.textContent = localizedTag;
  if (modalItemName) modalItemName.textContent = localizedName;
  if (modalSku) modalSku.textContent = `${t('modal_sku_prefix')}${item.sku}`;
  if (modalEssay) modalEssay.textContent = localizedDesc;
  if (modalField) modalField.textContent = localizedApp;

  if (modalAddBtn) {
    modalAddBtn.onclick = () => {
      addSampleToBag(item.id);
      closeModal();
    };
  }

  if (modalWaBtn) {
    const askText = encodeURIComponent(
      t('wa_single_ask')
        .replace('{sku}', item.sku)
        .replace('{name}', localizedName)
    );
    modalWaBtn.href = `https://wa.me/${PHONE_NUMBER}?text=${askText}`;
  }

  if (coutureModal) {
    coutureModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

function closeModal() {
  if (coutureModal) {
    coutureModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ==========================================================================
// 11. WhatsApp & Mail Gönderimi (05436970755 & Çok Dilli)
// ==========================================================================
function dispatchSampleBagViaWhatsApp() {
  if (sampleBag.length === 0) {
    alert(t('alert_bag_empty'));
    return;
  }

  let text = t('wa_sample_header');
  sampleBag.forEach((item, index) => {
    const localizedName = getLocalizedField(item.name);
    const localizedTag = getLocalizedField(item.tag);
    text += `${index + 1}. [${item.sku}] ${localizedName} (${localizedTag})\n`;
  });
  text += t('wa_sample_footer');

  window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
}

function dispatchSampleBagViaMail() {
  if (sampleBag.length === 0) {
    alert(t('alert_bag_empty'));
    return;
  }

  let body = t('mail_sample_body_header');
  sampleBag.forEach((p, idx) => {
    const localizedName = getLocalizedField(p.name);
    body += `${idx + 1}. SKU: ${p.sku} - ${localizedName}%0D%0A`;
  });
  body += t('mail_sample_body_footer');

  const subject = encodeURIComponent(t('mail_sample_subject'));
  window.location.href = `mailto:info@pinaraks.com?subject=${subject}&body=${body}`;
}

// ==========================================================================
// 12. Defile Ambiyans Sesi (Web Audio API)
// ==========================================================================
function toggleAmbientSound() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (isAudioPlaying) {
    if (soundOsc) {
      soundOsc.stop();
      soundOsc.disconnect();
    }
    isAudioPlaying = false;
    if (soundToggle) soundToggle.classList.remove('playing');
    if (soundLabel) soundLabel.textContent = t('sound_label_off');
  } else {
    audioContext.resume();
    soundOsc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    soundOsc.type = 'sine';
    soundOsc.frequency.setValueAtTime(55, audioContext.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.001, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.04, audioContext.currentTime + 2);

    soundOsc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    soundOsc.start();
    isAudioPlaying = true;
    if (soundToggle) soundToggle.classList.add('playing');
    if (soundLabel) soundLabel.textContent = t('sound_label_on');
  }
}


// ==========================================================================
// 13. PINARAKS HAUTE STOK & TAŞLI AKSESUAR KOLEKSİYONU MOTORU
// ==========================================================================
function initHauteCollection() {
  if (!collectionGrid) return;

  // Kategori Sekmeleri
  if (collectionCategoryTabs) {
    collectionCategoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        collectionCategoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        colCategory = tab.dataset.cat || 'all';
        colVisible = 12;
        renderHauteCollection();
      });
    });
  }

  // Canlı Arama
  if (collectionSearchInput) {
    collectionSearchInput.addEventListener('input', (e) => {
      colSearch = e.target.value.trim().toLowerCase();
      if (searchClearBtn) searchClearBtn.style.display = colSearch ? 'block' : 'none';
      colVisible = 12;
      renderHauteCollection();
    });
  }

  // Arama Temizle
  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (collectionSearchInput) collectionSearchInput.value = '';
      colSearch = '';
      searchClearBtn.style.display = 'none';
      colVisible = 12;
      renderHauteCollection();
      if (collectionSearchInput) collectionSearchInput.focus();
    });
  }

  // Daha Fazla Yükle Butonu
  if (btnCollectionLoadMore) {
    btnCollectionLoadMore.addEventListener('click', () => {
      colVisible += COL_STEP;
      renderHauteCollection(true);
    });
  }

  renderHauteCollection();
}

function getFilteredCollection() {
  return COLLECTION_ITEMS.filter(item => {
    // Kategori kontrolü
    if (colCategory !== 'all' && item.cat !== colCategory) {
      return false;
    }
    // Arama kontrolü
    if (colSearch) {
      const q = colSearch;
      const sku = (item.sku || '').toLowerCase();
      const trName = (item.name?.tr || '').toLowerCase();
      const enName = (item.name?.en || '').toLowerCase();
      const arName = (item.name?.ar || '').toLowerCase();
      const trDesc = (item.desc?.tr || '').toLowerCase();
      const enDesc = (item.desc?.en || '').toLowerCase();
      const spec = (item.spec || '').toLowerCase();
      const app = (item.app || '').toLowerCase();
      const badgeTr = (item.badge?.tr || '').toLowerCase();
      const badgeEn = (item.badge?.en || '').toLowerCase();

      const matched = sku.includes(q) ||
        trName.includes(q) ||
        enName.includes(q) ||
        arName.includes(q) ||
        trDesc.includes(q) ||
        enDesc.includes(q) ||
        spec.includes(q) ||
        app.includes(q) ||
        badgeTr.includes(q) ||
        badgeEn.includes(q);

      if (!matched) return false;
    }
    return true;
  });
}

function renderHauteCollection(isAppending = false) {
  if (!collectionGrid) return;

  const filtered = getFilteredCollection();
  const total = filtered.length;
  const visibleItems = filtered.slice(0, colVisible);

  // Sayaç ve istatistik
  if (collectionCountText) {
    if (colSearch || colCategory !== 'all') {
      collectionCountText.textContent = `${total} MODEL BULUNDU`;
    } else {
      collectionCountText.textContent = `${total} ${t('col_models_count')}`;
    }
  }

  // Daha Fazla Yükle butonu kontrolü
  if (collectionLoadWrap && btnCollectionLoadMore) {
    if (visibleItems.length < total) {
      collectionLoadWrap.style.display = 'flex';
      const remaining = total - visibleItems.length;
      if (loadMoreSubText) {
        loadMoreSubText.textContent = `(Kalan ${remaining} Model)`;
      }
    } else {
      collectionLoadWrap.style.display = 'none';
    }
  }

  if (!isAppending) {
    collectionGrid.innerHTML = '';
  }

  if (visibleItems.length === 0) {
    collectionGrid.innerHTML = `
      <div class="collection-empty-state">
        <div class="empty-icon">🔍</div>
        <h3>Eşleşen Model Bulunamadı</h3>
        <p>Arama filtrenizi değiştirerek diğer lüks taşlı aksesuarlarımızı inceleyebilirsiniz.</p>
        <button class="btn-haute-reset" onclick="resetCollectionFilters()">Tüm Modelleri Göster (56)</button>
      </div>
    `;
    return;
  }

  const itemsToRender = isAppending ? filtered.slice(colVisible - COL_STEP, colVisible) : visibleItems;

  itemsToRender.forEach((item, idx) => {
    const localizedName = getLocalizedField(item.name);
    const localizedBadge = item.badge ? getLocalizedField(item.badge) : 'PINARAKS COUTURE';
    const localizedDesc = getLocalizedField(item.desc);
    const spec = item.spec || '';

    const card = document.createElement('article');
    card.className = 'collection-card hover-reveal';
    card.setAttribute('data-id', item.id);
    card.style.animationDelay = `${(idx % 12) * 0.04}s`;

    card.innerHTML = `
      <div class="card-visual-chamber">
        <img src="${item.img}" alt="${localizedName}" loading="lazy" class="collection-card-img" onclick="openCoutureModal('${item.id}')">
        <div class="card-glow-overlay"></div>
        <div class="card-floating-badges">
          <span class="badge-brand-ref">${localizedBadge}</span>
          <span class="badge-sku-code">${item.sku}</span>
        </div>
        <div class="card-quick-actions-bar">
          <button type="button" class="btn-quick-zoom" onclick="openCoutureModal('${item.id}')" title="${t('btn_inspect')}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <span>${t('btn_inspect')}</span>
          </button>
          <a href="https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(t('wa_single_ask').replace('{sku}', item.sku).replace('{name}', localizedName))}" target="_blank" class="btn-quick-wa" title="${t('btn_wa_ask')}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.074-2.18-.54-1.896-.782-3.117-2.73-3.212-2.857-.095-.128-.772-1.029-.772-1.961 0-.933.489-1.391.662-1.583.174-.192.379-.24.506-.24.127 0 .254.002.365.008.118.006.276-.045.431.328.16.386.549 1.339.598 1.437.049.098.082.213.016.344-.066.13-.099.212-.196.326-.098.115-.206.257-.294.345-.098.098-.2.205-.086.401.114.196.508.838 1.09 1.356.749.667 1.381.873 1.577.971.196.098.311.082.425-.049.115-.131.492-.573.623-.77.131-.197.262-.164.442-.098.18.066 1.146.54 1.343.639.197.098.328.147.377.23.049.082.049.475-.095.88zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.306C8.423 21.536 10.153 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
          </a>
        </div>
      </div>
      <div class="collection-card-body">
        <h3 class="collection-card-title">${localizedName}</h3>
        <p class="collection-card-desc">${localizedDesc}</p>
        <div class="collection-card-spec">${spec}</div>
        <div class="collection-card-footer">
          <button type="button" class="btn-card-add-sample" onclick="addSampleToBag('${item.id}')">
            <span class="plus-icon">+</span>
            <span>${t('btn_add_sample')}</span>
          </button>
          <button type="button" class="btn-card-view-modal" onclick="openCoutureModal('${item.id}')" title="${t('btn_inspect')}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </button>
        </div>
      </div>
    `;

    collectionGrid.appendChild(card);
  });

  bindCursorHoverEvents();
}

window.resetCollectionFilters = function() {
  colCategory = 'all';
  colSearch = '';
  colVisible = 12;
  if (collectionSearchInput) collectionSearchInput.value = '';
  if (searchClearBtn) searchClearBtn.style.display = 'none';
  if (collectionCategoryTabs) {
    collectionCategoryTabs.forEach(t => {
      t.classList.toggle('active', (t.dataset.cat || 'all') === 'all');
    });
  }
  renderHauteCollection();
};

function showCoutureToast(title, desc) {
  if (!coutureToast) return;
  if (toastTitle) toastTitle.textContent = title;
  if (toastDesc) toastDesc.textContent = desc;

  coutureToast.classList.add('visible');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    coutureToast.classList.remove('visible');
  }, 3200);
}
