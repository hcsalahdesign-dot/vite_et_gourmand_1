console.log("employe.js chargé");

document.addEventListener("DOMContentLoaded", () => {
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
        container.innerHTML = "<p>Aucune commande en cours</p>";
        return;
      }

      container.innerHTML = "";

      data.orders.forEach(order => {

        container.innerHTML += `
          <div class="row-employe">

            <!-- LEFT -->
            <div class="col-left">
              Client<br>
              #${order.order_id}
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

              <button class="btn-prendre"
                onclick="prendreCommande(${order.order_id})">
                Prendre
              </button>

              <button class="btn-livree" disabled>
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
});

function prendreCommande(id) {
  const user = JSON.parse(localStorage.getItem("user"));

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