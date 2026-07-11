package ma.iam.shared.application.port.out;

import ma.iam.shared.domain.valueobject.HashedPassword;
import ma.iam.shared.domain.valueobject.RawPassword;

/**
 * Outbound port hiding the concrete password hashing algorithm from the domain/application layers.
 */
public interface PasswordEncoderPort {

    HashedPassword encode(RawPassword rawPassword);

    boolean matches(RawPassword rawPassword, HashedPassword hashedPassword);
}
