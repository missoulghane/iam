package ma.iam.user.domain.repository;

import java.util.Optional;

import ma.iam.user.domain.model.VerificationToken;
import ma.iam.user.domain.valueobject.UserId;

public interface VerificationTokenRepository {

    VerificationToken save(VerificationToken token);

    Optional<VerificationToken> findByToken(String token);

    void deleteByUserId(UserId userId);
}
