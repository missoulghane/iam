package ma.iam.user.application.usecase;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import ma.iam.shared.application.port.out.EmailSenderPort;
import ma.iam.user.application.command.ResendVerificationCommand;
import ma.iam.user.application.port.in.ResendVerificationUseCase;
import ma.iam.user.domain.model.VerificationToken;
import ma.iam.user.domain.repository.UserRepository;
import ma.iam.user.domain.repository.VerificationTokenRepository;
import ma.iam.user.domain.service.VerificationTokenGenerator;

/**
 * Intentionally silent when the account does not exist or is already verified: the
 * web layer always answers 202 regardless, so as not to leak account existence.
 */
@Component
public class ResendVerificationService implements ResendVerificationUseCase {

    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final EmailSenderPort emailSenderPort;
    private final VerificationTokenGenerator tokenGenerator;
    private final VerificationEmailComposer emailComposer;
    private final Clock clock;
    private final Duration verificationTokenTtl;

    public ResendVerificationService(UserRepository userRepository,
                                      VerificationTokenRepository verificationTokenRepository,
                                      EmailSenderPort emailSenderPort,
                                      VerificationTokenGenerator tokenGenerator,
                                      VerificationEmailComposer emailComposer,
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
    public void resend(ResendVerificationCommand command) {
        userRepository.findByEmail(command.email())
                .filter(user -> !user.isVerified())
                .ifPresent(user -> {
                    verificationTokenRepository.deleteByUserId(user.getId());
                    String rawToken = tokenGenerator.generate();
                    Instant expiresAt = clock.instant().plus(verificationTokenTtl);
                    VerificationToken verificationToken = VerificationToken.issue(user.getId(), rawToken, expiresAt);
                    verificationTokenRepository.save(verificationToken);
                    emailSenderPort.send(user.getEmail(), emailComposer.subject(), emailComposer.htmlBody(rawToken));
                });
    }
}
