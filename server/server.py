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
    """Ouvre une connexion vers la base MySQL du service 'db'."""
    return mysql.connector.connect(
        host="db",
        user="root",
        password=os.environ.get("MYSQL_ROOT_PASSWORD", "root2002"),
        database="ynov_ci",
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
