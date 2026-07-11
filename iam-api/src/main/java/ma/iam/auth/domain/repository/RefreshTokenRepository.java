package ma.iam.auth.domain.repository;

import java.util.Optional;

import ma.iam.auth.domain.model.RefreshToken;

public interface RefreshTokenRepository {

    RefreshToken save(RefreshToken refreshToken);

    Optional<RefreshToken> findByTokenHash(String tokenHash);
}
