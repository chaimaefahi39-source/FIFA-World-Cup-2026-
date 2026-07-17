# 🏆 FIFA World Cup 2026 — Referee Management API

> API REST complète (MVC + Sequelize) pour la gestion des arbitres, matchs et affectations du Mondial 2026, avec **authentification JWT** et **autorisation RBAC**.

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [Lancement](#lancement)
- [Authentification](#authentification)
- [Rôles & RBAC](#rôles--rbac)
- [Matrice des permissions](#matrice-des-permissions)
- [Endpoints API](#endpoints-api)
- [Tester avec Postman](#tester-avec-postman)
- [Structure du projet](#structure-du-projet)

---

## Prérequis

- **Node.js** (v18+)
- **PostgreSQL** (v14+)
- **npm**
- **Postman** (pour les tests)

---

## Installation

```bash
# Cloner le projet
git clone <url-du-repo>
cd referee-api

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env
# Modifier .env avec vos valeurs réelles

# Créer la base de données PostgreSQL
# CREATE DATABASE referee_db;

# Créer l'utilisateur admin initial
npm run seed

# Lancer le serveur en développement
npm run dev
```

---

## Variables d'environnement

Créez un fichier `.env` à la racine du projet (ne jamais le commiter !) :

| Variable | Description | Exemple |
|---|---|---|
| `PORT` | Port du serveur | `3000` |
| `DB_NAME` | Nom de la base de données | `referee_db` |
| `DB_USER` | Utilisateur PostgreSQL | `postgres` |
| `DB_PASSWORD` | Mot de passe PostgreSQL | `votre_mdp` |
| `DB_HOST` | Hôte de la base | `localhost` |
| `DB_PORT` | Port PostgreSQL | `5432` |
| `JWT_SECRET` | Clé secrète pour signer les tokens JWT | `votre_clé_secrète` |
| `JWT_EXPIRES_IN` | Durée de validité du token | `1h` |

> ⚠️ **Le fichier `.env` contient des secrets. Ne le partagez jamais et ne le commitez pas !**  
> Utilisez `.env.example` comme modèle.

---

## Lancement

```bash
# Mode développement (avec hot-reload)
npm run dev

# Mode production
npm start

# Créer l'admin initial
npm run seed
```

---

## Authentification

L'API utilise **JSON Web Tokens (JWT)** pour l'authentification.

### Flux d'authentification

1. **Login** : `POST /api/auth/login` avec `email` + `password`
2. Le serveur vérifie le mot de passe avec `bcrypt.compare`
3. Si valide → génère un JWT contenant `id` et `role` de l'utilisateur
4. Le client renvoie ce token dans le header : `Authorization: Bearer <token>`
5. Le middleware `authenticate` décode et valide le token à chaque requête protégée

### Structure du JWT

```json
{
  "id": 1,
  "role": "admin",
  "email": "admin@reftech.com",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Sécurité des mots de passe

- Les mots de passe sont **hachés avec bcrypt** (salt de 10 rounds) avant stockage
- Le champ `password` n'est **jamais renvoyé** dans les réponses API (exclu via `toJSON()`)
- Les mots de passe ne sont **jamais stockés en clair**

---

## Rôles & RBAC

Le système définit 4 rôles, du plus puissant au plus limité :

| Rôle | Description |
|---|---|
| `admin` | Accès total. Gère les utilisateurs et toutes les ressources. |
| `commissaire` | Gère les arbitres, les matchs et les affectations. |
| `arbitre` | Consulte les arbitres, les matchs et ses affectations (lecture). |
| `consultation` | Lecture seule sur les arbitres et les matchs. |

### Middlewares de sécurité

- **`authenticate`** : Vérifie le token JWT dans le header `Authorization: Bearer <token>`. Renvoie `401` si absent ou invalide.
- **`authorize(...roles)`** : Vérifie que le rôle de l'utilisateur est dans la liste autorisée. Renvoie `403` si non autorisé.

### Distinction 401 vs 403

| Code | Signification | Quand ? |
|---|---|---|
| `401` | Non authentifié | Token absent, expiré ou invalide |
| `403` | Non autorisé (Forbidden) | Authentifié mais rôle insuffisant |

---

## Matrice des permissions

| Endpoint | admin | commissaire | arbitre | consultation |
|---|:---:|:---:|:---:|:---:|
| `POST /api/auth/register` | ✅ | ❌ | ❌ | ❌ |
| `POST /api/auth/login` | 🌍 | 🌍 | 🌍 | 🌍 |
| `GET /api/auth/me` | ✅ | ✅ | ✅ | ✅ |
| `GET /api/arbitres` | ✅ | ✅ | ✅ | ✅ |
| `GET /api/arbitres/:id` | ✅ | ✅ | ✅ | ✅ |
| `POST /api/arbitres` | ✅ | ✅ | ❌ | ❌ |
| `PUT /api/arbitres/:id` | ✅ | ✅ | ❌ | ❌ |
| `DELETE /api/arbitres/:id` | ✅ | ❌ | ❌ | ❌ |
| `GET /api/matchs` | ✅ | ✅ | ✅ | ✅ |
| `GET /api/matchs/:id` | ✅ | ✅ | ✅ | ✅ |
| `POST /api/matchs` | ✅ | ✅ | ❌ | ❌ |
| `PUT /api/matchs/:id` | ✅ | ✅ | ❌ | ❌ |
| `DELETE /api/matchs/:id` | ✅ | ❌ | ❌ | ❌ |
| `POST /api/affectations` | ✅ | ✅ | ❌ | ❌ |
| `DELETE /api/affectations/:id` | ✅ | ✅ | ❌ | ❌ |
| `GET /api/matchs/:id/arbitres` | ✅ | ✅ | ✅ | ✅ |
| `GET /api/arbitres/:id/matchs` | ✅ | ✅ | ✅ | ✅ |

**Légende** : ✅ autorisé · ❌ interdit (403) · 🌍 accessible sans authentification

---

## Endpoints API

### Authentification

| Méthode | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Créer un utilisateur | Admin |
| `POST` | `/api/auth/login` | Se connecter (renvoie un JWT) | Public |
| `GET` | `/api/auth/me` | Profil de l'utilisateur connecté | Tous |

#### POST /api/auth/register

```json
{
  "nom": "Jean Dupont",
  "email": "jean@example.com",
  "password": "motdepasse123",
  "role": "commissaire"
}
```

#### POST /api/auth/login

```json
{
  "email": "admin@reftech.com",
  "password": "admin123"
}
```

**Réponse :**

```json
{
  "message": "Connexion réussie.",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "nom": "Admin RefTech",
    "email": "admin@reftech.com",
    "role": "admin"
  }
}
```

### Arbitres

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/arbitres` | Lister tous les arbitres |
| `GET` | `/api/arbitres/:id` | Détails d'un arbitre |
| `POST` | `/api/arbitres` | Créer un arbitre |
| `PUT` | `/api/arbitres/:id` | Modifier un arbitre |
| `DELETE` | `/api/arbitres/:id` | Supprimer un arbitre |
| `GET` | `/api/arbitres/:id/matchs` | Matchs d'un arbitre |

### Matchs

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/matchs` | Lister tous les matchs |
| `GET` | `/api/matchs/:id` | Détails d'un match |
| `POST` | `/api/matchs` | Créer un match |
| `PUT` | `/api/matchs/:id` | Modifier un match |
| `DELETE` | `/api/matchs/:id` | Supprimer un match |
| `GET` | `/api/matchs/:id/arbitres` | Arbitres d'un match |

### Affectations

| Méthode | Endpoint | Description |
|---|---|---|
| `POST` | `/api/affectations` | Créer une affectation |
| `DELETE` | `/api/affectations/:id` | Supprimer une affectation |

---

## Tester avec Postman

### Configuration

1. Créez une variable d'environnement Postman nommée `token`
2. Après un login réussi, copiez le token de la réponse dans cette variable
3. Dans chaque requête protégée, ajoutez le header :
   ```
   Authorization: Bearer {{token}}
   ```

### Scénarios de test recommandés

#### ✅ Succès
1. **Login admin** → `POST /api/auth/login` → récupérer le token
2. **Register un commissaire** → `POST /api/auth/register` avec token admin
3. **Login commissaire** → vérifier que le nouveau compte fonctionne
4. **Lister les arbitres** → `GET /api/arbitres` avec n'importe quel token
5. **Créer un arbitre** → `POST /api/arbitres` avec token admin ou commissaire
6. **Profil connecté** → `GET /api/auth/me` avec n'importe quel token

#### ❌ Rejets attendus
1. **401 — Sans token** → `GET /api/arbitres` sans header Authorization
2. **401 — Token invalide** → Envoyer un token falsifié
3. **401 — Token expiré** → Attendre l'expiration
4. **403 — Rôle insuffisant** → `DELETE /api/arbitres/1` avec token commissaire
5. **403 — Rôle insuffisant** → `POST /api/arbitres` avec token consultation
6. **403 — Register non admin** → `POST /api/auth/register` avec token non-admin

---

## Structure du projet

```
referee-api/
├── config/
│   └── database.js          # Configuration Sequelize/PostgreSQL
├── controllers/
│   ├── affectation.controller.js
│   ├── arbitre.controller.js
│   ├── auth.controller.js    # Register, Login, Me
│   └── match.controller.js
├── middlewares/
│   ├── auth.middleware.js     # authenticate + authorize (RBAC)
│   ├── error.middleware.js    # Gestion globale des erreurs
│   ├── logger.middleware.js   # Logger des requêtes
│   └── validate.middleware.js # Validation des entrées
├── models/
│   ├── affectation.model.js
│   ├── arbitre.model.js
│   ├── index.js              # Associations Sequelize
│   ├── match.model.js
│   └── user.model.js         # Modèle User (bcrypt + toJSON)
├── routes/
│   ├── affectation.routes.js  # Routes protégées RBAC
│   ├── arbitre.routes.js      # Routes protégées RBAC
│   ├── auth.routes.js         # Routes d'authentification
│   └── match.routes.js        # Routes protégées RBAC
├── seeds/
│   └── admin-seed.js          # Script de création admin initial
├── .env                       # Variables d'environnement (NE PAS COMMITER)
├── .env.example               # Modèle de .env (sans secrets)
├── .gitignore
├── package.json
├── README.md
└── server.js                  # Point d'entrée de l'application
```

---

## Technologies utilisées

- **Express.js** — Framework web
- **Sequelize** — ORM PostgreSQL
- **bcrypt** — Hachage des mots de passe
- **jsonwebtoken** — Génération et vérification des tokens JWT
- **dotenv** — Variables d'environnement
- **PostgreSQL** — Base de données relationnelle

---

## Admin initial

Au premier lancement, exécutez `npm run seed` pour créer l'utilisateur admin :

| Champ | Valeur |
|---|---|
| Email | `admin@reftech.com` |
| Mot de passe | `admin123` |
| Rôle | `admin` |

> ⚠️ **Changez le mot de passe admin en production !**
