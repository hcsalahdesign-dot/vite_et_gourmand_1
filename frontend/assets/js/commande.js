console.log("commande.js chargé");

// =========================================================
// OUTILS
// =========================================================

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function getPanierKey() {
  const user = getCurrentUser();
  return "panier_" + (user?.email || "guest");
}

let panier = JSON.parse(localStorage.getItem(getPanierKey())) || [];
let menuActuel = null;

// =========================================================
// PANIER
// =========================================================

function ajouterAuPanier(item) {
  const existant = panier.find((p) => p.id === item.id);

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

function sauvegarderPanier() {
  localStorage.setItem(getPanierKey(), JSON.stringify(panier));
}

function calculerTotal() {
  return panier.reduce((sum, item) => sum + item.total, 0);
}

// =========================================================
// MODALE MENU
// =========================================================

function ouvrirModal(menu) {
  menuActuel = menu;

  const nom = document.getElementById("modalNom");
  const prix = document.getElementById("modalPrix");
  const quantite = document.getElementById("modalQuantite");
  const modal = document.getElementById("menuModal");

  if (!nom || !prix || !quantite || !modal) return;

  nom.innerText = menu.nom;
  prix.innerText = menu.prix.toFixed(2);
  quantite.value = 1;

  updateTotalModal();
  modal.style.display = "flex";
}

function fermerModal() {
  const modal = document.getElementById("menuModal");
  if (modal) {
    modal.style.display = "none";
  }
}

function updateTotalModal() {
  if (!menuActuel) return;

  const quantiteInput = document.getElementById("modalQuantite");
  const totalElement = document.getElementById("modalTotal");
  if (!quantiteInput || !totalElement) return;

  const qte = parseInt(quantiteInput.value, 10) || 1;
  const total = qte * menuActuel.prix;

  totalElement.innerText = total.toFixed(2);
}

function ajouterDepuisModal() {
  if (!menuActuel) return;

  const quantiteInput = document.getElementById("modalQuantite");
  const qte = parseInt(quantiteInput?.value, 10) || 1;

  ajouterAuPanier({
    id: menuActuel.id,
    nom: menuActuel.nom,
    prix: menuActuel.prix,
    quantite: qte
  });

  fermerModal();
  afficherChoixApresAjout();
}

// =========================================================
// MODALE CONFIRMATION
// =========================================================

function afficherChoixApresAjout() {
  const confirmationModal = document.getElementById("confirmationModal");
  if (confirmationModal) {
    confirmationModal.classList.add("open");
  }
}

function fermerConfirmationModal() {
  const confirmationModal = document.getElementById("confirmationModal");
  if (confirmationModal) {
    confirmationModal.classList.remove("open");
  }
}

window.allerAuPanier = function () {
  window.location.href = "/pages/profil-client-desktop.html";
};

// =========================================================
// INIT
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".add-to-cart-button").forEach((btn) => {
    btn.addEventListener("click", function () {
      const menu = {
        id: parseInt(this.dataset.id, 10),
        nom: this.dataset.menu,
        prix: parseFloat(this.dataset.price),
        categorie: this.dataset.category
      };

      ouvrirModal(menu);
    });
  });

  const qteInput = document.getElementById("modalQuantite");
  if (qteInput) {
    qteInput.addEventListener("input", updateTotalModal);
  }

  const continueButton = document.getElementById("continueShoppingButton");
  if (continueButton) {
    continueButton.addEventListener("click", () => {
      fermerConfirmationModal();
    });
  }

  const cartButton = document.getElementById("goToCartButton");
  if (cartButton) {
    cartButton.addEventListener("click", () => {
      allerAuPanier();
    });
  }
});
