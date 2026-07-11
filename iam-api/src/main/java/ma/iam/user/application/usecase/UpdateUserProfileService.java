package ma.iam.user.application.usecase;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import ma.iam.user.application.command.UpdateUserProfileCommand;
import ma.iam.user.application.dto.UserView;
import ma.iam.user.application.port.in.UpdateUserProfileUseCase;
import ma.iam.user.domain.exception.UserNotFoundException;
import ma.iam.user.domain.model.User;
import ma.iam.user.domain.repository.UserRepository;

@Component
public class UpdateUserProfileService implements UpdateUserProfileUseCase {

    private final UserRepository userRepository;

    public UpdateUserProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public UserView updateProfile(UpdateUserProfileCommand command) {
        User user = userRepository.findById(command.userId())
                .orElseThrow(() -> new UserNotFoundException(command.userId()));
        User updated = userRepository.save(user.withProfile(command.firstName(), command.lastName()));
        return UserView.from(updated);
    }
}
