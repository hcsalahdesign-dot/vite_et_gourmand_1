console.log("commande.js chargé");

// =========================================================
// PANIER GLOBAL
// =========================================================

let currentUser = JSON.parse(localStorage.getItem("currentUser"));

let panier = JSON.parse(
  localStorage.getItem("panier_" + (currentUser?.email || "guest"))
) || [];

let menuActuel = null;

// =========================================================
// AJOUT AU PANIER
// =========================================================

function ajouterAuPanier(item) {
  let existant = panier.find((p) => p.id === item.id);

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

// =========================================================
// STORAGE LOCAL
// =========================================================

function sauvegarderPanier() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  localStorage.setItem(
    "panier_" + (currentUser?.email || "guest"),
    JSON.stringify(panier)
  );
}

// =========================================================
// TOTAL PANIER GLOBAL
// =========================================================

function calculerTotal() {
  return panier.reduce((sum, item) => sum + item.total, 0);
}

// =========================================================
// VALIDATION COMMANDE
// =========================================================

function validerCommande() {
  if (!estConnecte()) {
    localStorage.setItem("redirectAfterLogin", "/pages/profil-client-desktop.html");
    alert("Veuillez vous connecter pour valider votre commande");
    window.location.href = "/pages/connexion-desktop.html";
    return;
  }

  console.log("Commande validée :", panier);
}

// =========================================================
// CLICK SUR BOUTON AJOUTER
// =========================================================

document.querySelectorAll(".add-to-cart-button").forEach((btn) => {
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

// =========================================================
// MODAL - OUVERTURE
// =========================================================

function ouvrirModal(menu) {
  menuActuel = menu;

  document.getElementById("modalNom").innerText = menu.nom;
  document.getElementById("modalPrix").innerText = menu.prix.toFixed(2);
  document.getElementById("modalQuantite").value = 1;

  updateTotalModal();

  document.getElementById("menuModal").style.display = "flex";
}

// =========================================================
// MODAL - FERMETURE
// =========================================================

function fermerModal() {
  document.getElementById("menuModal").style.display = "none";
}

// =========================================================
// CALCUL TOTAL DYNAMIQUE
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
// AJOUT DEPUIS LA MODAL
// =========================================================

function ajouterDepuisModal() {
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
  const modal = document.getElementById("confirmationModal");
  if (modal) {
    modal.classList.add("open");
  }
}

// =========================================================
// MODALE DE CONFIRMATION APRES AJOUT
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  const continueButton = document.getElementById("continueShoppingButton");
  const cartButton = document.getElementById("goToCartButton");
  const confirmationModal = document.getElementById("confirmationModal");

  if (continueButton && confirmationModal) {
    continueButton.addEventListener("click", () => {
      confirmationModal.classList.remove("open");
    });
  }

  if (cartButton) {
    cartButton.addEventListener("click", () => {
      window.location.href = "/pages/profil-client-desktop.html";
    });
  }
});


