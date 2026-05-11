// =========================================================
// INIT
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnValider");
  if (btn) btn.addEventListener("click", validerCommande);

  const clientMessageCloseButton = document.getElementById("clientMessageCloseButton");
  if (clientMessageCloseButton) {
    clientMessageCloseButton.addEventListener("click", fermerMessageClient);
  }

  const user = getCurrentUser();
  const titre = document.getElementById("titreClient");
  if (titre && user) {
      titre.innerHTML = `Espace Client<br><small>${user.nom}</small>`;
  }

  afficherPanierClient();
  afficherCommandesClient();
});



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

    const user = getCurrentUser();
    if (!user) return;

    fetch(`/backend/api/get_commandes_client.php?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => {
            container.innerHTML = "";

            if (!data.success || data.commandes.length === 0) {
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

            data.commandes.forEach(cmd => {
                container.innerHTML += `
                    <div class="row-employe">
                        <div class="col-left">
                            ${cmd.nom_menu}<br>
                            <small>${cmd.date_commande}</small>
                        </div>
                        <div class="col-center">${cmd.nom_menu}</div>
                        <div class="col-center">${cmd.quantite} pers</div>
                        <div class="col-center">${parseFloat(cmd.total).toFixed(2)} €</div>
                        <div class="col-right">
                            <span class="${cmd.statut === 'Livrée' ? 'actif' : 'inactif'}">
                                ${cmd.statut}
                            </span>
                        </div>
                    </div>
                `;
            });
        })
        .catch(err => console.error("Erreur commandes client :", err));
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

  if (!user) {
    localStorage.setItem("redirectAfterLogin", "/pages/profil-client-desktop.html");
    afficherMessageClient("Veuillez vous connecter pour valider votre commande");
    setTimeout(() => {
      window.location.href = "/pages/connexion-desktop.html";
    }, 1500);
    return;
  }

  // ✅ On récupère l'id réel depuis la BDD
  fetch(`/backend/api/get_user_id.php?email=${encodeURIComponent(user.email)}`)
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        afficherMessageClient("Utilisateur introuvable en base de données.");
        return;
      }

      const donneesCommande = {
        user_id: data.id,  // ✅ id réel depuis la BDD
        total: calculerTotalPanier(),
        items: panier
      };

      return fetch("/backend/api/save_order.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donneesCommande)
      });
    })
    .then(response => {
      if (!response || !response.ok) throw new Error("Erreur serveur");
      return response.json();
    })
    .then(data => {
      if (data.success) {
        let commandes = JSON.parse(localStorage.getItem(getCommandesKey())) || [];
        commandes.push(
          ...panier.map(item => ({
            ...item,
            dateCommande: new Date().toLocaleDateString("fr-FR"),
            heureCommande: new Date().toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit"
            }),
            statut: "En préparation",
            clientEmail: user.email,
            orderId: data.order_id || null
          }))
        );

        localStorage.setItem(getCommandesKey(), JSON.stringify(commandes));
        localStorage.removeItem(getPanierKey());
        panier = [];

        afficherMessageClient("Commande envoyée en cuisine !");
        afficherPanierClient();
        afficherCommandesClient();
      } else {
        afficherMessageClient("Erreur : " + data.message);
      }
    })
    .catch(error => {
      afficherMessageClient("Erreur de connexion : " + error.message);
    });
}


// =========================================================
// SUPPRESSION PANIER
// =========================================================

function supprimerItem(id) {
  panier = panier.filter((p) => String(p.id) !== String(id));
  localStorage.setItem(getPanierKey(), JSON.stringify(panier));
  afficherPanierClient();
}


