-- =========================================================================
-- auth feature: password-reset flow
-- =========================================================================
CREATE TABLE password_reset_token (
    id                  UUID PRIMARY KEY,
    user_id             UUID NOT NULL,
    token               VARCHAR(255) NOT NULL,
    expires_at          TIMESTAMPTZ NOT NULL,
    created_date        TIMESTAMPTZ NOT NULL,
    last_modified_date  TIMESTAMPTZ NOT NULL,
    version             BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uk_password_reset_token_token UNIQUE (token),
    CONSTRAINT fk_password_reset_token_user FOREIGN KEY (user_id) REFERENCES app_user (id) ON DELETE CASCADE
);

CREATE INDEX idx_password_reset_token_user_id ON password_reset_token (user_id);
