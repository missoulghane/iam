-- Baseline schema for the IAM module: user + auth features.
-- All identifiers are UUIDs assigned application-side (never DB-generated).

-- =========================================================================
-- user feature
-- =========================================================================
CREATE TABLE app_user (
    id                  UUID PRIMARY KEY,
    email               VARCHAR(255) NOT NULL,
    password_hash       VARCHAR(255) NOT NULL,
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100) NOT NULL,
    verified            BOOLEAN NOT NULL DEFAULT FALSE,
    created_date        TIMESTAMPTZ NOT NULL,
    last_modified_date  TIMESTAMPTZ NOT NULL,
    version             BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uk_app_user_email UNIQUE (email)
);

CREATE TABLE user_role (
    user_id UUID NOT NULL,
    role    VARCHAR(50) NOT NULL,
    CONSTRAINT pk_user_role PRIMARY KEY (user_id, role),
    CONSTRAINT fk_user_role_user FOREIGN KEY (user_id) REFERENCES app_user (id) ON DELETE CASCADE
);

CREATE TABLE verification_token (
    id                  UUID PRIMARY KEY,
    user_id             UUID NOT NULL,
    token               VARCHAR(255) NOT NULL,
    expires_at          TIMESTAMPTZ NOT NULL,
    created_date        TIMESTAMPTZ NOT NULL,
    last_modified_date  TIMESTAMPTZ NOT NULL,
    version             BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uk_verification_token_token UNIQUE (token),
    CONSTRAINT fk_verification_token_user FOREIGN KEY (user_id) REFERENCES app_user (id) ON DELETE CASCADE
);

CREATE INDEX idx_verification_token_user_id ON verification_token (user_id);

-- =========================================================================
-- auth feature
-- =========================================================================
CREATE TABLE refresh_token (
    id                  UUID PRIMARY KEY,
    user_id             UUID NOT NULL,
    token_hash          VARCHAR(255) NOT NULL,
    expires_at          TIMESTAMPTZ NOT NULL,
    revoked             BOOLEAN NOT NULL DEFAULT FALSE,
    created_date        TIMESTAMPTZ NOT NULL,
    last_modified_date  TIMESTAMPTZ NOT NULL,
    version             BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uk_refresh_token_token_hash UNIQUE (token_hash)
);

CREATE INDEX idx_refresh_token_user_id ON refresh_token (user_id);

CREATE TABLE refresh_token_authority (
    refresh_token_id UUID NOT NULL,
    authority        VARCHAR(50) NOT NULL,
    CONSTRAINT pk_refresh_token_authority PRIMARY KEY (refresh_token_id, authority),
    CONSTRAINT fk_refresh_token_authority_token FOREIGN KEY (refresh_token_id) REFERENCES refresh_token (id) ON DELETE CASCADE
);
