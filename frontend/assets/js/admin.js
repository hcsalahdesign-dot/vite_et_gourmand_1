console.log("admin.js chargé");

// =========================================================
// INIT
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    afficherEmployes();
    afficherMenusAdmin();
    afficherHistorique();
    afficherCommandesEnCours();

});

// =========================================================
// GESTION DES EMPLOYÉS
// =========================================================

function afficherEmployes() {
    const container = document.getElementById("employesContainer");
    if (!container) return;

    fetch("/backend/api/get_employes.php")
        .then(res => res.json())
        .then(data => {
            if (!data.success) return;

            container.innerHTML = "";

            if (data.employes.length === 0) {
                container.innerHTML = `
                    <div class="row-employe">
                        <div class="col-center">Aucun employé</div>
                    </div>`;
                return;
            }

            data.employes.forEach(emp => {
                container.innerHTML += `
                    <div class="row-employe">
                        <div class="col-left">
                            ${emp.nom}<br>
                            <small>${emp.role}</small>
                        </div>
                        <div class="col-center">
                            ${emp.email}<br>
                            <span class="actif">actif</span>
                        </div>
                        <div class="col-right">
                            <img src="../assets/trash3.svg" class="icon" onclick="supprimerEmploye(${emp.id})">
                        </div>
                    </div>
                `;
            });
        })
        .catch(err => console.error("Erreur employés :", err));
}

function supprimerEmploye(id) {
    if (!confirm("Supprimer cet employé ?")) return;

    fetch("/backend/api/delete_employe.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            afficherEmployes();
        } else {
            alert("Erreur : " + data.message);
        }
    })
    .catch(err => console.error("Erreur suppression :", err));
}

// =========================================================
// GESTION DES MENUS
// =========================================================

function afficherMenusAdmin() {
    const container = document.querySelector(".block.menus");
    if (!container) return;

    fetch("/backend/api/get_menus.php")
        .then(res => res.json())
        .then(data => {
            if (!data.success) return;

            const header = container.querySelector(".block-header");
            container.innerHTML = "";
            container.appendChild(header);

            data.categories.forEach(categorie => {
                const date = new Date().toLocaleDateString("fr-FR");

                let menusHTML = categorie.menus.map(menu => {
                    const dispo = menu.stock > 0;
                    return `
                        <div class="menu-line">
                            <span class="menu-name">${menu.titre}</span>
                            <span class="menu-price">${parseFloat(menu.prix).toFixed(2).replace('.', ',')} €</span>
                            <span class="menu-status ${dispo ? 'actif' : 'inactif'}">
                                ${dispo ? 'disponible' : 'indisponible'}
                            </span>
                        </div>
                    `;
                }).join("");

                let boutonsHTML = categorie.menus.map(menu => {
                    return `
                        <div class="menu-line" style="justify-content: center;">
                            <img src="../assets/pencil-square.svg" class="icon" onclick="modifierMenu(${menu.id})">
                        </div>
                    `;
                }).join("");

                container.innerHTML += `
                    <div class="row-menus">
                        <div class="col-left">
                            Menus ${categorie.nom}<br>
                            <small>${date}</small>
                        </div>
                        <div class="col-center">
                            ${menusHTML}
                        </div>
                        <div class="col-right">
                            ${boutonsHTML}
                        </div>
                    </div>
                `;
            });
        })
        .catch(err => console.error("Erreur menus admin :", err));
}

function supprimerMenu(id) {
    if (!confirm("Supprimer ce menu ?")) return;

    fetch("/backend/api/delete_menu.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            afficherMenusAdmin();
        } else {
            alert("Erreur : " + data.message);
        }
    })
    .catch(err => console.error("Erreur suppression menu :", err));
}

function modifierMenu(id) {
    afficherMessageAdmin(`Modification du menu #${id} — à venir !`);
}

function afficherMessageAdmin(message) {
    const modal = document.getElementById("adminMessageModal");
    const text = document.getElementById("adminMessageText");
    if (!modal || !text) return;
    text.innerText = message;
    modal.classList.add("open");
}

// =========================================================
// HISTORIQUE DES COMMANDES
// =========================================================

function afficherHistorique() {
    const container = document.getElementById("historiqueContainer");
    if (!container) return;

    fetch("/backend/api/get_historique.php")
        .then(res => res.json())
        .then(data => {
            if (!data.success) return;

            container.innerHTML = "";

            if (data.commandes.length === 0) {
                container.innerHTML = `
                    <div class="row-employe">
                        <div class="col-center">Aucune commande</div>
                    </div>`;
                return;
            }

            data.commandes.forEach(cmd => {
                container.innerHTML += `
                    <div class="row-employe">
                        <div class="col-left">
                            ${cmd.client_nom}<br>
                            <small>${cmd.client_email}</small>
                        </div>
                        <div class="col-center">
                            Commande #${cmd.id}<br>
                            <small>${cmd.date_commande}</small>
                        </div>
                        <div class="col-center">
                            ${parseFloat(cmd.total).toFixed(2)} €
                        </div>
                        <div class="col-right">
                            <span class="${cmd.statut === 'Livré' ? 'actif' : 'inactif'}">
                                ${cmd.statut}
                            </span>
                        </div>
                    </div>
                `;
            });
        })
        .catch(err => console.error("Erreur historique :", err));
}





// =========================================================
// FORMULAIRE AJOUT EMPLOYÉ
// =========================================================

function ouvrirFormulaireEmploye() {
    const modal = document.getElementById("modalEmploye");
    if (modal) modal.classList.add("open");
}

function fermerFormulaireEmploye() {
    const modal = document.getElementById("modalEmploye");
    if (modal) modal.classList.remove("open");
}

function ajouterEmploye() {
    const contrat = document.getElementById("empContrat").value.trim();
    const nom = document.getElementById("empNom").value.trim();
    const email = document.getElementById("empEmail").value.trim();
    const tel = document.getElementById("empTel").value.trim();
    const password = document.getElementById("empPassword").value.trim();

    if (!contrat || !nom || !email || !tel || !password) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    fetch("/backend/api/add_employe.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            numero_contrat: contrat,
            nom: nom,
            email: email,
            telephone: tel,
            mot_de_passe: password
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            fermerFormulaireEmploye();
            afficherEmployes();
        } else {
            alert("Erreur : " + data.message);
        }
    })
    .catch(err => console.error("Erreur ajout employé :", err));
}


// =========================================================
// COMMANDES EN COURS
// =========================================================

function afficherCommandesEnCours() {
    const container = document.getElementById("commandesEnCoursContainer");
    if (!container) return;

    fetch("/backend/api/get_commandes_en_cours.php")
        .then(res => res.json())
        .then(data => {
            if (!data.success) return;

            container.innerHTML = "";

            if (data.commandes.length === 0) {
                container.innerHTML = `
                    <div class="row-employe">
                        <div class="col-center">Aucune commande en cours</div>
                    </div>`;
                return;
            }

            data.commandes.forEach(cmd => {
                container.innerHTML += `
                    <div class="row-employe">
                        <div class="col-left">
                            ${cmd.client_nom}<br>
                            <small>Commande #${cmd.id}</small>
                        </div>
                        <div class="col-center">
                            ${cmd.date_commande}<br>
                            <small>${parseFloat(cmd.total).toFixed(2)} €</small>
                        </div>
                        <div class="col-center">
                            <span class="inactif">${cmd.statut}</span>
                        </div>
                        <div class="col-right">
                            ${cmd.employe_nom 
                                ? `<span class="actif">${cmd.employe_nom}</span>` 
                                : `<span class="inactif">Non attribuée</span>`
                            }
                        </div>
                    </div>
                `;
            });
        })
        .catch(err => console.error("Erreur commandes en cours :", err));
}