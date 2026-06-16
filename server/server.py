from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
import os

app = FastAPI()

# Autorise le front (navigateur) a appeler cette API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_connection():
    """Ouvre une connexion vers la base MySQL (config via variables d'environnement)."""
    return mysql.connector.connect(
        host=os.environ.get("MYSQL_HOST", "db"),
        user=os.environ.get("MYSQL_USER", "root"),
        password=os.environ.get("MYSQL_ROOT_PASSWORD"),
        database=os.environ.get("MYSQL_DATABASE", "ynov_ci"),
    )


@app.get("/users")
def get_users():
    """Renvoie le nombre d'utilisateurs presents dans la table utilisateur."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM utilisateur")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return {"count": len(rows)}
