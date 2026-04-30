
// =========================================================
// 🛒 PANIER GLOBAL
// =========================================================

// Récupération du panier depuis le localStorage
// Si rien n'existe → on initialise un tableau vide
let user = JSON.parse(localStorage.getItem("user"));

let panier = JSON.parse(
  localStorage.getItem("panier_" + (user?.id || "guest"))
) || [];

// Menu actuellement sélectionné dans la modal
let menuActuel = null;


// =========================================================
// ➕ AJOUT AU PANIER
// =========================================================

function ajouterAuPanier(item) {

  // Vérifie si le produit existe déjà dans le panier
  let existant = panier.find(p => p.id === item.id);

  if (existant) {
    // Si déjà présent → on augmente la quantité
    existant.quantite += item.quantite;

    // Recalcul du total
    existant.total = existant.quantite * existant.prix;

  } else {
    // Sinon on ajoute un nouvel item
    panier.push({
      id: item.id,
      nom: item.nom,
      prix: item.prix,
      quantite: item.quantite,
      total: item.prix * item.quantite
    });
  }

  // Sauvegarde automatique
  sauvegarderPanier();
}


// =========================================================
// 💾 STORAGE LOCAL
// =========================================================

function sauvegarderPanier() {
  let user = JSON.parse(localStorage.getItem("user"));

  localStorage.setItem(
    "panier_" + (user?.id || "guest"),
    JSON.stringify(panier)
  );
}

// =========================================================
// 💰 TOTAL PANIER GLOBAL
// =========================================================

function calculerTotal() {
  return panier.reduce((sum, item) => sum + item.total, 0);
}


// =========================================================
// 📦 VALIDATION COMMANDE (future backend)
// =========================================================

function validerCommande() {
  console.log("Commande envoyée :", panier);

  // plus tard → envoi base de données / API
}


// =========================================================
// 🖱️ CLICK SUR BOUTON "AJOUTER"
// =========================================================

document.querySelectorAll(".add-to-cart-button").forEach(btn => {

  btn.addEventListener("click", function () {

    // Récupération des données HTML (data-*)
    let menu = {
      id: this.dataset.menu,
      nom: this.dataset.menu,
      prix: parseFloat(this.dataset.price),
      categorie: this.dataset.category
    };

    // Ouverture de la modal
    ouvrirModal(menu);
  });
});


// =========================================================
// 🪟 MODAL - OUVERTURE
// =========================================================

function ouvrirModal(menu) {

  menuActuel = menu;

  // Injection des données dans la modal
  document.getElementById("modalNom").innerText = menu.nom;
  document.getElementById("modalPrix").innerText = menu.prix.toFixed(2);

  // reset quantité
  document.getElementById("modalQuantite").value = 1;

  // calcul initial
  updateTotalModal();

  // affichage modal
  document.getElementById("menuModal").style.display = "flex";
}


// =========================================================
// ❌ MODAL - FERMETURE
// =========================================================

function fermerModal() {
  document.getElementById("menuModal").style.display = "none";
}


// =========================================================
// 🔄 CALCUL TOTAL DYNAMIQUE (MODAL)
// =========================================================

document.addEventListener("input", function (e) {

  if (e.target.id === "modalQuantite") {
    updateTotalModal();
  }
});

function updateTotalModal() {

  if (!menuActuel) return;

  let qte = parseInt(document.getElementById("modalQuantite").value);
  let total = qte * menuActuel.prix;

  document.getElementById("modalTotal").innerText = total.toFixed(2);
}


// =========================================================
// ➕ AJOUT DEPUIS LA MODAL
// =========================================================

function ajouterDepuisModal() {

  if (!estConnecte()) {
    alert("Veuillez vous connecter pour continuer");
    window.location.href = "/pages/connexion-desktop.html";
    return;
  }

  let qte = parseInt(document.getElementById("modalQuantite").value);

  ajouterAuPanier({
    id: menuActuel.id,
    nom: menuActuel.nom,
    prix: menuActuel.prix,
    quantite: qte
  });

  fermerModal();

  afficherChoixApresAjout();
}

function afficherChoixApresAjout() {

  const choix = confirm("Produit ajouté ✔\n\nOK = Aller au panier\nAnnuler = Continuer vos achats");

  if (choix) {
    window.location.href = "/pages/profil-client-desktop.html";
  }
}