// KoInfo Community Board - localStorage based
// Uses SITE from site-config.js and currentLang from main.js

const BOARD_CONFIG = {
  postsPerPage: 15,
  adminHash: '',
  storageKeys: {
    posts: SITE.storagePrefix + '_board_posts',
    comments: SITE.storagePrefix + '_board_comments',
    counter: SITE.storagePrefix + '_board_counter'
  }
};

const BOARD_CATEGORIES = {
  free: { key: 'board.catFree' },
  question: { key: 'board.catQuestion' },
  info: { key: 'board.catInfo' },
  job: { key: 'board.catJob' },
  trade: { key: 'board.catTrade' }
};

let boardState = {
  currentView: 'list',
  currentCategory: 'all',
  currentPage: 1,
  currentPostId: null,
  editMode: false,
  passwordCallback: null
};

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

(async function() {
  BOARD_CONFIG.adminHash = await sha256(SITE.adminPassword);
})();

function getPosts() {
  try { return JSON.parse(localStorage.getItem(BOARD_CONFIG.storageKeys.posts)) || []; }
  catch { return []; }
}

function savePosts(posts) {
  localStorage.setItem(BOARD_CONFIG.storageKeys.posts, JSON.stringify(posts));
}

function getComments() {
  try { return JSON.parse(localStorage.getItem(BOARD_CONFIG.storageKeys.comments)) || []; }
  catch { return []; }
}

function saveComments(comments) {
  localStorage.setItem(BOARD_CONFIG.storageKeys.comments, JSON.stringify(comments));
}

function getNextId() {
  let counter = parseInt(localStorage.getItem(BOARD_CONFIG.storageKeys.counter)) || 0;
  counter++;
  localStorage.setItem(BOARD_CONFIG.storageKeys.counter, String(counter));
  return counter;
}

function initSampleData() {
  if (getPosts().length > 0) return;
  // Sample data will come from site-specific lang.js via SITE_SAMPLE_POSTS if defined
  if (typeof SITE_SAMPLE_POSTS !== 'undefined' && SITE_SAMPLE_POSTS.length > 0) {
    const now = new Date();
    const posts = SITE_SAMPLE_POSTS.map((p, i) => ({
      id: getNextId(),
      category: p.category,
      title: p.title,
      titleKo: p.titleKo,
      author: p.author,
      passwordHash: '',
      content: p.content,
      contentKo: p.contentKo,
      createdAt: new Date(now - 86400000 * (SITE_SAMPLE_POSTS.length - i)).toISOString(),
      views: Math.floor(Math.random() * 50) + 10
    }));

    savePosts(posts);

    if (typeof SITE_SAMPLE_COMMENTS !== 'undefined') {
      saveComments(SITE_SAMPLE_COMMENTS.map((c, i) => ({
        id: i + 1,
        postId: c.postId,
        author: c.author,
        content: c.content,
        contentKo: c.contentKo,
        createdAt: new Date(now - 43200000 * (SITE_SAMPLE_COMMENTS.length - i)).toISOString()
      })));
    }

    localStorage.setItem(BOARD_CONFIG.storageKeys.counter, String(posts.length));
  }
}

function getCatLabel(cat) {
  const lang = (typeof currentLang !== 'undefined') ? currentLang : SITE.lang;
  const t = typeof translations !== 'undefined' ? translations[lang] : null;
  const catObj = BOARD_CATEGORIES[cat];
  if (t && catObj && t[catObj.key]) return t[catObj.key];
  return cat;
}

function formatBoardDate(isoStr) {
  const d = new Date(isoStr);
  return d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function nl2br(str) {
  return escapeHtml(str).replace(/\n/g, '<br>');
}

function getLocalizedField(post, field) {
  const lang = (typeof currentLang !== 'undefined') ? currentLang : SITE.lang;
  if (lang === 'ko' && post[field + 'Ko']) return post[field + 'Ko'];
  return post[field] || '';
}

function getBoardText(key) {
  const lang = (typeof currentLang !== 'undefined') ? currentLang : SITE.lang;
  const t = typeof translations !== 'undefined' ? translations[lang] : null;
  if (t && t['board.' + key]) return t['board.' + key];
  // Fallback
  const fallback = {
    write: 'Write', all: 'All', no: 'No.', category: 'Category',
    postTitle: 'Title', author: 'Author', date: 'Date', views: 'Views',
    empty: 'No posts.', back: 'Back', edit: 'Edit', delete: 'Delete',
    comments: 'Comments', submit: 'Submit', cancel: 'Cancel',
    writePost: 'New Post', editPost: 'Edit Post',
    passwordRequired: 'Enter password', passwordWrong: 'Wrong password',
    titleLabel: 'Title', authorLabel: 'Author', passwordLabel: 'Password',
    passwordDesc: 'Required for edit/delete', contentLabel: 'Content',
    titlePh: 'Enter title', authorPh: 'Your name', passwordPh: 'Min 4 chars',
    contentPh: 'Write content...', commentAuthorPh: 'Your name', commentPh: 'Write comment...',
    categoryLabel: 'Category', viewed: 'Views'
  };
  return fallback[key] || key;
}

// ===== VIEW SWITCHING =====

function boardShowList() {
  document.getElementById('board-list-view').style.display = '';
  document.getElementById('board-detail-view').style.display = 'none';
  document.getElementById('board-write-view').style.display = 'none';
  boardState.currentView = 'list';
  boardState.currentPostId = null;
  renderPostList();
}

function boardShowDetail(postId) {
  const posts = getPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  post.views = (post.views || 0) + 1;
  savePosts(posts);

  boardState.currentPostId = postId;
  boardState.currentView = 'detail';

  document.getElementById('board-list-view').style.display = 'none';
  document.getElementById('board-detail-view').style.display = '';
  document.getElementById('board-write-view').style.display = 'none';

  renderPostDetail(post);
  renderComments(postId);
}

function boardShowWrite() {
  boardState.editMode = false;
  document.getElementById('edit-post-id').value = '';
  document.getElementById('post-category').value = 'free';
  document.getElementById('post-title').value = '';
  document.getElementById('post-author').value = '';
  document.getElementById('post-password').value = '';
  document.getElementById('post-password').required = true;
  document.getElementById('post-content').value = '';
  document.getElementById('write-view-title').textContent = getBoardText('writePost');

  document.getElementById('board-list-view').style.display = 'none';
  document.getElementById('board-detail-view').style.display = 'none';
  document.getElementById('board-write-view').style.display = '';
  boardState.currentView = 'write';
}

function boardShowEdit(post) {
  boardState.editMode = true;
  document.getElementById('edit-post-id').value = post.id;
  document.getElementById('post-category').value = post.category;
  document.getElementById('post-title').value = post.title;
  document.getElementById('post-author').value = post.author;
  document.getElementById('post-password').value = '';
  document.getElementById('post-password').required = false;
  document.getElementById('post-content').value = post.content;
  document.getElementById('write-view-title').textContent = getBoardText('editPost');

  document.getElementById('board-list-view').style.display = 'none';
  document.getElementById('board-detail-view').style.display = 'none';
  document.getElementById('board-write-view').style.display = '';
  boardState.currentView = 'write';
}

// ===== RENDER =====

function renderPostList() {
  const posts = getPosts();
  const filtered = boardState.currentCategory === 'all'
    ? posts
    : posts.filter(p => p.category === boardState.currentCategory);

  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalPages = Math.max(1, Math.ceil(filtered.length / BOARD_CONFIG.postsPerPage));
  if (boardState.currentPage > totalPages) boardState.currentPage = totalPages;

  const start = (boardState.currentPage - 1) * BOARD_CONFIG.postsPerPage;
  const pageItems = filtered.slice(start, start + BOARD_CONFIG.postsPerPage);

  const tbody = document.getElementById('board-list');
  const emptyDiv = document.getElementById('board-empty');

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    emptyDiv.style.display = '';
  } else {
    emptyDiv.style.display = 'none';
    const comments = getComments();

    tbody.innerHTML = pageItems.map((post, idx) => {
      const commentCount = comments.filter(c => c.postId === post.id).length;
      const commentBadge = commentCount > 0 ? '<span class="comment-count">[' + commentCount + ']</span>' : '';
      const title = escapeHtml(getLocalizedField(post, 'title'));
      return '<tr onclick="boardShowDetail(' + post.id + ')" class="board-row">' +
        '<td class="col-no">' + (filtered.length - start - idx) + '</td>' +
        '<td class="col-cat"><span class="cat-tag cat-' + post.category + '">' + getCatLabel(post.category) + '</span></td>' +
        '<td class="col-title">' + title + ' ' + commentBadge + '</td>' +
        '<td class="col-author">' + escapeHtml(post.author) + '</td>' +
        '<td class="col-date">' + formatBoardDate(post.createdAt) + '</td>' +
        '<td class="col-views">' + (post.views || 0) + '</td>' +
      '</tr>';
    }).join('');
  }

  renderPagination(filtered.length);
}

function renderPostDetail(post) {
  document.getElementById('detail-cat').textContent = getCatLabel(post.category);
  document.getElementById('detail-cat').className = 'board-detail-cat cat-tag cat-' + post.category;
  document.getElementById('detail-title').textContent = getLocalizedField(post, 'title');
  document.getElementById('detail-author').textContent = post.author;
  document.getElementById('detail-date').textContent = formatBoardDate(post.createdAt);
  document.getElementById('detail-views').textContent = getBoardText('viewed') + ' ' + (post.views || 0);
  document.getElementById('detail-content').innerHTML = nl2br(getLocalizedField(post, 'content'));
}

function renderComments(postId) {
  const comments = getComments().filter(c => c.postId === postId);
  comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  document.getElementById('comments-count').textContent = comments.length;

  const list = document.getElementById('comments-list');
  if (comments.length === 0) {
    const lang = (typeof currentLang !== 'undefined') ? currentLang : SITE.lang;
    list.innerHTML = '<p class="no-comments">' + (lang === 'ko' ? '댓글이 없습니다.' : getBoardText('noComments')) + '</p>';
    return;
  }

  list.innerHTML = comments.map(c => {
    const content = getLocalizedField(c, 'content');
    return '<div class="comment-item">' +
      '<div class="comment-header">' +
        '<strong>' + escapeHtml(c.author) + '</strong>' +
        '<span class="comment-date">' + formatBoardDate(c.createdAt) + '</span>' +
      '</div>' +
      '<div class="comment-body">' + nl2br(content) + '</div>' +
    '</div>';
  }).join('');
}

function renderPagination(totalItems) {
  const totalPages = Math.max(1, Math.ceil(totalItems / BOARD_CONFIG.postsPerPage));
  const pag = document.getElementById('board-pagination');

  if (totalPages <= 1) { pag.innerHTML = ''; return; }

  let html = '';
  if (boardState.currentPage > 1) {
    html += '<button class="pag-btn" onclick="boardGoPage(' + (boardState.currentPage - 1) + ')">&lt;</button>';
  }

  const startPage = Math.max(1, boardState.currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);

  for (let i = startPage; i <= endPage; i++) {
    html += '<button class="pag-btn' + (i === boardState.currentPage ? ' active' : '') + '" onclick="boardGoPage(' + i + ')">' + i + '</button>';
  }

  if (boardState.currentPage < totalPages) {
    html += '<button class="pag-btn" onclick="boardGoPage(' + (boardState.currentPage + 1) + ')">&gt;</button>';
  }

  pag.innerHTML = html;
}

function boardGoPage(page) {
  boardState.currentPage = page;
  renderPostList();
  window.scrollTo({ top: 200, behavior: 'smooth' });
}

// ===== CRUD =====

async function boardSubmitPost(event) {
  event.preventDefault();

  const title = document.getElementById('post-title').value.trim();
  const author = document.getElementById('post-author').value.trim();
  const password = document.getElementById('post-password').value;
  const content = document.getElementById('post-content').value.trim();
  const category = document.getElementById('post-category').value;
  const editId = document.getElementById('edit-post-id').value;

  if (!title || !author || !content) return;

  if (boardState.editMode && editId) {
    const posts = getPosts();
    const post = posts.find(p => p.id === parseInt(editId));
    if (!post) return;

    post.title = title;
    post.author = author;
    post.content = content;
    post.category = category;
    if (password) post.passwordHash = await sha256(password);

    savePosts(posts);
    boardShowDetail(post.id);
  } else {
    if (!password || password.length < 4) {
      alert(currentLang === 'ko' ? '비밀번호는 최소 4자 이상이어야 합니다.' : getBoardText('passwordMinAlert'));
      return;
    }

    const passwordHash = await sha256(password);
    const post = {
      id: getNextId(), category, title, author, passwordHash, content,
      createdAt: new Date().toISOString(), views: 0
    };

    const posts = getPosts();
    posts.push(post);
    savePosts(posts);

    boardState.currentPage = 1;
    boardShowList();
  }
}

function boardEditPost() {
  const posts = getPosts();
  const post = posts.find(p => p.id === boardState.currentPostId);
  if (!post) return;

  if (!post.passwordHash) { boardShowEdit(post); return; }

  showPasswordModal(async (inputPassword) => {
    const hash = await sha256(inputPassword);
    if (hash === post.passwordHash || hash === BOARD_CONFIG.adminHash) {
      closePasswordModal();
      boardShowEdit(post);
      return true;
    }
    return false;
  });
}

function boardDeletePost() {
  const confirmMsg = currentLang === 'ko' ? '이 게시글을 삭제하시겠습니까?' : getBoardText('confirmDelete');

  const posts = getPosts();
  const post = posts.find(p => p.id === boardState.currentPostId);
  if (!post) return;

  if (!post.passwordHash) {
    if (!confirm(confirmMsg)) return;
    deletePostById(post.id);
    return;
  }

  showPasswordModal(async (inputPassword) => {
    const hash = await sha256(inputPassword);
    if (hash === post.passwordHash || hash === BOARD_CONFIG.adminHash) {
      closePasswordModal();
      if (!confirm(confirmMsg)) return true;
      deletePostById(post.id);
      return true;
    }
    return false;
  });
}

function deletePostById(postId) {
  let posts = getPosts();
  posts = posts.filter(p => p.id !== postId);
  savePosts(posts);
  let comments = getComments();
  comments = comments.filter(c => c.postId !== postId);
  saveComments(comments);
  boardShowList();
}

function boardAddComment() {
  const author = document.getElementById('comment-author').value.trim();
  const content = document.getElementById('comment-content').value.trim();

  if (!author || !content) {
    alert(currentLang === 'ko' ? '이름과 내용을 입력해주세요.' : getBoardText('commentRequired'));
    return;
  }

  const comments = getComments();
  const maxId = comments.length > 0 ? Math.max(...comments.map(c => c.id)) : 0;

  comments.push({
    id: maxId + 1, postId: boardState.currentPostId, author, content,
    createdAt: new Date().toISOString()
  });

  saveComments(comments);
  document.getElementById('comment-author').value = '';
  document.getElementById('comment-content').value = '';
  renderComments(boardState.currentPostId);
}

// ===== PASSWORD MODAL =====

function showPasswordModal(callback) {
  boardState.passwordCallback = callback;
  document.getElementById('modal-password').value = '';
  document.getElementById('modal-error').style.display = 'none';
  document.getElementById('password-modal').style.display = 'flex';
  document.getElementById('modal-password').focus();
}

function closePasswordModal() {
  document.getElementById('password-modal').style.display = 'none';
  boardState.passwordCallback = null;
}

async function confirmPassword() {
  const password = document.getElementById('modal-password').value;
  if (!password) return;

  if (boardState.passwordCallback) {
    const result = await boardState.passwordCallback(password);
    if (!result) {
      document.getElementById('modal-error').style.display = '';
      document.getElementById('modal-password').value = '';
      document.getElementById('modal-password').focus();
    }
  }
}

// ===== CATEGORY FILTER =====

function initCategoryFilters() {
  document.querySelectorAll('.board-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.board-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      boardState.currentCategory = btn.dataset.cat;
      boardState.currentPage = 1;
      renderPostList();
    });
  });
}

// ===== BOARD TRANSLATIONS =====

function applyBoardTranslations() {
  document.getElementById('btn-write').textContent = getBoardText('write');

  const catBtns = document.querySelectorAll('.board-cat-btn');
  const catKeys = ['all', 'catFree', 'catQuestion', 'catInfo', 'catJob', 'catTrade'];
  catBtns.forEach((btn, i) => { if (catKeys[i]) btn.textContent = getBoardText(catKeys[i]); });

  const ths = document.querySelectorAll('.board-table thead th');
  const thKeys = ['no', 'category', 'postTitle', 'author', 'date', 'views'];
  ths.forEach((th, i) => { if (thKeys[i]) th.textContent = getBoardText(thKeys[i]); });

  document.getElementById('board-empty').textContent = getBoardText('empty');

  const btnBack = document.getElementById('btn-back');
  const btnEdit = document.getElementById('btn-edit');
  const btnDelete = document.getElementById('btn-delete');
  if (btnBack) btnBack.textContent = getBoardText('back');
  if (btnEdit) btnEdit.textContent = getBoardText('edit');
  if (btnDelete) btnDelete.textContent = getBoardText('delete');

  const commentsTitle = document.getElementById('comments-title');
  if (commentsTitle) {
    const count = document.getElementById('comments-count');
    commentsTitle.innerHTML = getBoardText('comments') + ' (<span id="comments-count">' + (count ? count.textContent : '0') + '</span>)';
  }

  document.getElementById('comment-author').placeholder = getBoardText('commentAuthorPh');
  document.getElementById('comment-content').placeholder = getBoardText('commentPh');
  document.getElementById('btn-comment-submit').textContent = getBoardText('submit');

  document.getElementById('write-view-title').textContent = boardState.editMode ? getBoardText('editPost') : getBoardText('writePost');

  const labels = document.querySelectorAll('.board-form .form-group label');
  const labelKeys = ['categoryLabel', 'titleLabel', 'authorLabel', 'passwordLabel', 'contentLabel'];
  labels.forEach((label, i) => { if (labelKeys[i]) label.textContent = getBoardText(labelKeys[i]); });

  document.getElementById('post-title').placeholder = getBoardText('titlePh');
  document.getElementById('post-author').placeholder = getBoardText('authorPh');
  document.getElementById('post-password').placeholder = getBoardText('passwordPh');
  document.getElementById('post-content').placeholder = getBoardText('contentPh');

  const small = document.querySelector('.board-form small');
  if (small) small.textContent = getBoardText('passwordDesc');

  const formBtns = document.querySelectorAll('.form-actions button');
  if (formBtns[0]) formBtns[0].textContent = getBoardText('cancel');
  if (formBtns[1]) formBtns[1].textContent = getBoardText('submit');

  const opts = document.querySelectorAll('#post-category option');
  const optKeys = ['catFree', 'catQuestion', 'catInfo', 'catJob', 'catTrade'];
  opts.forEach((opt, i) => { if (optKeys[i]) opt.textContent = getBoardText(optKeys[i]); });

  document.getElementById('modal-title').textContent = getBoardText('passwordRequired');
  document.getElementById('modal-error').textContent = getBoardText('passwordWrong');

  if (boardState.currentView === 'list') renderPostList();
  if (boardState.currentView === 'detail' && boardState.currentPostId) {
    const post = getPosts().find(p => p.id === boardState.currentPostId);
    if (post) { renderPostDetail(post); renderComments(boardState.currentPostId); }
  }
}

// ===== INIT =====

function initBoard() {
  initSampleData();
  initCategoryFilters();
  applyBoardTranslations();
  renderPostList();

  document.getElementById('modal-password').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') confirmPassword();
  });

  document.getElementById('password-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closePasswordModal();
  });
}

document.addEventListener('DOMContentLoaded', () => { initBoard(); });

const originalSetLanguage = typeof setLanguage === 'function' ? setLanguage : null;
if (originalSetLanguage) {
  window._origSetLang = setLanguage;
  setLanguage = function(lang) {
    window._origSetLang(lang);
    setTimeout(applyBoardTranslations, 50);
  };
}
