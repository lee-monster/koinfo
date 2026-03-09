// TravelKo - travel.koinfo.kr Main Application
// Requires: site-config.js (SITE), sites/travel/lang.js (translations)

(function() {
  'use strict';

  // === State ===
  var state = {
    lang: localStorage.getItem('travelko_lang') || 'en',
    category: 'all',
    region: '',
    search: '',
    spots: [],
    hasMore: false,
    nextCursor: null,
    loading: false,
    selectedSpot: null,
    map: null,
    markers: [],
    infoWindows: [],
    mapLoaded: false
  };

  var CAT_ICONS = {
    food: '🍜', attraction: '🏛️', cafe: '☕',
    nature: '🌿', shopping: '🛍️', nightlife: '🌙'
  };

  // === i18n ===
  function t(key) {
    var lang = state.lang;
    if (translations && translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    if (translations && translations.en && translations.en[key]) {
      return translations.en[key];
    }
    return key;
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-ph');
      el.placeholder = t(key);
    });
  }

  // === Language ===
  window.taSetLanguage = function(lang) {
    state.lang = lang;
    localStorage.setItem('travelko_lang', lang);
    document.getElementById('ta-lang-select').value = lang;
    applyTranslations();
    // Re-render list with current spots
    renderSpotList();
    // Re-render detail if open
    if (state.selectedSpot) {
      renderDetail(state.selectedSpot);
    }
  };

  function initLanguage() {
    var select = document.getElementById('ta-lang-select');
    select.value = state.lang;
  }

  // === API ===
  function fetchSpots(append) {
    if (state.loading) return;
    state.loading = true;

    var loadingEl = document.getElementById('ta-loading');
    if (!append) {
      loadingEl.textContent = t('app.loading');
      loadingEl.style.display = '';
    }

    var params = new URLSearchParams();
    params.set('lang', state.lang);
    params.set('limit', '20');
    if (state.category !== 'all') params.set('category', state.category);
    if (state.region) params.set('region', state.region);
    if (append && state.nextCursor) params.set('cursor', state.nextCursor);

    fetch('/api/travel-spots?' + params.toString())
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (append) {
          state.spots = state.spots.concat(data.items || []);
        } else {
          state.spots = data.items || [];
        }
        state.hasMore = data.hasMore || false;
        state.nextCursor = data.nextCursor || null;
        state.loading = false;

        var filtered = filterBySearch(state.spots);
        renderSpotList(filtered);
        renderMapMarkers(filtered);
      })
      .catch(function() {
        state.loading = false;
        loadingEl.textContent = t('app.noResults');
        loadingEl.style.display = '';
      });
  }

  function filterBySearch(spots) {
    if (!state.search) return spots;
    var q = state.search.toLowerCase();
    return spots.filter(function(s) {
      return (s.name && s.name.toLowerCase().includes(q)) ||
             (s.description && s.description.toLowerCase().includes(q)) ||
             (s.address && s.address.toLowerCase().includes(q)) ||
             (s.tags && s.tags.join(' ').toLowerCase().includes(q));
    });
  }

  // === Render Spot List ===
  function renderSpotList(spots) {
    spots = spots || filterBySearch(state.spots);
    var listEl = document.getElementById('ta-list');
    var loadingEl = document.getElementById('ta-loading');

    if (spots.length === 0) {
      loadingEl.textContent = t('app.noResults');
      loadingEl.style.display = '';
      // Remove all cards but keep loading
      listEl.querySelectorAll('.ta-spot-card, .ta-load-more').forEach(function(el) { el.remove(); });
      return;
    }

    loadingEl.style.display = 'none';

    var html = spots.map(function(spot) {
      var catClass = 'cat-' + (spot.category || 'attraction');
      var thumb = spot.coverImage
        ? '<div class="ta-spot-thumb"><img src="' + escapeAttr(spot.coverImage) + '" alt="' + escapeAttr(spot.name) + '" loading="lazy"></div>'
        : '<div class="ta-spot-thumb"><span class="ta-spot-thumb-empty">' + (CAT_ICONS[spot.category] || '📍') + '</span></div>';

      var meta = '';
      if (spot.featured) meta += '<span class="ta-spot-featured">⭐ ' + t('app.featured') + '</span>';
      if (spot.rating) meta += '<span class="ta-spot-rating">★ ' + spot.rating.toFixed(1) + '</span>';
      if (spot.region) meta += '<span>' + spot.region + '</span>';

      return '<div class="ta-spot-card" data-id="' + spot.id + '">' +
        thumb +
        '<div class="ta-spot-info">' +
          '<span class="ta-spot-cat ' + catClass + '">' + getCatLabel(spot.category) + '</span>' +
          '<div class="ta-spot-name">' + escapeHtml(spot.name) + '</div>' +
          '<div class="ta-spot-meta">' + meta + '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    if (state.hasMore) {
      html += '<button class="ta-load-more" id="ta-load-more">' + t('app.loadMore') + '</button>';
    }

    // Keep loading element, replace rest
    listEl.querySelectorAll('.ta-spot-card, .ta-load-more').forEach(function(el) { el.remove(); });
    listEl.insertAdjacentHTML('beforeend', html);

    // Bind click events
    listEl.querySelectorAll('.ta-spot-card').forEach(function(card) {
      card.addEventListener('click', function() {
        var id = card.getAttribute('data-id');
        var spot = state.spots.find(function(s) { return s.id === id; });
        if (spot) showDetail(spot);
      });
    });

    var loadMoreBtn = document.getElementById('ta-load-more');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', function() { fetchSpots(true); });
    }
  }

  function getCatLabel(cat) {
    var key = 'app.cat' + cat.charAt(0).toUpperCase() + cat.slice(1);
    return t(key);
  }

  // === Detail Panel ===
  function showDetail(spot) {
    state.selectedSpot = spot;

    // Hide list, show detail
    document.getElementById('ta-list').style.display = 'none';
    document.querySelector('.ta-filters').style.display = 'none';
    var detail = document.getElementById('ta-detail');
    detail.classList.add('active');

    renderDetail(spot);

    // Highlight on map
    highlightMarker(spot);

    // Highlight card
    document.querySelectorAll('.ta-spot-card').forEach(function(c) { c.classList.remove('active'); });
    var card = document.querySelector('.ta-spot-card[data-id="' + spot.id + '"]');
    if (card) card.classList.add('active');
  }

  function renderDetail(spot) {
    // Images
    var imagesEl = document.getElementById('ta-detail-images');
    var allImages = [];
    if (spot.coverImage) allImages.push(spot.coverImage);
    if (spot.photos) allImages = allImages.concat(spot.photos);
    // Deduplicate
    allImages = allImages.filter(function(v, i, a) { return a.indexOf(v) === i; });

    if (allImages.length > 0) {
      imagesEl.innerHTML = allImages.map(function(url) {
        return '<img src="' + escapeAttr(url) + '" alt="' + escapeAttr(spot.name) + '">';
      }).join('');
      imagesEl.style.display = '';
    } else {
      imagesEl.style.display = 'none';
      imagesEl.innerHTML = '';
    }

    // Category badge
    var catEl = document.getElementById('ta-detail-cat');
    catEl.textContent = getCatLabel(spot.category);
    catEl.className = 'ta-spot-cat cat-' + (spot.category || 'attraction');

    // Name
    document.getElementById('ta-detail-name').textContent = spot.name;

    // Meta
    var metaHtml = '';
    if (spot.rating) metaHtml += '<span class="ta-detail-stars">★ ' + spot.rating.toFixed(1) + '</span>';
    if (spot.featured) metaHtml += '<span style="color:var(--t-primary);font-weight:600;">⭐ ' + t('app.featured') + '</span>';
    if (spot.region) metaHtml += '<span>📍 ' + escapeHtml(spot.region) + '</span>';
    if (spot.submittedBy) metaHtml += '<span>by ' + escapeHtml(spot.submittedBy) + '</span>';
    document.getElementById('ta-detail-meta').innerHTML = metaHtml;

    // Tags (Instagram + regular tags)
    var tagsHtml = '';
    if (spot.instagram) {
      var igTags = spot.instagram.split(/[\s,]+/).filter(Boolean);
      igTags.forEach(function(tag) {
        var clean = tag.replace(/^[@#]/, '');
        if (tag.startsWith('@')) {
          tagsHtml += '<a href="https://instagram.com/' + encodeURIComponent(clean) + '" target="_blank" rel="noopener" class="ta-detail-tag ta-detail-tag-ig">@' + escapeHtml(clean) + '</a>';
        } else {
          tagsHtml += '<a href="https://instagram.com/explore/tags/' + encodeURIComponent(clean) + '" target="_blank" rel="noopener" class="ta-detail-tag ta-detail-tag-ig">#' + escapeHtml(clean) + '</a>';
        }
      });
    }
    if (spot.tags && spot.tags.length > 0) {
      spot.tags.forEach(function(tag) {
        tagsHtml += '<span class="ta-detail-tag ta-detail-tag-tag">' + escapeHtml(tag) + '</span>';
      });
    }
    document.getElementById('ta-detail-tags').innerHTML = tagsHtml;

    // Description
    var descEl = document.getElementById('ta-detail-desc');
    descEl.textContent = spot.description || '';

    // Address
    var addrEl = document.getElementById('ta-detail-address');
    if (spot.address) {
      addrEl.innerHTML = '📍 ' + escapeHtml(spot.address);
      addrEl.style.display = '';
    } else {
      addrEl.style.display = 'none';
    }

    // Actions (Naver Map link)
    var actionsEl = document.getElementById('ta-detail-actions');
    var actionsHtml = '';
    if (spot.naverMapLink) {
      actionsHtml += '<a href="' + escapeAttr(spot.naverMapLink) + '" target="_blank" rel="noopener" class="ta-detail-naver">🗺️ ' + t('app.openNaver') + '</a>';
    } else if (spot.lat && spot.lng) {
      actionsHtml += '<a href="https://map.naver.com/p/search/' + spot.lat + ',' + spot.lng + '?c=' + spot.lng + ',' + spot.lat + ',15,0,0,0,dh" target="_blank" rel="noopener" class="ta-detail-naver">🗺️ ' + t('app.openNaver') + '</a>';
    }
    actionsEl.innerHTML = actionsHtml;

    // Submitted by
    var byEl = document.getElementById('ta-detail-by');
    if (spot.submittedBy) {
      byEl.textContent = 'Submitted by ' + spot.submittedBy;
      byEl.style.display = '';
    } else {
      byEl.style.display = 'none';
    }
  }

  window.taBackToList = function() {
    state.selectedSpot = null;
    document.getElementById('ta-detail').classList.remove('active');
    document.getElementById('ta-list').style.display = '';
    document.querySelector('.ta-filters').style.display = '';
    document.querySelectorAll('.ta-spot-card').forEach(function(c) { c.classList.remove('active'); });
  };

  // === Map ===
  function initMap() {
    fetch('/api/map-config')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (!data.clientId) {
          showMapFallback(t('app.mapError'));
          return;
        }
        var script = document.createElement('script');
        script.src = 'https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=' + data.clientId + '&submodules=geocoder';
        script.onload = function() {
          createMap();
        };
        script.onerror = function() {
          showMapFallback(t('app.mapError'));
        };
        document.head.appendChild(script);
      })
      .catch(function() {
        showMapFallback(t('app.mapError'));
      });
  }

  function showMapFallback(msg) {
    var mapEl = document.getElementById('ta-map');
    mapEl.innerHTML = '<div class="ta-map-fallback"><p>' + escapeHtml(msg) + '</p></div>';
  }

  function createMap() {
    if (typeof naver === 'undefined' || !naver.maps) return;

    state.map = new naver.maps.Map('ta-map', {
      center: new naver.maps.LatLng(37.5665, 126.978),
      zoom: 7,
      mapTypeControl: true,
      zoomControl: true,
      zoomControlOptions: { position: naver.maps.Position.TOP_RIGHT }
    });

    state.mapLoaded = true;

    // Render markers for already-loaded spots
    if (state.spots.length > 0) {
      renderMapMarkers(filterBySearch(state.spots));
    }
  }

  function renderMapMarkers(spots) {
    if (!state.map || !state.mapLoaded) return;

    // Clear existing
    state.markers.forEach(function(m) { m.setMap(null); });
    state.markers = [];
    state.infoWindows.forEach(function(iw) { iw.close(); });
    state.infoWindows = [];

    var bounds = new naver.maps.LatLngBounds();
    var hasValidCoords = false;

    spots.forEach(function(spot) {
      if (!spot.lat || !spot.lng) return;

      hasValidCoords = true;
      var pos = new naver.maps.LatLng(spot.lat, spot.lng);
      bounds.extend(pos);

      var catColors = {
        food: '#EF4444', attraction: '#3B82F6', cafe: '#F59E0B',
        nature: '#22C55E', shopping: '#8B5CF6', nightlife: '#EC4899'
      };
      var color = catColors[spot.category] || '#666';

      var marker = new naver.maps.Marker({
        position: pos,
        map: state.map,
        icon: {
          content: '<div style="width:30px;height:30px;background:' + color + ';border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;">' + (CAT_ICONS[spot.category] || '📍') + '</div>',
          anchor: new naver.maps.Point(15, 15)
        }
      });

      var thumbHtml = spot.coverImage
        ? '<img src="' + escapeAttr(spot.coverImage) + '" style="width:100%;height:100px;object-fit:cover;border-radius:8px 8px 0 0;">'
        : '';

      var infoWindow = new naver.maps.InfoWindow({
        content: '<div style="width:220px;background:white;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.15);cursor:pointer;" class="ta-info-window" data-id="' + spot.id + '">' +
          thumbHtml +
          '<div style="padding:10px 12px;">' +
            '<div style="font-weight:600;font-size:0.9rem;color:#1F2937;">' + escapeHtml(spot.name) + '</div>' +
            '<div style="font-size:0.78rem;color:#9CA3AF;margin-top:4px;">' + escapeHtml(spot.region || '') + '</div>' +
          '</div>' +
        '</div>',
        borderWidth: 0,
        backgroundColor: 'transparent',
        anchorSize: new naver.maps.Size(0, 0),
        pixelOffset: new naver.maps.Point(0, -20)
      });

      naver.maps.Event.addListener(marker, 'click', function() {
        state.infoWindows.forEach(function(iw) { iw.close(); });
        infoWindow.open(state.map, marker);
        showDetail(spot);
      });

      marker._spotId = spot.id;
      state.markers.push(marker);
      state.infoWindows.push(infoWindow);
    });

    // Fit bounds if we have markers
    if (hasValidCoords && spots.length > 1) {
      state.map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    }
  }

  function highlightMarker(spot) {
    if (!state.map || !spot.lat || !spot.lng) return;

    state.infoWindows.forEach(function(iw) { iw.close(); });

    var pos = new naver.maps.LatLng(spot.lat, spot.lng);
    state.map.panTo(pos);
    if (state.map.getZoom() < 13) {
      state.map.setZoom(14);
    }

    // Open info window for this spot
    for (var i = 0; i < state.markers.length; i++) {
      if (state.markers[i]._spotId === spot.id) {
        state.infoWindows[i].open(state.map, state.markers[i]);
        break;
      }
    }
  }

  // === Submit ===
  window.taShowSubmit = function() {
    document.getElementById('ta-submit-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.taCloseSubmit = function() {
    document.getElementById('ta-submit-overlay').classList.remove('active');
    document.body.style.overflow = '';
  };

  window.taSubmitSpot = function(event) {
    event.preventDefault();

    var name = document.getElementById('ta-sub-name').value.trim();
    var category = document.getElementById('ta-sub-category').value;
    var desc = document.getElementById('ta-sub-desc').value.trim();
    var address = document.getElementById('ta-sub-address').value.trim();
    var instagram = document.getElementById('ta-sub-instagram').value.trim();
    var author = document.getElementById('ta-sub-author').value.trim();

    if (!name || !desc || !author) return;

    var body = {
      name: name,
      category: category,
      description: desc,
      address: address,
      instagram: instagram,
      submittedBy: author,
      lang: state.lang
    };

    // Try geocode address before submitting
    if (address && typeof naver !== 'undefined' && naver.maps && naver.maps.Service) {
      naver.maps.Service.geocode({ query: address }, function(status, response) {
        if (status === naver.maps.Service.Status.OK && response.v2.addresses.length) {
          var item = response.v2.addresses[0];
          body.lat = item.y;
          body.lng = item.x;
        }
        submitToApi(body);
      });
    } else {
      submitToApi(body);
    }
  };

  function submitToApi(body) {
    fetch('/api/travel-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.success) {
        alert(t('app.submitted'));
        taCloseSubmit();
        document.getElementById('ta-submit-form').reset();
      } else {
        alert(t('app.submitError'));
      }
    })
    .catch(function() {
      alert(t('app.submitError'));
    });
  }

  // === Filters ===
  function initFilters() {
    // Category buttons
    document.querySelectorAll('.ta-cat-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.ta-cat-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.category = btn.dataset.cat;
        state.nextCursor = null;
        fetchSpots(false);
      });
    });

    // Region select
    document.getElementById('ta-region-select').addEventListener('change', function() {
      state.region = this.value;
      state.nextCursor = null;
      fetchSpots(false);
    });

    // Search
    var searchInput = document.getElementById('ta-search');
    var searchTimer = null;
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimer);
      var val = this.value.trim();
      searchTimer = setTimeout(function() {
        state.search = val;
        var filtered = filterBySearch(state.spots);
        renderSpotList(filtered);
        renderMapMarkers(filtered);
      }, 300);
    });
  }

  // === Submit modal overlay close ===
  function initModalClose() {
    document.getElementById('ta-submit-overlay').addEventListener('click', function(e) {
      if (e.target === e.currentTarget) taCloseSubmit();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        taCloseSubmit();
        if (state.selectedSpot) taBackToList();
      }
    });
  }

  // === Utility ===
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function escapeAttr(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // === Init ===
  function init() {
    initLanguage();
    applyTranslations();
    initFilters();
    initModalClose();
    initMap();
    fetchSpots(false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
