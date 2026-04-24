
document.addEventListener("DOMContentLoaded", () => {
  const navigationMap = {
    accueil: "/index.html",
    menus: "/pages/menus-desktop.html",
    contact: "/pages/nous-contacter-desktop.html",
    inscription: "/pages/inscription-desktop.html",
    connexion: "/pages/connexion-desktop.html",
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
    element.addEventListener("click", () => {
      const target = element.dataset.nav;
      const url = navigationMap[target];

      console.log("Navigation vers :", url);

      if (url) {
        window.location.href = url;
      }
    });
  });
});
