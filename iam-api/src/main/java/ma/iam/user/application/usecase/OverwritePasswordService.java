package ma.iam.user.application.usecase;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import ma.iam.shared.domain.valueobject.HashedPassword;
import ma.iam.user.application.port.in.OverwritePasswordUseCase;
import ma.iam.user.domain.exception.UserNotFoundException;
import ma.iam.user.domain.model.User;
import ma.iam.user.domain.repository.UserRepository;
import ma.iam.user.domain.valueobject.UserId;

@Component
public class OverwritePasswordService implements OverwritePasswordUseCase {

    private final UserRepository userRepository;

    public OverwritePasswordService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void overwritePassword(UserId userId, HashedPassword newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        userRepository.save(user.withPassword(newPassword));
    }
}
