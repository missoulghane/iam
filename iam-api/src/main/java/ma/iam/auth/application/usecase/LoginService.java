package ma.iam.auth.application.usecase;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import ma.iam.auth.application.command.LoginCommand;
import ma.iam.auth.application.dto.AuthTokens;
import ma.iam.auth.application.dto.AuthenticatedPrincipal;
import ma.iam.auth.application.port.in.LoginUseCase;
import ma.iam.auth.application.port.out.AuthenticationPort;
import ma.iam.auth.application.port.out.JwtTokenPort;
import ma.iam.auth.domain.model.RefreshToken;
import ma.iam.auth.domain.repository.RefreshTokenRepository;
import ma.iam.auth.domain.service.RefreshTokenSecretGenerator;

@Component
public class LoginService implements LoginUseCase {

    private final AuthenticationPort authenticationPort;
    private final JwtTokenPort jwtTokenPort;
    private final RefreshTokenRepository refreshTokenRepository;
    private final RefreshTokenSecretGenerator secretGenerator;
    private final Clock clock;
    private final Duration refreshTokenTtl;

    public LoginService(AuthenticationPort authenticationPort,
                         JwtTokenPort jwtTokenPort,
                         RefreshTokenRepository refreshTokenRepository,
                         RefreshTokenSecretGenerator secretGenerator,
                         Clock clock,
                         @Value("${iam.security.jwt.refresh-token-ttl-seconds}") long refreshTokenTtlSeconds) {
        this.authenticationPort = authenticationPort;
        this.jwtTokenPort = jwtTokenPort;
        this.refreshTokenRepository = refreshTokenRepository;
        this.secretGenerator = secretGenerator;
        this.clock = clock;
        this.refreshTokenTtl = Duration.ofSeconds(refreshTokenTtlSeconds);
    }

    @Override
    @Transactional
    public AuthTokens login(LoginCommand command) {
        AuthenticatedPrincipal principal = authenticationPort.authenticate(command.email(), command.password());

        String accessToken = jwtTokenPort.generateAccessToken(principal.userId(), principal.authorities());

        String rawRefreshToken = secretGenerator.generateOpaqueToken();
        String tokenHash = secretGenerator.hash(rawRefreshToken);
        Instant expiresAt = clock.instant().plus(refreshTokenTtl);
        refreshTokenRepository.save(RefreshToken.issue(principal.userId(), tokenHash, principal.authorities(), expiresAt));

        return new AuthTokens(accessToken, rawRefreshToken, jwtTokenPort.accessTokenTtlSeconds());
    }
}
