const list = document.getElementById('list');

function statut(dateStr) {
  const jours = Math.ceil((new Date(dateStr) - new Date().setHours(0,0,0,0)) / 86400000);
  if (jours < 0) return ['Périmé', 'exp'];
  if (jours <= 3) return ['À surveiller', 'warn'];
  return ['OK', 'ok'];
}
const esc = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

async function charger() {
  const res = await fetch('/api/food');
  const data = await res.json();
  if (!data.length) { list.innerHTML = '<tr><td colspan="5" class="empty">Aucun aliment pour le moment 🥕</td></tr>'; return; }
  list.innerHTML = data.map(a => {
    const [txt, cls] = statut(a.date_peremption);
    const d = new Date(a.date_peremption).toLocaleDateString('fr-FR');
    return `<tr><td>${esc(a.nom)}</td><td>${a.quantite}</td><td>${d}</td>
      <td><span class="badge ${cls}">${txt}</span></td>
      <td><button class="del" onclick="supprimer(${a.id_aliment})">Delete</button></td></tr>`;
  }).join('');
}

document.getElementById('form').addEventListener('submit', async e => {
  e.preventDefault();
  await fetch('/api/food', {
    method: 'POST',
    body: JSON.stringify({
      nom: document.getElementById('nom').value,
      quantite: document.getElementById('quantite').value,
      date_peremption: document.getElementById('date').value
    })
  });
  e.target.reset();
  charger();
});

async function supprimer(id) {
  if (!confirm('Supprimer cet aliment ?')) return;
  await fetch('/api/food/' + id, { method: 'DELETE' });
  charger();
}
charger();
