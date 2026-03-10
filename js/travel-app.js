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
    mapLoaded: false,
    mapProvider: localStorage.getItem('travelko_map_provider') || 'naver',
    mapConfig: null
  };

  var CAT_ICONS = {
    food: '🍜', attraction: '🏛️', cafe: '☕',
    nature: '🌿', shopping: '🛍️', nightlife: '🌙'
  };

  var CAT_COLORS = {
    food: '#EF4444', attraction: '#3B82F6', cafe: '#F59E0B',
    nature: '#22C55E', shopping: '#8B5CF6', nightlife: '#EC4899'
  };

  // === Map Providers Abstraction ===
  var MapProviders = {
    naver: {
      loadSDK: function(config, lang, cb) {
        var existing = document.getElementById('map-sdk-script');
        if (existing) existing.remove();
        // Reset naver namespace when reloading
        if (state.map) {
          try { state.map.destroy(); } catch(e) {}
          state.map = null;
          window._taMap = null;
        }
        var script = document.createElement('script');
        script.id = 'map-sdk-script';
        script.src = 'https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=' + config.clientId + '&submodules=geocoder&language=' + lang;
        script.onload = function() { cb(); };
        script.onerror = function() { cb(new Error('Failed to load Naver Map SDK')); };
        document.head.appendChild(script);
      },
      createMap: function(elementId) {
        var map = new naver.maps.Map(elementId, {
          center: new naver.maps.LatLng(37.5665, 126.978),
          zoom: 7,
          mapTypeControl: true,
          mapTypeControlOptions: { position: naver.maps.Position.TOP_RIGHT },
          zoomControl: true,
          zoomControlOptions: { position: naver.maps.Position.RIGHT_CENTER },
          scaleControl: true,
          scaleControlOptions: { position: naver.maps.Position.RIGHT_BOTTOM }
        });
        return map;
      },
      addMarker: function(map, lat, lng, color, icon) {
        return new naver.maps.Marker({
          position: new naver.maps.LatLng(lat, lng),
          map: map,
          icon: {
            content: '<div style="width:30px;height:30px;background:' + color + ';border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;">' + icon + '</div>',
            anchor: new naver.maps.Point(15, 15)
          }
        });
      },
      createInfoWindow: function(html) {
        return new naver.maps.InfoWindow({
          content: html, borderWidth: 0, backgroundColor: 'transparent',
          anchorSize: new naver.maps.Size(0, 0), pixelOffset: new naver.maps.Point(0, -20)
        });
      },
      openInfoWindow: function(iw, map, marker) { iw.open(map, marker); },
      closeInfoWindow: function(iw) { iw.close(); },
      removeMarker: function(m) { m.setMap(null); },
      onMarkerClick: function(marker, cb) { naver.maps.Event.addListener(marker, 'click', cb); },
      panTo: function(map, lat, lng) { map.panTo(new naver.maps.LatLng(lat, lng)); },
      getCenter: function(map) { var c = map.getCenter(); return { lat: c.lat(), lng: c.lng() }; },
      setCenter: function(map, lat, lng) { map.setCenter(new naver.maps.LatLng(lat, lng)); },
      getZoom: function(map) { return map.getZoom(); },
      setZoom: function(map, z) { map.setZoom(z); },
      triggerResize: function(map) { naver.maps.Event.trigger(map, 'resize'); },
      fitBounds: function(map, spots) {
        var bounds = new naver.maps.LatLngBounds();
        spots.forEach(function(s) { if (s.lat && s.lng) bounds.extend(new naver.maps.LatLng(s.lat, s.lng)); });
        map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
      },
      addControlElement: function(map, el) {
        map.controls[naver.maps.Position.TOP_LEFT].push(el);
      },
      geocode: function(query, cb) {
        if (typeof naver === 'undefined' || !naver.maps || !naver.maps.Service) { cb(null); return; }
        naver.maps.Service.geocode({ query: query }, function(status, response) {
          if (status === naver.maps.Service.Status.OK && response.v2.addresses.length) {
            var item = response.v2.addresses[0];
            cb({ lat: parseFloat(item.y), lng: parseFloat(item.x) });
          } else { cb(null); }
        });
      },
      getExternalMapUrl: function(spot) {
        if (spot.naverMapLink) return spot.naverMapLink;
        return 'https://map.naver.com/p/search/' + spot.lat + ',' + spot.lng + '?c=' + spot.lng + ',' + spot.lat + ',15,0,0,0,dh';
      }
    },

    google: {
      loadSDK: function(config, lang, cb) {
        var existing = document.getElementById('map-sdk-script');
        if (existing) existing.remove();
        state.map = null;
        window._taMap = null;
        var script = document.createElement('script');
        script.id = 'map-sdk-script';
        script.src = 'https://maps.googleapis.com/maps/api/js?key=' + config.googleKey + '&language=' + lang;
        script.onload = function() { cb(); };
        script.onerror = function() { cb(new Error('Failed to load Google Maps SDK')); };
        document.head.appendChild(script);
      },
      createMap: function(elementId) {
        return new google.maps.Map(document.getElementById(elementId), {
          center: { lat: 37.5665, lng: 126.978 },
          zoom: 7,
          mapTypeControl: true,
          zoomControl: true
        });
      },
      _svgIcon: function(color, icon) {
        // For Google, use a simple colored circle marker
        var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30">' +
          '<circle cx="15" cy="15" r="12" fill="' + color + '" stroke="white" stroke-width="3"/>' +
          '</svg>';
        return {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
          scaledSize: new google.maps.Size(30, 30),
          anchor: new google.maps.Point(15, 15)
        };
      },
      addMarker: function(map, lat, lng, color, icon) {
        return new google.maps.Marker({
          position: { lat: lat, lng: lng },
          map: map,
          icon: this._svgIcon(color, icon)
        });
      },
      createInfoWindow: function(html) {
        return new google.maps.InfoWindow({ content: html });
      },
      openInfoWindow: function(iw, map, marker) { iw.open(map, marker); },
      closeInfoWindow: function(iw) { iw.close(); },
      removeMarker: function(m) { m.setMap(null); },
      onMarkerClick: function(marker, cb) { marker.addListener('click', cb); },
      panTo: function(map, lat, lng) { map.panTo({ lat: lat, lng: lng }); },
      getCenter: function(map) { var c = map.getCenter(); return { lat: c.lat(), lng: c.lng() }; },
      setCenter: function(map, lat, lng) { map.setCenter({ lat: lat, lng: lng }); },
      getZoom: function(map) { return map.getZoom(); },
      setZoom: function(map, z) { map.setZoom(z); },
      triggerResize: function(map) { google.maps.event.trigger(map, 'resize'); },
      fitBounds: function(map, spots) {
        var bounds = new google.maps.LatLngBounds();
        spots.forEach(function(s) { if (s.lat && s.lng) bounds.extend({ lat: s.lat, lng: s.lng }); });
        map.fitBounds(bounds, 50);
      },
      addControlElement: function(map, el) {
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(el);
      },
      geocode: function(query, cb) {
        if (typeof google === 'undefined' || !google.maps) { cb(null); return; }
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: query }, function(results, status) {
          if (status === 'OK' && results.length) {
            var loc = results[0].geometry.location;
            cb({ lat: loc.lat(), lng: loc.lng() });
          } else { cb(null); }
        });
      },
      getExternalMapUrl: function(spot) {
        return 'https://www.google.com/maps/search/?api=1&query=' + spot.lat + ',' + spot.lng;
      }
    }
  };

  function mp() {
    return MapProviders[state.mapProvider] || MapProviders.naver;
  }

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
    // Update provider toggle labels
    var toggleBtns = document.querySelectorAll('.ta-map-provider-btn');
    toggleBtns.forEach(function(btn) {
      if (btn.dataset.provider === 'naver') btn.textContent = t('app.mapNaver');
      if (btn.dataset.provider === 'google') btn.textContent = t('app.mapGoogle');
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
      if (spot.featured) meta += '<span class="ta-spot-featured">' + t('app.featured') + '</span>';
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
    if (spot.featured) metaHtml += '<span style="color:var(--t-primary);font-weight:600;">' + t('app.featured') + '</span>';
    if (spot.region) metaHtml += '<span>' + escapeHtml(spot.region) + '</span>';
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
      addrEl.innerHTML = escapeHtml(spot.address);
      addrEl.style.display = '';
    } else {
      addrEl.style.display = 'none';
    }

    // Actions - dynamic map link based on current provider
    var actionsEl = document.getElementById('ta-detail-actions');
    var actionsHtml = '';
    if (spot.lat && spot.lng) {
      var p = mp();
      var mapUrl = p.getExternalMapUrl(spot);
      var isGoogle = state.mapProvider === 'google';
      var btnClass = isGoogle ? 'ta-detail-google' : 'ta-detail-naver';
      var label = isGoogle ? t('app.openGoogle') : t('app.openNaver');
      actionsHtml += '<a href="' + escapeAttr(mapUrl) + '" target="_blank" rel="noopener" class="' + btnClass + '">' + label + '</a>';
    } else if (spot.naverMapLink) {
      actionsHtml += '<a href="' + escapeAttr(spot.naverMapLink) + '" target="_blank" rel="noopener" class="ta-detail-naver">' + t('app.openNaver') + '</a>';
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
  var mapLang = localStorage.getItem('travelko_map_lang') || 'ko';

  function initMap() {
    fetch('/api/map-config')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        state.mapConfig = data;

        // Fallback logic
        if (state.mapProvider === 'google' && !data.googleKey) {
          state.mapProvider = 'naver';
          localStorage.setItem('travelko_map_provider', 'naver');
        }
        if (!data.clientId && !data.googleKey) {
          showMapFallback(t('app.mapError'));
          return;
        }
        if (!data.clientId && data.googleKey) {
          state.mapProvider = 'google';
          localStorage.setItem('travelko_map_provider', 'google');
        }

        loadAndCreateMap();
      })
      .catch(function() {
        showMapFallback(t('app.mapError'));
      });
  }

  function loadAndCreateMap(restoreCenter, restoreZoom) {
    var p = mp();
    state.mapLoaded = false;
    state.markers = [];
    state.infoWindows = [];

    p.loadSDK(state.mapConfig, mapLang, function(err) {
      if (err) {
        showMapFallback(t('app.mapError'));
        return;
      }
      createMap(restoreCenter, restoreZoom);
    });
  }

  function showMapFallback(msg) {
    var mapEl = document.getElementById('ta-map');
    mapEl.innerHTML = '<div class="ta-map-fallback"><p>' + escapeHtml(msg) + '</p></div>';
  }

  function createMap(restoreCenter, restoreZoom) {
    var p = mp();
    window._taMap = state.map = p.createMap('ta-map');
    state.mapLoaded = true;

    // Restore center/zoom if switching
    if (restoreCenter) {
      p.setCenter(state.map, restoreCenter.lat, restoreCenter.lng);
    }
    if (restoreZoom) {
      p.setZoom(state.map, restoreZoom);
    }

    // Add controls
    addMapLangControl();
    addMapProviderToggle();

    // Render markers for already-loaded spots
    if (state.spots.length > 0) {
      renderMapMarkers(filterBySearch(state.spots));
    }
  }

  // === Map Provider Toggle ===
  function addMapProviderToggle() {
    if (!state.mapConfig || !state.mapConfig.clientId || !state.mapConfig.googleKey) return;

    // Remove existing toggle
    var existing = document.querySelector('.ta-map-provider');
    if (existing) existing.remove();

    var html = '<div class="ta-map-provider">' +
      '<button class="ta-map-provider-btn' + (state.mapProvider === 'naver' ? ' active' : '') + '" data-provider="naver">' + t('app.mapNaver') + '</button>' +
      '<button class="ta-map-provider-btn' + (state.mapProvider === 'google' ? ' active' : '') + '" data-provider="google">' + t('app.mapGoogle') + '</button>' +
    '</div>';

    var el = document.createElement('div');
    el.innerHTML = html;
    var control = el.firstChild;

    control.addEventListener('click', function(e) {
      var btn = e.target.closest('.ta-map-provider-btn');
      if (!btn || btn.dataset.provider === state.mapProvider) return;
      switchMapProvider(btn.dataset.provider);
    });

    // Append directly to map wrapper (absolute positioned via CSS)
    document.querySelector('.ta-map-wrap').appendChild(control);
  }

  function switchMapProvider(provider) {
    var p = mp();
    var center = null;
    var zoom = null;

    if (state.map && state.mapLoaded) {
      center = p.getCenter(state.map);
      zoom = p.getZoom(state.map);
    }

    // Clean up
    state.markers.forEach(function(m) { p.removeMarker(m); });
    state.markers = [];
    state.infoWindows.forEach(function(iw) { p.closeInfoWindow(iw); });
    state.infoWindows = [];

    state.mapProvider = provider;
    localStorage.setItem('travelko_map_provider', provider);

    // Reload map with new provider
    loadAndCreateMap(center, zoom);
  }

  function addMapLangControl() {
    // Remove existing
    var existing = document.querySelector('.ta-map-lang');
    if (existing) existing.remove();

    var langOptions = [
      { code: 'ko', label: 'KR' },
      { code: 'en', label: 'EN' },
      { code: 'ja', label: 'JP' },
      { code: 'zh', label: 'CN' }
    ];

    var html = '<div class="ta-map-lang">';
    langOptions.forEach(function(opt) {
      var active = opt.code === mapLang ? ' active' : '';
      html += '<button class="ta-map-lang-btn' + active + '" data-lang="' + opt.code + '">' + opt.label + '</button>';
    });
    html += '</div>';

    var el = document.createElement('div');
    el.innerHTML = html;
    var control = el.firstChild;

    control.addEventListener('click', function(e) {
      var btn = e.target.closest('.ta-map-lang-btn');
      if (!btn) return;
      var lang = btn.getAttribute('data-lang');
      if (lang === mapLang) return;

      var p = mp();
      var center = p.getCenter(state.map);
      var zoom = p.getZoom(state.map);

      mapLang = lang;
      localStorage.setItem('travelko_map_lang', lang);

      loadAndCreateMap(center, zoom);
    });

    // Append directly to map wrapper (absolute positioned via CSS)
    document.querySelector('.ta-map-wrap').appendChild(control);
  }

  function renderMapMarkers(spots) {
    if (!state.map || !state.mapLoaded) return;
    var p = mp();

    // Clear existing
    state.markers.forEach(function(m) { p.removeMarker(m); });
    state.markers = [];
    state.infoWindows.forEach(function(iw) { p.closeInfoWindow(iw); });
    state.infoWindows = [];

    var hasValidCoords = false;

    spots.forEach(function(spot) {
      if (!spot.lat || !spot.lng) return;
      hasValidCoords = true;

      var color = CAT_COLORS[spot.category] || '#666';
      var icon = CAT_ICONS[spot.category] || '📍';
      var marker = p.addMarker(state.map, spot.lat, spot.lng, color, icon);

      var thumbHtml = spot.coverImage
        ? '<img src="' + escapeAttr(spot.coverImage) + '" style="width:100%;height:100px;object-fit:cover;border-radius:8px 8px 0 0;">'
        : '';

      var infoWindow = p.createInfoWindow(
        '<div style="width:220px;background:white;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.15);cursor:pointer;" class="ta-info-window" data-id="' + spot.id + '">' +
          thumbHtml +
          '<div style="padding:10px 12px;">' +
            '<div style="font-weight:600;font-size:0.9rem;color:#1F2937;">' + escapeHtml(spot.name) + '</div>' +
            '<div style="font-size:0.78rem;color:#9CA3AF;margin-top:4px;">' + escapeHtml(spot.region || '') + '</div>' +
          '</div>' +
        '</div>'
      );

      p.onMarkerClick(marker, function() {
        state.infoWindows.forEach(function(iw) { p.closeInfoWindow(iw); });
        p.openInfoWindow(infoWindow, state.map, marker);
        showDetail(spot);
      });

      marker._spotId = spot.id;
      state.markers.push(marker);
      state.infoWindows.push(infoWindow);
    });

    // Fit bounds if we have markers
    if (hasValidCoords && spots.length > 1) {
      p.fitBounds(state.map, spots);
    }
  }

  function highlightMarker(spot) {
    if (!state.map || !spot.lat || !spot.lng) return;
    var p = mp();

    state.infoWindows.forEach(function(iw) { p.closeInfoWindow(iw); });

    p.panTo(state.map, spot.lat, spot.lng);
    if (p.getZoom(state.map) < 13) {
      p.setZoom(state.map, 14);
    }

    // Open info window for this spot
    for (var i = 0; i < state.markers.length; i++) {
      if (state.markers[i]._spotId === spot.id) {
        p.openInfoWindow(state.infoWindows[i], state.map, state.markers[i]);
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
    if (address) {
      mp().geocode(address, function(result) {
        if (result) {
          body.lat = result.lat;
          body.lng = result.lng;
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

  // Expose triggerResize for sidebar toggle
  window._taTriggerResize = function() {
    if (state.map && state.mapLoaded) {
      mp().triggerResize(state.map);
    }
  };

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
