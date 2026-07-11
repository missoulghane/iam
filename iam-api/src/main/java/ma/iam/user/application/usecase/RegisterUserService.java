package ma.iam.user.application.usecase;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import ma.iam.shared.application.port.out.EmailSenderPort;
import ma.iam.shared.application.port.out.PasswordEncoderPort;
import ma.iam.shared.domain.valueobject.HashedPassword;
import ma.iam.user.application.command.RegisterUserCommand;
import ma.iam.user.application.port.in.RegisterUserUseCase;
import ma.iam.user.domain.exception.EmailAlreadyUsedException;
import ma.iam.user.domain.model.User;
import ma.iam.user.domain.model.VerificationToken;
import ma.iam.user.domain.repository.UserRepository;
import ma.iam.user.domain.repository.VerificationTokenRepository;
import ma.iam.user.domain.service.VerificationTokenGenerator;
import ma.iam.user.domain.valueobject.UserId;

@Component
public class RegisterUserService implements RegisterUserUseCase {

    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordEncoderPort passwordEncoderPort;
    private final EmailSenderPort emailSenderPort;
    private final VerificationTokenGenerator tokenGenerator;
    private final VerificationEmailComposer emailComposer;
    private final Clock clock;
    private final Duration verificationTokenTtl;

    public RegisterUserService(UserRepository userRepository,
                                VerificationTokenRepository verificationTokenRepository,
                                PasswordEncoderPort passwordEncoderPort,
                                EmailSenderPort emailSenderPort,
                                VerificationTokenGenerator tokenGenerator,
                                VerificationEmailComposer emailComposer,
                                Clock clock,
                                @Value("${iam.mail.verification-token-ttl-hours}") long verificationTokenTtlHours) {
        this.userRepository = userRepository;
        this.verificationTokenRepository = verificationTokenRepository;
        this.passwordEncoderPort = passwordEncoderPort;
        this.emailSenderPort = emailSenderPort;
        this.tokenGenerator = tokenGenerator;
        this.emailComposer = emailComposer;
        this.clock = clock;
        this.verificationTokenTtl = Duration.ofHours(verificationTokenTtlHours);
    }

    @Override
    @Transactional
    public UserId register(RegisterUserCommand command) {
        if (userRepository.existsByEmail(command.email())) {
            throw new EmailAlreadyUsedException(command.email().value());
        }
        HashedPassword hashedPassword = passwordEncoderPort.encode(command.password());
        User user = User.register(UserId.newId(), command.email(), hashedPassword, command.firstName(), command.lastName());
        User savedUser = userRepository.save(user);

        String rawToken = tokenGenerator.generate();
        Instant expiresAt = clock.instant().plus(verificationTokenTtl);
        VerificationToken verificationToken = VerificationToken.issue(savedUser.getId(), rawToken, expiresAt);
        verificationTokenRepository.save(verificationToken);

        emailSenderPort.send(savedUser.getEmail(), emailComposer.subject(), emailComposer.htmlBody(rawToken));
        return savedUser.getId();
    }
}
