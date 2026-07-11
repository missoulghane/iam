package ma.iam.auth.domain.repository;

import java.util.Optional;

import ma.iam.auth.domain.model.PasswordResetToken;
import ma.iam.shared.domain.valueobject.EntityId;

public interface PasswordResetTokenRepository {

    PasswordResetToken save(PasswordResetToken token);

    Optional<PasswordResetToken> findByToken(String token);

    void deleteByUserId(EntityId userId);
}
