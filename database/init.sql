-- Création de la table Catégories
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

-- Création de la table Menus
CREATE TABLE menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categorie_id INT,
    titre VARCHAR(150) NOT NULL,
    prix DECIMAL(10, 2) NOT NULL,
    description TEXT,
    stock INT DEFAULT 0,
    FOREIGN KEY (categorie_id) REFERENCES categories(id)
);

-- Création de la table Utilisateurs
CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('client', 'employe', 'admin') DEFAULT 'client',
    disponible BOOLEAN DEFAULT TRUE
);

-- 1. Insertion des catégories
INSERT INTO categories (nom) VALUES 
('Classiques'), 
('Evènements'), 
('Saisonniers'), 
('Végétariens');

-- 2. Insertion des menus (en utilisant les IDs des catégories créées juste au-dessus)
-- On utilise (SELECT id FROM categories WHERE nom = '...') pour être sûr d'avoir le bon ID
INSERT INTO menus (categorie_id, titre, prix, description, stock) VALUES
-- CLASSIQUES
((SELECT id FROM categories WHERE nom = 'Classiques'), 'Poulet à la crème', 13.90, 'Poulet tendre avec sa sauce crème onctueuse', 20),
((SELECT id FROM categories WHERE nom = 'Classiques'), 'Cabillaud à la provençale', 14.90, 'Filet de cabillaud aux herbes et tomates', 15),
((SELECT id FROM categories WHERE nom = 'Classiques'), 'Ragoût de bœuf', 12.90, 'Bœuf mijoté aux carottes et vin rouge', 15),
((SELECT id FROM categories WHERE nom = 'Classiques'), 'Poulet à la moutarde', 13.90, 'Émincé de poulet sauce moutarde à l''ancienne', 20),

-- ÉVÈNEMENTS
((SELECT id FROM categories WHERE nom = 'Evènements'), 'Classique Entreprises', 16.90, 'Plateau idéal pour vos réunions', 50),
((SELECT id FROM categories WHERE nom = 'Evènements'), 'Spécial Noël', 15.90, 'Saveurs festives de fin d''année', 30),
((SELECT id FROM categories WHERE nom = 'Evènements'), 'Banquet végétarien', 14.90, 'Buffet complet sans viande ni poisson', 25),
((SELECT id FROM categories WHERE nom = 'Evènements'), 'Banquet montagnard', 18.90, 'Spécialités de nos montagnes', 25),

-- SAISONNIERS
((SELECT id FROM categories WHERE nom = 'Saisonniers'), 'Saumon printanier', 18.90, 'Pavé de saumon et petits légumes verts', 12),
((SELECT id FROM categories WHERE nom = 'Saisonniers'), 'Escalope d’automne', 16.90, 'Veau aux champignons des bois', 12),
((SELECT id FROM categories WHERE nom = 'Saisonniers'), 'Poisson à la moutarde', 14.90, 'Poisson blanc et sauce fine moutardée', 12),
((SELECT id FROM categories WHERE nom = 'Saisonniers'), 'Rôti aux légumes', 17.90, 'Rôti de porc et ses légumes de saison', 12),

-- VÉGÉTARIENS
((SELECT id FROM categories WHERE nom = 'Végétariens'), 'Assiette crudités', 12.90, 'Fraîcheur et croquant de saison', 20),
((SELECT id FROM categories WHERE nom = 'Végétariens'), 'Raviolis aux légumes', 14.90, 'Pâtes fraîches farcies aux légumes du soleil', 18),
((SELECT id FROM categories WHERE nom = 'Végétariens'), 'Pavé de légumes proteiné', 18.90, 'Alternative végétale complète et gourmande', 15),
((SELECT id FROM categories WHERE nom = 'Végétariens'), 'Soupe de potimarron', 12.90, 'Onctueux velouté de saison', 20);

-- 3. Un utilisateur de test pour vérifier ton auth.js
INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES 
('Julie Test', 'julie@exemple.com', 'password123', 'client');

-- Table pour stocker les commandes globales
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date_commande DATETIME DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('En préparation', 'Prêt', 'Livré') DEFAULT 'En préparation',
    total DECIMAL(10, 2) NOT NULL
);

-- Table de liaison (pour savoir quel menu est dans quelle commande)
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    menu_id INT,
    quantite INT DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (menu_id) REFERENCES menus(id)
);