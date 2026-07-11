package ma.iam.user.application.usecase;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import ma.iam.shared.application.port.out.EmailSenderPort;
import ma.iam.shared.application.port.out.PasswordEncoderPort;
import ma.iam.shared.domain.valueobject.EmailVO;
import ma.iam.shared.domain.valueobject.HashedPassword;
import ma.iam.user.application.command.CreateUserCommand;
import ma.iam.user.domain.exception.EmailAlreadyUsedException;
import ma.iam.user.domain.model.User;
import ma.iam.user.domain.repository.UserRepository;
import ma.iam.user.domain.repository.VerificationTokenRepository;
import ma.iam.user.domain.service.VerificationTokenGenerator;

@ExtendWith(MockitoExtension.class)
class CreateUserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private VerificationTokenRepository verificationTokenRepository;

    @Mock
    private PasswordEncoderPort passwordEncoderPort;

    @Mock
    private EmailSenderPort emailSenderPort;

    private CreateUserService newService() {
        return new CreateUserService(userRepository, verificationTokenRepository, passwordEncoderPort,
                emailSenderPort, new VerificationTokenGenerator(),
                new AccountActivationEmailComposer("http://localhost/activate-account"),
                Clock.fixed(Instant.EPOCH, ZoneOffset.UTC), 24L);
    }

    @Test
    void creating_a_user_persists_an_unverified_but_enabled_account_and_sends_an_activation_email() {
        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(passwordEncoderPort.encode(any())).thenReturn(HashedPassword.of("hashed"));
        when(userRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        CreateUserCommand command = new CreateUserCommand(EmailVO.of("admin-created@iam.ma"), "Jane", "Doe");

        newService().create(command);

        var captor = org.mockito.ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertThat(captor.getValue().isVerified()).isFalse();
        assertThat(captor.getValue().isEnabled()).isTrue();
        verify(verificationTokenRepository).save(any());
        verify(emailSenderPort).send(any(), any(), any());
    }

    @Test
    void creating_a_user_with_an_already_used_email_is_rejected() {
        when(userRepository.existsByEmail(any())).thenReturn(true);

        CreateUserCommand command = new CreateUserCommand(EmailVO.of("existing@iam.ma"), "Jane", "Doe");

        assertThatThrownBy(() -> newService().create(command)).isInstanceOf(EmailAlreadyUsedException.class);
    }
}
