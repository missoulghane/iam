# IAM — Docker

Conteneurisation de `iam-web` (React 19 / Vite / TypeScript) et `iam-api` (Spring Boot 4.1 / Java 21 / Maven) avec PostgreSQL 17.

## Architecture

```
iam/
├── iam-web/
│   ├── Dockerfile          # multi-stage: deps → dev / build → runtime (nginx)
│   ├── nginx.conf          # sert le build React + proxy /api vers backend
│   ├── .dockerignore
│   └── .env.example        # config Vite (VITE_*), natif + conteneur dev
├── iam-api/
│   ├── Dockerfile          # multi-stage: deps → build → dev / runtime (jre)
│   ├── .dockerignore
│   └── .env.example        # credentials mail, natif + Docker (source unique)
├── docker-compose.yml           # socle commun (réseau, volumes, healthchecks)
├── docker-compose.override.yml  # dev — auto-chargé, hot-reload, ports exposés
├── docker-compose.prod.yml      # prod — image nginx/jre minimale, port 80 seul exposé
├── .env.example                  # config Docker uniquement (JWT, profil, Postgres, ports)
└── .gitignore
```

**Point clé d'architecture** : 
il n'y a **pas de CORS** côté Spring Boot (`SecurityConfiguration.java`). 
Le conteneur `frontend` (Nginx) sert le build React **et** reverse-proxy `/api/*` vers le conteneur `backend`. 
Le navigateur ne voit donc qu'une seule origine, en dev comme en prod — le backend n'est jamais exposé directement au public.

## Pré-requis

- Docker ≥ 24 (BuildKit activé par défaut)
- Docker Compose v2 (`docker compose`, pas `docker-compose`)

## Installation

```bash
cp .env.example .env
cp iam-api/.env.example iam-api/.env  
cp iam-web/.env.example iam-web/.env
```

Les trois `.env.example` sont copiés systématiquement pour une installation
prévisible (voir [Variables d'environnement](#variables-denvironnement) pour
le détail de qui lit quoi). Docker Compose charge en réalité `.env` **et**
`iam-api/.env` pour le service `backend` — `iam-api/.env.example` reste
la seule source pour les identifiants mail : si un `iam-api/.env` existe
déjà chez vous avec de vraies valeurs, utilisez `cp -n` pour ne pas l'écraser.

Éditez `.env` (racine) :
- `JWT_SECRET` → générez une vraie valeur avec `openssl rand -base64 32`
- `POSTGRES_PASSWORD` → changez-le avant tout déploiement réel

Éditez `iam-api/.env` :
- `MAIL_USERNAME` / `MAIL_PASSWORD` → identifiants SMTP Gmail (utilisez un
  [mot de passe d'application Google](https://myaccount.google.com/apppasswords),
  jamais le mot de passe du compte)

## Démarrage — développement local

```bash
docker compose up --build
```

`docker-compose.override.yml` est fusionné automatiquement (comportement par
défaut de Compose quand aucun `-f` n'est passé) :

| Service  | URL locale              | Détail |
|----------|--------------------------|--------|
| frontend | http://localhost:5173   | Vite dev server, hot-reload sur `./iam-web` monté en volume |
| backend  | http://localhost:8080   | `spring-boot:run`, rebuild d'image nécessaire après un changement de code Java |
| database | localhost:5432           | Postgres, exposé pour un client SQL local |

Le proxy `/api` de Vite pointe vers `http://backend:8080` dans Docker (via la
variable `VITE_PROXY_TARGET`, voir `iam-web/vite.config.ts`), et vers
`http://localhost:8080` par défaut si vous lancez `npm run dev` hors Docker.

> **Hot-reload backend** : le code Java n'est pas recompilé à la volée dans le
> conteneur. Après une modification côté `iam-api`, relancez :
> `docker compose up --build backend`. Grâce au cache BuildKit des
> dépendances Maven, ce rebuild est rapide après le tout premier build.

## Démarrage — production (VPS)

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Ce mode ignore `docker-compose.override.yml` (la liste `-f` explicite
remplace la résolution par défaut de Compose). Seul le port `80` (frontend
Nginx) est publié ; `backend` et `database` ne sont joignables que sur le
réseau Docker interne `iam-network`.

### HTTPS

`docker-compose.prod.yml` publie du HTTP simple sur `:80`. Pour un vrai
déploiement VPS, mettez un reverse-proxy TLS devant (ex. Caddy ou
`nginx` + `certbot` sur l'hôte, ou un service Traefik dédié) qui termine le
TLS et forward vers `frontend:8080` — non inclus ici pour rester scindé de la
stack applicative.

## Commandes utiles

```bash
# Logs en continu
docker compose logs -f
docker compose logs -f backend

# Entrer dans un conteneur
docker exec -it iam-backend-1 sh

# Rebuild sans cache
docker compose build --no-cache

# Arrêt (les volumes persistent)
docker compose down

# Arrêt + suppression des volumes (perte des données Postgres)
docker compose down -v
```

## Variables d'environnement

Principe : chaque secret ne vit que dans **un seul** fichier — celui du
service qui le possède, réutilisé tel quel qu'on soit en natif ou en Docker.
Trois fichiers `.env`, tous copiés à l'installation :

| Fichier | Lu par | Portée |
|---|---|---|
| `.env` (racine) | Docker Compose (`env_file` du service `backend`) — **Docker uniquement**, sans équivalent natif | `POSTGRES_*`, `JWT_SECRET`, `SPRING_PROFILES_ACTIVE`, `APP_*_BASE_URL`, ports |
| `iam-api/.env` | Spring Boot natif (`./mvnw spring-boot:run`, IDE) **et** Docker Compose (`docker-compose.yml` charge ce fichier en plus de `.env` pour le service `backend`) — source unique | `MAIL_*` |
| `iam-web/.env` | Vite natif (`npm run dev`) **et** conteneur `frontend` en dev (monté par `docker-compose.override.yml`) | `VITE_API_BASE_URL` |

`JWT_SECRET`/`SPRING_PROFILES_ACTIVE`/les creds Postgres n'ont pas
d'équivalent natif : le profil `dev` (actif par défaut hors Docker) utilise
H2 en mémoire et n'en a pas besoin — d'où leur présence dans le `.env`
racine uniquement, sans duplication possible avec `iam-api/.env`.

Aucun n'est committé (`.gitignore` racine + `iam-api/.gitignore` les
excluent déjà).

Le backend ne lit **que** des variables d'environnement en prod (profil Spring
`prod`) : `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `MAIL_*`.
Aucun secret en dur dans les Dockerfiles, aucun `.env` copié dans une image —
tout est injecté via `env_file` dans `docker-compose.yml`.

## Dépannage

**Le frontend ne joint pas le backend (`ERR_CONNECTION_REFUSED` sur `/api`)**
→ vérifiez que `backend` est bien `healthy` : `docker compose ps`. En dev, le
backend natif via `spring-boot:run` peut mettre 15-30s à démarrer.

**Erreurs CORS dans la console navigateur**
→ ne devrait jamais arriver avec cette architecture (tout passe par le même
`frontend:8080`/`:80`). Si vous appelez directement `localhost:8080` depuis le
navigateur au lieu de passer par le proxy Nginx/Vite, c'est la cause : utilisez
toujours l'URL du frontend.

**`docker compose up` échoue sur la base de données**
→ `docker compose logs database`. Vérifiez que `POSTGRES_DB/USER/PASSWORD`
dans `.env` correspondent à ceux attendus par `DB_URL` (générés automatiquement
par `docker-compose.yml` à partir des mêmes variables — pas besoin de les
dupliquer).

**Le healthcheck backend échoue en boucle**
→ souvent un problème Flyway (migration en échec) ou de connexion Postgres.
`docker compose logs backend` affichera la stack trace Spring Boot.

**Les identifiants Gmail ne fonctionnent pas**
→ Gmail refuse les mots de passe de compte classiques pour SMTP applicatif.
Générez un [mot de passe d'application](https://myaccount.google.com/apppasswords)
(nécessite la validation en 2 étapes activée sur le compte Google).

## Modifications apportées au code applicatif

- `iam-web/vite.config.ts` : cible du proxy `/api` rendue configurable via
  `VITE_PROXY_TARGET` (au lieu de `localhost:8080` en dur), pour fonctionner
  aussi bien nativement que dans le réseau Docker. `server.host: true` ajouté
  pour que le serveur Vite accepte les connexions depuis l'extérieur du
  conteneur.
- `iam-api/src/main/resources/application.yml` : ajout de
  `server.shutdown: graceful` et `spring.lifecycle.timeout-per-shutdown-phase`
  pour un arrêt propre sur `SIGTERM` (Docker/Kubernetes attendent que les
  requêtes en cours se terminent avant de tuer le conteneur), et
  `management.health.mail.enabled: false` : sans credentials Gmail réels
  (ou en cas d'indisponibilité SMTP), l'indicateur de santé mail faisait
  passer `/actuator/health` à `DOWN` — ce qui bloquait indéfiniment le
  démarrage du frontend en prod (`depends_on: condition: service_healthy`)
  à cause d'un problème d'envoi de mail, sans rapport avec la disponibilité
  réelle de l'API.

Aucune autre modification requise : le profil Spring `prod` externalisait déjà
entièrement sa configuration (datasource, mail, JWT) via variables d'env.

## Vers Kubernetes (si besoin un jour)

- Les images `runtime` (JRE Alpine non-root / Nginx non-root) sont déjà
  adaptées à un `securityContext` restrictif.
- `/actuator/health` est public côté Spring Security — pour des
  liveness/readiness probes k8s séparées, activer
  `management.endpoint.health.probes.enabled=true` et autoriser
  explicitement `/actuator/health/**` (pas seulement `/actuator/health`) dans
  `SecurityConfiguration.java`.
- Remplacer les `Dockerfile` `target: runtime` en images poussées vers un
  registre, et les volumes nommés par des `PersistentVolumeClaim`.

## Test rapide

```bash
cp .env.example .env
cp -n iam-api/.env.example iam-api/.env
cp iam-web/.env.example iam-web/.env
docker compose up --build
```

Puis http://localhost:5173, et `docker compose ps` pour vérifier les healthchecks.
