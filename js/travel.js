// KoInfo Travel - User-submitted travel spots with Naver/Google Map and admin approval
// Uses SITE from site-config.js and currentLang from main.js

const TRAVEL_CONFIG = {
  postsPerPage: 12,
  maxPhotos: 5,
  storageKeys: {
    posts: SITE.storagePrefix + '_travel_posts',
    pending: SITE.storagePrefix + '_travel_pending',
    counter: SITE.storagePrefix + '_travel_counter'
  }
};

const TRAVEL_CATEGORIES = {
  food: { key: 'travel.catFood', color: '#EF4444', bg: '#FEF2F2' },
  attraction: { key: 'travel.catAttraction', color: '#3B82F6', bg: '#EFF6FF' },
  cafe: { key: 'travel.catCafe', color: '#F59E0B', bg: '#FFFBEB' },
  nature: { key: 'travel.catNature', color: '#22C55E', bg: '#F0FDF4' },
  shopping: { key: 'travel.catShopping', color: '#8B5CF6', bg: '#F5F3FF' },
  nightlife: { key: 'travel.catNightlife', color: '#EC4899', bg: '#FDF2F8' }
};

// ===== MAP PROVIDERS ABSTRACTION =====

var MapProviders = {
  naver: {
    loadSDK: function(config, cb) {
      if (typeof naver !== 'undefined' && naver.maps) { cb(); return; }
      var script = document.createElement('script');
      script.src = 'https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=' + config.clientId + '&submodules=geocoder';
      script.onload = cb;
      script.onerror = function() { cb(new Error('Failed to load Naver Map SDK')); };
      document.head.appendChild(script);
    },
    createMap: function(elementId, opts) {
      return new naver.maps.Map(elementId, {
        center: new naver.maps.LatLng(opts.lat, opts.lng),
        zoom: opts.zoom,
        mapTypeControl: !!opts.mapTypeControl,
        zoomControl: true,
        zoomControlOptions: { position: naver.maps.Position.TOP_RIGHT }
      });
    },
    addMarker: function(map, opts) {
      var iconOpts = {};
      if (opts.color) {
        iconOpts = {
          icon: {
            content: '<div style="width:28px;height:28px;background:' + opts.color + ';border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:pointer;"></div>',
            anchor: new naver.maps.Point(14, 14)
          }
        };
      }
      return new naver.maps.Marker(Object.assign({
        position: new naver.maps.LatLng(opts.lat, opts.lng),
        map: map,
        draggable: !!opts.draggable
      }, iconOpts));
    },
    addMarkerClickListener: function(marker, cb) {
      naver.maps.Event.addListener(marker, 'click', cb);
    },
    addMarkerDragEndListener: function(marker, cb) {
      naver.maps.Event.addListener(marker, 'dragend', function() {
        var pos = marker.getPosition();
        cb(pos.lat(), pos.lng());
      });
    },
    addMapClickListener: function(map, cb) {
      naver.maps.Event.addListener(map, 'click', function(e) {
        cb(e.coord.lat(), e.coord.lng());
      });
    },
    createInfoWindow: function(contentHtml) {
      return new naver.maps.InfoWindow({
        content: contentHtml,
        borderWidth: 0,
        backgroundColor: 'transparent',
        anchorSize: new naver.maps.Size(0, 0),
        pixelOffset: new naver.maps.Point(0, -20)
      });
    },
    openInfoWindow: function(infoWindow, map, marker) {
      infoWindow.open(map, marker);
    },
    closeInfoWindow: function(infoWindow) {
      infoWindow.close();
    },
    removeMarker: function(marker) {
      marker.setMap(null);
    },
    setMarkerPosition: function(marker, lat, lng) {
      marker.setPosition(new naver.maps.LatLng(lat, lng));
    },
    setCenter: function(map, lat, lng) {
      map.setCenter(new naver.maps.LatLng(lat, lng));
    },
    getCenter: function(map) {
      var c = map.getCenter();
      return { lat: c.lat(), lng: c.lng() };
    },
    setZoom: function(map, zoom) {
      map.setZoom(zoom);
    },
    getZoom: function(map) {
      return map.getZoom();
    },
    triggerResize: function(map) {
      naver.maps.Event.trigger(map, 'resize');
    },
    geocode: function(query, cb) {
      if (typeof naver === 'undefined' || !naver.maps || !naver.maps.Service) { cb(null); return; }
      naver.maps.Service.geocode({ query: query }, function(status, response) {
        if (status !== naver.maps.Service.Status.OK || !response.v2.addresses.length) { cb(null); return; }
        var item = response.v2.addresses[0];
        cb({ lat: parseFloat(item.y), lng: parseFloat(item.x) });
      });
    },
    getExternalMapUrl: function(lat, lng) {
      return 'https://map.naver.com/p/search/' + lat + ',' + lng + '?c=' + lng + ',' + lat + ',15,0,0,0,dh';
    }
  },

  google: {
    loadSDK: function(config, cb) {
      if (typeof google !== 'undefined' && google.maps) { cb(); return; }
      var script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=' + config.googleKey + '&libraries=geocoding';
      script.onload = cb;
      script.onerror = function() { cb(new Error('Failed to load Google Maps SDK')); };
      document.head.appendChild(script);
    },
    _svgMarkerIcon: function(color) {
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28">' +
        '<circle cx="14" cy="14" r="11" fill="' + color + '" stroke="white" stroke-width="3"/>' +
        '</svg>';
      return {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
        scaledSize: new google.maps.Size(28, 28),
        anchor: new google.maps.Point(14, 14)
      };
    },
    createMap: function(elementId, opts) {
      return new google.maps.Map(document.getElementById(elementId), {
        center: { lat: opts.lat, lng: opts.lng },
        zoom: opts.zoom,
        mapTypeControl: !!opts.mapTypeControl,
        zoomControl: true
      });
    },
    addMarker: function(map, opts) {
      var markerOpts = {
        position: { lat: opts.lat, lng: opts.lng },
        map: map,
        draggable: !!opts.draggable
      };
      if (opts.color) {
        markerOpts.icon = this._svgMarkerIcon(opts.color);
      }
      return new google.maps.Marker(markerOpts);
    },
    addMarkerClickListener: function(marker, cb) {
      marker.addListener('click', cb);
    },
    addMarkerDragEndListener: function(marker, cb) {
      marker.addListener('dragend', function() {
        var pos = marker.getPosition();
        cb(pos.lat(), pos.lng());
      });
    },
    addMapClickListener: function(map, cb) {
      map.addListener('click', function(e) {
        cb(e.latLng.lat(), e.latLng.lng());
      });
    },
    createInfoWindow: function(contentHtml) {
      return new google.maps.InfoWindow({ content: contentHtml });
    },
    openInfoWindow: function(infoWindow, map, marker) {
      infoWindow.open(map, marker);
    },
    closeInfoWindow: function(infoWindow) {
      infoWindow.close();
    },
    removeMarker: function(marker) {
      marker.setMap(null);
    },
    setMarkerPosition: function(marker, lat, lng) {
      marker.setPosition({ lat: lat, lng: lng });
    },
    setCenter: function(map, lat, lng) {
      map.setCenter({ lat: lat, lng: lng });
    },
    getCenter: function(map) {
      var c = map.getCenter();
      return { lat: c.lat(), lng: c.lng() };
    },
    setZoom: function(map, zoom) {
      map.setZoom(zoom);
    },
    getZoom: function(map) {
      return map.getZoom();
    },
    triggerResize: function(map) {
      google.maps.event.trigger(map, 'resize');
    },
    geocode: function(query, cb) {
      if (typeof google === 'undefined' || !google.maps) { cb(null); return; }
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: query }, function(results, status) {
        if (status !== 'OK' || !results.length) { cb(null); return; }
        var loc = results[0].geometry.location;
        cb({ lat: loc.lat(), lng: loc.lng() });
      });
    },
    getExternalMapUrl: function(lat, lng) {
      return 'https://www.google.com/maps/search/?api=1&query=' + lat + ',' + lng;
    }
  }
};

function getMapProvider() {
  return MapProviders[travelState.mapProvider] || MapProviders.naver;
}

let travelState = {
  currentCategory: 'all',
  currentPage: 1,
  mainMap: null,
  writeMap: null,
  writeMarker: null,
  markers: [],
  infoWindows: [],
  photoFiles: [],
  photoDataUrls: [],
  mapProvider: localStorage.getItem('travel_map_provider') || 'naver',
  mapConfig: null
};

// ===== STORAGE =====

function getTravelPosts() {
  try { return JSON.parse(localStorage.getItem(TRAVEL_CONFIG.storageKeys.posts)) || []; }
  catch { return []; }
}

function saveTravelPosts(posts) {
  localStorage.setItem(TRAVEL_CONFIG.storageKeys.posts, JSON.stringify(posts));
}

function getTravelPending() {
  try { return JSON.parse(localStorage.getItem(TRAVEL_CONFIG.storageKeys.pending)) || []; }
  catch { return []; }
}

function saveTravelPending(pending) {
  localStorage.setItem(TRAVEL_CONFIG.storageKeys.pending, JSON.stringify(pending));
}

function getTravelNextId() {
  let counter = parseInt(localStorage.getItem(TRAVEL_CONFIG.storageKeys.counter)) || 0;
  counter++;
  localStorage.setItem(TRAVEL_CONFIG.storageKeys.counter, String(counter));
  return counter;
}

// ===== HELPERS =====

function getTravelText(key) {
  var lang = (typeof currentLang !== 'undefined') ? currentLang : SITE.lang;
  var t = typeof translations !== 'undefined' ? translations[lang] : null;
  if (t && t['travel.' + key]) return t['travel.' + key];
  var fallback = {
    title: 'Korea Travel', catAll: 'All', catFood: 'Food',
    catAttraction: 'Attractions', catCafe: 'Cafe', catNature: 'Nature',
    catShopping: 'Shopping', catNightlife: 'Nightlife', writeBtn: 'Share a Spot',
    empty: 'No travel posts yet.', writeTitle: 'Share a Travel Spot',
    writeNotice: 'Your post will be published after admin approval.',
    categoryLabel: 'Category', placeLabel: 'Place Name', authorLabel: 'Your Name',
    contentLabel: 'Review / Description', photoLabel: 'Photos (max 5)',
    instagramLabel: 'Instagram Tag', locationLabel: 'Location',
    searchBtn: 'Search', cancelBtn: 'Cancel', submitBtn: 'Submit',
    submitted: 'Your post has been submitted! It will appear after admin approval.',
    views: 'Views', adminTitle: 'Admin Approval', adminWrong: 'Wrong password',
    approve: 'Approve', reject: 'Reject', noPending: 'No pending posts.',
    placePh: 'e.g. Gyeongbokgung Palace', authorPh: 'Your name',
    contentPh: 'Share your experience...', instagramPh: '@username or #hashtag',
    addressPh: 'Search address...', openMap: 'Open in Naver Map',
    mapNaver: 'Naver Map', mapGoogle: 'Google Map',
    openMapGoogle: 'Open in Google Map'
  };
  return fallback[key] || key;
}

function getTravelCatLabel(cat) {
  var lang = (typeof currentLang !== 'undefined') ? currentLang : SITE.lang;
  var t = typeof translations !== 'undefined' ? translations[lang] : null;
  var catObj = TRAVEL_CATEGORIES[cat];
  if (t && catObj && t[catObj.key]) return t[catObj.key];
  return cat;
}

function formatTravelDate(isoStr) {
  var d = new Date(isoStr);
  return d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0');
}

// ===== MAP PROVIDER TOGGLE =====

function addMapProviderToggle() {
  // Only show toggle if both API keys are available
  if (!travelState.mapConfig || !travelState.mapConfig.clientId || !travelState.mapConfig.googleKey) return;

  var section = document.querySelector('.travel-map-section');
  if (!section || section.querySelector('.travel-map-provider-toggle')) return;

  var toggle = document.createElement('div');
  toggle.className = 'travel-map-provider-toggle';
  toggle.innerHTML =
    '<button class="travel-map-provider-btn' + (travelState.mapProvider === 'naver' ? ' active' : '') + '" data-provider="naver">' + getTravelText('mapNaver') + '</button>' +
    '<button class="travel-map-provider-btn' + (travelState.mapProvider === 'google' ? ' active' : '') + '" data-provider="google">' + getTravelText('mapGoogle') + '</button>';

  toggle.addEventListener('click', function(e) {
    var btn = e.target.closest('.travel-map-provider-btn');
    if (!btn || btn.dataset.provider === travelState.mapProvider) return;
    switchMapProvider(btn.dataset.provider);
  });

  section.appendChild(toggle);
}

function switchMapProvider(provider) {
  var p = getMapProvider();
  var center = null;
  var zoom = null;

  // Preserve current center/zoom
  if (travelState.mainMap) {
    center = p.getCenter(travelState.mainMap);
    zoom = p.getZoom(travelState.mainMap);
  }

  // Clean up existing markers and info windows
  travelState.markers.forEach(function(m) { getMapProvider().removeMarker(m); });
  travelState.markers = [];
  travelState.infoWindows.forEach(function(iw) { getMapProvider().closeInfoWindow(iw); });
  travelState.infoWindows = [];
  travelState.mainMap = null;

  // Clean up write map
  travelState.writeMap = null;
  travelState.writeMarker = null;

  // Switch provider
  travelState.mapProvider = provider;
  localStorage.setItem('travel_map_provider', provider);

  // Update toggle UI
  document.querySelectorAll('.travel-map-provider-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.provider === provider);
  });

  // Clear map element
  var mapEl = document.getElementById('travel-map');
  mapEl.innerHTML = '<div class="travel-map-fallback"><p>Map loading...</p></div>';

  // Load new provider SDK and recreate map
  var newP = getMapProvider();
  newP.loadSDK(travelState.mapConfig, function(err) {
    if (err) {
      mapEl.innerHTML = '<div class="travel-map-fallback"><p style="color:var(--gray-600);padding:40px;text-align:center;">Failed to load map.</p></div>';
      return;
    }
    mapEl.innerHTML = '';
    createMainMap(center ? center.lat : 37.5665, center ? center.lng : 126.978, zoom || 7);
  });
}

// ===== MAP INIT =====

function initTravelMap() {
  var mapEl = document.getElementById('travel-map');
  mapEl.innerHTML = '<div class="travel-map-fallback"><p>Map loading...</p></div>';

  fetch('/api/map-config')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      travelState.mapConfig = data;

      // If saved provider is google but no google key, fall back to naver
      if (travelState.mapProvider === 'google' && !data.googleKey) {
        travelState.mapProvider = 'naver';
        localStorage.setItem('travel_map_provider', 'naver');
      }

      // If neither key exists, show error
      if (!data.clientId && !data.googleKey) {
        mapEl.innerHTML = '<div class="travel-map-fallback"><p style="color:var(--gray-600);padding:40px;text-align:center;">Map API key not configured.</p></div>';
        return;
      }

      // If only google key exists, use google
      if (!data.clientId && data.googleKey) {
        travelState.mapProvider = 'google';
        localStorage.setItem('travel_map_provider', 'google');
      }

      var p = getMapProvider();
      p.loadSDK(data, function(err) {
        if (err) {
          mapEl.innerHTML = '<div class="travel-map-fallback"><p style="color:var(--gray-600);padding:40px;text-align:center;">Failed to load map.</p></div>';
          return;
        }
        createMainMap(37.5665, 126.978, 7);
        addMapProviderToggle();
      });
    })
    .catch(function() {
      mapEl.innerHTML = '<div class="travel-map-fallback"><p style="color:var(--gray-600);padding:40px;text-align:center;">Failed to load map config.</p></div>';
    });
}

function createMainMap(lat, lng, zoom) {
  var p = getMapProvider();
  travelState.mainMap = p.createMap('travel-map', {
    lat: lat || 37.5665,
    lng: lng || 126.978,
    zoom: zoom || 7,
    mapTypeControl: true
  });
  addMapMarkers();
}

function addMapMarkers() {
  if (!travelState.mainMap) return;
  var p = getMapProvider();

  // Clear existing markers
  travelState.markers.forEach(function(m) { p.removeMarker(m); });
  travelState.markers = [];
  travelState.infoWindows.forEach(function(iw) { p.closeInfoWindow(iw); });
  travelState.infoWindows = [];

  var posts = getTravelPosts();
  var filtered = travelState.currentCategory === 'all'
    ? posts
    : posts.filter(function(post) { return post.category === travelState.currentCategory; });

  filtered.forEach(function(post) {
    if (!post.lat || !post.lng) return;

    var catInfo = TRAVEL_CATEGORIES[post.category] || { color: '#666', bg: '#f5f5f5' };
    var marker = p.addMarker(travelState.mainMap, {
      lat: post.lat,
      lng: post.lng,
      color: catInfo.color
    });

    var thumb = post.photos && post.photos[0]
      ? '<img src="' + post.photos[0] + '" style="width:100%;height:100px;object-fit:cover;border-radius:8px 8px 0 0;">'
      : '';

    var infoContent = '<div style="width:220px;background:white;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.15);">' +
      thumb +
      '<div style="padding:10px 12px;">' +
        '<span style="display:inline-block;padding:2px 8px;border-radius:50px;font-size:0.7rem;font-weight:600;background:' + catInfo.bg + ';color:' + catInfo.color + ';">' + getTravelCatLabel(post.category) + '</span>' +
        '<div style="font-weight:600;font-size:0.9rem;margin:6px 0 4px;color:#1F2937;">' + escapeHtml(post.title) + '</div>' +
        '<div style="font-size:0.78rem;color:#9CA3AF;">' + escapeHtml(post.author) + ' · ' + formatTravelDate(post.createdAt) + '</div>' +
      '</div>' +
    '</div>';

    var infoWindow = p.createInfoWindow(infoContent);

    p.addMarkerClickListener(marker, function() {
      travelState.infoWindows.forEach(function(iw) { p.closeInfoWindow(iw); });
      p.openInfoWindow(infoWindow, travelState.mainMap, marker);
      travelShowDetail(post.id);
    });

    travelState.markers.push(marker);
    travelState.infoWindows.push(infoWindow);
  });
}

function initWriteMap() {
  var p = getMapProvider();

  // Ensure SDK is loaded for write map
  if (!travelState.mapConfig) return;

  var createWriteMap = function() {
    travelState.writeMap = p.createMap('travel-write-map', {
      lat: 37.5665,
      lng: 126.978,
      zoom: 11
    });

    p.addMapClickListener(travelState.writeMap, function(lat, lng) {
      setWriteMarker(lat, lng);
    });
  };

  // Check if SDK is already loaded
  if ((travelState.mapProvider === 'naver' && typeof naver !== 'undefined' && naver.maps) ||
      (travelState.mapProvider === 'google' && typeof google !== 'undefined' && google.maps)) {
    createWriteMap();
  } else {
    p.loadSDK(travelState.mapConfig, function(err) {
      if (!err) createWriteMap();
    });
  }
}

function setWriteMarker(lat, lng) {
  if (!travelState.writeMap) return;
  var p = getMapProvider();

  document.getElementById('travel-post-lat').value = lat;
  document.getElementById('travel-post-lng').value = lng;
  document.getElementById('travel-coords-display').textContent = lat.toFixed(6) + ', ' + lng.toFixed(6);

  if (travelState.writeMarker) {
    p.setMarkerPosition(travelState.writeMarker, lat, lng);
  } else {
    travelState.writeMarker = p.addMarker(travelState.writeMap, {
      lat: lat,
      lng: lng,
      draggable: true
    });

    p.addMarkerDragEndListener(travelState.writeMarker, function(newLat, newLng) {
      document.getElementById('travel-post-lat').value = newLat;
      document.getElementById('travel-post-lng').value = newLng;
      document.getElementById('travel-coords-display').textContent = newLat.toFixed(6) + ', ' + newLng.toFixed(6);
    });
  }
}

function travelSearchAddress() {
  var query = document.getElementById('travel-post-address').value.trim();
  if (!query) return;

  var p = getMapProvider();
  p.geocode(query, function(result) {
    if (!result) {
      alert('Address not found');
      return;
    }
    p.setCenter(travelState.writeMap, result.lat, result.lng);
    p.setZoom(travelState.writeMap, 16);
    setWriteMarker(result.lat, result.lng);
  });
}

// ===== PHOTO HANDLING =====

function initPhotoUpload() {
  var input = document.getElementById('travel-post-photos');
  input.addEventListener('change', function() {
    var files = Array.from(this.files).slice(0, TRAVEL_CONFIG.maxPhotos);
    travelState.photoFiles = files;
    travelState.photoDataUrls = [];

    var preview = document.getElementById('travel-photo-preview');
    preview.innerHTML = '';

    files.forEach(function(file, idx) {
      var reader = new FileReader();
      reader.onload = function(e) {
        travelState.photoDataUrls[idx] = e.target.result;

        var img = document.createElement('div');
        img.className = 'travel-photo-thumb';
        img.innerHTML = '<img src="' + e.target.result + '" alt="Photo ' + (idx + 1) + '">' +
          '<button type="button" onclick="travelRemovePhoto(' + idx + ')">&times;</button>';
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  });
}

function travelRemovePhoto(idx) {
  travelState.photoFiles.splice(idx, 1);
  travelState.photoDataUrls.splice(idx, 1);

  var preview = document.getElementById('travel-photo-preview');
  preview.innerHTML = '';
  travelState.photoDataUrls.forEach(function(url, i) {
    var img = document.createElement('div');
    img.className = 'travel-photo-thumb';
    img.innerHTML = '<img src="' + url + '" alt="Photo ' + (i + 1) + '">' +
      '<button type="button" onclick="travelRemovePhoto(' + i + ')">&times;</button>';
    preview.appendChild(img);
  });
}

// ===== VIEW SWITCHING =====

function travelShowWrite() {
  document.getElementById('travel-form').reset();
  document.getElementById('travel-photo-preview').innerHTML = '';
  document.getElementById('travel-post-lat').value = '';
  document.getElementById('travel-post-lng').value = '';
  document.getElementById('travel-coords-display').textContent = '';
  travelState.photoFiles = [];
  travelState.photoDataUrls = [];
  travelState.writeMarker = null;

  document.getElementById('travel-write-overlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';

  setTimeout(function() {
    if (!travelState.writeMap) {
      initWriteMap();
    } else {
      getMapProvider().triggerResize(travelState.writeMap);
    }
  }, 100);
}

function travelCloseWrite() {
  document.getElementById('travel-write-overlay').style.display = 'none';
  document.body.style.overflow = '';
}

function travelShowDetail(postId) {
  var posts = getTravelPosts();
  var post = posts.find(function(p) { return p.id === postId; });
  if (!post) return;

  post.views = (post.views || 0) + 1;
  saveTravelPosts(posts);

  // Images
  var imagesEl = document.getElementById('travel-detail-images');
  if (post.photos && post.photos.length > 0) {
    imagesEl.innerHTML = post.photos.map(function(url) {
      return '<img src="' + url + '" alt="Travel photo">';
    }).join('');
    imagesEl.style.display = '';
  } else {
    imagesEl.style.display = 'none';
    imagesEl.innerHTML = '';
  }

  // Category
  var catEl = document.getElementById('travel-detail-cat');
  var catInfo = TRAVEL_CATEGORIES[post.category] || { color: '#666', bg: '#f5f5f5' };
  catEl.textContent = getTravelCatLabel(post.category);
  catEl.style.background = catInfo.bg;
  catEl.style.color = catInfo.color;

  // Basic info
  document.getElementById('travel-detail-title').textContent = post.title;
  document.getElementById('travel-detail-author').textContent = post.author;
  document.getElementById('travel-detail-date').textContent = formatTravelDate(post.createdAt);
  document.getElementById('travel-detail-views').textContent = getTravelText('views') + ' ' + post.views;

  // Instagram tags
  var tagsEl = document.getElementById('travel-detail-tags');
  if (post.instagram) {
    var tags = post.instagram.split(/[\s,]+/).filter(Boolean);
    tagsEl.innerHTML = tags.map(function(tag) {
      var cleanTag = tag.replace(/^@/, '');
      if (tag.startsWith('@')) {
        return '<a href="https://instagram.com/' + encodeURIComponent(cleanTag) + '" target="_blank" rel="noopener" class="travel-tag travel-tag-user">@' + escapeHtml(cleanTag) + '</a>';
      }
      var cleanHash = tag.replace(/^#/, '');
      return '<a href="https://instagram.com/explore/tags/' + encodeURIComponent(cleanHash) + '" target="_blank" rel="noopener" class="travel-tag travel-tag-hash">#' + escapeHtml(cleanHash) + '</a>';
    }).join(' ');
    tagsEl.style.display = '';
  } else {
    tagsEl.style.display = 'none';
  }

  // Content
  document.getElementById('travel-detail-content').innerHTML = nl2br(post.content);

  // Location link - dynamic based on current map provider
  var locEl = document.getElementById('travel-detail-location');
  if (post.lat && post.lng) {
    var p = getMapProvider();
    var mapUrl = p.getExternalMapUrl(post.lat, post.lng);
    var mapLabel = travelState.mapProvider === 'google' ? getTravelText('openMapGoogle') : getTravelText('openMap');
    var mapBgColor = travelState.mapProvider === 'google' ? '#4285F4' : '#03C75A';
    var mapHoverColor = travelState.mapProvider === 'google' ? '#3367D6' : '#02b351';
    locEl.innerHTML = '<a href="' + mapUrl + '" target="_blank" rel="noopener" class="travel-map-link" style="background:' + mapBgColor + ';" onmouseover="this.style.background=\'' + mapHoverColor + '\'" onmouseout="this.style.background=\'' + mapBgColor + '\'">' +
      mapLabel +
      '</a>';
    locEl.style.display = '';
  } else {
    locEl.style.display = 'none';
  }

  document.getElementById('travel-detail-overlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function travelCloseDetail() {
  document.getElementById('travel-detail-overlay').style.display = 'none';
  document.body.style.overflow = '';
}

// ===== SUBMIT =====

function travelSubmitPost(event) {
  event.preventDefault();

  var title = document.getElementById('travel-post-title').value.trim();
  var author = document.getElementById('travel-post-author').value.trim();
  var content = document.getElementById('travel-post-content').value.trim();
  var category = document.getElementById('travel-post-category').value;
  var instagram = document.getElementById('travel-post-instagram').value.trim();
  var lat = parseFloat(document.getElementById('travel-post-lat').value) || null;
  var lng = parseFloat(document.getElementById('travel-post-lng').value) || null;

  if (!title || !author || !content) return;

  var post = {
    id: getTravelNextId(),
    category: category,
    title: title,
    author: author,
    content: content,
    instagram: instagram,
    lat: lat,
    lng: lng,
    photos: travelState.photoDataUrls.slice(),
    createdAt: new Date().toISOString(),
    views: 0,
    approved: false
  };

  // Add to pending list
  var pending = getTravelPending();
  pending.push(post);
  saveTravelPending(pending);

  travelCloseWrite();
  alert(getTravelText('submitted'));
}

// ===== ADMIN =====

function travelShowAdmin() {
  document.getElementById('travel-admin-password').value = '';
  document.getElementById('travel-admin-error').style.display = 'none';
  renderPendingPosts();
  document.getElementById('travel-admin-overlay').style.display = 'flex';
}

function travelCloseAdmin() {
  document.getElementById('travel-admin-overlay').style.display = 'none';
}

function renderPendingPosts() {
  var pending = getTravelPending();
  var list = document.getElementById('travel-pending-list');

  if (pending.length === 0) {
    list.innerHTML = '<p style="text-align:center;color:var(--gray-300);padding:20px;">' + getTravelText('noPending') + '</p>';
    return;
  }

  list.innerHTML = pending.map(function(post, idx) {
    var catInfo = TRAVEL_CATEGORIES[post.category] || { color: '#666', bg: '#f5f5f5' };
    return '<div class="travel-pending-item">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
        '<span class="cat-tag" style="background:' + catInfo.bg + ';color:' + catInfo.color + ';">' + getTravelCatLabel(post.category) + '</span>' +
        '<span style="font-size:0.78rem;color:var(--gray-300);">' + formatTravelDate(post.createdAt) + '</span>' +
      '</div>' +
      '<strong>' + escapeHtml(post.title) + '</strong>' +
      '<p style="font-size:0.85rem;color:var(--gray-600);margin:4px 0;">' + escapeHtml(post.content.substring(0, 100)) + '...</p>' +
      '<div style="font-size:0.8rem;color:var(--gray-300);margin-bottom:8px;">by ' + escapeHtml(post.author) + '</div>' +
      '<div style="display:flex;gap:8px;">' +
        '<button class="btn-primary" style="padding:6px 16px;font-size:0.8rem;" onclick="travelApprovePost(' + idx + ')">' + getTravelText('approve') + '</button>' +
        '<button class="btn-delete" onclick="travelRejectPost(' + idx + ')">' + getTravelText('reject') + '</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

async function travelApprovePost(idx) {
  var password = document.getElementById('travel-admin-password').value;
  if (!password) {
    document.getElementById('travel-admin-error').style.display = '';
    return;
  }

  var hash = await sha256(password);
  if (hash !== await sha256(SITE.adminPassword)) {
    document.getElementById('travel-admin-error').style.display = '';
    return;
  }

  document.getElementById('travel-admin-error').style.display = 'none';

  var pending = getTravelPending();
  if (idx >= pending.length) return;

  var post = pending.splice(idx, 1)[0];
  post.approved = true;
  saveTravelPending(pending);

  var posts = getTravelPosts();
  posts.push(post);
  saveTravelPosts(posts);

  renderPendingPosts();
  renderTravelList();
  addMapMarkers();
}

async function travelRejectPost(idx) {
  var password = document.getElementById('travel-admin-password').value;
  if (!password) {
    document.getElementById('travel-admin-error').style.display = '';
    return;
  }

  var hash = await sha256(password);
  if (hash !== await sha256(SITE.adminPassword)) {
    document.getElementById('travel-admin-error').style.display = '';
    return;
  }

  document.getElementById('travel-admin-error').style.display = 'none';

  var pending = getTravelPending();
  pending.splice(idx, 1);
  saveTravelPending(pending);

  renderPendingPosts();
}

// ===== RENDER LIST =====

function renderTravelList() {
  var posts = getTravelPosts();
  var filtered = travelState.currentCategory === 'all'
    ? posts
    : posts.filter(function(p) { return p.category === travelState.currentCategory; });

  filtered.sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });

  var totalPages = Math.max(1, Math.ceil(filtered.length / TRAVEL_CONFIG.postsPerPage));
  if (travelState.currentPage > totalPages) travelState.currentPage = totalPages;

  var start = (travelState.currentPage - 1) * TRAVEL_CONFIG.postsPerPage;
  var pageItems = filtered.slice(start, start + TRAVEL_CONFIG.postsPerPage);

  var listEl = document.getElementById('travel-list');
  var emptyEl = document.getElementById('travel-empty');

  if (filtered.length === 0) {
    listEl.innerHTML = '';
    emptyEl.style.display = '';
  } else {
    emptyEl.style.display = 'none';
    listEl.innerHTML = pageItems.map(function(post) {
      var catInfo = TRAVEL_CATEGORIES[post.category] || { color: '#666', bg: '#f5f5f5' };
      var thumb = post.photos && post.photos[0]
        ? '<div class="travel-card-image"><img src="' + post.photos[0] + '" alt="' + escapeHtml(post.title) + '" loading="lazy"></div>'
        : '<div class="travel-card-image travel-card-noimage"><span>' + getTravelCatLabel(post.category) + '</span></div>';

      var tags = '';
      if (post.instagram) {
        var tagArr = post.instagram.split(/[\s,]+/).filter(Boolean).slice(0, 3);
        tags = '<div class="travel-card-tags">' + tagArr.map(function(t) {
          return '<span class="travel-mini-tag">' + escapeHtml(t) + '</span>';
        }).join('') + '</div>';
      }

      return '<div class="travel-card" onclick="travelShowDetail(' + post.id + ')">' +
        thumb +
        '<div class="travel-card-body">' +
          '<span class="cat-tag" style="background:' + catInfo.bg + ';color:' + catInfo.color + ';font-size:0.7rem;">' + getTravelCatLabel(post.category) + '</span>' +
          '<h3 class="travel-card-title">' + escapeHtml(post.title) + '</h3>' +
          tags +
          '<div class="travel-card-meta">' +
            '<span>' + escapeHtml(post.author) + '</span>' +
            '<span>' + formatTravelDate(post.createdAt) + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  renderTravelPagination(filtered.length);
}

function renderTravelPagination(totalItems) {
  var totalPages = Math.max(1, Math.ceil(totalItems / TRAVEL_CONFIG.postsPerPage));
  var pag = document.getElementById('travel-pagination');

  if (totalPages <= 1) { pag.innerHTML = ''; return; }

  var html = '';
  if (travelState.currentPage > 1) {
    html += '<button class="pag-btn" onclick="travelGoPage(' + (travelState.currentPage - 1) + ')">&lt;</button>';
  }

  var startPage = Math.max(1, travelState.currentPage - 2);
  var endPage = Math.min(totalPages, startPage + 4);

  for (var i = startPage; i <= endPage; i++) {
    html += '<button class="pag-btn' + (i === travelState.currentPage ? ' active' : '') + '" onclick="travelGoPage(' + i + ')">' + i + '</button>';
  }

  if (travelState.currentPage < totalPages) {
    html += '<button class="pag-btn" onclick="travelGoPage(' + (travelState.currentPage + 1) + ')">&gt;</button>';
  }

  pag.innerHTML = html;
}

function travelGoPage(page) {
  travelState.currentPage = page;
  renderTravelList();
  window.scrollTo({ top: 300, behavior: 'smooth' });
}

// ===== CATEGORY FILTER =====

function initTravelCategoryFilters() {
  document.querySelectorAll('#travel-categories .board-cat-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('#travel-categories .board-cat-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      travelState.currentCategory = btn.dataset.cat;
      travelState.currentPage = 1;
      renderTravelList();
      addMapMarkers();
    });
  });
}

// ===== SAMPLE DATA =====

function initTravelSampleData() {
  if (getTravelPosts().length > 0) return;
  if (typeof SITE_SAMPLE_TRAVEL === 'undefined' || !SITE_SAMPLE_TRAVEL.length) return;

  var now = new Date();
  var posts = SITE_SAMPLE_TRAVEL.map(function(p, i) {
    return {
      id: getTravelNextId(),
      category: p.category,
      title: p.title,
      author: p.author,
      content: p.content,
      instagram: p.instagram || '',
      lat: p.lat || null,
      lng: p.lng || null,
      photos: p.photos || [],
      createdAt: new Date(now - 86400000 * (SITE_SAMPLE_TRAVEL.length - i)).toISOString(),
      views: Math.floor(Math.random() * 30) + 5,
      approved: true
    };
  });

  saveTravelPosts(posts);
  localStorage.setItem(TRAVEL_CONFIG.storageKeys.counter, String(posts.length));
}

// ===== TRANSLATIONS =====

function applyTravelTranslations() {
  var catBtns = document.querySelectorAll('#travel-categories .board-cat-btn');
  var catKeys = ['catAll', 'catFood', 'catAttraction', 'catCafe', 'catNature', 'catShopping', 'catNightlife'];
  catBtns.forEach(function(btn, i) { if (catKeys[i]) btn.textContent = getTravelText(catKeys[i]); });

  var writeBtn = document.getElementById('btn-travel-write');
  if (writeBtn) writeBtn.textContent = getTravelText('writeBtn');

  var emptyEl = document.getElementById('travel-empty');
  if (emptyEl) emptyEl.textContent = getTravelText('empty');

  // Update toggle button labels
  var toggleBtns = document.querySelectorAll('.travel-map-provider-btn');
  toggleBtns.forEach(function(btn) {
    if (btn.dataset.provider === 'naver') btn.textContent = getTravelText('mapNaver');
    if (btn.dataset.provider === 'google') btn.textContent = getTravelText('mapGoogle');
  });

  renderTravelList();
}

// ===== ADMIN TRIGGER (double-click page header) =====

function initAdminTrigger() {
  var header = document.querySelector('.page-header');
  if (header) {
    var clickCount = 0;
    var clickTimer = null;
    header.addEventListener('click', function() {
      clickCount++;
      if (clickCount >= 5) {
        clickCount = 0;
        clearTimeout(clickTimer);
        travelShowAdmin();
      }
      if (!clickTimer) {
        clickTimer = setTimeout(function() { clickCount = 0; clickTimer = null; }, 2000);
      }
    });
  }
}

// ===== INIT =====

function initTravel() {
  initTravelSampleData();
  initTravelCategoryFilters();
  initPhotoUpload();
  initAdminTrigger();
  applyTravelTranslations();
  renderTravelList();
  initTravelMap();

  // Close modals on overlay click
  document.getElementById('travel-detail-overlay').addEventListener('click', function(e) {
    if (e.target === e.currentTarget) travelCloseDetail();
  });
  document.getElementById('travel-write-overlay').addEventListener('click', function(e) {
    if (e.target === e.currentTarget) travelCloseWrite();
  });
  document.getElementById('travel-admin-overlay').addEventListener('click', function(e) {
    if (e.target === e.currentTarget) travelCloseAdmin();
  });

  // ESC key to close modals
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      travelCloseDetail();
      travelCloseWrite();
      travelCloseAdmin();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTravel);
} else {
  initTravel();
}

// Hook into language toggle
var _origSetLangTravel = typeof setLanguage === 'function' ? setLanguage : null;
if (_origSetLangTravel) {
  window._origSetLangTravel = setLanguage;
  setLanguage = function(lang) {
    window._origSetLangTravel(lang);
    setTimeout(applyTravelTranslations, 50);
  };
}
