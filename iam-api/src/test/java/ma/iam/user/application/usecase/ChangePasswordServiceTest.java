package ma.iam.user.application.usecase;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import ma.iam.shared.application.port.out.PasswordEncoderPort;
import ma.iam.shared.domain.valueobject.EmailVO;
import ma.iam.shared.domain.valueobject.HashedPassword;
import ma.iam.shared.domain.valueobject.RawPassword;
import ma.iam.user.application.command.ChangePasswordCommand;
import ma.iam.user.domain.exception.InvalidCurrentPasswordException;
import ma.iam.user.domain.exception.UserNotFoundException;
import ma.iam.user.domain.model.User;
import ma.iam.user.domain.repository.UserRepository;
import ma.iam.user.domain.valueobject.UserId;

@ExtendWith(MockitoExtension.class)
class ChangePasswordServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoderPort passwordEncoderPort;

    @Test
    void wrong_current_password_is_rejected_and_nothing_is_saved() {
        UserId userId = UserId.newId();
        User user = User.register(userId, EmailVO.of("a@b.com"), HashedPassword.of("hashed"), "Jane", "Doe");
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(passwordEncoderPort.matches(any(), any())).thenReturn(false);

        ChangePasswordService service = new ChangePasswordService(userRepository, passwordEncoderPort);
        ChangePasswordCommand command = new ChangePasswordCommand(userId, RawPassword.of("wrongwrongwrong"), RawPassword.of("newpassword1"));

        assertThatThrownBy(() -> service.changePassword(command)).isInstanceOf(InvalidCurrentPasswordException.class);
        verify(userRepository, never()).save(any());
    }

    @Test
    void unknown_user_is_rejected() {
        UserId userId = UserId.newId();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        ChangePasswordService service = new ChangePasswordService(userRepository, passwordEncoderPort);
        ChangePasswordCommand command = new ChangePasswordCommand(userId, RawPassword.of("currentpassword"), RawPassword.of("newpassword1"));

        assertThatThrownBy(() -> service.changePassword(command)).isInstanceOf(UserNotFoundException.class);
    }
}
