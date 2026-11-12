# EcoPlate 🌿
*Moins de gaspillage, plus d'avenir.*

Site web pour réduire le gaspillage alimentaire : suivre ses aliments, surveiller les dates de péremption et trouver des recettes.

**Technologies :** HTML, CSS, JavaScript, Python (Flask), MySQL, Docker

## Lancer le projet
Prérequis : Docker et Docker Compose.

```
docker compose up --build
```
Puis ouvrir http://localhost:5000

Pour réinitialiser la base de données : `docker compose down -v` puis relancer.

## Structure
- `app.py` : backend Flask (API + pages)
- `database.sql` : création de la base et données de test
- `*.html`, `css/`, `js/` : interface
- `Dockerfile`, `docker-compose.yml` : environnement

## Équipe
- Personne 1 : frontend
- Personne 2 : backend et base de données
