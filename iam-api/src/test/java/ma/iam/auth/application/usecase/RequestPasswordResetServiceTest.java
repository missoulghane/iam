package ma.iam.auth.application.usecase;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import ma.iam.auth.application.command.RequestPasswordResetCommand;
import ma.iam.auth.application.port.out.UserAccountPort;
import ma.iam.auth.domain.repository.PasswordResetTokenRepository;
import ma.iam.auth.domain.service.PasswordResetTokenGenerator;
import ma.iam.shared.application.port.out.EmailSenderPort;
import ma.iam.shared.domain.valueobject.EmailVO;
import ma.iam.shared.domain.valueobject.EntityId;

@ExtendWith(MockitoExtension.class)
class RequestPasswordResetServiceTest {

    @Mock
    private UserAccountPort userAccountPort;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private EmailSenderPort emailSenderPort;

    private RequestPasswordResetService newService() {
        return new RequestPasswordResetService(userAccountPort, passwordResetTokenRepository, emailSenderPort,
                new PasswordResetTokenGenerator(), new PasswordResetEmailComposer("http://localhost/reset-password"),
                Clock.fixed(Instant.EPOCH, ZoneOffset.UTC), 1L);
    }

    @Test
    void known_email_gets_a_reset_token_and_an_email() {
        EntityId userId = EntityId.newId();
        when(userAccountPort.findIdByEmail(any())).thenReturn(Optional.of(userId));

        newService().requestReset(new RequestPasswordResetCommand(EmailVO.of("known@iam.ma")));

        verify(passwordResetTokenRepository).deleteByUserId(userId);
        verify(passwordResetTokenRepository).save(any());
        verify(emailSenderPort).send(any(), any(), any());
    }

    @Test
    void unknown_email_is_silently_ignored() {
        when(userAccountPort.findIdByEmail(any())).thenReturn(Optional.empty());

        newService().requestReset(new RequestPasswordResetCommand(EmailVO.of("unknown@iam.ma")));

        verify(passwordResetTokenRepository, never()).save(any());
        verify(emailSenderPort, never()).send(any(), any(), any());
    }
}
