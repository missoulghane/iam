package ma.iam.user.application.usecase;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import ma.iam.shared.domain.pagination.Page;
import ma.iam.user.application.dto.UserView;
import ma.iam.user.application.port.in.ListUsersUseCase;
import ma.iam.user.application.query.ListUsersQuery;
import ma.iam.user.domain.repository.UserRepository;

@Component
public class ListUsersService implements ListUsersUseCase {

    private final UserRepository userRepository;

    public ListUsersService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserView> listUsers(ListUsersQuery query) {
        return userRepository.findAll(query.pageRequest(), query.criteria()).map(UserView::from);
    }
}
