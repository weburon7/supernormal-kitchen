import { createRoomScene } from './scene.js?v=5';

const stage = document.getElementById('table-stage');
const hero = document.querySelector('.room-hero');
const loading = document.getElementById('table-loading');
const list = document.getElementById('specials-list');
const dialog = document.getElementById('dish-dialog');
const menuDialog = document.getElementById('wall-menu-dialog');
const menuList = document.getElementById('wall-menu-list');
const menuSearch = document.getElementById('wall-menu-search');
const tooltip = document.getElementById('dish-tooltip');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const menuToolbar = document.getElementById('room-menu-toolbar');
const backButton = document.getElementById('room-back');
const standUpButton = document.getElementById('stand-up');
const seatHint = document.getElementById('seat-hint');
const posterLeft = document.getElementById('poster-left');
const posterRight = document.getElementById('poster-right');
let scene = null;
let menuItems = [];
let lastFocus = null;
const node = (tag, text, className) => {
  const element = document.createElement(tag);
  if (text) element.textContent = text;
  if (className) element.className = className;
  return element;
};
const slug = name => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
function itemImage(item) { return item.image || `assets/images/dishes/${slug(item.name)}.webp`; }
function openDish(item) {
  lastFocus = document.activeElement;
  if (menuDialog.open) menuDialog.close();
  document.getElementById('dish-dialog-source').textContent = item.category ? 'FROM THE WALL MENU' : "FROM THE CHEF'S TABLE";
  document.getElementById('dish-dialog-title').textContent = item.name;
  document.getElementById('dish-dialog-description').textContent = item.description;
  document.getElementById('dish-dialog-price').textContent = item.price;
  const image = document.getElementById('dish-dialog-image');
  image.src = itemImage(item); image.alt = item.name;
  image.onerror = () => { image.onerror = null; image.src = 'assets/images/hero/hero-bowl.webp'; };
  const video = document.getElementById('dish-dialog-video');
  const showVideo = Boolean(item.video && !reducedMotion);
  video.hidden = !showVideo; image.hidden = showVideo;
  if (showVideo) { video.src = item.video; video.poster = itemImage(item); video.play().catch(() => {}); }
  else { video.pause(); video.removeAttribute('src'); video.load(); }
  const tags = document.getElementById('dish-dialog-tags'); tags.replaceChildren();
  const itemTags = item.tags || [item.category, item.allergens && `Contains ${item.allergens}`].filter(Boolean);
  itemTags.forEach(tag => tags.append(node('span', tag)));
  document.getElementById('dish-order').href = `order.html?item=${encodeURIComponent(item.name)}#preorder`;
  tooltip.hidden = true;
  dialog.showModal();
}
function closeDish() { dialog.close(); }
dialog.querySelector('.dish-dialog-close').addEventListener('click', closeDish);
dialog.addEventListener('click', event => { if (event.target === dialog) closeDish(); });
dialog.addEventListener('close', () => { document.getElementById('dish-dialog-video').pause(); lastFocus?.focus?.(); });
function renderSpecials(specials) {
  list.replaceChildren();
  specials.forEach(special => {
    const card = node('button', '', 'special-list-card'); card.type = 'button';
    const image = node('img'); image.src = special.image; image.alt = ''; image.loading = 'lazy';
    card.append(image, node('span', special.name), node('strong', special.price));
    card.addEventListener('click', () => openDish(special)); list.append(card);
  });
}
function renderMenu(query = '') {
  menuList.replaceChildren();
  const filtered = menuItems.filter(item => `${item.name} ${item.category} ${item.description}`.toLowerCase().includes(query.toLowerCase()));
  let category = '';
  for (const item of filtered) {
    if (item.category !== category) { category = item.category; menuList.append(node('h3', category)); }
    const button = node('button', '', 'wall-menu-item'); button.type = 'button';
    button.append(node('span', item.name), node('strong', item.price));
    button.addEventListener('click', () => openDish(item)); menuList.append(button);
  }
  if (!filtered.length) menuList.append(node('p', 'No dishes found. Try another search.'));
}
function openMenu() { renderMenu(menuSearch.value); menuDialog.showModal(); menuSearch.focus(); }
document.getElementById('menu-zoom-in').addEventListener('click', () => scene?.zoomIn());
document.getElementById('menu-zoom-out').addEventListener('click', () => scene?.zoomOut());
document.querySelectorAll('[data-seat]').forEach(button => button.addEventListener('click', () => scene?.sitAt(Number(button.dataset.seat))));
standUpButton.addEventListener('click', () => { scene?.standUp(); hero.classList.remove('is-seated','menu-focused'); menuToolbar.hidden = true; });
document.getElementById('wall-menu-close').addEventListener('click', () => menuDialog.close());
menuDialog.addEventListener('click', event => { if (event.target === menuDialog) menuDialog.close(); });
menuSearch.addEventListener('input', () => renderMenu(menuSearch.value));
function focusWall(side='right') {
  if (!scene) { openMenu(); return; }
  scene.focusMenu(side);
  hero.classList.add('menu-focused');
  menuToolbar.hidden = false;
  posterLeft.setAttribute('aria-pressed', String(side === 'left'));
  posterRight.setAttribute('aria-pressed', String(side === 'right'));
}
posterLeft.addEventListener('click', () => focusWall('left'));
posterRight.addEventListener('click', () => focusWall('right'));
backButton.addEventListener('click', () => {
  scene?.resetView(); hero.classList.remove('menu-focused'); menuToolbar.hidden = true;
});
function canRenderWebGL() {
  try { const canvas = document.createElement('canvas'); return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl')); }
  catch { return false; }
}
async function init() {
  try {
    const [specialResponse, menuResponse] = await Promise.all([fetch('data/specials.json?v=2'), fetch('data/menu.json')]);
    if (!specialResponse.ok || !menuResponse.ok) throw new Error('Menu data could not load.');
    const specials = await specialResponse.json();
    menuItems = (await menuResponse.json()).items;
    renderSpecials(specials);
    if (!canRenderWebGL()) { stage.classList.add('is-fallback'); loading.textContent = 'Explore the menu below.'; return; }
    scene = createRoomScene(stage, specials, menuItems, {
      reducedMotion,
      onReady(success = true) {
        if (success === false) { stage.classList.add('is-fallback'); loading.textContent = 'Explore the menu below.'; return; }
        stage.classList.add('is-ready'); loading.hidden = true;
      },
      onSelect: openDish,
      onMenuItem: openDish,
      onOpenMenu(side) {
        if (scene?.isMenuFocused(side)) openMenu();
        else focusWall(side);
      },
      onSeatChange(seated) {
        hero.classList.toggle('is-seated', seated);
        standUpButton.hidden = !seated;
        seatHint.textContent = seated ? 'DRAG THE TABLE TO TURN IT · SELECT A SPECIAL' : 'Drag to look around · choose a chair to sit';
      },
      onHover(special, event, chair) {
        tooltip.hidden = !special && !chair;
        if (chair) {
          tooltip.textContent = 'Sit at this chair';
          const rect = stage.getBoundingClientRect();
          tooltip.style.left = `${event.clientX - rect.left + 14}px`;
          tooltip.style.top = `${event.clientY - rect.top - 34}px`;
        } else if (special) {
          tooltip.textContent = special.name;
          const rect = stage.getBoundingClientRect();
          tooltip.style.left = `${event.clientX - rect.left + 14}px`;
          tooltip.style.top = `${event.clientY - rect.top - 34}px`;
        }
      }
    });
  } catch (error) {
    stage.classList.add('is-fallback');
    loading.textContent = 'The interactive room is unavailable. Browse the full menu.';
    list.replaceChildren(node('p', 'Specials could not load. Please visit the full menu.'));
    const link = node('a', 'View full menu ↗'); link.href = 'menu.html'; list.append(link);
    console.error(error);
  }
}
init();
