package ma.iam.user.domain.repository;

import java.util.Optional;

import ma.iam.shared.domain.pagination.Page;
import ma.iam.shared.domain.pagination.PageRequest;
import ma.iam.shared.domain.valueobject.EmailVO;
import ma.iam.user.domain.model.User;
import ma.iam.user.domain.valueobject.UserId;
import ma.iam.user.domain.valueobject.UserSearchCriteria;

public interface UserRepository {

    User save(User user);

    Optional<User> findById(UserId id);

    Optional<User> findByEmail(EmailVO email);

    boolean existsByEmail(EmailVO email);

    Page<User> findAll(PageRequest pageRequest, UserSearchCriteria criteria);

    void deleteById(UserId id);
}
