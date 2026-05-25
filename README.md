# ci-cd-ynov

Projet React de démonstration d'une pipeline CI/CD complète avec GitHub Actions, déploiement automatique sur GitHub Pages, couverture de tests via Codecov et documentation générée avec JSDoc.

## Pré-requis

- Node.js 20.x
- npm

## Installation

    npm ci

## Lancer l'application en développement

    npm start

L'application est servie sur http://localhost:3000.

## Lancer les tests

    npm test

Cette commande exécute Jest avec génération du rapport de couverture.

## Générer la documentation

    npm run jsdoc

La documentation est générée dans le dossier public/docs.

## Déploiement

Le déploiement sur GitHub Pages est automatique à chaque push sur la branche master, via le workflow GitHub Actions.

Application en ligne : https://Spyke183.github.io/ci-cd-ynov/
