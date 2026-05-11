console.log("employe.js chargé");

document.addEventListener("DOMContentLoaded", () => {

// ✅ AJOUT — Titre dynamique
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const titre = document.getElementById("titreDashboard");
  if (titre && user) {
      titre.innerHTML = `Tableau de bord<br><small>${user.nom}</small>`;
  }
  
  const container = document.getElementById("employeeOrdersContainer");

  if (!container) return;

  fetch("/backend/api/get_orders.php")
    .then(res => res.json())
    .then(data => {

      console.log("DATA ORDERS:", data);

      if (!data.success || !Array.isArray(data.orders)) {
        container.innerHTML = "<p>Erreur chargement commandes</p>";
        return;
      }

      if (data.orders.length === 0) {
        container.innerHTML = `
              <div class="row-employe">
                  <div class="col-left">-</div>
                  <div class="col-center">Aucune commande en cours</div>
                  <div class="col-right">-</div>
              </div>
          `;
        return;
      }

      container.innerHTML = "";

      data.orders.forEach(order => {

        container.innerHTML += `
          <div class="row-employe">

            <!-- LEFT -->
            <div class="col-left">
                ${order.client_nom}<br>
                <small>#${order.order_id}</small>
            </div>

            <!-- CENTER -->
            <div class="col-center">
              <div class="order-line">
                Commande #${order.order_id}
              </div>

              <div class="order-line">
                Total : ${order.total} €
              </div>

              <small>
                ${order.created_at ? order.created_at : ""}
              </small>
            </div>

            <!-- RIGHT -->
            <div class="col-right">
                <button class="btn-prendre" onclick="prendreCommande(${order.order_id})"
                    ${order.employee_id ? 'disabled style="opacity:0.4; cursor:default;"' : ''}>
                    Prendre
                </button>

                <button class="btn-livree" onclick="livrerCommande(${order.order_id})"
                    ${!order.employee_id ? 'disabled style="opacity:0.4; cursor:default;"' : ''}>
                    Livré
                </button>
            </div>

          </div>
        `;
      });
    })
    .catch(err => {
      console.error("Erreur API :", err);
      container.innerHTML = "<p>Erreur serveur</p>";
    });

    afficherMenusEmploye();
});

function prendreCommande(id) {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user || user.role !== "employe") {
    alert("Accès refusé");
    return;
  }

  fetch("/backend/api/assign_order.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      order_id: id,
      employee_id: user.id
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log("Commande prise :", data);
    location.reload();
  })
  .catch(err => console.error(err));
}

// =========================================================
// AFFICHAGE MENUS DISPONIBLES
// =========================================================

function afficherMenusEmploye() {
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
                  const dispo = menu.stock > 0;
                  return `
                      <div class="menu-line">
                          <button 
                              class="btn-rupture ${dispo ? '' : 'signale'}" 
                              onclick="${dispo ? `signalerRupture(${menu.id})` : ''}"
                              ${dispo ? '' : 'disabled'}>
                              ${dispo ? 'Rupture' : 'Rupture signalée'}
                          </button>
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
        .catch(err => console.error("Erreur chargement menus :", err));
}

function signalerRupture(menuId) {
    const btn = document.querySelector(`button.btn-rupture[onclick="signalerRupture(${menuId})"]`);

    if (!confirm("Confirmer la rupture de stock pour ce menu ?")) return;

    fetch("/backend/api/update_stock.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menu_id: menuId, stock: 0 })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            if (btn) {
                btn.classList.add("signale");
                btn.textContent = "Rupture signalée";
                btn.disabled = true;
            }
        } else {
            alert("Erreur : " + data.message);
        }
    })
    .catch(err => console.error("Erreur rupture :", err));
}

function signalerReappro(menuId) {
    alert("Réapprovisionnement signalé à l'administrateur !");
}


function livrerCommande(id) {
    if (!confirm("Confirmer la livraison de la commande #" + id + " ?")) return;

    fetch("/backend/api/livrer_order.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: id })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            location.reload();
        } else {
            alert("Erreur : " + data.message);
        }
    })
    .catch(err => console.error("Erreur livraison :", err));
}