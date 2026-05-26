/**
 * Vérifie si un nom, prénom ou ville est valide.
 * Accepte : lettres (a-z, A-Z), accents (À-ÖØ-öø-ÿ), espaces, tirets, apostrophes.
 * Refuse : chiffres, symboles mathématiques (×÷), caractères spéciaux.
 * @param {string} name - La chaîne à valider.
 * @return {boolean} True si valide, false sinon.
 */
export function isValidName(name) {
    return typeof name === 'string'
        && name.trim().length > 0
        && /^[a-zA-ZÀ-ÖØ-öø-ÿ\s\-']+$/.test(name);
}

/**
 * Vérifie si un email est au format valide.
 * @param {string} email - L'email à valider.
 * @return {boolean} True si valide, false sinon.
 */
export function isValidEmail(email) {
    return typeof email === 'string'
        && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Vérifie si la date de naissance correspond à une personne majeure (>= 18 ans).
 * @param {string} date - Date de naissance au format YYYY-MM-DD.
 * @return {boolean} True si majeur, false sinon.
 */
export function isValidBirthDate(date) {
    if (!date || typeof date !== 'string') return false;
    const birthDate = new Date(date);
    if (isNaN(birthDate.getTime())) return false;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age -= 1;
    }
    return age >= 18;
}

/**
 * Vérifie si un code postal est au format français (5 chiffres).
 * @param {string} zip - Le code postal à valider.
 * @return {boolean} True si valide, false sinon.
 */
export function isValidZipCode(zip) {
    return typeof zip === 'string' && /^[0-9]{5}$/.test(zip);
}

/**
 * Vérifie si un nom de ville est valide (mêmes règles que isValidName).
 * @param {string} city - La ville à valider.
 * @return {boolean} True si valide, false sinon.
 */
export function isValidCity(city) {
    return typeof city === 'string'
        && city.trim().length > 0
        && /^[a-zA-ZÀ-ÖØ-öø-ÿ\s\-']+$/.test(city);
}

/**
 * Valide un champ du formulaire par son nom.
 * @param {string} fieldName - Nom du champ (lastName, firstName, email, birthDate, city, zipCode).
 * @param {string} value - Valeur du champ.
 * @return {boolean} True si le champ est valide, false sinon.
 */
export function validateField(fieldName, value) {
    switch (fieldName) {
        case 'lastName':
        case 'firstName':
            return isValidName(value);
        case 'email':
            return isValidEmail(value);
        case 'birthDate':
            return isValidBirthDate(value);
        case 'zipCode':
            return isValidZipCode(value);
        case 'city':
            return isValidCity(value);
        default:
            return false;
    }
}

/**
 * Sauvegarde un utilisateur dans le localStorage.
 * @param {object} user - L'utilisateur à sauvegarder.
 * @return {Array} La liste complète des utilisateurs après ajout.
 */
export function saveUser(user) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    return users;
}

/**
 * Récupère la liste des utilisateurs depuis le localStorage.
 * @return {Array} La liste des utilisateurs (tableau vide si rien).
 */
export function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}
