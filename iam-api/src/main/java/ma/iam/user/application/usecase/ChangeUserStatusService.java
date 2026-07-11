package ma.iam.user.application.usecase;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import ma.iam.user.application.command.ChangeUserStatusCommand;
import ma.iam.user.application.dto.UserView;
import ma.iam.user.application.port.in.ChangeUserStatusUseCase;
import ma.iam.user.domain.exception.UserNotFoundException;
import ma.iam.user.domain.model.User;
import ma.iam.user.domain.repository.UserRepository;

@Component
public class ChangeUserStatusService implements ChangeUserStatusUseCase {

    private final UserRepository userRepository;

    public ChangeUserStatusService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public UserView changeStatus(ChangeUserStatusCommand command) {
        User user = userRepository.findById(command.id())
                .orElseThrow(() -> new UserNotFoundException(command.id()));
        User updated = userRepository.save(command.enabled() ? user.activate() : user.deactivate());
        return UserView.from(updated);
    }
}
