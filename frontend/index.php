<?php

session_start();

require_once $_SERVER['DOCUMENT_ROOT'] . '/backend/config/Database.php';


$database = new Database();
$pdo = $database->getConnection();



if (!isset($_SESSION['panier'])) {
    $_SESSION['panier'] = [];
}

$nombreArticles = count($_SESSION['panier']);
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/styleguide/styleguide.css">
    <link rel="stylesheet" href="/assets/css/style.css">

    <script src="/assets/js/navigation.js" defer></script>
    <script src="/assets/js/auth.js" defer></script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400&family=Lato:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">

    <title>Vite &amp; Gourmand</title>
</head>

<body class="page-home">

<header class="header">
    <nav class="header__nav">
        <div class="titre-connexion">
            <h1 class="vite-gourmand">Vite &amp; Gourmand</h1>

            <div class="header-actions">
               <button class="bouton-panier" id="cartButton" type="button">
                    <img src="/assets/cart2.svg" alt="Panier" class="cart2">
                    <span>Aller au Panier</span>
                </button>

                <button class="bouton-mon-compte d-flex align-items-center" type="button" data-nav="connexion">
                    <img src="/assets/person-circle.svg" alt="Utilisateur" class="user me-2">
                    <span>Mon compte / s’inscrire</span>
                </button>
            </div>

            <div class="nav__mobile-menu">
                <img src="/assets/menu-burger.svg" alt="menu-burger">
            </div>
        </div>

        <div class="liens-navigation">
            <div class="div-wrapper">
                <div class="div"><a href="index.php" style="text-decoration:none;color:inherit;">Accueil</a></div>
            </div>

            <div class="div-wrapper">
                <div class="div"><a href="/pages/menus-desktop.html" style="text-decoration:none;color:inherit;">Menu</a></div>
            </div>

            <div class="div-wrapper">
                <div class="div"><a href="/pages/nous-contacter-desktop.html" style="text-decoration:none;color:inherit;">Contact</a></div>
            </div>

            <!-- On ajoute la classe mobile-only ici -->
            <div class="div-wrapper mobile-only">
                <div class="div mobile-auth-link" data-nav="connexion">
                    <a href="/pages/connexion-desktop.html">
                        <span>Connexion</span>
                    </a>
                </div>
            </div>
        </div>
    </nav>
</header>

<main class="main-container">

    <section class="bandeau-1">
        <div class="bandeau-1__content">
            <h2>Cuisine Maison</h2>

            <p>
                pour toutes vos occasions <br>
                Julie &amp; José 25 ans de savoir-faire
            </p>

            <button onclick="window.location.href='/pages/menus-desktop.html'">Découvrez nos Menus</button>
        </div>

        <div class="bandeau-1__image">
            <img src="/assets/images/fond-hero-scene.jpg" alt="Présentation de plats Vite &amp; Gourmand">
        </div>
    </section>

    <section class="bandeau-2">
        <div class="bandeau-2__title">
            <h2>Notre mission : transformer chaque repas en expérience unique.</h2>
        </div>

        <div class="bandeau-2__content">
            <div class="bandeau-2__image">
                <img src="/assets/images/chef-domicile.png" alt="Chef à domicile Vite &amp; Gourmand">
            </div>

            <div class="bandeau-2__text">
                <p>
                    Depuis 25 ans, Vite &amp; Gourmand, fondé par Julie et José, accompagne vos événements avec passion et savoir-faire.<br><br>

                    Basée à Bordeaux, notre entreprise propose des menus variés et adaptés à toutes les occasions : repas en famille, événements professionnels, fêtes de fin d’année ou célébrations spéciales.<br><br>

                    Nous mettons un point d’honneur à offrir une cuisine de qualité, alliant produits soigneusement sélectionnés, créativité et convivialité, pour faire de chaque moment un souvenir inoubliable.
                </p>
            </div>
        </div>
    </section>

    <section class="bandeau-3">
        <div class="bandeau-3__item">
            <div class="bandeau-3__image">
                <img src="/assets/images/chapeau-cuisine.jpg" alt="Équipe qualifiée">
            </div>
            <p>Équipe qualifiée</p>
        </div>

        <div class="bandeau-3__item">
            <div class="bandeau-3__image">
                <img src="/assets/images/produits-locaux.jpg" alt="Produits frais et locaux">
            </div>
            <p>Produits frais et locaux</p>
        </div>

        <div class="bandeau-3__item">
            <div class="bandeau-3__image">
                <img src="/assets/images/logo-faitmaison.jpg" alt="Fait maison">
            </div>
            <p>Fait maison</p>
        </div>
    </section>

    <section class="bandeau-4">
        <div class="bandeau-4__item">
            <img src="/assets/images/im1 - salade.jpg" alt="Salade">
        </div>

        <div class="bandeau-4__item">
            <img src="/assets/images/im3 - chapon de noel.jpg" alt="Chapon de Noël">
        </div>

        <div class="bandeau-4__item">
            <img src="/assets/images/im4 - fondant chocolat.jpg" alt="Fondant au chocolat">
        </div>

        <div class="bandeau-4__item">
            <img src="/assets/images/assortiments-2.jpg" alt="Assortiments">
        </div>

        <div class="bandeau-4__item">
            <img src="/assets/images/salle-des-fêtes.jpg" alt="Salle des fêtes">
        </div>

        <div class="bandeau-4__item">
            <img src="/assets/images/chef-cuisinier.png" alt="Chef cuisinier">
        </div>
    </section>

    <section class="bandeau-5">
        <h2 class="bandeau-5__title">Prêt à passer commande ?</h2>

        <p class="bandeau-5__text">
            Consultez nos menus et organisez votre événement en toute simplicité.
        </p>

        <button class="bandeau-5__button" onclick="window.location.href='/pages/menus-desktop.html'">
            Commander maintenant
        </button>
    </section>

    <section class="bandeau-6">

        <h2 class="bandeau-6__title">Avis de nos clients</h2>

        <div class="avis-slider">
            <button class="avis-nav avis-nav--prev" type="button">&#10094;</button>

            <div class="bandeau-6__cards">

                <article class="avis-client active">
                    <div class="stars">
                        <img src="/assets/star-fill.svg" alt="étoile">
                        <img src="/assets/star-fill.svg" alt="étoile">
                        <img src="/assets/star-fill.svg" alt="étoile">
                        <img src="/assets/star-fill.svg" alt="étoile">
                        <img src="/assets/star-fill.svg" alt="étoile">
                    </div>

                    <p class="avis-texte">
                        <strong>Marie Dupont</strong>
                        Nous avons fait appel à Vite &amp; Gourmand
                        pour un anniversaire et tout était parfait.
                        Les plats étaient délicieux, bien présentés
                        et livrés à l’heure. Nos invités ont adoré !
                    </p>
                </article>

                <article class="avis-client">
                    <div class="stars">
                        <img src="/assets/star-fill.svg" alt="étoile">
                        <img src="/assets/star-fill.svg" alt="étoile">
                        <img src="/assets/star-fill.svg" alt="étoile">
                        <img src="/assets/star-fill.svg" alt="étoile">
                        <img src="/assets/star-fill.svg" alt="étoile">
                    </div>

                    <p class="avis-texte">
                        <strong>Sophie Bernard</strong>
                        Une excellente expérience ! Les produits sont
                        frais, les saveurs au rendez-vous et l’équipe
                        est très à l’écoute. Nous referons appel à eux
                        avec plaisir.
                    </p>
                </article>

                <article class="avis-client">
                    <div class="stars">
                        <img src="/assets/star-fill.svg" alt="étoile">
                        <img src="/assets/star-fill.svg" alt="étoile">
                        <img src="/assets/star-fill.svg" alt="étoile">
                        <img src="/assets/star-fill.svg" alt="étoile">
                        <img src="/assets/star-fill.svg" alt="étoile">
                    </div>

                    <p class="avis-texte">
                        <strong>Martin Johnson</strong>
                        Une prestation de grande qualité pour un
                        événement professionnel. Le service était
                        impeccable et les menus variés ont su
                        satisfaire tout le monde. Je recommande sans hésiter.
                    </p>
                </article>

            </div>

            <button class="avis-nav avis-nav--next" type="button">&#10095;</button>
        </div>

    </section>

</main>

<footer class="footer">

    <div class="footer-container">

        <div class="footer-block">
            <h3>Infos entreprise</h3>
            <p>
                Vite &amp; Gourmand,<br>
                Julie &amp; José, 33000 Bordeaux
            </p>
        </div>

        <div class="footer-block">
            <h3>Navigation</h3>
            <ul>
                <li><a href="/index.php" style="text-decoration:none;color:inherit;">Accueil</a></li>
                <li><a href="/pages/menus-desktop.html" style="text-decoration:none;color:inherit;">Menus</a></li>
                <li><a href="/pages/nous-contacter-desktop.html" style="text-decoration:none;color:inherit;">Contact</a></li>
                <li><a href="/pages/connexion-desktop.html" style="text-decoration:none;color:inherit;">Connexion</a></li>
            </ul>
        </div>

        <div class="footer-block">
            <h3>Horaires</h3>
            <p>Lundi - Dimanche : 9h - 19h</p>
            <p>☎ 05 56 87 42 13</p>
        </div>

    </div>

    <small class="footer-legal">
        Mentions légales | CGV | © <?= date('Y') ?> Vite &amp; Gourmand
    </small>

</footer>

</body>
</html>