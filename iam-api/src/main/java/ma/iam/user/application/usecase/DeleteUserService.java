package ma.iam.user.application.usecase;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import ma.iam.user.application.command.DeleteUserCommand;
import ma.iam.user.application.port.in.DeleteUserUseCase;
import ma.iam.user.domain.exception.UserNotFoundException;
import ma.iam.user.domain.repository.UserRepository;

@Component
public class DeleteUserService implements DeleteUserUseCase {

    private final UserRepository userRepository;

    public DeleteUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void delete(DeleteUserCommand command) {
        if (userRepository.findById(command.userId()).isEmpty()) {
            throw new UserNotFoundException(command.userId());
        }
        userRepository.deleteById(command.userId());
    }
}
