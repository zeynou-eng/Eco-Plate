CREATE DATABASE IF NOT EXISTS ecoplate_db CHARACTER SET utf8mb4;
USE ecoplate_db;
CREATE TABLE IF NOT EXISTS aliment (
  id_aliment INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  quantite INT NOT NULL,
  date_peremption DATE,
  statut VARCHAR(20) DEFAULT 'available'
);
CREATE TABLE IF NOT EXISTS recette (
  id_recette INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  description TEXT
);
CREATE TABLE IF NOT EXISTS ingredient (
  id_ingredient INT AUTO_INCREMENT PRIMARY KEY,
  id_recette INT,
  nom VARCHAR(100) NOT NULL,
  FOREIGN KEY (id_recette) REFERENCES recette(id_recette) ON DELETE CASCADE
);
INSERT INTO aliment (nom, quantite, date_peremption) VALUES
('Tomatoes',3,CURDATE() + INTERVAL 2 DAY),('Eggs',6,CURDATE() + INTERVAL 10 DAY),('Milk',1,CURDATE() + INTERVAL 1 DAY);
INSERT INTO recette (nom, description) VALUES
('Tomato Omelette','Une omelette rapide aux tomates.'),
('Vegetable Soup','Une soupe chaude de légumes.'),
('Vegetable Pasta','Des pâtes avec légumes de saison.'),
('Bread Pudding','Un dessert anti-gaspi avec du pain rassis.');
INSERT INTO ingredient (id_recette, nom) VALUES
(1,'Tomatoes'),(1,'Eggs'),(2,'Carrots'),(2,'Potatoes'),(3,'Pasta'),(3,'Tomatoes'),(4,'Bread'),(4,'Milk'),(4,'Eggs');
