package ma.iam.auth.application.port.out;

import java.util.Optional;

import ma.iam.shared.domain.valueobject.EmailVO;
import ma.iam.shared.domain.valueobject.EntityId;
import ma.iam.shared.domain.valueobject.HashedPassword;

/**
 * Outbound port used by the password-reset flow to resolve an account by email and
 * to overwrite its password. Implemented in auth.infrastructure.adapter by delegating
 * to user's public port-in use cases (LoadUserByEmailUseCase, OverwritePasswordUseCase)
 * - never to user's repository directly (rule 6). The generic {@link EntityId} keeps
 * auth.application fully decoupled from user's own UserId type.
 */
public interface UserAccountPort {

    Optional<EntityId> findIdByEmail(EmailVO email);

    void overwritePassword(EntityId userId, HashedPassword newPassword);
}
