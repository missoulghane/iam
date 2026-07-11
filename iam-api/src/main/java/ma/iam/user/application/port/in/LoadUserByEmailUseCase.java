package ma.iam.user.application.port.in;

import java.util.Optional;

import ma.iam.shared.domain.valueobject.EmailVO;
import ma.iam.user.domain.model.User;

/**
 * Public entry point used by the auth feature (infrastructure/security layer) to load
 * account credentials during authentication. Cross-feature access must go through a
 * port-in use case, never through the user repository directly.
 */
public interface LoadUserByEmailUseCase {

    Optional<User> loadByEmail(EmailVO email);
}
