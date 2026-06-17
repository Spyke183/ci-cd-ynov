/**
 * Tests end-to-end du formulaire d'inscription.
 * On vide le localStorage AVANT le chargement de la page pour repartir
 * a chaque test d'un etat sans inscrit.
 */

const remplirFormulaire = ({ lastName, firstName, email, birthDate, city, zipCode }) => {
  cy.get('#lastName').clear().type(lastName);
  cy.get('#firstName').clear().type(firstName);
  cy.get('#email').clear().type(email);
  cy.get('#birthDate').type(birthDate);
  cy.get('#city').clear().type(city);
  cy.get('#zipCode').clear().type(zipCode);
};

const userValide = {
  lastName: 'Dupont',
  firstName: 'Jean',
  email: 'jean@test.com',
  birthDate: '2000-01-01',
  city: 'Paris',
  zipCode: '75001',
};

describe('Formulaire d\'inscription (e2e)', () => {
  beforeEach(() => {
    cy.visit('/', { onBeforeLoad: (win) => win.localStorage.clear() });
  });

  it('la page d\'accueil se charge', () => {
    cy.contains("Formulaire d'inscription");
  });

  it('ajout d\'un utilisateur valide -> 1 inscrit', () => {
    // aucun inscrit au depart
    cy.get('[data-testid=user-item]').should('have.length', 0);

    remplirFormulaire(userValide);
    cy.get('[data-testid=submit-btn]').click();

    // toaster de succes + 1 inscrit affiche
    cy.get('[data-testid=toast]').should('be.visible');
    cy.get('[data-testid=user-item]').should('have.length', 1);
    cy.get('[data-testid=user-item]').should('contain', 'Jean Dupont');
  });

  it('ajout avec une erreur -> toujours le meme nombre d\'inscrits', () => {
    // on cree d'abord 1 inscrit valide
    remplirFormulaire(userValide);
    cy.get('[data-testid=submit-btn]').click();
    cy.get('[data-testid=user-item]').should('have.length', 1);

    // tentative d'ajout avec un email invalide
    remplirFormulaire({
      lastName: 'Martin',
      firstName: 'Marie',
      email: 'pasunemail',
      birthDate: '1998-05-05',
      city: 'Lyon',
      zipCode: '69001',
    });
    cy.get('[data-testid=submit-btn]').click();

    // toaster d'erreur + toujours 1 inscrit
    cy.get('[data-testid=error-toast]').should('be.visible');
    cy.get('[data-testid=user-item]').should('have.length', 1);
  });
});
