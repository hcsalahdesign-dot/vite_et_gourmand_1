
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}


document.addEventListener("DOMContentLoaded", () => {
  const navigationMap = {
    accueil: "/index.php",
    menus: "/pages/menus-desktop.html",
    contact: "/pages/nous-contacter-desktop.html",
    inscription: "/pages/inscription-desktop.html",
    connexion: "/pages/connexion-desktop.html",
    panier: "/pages/profil-client-desktop.html",
    admin: "/pages/connexion-admin-desktop.html",
    employe: "/pages/connexion-employe-desktop.html",
    profilClient: "/pages/profil-client-desktop.html",
    profilAdmin: "/pages/profil-admin-desktop.html",
    profilEmploye: "/pages/profil-employe-desktop.html",
    menusClassiques: "/pages/menus-classiques-desktop.html",
    menusVegetariens: "/pages/menus-vegetariens-desktop.html",
    menusSaisonniers: "/pages/menus-saisonniers-desktop.html",
    menusEvenements: "/pages/menus-evenements-desktop.html"
  };

  document.querySelectorAll("[data-nav]").forEach((element) => {
  element.addEventListener("click", (e) => {
    e.preventDefault();

    const target = element.dataset.nav;
    const user = getCurrentUser();

    if (user && user.role === "employe") {
      const blockedTargets = ["accueil", "menus", "contact", "connexion", "inscription", "profilClient", "panier"];

      if (blockedTargets.includes(target)) {
        window.location.href = navigationMap.profilEmploye;
        return;
      }
    }

    if (user && user.role === "admin") {
      const blockedTargets = ["accueil", "menus", "contact", "connexion", "inscription", "profilClient", "panier"];

      if (blockedTargets.includes(target)) {
        window.location.href = navigationMap.profilAdmin;
        return;
      }
    }

    const url = navigationMap[target];

    console.log("Tentative de navigation vers :", url);

    if (url) {
      window.location.href = url;
    } else {
      console.error("Cible de navigation inconnue :", target);
    }
  });
});


  chargerMenusDynamiques("/assets/js/menus.json", "/");
});

async function chargerMenusDynamiques(jsonUrl, imgBase) {
  const container = document.getElementById("menu-container");
  if (!container) return;

  const categorieCible = container.dataset.categorie;

  try {
    const response = await fetch(jsonUrl);

    if (!response.ok) throw new Error("Fichier JSON introuvable");

    const data = await response.json();
    const plats = data[categorieCible];

    if (!plats) {
      console.warn("Aucun plat trouvé pour la catégorie :", categorieCible);
      return;
    }

    container.innerHTML = plats.map(plat => `
      <div class="menu-card">
        <img src="${imgBase}${plat.image}" alt="${plat.nom}">
        <div class="menu-card__content">
          <h3>${plat.nom}</h3>
          <p class="price">${plat.prix.toFixed(2)} €</p>
          <button class="add-to-cart-button"
                  data-menu="${plat.nom}"
                  data-price="${plat.prix}"
                  data-category="${categorieCible}">
            +
          </button>
        </div>
      </div>
    `).join("");

  } catch (error) {
    console.error("Erreur lors du chargement du JSON :", error);
  }
}
