import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';

/**
 * Helper : retourne une date YYYY-MM-DD pour un âge donné.
 * @param {number} years - Nombre d'années dans le passé.
 * @return {string} Date au format ISO court.
 */
const dateForAge = (years) => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  return d.toISOString().split('T')[0];
};

/**
 * Helper : remplit le formulaire avec des valeurs valides par défaut.
 * @param {object} overrides - Valeurs à remplacer.
 */
const fillForm = (overrides = {}) => {
  const values = {
    lastName: 'Dupont',
    firstName: 'Jean',
    email: 'jean@test.com',
    birthDate: dateForAge(20),
    city: 'Paris',
    zipCode: '75001',
    ...overrides
  };
  fireEvent.change(screen.getByLabelText('Nom'), { target: { name: 'lastName', value: values.lastName } });
  fireEvent.change(screen.getByLabelText('Prénom'), { target: { name: 'firstName', value: values.firstName } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { name: 'email', value: values.email } });
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { name: 'birthDate', value: values.birthDate } });
  fireEvent.change(screen.getByLabelText('Ville'), { target: { name: 'city', value: values.city } });
  fireEvent.change(screen.getByLabelText('Code postal'), { target: { name: 'zipCode', value: values.zipCode } });
};

beforeEach(() => {
  localStorage.clear();
});

describe('Rendu initial', () => {
  it('affiche le titre du formulaire', () => {
    render(<App />);
    expect(screen.getByText("Formulaire d'inscription")).toBeInTheDocument();
  });

  it('affiche tous les champs', () => {
    render(<App />);
    expect(screen.getByLabelText('Nom')).toBeInTheDocument();
    expect(screen.getByLabelText('Prénom')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Date de naissance')).toBeInTheDocument();
    expect(screen.getByLabelText('Ville')).toBeInTheDocument();
    expect(screen.getByLabelText('Code postal')).toBeInTheDocument();
  });

  it('le bouton est désactivé au chargement', () => {
    render(<App />);
    expect(screen.getByTestId('submit-btn')).toBeDisabled();
  });

  it("n'affiche pas le toaster au chargement", () => {
    render(<App />);
    expect(screen.queryByTestId('toast')).not.toBeInTheDocument();
  });

  it('affiche un titre "Liste des inscrits"', () => {
    render(<App />);
    expect(screen.getByText('Liste des inscrits')).toBeInTheDocument();
  });

  it('charge les inscrits existants depuis localStorage', () => {
    localStorage.setItem('users', JSON.stringify([
      { firstName: 'Marie', lastName: 'Martin', email: 'marie@test.com' }
    ]));
    render(<App />);
    expect(screen.getByTestId('user-item')).toHaveTextContent('Marie Martin - marie@test.com');
  });
});

describe('Validation des champs (erreurs)', () => {
  it('affiche une erreur si le nom contient des chiffres', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('Nom'), { target: { name: 'lastName', value: '123' } });
    expect(screen.getByTestId('error-lastName')).toBeInTheDocument();
  });

  it('affiche une erreur si le prénom contient des caractères spéciaux', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('Prénom'), { target: { name: 'firstName', value: 'Jean!' } });
    expect(screen.getByTestId('error-firstName')).toBeInTheDocument();
  });

  it("affiche une erreur si l'email est invalide", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { name: 'email', value: 'pasunemail' } });
    expect(screen.getByTestId('error-email')).toBeInTheDocument();
  });

  it("affiche une erreur si l'utilisateur a moins de 18 ans", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('Date de naissance'), {
      target: { name: 'birthDate', value: dateForAge(15) }
    });
    expect(screen.getByTestId('error-birthDate')).toBeInTheDocument();
  });

  it('affiche une erreur si la ville contient des chiffres', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('Ville'), { target: { name: 'city', value: 'Paris75' } });
    expect(screen.getByTestId('error-city')).toBeInTheDocument();
  });

  it('affiche une erreur si le code postal a moins de 5 chiffres', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('Code postal'), { target: { name: 'zipCode', value: '750' } });
    expect(screen.getByTestId('error-zipCode')).toBeInTheDocument();
  });

  it("l'erreur disparaît quand le champ devient valide", () => {
    render(<App />);
    const lastName = screen.getByLabelText('Nom');
    fireEvent.change(lastName, { target: { name: 'lastName', value: '123' } });
    expect(screen.getByTestId('error-lastName')).toBeInTheDocument();
    fireEvent.change(lastName, { target: { name: 'lastName', value: 'Dupont' } });
    expect(screen.queryByTestId('error-lastName')).not.toBeInTheDocument();
  });

  it("l'erreur disparaît si on vide le champ", () => {
    render(<App />);
    const email = screen.getByLabelText('Email');
    fireEvent.change(email, { target: { name: 'email', value: 'invalide' } });
    expect(screen.getByTestId('error-email')).toBeInTheDocument();
    fireEvent.change(email, { target: { name: 'email', value: '' } });
    expect(screen.queryByTestId('error-email')).not.toBeInTheDocument();
  });
});

describe('Activation du bouton de soumission', () => {
  it('reste désactivé si un seul champ manque', () => {
    render(<App />);
    fillForm({ zipCode: '' });
    expect(screen.getByTestId('submit-btn')).toBeDisabled();
  });

  it("s'active quand tous les champs sont valides", () => {
    render(<App />);
    fillForm();
    expect(screen.getByTestId('submit-btn')).toBeEnabled();
  });

  it("reste désactivé si l'âge est < 18 ans", () => {
    render(<App />);
    fillForm({ birthDate: dateForAge(15) });
    expect(screen.getByTestId('submit-btn')).toBeDisabled();
  });
});

describe('Soumission du formulaire', () => {
  it('affiche le toaster après une inscription réussie', () => {
    render(<App />);
    fillForm();
    fireEvent.click(screen.getByTestId('submit-btn'));
    expect(screen.getByTestId('toast')).toBeInTheDocument();
    expect(screen.getByTestId('toast')).toHaveTextContent('Inscription réussie');
  });

  it('vide les champs après inscription', () => {
    render(<App />);
    fillForm();
    fireEvent.click(screen.getByTestId('submit-btn'));
    expect(screen.getByLabelText('Nom').value).toBe('');
    expect(screen.getByLabelText('Prénom').value).toBe('');
    expect(screen.getByLabelText('Email').value).toBe('');
    expect(screen.getByLabelText('Ville').value).toBe('');
    expect(screen.getByLabelText('Code postal').value).toBe('');
  });

  it("ajoute l'utilisateur dans la liste affichée", () => {
    render(<App />);
    fillForm();
    fireEvent.click(screen.getByTestId('submit-btn'));
    expect(screen.getByTestId('user-item')).toHaveTextContent('Jean Dupont - jean@test.com');
  });

  it("persiste l'utilisateur dans localStorage", () => {
    render(<App />);
    fillForm();
    fireEvent.click(screen.getByTestId('submit-btn'));
    const stored = JSON.parse(localStorage.getItem('users'));
    expect(stored.length).toBe(1);
    expect(stored[0].email).toBe('jean@test.com');
  });

  it('le toaster disparaît après 3 secondes', () => {
    jest.useFakeTimers();
    render(<App />);
    fillForm();
    fireEvent.click(screen.getByTestId('submit-btn'));
    expect(screen.getByTestId('toast')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.queryByTestId('toast')).not.toBeInTheDocument();
    jest.useRealTimers();
  });

  it("le bouton se redésactive après l'inscription (champs vidés)", () => {
    render(<App />);
    fillForm();
    fireEvent.click(screen.getByTestId('submit-btn'));
    expect(screen.getByTestId('submit-btn')).toBeDisabled();
  });
});
