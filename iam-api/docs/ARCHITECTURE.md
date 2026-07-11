# IAM API — Référence d'architecture

Ce document est la référence à respecter pour **toute génération de code future** dans ce
projet, qu'il s'agisse de modules transverses (`shared`, `auth`, `user`) ou de toute future
feature métier. Toute déviation par rapport aux règles ci-dessous doit être explicitement
signalée et justifiée.

## 1. Modules transverses toujours présents

Chaque génération de ce projet contient systématiquement, avec le même niveau de détail
que les features métier :

- **shared** : primitives transverses (value objects, pagination, exceptions, audit JPA,
  configuration web, transport email générique, gestion d'erreurs globale).
- **auth** : authentification JWT + infrastructure de sécurité pour toute l'application.
  Ne dépend d'aucune feature métier ; les autres features en dépendent (jamais l'inverse).
- **user** : gestion des comptes (inscription, vérification, profil, administration).

## 2. Sens des dépendances

```
web → application → domain ← infrastructure
```

- `domain` ne dépend que du JDK, du code `domain` d'autres packages, et des primitives
  `shared` qui ne sont pas elles-mêmes des frameworks (ex. `shared.exception`,
  `shared.domain.*`).
- Interdiction absolue, sous tout package `**/domain/**`, d'importer :
  `org.springframework.*`, `jakarta.persistence.*`, `tools.jackson.*` (ou `com.fasterxml.jackson.*`),
  `lombok.*`. Vérifié par ArchUnit (le build échoue sinon).
- Lombok est autorisé **uniquement** dans `web` et `infrastructure`. Interdit dans
  `domain` et `application` — vérifié par un test qui scanne les sources à la recherche
  de `import lombok.*` (ArchUnit opère sur le bytecode, insuffisant pour Lombok dont les
  annotations sont `SOURCE`-retention).

## 3. DDD dans le domaine

- Records ou classes finales immuables, factory methods validantes (`of(...)`, `newId()`).
- `equals`/`hashCode` sur la valeur pour tous les value objects.
- Identité entre agrégats via VO d'ID (`UserId`, `RefreshTokenId`, ...), jamais par
  référence objet directe. Chaque VO d'ID **compose** `shared.domain.valueobject.EntityId`
  (un `record` ne peut pas hériter d'une classe : la composition remplace l'héritage).

## 4. Flux command/query

```
Request DTO (web) → Command/Query (application) → UseCase (port in) → Domain
  → Repository Port (port out) → Persistence Adapter → Entity → Domain → Response DTO
```

- Un Request DTO n'atteint jamais un UseCase directement : il est toujours converti en
  Command (écriture) ou Query (lecture) dans le contrôleur.
- Un port `in` par use case (`application/port/in/XxxUseCase`), implémenté par une classe
  du package `application/usecase` (ex. `XxxService implements XxxUseCase`).
- Les ports de type "repository" (persistence d'agrégat) vivent dans
  `domain/repository` ; les autres ports sortants (email, auth bridge, appel à une autre
  feature) vivent dans `application/port/out`.

## 5. Structure d'une feature

Structure identique pour `shared`, `auth`, `user`, et chaque feature métier :

```
{feature}/
  application/
    port/in/        interfaces des use cases
    port/out/        interfaces vers l'infrastructure ou une autre feature
    command/         écritures
    query/           lectures
    dto/             objets applicatifs retournés par les use cases
    usecase/         implémentations des port/in
  domain/
    model/           agrégats et entités du domaine
    valueobject/      value objects spécifiques à la feature
    repository/       ports de persistence des agrégats
    service/          logique de domaine pure sans état applicatif
    exception/         exceptions métier spécifiques à la feature
  infrastructure/
    persistence/       entités JPA + Spring Data repositories
    mapper/             mappers domaine ↔ entité (MapStruct)
    adapter/             implémentations des ports out (repository, cross-feature)
    security/            composants de sécurité spécifiques à la feature
    configuration/        beans de configuration Spring spécifiques à la feature
  web/
    controller/
    request/
    response/
    advice/
```

## 6. Inter-features

- Aucun accès direct au repository d'une autre feature.
- Toute dépendance cross-feature passe par un port out défini côté feature appelante
  (`application/port/out`), implémenté par un adapter en `infrastructure/adapter` qui
  délègue au port `in` (use case) public de la feature cible — jamais à son repository.

## 7. Découpage des controllers

- **Deux controllers** quand les URLs "self" et "admin" diffèrent (ex. `user` :
  `UserMeController` sur `/users/me/*` vs `UserAdminController` sur `/users/{id}`).
  Chaque controller a une politique d'autorisation homogène sur toute la classe.
- **Un seul controller** quand l'URL est partagée entre admin et propriétaire (ex.
  `/{id}` visé par les deux) : autorisation par méthode via
  `@PreAuthorize("hasAuthority('ROLE_ADMIN') or @{feature}Security.isOwner(#id, authentication)")`,
  avec un `@Component` de sécurité dédié par feature en infrastructure.
- Autorisation toujours exprimée avec `hasAuthority('ROLE_...')`, jamais `hasRole(...)`.

## 8. Sécurité JWT (module `auth`)

- Access token : JWT HMAC HS256 (io.jsonwebtoken / JJWT).
- Refresh token : token opaque, haché SHA-256 côté serveur, avec rotation (l'ancien est
  révoqué à chaque `refresh`) et révocation explicite (`logout`).
- `User` (domaine, module `user`) n'implémente **jamais** `UserDetails`. Le pont est
  assuré par `auth.infrastructure.security.UserPrincipal`, qui expose les
  `GrantedAuthority` à partir des `Role` du domaine.

## 9. Versioning API

- Toute l'API est exposée sous `/api/v1`, appliqué globalement par
  `shared.infrastructure.configuration.WebMvcConfiguration` via
  `PathMatchConfigurer.addPathPrefix`, en utilisant la constante
  `shared.web.ApiVersion.V1`.
- Les controllers déclarent leurs `@RequestMapping` sans jamais mentionner ce préfixe.

## 10. Email transverse

- Transport générique : `shared.application.port.out.EmailSenderPort` +
  `shared.infrastructure.email.GmailEmailAdapter` (SMTP). Aucun concept métier ici.
- Composition (sujet + corps HTML) : responsabilité de la feature qui envoie l'email
  (ex. `user` compose l'email de vérification de compte).

## 11. Base de données & Flyway

- Flyway est la source de vérité du schéma en production (PostgreSQL),
  `spring.jpa.hibernate.ddl-auto=validate`.
- Tests `@DataJpaTest` : H2 en mémoire, `ddl-auto=create-drop`, Flyway désactivé.
- Un test Testcontainers (PostgreSQL réel + Flyway activé) valide que les migrations
  s'appliquent proprement et que le schéma réel correspond aux entités JPA.
- `OptimisticLockingFailureException` → HTTP 409 via `GlobalExceptionHandler`
  (`ErrorResponse` standardisé : `status`, `error`, `message`, `path`, `timestamp`).

## 12. Quatre niveaux de tests, pour chaque feature (y compris shared/auth/user)

1. **Unitaires domain/usecase** : JUnit 5 + Mockito, aucune annotation Spring.
2. **Slices web** (`@WebMvcTest`) : mapping HTTP, validation des DTO, gestion des
   erreurs, `@PreAuthorize`.
3. **Slices JPA** (`@DataJpaTest`) : mapping Hibernate, requêtes, adapters de
   persistence.
4. **Intégration** (`@SpringBootTest`) : contexte complet, filtre JWT, scénarios de bout
   en bout.

Plus : **ArchUnit** pour vérifier les règles 2 (sens des dépendances / packages interdits
dans `domain`) et la règle Lombok (scan source), exécuté une fois pour l'ensemble du
projet (`ma.iam.architecture.ArchitectureTest`).

## 13. Convention de nommage résumée

| Couche          | Rôle                                              |
|------------------|----------------------------------------------------|
| `web.request`    | DTO d'entrée HTTP, validés par Bean Validation      |
| `web.response`   | DTO de sortie HTTP                                  |
| `application.command` | Écriture, construite depuis un Request DTO     |
| `application.query`   | Lecture, construite depuis des paramètres HTTP |
| `application.port.in` | Interface d'un use case (1 par use case)       |
| `application.usecase`  | Implémentation d'un port `in`                 |
| `application.port.out` | Interface vers l'infrastructure ou une autre feature |
| `domain.model`   | Agrégats / entités du domaine                       |
| `domain.valueobject` | Value objects spécifiques à la feature          |
| `domain.repository`  | Port out de persistence d'un agrégat           |
| `infrastructure.persistence` | Entité JPA + Spring Data repository     |
| `infrastructure.mapper`      | Mapper domaine ↔ entité (MapStruct)     |
| `infrastructure.adapter`     | Implémentation d'un port out            |

Toute nouvelle feature métier doit répliquer strictement cette structure. Toute
exception à ces règles doit être documentée explicitement dans le code et signalée
dans la revue.
