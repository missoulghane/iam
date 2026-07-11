package ma.iam.auth.application.port.out;

import ma.iam.auth.application.dto.AuthenticatedPrincipal;
import ma.iam.shared.domain.valueobject.EmailVO;
import ma.iam.shared.domain.valueobject.RawPassword;

/**
 * Bridge to Spring Security: verifies credentials and reports back the authenticated
 * principal's id and authorities. Throws UnauthorizedException on bad credentials or
 * an unverified account.
 */
public interface AuthenticationPort {

    AuthenticatedPrincipal authenticate(EmailVO email, RawPassword rawPassword);
}
