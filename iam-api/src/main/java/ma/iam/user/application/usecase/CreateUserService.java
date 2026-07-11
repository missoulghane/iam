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
import ma.iam.shared.domain.valueobject.RawPassword;
import ma.iam.user.application.command.CreateUserCommand;
import ma.iam.user.application.port.in.CreateUserUseCase;
import ma.iam.user.domain.exception.EmailAlreadyUsedException;
import ma.iam.user.domain.model.User;
import ma.iam.user.domain.model.VerificationToken;
import ma.iam.user.domain.repository.UserRepository;
import ma.iam.user.domain.repository.VerificationTokenRepository;
import ma.iam.user.domain.service.VerificationTokenGenerator;
import ma.iam.user.domain.valueobject.UserId;

/**
 * Admin-triggered account creation: the account starts unverified, with a
 * random, never-disclosed placeholder password, and the invited user receives
 * an activation email through which they choose their own password (see
 * ActivateAccountService) - mirroring the public self-registration flow's use
 * of a single-use VerificationToken.
 */
@Component
public class CreateUserService implements CreateUserUseCase {

    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordEncoderPort passwordEncoderPort;
    private final EmailSenderPort emailSenderPort;
    private final VerificationTokenGenerator tokenGenerator;
    private final AccountActivationEmailComposer emailComposer;
    private final Clock clock;
    private final Duration verificationTokenTtl;

    public CreateUserService(UserRepository userRepository,
                              VerificationTokenRepository verificationTokenRepository,
                              PasswordEncoderPort passwordEncoderPort,
                              EmailSenderPort emailSenderPort,
                              VerificationTokenGenerator tokenGenerator,
                              AccountActivationEmailComposer emailComposer,
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
    public UserId create(CreateUserCommand command) {
        if (userRepository.existsByEmail(command.email())) {
            throw new EmailAlreadyUsedException(command.email().value());
        }
        HashedPassword placeholderPassword = passwordEncoderPort.encode(RawPassword.of(tokenGenerator.generate()));
        User user = User.registerByAdmin(UserId.newId(), command.email(), placeholderPassword,
                command.firstName(), command.lastName());
        User savedUser = userRepository.save(user);

        String rawToken = tokenGenerator.generate();
        Instant expiresAt = clock.instant().plus(verificationTokenTtl);
        VerificationToken activationToken = VerificationToken.issue(savedUser.getId(), rawToken, expiresAt);
        verificationTokenRepository.save(activationToken);

        emailSenderPort.send(savedUser.getEmail(), emailComposer.subject(), emailComposer.htmlBody(rawToken));
        return savedUser.getId();
    }
}
