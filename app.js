/**
 * PINARAKS HAUTE ATELIER & HARDWARE
 * Çok Dilli (TR / EN / AR) - Sinematik Defile & Podyum Motoru
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

// Başlatma
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initPreloader();
  initMagneticCursor();
  initRunwayCinema();
  initMacroLoupe();
  initLookbookRail('all');
  initEventListeners();
  initLanguageSwitcher();
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

  // data-i18n-ph placeholder etiketlerini güncelle
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
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

  // Dropdown ve ribbon aktif sınıfları
  langOptions.forEach(opt => {
    opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
  });
  ribbonLangBtns.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  // WhatsApp doğrudan bağlantısı
  if (directWaLink) {
    const defaultWaText = encodeURIComponent(
      lang === 'ar'
        ? "مرحباً صالة عرض بيناراكس PINARAKS، أتواصل معكم عبر موقعكم للاستفسار عن العينات والمجموعات."
        : lang === 'en'
        ? "Hello Pınaraks Showroom, I am contacting you via your website to inquire about physical samples and collections."
        : "Merhaba, Pınaraks web sitenizden ulaşıyorum. Numune ve koleksiyonlarınız hakkında görüşmek istiyorum."
    );
    directWaLink.href = `https://wa.me/${PHONE_NUMBER}?text=${defaultWaText}`;
  }

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

  // Katalog vitrinini güncel dille yeniden çiz
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
}

// ==========================================================================
// 2. Açılış Preloader
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
// 3. Manyetik Lüks İmleç
// ==========================================================================
function initMagneticCursor() {
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
      if (customMsg === 'DEFİLE') customMsg = t('cursor_defile');
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
// 4. Canlı Defile Podyumu & Video-Vari Geçiş Motoru
// ==========================================================================
function initRunwayCinema() {
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
// 5. 0.1mm Büyüteç (Macro Loupe)
// ==========================================================================
function initMacroLoupe() {
  if (!loupeStage || !loupeBaseImg || !loupeLens) return;

  const zoomFactor = 2.5;
  loupeLens.style.backgroundImage = `url('${loupeBaseImg.src}')`;

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
}

// ==========================================================================
// 6. Lookbook & Ürün Vitrini (Çok Dilli)
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
        <span class="card-tag">${localizedTag}</span>
        <img src="${item.img}" alt="${localizedName}" loading="lazy">
      </div>
      <div class="card-body">
        <span class="card-sku">${item.sku}</span>
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
// 7. Olay Dinleyicileri
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
      const scrollDist = htmlRoot.getAttribute('dir') === 'rtl' ? 420 : -420;
      runwayRailContainer.scrollBy({ left: scrollDist, behavior: 'smooth' });
    });
  }
  if (railNext && runwayRailContainer) {
    railNext.addEventListener('click', () => {
      const scrollDist = htmlRoot.getAttribute('dir') === 'rtl' ? -420 : 420;
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
// 8. Numune Çantası İşlemleri
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
// 9. Lightbox Modal (Çok Dilli)
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
// 10. WhatsApp & Mail Gönderimi (05436970755 & Çok Dilli)
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
// 11. Defile Ambiyans Sesi (Web Audio API)
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
