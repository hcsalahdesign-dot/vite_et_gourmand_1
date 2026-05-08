<?php
session_start(); // On initialise la session pour le panier
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Chemins mis à jour pour correspondre à ta structure Docker -->
    <link rel="stylesheet" href="../frontend/assets/css/global.css">
    <link rel="stylesheet" href="../frontend/assets/styleguide/styleguide.css">
    <link rel="stylesheet" href="../frontend/assets/css/style.css">

    <script src="../frontend/assets/js/navigation.js" defer></script>
    <script src="../frontend/assets/js/auth.js"></script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400&family=Lato:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">

    <title>Vite & Gourmand</title>
</head>

<body class="page-home">
     
    <header class="header">
        <nav class="header__nav">
            <div class="titre-connexion">
                <h1 class="vite-gourmand">Vite &amp; Gourmand</h1>

                <div class="header-actions">
                    <!-- On affiche le panier s'il y a des articles dedans -->
                    <button class="bouton-panier" id="cartButton" type="button" onclick="window.location.href='panier.php'">
                        <img src="assets/cart2.svg" alt="Panier" class="cart2">
                        <span>Panier (<?php echo isset($_SESSION['panier']) ? count($_SESSION['panier']) : 0; ?>)</span>
                    </button>

                    <button class="bouton-mon-compte d-flex align-items-center" onclick="window.location.href='connexion.php'">
                        <img src="assets/person-circle.svg" alt="Utilisateur" class="user me-2">
                        <span>Mon compte/s’inscrire</span>
                    </button>
                </div>

                <div class="nav__mobile-menu">
                    <img src="assets/menu-burger.svg" alt="menu-burger">
                </div>
            </div>

            <div class="liens-navigation">
                <div class="div-wrapper"><div class="div"><a href="index.php" style="text-decoration:none; color:inherit;">Accueil</a></div></div>
                <div class="div-wrapper"><div class="div"><a href="menus.php" style="text-decoration:none; color:inherit;">Menu</a></div></div>
                <div class="div-wrapper"><div class="div"><a href="contact.php" style="text-decoration:none; color:inherit;">Contact</a></div></div>
            </div>
        </nav>
    </header>

    <main class="main-container">
        <!-- Section Hero -->
        <section class="bandeau-1">
            <div class="bandeau-1__content">
                <h2>Cuisine Maison</h2>
                <p>pour toutes vos occasions <br> Julie & José 25 ans de savoir-faire</p>
                <button onclick="window.location.href='menus.php'">Découvrez nos Menus</button>
            </div>
            <div class="bandeau-1__image">
                <img src="assets/images/fond-hero-scene.jpg" alt="Présentation de plats">
            </div>
        </section>

        <!-- ... Le reste de tes bandeaux 2, 3, 4 restent identiques ... -->
        <!-- J'ai raccourci ici pour la lisibilité, garde ton code original pour ces sections -->
        
        <section class="bandeau-5">
            <h2 class="bandeau-5__title">Prêt à passer commande ?</h2>
            <p class="bandeau-5__text">Consultez nos menus et organisez votre événement en toute simplicité.</p>
            <button class="bandeau-5__button" onclick="window.location.href='menus.php'">Commander maintenant</button>
        </section>

        <!-- ... Tes avis clients ... -->
    </main>

    <footer class="footer">
        <!-- Garde ton footer tel quel, il est parfait -->
    </footer>
</body>
</html>