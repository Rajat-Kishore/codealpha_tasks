const images = [
  { id: 1,  cat: 'structure', seed: 'arch1',  title: 'Concrete Stairwell' },
  { id: 2,  cat: 'nature',    seed: 'nat1',   title: 'Fog Over Ridgeline' },
  { id: 3,  cat: 'people',    seed: 'ppl1',   title: 'Market Morning' },
  { id: 4,  cat: 'still',     seed: 'still1', title: 'Clay and Glass' },
  { id: 5,  cat: 'structure', seed: 'arch2',  title: 'Steel Lattice' },
  { id: 6,  cat: 'nature',    seed: 'nat2',   title: 'River Bend' },
  { id: 7,  cat: 'people',    seed: 'ppl2',   title: 'Platform, 8AM' },
  { id: 8,  cat: 'still',     seed: 'still2', title: 'Folded Linen' },
  { id: 9,  cat: 'structure', seed: 'arch3',  title: 'Window Grid' },
  { id: 10, cat: 'nature',    seed: 'nat3',   title: 'Pine Line' },
  { id: 11, cat: 'people',    seed: 'ppl3',   title: 'Workshop Hands' },
  { id: 12, cat: 'still',     seed: 'still3', title: 'Ceramic Study' },
  { id: 13, cat: 'structure', seed: 'arch4',  title: 'Spiral Landing' },
  { id: 14, cat: 'nature',    seed: 'nat4',   title: 'Low Tide' },
  { id: 15, cat: 'people',    seed: 'ppl4',   title: 'Reading Room' },
  { id: 16, cat: 'still',     seed: 'still4', title: 'Tools, Arranged' },
  { id: 17, cat: 'structure', seed: 'arch5',  title: 'Brutalist Corner' },
  { id: 18, cat: 'nature',    seed: 'nat5',   title: 'Canopy Light' },
  { id: 19, cat: 'people',    seed: 'ppl5',   title: 'Corner Bench' },
  { id: 20, cat: 'still',     seed: 'still5', title: 'Paper and Ink' },
  { id: 21, cat: 'structure', seed: 'arch6',  title: 'Underpass' },
  { id: 22, cat: 'nature',    seed: 'nat6',   title: 'Frost Field' },
  { id: 23, cat: 'people',    seed: 'ppl6',   title: 'Studio Break' },
  { id: 24, cat: 'still',     seed: 'still6', title: 'Copper Vessel' },
];

const heights = [420, 320, 500, 360, 440, 300, 480, 340];

function imageUrl(seed, w, h){
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

const galleryEl = document.getElementById('gallery');
const filtersEl = document.getElementById('filters');

function renderGallery(){
  galleryEl.innerHTML = images.map((img, i) => {
    const h = heights[i % heights.length];
    const num = String(img.id).padStart(2, '0');
    return `
      <div class="tile" data-cat="${img.cat}" data-index="${i}">
        <span class="tile-index">${num}</span>
        <img src="${imageUrl(img.seed, 480, h)}" alt="${img.title}" loading="lazy">
        <div class="tile-caption">${img.title}</div>
      </div>`;
  }).join('');
}

renderGallery();

let activeFilter = 'all';

filtersEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  activeFilter = btn.dataset.filter;

  filtersEl.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('is-active'));
  btn.classList.add('is-active');

  document.querySelectorAll('.tile').forEach(tile => {
    const show = activeFilter === 'all' || tile.dataset.cat === activeFilter;
    tile.classList.toggle('is-hidden', !show);
  });
});

/* ---------- lightbox ---------- */

const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lbImage');
const lbCaption = document.getElementById('lbCaption');
const lbIndex = document.getElementById('lbIndex');
const lbTotal = document.getElementById('lbTotal');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');

lbTotal.textContent = String(images.length).padStart(2, '0');

let currentIndex = 0;

function openLightbox(index){
  currentIndex = index;
  showImage();
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function showImage(){
  const img = images[currentIndex];
  lbImage.classList.remove('is-visible');
  const full = new Image();
  full.onload = () => {
    lbImage.src = full.src;
    lbImage.alt = img.title;
    requestAnimationFrame(() => lbImage.classList.add('is-visible'));
  };
  full.src = imageUrl(img.seed, 1200, 800);
  lbCaption.textContent = img.title;
  lbIndex.textContent = String(currentIndex + 1).padStart(2, '0');
}

function closeLightbox(){
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function step(delta){
  currentIndex = (currentIndex + delta + images.length) % images.length;
  showImage();
}

galleryEl.addEventListener('click', (e) => {
  const tile = e.target.closest('.tile');
  if (!tile) return;
  openLightbox(Number(tile.dataset.index));
});

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => step(-1));
lbNext.addEventListener('click', () => step(1));

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') step(-1);
  if (e.key === 'ArrowRight') step(1);
});
