const grid = document.getElementById('grid');
const info = document.getElementById('info');
const btnMatch = document.getElementById('match');
const btnAll = document.getElementById('all');
const EMOJI = {'Tomato Omelette':'🍳','Vegetable Soup':'🥣','Vegetable Pasta':'🍝','Bread Pudding':'🍞'};
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let recipes = [];

function render(list, showMatch) {
  if (!list.length) { grid.innerHTML = '<p class="empty">Aucune recette ne correspond à vos aliments 🥕</p>'; return; }
  grid.innerHTML = list.map(r => {
    const chips = r.ingredients.map(i => {
      const has = r.have.includes(i);
      return `<span class="chip ${showMatch && has ? 'have' : ''}">${esc(i)}</span>`;
    }).join('');
    const score = showMatch ? `<p class="score">Vous avez ${r.have.length}/${r.ingredients.length} ingrédients</p>` : '';
    return `<div class="card recipe">
      <div class="pic">${EMOJI[r.nom] || '🍽️'}</div>
      <h3>${esc(r.nom)}</h3>${score}
      <div class="chips">${chips}</div>
      <p class="desc" hidden>${esc(r.description || '')}</p>
      <button class="btn small" onclick="toggle(this)">View Recipe</button>
    </div>`;
  }).join('');
}

function toggle(btn) {
  const d = btn.parentElement.querySelector('.desc');
  d.hidden = !d.hidden;
  btn.textContent = d.hidden ? 'View Recipe' : 'Hide Recipe';
}

btnMatch.onclick = () => {
  const m = recipes.filter(r => r.have.length > 0)
    .sort((a, b) => b.have.length / b.ingredients.length - a.have.length / a.ingredients.length);
  render(m, true);
  info.textContent = m.length + ' recette(s) trouvée(s)';
  btnMatch.style.display = 'none'; btnAll.style.display = '';
};
btnAll.onclick = () => {
  render(recipes, false); info.textContent = '';
  btnAll.style.display = 'none'; btnMatch.style.display = '';
};

fetch('/api/recipes').then(r => r.json()).then(d => { recipes = d; render(d, false); });
