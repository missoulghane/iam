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
import ma.iam.shared.domain.valueobject.RawPassword;
import ma.iam.user.application.command.RegisterUserCommand;
import ma.iam.user.domain.exception.EmailAlreadyUsedException;
import ma.iam.user.domain.model.User;
import ma.iam.user.domain.repository.UserRepository;
import ma.iam.user.domain.repository.VerificationTokenRepository;
import ma.iam.user.domain.service.VerificationTokenGenerator;

@ExtendWith(MockitoExtension.class)
class RegisterUserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private VerificationTokenRepository verificationTokenRepository;

    @Mock
    private PasswordEncoderPort passwordEncoderPort;

    @Mock
    private EmailSenderPort emailSenderPort;

    private RegisterUserService newService() {
        return new RegisterUserService(userRepository, verificationTokenRepository, passwordEncoderPort,
                emailSenderPort, new VerificationTokenGenerator(), new VerificationEmailComposer("http://localhost/verify"),
                Clock.fixed(Instant.EPOCH, ZoneOffset.UTC), 24L);
    }

    @Test
    void registering_a_new_email_persists_the_user_and_sends_a_verification_email() {
        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(passwordEncoderPort.encode(any())).thenReturn(HashedPassword.of("hashed"));
        when(userRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        RegisterUserCommand command = new RegisterUserCommand(
                EmailVO.of("new@iam.ma"), RawPassword.of("password123"), "Jane", "Doe");

        newService().register(command);

        verify(userRepository).save(any(User.class));
        verify(verificationTokenRepository).save(any());
        verify(emailSenderPort).send(any(), any(), any());
    }

    @Test
    void registering_an_already_used_email_is_rejected() {
        when(userRepository.existsByEmail(any())).thenReturn(true);

        RegisterUserCommand command = new RegisterUserCommand(
                EmailVO.of("existing@iam.ma"), RawPassword.of("password123"), "Jane", "Doe");

        assertThatThrownBy(() -> newService().register(command)).isInstanceOf(EmailAlreadyUsedException.class);
    }

    @Test
    void password_is_hashed_before_persisting_the_user() {
        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(passwordEncoderPort.encode(any())).thenReturn(HashedPassword.of("hashed-value"));
        when(userRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        RegisterUserCommand command = new RegisterUserCommand(
                EmailVO.of("new@iam.ma"), RawPassword.of("password123"), "Jane", "Doe");

        newService().register(command);

        var captor = org.mockito.ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertThat(captor.getValue().getPassword().value()).isEqualTo("hashed-value");
    }
}
