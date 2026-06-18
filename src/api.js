// URL du serveur d'API, construite à partir de la variable d'environnement.
const API_URL = `http://localhost:${process.env.REACT_APP_SERVER_PORT}`;

/**
 * Récupère le nombre d'utilisateurs inscrits depuis l'API.
 * @return {Promise<number>} Le nombre d'utilisateurs.
 */
export async function countUsers() {
  const response = await fetch(`${API_URL}/users`);
  const data = await response.json();
  return data.count;
}
