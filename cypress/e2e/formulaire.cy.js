/**
 * Tests end-to-end du formulaire d'inscription.
 * On utilise cy.intercept pour simuler l'API : les tests ne dependent pas
 * d'un vrai backend (slide 30 du cours « fonctions mockees »).
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
  lastName: 'Dupont', firstName: 'Jean', email: 'jean@test.com',
  birthDate: '2000-01-01', city: 'Paris', zipCode: '75001',
};

describe("Formulaire d'inscription (e2e)", () => {
  it("la page d'accueil se charge", () => {
    cy.intercept('GET', '**/users', { statusCode: 200, body: { count: 0, users: [] } });
    cy.visit('/');
    cy.contains("Formulaire d'inscription");
  });

  it('ajout d\'un utilisateur valide -> 1 inscrit', () => {
    cy.intercept('GET', '**/users', { statusCode: 200, body: { count: 0, users: [] } });
    cy.intercept('POST', '**/users', { statusCode: 200, body: { id: 1 } }).as('postUser');
    cy.visit('/');
    cy.get('[data-testid=user-item]').should('have.length', 0);

    // Apres l'ajout, le rechargement de la liste renverra 1 inscrit.
    cy.intercept('GET', '**/users', {
      statusCode: 200,
      body: { count: 1, users: [{ id: 1, first_name: 'Jean', last_name: 'Dupont' }] },
    });

    remplirFormulaire(userValide);
    cy.get('[data-testid=submit-btn]').click();

    cy.wait('@postUser');
    cy.get('[data-testid=toast]').should('be.visible');
    cy.get('[data-testid=user-item]').should('have.length', 1);
    cy.get('[data-testid=user-item]').should('contain', 'Jean Dupont');
  });

  it('ajout avec une erreur -> aucun inscrit ajoute', () => {
    cy.intercept('GET', '**/users', { statusCode: 200, body: { count: 0, users: [] } });
    cy.visit('/');
    remplirFormulaire({ ...userValide, email: 'pasunemail' });
    cy.get('[data-testid=submit-btn]').click();
    cy.get('[data-testid=error-toast]').should('be.visible');
    cy.get('[data-testid=user-item]').should('have.length', 0);
  });

  it('connexion admin -> infos privees et suppression', () => {
    cy.intercept('GET', '**/users', { statusCode: 200, body: { count: 0, users: [] } });
    cy.intercept('POST', '**/login', { statusCode: 200, body: { isAdmin: true } });
    cy.intercept('GET', '**/admin/users', {
      statusCode: 200,
      body: { users: [{ id: 5, first_name: 'Marie', last_name: 'Martin', email: 'marie@test.com', birth_date: '1998-01-01', city: 'Lyon', zip_code: '69001' }] },
    });
    cy.intercept('DELETE', '**/users/5', { statusCode: 200, body: { deleted: 5 } }).as('del');

    cy.visit('/');
    cy.get('[data-testid=login-email]').type('loise.fenoll@ynov.com');
    cy.get('[data-testid=login-password]').type('PvdrTAzTeR247sDnAZBr');
    cy.get('[data-testid=login-btn]').click();

    cy.get('[data-testid=admin-panel]').should('exist');
    cy.get('[data-testid=user-item]').should('contain', 'marie@test.com');
    cy.get('[data-testid=delete-btn]').click();
    cy.wait('@del');
  });
});
