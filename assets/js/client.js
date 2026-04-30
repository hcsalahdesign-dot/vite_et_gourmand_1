// =========================================================
// 🧠 CHARGEMENT DES DONNÉES
// =========================================================

let panier = JSON.parse(localStorage.getItem("panier")) || [];


// =========================================================
// 🧮 TOTAL PANIER
// =========================================================

function calculerTotalPanier() {
  return panier.reduce((sum, item) => sum + item.total, 0);
}


// 👉 NOUVEAU : AFFICHAGE TOTAL SECURISE
function afficherTotalPanier() {

  const totalElement = document.getElementById("totalPanier");

  if (!totalElement) return;

  totalElement.innerText =
    "Total : " + calculerTotalPanier().toFixed(2) + " €";
}


// =========================================================
// 🛒 AFFICHAGE PANIER
// =========================================================

function afficherPanierClient() {

  const container = document.getElementById("clientCart");
  if (!container) return;

  container.innerHTML = "";

  // PANIER VIDE
  if (panier.length === 0) {
    container.innerHTML = `
      <div class="row-employe">
        <div class="col-left">-</div>
        <div class="col-center">Panier vide</div>
        <div class="col-center">-</div>
        <div class="col-center">0.00 €</div>
        <div class="col-right">-</div>
      </div>
    `;

    afficherTotalPanier(); // 🔥 important même si vide
    return;
  }

  // AFFICHAGE NORMAL
  panier.forEach(item => {

    container.innerHTML += `
      <div class="row-employe">

        <div class="col-left">
          Menu<br>
          <small>Aujourd'hui</small>
        </div>

        <div class="col-center">${item.nom}</div>

        <div class="col-center">${item.quantite} pers</div>

        <div class="col-center">${item.total.toFixed(2)} €</div>

        <div class="col-right">
          <img src="/assets/trash3.svg"
               class="icon"
               onclick="supprimerItem('${item.id}')">
        </div>

      </div>
    `;
  });

  afficherTotalPanier(); // 🔥 IMPORTANT
}


// =========================================================
// 📦 AFFICHAGE COMMANDES
// =========================================================

function afficherCommandesClient() {

  const container = document.getElementById("clientOrders");
  if (!container) return;

  const commandes = JSON.parse(localStorage.getItem("commandes")) || [];

  container.innerHTML = "";

  // COMMANDES VIDES
  if (commandes.length === 0) {
    container.innerHTML = `
      <div class="row-employe">
        <div class="col-left">-</div>
        <div class="col-center">Aucune commande</div>
        <div class="col-center">-</div>
        <div class="col-center">0.00 €</div>
        <div class="col-right">-</div>
      </div>
    `;
    return;
  }

  // AFFICHAGE NORMAL
  commandes.forEach(cmd => {

    container.innerHTML += `
      <div class="row-employe">

        <div class="col-left">
          Menu validé<br>
          <small>${cmd.date}</small>
        </div>

        <div class="col-center">${cmd.nom}</div>

        <div class="col-center">${cmd.quantite} pers</div>

        <div class="col-center">${cmd.total.toFixed(2)} €</div>

        <div class="col-right">
          <span class="${cmd.statut === 'validé' ? 'actif' : 'inactif'}">
            ${cmd.statut}
          </span>
        </div>

      </div>
    `;
  });
}


// =========================================================
// 📦 VALIDATION DE LA COMMANDE
// =========================================================

function validerCommande() {

  if (panier.length === 0) {
    alert("Panier vide ❌");
    return;
  }

  let commandes = JSON.parse(localStorage.getItem("commandes")) || [];

  commandes.push(...panier.map(item => ({
    ...item,
    date: new Date().toLocaleDateString(),
    statut: "validé"
  })));

  localStorage.setItem("commandes", JSON.stringify(commandes));

  panier = [];
  localStorage.removeItem("panier");

  alert("Commande validée ✔");

  document.body.classList.add("commande-ok");
  setTimeout(() => document.body.classList.remove("commande-ok"), 800);

  afficherPanierClient();
  afficherCommandesClient();
}


// =========================================================
// ❌ SUPPRESSION PANIER
// =========================================================

function supprimerItem(id) {

  panier = panier.filter(p => p.id !== id);

  localStorage.setItem("panier", JSON.stringify(panier));

  afficherPanierClient();
}


// =========================================================
// 🚀 INIT
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

  afficherPanierClient();
  afficherCommandesClient();

  const btn = document.getElementById("btnValider");
  if (btn) btn.addEventListener("click", validerCommande);
});