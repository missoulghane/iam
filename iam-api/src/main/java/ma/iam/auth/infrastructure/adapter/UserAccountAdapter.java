package ma.iam.auth.infrastructure.adapter;

import java.util.Optional;

import org.springframework.stereotype.Component;

import ma.iam.auth.application.port.out.UserAccountPort;
import ma.iam.shared.domain.valueobject.EmailVO;
import ma.iam.shared.domain.valueobject.EntityId;
import ma.iam.shared.domain.valueobject.HashedPassword;
import ma.iam.user.application.port.in.LoadUserByEmailUseCase;
import ma.iam.user.application.port.in.OverwritePasswordUseCase;
import ma.iam.user.domain.model.User;
import ma.iam.user.domain.valueobject.UserId;

/**
 * Cross-feature adapter: delegates to user's public port-in use cases
 * (LoadUserByEmailUseCase, OverwritePasswordUseCase), never to user's repository
 * directly (rule 6).
 */
@Component
public class UserAccountAdapter implements UserAccountPort {

    private final LoadUserByEmailUseCase loadUserByEmailUseCase;
    private final OverwritePasswordUseCase overwritePasswordUseCase;

    public UserAccountAdapter(LoadUserByEmailUseCase loadUserByEmailUseCase, OverwritePasswordUseCase overwritePasswordUseCase) {
        this.loadUserByEmailUseCase = loadUserByEmailUseCase;
        this.overwritePasswordUseCase = overwritePasswordUseCase;
    }

    @Override
    public Optional<EntityId> findIdByEmail(EmailVO email) {
        return loadUserByEmailUseCase.loadByEmail(email).map(User::getId).map(id -> EntityId.of(id.asUuid()));
    }

    @Override
    public void overwritePassword(EntityId userId, HashedPassword newPassword) {
        overwritePasswordUseCase.overwritePassword(UserId.of(userId.value()), newPassword);
    }
}
