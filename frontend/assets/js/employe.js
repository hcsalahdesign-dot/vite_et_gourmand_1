console.log("employe.js chargé");

// =========================================================
// OUTILS
// =========================================================

function getAllCommandesClients() {
  const allCommandes = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key && key.startsWith("commandes_")) {
      const commandes = JSON.parse(localStorage.getItem(key)) || [];
      allCommandes.push(...commandes);
    }
  }

  return allCommandes;
}

// =========================================================
// AFFICHAGE COMMANDES EMPLOYE
// =========================================================

function afficherCommandesEmploye() {
  const container = document.getElementById("employeeOrdersContainer");
  if (!container) return;

  const commandes = getAllCommandesClients().filter(
    (cmd) => cmd.statut === "validé"
  );

  container.innerHTML = "";

  if (commandes.length === 0) {
    container.innerHTML = `
      <div class="row-employe">
        <div class="col-left">-</div>
        <div class="col-center">Aucune commande en cours</div>
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
          ${cmd.clientEmail || "Client"}<br>
          <small>${cmd.dateCommande || cmd.date || ""}${cmd.heureCommande ? " - " + cmd.heureCommande : ""}</small>
        </div>

        <div class="col-center">${cmd.nom}</div>

        <div class="col-center">${cmd.quantite} pers</div>

        <div class="col-center total">${cmd.total.toFixed(2)} €</div>

        <div class="col-right statut-col">
            <span class="actif">${cmd.statut}</span>
        </div>

        <div class="col-right action-col">

            <button
                class="btn-livree"
                type="button"
                onclick="marquerCommeLivree('${cmd.clientEmail}', '${cmd.id}', '${cmd.dateCommande || cmd.date || ""}', '${cmd.heureCommande || ""}')"
            >
                Livré
            </button>
        </div>

      </div>
    `;
  });
}

// =========================================================
// PASSAGE EN LIVREE
// =========================================================

window.marquerCommeLivree = function (clientEmail, commandeId, dateCommande, heureCommande) {
  const commandesKey = "commandes_" + clientEmail;
  let commandes = JSON.parse(localStorage.getItem(commandesKey)) || [];

  commandes = commandes.map((cmd) => {
    const sameId = cmd.id === commandeId;
    const sameDate = (cmd.dateCommande || cmd.date || "") === dateCommande;
    const sameHeure = (cmd.heureCommande || "") === heureCommande;

    if (sameId && sameDate && sameHeure) {
      return {
        ...cmd,
        statut: "livrée"
      };
    }

    return cmd;
  });

  localStorage.setItem(commandesKey, JSON.stringify(commandes));

  afficherCommandesEmploye();
};

// =========================================================
// INIT
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  afficherCommandesEmploye();
});
