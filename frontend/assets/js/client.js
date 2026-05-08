// =========================================================
// CHARGEMENT DES DONNEES
// =========================================================

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function getPanierKey() {
  const user = getCurrentUser();
  return "panier_" + (user?.email || "guest");
}

function getCommandesKey() {
  const user = getCurrentUser();
  return "commandes_" + (user?.email || "guest");
}

let panier = JSON.parse(localStorage.getItem(getPanierKey())) || [];

// =========================================================
// TOTAL PANIER
// =========================================================

function calculerTotalPanier() {
  return panier.reduce((sum, item) => sum + item.total, 0);
}

function afficherTotalPanier() {
  const totalElement = document.getElementById("totalPanier");
  if (!totalElement) return;

  totalElement.innerText = "Total : " + calculerTotalPanier().toFixed(2) + " €";
}

// =========================================================
// AFFICHAGE PANIER
// =========================================================

function afficherPanierClient() {
  const container = document.getElementById("clientCart");
  if (!container) return;

  panier = JSON.parse(localStorage.getItem(getPanierKey())) || [];
  container.innerHTML = "";

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

    afficherTotalPanier();
    return;
  }

  panier.forEach((item) => {
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

  afficherTotalPanier();
}

// =========================================================
// AFFICHAGE COMMANDES
// =========================================================

function afficherCommandesClient() {
  const container = document.getElementById("clientOrders");
  if (!container) return;

  const commandes = JSON.parse(localStorage.getItem(getCommandesKey())) || [];
  container.innerHTML = "";

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

  [...commandes].reverse().forEach((cmd) => {

    container.innerHTML += `
      <div class="row-employe">
        <div class="col-left">
          ${cmd.nom}<br>
          <small>${cmd.dateCommande} - ${cmd.heureCommande}</small>
        </div>


        <div class="col-center">${cmd.nom}</div>
        <div class="col-center">${cmd.quantite} pers</div>
        <div class="col-center">${cmd.total.toFixed(2)} €</div>

        <div class="col-right">
          <span class="${cmd.statut === "validé" ? "actif" : "inactif"}">
            ${cmd.statut}
          </span>
        </div>
      </div>
    `;
  });
}

// =========================================================
// VALIDATION DE LA COMMANDE
// =========================================================

function afficherMessageClient(message) {
  const modal = document.getElementById("clientMessageModal");
  const text = document.getElementById("clientMessageText");

  if (!modal || !text) return;

  text.innerText = message;
  modal.classList.add("open");
}

function fermerMessageClient() {
  const modal = document.getElementById("clientMessageModal");
  if (modal) {
    modal.classList.remove("open");
  }
}



function validerCommande() {
  if (panier.length === 0) {
    afficherMessageClient("Panier vide");
    return;
  }

  const user = getCurrentUser();

  // 1. Préparation des données pour PHP
  const donnéesCommande = {
      user_id: user.id || 1,
      articles: panier
  };

  // 2. ENVOI VERS MYSQL (Le test PHP)
  // Chemin ABSOLU : on part de localhost
  // 2. ENVOI VERS MYSQL (Le test PHP)
  fetch('/vite_et_gourmand_1/backend/api/save_order.php', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donnéesCommande)
  })
  .then(response => {
      // On vérifie si la réponse est valide avant de tenter de lire le JSON
      if (!response.ok) {
          throw new Error("Le serveur a répondu avec une erreur " + response.status);
      }
      return response.json();
  })
  .then(data => {
      console.log("Réponse PHP :", data);
      
      if (data.success) {
          // 3. Une fois envoyé au PHP, on garde ton ancienne logique de confirmation
          let commandes = JSON.parse(localStorage.getItem(getCommandesKey())) || [];
          
          // On ajoute les articles au historique local
          commandes.push(...panier.map(item => ({
              ...item,
              dateCommande: new Date().toLocaleDateString("fr-FR"),
              statut: "en attente", 
              clientEmail: user.email
          })));

          // Mise à jour du stockage local
          localStorage.setItem(getCommandesKey(), JSON.stringify(commandes));
          localStorage.removeItem(getPanierKey());
          
          // Reset de la variable globale du panier
          panier = [];

          // Mise à jour de l'interface
          afficherMessageClient("Commande envoyée en cuisine ! ✔");
          afficherPanierClient();
          afficherCommandesClient();
      } else {
          // Si le PHP renvoie success: false (ex: erreur SQL)
          alert("Erreur base de données : " + data.message);
      }
  })
  .catch(error => {
      console.error("Erreur PHP/Fetch :", error);
      afficherMessageClient("Erreur de connexion au serveur : " + error.message);
  });
}


// =========================================================
// SUPPRESSION PANIER
// =========================================================

function supprimerItem(id) {
  panier = panier.filter((p) => p.id !== id);
  localStorage.setItem(getPanierKey(), JSON.stringify(panier));
  afficherPanierClient();
}

// =========================================================
// INIT
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  afficherPanierClient();
  afficherCommandesClient();

  const btn = document.getElementById("btnValider");
  if (btn) btn.addEventListener("click", validerCommande);


  const clientMessageCloseButton = document.getElementById("clientMessageCloseButton");
  if (clientMessageCloseButton) {
    clientMessageCloseButton.addEventListener("click", fermerMessageClient);
  }

});
