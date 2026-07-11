package ma.iam.user.application.usecase;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import ma.iam.shared.application.port.out.EmailSenderPort;
import ma.iam.user.application.command.ResendAccountActivationCommand;
import ma.iam.user.application.port.in.ResendAccountActivationUseCase;
import ma.iam.user.domain.exception.AccountAlreadyVerifiedException;
import ma.iam.user.domain.exception.UserNotFoundException;
import ma.iam.user.domain.model.User;
import ma.iam.user.domain.model.VerificationToken;
import ma.iam.user.domain.repository.UserRepository;
import ma.iam.user.domain.repository.VerificationTokenRepository;
import ma.iam.user.domain.service.VerificationTokenGenerator;

/**
 * Admin-triggered resend of the activation email (e.g. the original link
 * expired or was lost). Unlike the public self-registration resend, this is
 * explicit and targeted by id, so it is not silent about the account's state:
 * the admin already sees it in their own user list.
 */
@Component
public class ResendAccountActivationService implements ResendAccountActivationUseCase {

    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final EmailSenderPort emailSenderPort;
    private final VerificationTokenGenerator tokenGenerator;
    private final AccountActivationEmailComposer emailComposer;
    private final Clock clock;
    private final Duration verificationTokenTtl;

    public ResendAccountActivationService(UserRepository userRepository,
                                           VerificationTokenRepository verificationTokenRepository,
                                           EmailSenderPort emailSenderPort,
                                           VerificationTokenGenerator tokenGenerator,
                                           AccountActivationEmailComposer emailComposer,
                                           Clock clock,
                                           @Value("${iam.mail.verification-token-ttl-hours}") long verificationTokenTtlHours) {
        this.userRepository = userRepository;
        this.verificationTokenRepository = verificationTokenRepository;
        this.emailSenderPort = emailSenderPort;
        this.tokenGenerator = tokenGenerator;
        this.emailComposer = emailComposer;
        this.clock = clock;
        this.verificationTokenTtl = Duration.ofHours(verificationTokenTtlHours);
    }

    @Override
    @Transactional
    public void resend(ResendAccountActivationCommand command) {
        User user = userRepository.findById(command.id())
                .orElseThrow(() -> new UserNotFoundException(command.id()));
        if (user.isVerified()) {
            throw new AccountAlreadyVerifiedException();
        }
        verificationTokenRepository.deleteByUserId(user.getId());
        String rawToken = tokenGenerator.generate();
        Instant expiresAt = clock.instant().plus(verificationTokenTtl);
        VerificationToken activationToken = VerificationToken.issue(user.getId(), rawToken, expiresAt);
        verificationTokenRepository.save(activationToken);
        emailSenderPort.send(user.getEmail(), emailComposer.subject(), emailComposer.htmlBody(rawToken));
    }
}
