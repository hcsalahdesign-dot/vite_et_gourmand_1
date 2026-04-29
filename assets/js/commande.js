let panier = [];
let menuActuel = null;

/* =========================
   AJOUT AU PANIER
========================= */

function ajouterAuPanier(item) {
  let existant = panier.find(p => p.id === item.id);

  if (existant) {
    existant.quantite += item.quantite;
    existant.total = existant.quantite * existant.prix;
  } else {
    panier.push({
      id: item.id,
      nom: item.nom,
      prix: item.prix,
      quantite: item.quantite,
      total: item.prix * item.quantite
    });
  }

  sauvegarderPanier();
}

/* =========================
   STORAGE
========================= */

function sauvegarderPanier() {
  localStorage.setItem("panier", JSON.stringify(panier));
}

/* =========================
   TOTAL
========================= */

function calculerTotal() {
  return panier.reduce((sum, item) => sum + item.total, 0);
}

/* =========================
   VALIDATION
========================= */

function validerCommande() {
  console.log("Commande envoyée :", panier);
}

/* =========================
   CLICK BOUTON MENU
========================= */

document.querySelectorAll(".add-to-cart-button").forEach(btn => {
  btn.addEventListener("click", function () {

    let menu = {
      id: this.dataset.menu,
      nom: this.dataset.menu,
      prix: parseFloat(this.dataset.price),
      categorie: this.dataset.category
    };

    ouvrirModal(menu);
  });
});

/* =========================
   MODAL (MANQUANT AVANT)
========================= */

function ouvrirModal(menu) {
  menuActuel = menu;

  console.log("Modal ouverte :", menu);

  const modal = document.getElementById("menuModal");

  if (modal) {
    modal.style.display = "flex";
  }
}

/* =========================
   MODAL COMPLET
========================= */


function ouvrirModal(menu) {
  menuActuel = menu;

  document.getElementById("modalNom").innerText = menu.nom;
  document.getElementById("modalPrix").innerText = menu.prix;

  document.getElementById("modalQuantite").value = 1;

  updateTotalModal();

  document.getElementById("menuModal").style.display = "flex";
}

function fermerModal() {
  document.getElementById("menuModal").style.display = "none";
}

/* TOTAL DYNAMIQUE */
document.addEventListener("input", function(e) {
  if (e.target.id === "modalQuantite") {
    updateTotalModal();
  }
});

function updateTotalModal() {
  let qte = document.getElementById("modalQuantite").value;
  let total = qte * menuActuel.prix;

  document.getElementById("modalTotal").innerText = total.toFixed(2);
}

/* AJOUT FINAL */
function ajouterDepuisModal() {
  let qte = parseInt(document.getElementById("modalQuantite").value);

  ajouterAuPanier({
    id: menuActuel.id,
    nom: menuActuel.nom,
    prix: menuActuel.prix,
    quantite: qte
  });

  fermerModal();

  console.log("Panier :", panier);
}