package ma.iam.user.application.usecase;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import ma.iam.shared.application.port.out.PasswordEncoderPort;
import ma.iam.shared.domain.valueobject.HashedPassword;
import ma.iam.user.application.command.ChangePasswordCommand;
import ma.iam.user.application.port.in.ChangePasswordUseCase;
import ma.iam.user.domain.exception.InvalidCurrentPasswordException;
import ma.iam.user.domain.exception.UserNotFoundException;
import ma.iam.user.domain.model.User;
import ma.iam.user.domain.repository.UserRepository;

@Component
public class ChangePasswordService implements ChangePasswordUseCase {

    private final UserRepository userRepository;
    private final PasswordEncoderPort passwordEncoderPort;

    public ChangePasswordService(UserRepository userRepository, PasswordEncoderPort passwordEncoderPort) {
        this.userRepository = userRepository;
        this.passwordEncoderPort = passwordEncoderPort;
    }

    @Override
    @Transactional
    public void changePassword(ChangePasswordCommand command) {
        User user = userRepository.findById(command.userId())
                .orElseThrow(() -> new UserNotFoundException(command.userId()));
        if (!passwordEncoderPort.matches(command.currentPassword(), user.getPassword())) {
            throw new InvalidCurrentPasswordException();
        }
        HashedPassword newHashedPassword = passwordEncoderPort.encode(command.newPassword());
        userRepository.save(user.withPassword(newHashedPassword));
    }
}
