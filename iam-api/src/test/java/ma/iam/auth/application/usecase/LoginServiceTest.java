package ma.iam.auth.application.usecase;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import ma.iam.auth.application.command.LoginCommand;
import ma.iam.auth.application.dto.AuthTokens;
import ma.iam.auth.application.dto.AuthenticatedPrincipal;
import ma.iam.auth.application.port.out.AuthenticationPort;
import ma.iam.auth.application.port.out.JwtTokenPort;
import ma.iam.auth.domain.repository.RefreshTokenRepository;
import ma.iam.auth.domain.service.RefreshTokenSecretGenerator;
import ma.iam.shared.domain.valueobject.EmailVO;
import ma.iam.shared.domain.valueobject.EntityId;
import ma.iam.shared.domain.valueobject.RawPassword;

@ExtendWith(MockitoExtension.class)
class LoginServiceTest {

    @Mock
    private AuthenticationPort authenticationPort;

    @Mock
    private JwtTokenPort jwtTokenPort;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Test
    void login_authenticates_then_issues_an_access_and_refresh_token_pair() {
        LoginService service = new LoginService(authenticationPort, jwtTokenPort, refreshTokenRepository,
                new RefreshTokenSecretGenerator(), Clock.fixed(Instant.EPOCH, ZoneOffset.UTC), 3600L);

        EntityId userId = EntityId.newId();
        AuthenticatedPrincipal principal = new AuthenticatedPrincipal(userId, Set.of("ROLE_USER"));
        when(authenticationPort.authenticate(any(), any())).thenReturn(principal);
        when(jwtTokenPort.generateAccessToken(userId, principal.authorities())).thenReturn("access-token");
        when(jwtTokenPort.accessTokenTtlSeconds()).thenReturn(900L);
        when(refreshTokenRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        AuthTokens tokens = service.login(new LoginCommand(EmailVO.of("user@iam.ma"), RawPassword.of("password123")));

        assertThat(tokens.accessToken()).isEqualTo("access-token");
        assertThat(tokens.expiresInSeconds()).isEqualTo(900L);
        assertThat(tokens.refreshToken()).isNotBlank();
        verify(refreshTokenRepository).save(any());
    }
}
