-- =========================================================================
-- user feature: default root account, created on first install
-- =========================================================================
-- Password hash below is BCrypt("iam@root/2026"), generated with the same
-- algorithm/strength as ma.iam.shared.infrastructure.configuration.PasswordEncoderConfiguration.
INSERT INTO app_user (id, email, password_hash, first_name, last_name, verified, created_date, last_modified_date, version)
VALUES (
    '402888b2-2370-4c5e-aba6-985da776bb17',
    'admin@iam.ma',
    '$2y$10$lX.1MG7sstLRQVOXXF0SruxPiT.USXqTBZqmHAz.OO1dCZ9RTSMEO',
    'IAM',
    'Root',
    TRUE,
    now(),
    now(),
    0
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO user_role (user_id, role)
VALUES ('402888b2-2370-4c5e-aba6-985da776bb17', 'ROLE_MASTER'),
       ('402888b2-2370-4c5e-aba6-985da776bb17', 'ROLE_ADMIN')
ON CONFLICT DO NOTHING;
