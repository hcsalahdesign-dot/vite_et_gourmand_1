console.log("commande.js chargé - Mode Hybride BDD activé");

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
  // On vérifie par l'ID numérique maintenant
  let existant = panier.find((p) => p.id === item.id);

  if (existant) {
    existant.quantite += item.quantite;
    existant.total = existant.quantite * existant.prix;
  } else {
    panier.push({
      id: item.id,      // L'ID numérique (1, 2, 3...)
      nom: item.nom,    // Le nom pour l'affichage
      prix: item.prix,
      quantite: item.quantite,
      total: item.prix * item.quantite
    });
  }
  sauvegarderPanier();
}

function sauvegarderPanier() {
  localStorage.setItem(
    "panier_" + (currentUser?.email || "guest"),
    JSON.stringify(panier)
  );
}

function calculerTotal() {
  return panier.reduce((sum, item) => sum + item.total, 0);
}

// =========================================================
// VALIDATION COMMANDE (VERS PHP/MYSQL)
// =========================================================
async function validerCommande() {
  if (!currentUser) {
    alert("Veuillez vous connecter pour commander");
    window.location.href = "/pages/connexion-desktop.html";
    return;
  }

  if (panier.length === 0) {
    alert("Votre panier est vide");
    return;
  }

  const orderData = {
    user_id: currentUser.id, // L'ID récupéré par auth.js
    total: calculerTotal(),
    items: panier
  };

  try {
    const response = await fetch("../backend/api/save_order.php", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(orderData)
    });

    if (!response.ok) {
        throw new Error("Erreur serveur : " + response.status);
    }

    const result = await response.json();

    if (result.success) {
      alert("Succès ! Votre commande est enregistrée en base de données.");
      panier = [];
      sauvegarderPanier();
      window.location.href = "profil-client-desktop.html";
    } else {
      alert("Erreur : " + result.message);
    }
  } catch (error) {
    console.error("Erreur envoi commande:", error);
    alert("Erreur de connexion au serveur.");
  }
}

// =========================================================
// GESTION DES CLICS ET MODALE
// =========================================================
document.querySelectorAll(".add-to-cart-button").forEach((btn) => {
  btn.addEventListener("click", function () {
    let menu = {
      id: parseInt(this.dataset.id), // RÉCUPÈRE LE 1, 2, 3 ou 4
      nom: this.dataset.menu,
      prix: parseFloat(this.dataset.price),
      categorie: this.dataset.category
    };
    ouvrirModal(menu);
  });
});

function ouvrirModal(menu) {
  menuActuel = menu;
  document.getElementById("modalNom").innerText = menu.nom;
  document.getElementById("modalPrix").innerText = menu.prix.toFixed(2);
  document.getElementById("modalQuantite").value = 1;
  updateTotalModal();
  document.getElementById("menuModal").style.display = "flex";
}

function fermerModal() {
  document.getElementById("menuModal").style.display = "none";
}

function updateTotalModal() {
  if (!menuActuel) return;
  let qte = parseInt(document.getElementById("modalQuantite").value) || 1;
  let total = qte * menuActuel.prix;
  document.getElementById("modalTotal").innerText = total.toFixed(2);
}

function ajouterDepuisModal() {
  let qte = parseInt(document.getElementById("modalQuantite").value) || 1;
  ajouterAuPanier({
    id: menuActuel.id,
    nom: menuActuel.nom,
    prix: menuActuel.prix,
    quantite: qte
  });
  fermerModal();
  const confirmationModal = document.getElementById("confirmationModal");
  if (confirmationModal) confirmationModal.classList.add("open");
}

// Écouteur pour la quantité dans la modale
const qteInput = document.getElementById("modalQuantite");
if (qteInput) {
  qteInput.addEventListener("input", updateTotalModal);
}