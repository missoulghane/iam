package ma.iam.user.application.usecase;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import ma.iam.shared.domain.valueobject.EmailVO;
import ma.iam.shared.domain.valueobject.HashedPassword;
import ma.iam.user.domain.exception.UserNotFoundException;
import ma.iam.user.domain.model.User;
import ma.iam.user.domain.repository.UserRepository;
import ma.iam.user.domain.valueobject.UserId;

@ExtendWith(MockitoExtension.class)
class OverwritePasswordServiceTest {

    @Mock
    private UserRepository userRepository;

    @Test
    void overwrites_the_password_without_checking_the_previous_one() {
        UserId userId = UserId.newId();
        User user = User.register(userId, EmailVO.of("a@b.com"), HashedPassword.of("old-hash"), "Jane", "Doe");
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        new OverwritePasswordService(userRepository).overwritePassword(userId, HashedPassword.of("new-hash"));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertThat(captor.getValue().getPassword().value()).isEqualTo("new-hash");
    }

    @Test
    void unknown_user_is_rejected() {
        UserId userId = UserId.newId();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> new OverwritePasswordService(userRepository).overwritePassword(userId, HashedPassword.of("new-hash")))
                .isInstanceOf(UserNotFoundException.class);
    }
}
