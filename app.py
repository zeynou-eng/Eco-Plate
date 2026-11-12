import os
import pymysql
from pymysql.cursors import DictCursor
from flask import Flask, jsonify, request, send_from_directory

BASE = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__, static_folder=None)

DB = dict(host=os.getenv('DB_HOST', 'localhost'),
          user=os.getenv('DB_USER', 'root'),
          password=os.getenv('DB_PASSWORD', ''),
          database=os.getenv('DB_NAME', 'ecoplate_db'),
          charset='utf8mb4', cursorclass=DictCursor)

def get_conn():
    return pymysql.connect(**DB)

# ---------- Pages and static files ----------
@app.route('/')
def home():
    return send_from_directory(BASE, 'index.html')

@app.route('/<path:filename>')
def files(filename):
    if filename.split('.')[-1] not in ('html', 'css', 'js', 'png', 'jpg', 'svg'):
        return 'Not found', 404
    return send_from_directory(BASE, filename)

# ---------- API ----------
@app.route('/api/food', methods=['GET'])
def get_food():
    with get_conn() as c, c.cursor() as cur:
        cur.execute("SELECT * FROM aliment WHERE statut='available' ORDER BY date_peremption")
        rows = cur.fetchall()
    for r in rows:
        r['date_peremption'] = r['date_peremption'].isoformat() if r['date_peremption'] else None
    return jsonify(rows)

@app.route('/api/food', methods=['POST'])
def add_food():
    d = request.get_json(force=True, silent=True) or {}
    nom = str(d.get('nom', '')).strip()
    date = d.get('date_peremption')
    try:
        qte = int(d.get('quantite', 0))
    except ValueError:
        qte = 0
    if not nom or qte < 1 or not date:
        return jsonify(error='Champs invalides'), 400
    with get_conn() as c, c.cursor() as cur:
        cur.execute("INSERT INTO aliment (nom, quantite, date_peremption) VALUES (%s,%s,%s)",
                    (nom, qte, date))
        c.commit()
        new_id = cur.lastrowid
    return jsonify(ok=True, id=new_id), 201

@app.route('/api/food/<int:food_id>', methods=['DELETE'])
def delete_food(food_id):
    with get_conn() as c, c.cursor() as cur:
        cur.execute("DELETE FROM aliment WHERE id_aliment=%s", (food_id,))
        c.commit()
    return jsonify(ok=True)

@app.route('/api/recipes', methods=['GET'])
def get_recipes():
    with get_conn() as c, c.cursor() as cur:
        cur.execute("SELECT id_recette, nom, description FROM recette ORDER BY id_recette")
        recipes = cur.fetchall()
        cur.execute("SELECT id_recette, nom FROM ingredient")
        ings = cur.fetchall()
        cur.execute("SELECT nom FROM aliment WHERE statut='available'")
        mine = {r['nom'].strip().lower() for r in cur.fetchall()}
    for r in recipes:
        names = [i['nom'] for i in ings if i['id_recette'] == r['id_recette']]
        r['ingredients'] = names
        r['have'] = [n for n in names if n.lower() in mine]
    return jsonify(recipes)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
