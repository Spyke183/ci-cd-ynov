import { useState, useEffect } from 'react';
import './App.css';
import {
  validateField,
  isValidName,
  isValidEmail,
  isValidBirthDate,
  isValidZipCode,
  isValidCity,
  saveUser,
  getUsers
} from './validators';

/**
 * Composant principal : formulaire d'inscription avec validation,
 * sauvegarde localStorage, toasters de succes / erreur et liste des inscrits.
 * @return {JSX.Element} Le composant App.
 */
function App() {
  const [form, setForm] = useState({
    lastName: '',
    firstName: '',
    email: '',
    birthDate: '',
    city: '',
    zipCode: ''
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(false);
  const [errorToast, setErrorToast] = useState(false);
  const [users, setUsers] = useState(getUsers());
  const [dbCount, setDbCount] = useState(null);

  // Recupere le nombre d'utilisateurs en base via l'API (Docker / FastAPI).
  useEffect(() => {
    fetch('http://localhost:8000/users')
      .then((res) => res.json())
      .then((data) => setDbCount(data.count))
      .catch(() => {});
  }, []);

  /**
   * Gere le changement d'un champ et valide en temps reel.
   * @param {Event} e - Evenement de changement de l'input.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (value === '') {
      setErrors((prev) => ({ ...prev, [name]: false }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: !validateField(name, value) }));
    }
  };

  /**
   * Verifie si tous les champs du formulaire sont valides.
   * @return {boolean} True si le formulaire est entierement valide.
   */
  const isFormValid = () =>
    isValidName(form.lastName) &&
    isValidName(form.firstName) &&
    isValidEmail(form.email) &&
    isValidBirthDate(form.birthDate) &&
    isValidCity(form.city) &&
    isValidZipCode(form.zipCode);

  /**
   * Verifie si le formulaire est entierement vide (aucun champ rempli).
   * @return {boolean} True si tous les champs sont vides.
   */
  const isFormEmpty = () =>
    form.lastName === '' &&
    form.firstName === '' &&
    form.email === '' &&
    form.birthDate === '' &&
    form.city === '' &&
    form.zipCode === '';

  /**
   * Soumet le formulaire : sauvegarde si valide (toaster succes),
   * sinon affiche le toaster d'erreur et marque tous les champs invalides.
   */
  const handleSubmit = () => {
    if (!isFormValid()) {
      setErrors({
        lastName: !isValidName(form.lastName),
        firstName: !isValidName(form.firstName),
        email: !isValidEmail(form.email),
        birthDate: !isValidBirthDate(form.birthDate),
        city: !isValidCity(form.city),
        zipCode: !isValidZipCode(form.zipCode)
      });
      setErrorToast(true);
      setTimeout(() => setErrorToast(false), 3000);
      return;
    }
    const updatedUsers = saveUser(form);
    setUsers(updatedUsers);
    setForm({ lastName: '', firstName: '', email: '', birthDate: '', city: '', zipCode: '' });
    setErrors({});
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="app">
      <h1>Formulaire d'inscription</h1>

      <nav style={{ marginBottom: 20 }}>
        <a href="docs/index.html" data-testid="docs-link">
          Voir la documentation
        </a>
      </nav>

      {toast && (
        <div data-testid="toast" role="status" style={{ color: 'green' }}>
          Inscription réussie !
        </div>
      )}

      {errorToast && (
        <div data-testid="error-toast" role="alert" style={{ color: 'red' }}>
          Veuillez corriger les champs en erreur.
        </div>
      )}

      <div>
        <label htmlFor="lastName">Nom</label>
        <input
          id="lastName"
          name="lastName"
          placeholder="Nom"
          value={form.lastName}
          onChange={handleChange}
        />
        {errors.lastName && (
          <span style={{ color: 'red' }} data-testid="error-lastName">
            Nom invalide
          </span>
        )}
      </div>

      <div>
        <label htmlFor="firstName">Prénom</label>
        <input
          id="firstName"
          name="firstName"
          placeholder="Prénom"
          value={form.firstName}
          onChange={handleChange}
        />
        {errors.firstName && (
          <span style={{ color: 'red' }} data-testid="error-firstName">
            Prénom invalide
          </span>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && (
          <span style={{ color: 'red' }} data-testid="error-email">
            Email invalide
          </span>
        )}
      </div>

      <div>
        <label htmlFor="birthDate">Date de naissance</label>
        <input
          id="birthDate"
          name="birthDate"
          type="date"
          value={form.birthDate}
          onChange={handleChange}
        />
        {errors.birthDate && (
          <span style={{ color: 'red' }} data-testid="error-birthDate">
            Vous devez avoir 18 ans minimum
          </span>
        )}
      </div>

      <div>
        <label htmlFor="city">Ville</label>
        <input
          id="city"
          name="city"
          placeholder="Ville"
          value={form.city}
          onChange={handleChange}
        />
        {errors.city && (
          <span style={{ color: 'red' }} data-testid="error-city">
            Ville invalide
          </span>
        )}
      </div>

      <div>
        <label htmlFor="zipCode">Code postal</label>
        <input
          id="zipCode"
          name="zipCode"
          placeholder="Code postal"
          value={form.zipCode}
          onChange={handleChange}
        />
        {errors.zipCode && (
          <span style={{ color: 'red' }} data-testid="error-zipCode">
            Code postal invalide
          </span>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isFormEmpty()}
        data-testid="submit-btn"
      >
        S'inscrire
      </button>

      <h2>Liste des inscrits</h2>
      {dbCount !== null && (
        <p data-testid="db-count">Utilisateurs en base de données : {dbCount}</p>
      )}
      <ul>
        {users.map((u, i) => (
          <li key={i} data-testid="user-item">
            {u.firstName} {u.lastName} - {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
