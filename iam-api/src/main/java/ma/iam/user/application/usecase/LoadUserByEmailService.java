package ma.iam.user.application.usecase;

import java.util.Optional;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import ma.iam.shared.domain.valueobject.EmailVO;
import ma.iam.user.application.port.in.LoadUserByEmailUseCase;
import ma.iam.user.domain.model.User;
import ma.iam.user.domain.repository.UserRepository;

@Component
public class LoadUserByEmailService implements LoadUserByEmailUseCase {

    private final UserRepository userRepository;

    public LoadUserByEmailService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> loadByEmail(EmailVO email) {
        return userRepository.findByEmail(email);
    }
}
