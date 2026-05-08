document.addEventListener("DOMContentLoaded", () => {
    
    // 1. MAP DE NAVIGATION (Chemins relatifs sans le / au début)
    const navigationMap = {
        accueil: "../index.html", // On remonte pour sortir de /pages/
        menus: "menus-desktop.html",
        contact: "nous-contacter-desktop.html",
        inscription: "inscription-desktop.html",
        connexion: "connexion-desktop.html",
        admin: "connexion-admin-desktop.html",
        employe: "connexion-employe-desktop.html",
        profilClient: "profil-client-desktop.html",
        profilAdmin: "profil-admin-desktop.html",
        profilEmploye: "profil-employe-desktop.html",
        menusClassiques: "menus-classiques-desktop.html",
        menusVegetariens: "menus-vegetariens-desktop.html",
        menusSaisonniers: "menus-saisonniers-desktop.html",
        menusEvenements: "menus-evenements-desktop.html"
    };

    // 2. GESTION DU CLIC DE NAVIGATION
    document.querySelectorAll("[data-nav]").forEach((element) => {
        element.addEventListener("click", () => {
            const target = element.dataset.nav;
            const url = navigationMap[target];

            console.log("Tentative de navigation vers :", url);

            if (url) {
                window.location.href = url;
            } else {
                console.error("Cible de navigation inconnue :", target);
            }
        });
    });

    // 3. LANCEMENT DU CHARGEMENT DES MENUS
    chargerMenusDynamiques();
});

// 4. FONCTION DE CHARGEMENT DYNAMIQUE
async function chargerMenusDynamiques() {
    const container = document.getElementById("menu-container");
    if (!container) return; 

    const categorieCible = container.dataset.categorie;

    try {
        // Chemin relatif vers ton JSON (on remonte d'un cran si on est dans /pages/)
        const response = await fetch('../assets/js/menus.json'); 
        
        if (!response.ok) throw new Error("Fichier JSON introuvable");
        
        const data = await response.json();
        const plats = data[categorieCible];

        if (!plats) {
            console.warn("Aucun plat trouvé pour la catégorie :", categorieCible);
            return;
        }

        container.innerHTML = plats.map(plat => `
            <div class="menu-card">
                <img src="${plat.image}" alt="${plat.nom}">
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
        `).join('');

    } catch (error) {
        console.error("Erreur lors du chargement du JSON :", error);
    }
}