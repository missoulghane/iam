package ma.iam.user.infrastructure.security;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import ma.iam.shared.application.port.out.PasswordEncoderPort;
import ma.iam.shared.domain.valueobject.HashedPassword;
import ma.iam.shared.domain.valueobject.RawPassword;

@Component
public class BcryptPasswordEncoderAdapter implements PasswordEncoderPort {

    private final PasswordEncoder passwordEncoder;

    public BcryptPasswordEncoderAdapter(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public HashedPassword encode(RawPassword rawPassword) {
        return HashedPassword.of(passwordEncoder.encode(rawPassword.value()));
    }

    @Override
    public boolean matches(RawPassword rawPassword, HashedPassword hashedPassword) {
        return passwordEncoder.matches(rawPassword.value(), hashedPassword.value());
    }
}
