# AMPUNV - Ancien Meuble Pour Une Nouvelle Vie

## À propos du projet

AMPUNV est une plateforme de vente de meubles d'occasion développée dans le cadre de ma formation de développeur web à **ADA Tech School** à Nantes. 
Le projet vise à donner une seconde vie aux meubles en facilitant leur mise en vente et leur achat.
Il est déployé à cette adresse: https://ampunv.vercel.app/

### Contexte

Projet solo réalisé sur 4 semaines, permettant de mettre en pratique les compétences acquises en développement web full-stack.

## Technologies utilisées

### Frontend
- **React** - Bibliothèque JavaScript pour la construction d'interfaces utilisateur
- **Next.js** - Framework React pour le rendu côté serveur et la génération de sites statiques
- **TypeScript** - Superset typé de JavaScript
- **Tailwind CSS** - Framework CSS utilitaire

### Backend
Le code est disponible ici: https://github.com/DwoDwoS/ampunv_back
Il est déployé sur Render, ce qui fait que lorsque vous lancez l'application vous ne verrez pas de meubles avant plusieurs minutes, le temps que le serveur se réveille. 
Il est possible que des erreurs apparaissent, le projet est en cours d'évolution (pour le meilleur).

### Paiement
- **Stripe** - Gestion des paiements en ligne

## Fonctionnalités principales

### Pour tous les utilisateurs
- ✅ Consultation des annonces de meubles
- ✅ Filtrage des annonces
- ✅ Achat sans création de compte
- ✅ Paiement sécurisé via Stripe

### Pour les vendeurs (compte requis)
- ✅ Création d'annonces de meubles
- ✅ Gestion de ses annonces

### Pour les administrateurs
- ✅ Gestion de la plateforme

## Installation et lancement

```bash
# Cloner le repository
git clone [URL_DU_REPO]

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le site sera accessible sur `http://localhost:3000`

## Variables d'environnement

Créer un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
NEXT_PUBLIC_API_URL=url_de_votre_api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=votre_clé_stripe_publique
```

## Points d'amélioration identifiés

### Priorité haute
- [ ] Refactorisation de certains fichiers pour améliorer la maintenabilité
- [ ] Synchronisation stock/panier : s'assurer que les meubles vendus disparaissent du panier et du stock
- [ ] Amélioration du système de gestion des ventes

### Priorité moyenne
- [ ] Amélioration de la palette de couleurs et de l'identité visuelle
- [ ] Ajout de boutons "retour" dans certaines pages pour améliorer la navigation
- [ ] Ajout du champ "ville" dans les annonces pour faciliter la recherche locale
- [ ] Envoi d'emails de confirmation d'achat

### Fonctionnalités futures
- [ ] Système de messagerie entre acheteurs et vendeurs
- [ ] Système de notation/avis

## Apprentissages clés

Ce projet m'a permis de développer mes compétences en :
- Architecture d'application React/Next.js
- Gestion d'état et de formulaires
- Intégration de solutions de paiement
- Développement TypeScript
- Design responsive avec Tailwind CSS

## Auteur

Développé par moi-même dans le cadre de ma formation développeur web à **ADA Tech School - Nantes**

## Licence

Ce projet est réalisé dans un cadre éducatif.

---

**Note** : Ce projet est en cours de développement et des améliorations sont régulièrement apportées.
